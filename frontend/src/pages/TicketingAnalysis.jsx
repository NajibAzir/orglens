import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees } from '../utils/api';
import { BarChart3, Search, ArrowRight, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TicketingAnalysis() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployees();
        setEmployees(res.data || []);
      } catch (err) {
        setError('Failed to load ticketing employee list.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.current_role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading Jira telemetry repository...</div>;
  if (error) return <div className="p-8 text-rose-500 font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-setel-50 dark:bg-cyan-950/40 text-setel-700 dark:text-cyan-300 border border-setel-200 dark:border-cyan-500/30">
            Work Intelligence
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">Jira Work Telemetry & Restructuring Fit</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Compare nominal job titles against actual sprint execution patterns to guide frictionless reorganizations.
        </p>
      </div>

      {/* Search Glass Bar */}
      <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl p-4 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee by name, title, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-setel-500 dark:focus:border-cyan-400 outline-none transition-all"
          />
        </div>
        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-2xl">
          {filteredEmployees.length} Staff Profiles Analyzed
        </span>
      </div>

      {/* Employee Work Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl rounded-3xl p-5 border border-slate-200/50 dark:border-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.05),inset_0_1px_1px_white,inset_0_-2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-2px_6px_rgba(0,0,0,0.4)] hover:border-slate-300 dark:hover:border-cyan-400/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),inset_0_1px_2px_white,inset_0_-2px_4px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_25px_rgba(0,191,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="flex gap-4 flex-1">
              {/* Left Column: Avatar + Name/Designation */}
              <div className="flex flex-col items-start flex-shrink-0 w-36">
                {emp.avatar_url ? (
                  <img
                    src={emp.avatar_url}
                    alt={emp.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-cyan-500/40 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-setel-100 dark:bg-cyan-950 text-setel-700 dark:text-cyan-300 font-black flex items-center justify-center text-xl flex-shrink-0 border border-setel-200 dark:border-cyan-500/30 shadow-sm">
                    {emp.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="mt-2 w-full">
                  <h2 className="text-sm font-black text-slate-900 dark:text-slate-50 leading-tight">
                    {emp.name}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 leading-snug">
                    {emp.current_role || 'Staff Member'}
                  </p>
                </div>
              </div>

              {/* Right Column: Stats Box */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col justify-center p-4 rounded-xl bg-transparent space-y-3 text-sm transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">Nominal Dept</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-right">{emp.department || 'Engineering'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">Logged Sprints</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-right">12 sprints (2021-2025)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bar - Glossy */}
            <div className="relative overflow-hidden mt-5 p-3 rounded-xl bg-gradient-to-r from-slate-100/90 to-slate-50/50 dark:from-[#050A14]/80 dark:to-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-cyan-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_1px_rgba(0,191,255,0.15)] flex items-center justify-between group-hover:border-cyan-400/40 dark:group-hover:border-cyan-400/40 transition-all duration-300">
              {/* Glossy Top Edge Highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-cyan-400/30 to-transparent pointer-events-none" />
              {/* Diagonal Glass Reflection */}
              <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/10 dark:via-cyan-100/5 to-transparent rotate-45 pointer-events-none transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              
              <span className="relative z-10 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-cyan-400 flex items-center gap-1.5 drop-shadow-sm">
                <Sparkles size={12} className="dark:drop-shadow-[0_0_8px_rgba(0,191,255,0.8)]" /> Ready For AI Fit Analysis
              </span>
              <Link
                to={`/ticketing/${emp.id}`}
                className="relative z-10 inline-flex items-center gap-1.5 text-xs font-black text-setel-600 dark:text-cyan-300 hover:text-setel-800 dark:hover:text-cyan-100 group-hover:translate-x-0.5 transition-all drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(0,191,255,0.4)]"
              >
                Analyze Work <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
