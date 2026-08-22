import { Link } from 'react-router-dom';

export default function RoleTimelineCard({ event }) {
  const getBadgeColor = (type) => {
    switch (type) {
      case 'Created': return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30';
      case 'New Occupant': return 'bg-setel-50 dark:bg-cyan-950/40 text-setel-700 dark:text-cyan-300 border border-setel-200 dark:border-cyan-500/30';
      case 'Vacated': return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30';
      case 'Renamed': return 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30';
      case 'Split': return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30';
      case 'Merged': return 'bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-500/30';
      case 'Reporting Change': return 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30';
      default: return 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5';
    }
  };

  return (
    <div className="flex gap-4">
      <div className="w-24 flex-shrink-0 text-xs font-mono font-bold text-slate-400 dark:text-slate-400 pt-1 text-right">{event.date}</div>
      <div className="relative flex flex-col items-center">
        <div className="w-3 h-3 bg-setel-500 dark:bg-cyan-400 rounded-full mt-1.5 shadow-xs dark:shadow-[0_0_10px_rgba(0,191,255,0.8)]" />
        <div className="w-px h-full bg-slate-200 dark:bg-white/10 my-2" />
      </div>
      <div className="pb-6 flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${getBadgeColor(event.type)}`}>
            {event.type}
          </span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-xs font-medium leading-relaxed">{event.details}</p>
        {event.occupantId && (
          <Link to={`/people/${event.occupantId}`} className="text-xs font-bold text-setel-600 dark:text-cyan-400 hover:text-setel-700 dark:hover:text-cyan-300 hover:underline mt-1.5 inline-block transition-colors">
            View {event.occupantName}&apos;s Journey (Dual-Lens) →
          </Link>
        )}
      </div>
    </div>
  );
}
