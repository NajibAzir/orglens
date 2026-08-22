import { useState } from 'react';
import { HeartPulse, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WellbeingCard({ checkin, persona = 'admin' }) {
  const [dismissed, setDismissed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (dismissed) return null;

  // Already responded - show completed summary
  if (checkin.responded) {
    const stressLabel = ['', 'Struggling', 'Adjusting', 'Neutral', 'Coping Well', 'Thriving'][checkin.stressLevel] || 'Responded';
    const stressColor = checkin.stressLevel >= 4
      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30'
      : checkin.stressLevel >= 3
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/30'
      : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/30';

    return (
      <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200/60 dark:border-emerald-500/30">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-50">Check-in Completed</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Responded on {checkin.responseDate || 'N/A'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Trigger Info */}
          <div className="bg-slate-50/80 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1">Trigger Event</span>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {checkin.changes?.[0] || 'Organizational change'}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              {checkin.changesCount} organizational change{checkin.changesCount !== 1 ? 's' : ''} • {checkin.triggerDate}
            </p>
          </div>

          {/* Stress Level */}
          {checkin.stressLevel && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Wellbeing Score</span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${stressColor}`}>
                {checkin.stressLevel}/5 — {stressLabel}
              </span>
            </div>
          )}

          {/* Notes */}
          {checkin.notes && (
            <div className="bg-slate-50/80 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1">Employee Notes</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                "{checkin.notes}"
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Just submitted in this session
  if (submitted) {
    return (
      <div className="bg-emerald-50/90 dark:bg-emerald-950/40 backdrop-blur-xl border border-emerald-200 dark:border-emerald-500/40 p-6 rounded-3xl text-center shadow-sm dark:shadow-[0_0_20px_rgba(52,211,153,0.2)]">
        <HeartPulse className="mx-auto text-emerald-500 mb-2" size={32} />
        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-1">Thank you for your feedback!</h3>
        <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Your responses help us proactively support your team transition.</p>
      </div>
    );
  }

  // Pending - show differently based on persona
  if (persona === 'admin') {
    // Admin sees status summary only, not the questionnaire
    return (
      <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl border border-amber-200 dark:border-amber-500/30 p-5 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-200/60 dark:border-amber-500/30">
            <AlertCircle size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-50">Pending Response</h3>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Awaiting employee feedback</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-50/80 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1">Trigger Event</span>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {checkin.changes?.[0] || 'Organizational change'}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              {checkin.changesCount} organizational change{checkin.changesCount !== 1 ? 's' : ''} • {checkin.triggerDate}
            </p>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Sent to: {checkin.name}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              Not yet responded
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Staff sees the questionnaire
  return (
    <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl border border-amber-200 dark:border-amber-500/30 p-6 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] relative">
      <button onClick={() => setDismissed(true)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <X size={18} />
      </button>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-setel-50 dark:bg-cyan-950/50 text-setel-600 dark:text-cyan-400 rounded-2xl border border-setel-200/60 dark:border-cyan-500/30">
          <HeartPulse size={22} />
        </div>
        <h2 className="text-base font-black text-slate-900 dark:text-slate-50">Transition Wellbeing Check-in</h2>
      </div>
      
      <p className="text-slate-700 dark:text-slate-300 text-xs mb-3 font-medium">
        Hi {checkin.name.split(' ')[0]}, you have had <strong className="text-slate-900 dark:text-slate-100 font-bold">{checkin.changesCount} organizational changes</strong> in the last 90 days:
      </p>
      <ul className="list-disc pl-5 mb-5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
        {checkin.changes.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
      
      <div className="bg-slate-50/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 mb-5">
        <p className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-xs">How well are you adjusting to these structural changes?</p>
        <div className="flex justify-between items-center px-2">
          <span className="text-[10px] font-bold text-slate-400">Struggling</span>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map(n => (
              <label key={n} className="flex flex-col items-center gap-1 cursor-pointer group">
                <input type="radio" name="stress" value={n} className="accent-setel-500 dark:accent-cyan-400 cursor-pointer" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-setel-500 dark:group-hover:text-cyan-400">{n}</span>
              </label>
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400">Thriving</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <a href="#" className="text-xs font-bold text-setel-600 dark:text-cyan-400 hover:underline">View transition resources</a>
        <button 
          onClick={() => setSubmitted(true)} 
          className="bg-setel-500 dark:bg-cyan-400 hover:bg-setel-400 dark:hover:bg-cyan-300 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-sm dark:shadow-[0_0_15px_rgba(0,191,255,0.4)] transition-all"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
