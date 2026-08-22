import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRoleRelevancyAll, getMacroTrends } from '../utils/api';
import { 
  TrendingUp, TrendingDown, Minus, Sparkles, ShieldAlert, 
  Search, ArrowRight, Zap, Target, BookOpen, Layers, CheckCircle2, AlertTriangle, ChevronDown 
} from 'lucide-react';

export default function RoleRelevancyTrends() {
  const [roles, setRoles] = useState([]);
  const [macroTrends, setMacroTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [trendFilter, setTrendFilter] = useState('All');
  const [macroTrendsOpen, setMacroTrendsOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rolesRes, trendsRes] = await Promise.all([
          getRoleRelevancyAll(),
          getMacroTrends()
        ]);
        setRoles(rolesRes.data || []);
        setMacroTrends(trendsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch relevancy data:', err);
        setError('Failed to load role relevancy and technology trends data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const departments = ['All', ...new Set(roles.map(r => r.department_name).filter(Boolean))];

  const filteredRoles = roles.filter(r => {
    const matchesDept = selectedDept === 'All' || r.department_name === selectedDept;
    const matchesTrend = trendFilter === 'All' || r.trend_direction === trendFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term ||
      r.title?.toLowerCase().includes(term) ||
      r.code?.toLowerCase().includes(term) ||
      r.department_name?.toLowerCase().includes(term) ||
      r.industry_trend?.toLowerCase().includes(term);

    return matchesDept && matchesTrend && matchesSearch;
  });

  const avgScore = roles.length 
    ? (roles.reduce((acc, r) => acc + (r.relevancy_score || 0), 0) / roles.length).toFixed(2)
    : '0.00';
  const highGrowthCount = roles.filter(r => (r.relevancy_score || 0) >= 0.85).length;
  const atRiskCount = roles.filter(r => (r.relevancy_score || 0) < 0.6).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-setel-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold">Analyzing market technology trends & role relevancy...</p>
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
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              Role Lens Intelligence
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Market Viability & Automation Forecast
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
            Role Relevancy & Technology Trends
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-3xl mt-1">
            Track industry technological shifts, identify skills obsolescence risks, and evaluate role demand trajectories across your organization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/upskilling"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-setel-500 to-setel-600 dark:from-cyan-400 dark:to-blue-500 text-slate-950 font-black text-xs shadow-md shadow-setel-500/20 dark:shadow-[0_0_20px_rgba(0,191,255,0.35)] hover:scale-105 transition-all"
          >
            <BookOpen size={14} />
            <span>Staff Upskill Recommendations →</span>
          </Link>
        </div>
      </div>

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Organization Relevancy</p>
            <Zap size={16} className="text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{Math.round(avgScore * 100)}%</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Index {avgScore}/1.0</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Evaluated across all 23 distinct roles</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">High Growth Roles</p>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{highGrowthCount}</span>
            <span className="text-xs font-bold text-slate-400">roles (&gt; 85%)</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Surging market demand & AI expansion</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Obsolescence / At-Risk</p>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">{atRiskCount}</span>
            <span className="text-xs font-bold text-slate-400">roles (&lt; 60%)</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Immediate upskilling required (e.g. Manual QA)</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Macro Tech Shifts</p>
            <Sparkles size={16} className="text-cyan-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{macroTrends.length}</span>
            <span className="text-xs font-bold text-slate-400">active waves</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Driving organization skill mutations</p>
        </div>
      </div>

      {/* ── Macro Technology Trends Radar ── */}
      <div className="space-y-3">
        <button 
          onClick={() => setMacroTrendsOpen(!macroTrendsOpen)}
          className="w-full flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-500 dark:text-cyan-400" />
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Technology Macro-Trends Radar
            </h2>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {macroTrends.length} trends
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">
              Market Signals & AI Transformations
            </span>
            <ChevronDown 
              size={16} 
              className={`text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${macroTrendsOpen ? 'rotate-0' : '-rotate-90'}`} 
            />
          </div>
        </button>

        {macroTrendsOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {macroTrends.map((trend) => {
            const isUp = trend.trend_direction === 'up';
            return (
              <div 
                key={trend.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0A1224]/90 border border-slate-200 dark:border-white/10 shadow-xs hover:border-cyan-400/50 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {trend.category}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">
                        {trend.title}
                      </h3>
                    </div>

                    <div className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 flex-shrink-0 ${
                      isUp 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    }`}>
                      {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      <span>{trend.market_impact}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed">
                    {trend.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Affected Roles: </span>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {trend.affected_roles?.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Skills: </span>
                    {trend.recommended_skills?.map((sk) => (
                      <span 
                        key={sk} 
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-setel-500/10 dark:bg-cyan-500/15 text-setel-700 dark:text-cyan-300 border border-setel-500/20 dark:border-cyan-400/30"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* ── Role Relevancy Evaluation Matrix ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Role Relevancy & Automation Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed viability scores, market trends, and recommended upskilling pathways for every role.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search roles or trends..."
                className="pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none"
            >
              {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
            </select>

            <select
              value={trendFilter}
              onChange={(e) => setTrendFilter(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none"
            >
              <option value="All">All Trajectories</option>
              <option value="up">Growing (↗)</option>
              <option value="stable">Stable (→)</option>
              <option value="down">Declining (↘)</option>
            </select>
          </div>
        </div>

        {/* Roles Table */}
        <div className="rounded-3xl bg-white dark:bg-[#0A1224]/80 border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/60 text-slate-400 uppercase text-[10px] font-black tracking-wider">
                  <th className="py-3.5 px-5">Role & Code</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Occupants</th>
                  <th className="py-3.5 px-4">Relevancy Score</th>
                  <th className="py-3.5 px-4">Market Trajectory</th>
                  <th className="py-3.5 px-5">Industry Rationale & Upskill Courses</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredRoles.map((role) => {
                  const score = role.relevancy_score || 0.8;
                  const scorePct = Math.round(score * 100);
                  const isLow = score < 0.6;
                  const isHigh = score >= 0.85;

                  return (
                    <tr 
                      key={role.role_id}
                      className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors"
                    >
                      {/* Title & Code */}
                      <td className="py-4 px-5">
                        <Link 
                          to={`/roles/${role.role_id}`}
                          className="font-black text-slate-900 dark:text-white hover:text-setel-600 dark:hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                        >
                          <span>{role.title}</span>
                        </Link>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          {role.code || `ROLE-${role.role_id}`} • Level {role.level || 'L4'}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span 
                          className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg border"
                          style={{
                            backgroundColor: role.department_color ? `${role.department_color}15` : '#64748B15',
                            borderColor: role.department_color ? `${role.department_color}40` : '#64748B40',
                            color: role.department_color || '#64748B',
                          }}
                        >
                          {role.department_name || 'Engineering'}
                        </span>
                      </td>

                      {/* Occupant Count */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <span className={`text-xs font-black ${
                          role.occupant_count === 0 
                            ? 'text-slate-400 dark:text-slate-500' 
                            : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {role.occupant_count || 0}
                        </span>
                        <span className="text-[9px] text-slate-400 ml-1">
                          {role.occupant_count === 0 ? 'vacant' : role.occupant_count === 1 ? 'person' : 'people'}
                        </span>
                      </td>

                      {/* Score Gauge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1 w-32">
                          <div className="flex items-center justify-between text-[11px] font-black">
                            <span className={isLow ? 'text-rose-500' : isHigh ? 'text-emerald-500' : 'text-amber-500'}>
                              {scorePct}%
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {score.toFixed(2)} / 1.0
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isLow 
                                  ? 'bg-rose-500' 
                                  : isHigh 
                                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' 
                                  : 'bg-amber-400'
                              }`}
                              style={{ width: `${scorePct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Trajectory */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {role.trend_direction === 'up' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            <TrendingUp size={12} /> Growing
                          </span>
                        )}
                        {role.trend_direction === 'down' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                            <TrendingDown size={12} /> Declining
                          </span>
                        )}
                        {role.trend_direction === 'stable' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10">
                            <Minus size={12} /> Stable
                          </span>
                        )}
                      </td>

                      {/* Industry Rationale & Courses */}
                      <td className="py-4 px-5 max-w-md">
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] font-medium leading-tight line-clamp-2">
                          {role.industry_trend}
                        </p>
                        {role.upskill_suggestions && role.upskill_suggestions.length > 0 && (
                          <div className="mt-2 group relative">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-setel-50 dark:bg-cyan-950/40 text-setel-700 dark:text-cyan-300 border border-setel-200 dark:border-cyan-500/30 cursor-default">
                              <BookOpen size={11} />
                              {role.upskill_suggestions.length} course{role.upskill_suggestions.length !== 1 ? 's' : ''} recommended
                            </span>
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 w-72">
                              <div className="bg-white dark:bg-[#0C1527] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] p-3 space-y-1.5">
                                {role.upskill_suggestions.map((sug, sIdx) => (
                                  <div key={sIdx} className="flex items-start gap-2 text-[10px]">
                                    <span className="text-setel-500 dark:text-cyan-400 mt-0.5 flex-shrink-0">•</span>
                                    <div>
                                      <p className="font-bold text-slate-800 dark:text-slate-200">{sug.course}</p>
                                      <p className="text-slate-400">{sug.duration} • {sug.relevance_gain || '+20%'} relevance</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/roles/${role.role_id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-setel-600 dark:text-cyan-400 hover:underline"
                        >
                          <span>Explore Role</span>
                          <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
