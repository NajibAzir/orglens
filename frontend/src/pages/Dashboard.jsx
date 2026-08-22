import { useState, useEffect } from 'react';
import { getDashboardStats } from '../utils/api';
import { Users, Briefcase, Building2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-rose-500 font-medium">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-white dark:bg-[#081124]/90 dark:backdrop-blur-2xl rounded-3xl p-6 md:p-8 text-slate-900 dark:text-white shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Subtle inner decorative glow in dark mode only */}
        <div className="absolute top-0 right-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none opacity-0 dark:opacity-100" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-setel-50 dark:bg-cyan-500/20 text-setel-700 dark:text-cyan-300 text-xs font-black px-3 py-0.5 rounded-full border border-setel-200 dark:border-cyan-400/40 uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Sparkles size={12} /> Organizational Intelligence
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Welcome to OrgLens</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-xl font-medium">
            Real-time organizational timeline mapping, role evolution, and proactive wellbeing management.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 flex-shrink-0">
          <Link
            to="/org-chart"
            className="px-5 py-2.5 bg-gradient-to-r from-setel-500 to-setel-600 dark:from-cyan-400 dark:to-blue-500 hover:from-setel-400 hover:to-setel-500 text-slate-950 font-black rounded-2xl shadow-md dark:shadow-[0_0_20px_rgba(0,191,255,0.4)] text-sm transition-all duration-200 flex items-center gap-1.5 hover:scale-105"
          >
            Launch Org Chart →
          </Link>
        </div>
      </div>
      
      {/* Stats Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Total Employees', value: stats.total_employees, img: '/ai_icons/employees.jpg', glow: 'dark:shadow-[0_0_20px_rgba(0,191,255,0.15)]', border: 'hover:border-cyan-400/50' },
          { title: 'Total Roles', value: stats.total_roles, img: '/ai_icons/roles.jpg', glow: 'dark:shadow-[0_0_20px_rgba(59,130,246,0.15)]', border: 'hover:border-blue-400/50' },
          { title: 'Departments', value: stats.total_departments, img: '/ai_icons/departments.jpg', glow: 'dark:shadow-[0_0_20px_rgba(99,102,241,0.15)]', border: 'hover:border-indigo-400/50' },
          { title: 'Active Anomalies', value: stats.active_anomalies, img: '/ai_icons/anomalies.jpg', glow: 'dark:shadow-[0_0_20px_rgba(251,191,36,0.15)]', border: 'hover:border-amber-400/50' }
        ].map((stat, i) => (
          <div key={i} className={`relative overflow-hidden bg-white dark:bg-[#050A14] p-6 rounded-3xl shadow-sm border border-slate-200/80 dark:border-white/10 ${stat.glow} flex flex-col justify-center min-h-[110px] transition-all duration-300 hover:scale-[1.02] ${stat.border} group`}>
            
            {/* Background Image Wallpaper */}
            <div className="absolute inset-0 z-0">
              <img src={stat.img} alt={stat.title} className="w-full h-full object-cover opacity-15 dark:opacity-40 mix-blend-luminosity group-hover:scale-110 group-hover:opacity-30 dark:group-hover:opacity-60 dark:group-hover:mix-blend-normal transition-all duration-700" />
              {/* Gradient Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#050A14] dark:via-[#050A14]/80 dark:to-transparent" />
            </div>

            {/* Text Content */}
            <div className="relative z-10 flex flex-col">
              <p className="text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tight drop-shadow-sm">{stat.value || 0}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Feed & Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movements Table Glass Panel */}
        <div className="lg:col-span-2 bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/10 p-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Movements & Transitions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live feed of role changes and structural reorganizations</p>
            </div>
            <Link to="/people" className="text-xs font-bold text-setel-600 dark:text-cyan-400 hover:underline">
              View all →
            </Link>
          </div>
          {(!stats.recent_movements || stats.recent_movements.length === 0) ? (
            <p className="text-slate-500 text-sm py-4">No recent movements to display.</p>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3 font-bold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Employee</th>
                  <th className="p-3 font-bold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Role Assigned</th>
                  <th className="p-3 font-bold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Date</th>
                  <th className="p-3 font-bold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {stats.recent_movements.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-100">
                      <Link to={`/people/${m.employee_id || 1}`} className="text-slate-800 dark:text-slate-100 hover:text-setel-600 dark:hover:text-cyan-400 hover:underline">
                        {m.employee_name}
                      </Link>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-lg bg-setel-50 dark:bg-cyan-950/40 text-setel-700 dark:text-cyan-300 text-xs font-bold border border-setel-100 dark:border-cyan-500/30">
                        {m.to_role || '-'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 dark:text-slate-400 text-xs font-medium">{m.date}</td>
                    <td className="p-3 capitalize text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/40 dark:border-white/5">
                        {m.reason}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Quick Navigation Glass Panel */}
        <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/10 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Quick Navigation</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">Dual-lens access to roles & talent</p>
            <div className="space-y-3">
              {[
                { title: 'Interactive Org Chart', path: '/org-chart' },
                { title: 'Role Relevancy & Tech Trends', path: '/relevancy' },
                { title: 'Staff Upskill Recommendations', path: '/upskilling' },
                { title: 'People Career Journey', path: '/people' },
                { title: 'Change Wellbeing Monitor', path: '/wellbeing' },
              ].map((item, idx) => (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 hover:bg-setel-50/80 dark:hover:bg-cyan-950/30 border border-slate-100 dark:border-white/5 dark:hover:border-cyan-500/30 text-slate-700 dark:text-slate-200 hover:text-setel-700 dark:hover:text-cyan-300 transition-all duration-150 group"
                >
                  <span className="font-bold text-sm">{item.title}</span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-setel-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-setel-50 to-blue-50 dark:from-slate-900/60 dark:to-cyan-950/40 border border-setel-100 dark:border-cyan-500/20">
            <div className="text-xs font-black text-setel-800 dark:text-cyan-300">Pro-Tip</div>
            <p className="text-[11px] text-setel-900/80 dark:text-slate-300 mt-1 font-medium leading-relaxed">
              Toggle between <strong>Admin/HR</strong> and <strong>Staff</strong> persona in the bottom left of the sidebar to experience dual perspectives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
