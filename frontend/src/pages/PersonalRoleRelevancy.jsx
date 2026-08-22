import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { getPersonalUpskilling } from '../utils/api';
import { 
  Zap, TrendingUp, TrendingDown, Minus, BookOpen, 
  Sparkles, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, Layers 
} from 'lucide-react';

export default function PersonalRoleRelevancy() {
  const { staffEmployeeId, setIsStaffPickerOpen } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPersonalUpskilling(staffEmployeeId);
        setData(res.data);
      } catch (err) {
        console.error('Failed to load role relevancy:', err);
        setError('Failed to load your personal role relevancy.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [staffEmployeeId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold">Computing your current role relevancy index...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-500 font-bold text-sm">
        {error || 'No role relevancy data found.'}
      </div>
    );
  }

  const score = data.relevancy_score || 0.85;
  const scorePct = Math.round(score * 100);
  const isLow = score < 0.6;
  const isHigh = score >= 0.85;

  return (
    <div className="space-y-6">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              Role Lens Telemetry
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Market Demand & Viability
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
            My Role Relevancy Index
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl mt-1">
            Understand how market technology trends impact your current position and explore actionable paths to future-proof your career.
          </p>
        </div>

        {/* Current Active Employee Capsule */}
        <div 
          onClick={() => setIsStaffPickerOpen(true)}
          className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-[#0A1224]/90 border border-slate-200 dark:border-white/10 shadow-xs hover:border-cyan-400/50 cursor-pointer transition-all duration-200 group"
          title="Click to switch to any of the 26 employees"
        >
          <img
            src={data.avatar_url || `https://api.dicebear.com/9.x/micah/svg?seed=${data.name}`}
            alt={data.name}
            className="w-10 h-10 rounded-xl object-cover border border-cyan-400 flex-shrink-0"
          />
          <div className="text-left">
            <p className="text-xs font-black text-slate-900 dark:text-white group-hover:text-setel-600 dark:group-hover:text-cyan-300 truncate max-w-[140px]">
              {data.name}
            </p>
            <p className="text-[10px] text-slate-400 font-bold">
              Switch Persona (26)
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Score & Profile Card ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Relevancy Score & Breakdown */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#0A1224]/90 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Current Position Evaluation
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {data.current_role}
                </h2>
              </div>

              <span 
                className="text-xs font-extrabold px-3 py-1 rounded-xl border"
                style={{
                  backgroundColor: data.department_color ? `${data.department_color}15` : '#64748B15',
                  borderColor: data.department_color ? `${data.department_color}40` : '#64748B40',
                  color: data.department_color || '#64748B',
                }}
              >
                {data.department_name}
              </span>
            </div>

            {/* Score & Gauge Bar */}
            <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Relevancy Health Index
                </span>
                <span className={`text-2xl font-black ${
                  isLow ? 'text-rose-500' : isHigh ? 'text-emerald-500 dark:text-cyan-400' : 'text-amber-500'
                }`}>
                  {scorePct}% ({score.toFixed(2)} / 1.0)
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isLow 
                      ? 'bg-rose-500' 
                      : isHigh 
                      ? 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-setel-500' 
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${scorePct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span>0% Obsolescence Risk</span>
                <span>50% Baseline</span>
                <span>100% High Market Demand</span>
              </div>
            </div>

            {/* Industry Trend Explanation */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2">
                {data.trend_direction === 'up' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                    <TrendingUp size={14} /> Market Trajectory: Expanding (↗)
                  </span>
                )}
                {data.trend_direction === 'down' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-lg border border-rose-500/20">
                    <TrendingDown size={14} /> Market Trajectory: Declining (↘)
                  </span>
                )}
                {data.trend_direction === 'stable' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-white/10">
                    <Minus size={14} /> Market Trajectory: Stable (→)
                  </span>
                )}
              </div>

              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-2">
                {data.industry_trend}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Want to increase your score?
            </span>
            <Link
              to="/my-upskill"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-setel-500 to-setel-600 dark:from-cyan-400 dark:to-blue-500 text-slate-950 font-black text-xs shadow-md hover:scale-105 transition-all"
            >
              <BookOpen size={14} />
              <span>Open My Upskill Plan →</span>
            </Link>
          </div>
        </div>

        {/* Right Col: Target Milestone Preview */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-white dark:from-[#0A1224]/90 to-slate-50 dark:to-[#030712] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-500 dark:text-cyan-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Career Horizon
              </h3>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Target Promotion Role</p>
              <p className="text-base font-black text-slate-900 dark:text-white mt-1">
                {data.target_velocity_role}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-cyan-300 font-bold mt-1">
                Potential Score: {Math.round(data.potential_relevancy_score * 100)}%
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Key Modules in Roadmap
              </p>
              <div className="space-y-1.5">
                {data.modules?.map((m) => (
                  <div 
                    key={m.id}
                    className="p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
                  >
                    <span className="truncate max-w-[170px]">{m.course}</span>
                    <span className="text-[9px] text-emerald-500 font-black flex-shrink-0">{m.relevance_gain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link
            to={`/people/${data.employee_id}`}
            className="text-center py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            View My Full Career Journey Timeline →
          </Link>
        </div>

      </div>

    </div>
  );
}
