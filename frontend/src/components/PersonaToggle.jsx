import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { UserCheck, Shield, Users, ChevronRight } from 'lucide-react';

export default function PersonaToggle() {
  const { 
    persona, setPersona, 
    staffMember, staffEmployeeId, 
    setIsStaffPickerOpen 
  } = useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleModeChange = (newMode) => {
    setPersona(newMode);
    if (newMode === 'staff') {
      setIsStaffPickerOpen(true);
      if (location.pathname === '/') {
        navigate(`/people/${staffEmployeeId}`);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-2.5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl shadow-xs dark:shadow-inner">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          {persona === 'admin' ? (
            <Shield size={14} className="text-setel-600 dark:text-cyan-400" />
          ) : (
            <UserCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
          )}
          <span>Mode:</span>
        </div>
        <select
          value={persona}
          onChange={(e) => handleModeChange(e.target.value)}
          className="bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl px-2.5 py-1 outline-none border border-slate-200 dark:border-white/10 focus:border-setel-500 dark:focus:border-cyan-400 cursor-pointer transition-colors"
        >
          <option value="admin">Admin / HR</option>
          <option value="staff">Staff View</option>
        </select>
      </div>

      {/* When in Staff Mode: Display active staff avatar with interactive switch button */}
      {persona === 'staff' && (
        <div 
          onClick={() => setIsStaffPickerOpen(true)}
          className="p-2.5 bg-emerald-500/10 dark:bg-cyan-500/10 hover:bg-emerald-500/20 dark:hover:bg-cyan-500/20 border border-emerald-500/30 dark:border-cyan-400/30 rounded-2xl cursor-pointer transition-all duration-200 group flex items-center justify-between shadow-xs"
          title="Click to choose from 26 employee avatars"
        >
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={staffMember?.avatar_url || `https://api.dicebear.com/9.x/micah/svg?seed=employee-${staffEmployeeId}`}
              alt={staffMember?.name || 'Staff Avatar'}
              className="w-7 h-7 rounded-xl object-cover border border-emerald-400 dark:border-cyan-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-black text-slate-900 dark:text-cyan-200 truncate leading-tight">
                {staffMember?.name || `Employee #${staffEmployeeId}`}
              </p>
              <p className="text-[9px] font-bold text-emerald-700 dark:text-cyan-400 truncate">
                Change Avatar (26)
              </p>
            </div>
          </div>
          <ChevronRight size={13} className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </div>
      )}
    </div>
  );
}
