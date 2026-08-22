import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function TimelineScrubber() {
  const { selectedDate, activeScenarioId, scenarioLabel } = useContext(AppContext);

  const displayMonth = new Date(selectedDate).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-xs border border-slate-200 dark:border-white/10 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Viewing As Of</span>
        <span className="text-sm font-black text-slate-900 dark:text-slate-100 font-mono">{displayMonth}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-setel-500 dark:bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,191,255,0.8)]" />
        <span className="text-xs font-bold text-setel-700 dark:text-cyan-300">
          Scenario {activeScenarioId}: {scenarioLabel(activeScenarioId)}
        </span>
      </div>
    </div>
  );
}
