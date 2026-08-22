import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRoles } from '../utils/api';
import { 
  Briefcase, Search, TrendingUp, TrendingDown, Minus, 
  Users, ChevronRight, Layers, ArrowRight, LayoutGrid, List
} from 'lucide-react';

export default function RoleHistory() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRoles();
        setRoles(res.data || []);
      } catch (err) {
        setError('Failed to load roles.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const departments = ['All', ...new Set(roles.map(r => r.department_name).filter(Boolean))];

  const filteredRoles = roles.filter(role => {
    const matchesSearch = 
      role.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.tech_stack && role.tech_stack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesDept = selectedDept === 'All' || role.department_name === selectedDept;
    return matchesSearch && matchesDept;
  });

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading role intelligence...</div>;
  if (error) return <div className="p-8 text-rose-500 font-medium">{error}</div>;

  const getTrendBadge = (trend) => {
    if (trend === 'growing') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 dark:shadow-[0_0_10px_rgba(52,211,153,0.2)]">
          <TrendingUp size={11} /> High Demand
        </span>
      );
    }
    if (trend === 'declining') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 dark:shadow-[0_0_10px_rgba(244,63,94,0.2)]">
          <TrendingDown size={11} /> Automation Risk
        </span>
      );
    }
    if (trend === 'transforming') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 dark:shadow-[0_0_10px_rgba(251,191,36,0.2)]">
          <Layers size={11} /> Transforming
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5">
        <Minus size={11} /> Stable
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-setel-50 dark:bg-cyan-950/40 text-setel-700 dark:text-cyan-300 border border-setel-200 dark:border-cyan-500/30">
            Role Lens
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">Role Evolution & Tech Trends</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Analyze position longevity, mutations (splits & mergers), tech stack relevancy, and historical occupants.
        </p>
      </div>

      {/* Search & Filter Glass Bar */}
      <div className="bg-white dark:bg-[#101B33] p-4 rounded-3xl shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search role, code, or tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#090F1D] border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-[#090F1D] focus:border-setel-500 dark:focus:border-cyan-400 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Department Filter Pills - Horizontal Scroll */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                    selectedDept === dept
                      ? 'bg-setel-500 dark:bg-cyan-400 text-slate-950 shadow-sm dark:shadow-[0_0_15px_rgba(0,191,255,0.4)]'
                      : 'bg-slate-100 dark:bg-[#090F1D] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent dark:border-slate-700/60'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-[#090F1D] rounded-xl border border-slate-200 dark:border-slate-700/80 p-0.5">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-[#1E293B] text-setel-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Card view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-[#1E293B] text-setel-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Roles - Card or List View */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              className="bg-white dark:bg-[#101B33] rounded-3xl p-5 border border-slate-200 dark:border-slate-700/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] hover:border-setel-300 dark:hover:border-cyan-400/80 dark:hover:shadow-[0_0_25px_rgba(0,191,255,0.25)] transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Header: Department + Trend Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span 
                    className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/10"
                    style={{ 
                      backgroundColor: `${role.department_color || '#00BFFF'}25`, 
                      color: role.department_color || '#00BFFF',
                      boxShadow: `0 0 10px ${role.department_color || '#00BFFF'}20`
                    }}
                  >
                    {role.department_name || 'Engineering'}
                  </span>
                  {getTrendBadge(role.relevancy_trend || 'stable')}
                </div>

                {/* Title & Code */}
                <h2 className="text-base font-black text-slate-900 dark:text-slate-50 tracking-tight group-hover:text-setel-600 dark:group-hover:text-cyan-300 transition-colors">
                  {role.title}
                </h2>
                <p className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-400 mt-0.5">
                  {role.code}
                </p>

                {/* Occupant Ribbon */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-[#090F1D] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {role.current_occupant_avatar ? (
                      <img 
                        src={role.current_occupant_avatar} 
                        alt={role.current_occupant_name} 
                        className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-cyan-500/40 shadow-xs flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-setel-100 dark:bg-cyan-950 text-setel-700 dark:text-cyan-300 font-black flex items-center justify-center text-xs flex-shrink-0 border border-setel-200 dark:border-cyan-500/30">
                        {role.current_occupant_name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                        {role.current_occupant_name || 'Vacant Position'}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {role.current_occupant_name ? 'Current Occupant' : 'Immediate Need'}
                      </p>
                    </div>
                  </div>

                  {role.current_occupant_id && (
                    <Link
                      to={`/people/${role.current_occupant_id}`}
                      className="text-[11px] font-bold text-setel-600 dark:text-cyan-400 hover:underline flex-shrink-0 ml-2"
                    >
                      Person →
                    </Link>
                  )}
                </div>

                {/* Tech Stack Chips */}
                {role.tech_stack && role.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {role.tech_stack.slice(0, 4).map((tech, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                    {role.tech_stack.length > 4 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#1E293B] text-slate-400 border border-slate-200/50 dark:border-slate-700">
                        +{role.tech_stack.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* View Evolution Link */}
              <div className="mt-4 pt-1 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
                  {role.history_count || 1} lifecycle event{role.history_count !== 1 ? 's' : ''}
                </span>
                <Link
                  to={`/roles/${role.id}`}
                  className="inline-flex items-center gap-1 text-xs font-black text-setel-600 dark:text-cyan-400 hover:text-setel-700 dark:hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform"
                >
                  View Evolution <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-[#101B33] rounded-3xl border border-slate-200 dark:border-slate-700/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* List Header */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_auto] gap-4 px-5 py-3 bg-slate-50 dark:bg-[#090F1D] border-b border-slate-200 dark:border-slate-700/80">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Department</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Trend</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Occupant</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Tech Stack</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</span>
          </div>

          {/* List Items */}
          {filteredRoles.map((role, index) => (
            <div
              key={role.id}
              className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr_1fr_auto] gap-4 px-5 py-4 items-center hover:bg-slate-50 dark:hover:bg-[#090F1D]/60 transition-colors group ${
                index !== filteredRoles.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/60' : ''
              }`}
            >
              {/* Role Title & Code */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-setel-50 dark:bg-cyan-950/50 text-setel-700 dark:text-cyan-300 font-black flex items-center justify-center text-sm flex-shrink-0 border border-setel-200 dark:border-cyan-500/30">
                  <Briefcase size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 dark:text-slate-50 truncate group-hover:text-setel-600 dark:group-hover:text-cyan-300 transition-colors">
                    {role.title}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
                    {role.code}
                  </p>
                </div>
              </div>

              {/* Department */}
              <div>
                <span 
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/10"
                  style={{ 
                    backgroundColor: `${role.department_color || '#00BFFF'}25`, 
                    color: role.department_color || '#00BFFF'
                  }}
                >
                  {role.department_name || 'Engineering'}
                </span>
              </div>

              {/* Trend */}
              <div>
                {getTrendBadge(role.relevancy_trend || 'stable')}
              </div>

              {/* Occupant */}
              <div className="flex items-center gap-2">
                {role.current_occupant_avatar ? (
                  <img 
                    src={role.current_occupant_avatar} 
                    alt={role.current_occupant_name} 
                    className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-cyan-500/40 flex-shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-setel-100 dark:bg-cyan-950 text-setel-700 dark:text-cyan-300 font-black flex items-center justify-center text-[10px] flex-shrink-0 border border-setel-200 dark:border-cyan-500/30">
                    {role.current_occupant_name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {role.current_occupant_name || 'Vacant'}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {role.history_count || 1} event{role.history_count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1">
                {role.tech_stack && role.tech_stack.slice(0, 3).map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
                {role.tech_stack && role.tech_stack.length > 3 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#1E293B] text-slate-400 border border-slate-200/50 dark:border-slate-700">
                    +{role.tech_stack.length - 3}
                  </span>
                )}
              </div>

              {/* Action */}
              <Link
                to={`/roles/${role.id}`}
                className="inline-flex items-center gap-1 text-xs font-black text-setel-600 dark:text-cyan-400 hover:text-setel-700 dark:hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform whitespace-nowrap"
              >
                View <ArrowRight size={13} />
              </Link>
            </div>
          ))}

          {filteredRoles.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-slate-400 dark:text-slate-500 font-medium">
              No roles found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
