import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Sun, Moon
} from 'lucide-react';

// Milestone markers on the timeline (position %)
const MILESTONES = [
  { year: '2021', pct: 0,    scenario: 1, label: 'Foundation'     },
  { year: '2023', pct: 56,   scenario: 2, label: 'Platform Split' },
  { year: '2025', pct: 89,   scenario: 3, label: 'AI Reorg'       },
];

export default function TopNavCapsule() {
  const { 
    selectedDate, activeScenarioId, scenarioLabel,
    timelineProgress, advanceMonths, setTimelineProgress,
    switchScenario, persona, staffEmployeeId, staffMember,
    setIsStaffPickerOpen,
    theme, setTheme, toggleTheme,
    TIMELINE_START, TIMELINE_END
  } = useContext(AppContext);
  
  const location  = useLocation();
  const navigate  = useNavigate();
  const trackRef  = useRef(null);

  const [isPlaying, setIsPlaying]     = useState(false);
  const [isDragging, setIsDragging]   = useState(false);

  // Auto-play: advance 3 months every 800ms
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      advanceMonths(3);
    }, 800);
    return () => clearInterval(id);
  }, [isPlaying, advanceMonths]);

  // Stop playing when we hit the end
  useEffect(() => {
    if (isPlaying && selectedDate >= TIMELINE_END) {
      setIsPlaying(false);
    }
  }, [selectedDate, isPlaying, TIMELINE_END]);

  // Scrubber drag / click
  const pctFromEvent = useCallback((e) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    return Math.min(100, Math.max(0, (x / rect.width) * 100));
  }, []);

  const handleTrackClick = (e) => {
    setTimelineProgress(pctFromEvent(e));
  };

  const handleThumbDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => setTimelineProgress(pctFromEvent(e));
    const onUp   = ()  => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend',  onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend',  onUp);
    };
  }, [isDragging, pctFromEvent, setTimelineProgress]);

  // Derive display values
  const displayYear  = selectedDate.substring(0, 4);
  const displayMonth = new Date(selectedDate).toLocaleString('en-US', { month: 'short' });

  const isOrgChart = location.pathname === '/org-chart';

  // Shared theme toggle component
  const ThemeToggle = () => (
    <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 p-0.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-inner">
      <button
        type="button"
        onClick={() => setTheme('light')}
        title="Activate Light Mode"
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-white text-amber-700 shadow-sm border border-slate-200'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        <Sun size={13} className={theme === 'light' ? 'text-amber-500' : ''} />
        <span className="text-[11px]">Light</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        title="Activate Cyber Glass Dark Mode"
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,191,255,0.3)]'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        <Moon size={13} className={theme === 'dark' ? 'text-cyan-300' : ''} />
        <span className="text-[11px]">Dark</span>
      </button>
    </div>
  );

  // Shared profile component
  const UserProfile = () => (
    <div 
      onClick={() => {
        if (persona === 'staff') {
          setIsStaffPickerOpen(true);
        }
      }}
      className={`flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10 ${
        persona === 'staff' ? 'cursor-pointer group' : ''
      }`}
      title={persona === 'staff' ? "Click to switch staff avatar (26 available)" : "Admin Persona"}
    >
      <div className="relative">
        <img
          src={persona === 'admin' 
            ? "https://api.dicebear.com/9.x/lorelei/svg?seed=sarah-lim&backgroundColor=b6e3f4,c0aede,d1d4f9"
            : (staffMember?.avatar_url || `https://api.dicebear.com/9.x/micah/svg?seed=employee-${staffEmployeeId}&backgroundColor=b6e3f4,c0aede,d1d4f9`)
          }
          alt="User Avatar"
          className="w-7 h-7 rounded-full object-cover border-2 border-setel-400 dark:border-cyan-400 shadow-xs dark:shadow-[0_0_10px_rgba(0,191,255,0.4)] group-hover:scale-105 transition-transform"
        />
        {persona === 'staff' && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900 animate-pulse" />
        )}
      </div>
      <div className="hidden xl:block text-left">
        <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 leading-none group-hover:text-setel-600 dark:group-hover:text-cyan-300 transition-colors truncate max-w-[120px]">
          {persona === 'admin' ? 'Sarah Lim' : (staffMember?.name || 'Staff Member')}
        </p>
        <p className="text-[9px] text-setel-700 dark:text-cyan-400 font-bold mt-0.5 truncate max-w-[120px]">
          {persona === 'admin' ? 'Admin / HR' : (staffMember?.current_role || 'Staff Member')}
        </p>
      </div>
    </div>
  );

  return isOrgChart ? (
    // FULL HEADER - ORG CHART PAGE
    <div className="w-full px-6 pt-3.5 pb-1.5 flex-shrink-0 z-30">
      <header className="bg-white dark:bg-[#0A1224]/75 dark:backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-md shadow-slate-200/60 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] rounded-2xl px-5 py-2 flex items-center justify-between gap-3 max-w-7xl mx-auto transition-all">
        
        {/* CENTER: Timeline Scrubber (only on /org-chart) */}
        <div className="flex items-center gap-3 flex-1 justify-center min-w-0">
          <>
            {/* Timeline Player Buttons */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 flex-shrink-0">
              {/* Step back 6 months */}
              <button onClick={() => advanceMonths(-6)} title="Rewind 6 months"
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-cyan-400 transition-colors p-0.5">
                <SkipBack size={12} />
              </button>

              {/* Play / Pause */}
              <button 
                onClick={() => {
                  if (!isPlaying && selectedDate >= TIMELINE_END) {
                    switchScenario(1);
                    setTimeout(() => setIsPlaying(true), 50);
                  } else {
                    setIsPlaying(!isPlaying);
                  }
                }}
                title={isPlaying ? "Pause simulation" : "Play timeline (advances 3 months every 0.8s)"}
                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-xs transition-all ${
                  isPlaying 
                    ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-[0_0_12px_rgba(251,191,36,0.5)]' 
                    : 'bg-setel-500 dark:bg-cyan-400 hover:bg-setel-400 dark:hover:bg-cyan-300 text-slate-950 shadow-[0_0_12px_rgba(0,191,255,0.4)]'
                }`}
              >
                {isPlaying 
                  ? <Pause size={10} strokeWidth={3} /> 
                  : <Play  size={10} strokeWidth={3} className="ml-0.5" />
                }
              </button>

              {/* Step forward 6 months */}
              <button onClick={() => advanceMonths(6)} title="Forward 6 months"
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-cyan-400 transition-colors p-0.5">
                <SkipForward size={12} />
              </button>
            </div>

            {/* Visual Timeline Track */}
            <div className="hidden lg:flex items-center gap-2 flex-1 max-w-xs min-w-[180px]">
              {/* Current date pill */}
              <span className="text-[10px] font-black text-slate-800 dark:text-cyan-300 font-mono whitespace-nowrap w-14 text-right">
                {displayMonth} {displayYear}
              </span>

              {/* Scrubber track */}
              <div 
                ref={trackRef}
                onClick={handleTrackClick}
                className="relative flex-1 h-6 flex items-center cursor-pointer group"
              >
                {/* Rail */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-slate-200 dark:bg-slate-800/90 rounded-full" />

                {/* Filled portion */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 bg-gradient-to-r from-setel-500 to-setel-600 dark:from-cyan-400 dark:to-blue-500 rounded-full shadow-xs dark:shadow-[0_0_10px_rgba(0,191,255,0.4)] transition-[width] duration-150"
                  style={{ width: `${timelineProgress}%` }}
                />

                {/* Milestone dots */}
                {MILESTONES.map((m) => (
                  <button
                    key={m.year}
                    onClick={(e) => { e.stopPropagation(); switchScenario(m.scenario); }}
                    title={`${m.label} (${m.year})`}
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 transition-all z-10 ${
                      activeScenarioId >= m.scenario
                        ? 'bg-setel-500 dark:bg-cyan-400 border-white dark:border-slate-900 shadow-sm dark:shadow-[0_0_8px_rgba(0,191,255,0.6)]'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                    }`}
                    style={{ left: `${m.pct}%` }}
                  />
                ))}

                {/* Draggable thumb */}
                <div
                  onMouseDown={handleThumbDown}
                  onTouchStart={handleThumbDown}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-setel-500 dark:border-cyan-400 shadow-md dark:shadow-[0_0_12px_rgba(0,191,255,0.7)] z-20 transition-[left] duration-150 cursor-grab active:cursor-grabbing ${
                    isDragging ? 'scale-125 ring-2 ring-setel-300 dark:ring-cyan-300' : 'hover:scale-110'
                  }`}
                  style={{ left: `${timelineProgress}%` }}
                />
              </div>

              {/* End year */}
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono whitespace-nowrap">2025</span>
            </div>
          </>
        </div>

        {/* RIGHT: Theme toggle and profile */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Active Scenario Pill (Org Chart only) */}
          <div className="hidden xl:flex items-center gap-1.5 bg-setel-50 dark:bg-cyan-950/40 border border-setel-200 dark:border-cyan-500/30 px-2.5 py-1 rounded-xl text-[11px] font-bold text-setel-900 dark:text-cyan-300 shadow-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-setel-500 dark:bg-cyan-400 animate-pulse'}`} />
            <span className="truncate max-w-[120px]">{scenarioLabel(activeScenarioId)}</span>
          </div>

          <ThemeToggle />
          <UserProfile />
        </div>

      </header>
    </div>
  ) : (
    // MINIMAL HEADER - OTHER PAGES
    <div className="w-full px-6 py-2 flex-shrink-0 z-30">
      <div className="flex items-center justify-end gap-2.5 max-w-7xl mx-auto">
        <ThemeToggle />
        <UserProfile />
      </div>
    </div>
  );
}
