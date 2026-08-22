import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWalletDashboard } from '../utils/api';
import { 
  Wallet, TrendingUp, Users, CircleDollarSign, Gift, 
  AlertTriangle, ArrowRight, Coffee, Car, UtensilsCrossed
} from 'lucide-react';

export default function WalletDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWalletDashboard();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load wallet dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-purple-500 dark:border-purple-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold">Loading wallet analytics...</p>
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-rose-500 font-medium">Failed to load wallet dashboard.</div>;

  const utilizationRate = stats.total_reloaded > 0 
    ? Math.round((stats.total_spent / stats.total_reloaded) * 100) 
    : 0;

  const getMerchantIcon = (name) => {
    if (name?.includes('Cafeteria') || name?.includes('Restaurant')) return <UtensilsCrossed size={14} />;
    if (name?.includes('Parking')) return <Car size={14} />;
    if (name?.includes('Vending') || name?.includes('Grab')) return <Coffee size={14} />;
    return <CircleDollarSign size={14} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
            Solana Wallet
          </span>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Company Treasury Overview
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">Wallet Analytics Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Monitor company wallet spending, employee utilization, and reload budgets across the organization.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white border border-purple-500/30 shadow-md dark:shadow-[0_0_20px_rgba(147,51,234,0.15)]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Total Company Spend</p>
            <CircleDollarSign size={16} className="text-purple-400" />
          </div>
          <p className="text-2xl font-black mt-2">{stats.total_spent.toFixed(0)} <span className="text-sm text-purple-300">SOL</span></p>
          <p className="text-[10px] text-slate-400 mt-1">{stats.total_payments} transactions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Reloaded</p>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{stats.total_reloaded.toFixed(0)} <span className="text-sm text-slate-400">SOL</span></p>
          <p className="text-[10px] text-slate-500 mt-1">{stats.total_reloads} reload transactions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Utilization Rate</p>
            <Users size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{utilizationRate}%</p>
          <p className="text-[10px] text-slate-500 mt-1">of reloaded SOL has been spent</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rewards Distributed</p>
            <Gift size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{stats.total_rewards.toFixed(0)} <span className="text-sm text-slate-400">SOL</span></p>
          <p className="text-[10px] text-slate-500 mt-1">{stats.total_reward_txs} reward bonuses</p>
        </div>
      </div>

      {/* Budget Overview Bar */}
      <div className="bg-white dark:bg-[#101B33] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/90 shadow-sm">
        <h2 className="text-base font-black text-slate-900 dark:text-slate-50 mb-4">Monthly Budget Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#090F1D] border border-slate-200/80 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly Budget</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.total_monthly_budget.toFixed(0)} SOL</p>
            <p className="text-[10px] text-slate-500">{stats.total_wallets} employees x avg {(stats.total_monthly_budget / stats.total_wallets).toFixed(0)} SOL</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#090F1D] border border-slate-200/80 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Current Total Balance</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.total_balance.toFixed(0)} SOL</p>
            <p className="text-[10px] text-slate-500">Avg {stats.avg_balance.toFixed(0)} SOL per employee</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#090F1D] border border-slate-200/80 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Balance Range</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.min_balance.toFixed(0)} – {stats.max_balance.toFixed(0)} SOL</p>
            <p className="text-[10px] text-slate-500">Lowest to highest employee balance</p>
          </div>
        </div>
      </div>

      {/* Two Column: Spending by Merchant + Top Spenders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Merchant */}
        <div className="bg-white dark:bg-[#101B33] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/90 shadow-sm">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-50 mb-4">Spending by Merchant</h2>
          <div className="space-y-3">
            {stats.spending_by_merchant.map((m, idx) => {
              const pct = stats.total_spent > 0 ? Math.round((m.total_amount / stats.total_spent) * 100) : 0;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-300 flex-shrink-0">
                    {getMerchantIcon(m.recipient)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{m.recipient}</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white ml-2">{m.total_amount.toFixed(0)} SOL</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5">{m.tx_count} transactions • {pct}% of total</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Spenders + Low Balance Alerts */}
        <div className="space-y-6">
          {/* Top Spenders */}
          <div className="bg-white dark:bg-[#101B33] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/90 shadow-sm">
            <h2 className="text-base font-black text-slate-900 dark:text-slate-50 mb-4">Top Spenders</h2>
            <div className="space-y-2.5">
              {stats.top_spenders.slice(0, 5).map((emp, idx) => (
                <Link
                  key={idx}
                  to={`/people/${emp.employee_id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-black text-slate-400 w-5">#{idx + 1}</span>
                    {emp.avatar_url ? (
                      <img src={emp.avatar_url} alt={emp.name} className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black flex items-center justify-center text-[10px]">
                        {emp.name?.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      {emp.name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{emp.total_spent.toFixed(0)} SOL</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Low Balance Alerts */}
          {stats.low_balance_employees.length > 0 && (
            <div className="bg-white dark:bg-[#101B33] rounded-3xl p-6 border border-amber-200 dark:border-amber-500/30 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-amber-500" />
                <h2 className="text-base font-black text-slate-900 dark:text-slate-50">Low Balance Alerts</h2>
              </div>
              <p className="text-[10px] text-slate-500 mb-3">Employees with less than 50 SOL remaining — may need a top-up.</p>
              <div className="space-y-2">
                {stats.low_balance_employees.map((emp, idx) => (
                  <Link
                    key={idx}
                    to={`/people/${emp.employee_id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {emp.avatar_url ? (
                        <img src={emp.avatar_url} alt={emp.name} className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black flex items-center justify-center text-[10px]">
                          {emp.name?.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{emp.name}</span>
                    </div>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">{emp.balance.toFixed(0)} SOL</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
