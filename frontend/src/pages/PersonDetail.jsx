import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEmployee, getMovements, getWellbeing } from '../utils/api';
import PersonMilestoneCard from '../components/PersonMilestoneCard';
import WellbeingCard from '../components/WellbeingCard';
import { 
  Briefcase, Mail, MapPin, Award, Calendar, 
  ArrowLeft, ShieldAlert, Sparkles, TrendingUp
} from 'lucide-react';

export default function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [movements, setMovements] = useState([]);
  const [wellbeing, setWellbeing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sequential fetches to avoid SQLite concurrent access locks
        const empRes = await getEmployee(id);
        setPerson(empRes.data);

        const movRes = await getMovements(id);
        setMovements(movRes.data || []);

        const wellRes = await getWellbeing(id);
        setWellbeing(wellRes.data || []);
      } catch (err) {
        setError('Failed to load person data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading talent dossier...</div>;
  if (error) return <div className="p-8 text-rose-500 font-medium">{error}</div>;
  if (!person) return null;

  // Stagnation / Velocity calculation
  const totalPromotions = movements.filter(m => m.reason === 'promoted').length;
  const isStagnant = ['L2', 'L3'].includes(person.level) && movements.length === 1 && new Date(movements[0]?.start_date || person.hire_date) <= new Date('2021-06-01');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/people" className="inline-flex items-center gap-1.5 text-xs font-bold text-setel-600 dark:text-cyan-400 hover:text-setel-700 dark:hover:text-cyan-300 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <ArrowLeft size={14} /> Back to Talent Directory
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-400 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-2xl border border-slate-200 dark:border-white/10">
            Employee ID: #{person.id}
          </span>
        </div>
      </div>

      {/* Main Person Dossier Glass Card */}
      <div className="bg-white dark:bg-[#101B33] rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            {person.avatar_url ? (
              <img 
                src={person.avatar_url} 
                alt={person.name} 
                className="w-20 h-20 rounded-3xl object-cover border-2 border-setel-400 dark:border-cyan-400 shadow-md dark:shadow-[0_0_20px_rgba(0,191,255,0.35)] flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-setel-100 dark:bg-cyan-950 text-setel-700 dark:text-cyan-300 font-black flex items-center justify-center text-2xl flex-shrink-0 border-2 border-setel-200 dark:border-cyan-500/30">
                {person.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-mono">
                  {person.level || 'L4'} IC
                </span>
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-setel-50 dark:bg-cyan-950/40 text-setel-700 dark:text-cyan-300 border border-setel-200 dark:border-cyan-500/30">
                  {person.department || 'Engineering'}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                  {person.status || 'Active'}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{person.name}</h1>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                {person.current_role || 'Staff Member'}
              </p>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="flex gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-[#090F1D] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center flex-1 md:flex-initial min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block">Tenure</span>
              <span className="text-lg font-black text-slate-900 dark:text-slate-50 font-mono mt-0.5 block">
                {person.hire_date ? `${Math.floor((new Date('2025-06-30') - new Date(person.hire_date)) / (1000 * 60 * 60 * 24 * 365.25))} yrs` : '3.5 yrs'}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-[#090F1D] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center flex-1 md:flex-initial min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block">Promotions</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                {totalPromotions}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-[#090F1D] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center flex-1 md:flex-initial min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block">Total Moves</span>
              <span className="text-lg font-black text-setel-600 dark:text-cyan-400 font-mono mt-0.5 block">
                {movements.length}
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Bio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-slate-400" />
            <span>{person.email || `${person.name.toLowerCase().replace(/ /g, '.')}@setel.my`}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400" />
            <span>Kuala Lumpur Hub (Hybrid)</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <span>Hired {person.hire_date || '2021-01-01'}</span>
          </div>
        </div>
      </div>

      {/* Stagnation Anomaly Alert Banner (Storyline 4) */}
      {isStagnant && (
        <div className="bg-amber-500/10 dark:bg-amber-950/40 border border-amber-400/40 rounded-3xl p-5 text-amber-900 dark:text-amber-200 flex items-start gap-4 shadow-sm">
          <ShieldAlert size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-sm text-amber-900 dark:text-amber-100">Career Stagnation Anomaly Detected</h2>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-1 leading-relaxed">
              This employee has remained in the same individual contributor role ({person.current_role}) for &gt;3.5 years without lateral rotation or promotion. Consider proactive check-in or upskilling rotation.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Career Journey Timeline & Work Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-[#101B33] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Career Movement Timeline</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Historical audit of promotions, transfers, and structural shifts</p>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-xl">
              {movements.length} Milestone{movements.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-4">
            {movements.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No career movements recorded yet.</p>
            ) : (
              movements.map((milestone, idx) => (
                <PersonMilestoneCard key={idx} milestone={milestone} />
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar: Wellbeing */}
        <div className="space-y-6">
          {/* Active Wellbeing Check-in Card (if any) */}
          {wellbeing.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Change Wellbeing Telemetry
              </h2>
              {wellbeing.map(c => (
                <WellbeingCard key={c.id} checkin={{
                  id: c.id,
                  name: person.name,
                  changesCount: c.org_changes_count,
                  changes: [`Triggered by: ${c.triggered_by.replace(/_/g, ' ')}`]
                }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
