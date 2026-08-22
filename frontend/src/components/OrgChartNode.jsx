import { Handle, Position } from '@xyflow/react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

export default function OrgChartNode({ data }) {
  const navigate = useNavigate();
  const isVacant = !data.occupant || data.occupant === 'Vacant';
  const deptColor = data.department_color || '#00BFFF';
  
  const getTrendIcon = (trend) => {
    if (trend === 'growing') return <TrendingUp size={12} className="text-emerald-500 dark:text-emerald-400" title="Growing Relevancy" />;
    if (trend === 'declining') return <TrendingDown size={12} className="text-rose-500 dark:text-rose-400" title="Declining Relevancy" />;
    return <Minus size={12} className="text-slate-400" title="Stable Relevancy" />;
  };

  return (
    <div className="bg-white/95 dark:bg-[#0B1426]/75 backdrop-blur-xl border border-slate-200/90 dark:border-white/15 hover:border-setel-400 dark:hover:border-cyan-400 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] dark:hover:shadow-[0_0_25px_rgba(0,191,255,0.35)] w-64 overflow-hidden transition-all duration-200 group">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3.5 h-3.5 bg-setel-500 dark:bg-cyan-400 border-2 border-white dark:border-slate-950 dark:shadow-[0_0_10px_rgba(0,191,255,0.8)]" 
      />
      
      {/* Node Header Glass Strip */}
      <div 
        className="bg-slate-50 dark:bg-slate-950/80 px-4 py-2.5 text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-all border-b border-slate-200 dark:border-white/10" 
        onClick={() => navigate(`/roles/${data.roleId || 1}`)}
      >
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span 
            className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10"
            style={{ 
              backgroundColor: `${deptColor}25`, 
              color: deptColor,
              boxShadow: `0 0 10px ${deptColor}30`
            }}
          >
            {data.department}
          </span>
          <div className="flex items-center gap-1.5">
            {getTrendIcon(data.trend)}
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-white/10 text-slate-300">
              {data.level || 'L4'}
            </span>
          </div>
        </div>
        <p className="font-extrabold text-xs truncate text-slate-900 dark:text-white mt-1 group-hover:text-setel-600 dark:group-hover:text-cyan-300 transition-colors">
          {data.title}
        </p>
      </div>
      
      {/* Node Occupant Body */}
      <div 
        className={`p-3.5 cursor-pointer transition-colors ${
          isVacant 
            ? 'bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100/80 dark:hover:bg-rose-900/40' 
            : 'hover:bg-setel-50/40 dark:hover:bg-white/5'
        }`} 
        onClick={() => !isVacant && data.employeeId && navigate(`/people/${data.employeeId}`)}
      >
        {isVacant ? (
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-700/50 flex items-center justify-center flex-shrink-0 shadow-xs">
              <AlertTriangle size={16} />
            </div>
            <div>
              <p className="text-xs font-black">Vacant Position</p>
              <p className="text-[10px] text-rose-500 dark:text-rose-300 font-bold">Action Required</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {data.occupant_avatar ? (
              <img 
                src={data.occupant_avatar} 
                alt={data.occupant} 
                className="w-9 h-9 rounded-2xl object-cover border-2 shadow-xs flex-shrink-0 transition-transform group-hover:scale-105" 
                style={{ 
                  borderColor: deptColor,
                  boxShadow: `0 0 10px ${deptColor}40`
                }}
              />
            ) : (
              <div 
                className="w-9 h-9 rounded-2xl font-bold flex items-center justify-center text-xs flex-shrink-0 border-2"
                style={{ 
                  borderColor: deptColor,
                  backgroundColor: `${deptColor}20`,
                  color: deptColor,
                  boxShadow: `0 0 10px ${deptColor}40`
                }}
              >
                {data.occupant?.charAt(0) || 'U'}
              </div>
            )}
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-black text-slate-900 dark:text-slate-100 truncate group-hover:text-setel-600 dark:group-hover:text-cyan-300 transition-colors">
                {data.occupant}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Active Occupant
              </p>
            </div>
          </div>
        )}

        {/* Top Skills Tags */}
        {data.skills && data.skills.length > 0 && !isVacant && (
          <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-white/10">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-md border border-slate-200/50 dark:border-white/5">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3.5 h-3.5 bg-setel-500 dark:bg-cyan-400 border-2 border-white dark:border-slate-950 dark:shadow-[0_0_10px_rgba(0,191,255,0.8)]" 
      />
    </div>
  );
}
