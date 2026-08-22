import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function AdminOnlyRoute({ children }) {
  const { persona } = useContext(AppContext);

  if (persona === 'admin') return children;

  return <HrOnlyNotice />;
}

function HrOnlyNotice() {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-white/10 text-center shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
        <ShieldAlert size={40} className="text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight">
          HR / Admin Access Only
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1.5">
          Role Evolution & History is restricted to HR and admin users.
          Switch to Admin / HR mode to view organisational role changes.
        </p>
        <Link
          to="/org-chart"
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-2xl text-[13px] font-bold bg-gradient-to-r from-setel-500 to-setel-600 dark:from-cyan-400 dark:to-blue-500 text-slate-950 shadow-md shadow-setel-500/20 dark:shadow-[0_0_20px_rgba(0,191,255,0.35)] hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={15} />
          Back to Org Chart
        </Link>
      </div>
    </div>
  );
}
