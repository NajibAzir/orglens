from fastapi import APIRouter, Depends, HTTPException
from database import get_db
import sqlite3
import hashlib
import uuid
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/api/wallet", tags=["wallet"])


class PaymentRequest(BaseModel):
    amount: float
    description: str
    recipient: str


class ReloadRequest(BaseModel):
    employee_id: int
    amount: float


def generate_tx_hash():
    """Generate a realistic Solana transaction hash."""
    h = hashlib.sha256(uuid.uuid4().bytes).hexdigest()
    base58_chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    tx = ''
    for i in range(64):
        idx = int(h[i % len(h)], 16) + i
        tx += base58_chars[idx % len(base58_chars)]
    return tx


@router.get("/{employee_id}")
def get_wallet(employee_id: int, db: sqlite3.Connection = Depends(get_db)):
    """Get wallet details for an employee."""
    wallet = db.execute(
        "SELECT * FROM wallets WHERE employee_id = ?", (employee_id,)
    ).fetchone()

    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    return dict(wallet)


@router.get("/{employee_id}/transactions")
def get_transactions(employee_id: int, limit: int = 20, db: sqlite3.Connection = Depends(get_db)):
    """Get transaction history for an employee wallet."""
    transactions = db.execute(
        "SELECT * FROM wallet_transactions WHERE employee_id = ? ORDER BY created_at DESC LIMIT ?",
        (employee_id, limit)
    ).fetchall()

    return [dict(tx) for tx in transactions]


@router.post("/{employee_id}/pay")
def make_payment(employee_id: int, payment: PaymentRequest, db: sqlite3.Connection = Depends(get_db)):
    """Staff makes a payment from their wallet."""
    wallet = db.execute(
        "SELECT * FROM wallets WHERE employee_id = ?", (employee_id,)
    ).fetchone()

    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    if wallet["balance"] < payment.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    new_balance = round(wallet["balance"] - payment.amount, 2)
    tx_hash = generate_tx_hash()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    db.execute("UPDATE wallets SET balance = ? WHERE employee_id = ?", (new_balance, employee_id))
    db.execute("""
        INSERT INTO wallet_transactions (employee_id, type, amount, description, recipient, tx_hash, created_at)
        VALUES (?, 'payment', ?, ?, ?, ?, ?)
    """, (employee_id, -payment.amount, payment.description, payment.recipient, tx_hash, now))
    db.commit()

    return {
        "status": "success",
        "new_balance": new_balance,
        "tx_hash": tx_hash
    }


@router.post("/reload")
def reload_wallet(reload: ReloadRequest, db: sqlite3.Connection = Depends(get_db)):
    """Admin reloads an employee's wallet."""
    wallet = db.execute(
        "SELECT * FROM wallets WHERE employee_id = ?", (reload.employee_id,)
    ).fetchone()

    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    new_balance = round(wallet["balance"] + reload.amount, 2)
    tx_hash = generate_tx_hash()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    db.execute(
        "UPDATE wallets SET balance = ?, last_reload = ? WHERE employee_id = ?",
        (new_balance, now.split(" ")[0], reload.employee_id)
    )
    db.execute("""
        INSERT INTO wallet_transactions (employee_id, type, amount, description, recipient, tx_hash, created_at)
        VALUES (?, 'reload', ?, ?, ?, ?, ?)
    """, (reload.employee_id, reload.amount, "Company reload by Admin", "OrgLens Treasury", tx_hash, now))
    db.commit()

    return {
        "status": "success",
        "new_balance": new_balance,
        "tx_hash": tx_hash
    }


@router.get("/dashboard/stats")
def get_wallet_dashboard(db: sqlite3.Connection = Depends(get_db)):
    """Admin dashboard for company wallet spending analytics."""
    # Total wallets and balances
    wallet_stats = db.execute("""
        SELECT COUNT(*) as total_wallets,
               SUM(balance) as total_balance,
               AVG(balance) as avg_balance,
               MIN(balance) as min_balance,
               MAX(balance) as max_balance,
               SUM(monthly_reload) as total_monthly_budget
        FROM wallets
    """).fetchone()

    # Total spending (sum of negative amounts = payments)
    spending = db.execute("""
        SELECT COALESCE(SUM(ABS(amount)), 0) as total_spent,
               COUNT(*) as total_payments
        FROM wallet_transactions WHERE type = 'payment'
    """).fetchone()

    # Total reloaded
    reloaded = db.execute("""
        SELECT COALESCE(SUM(amount), 0) as total_reloaded,
               COUNT(*) as total_reloads
        FROM wallet_transactions WHERE type = 'reload'
    """).fetchone()

    # Total rewards given
    rewards = db.execute("""
        SELECT COALESCE(SUM(amount), 0) as total_rewards,
               COUNT(*) as total_reward_txs
        FROM wallet_transactions WHERE type = 'reward'
    """).fetchone()

    # Spending by merchant/recipient
    by_merchant = db.execute("""
        SELECT recipient, COUNT(*) as tx_count, SUM(ABS(amount)) as total_amount
        FROM wallet_transactions WHERE type = 'payment'
        GROUP BY recipient ORDER BY total_amount DESC
    """).fetchall()

    # Top spenders
    top_spenders = db.execute("""
        SELECT w.employee_id, e.name, e.avatar_url, SUM(ABS(wt.amount)) as total_spent
        FROM wallet_transactions wt
        JOIN wallets w ON wt.employee_id = w.employee_id
        JOIN employees e ON w.employee_id = e.id
        WHERE wt.type = 'payment'
        GROUP BY w.employee_id
        ORDER BY total_spent DESC
        LIMIT 10
    """).fetchall()

    # Employees with lowest balance (may need reload)
    low_balance = db.execute("""
        SELECT w.employee_id, e.name, e.avatar_url, w.balance, w.last_reload
        FROM wallets w
        JOIN employees e ON w.employee_id = e.id
        WHERE w.balance < 50
        ORDER BY w.balance ASC
        LIMIT 10
    """).fetchall()

    return {
        "total_wallets": wallet_stats["total_wallets"],
        "total_balance": round(wallet_stats["total_balance"] or 0, 2),
        "avg_balance": round(wallet_stats["avg_balance"] or 0, 2),
        "min_balance": round(wallet_stats["min_balance"] or 0, 2),
        "max_balance": round(wallet_stats["max_balance"] or 0, 2),
        "total_monthly_budget": round(wallet_stats["total_monthly_budget"] or 0, 2),
        "total_spent": round(spending["total_spent"], 2),
        "total_payments": spending["total_payments"],
        "total_reloaded": round(reloaded["total_reloaded"], 2),
        "total_reloads": reloaded["total_reloads"],
        "total_rewards": round(rewards["total_rewards"], 2),
        "total_reward_txs": rewards["total_reward_txs"],
        "spending_by_merchant": [dict(r) for r in by_merchant],
        "top_spenders": [dict(r) for r in top_spenders],
        "low_balance_employees": [dict(r) for r in low_balance],
    }
