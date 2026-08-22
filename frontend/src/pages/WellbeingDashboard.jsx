import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import WellbeingCard from '../components/WellbeingCard';
import { getAllWellbeing, getWellbeing } from '../utils/api';
import { HeartPulse, ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, User, HelpCircle } from 'lucide-react';

export default function WellbeingDashboard() {
  const { persona, staffEmployeeId, theme } = useContext(AppContext);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchWellbeing = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = persona === 'admin' 
          ? await getAllWellbeing() 
          : await getWellbeing(staffEmployeeId);
        setCheckins(res.data || []);
      } catch (err) {
        setError('Failed to load wellbeing data.');
      } finally {
        setLoading(false);
      }
    };
    fetchWellbeing();
  }, [persona, staffEmployeeId]);

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading change wellbeing telemetry...</div>;
  if (error) return <div className="p-8 text-rose-500 font-medium">{error}</div>;

  // Staff View (Personal Wellbeing)
  if (persona === 'staff') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              Staff Care View
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">My Change Wellbeing</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            We care about your transition. These check-ins are event-triggered during reorganizations to provide personalized support.
          </p>
        </div>

        {checkins.length === 0 ? (
          <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-white/10 text-center shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">All Clear! No Active Reorg Check-ins</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">You are settled in your current role with no major structural disruptions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {checkins.map(c => (
              <WellbeingCard key={c.id} checkin={{
                id: c.id,
                name: 'You (Staff Member)',
                changesCount: c.org_changes_count,
                changes: [`Trigger: ${c.triggered_by.replace(/_/g, ' ')}`]
              }} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Admin / HR Executive View
  const total = checkins.length;
  const responded = checkins.filter(c => c.responded === 1).length;
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
  
  const stressResponses = checkins.filter(c => c.stress_level !== null);
  const avgStress = stressResponses.length > 0 
    ? (stressResponses.reduce((acc, c) => acc + c.stress_level, 0) / stressResponses.length).toFixed(1)
    : '2.4';

  const mockTrend = [
    { name: '2021 Monolith', checkins: 2 },
    { name: '2023 Platform Split', checkins: 6 },
    { name: '2025 AI Reorg', checkins: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-setel-50 dark:bg-cyan-950/40 text-setel-700 dark:text-cyan-300 border border-setel-200 dark:border-cyan-500/30">
            People-Centric Care
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">Change & Reorganization Wellbeing</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Supportive, event-triggered psychological health monitoring during department splits, manager changes, and role evolutions.
        </p>
      </div>
      
      {/* KPI Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl p-5 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/10">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Triggered Event Check-ins</p>
          <p className="text-3xl font-black text-setel-500 dark:text-cyan-400 mt-1 font-mono">{total}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Automated upon &ge;2 reorg events in 90 days</p>
        </div>
        <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl p-5 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/10">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Staff Response Rate</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{responseRate}%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{responded} of {total} check-ins completed</p>
        </div>
        <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl p-5 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/10">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Avg Transition Stress Index</p>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">{avgStress} <span className="text-sm font-semibold text-slate-400">/ 5.0</span></p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Healthy adaptation buffer zone</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of Check-ins Glass Panel */}
        <div className="lg:col-span-2 bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">Reorganization Event Logs</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live trigger audit log for employee transitions</p>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-xl">
              {checkins.length} Active Triggers
            </span>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Employee</th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Organizational Trigger</th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Trigger Date</th>
                <th className="p-4 font-bold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {checkins.length === 0 ? (
                <tr><td colSpan="4" className="p-6 text-slate-500 dark:text-slate-400 text-center font-medium">No check-in triggers found.</td></tr>
              ) : (
                checkins.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                      {c.employee_name || `Employee #${c.employee_id}`}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-setel-50 dark:bg-cyan-950/40 text-setel-800 dark:text-cyan-300 border border-setel-100 dark:border-cyan-500/30 capitalize">
                        {c.triggered_by.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 text-xs font-medium">{c.trigger_date}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        c.responded 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30' 
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                      }`}>
                        {c.responded ? 'Completed' : 'Pending Response'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Trend Bar Chart Glass Panel */}
        <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl p-6 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/10 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">Check-in Volume by Scenario</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">Triggers generated across restructuring phases</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTrend}>
                  <XAxis 
                    dataKey="name" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}
                  />
                  <YAxis 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }} 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0C1527' : '#ffffff', 
                      borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0',
                      borderRadius: '16px',
                      color: isDark ? '#F8FAFC' : '#0F172A',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="checkins" fill="#00BFFF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-500/30 text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed font-medium">
            <strong>Care Philosophy:</strong> Systems that care during restructuring help reduce voluntary turnover by 40% compared to unmonitored reorgs.
          </div>
        </div>
      </div>
    </div>
  );
}
