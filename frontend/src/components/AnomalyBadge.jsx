import { AlertTriangle, Info } from 'lucide-react';

export default function AnomalyBadge({ type, message }) {
  const isWarning = type === 'warning';
  
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${
      isWarning ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-sky-50 border-sky-200 text-sky-800'
    }`}>
      {isWarning ? <AlertTriangle className="text-amber-500 mt-0.5 flex-shrink-0" size={18} /> : <Info className="text-sky-500 mt-0.5 flex-shrink-0" size={18} />}
      <div className="text-sm font-medium">{message}</div>
    </div>
  );
}
