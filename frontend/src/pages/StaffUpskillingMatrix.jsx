import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUpskillingRecommendations } from '../utils/api';
import { 
  BookOpen, Search, Users, Sparkles, CheckCircle2, Clock, 
  AlertCircle, ArrowRight, ShieldCheck, GraduationCap, ChevronRight 
} from 'lucide-react';

export default function StaffUpskillingMatrix() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getUpskillingRecommendations();
        setRecommendations(res.data || []);
      } catch (err) {
        console.error('Failed to load upskilling recommendations:', err);
        setError('Failed to load employee upskilling matrix.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const departments = ['All', ...new Set(recommendations.map(r => r.department_name).filter(Boolean))];

  const filteredData = recommendations.filter(item => {
    const matchesDept = selectedDept === 'All' || item.department_name === selectedDept;
    const matchesUrgency = selectedUrgency === 'All' || item.urgency === selectedUrgency;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term ||
      item.employee_name?.toLowerCase().includes(term) ||
      item.current_role?.toLowerCase().includes(term) ||
      item.department_name?.toLowerCase().includes(term) ||
      item.courses?.some(c => c.course?.toLowerCase().includes(term));

    return matchesDept && matchesUrgency && matchesSearch;
  });

  const highUrgencyCount = recommendations.filter(r => r.urgency === 'High').length;
  const inProgressCount = recommendations.reduce((acc, r) => acc + (r.courses?.filter(c => c.status === 'in_progress').length || 0), 0);
  const completedCount = recommendations.reduce((acc, r) => acc + (r.courses?.filter(c => c.status === 'completed').length || 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-setel-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold">Loading organization talent upskilling matrix...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-500 font-bold text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Talent Development Matrix
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Active Employee Learning Roadmaps
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
            Staff Upskill Recommendations
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-3xl mt-1">
            Proactively bridge technological skill gaps, monitor training progression across teams, and elevate workforce readiness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/relevancy"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            <span>← Role Relevancy Radar</span>
          </Link>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled Talent</p>
            <Users size={16} className="text-setel-600 dark:text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{recommendations.length}</span>
            <span className="text-xs font-bold text-slate-400">active staff</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Across 5 operating departments</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">High Urgency Pathways</p>
            <AlertCircle size={16} className="text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">{highUrgencyCount}</span>
            <span className="text-xs font-bold text-slate-400">employees</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">At-risk roles requiring immediate upskilling</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Course Modules</p>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{inProgressCount}</span>
            <span className="text-xs font-bold text-slate-400">in progress</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Modules currently being completed</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Milestones</p>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
            <span className="text-xs font-bold text-slate-400">graduated</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Verified competency advancements</p>
        </div>
      </div>

      {/* ── Filter Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0A1224]/80 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee, role, or course title..."
            className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none"
          >
            {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none"
          >
            <option value="All">All Urgencies</option>
            <option value="High">High Urgency</option>
            <option value="Medium">Medium Urgency</option>
            <option value="Low">Low Urgency</option>
          </select>
        </div>
      </div>

      {/* ── Employee Upskilling Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((emp) => {
          const score = emp.relevancy_score || 0.8;
          const scorePct = Math.round(score * 100);
          const isHighUrgency = emp.urgency === 'High';

          return (
            <div
              key={emp.employee_id}
              className={`p-5 rounded-3xl bg-white dark:bg-[#0A1224]/90 border transition-all duration-200 flex flex-col justify-between shadow-xs ${
                isHighUrgency 
                  ? 'border-rose-500/40 dark:border-rose-500/30 hover:shadow-rose-500/10'
                  : 'border-slate-200 dark:border-white/10 hover:border-cyan-400/50'
              }`}
            >
              <div>
                {/* Employee Header */}
                <div className="flex items-start gap-3">
                  <img
                    src={emp.avatar_url || `https://api.dicebear.com/9.x/micah/svg?seed=${emp.employee_name}`}
                    alt={emp.employee_name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200 dark:border-white/10 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <Link
                        to={`/people/${emp.employee_id}`}
                        className="text-xs font-black text-slate-900 dark:text-white hover:text-setel-600 dark:hover:text-cyan-300 truncate"
                      >
                        {emp.employee_name}
                      </Link>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isHighUrgency 
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                          : emp.urgency === 'Medium'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                      }`}>
                        {emp.urgency}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                      {emp.current_role}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span 
                        className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border truncate"
                        style={{
                          backgroundColor: emp.department_color ? `${emp.department_color}15` : '#64748B15',
                          borderColor: emp.department_color ? `${emp.department_color}40` : '#64748B40',
                          color: emp.department_color || '#64748B',
                        }}
                      >
                        {emp.department_name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 font-bold">
                        Level {emp.level || 'L4'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Relevancy Meter */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500 dark:text-slate-400">Current Role Relevancy</span>
                    <span className={score < 0.6 ? 'text-rose-500 font-black' : 'text-emerald-500 font-black'}>
                      {scorePct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        score < 0.6 ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                      }`}
                      style={{ width: `${scorePct}%` }}
                    />
                  </div>
                </div>

                {/* Recommended Upskilling Courses */}
                <div className="mt-4 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Recommended Learning Modules
                  </p>
                  <div className="space-y-1.5">
                    {emp.courses?.map((c, idx) => (
                      <div 
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate text-[11px]">
                            {c.course}
                          </p>
                          <p className="text-[9px] text-slate-400 font-medium">
                            {c.duration} • <span className="text-emerald-500 font-bold">{c.relevance_gain} relevance</span>
                          </p>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                          c.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                            : c.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {c.status === 'completed' ? 'Done' : c.status === 'in_progress' ? 'Learning' : 'Assigned'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="text-[10px] font-bold text-slate-400">
                  <span>Pathway Progress: </span>
                  <span className="text-slate-800 dark:text-white font-black">{emp.progress_pct}%</span>
                </div>

                <Link
                  to={`/people/${emp.employee_id}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-setel-600 dark:text-cyan-400 hover:underline"
                >
                  <span>View Profile</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
