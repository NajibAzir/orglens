import { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { getEmployees } from '../utils/api';
import { 
  X, Search, Users, Check, Sparkles, Briefcase, 
  Building2, ArrowRight, ShieldCheck, UserCheck
} from 'lucide-react';

export default function StaffPickerModal() {
  const { 
    isStaffPickerOpen, setIsStaffPickerOpen, 
    staffEmployeeId, setStaffEmployeeId, 
    setPersona 
  } = useContext(AppContext);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [activeOnly, setActiveOnly] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Load employees when modal is opened
  useEffect(() => {
    if (!isStaffPickerOpen) return;

    let isMounted = true;
    setLoading(true);
    getEmployees()
      .then((res) => {
        if (isMounted) {
          setEmployees(res.data || []);
        }
      })
      .catch((err) => {
        console.error('Failed to load employees for picker:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isStaffPickerOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isStaffPickerOpen) {
        setIsStaffPickerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStaffPickerOpen, setIsStaffPickerOpen]);

  // Unique departments
  const departments = useMemo(() => {
    const depts = new Set();
    employees.forEach(emp => {
      if (emp.current_department) depts.add(emp.current_department);
    });
    return ['All', ...Array.from(depts)];
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (activeOnly && emp.status === 'exited') return false;

      const matchesDept = selectedDept === 'All' || emp.current_department === selectedDept;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        !term ||
        emp.name?.toLowerCase().includes(term) ||
        emp.email?.toLowerCase().includes(term) ||
        emp.current_role?.toLowerCase().includes(term) ||
        emp.current_department?.toLowerCase().includes(term) ||
        emp.level?.toLowerCase().includes(term);

      return matchesDept && matchesSearch;
    });
  }, [employees, selectedDept, searchTerm, activeOnly]);

  if (!isStaffPickerOpen) return null;

  const handleSelectStaff = (emp) => {
    setStaffEmployeeId(emp.id);
    setPersona('staff');
    setIsStaffPickerOpen(false);

    // If already on a /people/:id page, seamlessly transition to new person's view
    if (location.pathname.startsWith('/people/')) {
      navigate(`/people/${emp.id}`);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md transition-all duration-200 select-none animate-in fade-in"
      onClick={() => setIsStaffPickerOpen(false)}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-[#070D1B] border border-slate-200 dark:border-cyan-500/30 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/50 dark:backdrop-blur-md flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-cyan-500/15 border border-emerald-500/30 dark:border-cyan-400/30 flex items-center justify-center text-emerald-600 dark:text-cyan-400 shadow-sm dark:shadow-[0_0_15px_rgba(0,191,255,0.3)]">
              <UserCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Select Staff Persona
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-cyan-500/20 text-emerald-700 dark:text-cyan-300 border border-emerald-500/30 dark:border-cyan-400/40">
                  26 Avatars Available
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Pick any employee to simulate their personalized OrgLens view (My Career Journey, Role Lens & Wellbeing).
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsStaffPickerOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            title="Close modal (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Filter & Search Toolbar ── */}
        <div className="p-4 border-b border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#070D1B] space-y-3 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, role, email, or level (e.g. L4, Lead)..."
                className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-setel-500 dark:focus:border-cyan-400 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Active Only Filter */}
            <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer self-center whitespace-nowrap bg-slate-100 dark:bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="rounded text-setel-600 dark:text-cyan-400 focus:ring-0 cursor-pointer"
              />
              <span>Active Employees Only</span>
            </label>
          </div>

          {/* Department Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-setel-500 dark:bg-cyan-400 text-slate-950 font-black shadow-xs dark:shadow-[0_0_12px_rgba(0,191,255,0.4)]'
                    : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200/60 dark:border-white/5'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* ── Employee Avatar Grid ── */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/50 dark:bg-[#030712]/50 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
              <div className="w-8 h-8 border-3 border-setel-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold">Loading organization roster...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center">
              <Users size={36} className="opacity-30 mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No employees match your search</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredEmployees.map((emp) => {
                const isSelected = emp.id === staffEmployeeId;
                const isExited = emp.status === 'exited';

                return (
                  <div
                    key={emp.id}
                    onClick={() => handleSelectStaff(emp)}
                    className={`relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer group flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-setel-50/80 dark:bg-cyan-950/40 border-setel-500 dark:border-cyan-400 shadow-md dark:shadow-[0_0_20px_rgba(0,191,255,0.25)] ring-2 ring-setel-400/40 dark:ring-cyan-400/30'
                        : 'bg-white/90 dark:bg-[#0C1527]/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200/80 dark:border-white/10 hover:border-setel-300 dark:hover:border-cyan-400/50 shadow-xs hover:shadow-md'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={emp.avatar_url || `https://api.dicebear.com/9.x/micah/svg?seed=${emp.name}`}
                        alt={emp.name}
                        className={`w-12 h-12 rounded-2xl object-cover bg-slate-100 dark:bg-slate-900 border-2 transition-transform duration-200 group-hover:scale-105 ${
                          isSelected
                            ? 'border-setel-500 dark:border-cyan-400 shadow-[0_0_10px_rgba(0,191,255,0.4)]'
                            : 'border-slate-200 dark:border-white/10 group-hover:border-setel-400 dark:group-hover:border-cyan-400'
                        }`}
                      />
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-900">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className={`text-xs font-black truncate ${
                          isSelected ? 'text-setel-900 dark:text-cyan-200' : 'text-slate-900 dark:text-slate-100 group-hover:text-setel-600 dark:group-hover:text-cyan-300'
                        }`}>
                          {emp.name}
                        </h3>
                        {emp.level && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0">
                            {emp.level}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                        {emp.current_role || (isExited ? 'Former Employee' : 'Unassigned')}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2">
                        {emp.current_department && (
                          <span 
                            className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border truncate"
                            style={{
                              backgroundColor: emp.department_color ? `${emp.department_color}15` : '#64748B15',
                              borderColor: emp.department_color ? `${emp.department_color}40` : '#64748B40',
                              color: emp.department_color || '#64748B',
                            }}
                          >
                            {emp.current_department}
                          </span>
                        )}
                        {isExited && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/30">
                            Exited
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 ml-auto">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-slate-900/60 dark:backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Sparkles size={14} className="text-setel-500 dark:text-cyan-400 flex-shrink-0" />
            <span>Click any avatar to immediately switch the app's perspective to that employee.</span>
          </div>

          <button
            onClick={() => setIsStaffPickerOpen(false)}
            className="px-4 py-1.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
