import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicketing } from '../utils/api';
import WorkDistributionChart from '../components/WorkDistributionChart';
import { 
  ArrowLeft, CheckCircle2, Sparkles, AlertCircle, 
  Briefcase, Building2, TrendingUp, Clock, FileCheck 
} from 'lucide-react';

export default function TicketingDetail() {
  const { id } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTicketing(id);
        setTicketData(res.data);
      } catch (err) {
        setError('Failed to load ticketing analysis.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-slate-500 font-medium">Analyzing Jira work telemetry...</div>;
  if (error) return <div className="p-8 text-rose-500 font-medium">{error}</div>;
  if (!ticketData) return null;

  const { employee, total_hours, distribution, restructuring_recommendation } = ticketData;

  const chartData = (distribution || []).map(d => ({
    name: d.category,
    value: d.percentage,
    hours: d.total_hours
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link to="/ticketing" className="inline-flex items-center gap-1.5 text-xs font-bold text-setel-600 dark:text-cyan-400 hover:text-setel-700 dark:hover:text-cyan-300 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <ArrowLeft size={14} /> Back to Work Analysis
        </Link>
        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-400 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-2xl border border-slate-200 dark:border-white/10">
          Total Logged: {total_hours} Hours
        </span>
      </div>
      
      {/* Employee Header Dossier Glass Card */}
      <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl p-6 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {employee?.avatar_url ? (
            <img 
              src={employee.avatar_url} 
              alt={employee.name} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-setel-400 dark:border-cyan-400 shadow-xs flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-setel-100 dark:bg-cyan-950 text-setel-700 dark:text-cyan-300 font-black flex items-center justify-center text-base border border-setel-200 dark:border-cyan-500/30">
              {employee?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">{employee?.name}</h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Nominal Role: <strong className="text-slate-800 dark:text-slate-200 font-bold">{employee?.current_role || 'Engineering Staff'}</strong> ({employee?.current_department || 'Engineering'})
            </p>
          </div>
        </div>

        <Link
          to={`/people/${id}`}
          className="text-xs font-bold text-setel-700 dark:text-cyan-300 hover:text-setel-800 dark:hover:text-cyan-200 bg-setel-50 dark:bg-cyan-950/40 border border-setel-200 dark:border-cyan-500/30 px-4 py-2 rounded-2xl transition-all"
        >
          View Career Profile →
        </Link>
      </div>

      {/* AI Restructuring Placement Recommendation Engine Banner */}
      {restructuring_recommendation && (
        <div className="bg-gradient-to-r from-[#0B1528] via-[#102447] to-setel-800 dark:from-[#060E1E]/90 dark:via-[#0D1C38]/90 dark:to-[#162D55]/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 text-white shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-slate-700/50 dark:border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-setel-400 dark:text-cyan-300" />
              <span className="text-xs font-black uppercase tracking-wider text-setel-300 dark:text-cyan-300">
                AI Restructuring Staff Placement Engine
              </span>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Confidence: {restructuring_recommendation.fit_confidence}
            </span>
          </div>

          <h2 className="text-lg md:text-xl font-black text-white mt-1">
            Recommended Placement: {restructuring_recommendation.suggested_role} in {restructuring_recommendation.suggested_department}
          </h2>
          <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed font-medium">
            {restructuring_recommendation.reasoning}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-700/50 dark:border-white/10 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-bold uppercase">Dominant Work Profile</span>
              <span className="font-black text-setel-300 dark:text-cyan-300 capitalize">{restructuring_recommendation.dominant_category} ({restructuring_recommendation.dominant_percentage}%)</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-bold uppercase">Target Department</span>
              <span className="font-black text-white">{restructuring_recommendation.suggested_department}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-400 block text-[10px] font-bold uppercase">Action Trigger</span>
              <span className="font-black text-emerald-400">Ready for Reorg Transfer</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Distribution Chart Glass Panel */}
        <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl p-6 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/10">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">Jira Category Breakdown</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">Percentage of total completed story points & hours</p>
          <div className="h-64">
            <WorkDistributionChart data={chartData} />
          </div>
        </div>

        {/* Detailed Breakdown Table Glass Panel */}
        <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl p-6 rounded-3xl shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-slate-200 dark:border-white/10 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">Activity Log Summary</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">Granular task distribution across sprints</p>
            
            <div className="space-y-2.5">
              {distribution.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-setel-500 dark:bg-cyan-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">{d.category}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>{d.count} tasks</span>
                    <span>{d.total_hours} hrs</span>
                    <span className="font-black text-setel-700 dark:text-cyan-300 bg-setel-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-md border border-setel-100 dark:border-cyan-500/30">
                      {d.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <strong className="text-slate-800 dark:text-slate-100">Restructuring Insight:</strong> When planning department splits (e.g. Q3 2023 Platform Engineering), use this empirical work footprint to migrate staff with zero retraining friction.
          </div>
        </div>
      </div>
    </div>
  );
}
