import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRole, getRoleHistory, getRoleRelevancy } from '../utils/api';
import RelevancyGauge from '../components/RelevancyGauge';
import RoleTimelineCard from '../components/RoleTimelineCard';
import { 
  Briefcase, ArrowLeft, Layers, Sparkles, BookOpen, 
  Clock, TrendingUp, AlertTriangle, Users, CheckCircle2 
} from 'lucide-react';

export default function RoleDetail() {
  const { id } = useParams();
  const [role, setRole] = useState(null);
  const [history, setHistory] = useState([]);
  const [relevancy, setRelevancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const roleRes = await getRole(id);
        if (!roleRes.data || roleRes.data.error) {
          setError('Role not found.');
          setLoading(false);
          return;
        }
        setRole(roleRes.data);

        // Sub-requests (safely fetch without failing main view)
        try {
          const histRes = await getRoleHistory(id);
          setHistory(histRes.data || []);
        } catch (e) {
          setHistory([]);
        }

        try {
          const relRes = await getRoleRelevancy(id);
          if (relRes.data && relRes.data.length > 0) {
            const relData = relRes.data[0];
            let suggestions = [];
            try {
              suggestions = typeof relData.upskill_suggestions === 'string' 
                ? JSON.parse(relData.upskill_suggestions) 
                : (relData.upskill_suggestions || []);
            } catch(e) {
              suggestions = [];
            }
            
            setRelevancy({
              score: Math.round((relData.relevancy_score || 0) * 100),
              trend: relData.industry_trend,
              trendDirection: relData.trend_direction,
              suggestions
            });
          }
        } catch (e) {
          setRelevancy(null);
        }
      } catch (err) {
        setError('Failed to load role details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading role intelligence...</div>;
  if (error) return <div className="p-8 text-rose-500 font-medium">{error}</div>;
  if (!role) return null;

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/roles" className="inline-flex items-center gap-1.5 text-xs font-bold text-setel-600 dark:text-cyan-400 hover:text-setel-700 dark:hover:text-cyan-300 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <ArrowLeft size={14} /> Back to Role Intelligence
        </Link>
        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-400 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-2xl border border-slate-200 dark:border-white/10">
          ID #{role.id}
        </span>
      </div>

      {/* Role Hero Dossier Glass Card */}
      <div className="bg-white dark:bg-[#101B33] rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                {role.code}
              </span>
              <span 
                className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-white/10"
                style={{ 
                  backgroundColor: `${role.department_color || '#00BFFF'}25`, 
                  color: role.department_color || '#00BFFF',
                  boxShadow: `0 0 10px ${role.department_color || '#00BFFF'}20`
                }}
              >
                {role.department_name || 'Engineering'}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                role.status === 'active' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
              }`}>
                {role.status === 'active' ? 'Active in Org' : 'Retired Position'}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{role.title}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium leading-relaxed">
              {role.description || 'Core engineering role responsible for scalable systems and infrastructure.'}
            </p>
          </div>

          {/* Current Occupant Ribbon */}
          {role.current_occupant_name && (
            <div className="bg-slate-50 dark:bg-[#090F1D] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5 flex-shrink-0">
              {role.current_occupant_avatar ? (
                <img 
                  src={role.current_occupant_avatar} 
                  alt={role.current_occupant_name} 
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-setel-400 dark:border-cyan-400 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-setel-100 dark:bg-cyan-950 text-setel-700 dark:text-cyan-300 font-black flex items-center justify-center text-sm border border-setel-200 dark:border-cyan-500/30">
                  {role.current_occupant_name.charAt(0)}
                </div>
              )}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Current Occupant</span>
                <Link 
                  to={`/people/${role.current_occupant_id || 1}`}
                  className="text-sm font-black text-slate-900 dark:text-slate-100 hover:text-setel-600 dark:hover:text-cyan-300 transition-colors"
                >
                  {role.current_occupant_name} →
                </Link>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Since {role.current_occupant_since || '2023'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Manager & Budget Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Reports To</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5 block">{role.manager_title || 'Board of Directors'}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Created Date</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5 block">{role.created_at || '2021-01-01'}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Level & Track</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5 block">{role.level || 'L4'} IC Track</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Lifecycle Mutations</span>
            <span className="text-xs font-black text-setel-600 dark:text-cyan-400 mt-0.5 block">{history.length} Events Logged</span>
          </div>
        </div>
      </div>

      {/* Main Detail Grid: Relevancy & Upskilling + Lifecycle Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Relevancy & Upskilling Engine */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#101B33] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <Sparkles size={16} className="text-setel-500 dark:text-cyan-400" />
              Role Relevancy Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">Market relevancy & automation exposure index</p>
            
            <RelevancyGauge 
              score={relevancy?.score ?? 78} 
              trend={relevancy?.trend ?? "High industry demand with containerization requirements"} 
              trendDirection={relevancy?.trendDirection ?? "growing"}
              suggestions={relevancy?.suggestions ?? []}
            />
          </div>

          {/* Historical Occupants Glass Panel */}
          {role.historical_occupants && role.historical_occupants.length > 0 && (
            <div className="bg-white dark:bg-[#101B33] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
                <Users size={16} className="text-slate-600 dark:text-slate-400" />
                Historical Occupants
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">Chronological tenant history</p>

              <div className="space-y-3">
                {role.historical_occupants.map((occ, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#090F1D] border border-slate-100 dark:border-slate-800">
                    <div>
                      <Link to={`/people/${occ.employee_id}`} className="text-xs font-black text-slate-800 dark:text-slate-200 hover:text-setel-600 dark:hover:text-cyan-300 hover:underline">
                        {occ.employee_name}
                      </Link>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-mono mt-0.5">
                        {occ.start_date} → {occ.end_date || 'Present'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {occ.reason || 'Assigned'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Evolution Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-[#101B33] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
            <Layers size={18} className="text-setel-600 dark:text-cyan-400" />
            Position Evolution Timeline
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
            Chronological audit of role creation, restructuring splits, mergers, occupant shifts, and reporting line changes.
          </p>

          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No lifecycle events recorded for this role.</p>
            ) : (
              history.map((event, idx) => (
                <RoleTimelineCard key={idx} event={event} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
