import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees } from '../utils/api';
import { AppContext } from '../context/AppContext';
import { Search, User, Briefcase, Building2, TrendingUp, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function PersonJourney() {
  const { persona, staffEmployeeId } = useContext(AppContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployees();
        setEmployees(res.data || []);
      } catch (err) {
        setError('Failed to load employee directory.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const departments = ['All', ...new Set(employees.map(e => e.department).filter(Boolean))];

  const filteredEmployees = employees.filter(emp => {
    // If staff mode, only show their own profile
    if (persona === 'staff' && emp.id !== staffEmployeeId) return false;

    const matchesSearch = 
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.current_role?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading talent profiles...</div>;
  if (error) return <div className="p-8 text-rose-500 font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
            People Lens
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-1">Talent Journey & Career Velocity</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Track employee career timelines, mobility speed, stagnation risk, and work telemetry.
        </p>
      </div>

      {/* Search & Filter Glass Bar */}
      {persona === 'admin' && (
        <div className="bg-white dark:bg-[#101B33] p-4 rounded-3xl shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search talent by name, role, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#090F1D] border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-[#090F1D] focus:border-setel-500 dark:focus:border-cyan-400 outline-none transition-all"
            />
          </div>

          {/* Department Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
      )}

      {/* Talent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white dark:bg-[#101B33] rounded-3xl p-5 border border-slate-200 dark:border-slate-700/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] hover:border-setel-300 dark:hover:border-cyan-400/80 dark:hover:shadow-[0_0_25px_rgba(0,191,255,0.25)] transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* Header: Avatar + Info */}
              <div className="flex flex-col items-center text-center gap-2 mb-5 mt-1">
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
                <div className="overflow-hidden w-full">
                  <h2 className="text-base font-black text-slate-900 dark:text-slate-50 group-hover:text-setel-600 dark:group-hover:text-cyan-300 transition-colors leading-tight">
                    {emp.name}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
                    {emp.current_role || 'Staff Member'}
                  </p>
                </div>
              </div>

              {/* Clean Seamless Meta Container */}
              <div className="bg-slate-50 dark:bg-[#090F1D] border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-slate-400 font-bold">Department</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{emp.department || 'Engineering'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-slate-400 font-bold">Hire Date</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">{emp.hire_date || '2021-01-01'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-slate-400 font-bold">Career Velocity</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    emp.career_health === 'high'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                      : emp.career_health === 'stagnating'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                      : 'bg-setel-50 dark:bg-cyan-950/40 text-setel-700 dark:text-cyan-300 border border-setel-200 dark:border-cyan-500/30'
                  }`}>
                    {emp.career_health === 'high' ? '⚡ Fast Track' : emp.career_health === 'stagnating' ? '⚠️ Stagnation Risk' : 'Steady Growth'}
                  </span>
                </div>
              </div>
            </div>

            {/* Seamless Footer (No top border line) */}
            <div className="mt-4 pt-1 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
                {emp.movements_count || 1} movement{emp.movements_count !== 1 ? 's' : ''}
              </span>
              <Link
                to={`/people/${emp.id}`}
                className="inline-flex items-center gap-1 text-xs font-black text-setel-600 dark:text-cyan-400 hover:text-setel-700 dark:hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform"
              >
                View Journey <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
