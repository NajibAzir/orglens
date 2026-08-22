import { useContext } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Sparkles, BookOpen, Clock } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function RelevancyGauge({ score = 78, trend = "High market demand", trendDirection = "growing", suggestions = [] }) {
  const { theme } = useContext(AppContext);
  const isDark = theme === 'dark';

  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ];
  
  const COLORS = isDark ? ['#00BFFF', 'rgba(255,255,255,0.06)'] : ['#00BFFF', '#f1f5f9'];

  return (
    <div className="space-y-4">
      {/* Semi-circle Gauge */}
      <div className="h-32 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={58}
              outerRadius={78}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={COLORS[0]} />
              <Cell fill={COLORS[1]} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-3xl font-black text-slate-900 dark:text-slate-50 font-mono tracking-tight">{score}%</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-cyan-400">Relevancy Index</span>
        </div>
      </div>

      {/* Trend Summary Glass Box */}
      <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-white/10 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block mb-1">Industry Trajectory</span>
        <p className="text-slate-800 dark:text-slate-200 font-bold leading-relaxed">{trend}</p>
      </div>

      {/* Upskilling Modules */}
      {suggestions && suggestions.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 block">
            Recommended Upskilling Modules
          </span>
          <div className="space-y-2">
            {suggestions.map((item, idx) => {
              const courseTitle = typeof item === 'object' ? (item.course || item.title || JSON.stringify(item)) : String(item);
              const duration = typeof item === 'object' && item.duration ? item.duration : '3-4 weeks';
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <BookOpen size={14} className="text-setel-500 dark:text-cyan-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{courseTitle}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-cyan-300/80 flex items-center gap-1 flex-shrink-0 ml-2">
                    <Clock size={10} /> {duration}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
