import { Link } from 'react-router-dom';

function formatDuration(startDate, endDate) {
  if (!startDate) return '';
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30.44));
  
  if (months < 1) return 'Less than 1 month';
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years} yr${years !== 1 ? 's' : ''} ${remainingMonths} mo`;
}

function capitalizeReason(reason) {
  if (!reason) return 'Assigned';
  return reason.charAt(0).toUpperCase() + reason.slice(1);
}

export default function PersonMilestoneCard({ milestone }) {
  const reason = capitalizeReason(milestone.reason);
  
  const getBadgeColor = (r) => {
    switch (r.toLowerCase()) {
      case 'hired': return 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30';
      case 'promoted': return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30';
      case 'transferred': return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30';
      case 'lateral': case 'lateral move': return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30';
      case 'exited': return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30';
      case 'role_expanded': case 'scope_increase': return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30';
      default: return 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5';
    }
  };

  const roleTitle = milestone.roleTitle || milestone.title || 'Unknown Role';
  const roleId = milestone.roleId || milestone.role_id;
  const date = milestone.date || milestone.start_date;
  const department = milestone.department || 'Engineering';
  const manager = milestone.manager || milestone.manager_name || 'Leadership';
  const duration = milestone.duration || formatDuration(milestone.start_date, milestone.end_date);
  const isCurrentRole = !milestone.end_date;

  return (
    <div className="flex gap-4">
      <div className="w-24 flex-shrink-0 text-xs font-mono font-bold text-slate-400 dark:text-slate-400 pt-1 text-right">{date}</div>
      <div className="relative flex flex-col items-center">
        <div className="w-3 h-3 bg-setel-500 dark:bg-cyan-400 rounded-full mt-1.5 shadow-xs dark:shadow-[0_0_10px_rgba(0,191,255,0.8)]" />
        <div className="w-px h-full bg-slate-200 dark:bg-white/10 my-2" />
      </div>
      <div className="pb-6 w-full">
        <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 w-full backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <Link to={`/roles/${roleId}`} className="font-black text-slate-900 dark:text-slate-100 hover:text-setel-600 dark:hover:text-cyan-300 transition-colors text-sm">
              {roleTitle}
            </Link>
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${getBadgeColor(reason)}`}>
              {reason}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs mt-3">
            <div>
              <p className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold">Department</p>
              <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{department}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold">Reporting Manager</p>
              <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{manager}</p>
            </div>
            <div className="col-span-2 mt-1 pt-2 border-t border-slate-200/60 dark:border-white/5">
              <p className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold">Duration in Role</p>
              <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                {duration}{isCurrentRole ? ' (current)' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
