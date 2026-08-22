import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { getWallet, getWalletTransactions, makeWalletPayment } from '../utils/api';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Gift, Copy, CheckCircle2, 
  Send, Coffee, Car, UtensilsCrossed, CircleDollarSign, QrCode
} from 'lucide-react';

export default function RoyaltyWallet() {
  const { staffEmployeeId } = useContext(AppContext);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payDesc, setPayDesc] = useState('');
  const [payRecipient, setPayRecipient] = useState('');
  const [paying, setPaying] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, txRes] = await Promise.all([
          getWallet(staffEmployeeId),
          getWalletTransactions(staffEmployeeId, 30)
        ]);
        setWallet(walletRes.data);
        setTransactions(txRes.data || []);
      } catch (err) {
        console.error('Failed to load wallet:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [staffEmployeeId]);

  const copyAddress = () => {
    if (wallet?.wallet_address) {
      navigator.clipboard.writeText(wallet.wallet_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePay = async () => {
    if (!payAmount || !payDesc || !payRecipient) return;
    setPaying(true);
    try {
      const res = await makeWalletPayment(staffEmployeeId, {
        amount: parseFloat(payAmount),
        description: payDesc,
        recipient: payRecipient
      });
      setWallet(prev => ({ ...prev, balance: res.data.new_balance }));
      const txRes = await getWalletTransactions(staffEmployeeId, 30);
      setTransactions(txRes.data || []);
      setShowPay(false);
      setPayAmount('');
      setPayDesc('');
      setPayRecipient('');
    } catch (err) {
      alert(err.response?.data?.detail || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'reload': return <ArrowDownLeft size={14} className="text-emerald-500" />;
      case 'payment': return <ArrowUpRight size={14} className="text-rose-500" />;
      case 'reward': return <Gift size={14} className="text-amber-500" />;
      default: return <CircleDollarSign size={14} className="text-slate-400" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'reload': return 'text-emerald-600 dark:text-emerald-400';
      case 'payment': return 'text-rose-600 dark:text-rose-400';
      case 'reward': return 'text-amber-600 dark:text-amber-400';
      default: return 'text-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-setel-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold">Loading wallet...</p>
      </div>
    );
  }

  if (!wallet) {
    return <div className="p-8 text-rose-500 font-medium">Wallet not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
            Solana Wallet
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">My Royalty Wallet</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Company-funded wallet for meals, parking, and perks. Reloaded monthly by HR.
        </p>
      </div>

      {/* Wallet Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-3xl p-6 md:p-8 text-white shadow-lg dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-6">
          {/* Balance */}
          <div>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Available Balance</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl md:text-5xl font-black tracking-tight">{wallet.balance.toFixed(2)}</span>
              <span className="text-lg font-bold text-purple-300">SOL</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Monthly reload: {wallet.monthly_reload} SOL on 1st of each month</p>
          </div>

          {/* Wallet Address */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 w-fit">
            <Wallet size={14} className="text-purple-300 flex-shrink-0" />
            <span className="text-[11px] font-mono text-slate-200 truncate max-w-[240px] md:max-w-[360px]">
              {wallet.wallet_address}
            </span>
            <button onClick={copyAddress} className="ml-2 hover:text-purple-300 transition-colors flex-shrink-0">
              {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPay(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold transition-all"
            >
              <Send size={14} /> Pay
            </button>
            <button
              onClick={() => setShowQR(!showQR)}
              className={`flex items-center gap-2 px-4 py-2.5 backdrop-blur-md rounded-xl text-xs font-bold transition-all ${
                showQR ? 'bg-purple-500/40 ring-1 ring-purple-400' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <QrCode size={14} /> QR Code
            </button>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-300">
              <span className="flex items-center gap-1"><Coffee size={12} /> Cafeteria</span>
              <span className="flex items-center gap-1"><Car size={12} /> Parking</span>
              <span className="flex items-center gap-1"><UtensilsCrossed size={12} /> Food</span>
            </div>
          </div>

          {/* QR Code Display */}
          {showQR && (
            <div className="mt-4 flex items-center gap-5 bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="bg-white p-3 rounded-xl">
                <QRCodeSVG
                  value={`solana:${wallet.wallet_address}`}
                  size={120}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#1a1a2e"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-white">Scan to receive payment</p>
                <p className="text-[10px] text-slate-300 leading-relaxed max-w-[200px]">
                  Show this QR at the cafeteria, vending machine, or parking gate to pay directly from your wallet.
                </p>
                <p className="text-[9px] font-mono text-slate-400 break-all max-w-[200px]">
                  {wallet.wallet_address}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pay Modal */}
      {showPay && (
        <div className="bg-white dark:bg-[#101B33] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-50 mb-4">Make a Payment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Amount (SOL)</label>
              <input
                type="number"
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder="15.00"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#090F1D] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Recipient</label>
              <select
                value={payRecipient}
                onChange={(e) => setPayRecipient(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#090F1D] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-400"
              >
                <option value="">Select...</option>
                <option value="OrgLens Cafeteria">Cafeteria</option>
                <option value="Floor 3 Vending">Vending Machine</option>
                <option value="Building Parking">Parking</option>
                <option value="GrabFood">Grab Food</option>
                <option value="External Restaurant">Restaurant</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Description</label>
              <input
                type="text"
                value={payDesc}
                onChange={(e) => setPayDesc(e.target.value)}
                placeholder="Lunch Set A"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#090F1D] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handlePay}
              disabled={paying || !payAmount || !payDesc || !payRecipient}
              className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-xs rounded-xl shadow-md hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {paying ? 'Processing...' : 'Confirm Payment'}
            </button>
            <button
              onClick={() => setShowPay(false)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white dark:bg-[#101B33] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <h2 className="text-base font-black text-slate-900 dark:text-slate-50 mb-4">Transaction History</h2>

        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">No transactions yet.</p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#090F1D] border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {getTypeIcon(tx.type)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{tx.description}</p>
                    <p className="text-[10px] text-slate-400">
                      {tx.recipient} • {tx.created_at?.split(' ')[0]}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${getTypeColor(tx.type)}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} SOL
                  </p>
                  <p className="text-[9px] font-mono text-slate-400 truncate max-w-[100px]" title={tx.tx_hash}>
                    {tx.tx_hash?.slice(0, 8)}...
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
