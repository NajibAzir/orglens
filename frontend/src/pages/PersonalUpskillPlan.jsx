import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { getPersonalUpskilling, updateUpskillProgress } from '../utils/api';
import { 
  BookOpen, Sparkles, CheckCircle2, Clock, PlayCircle, 
  ArrowRight, ShieldCheck, Zap, TrendingUp, Award, Layers 
} from 'lucide-react';

export default function PersonalUpskillPlan() {
  const { staffEmployeeId, setIsStaffPickerOpen } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingCourse, setSavingCourse] = useState(null);

  const fetchPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPersonalUpskilling(staffEmployeeId);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load upskill plan:', err);
      setError('Failed to load your personal upskill pathway.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [staffEmployeeId]);

  const handleStatusChange = async (courseName, newStatus) => {
    setSavingCourse(courseName);
    try {
      await updateUpskillProgress({
        employee_id: staffEmployeeId,
        course_name: courseName,
        status: newStatus
      });
      // Refresh state
      const res = await getPersonalUpskilling(staffEmployeeId);
      setData(res.data);
    } catch (err) {
      console.error('Failed to update course progress:', err);
    } finally {
      setSavingCourse(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-emerald-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold">Personalizing your career upskilling roadmap...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-500 font-bold text-sm">
        {error || 'No upskill plan found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ── Header & Persona Switcher ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Staff Growth Lens
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Tailored Skill Acceleration
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
            My Upskill & Learning Plan
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl mt-1">
            Track and complete your personalized skill development modules to protect role relevancy and unlock promotions.
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
            className="w-10 h-10 rounded-xl object-cover border border-emerald-400 dark:border-cyan-400 flex-shrink-0"
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

      {/* ── Career Velocity & Target Banner ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/20 dark:border-cyan-500/30 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-600 dark:text-cyan-400" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-cyan-300">
                Target Next Milestone
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              {data.target_velocity_role}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Completing these recommended modules will boost your overall technical market relevancy from{' '}
              <strong className="text-slate-900 dark:text-white">{Math.round(data.relevancy_score * 100)}%</strong> to{' '}
              <strong className="text-emerald-600 dark:text-cyan-300">
                {Math.round(data.potential_relevancy_score * 100)}%
              </strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#070D1B]/90 border border-slate-200 dark:border-white/10 flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Pathway Progress</p>
              <p className="text-3xl font-black text-emerald-600 dark:text-cyan-400 mt-0.5">
                {data.progress_pct}%
              </p>
              <p className="text-[10px] text-slate-500 font-bold">
                {data.completed_count} of {data.total_modules} completed
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="mt-5 w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
            style={{ width: `${data.progress_pct}%` }}
          />
        </div>
      </div>

      {/* ── Interactive Course Modules List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-600 dark:text-cyan-400" />
            <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Curated Upskilling Modules
            </h3>
          </div>
          <Link
            to="/my-relevancy"
            className="text-xs font-bold text-setel-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View My Role Relevancy Index</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-3">
          {data.modules?.map((m) => {
            const isDone = m.status === 'completed';
            const isInProgress = m.status === 'in_progress';
            const isSaving = savingCourse === m.course;

            return (
              <div
                key={m.id}
                className={`p-5 rounded-3xl bg-white dark:bg-[#0A1224]/90 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                  isDone 
                    ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/10'
                    : isInProgress
                    ? 'border-cyan-500/40 dark:border-cyan-400/30'
                    : 'border-slate-200 dark:border-white/10'
                }`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Module #{m.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
                      ⚡ Relevance Gain: {m.relevance_gain}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      ⏱ Duration: {m.duration}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {m.course}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Priority urgency: <strong className="text-slate-700 dark:text-slate-200">{m.urgency}</strong>. 
                    Targeted to strengthen enterprise competency standards.
                  </p>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <button
                    disabled={isSaving}
                    onClick={() => handleStatusChange(m.course, 'not_started')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      m.status === 'not_started'
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-black'
                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    Not Started
                  </button>

                  <button
                    disabled={isSaving}
                    onClick={() => handleStatusChange(m.course, 'in_progress')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isInProgress
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <Clock size={12} />
                    <span>In Progress</span>
                  </button>

                  <button
                    disabled={isSaving}
                    onClick={() => handleStatusChange(m.course, 'completed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-emerald-500 text-white font-black shadow-xs dark:shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    <span>Completed</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
