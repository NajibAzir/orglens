import { Link } from 'react-router-dom';

export default function PersonMilestoneCard({ milestone }) {
  const getBadgeColor = (reason) => {
    switch (reason) {
      case 'Hired': return 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30';
      case 'Promoted': return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30';
      case 'Transferred': return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30';
      case 'Lateral Move': return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30';
      default: return 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5';
    }
  };

  return (
    <div className="flex gap-4">
      <div className="w-24 flex-shrink-0 text-xs font-mono font-bold text-slate-400 dark:text-slate-400 pt-1 text-right">{milestone.date}</div>
      <div className="relative flex flex-col items-center">
        <div className="w-3 h-3 bg-setel-500 dark:bg-cyan-400 rounded-full mt-1.5 shadow-xs dark:shadow-[0_0_10px_rgba(0,191,255,0.8)]" />
        <div className="w-px h-full bg-slate-200 dark:bg-white/10 my-2" />
      </div>
      <div className="pb-6 w-full">
        <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 w-full backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <Link to={`/roles/${milestone.roleId}`} className="font-black text-slate-900 dark:text-slate-100 hover:text-setel-600 dark:hover:text-cyan-300 transition-colors text-sm">
              {milestone.roleTitle}
            </Link>
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${getBadgeColor(milestone.reason)}`}>
              {milestone.reason}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs mt-3">
            <div>
              <p className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold">Department</p>
              <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{milestone.department}</p>
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold">Reporting Manager</p>
              <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{milestone.manager || 'Leadership'}</p>
            </div>
            <div className="col-span-2 mt-1 pt-2 border-t border-slate-200/60 dark:border-white/5">
              <p className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold">Duration in Role</p>
              <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{milestone.duration}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
