import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Sun, Moon, Bell, Search, Mail, LayoutDashboard, Network, History, Users, BarChart3, HeartPulse } from 'lucide-react';

export default function TopNavFull() {
  const { theme, setTheme, persona, staffEmployeeId } = useContext(AppContext);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/top', end: true, icon: LayoutDashboard },
    { name: 'Org Chart', path: '/top/org-chart', icon: Network },
    { name: 'Roles', path: '/top/roles', icon: History },
    { name: 'Talent', path: persona === 'admin' ? '/top/people' : `/top/people/${staffEmployeeId}`, icon: Users },
    ...(persona === 'admin' ? [{ name: 'Jira', path: '/top/ticketing', icon: BarChart3 }] : []),
    { name: 'Wellbeing', path: '/top/wellbeing', icon: HeartPulse },
  ];

  return (
    <div className="w-full px-8 pt-6 pb-2 z-50 flex justify-center sticky top-0">
      <header className="w-full max-w-6xl bg-gradient-to-r from-slate-900/90 via-[#0A1224]/95 to-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,191,255,0.15)] rounded-full px-6 py-2.5 flex items-center justify-between transition-all group hover:border-cyan-400/50 hover:shadow-[0_8px_32px_rgba(0,191,255,0.15),inset_0_2px_4px_rgba(255,255,255,0.1)] relative overflow-hidden">
        
        {/* Glossy top edge highlight */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />

        {/* ═══════ LEFT: Brand ═══════ */}
        <Link to="/top" className="flex items-center gap-3 flex-shrink-0 z-10 mr-4">
          <div className="w-9 h-9 bg-cyan-950/40 rounded-xl p-1.5 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,191,255,0.3)] flex items-center justify-center transition-transform hover:scale-110">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
              <path d="M45 10L15 45L45 55L75 20L45 10Z" fill="#00BFFF" />
              <path d="M45 55L15 45L35 75L55 90L45 55Z" fill="#00BFFF" />
              <path d="M45 55L75 20L85 45L55 90L45 55Z" fill="#253DE8" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-black text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              OrgLens
            </span>
          </div>
        </Link>

        {/* ═══════ CENTER: Navigation Pills ═══════ */}
        <div className="hidden lg:flex items-center gap-1 bg-[#050A14]/60 p-1.5 rounded-full border border-slate-700/50 shadow-inner z-10 flex-1 justify-center max-w-2xl">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,191,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <item.icon size={14} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* ═══════ RIGHT: Actions & Profile ═══════ */}
        <div className="flex items-center gap-4 flex-shrink-0 z-10">
          
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-[#0A1224]"></span>
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors">
              <Mail size={16} />
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors">
              <Search size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-slate-700/50"></div>

          <div className="flex items-center bg-[#050A14]/60 p-0.5 rounded-full border border-slate-700/50 shadow-inner">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-full transition-all ${
                theme === 'light' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Sun size={14} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-full transition-all ${
                theme === 'dark' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Moon size={14} />
            </button>
          </div>

          <div className="pl-1">
            <img
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=cyberpunk&backgroundColor=b6e3f4,c0aede,d1d4f9"
              alt="User"
              className="w-9 h-9 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_12px_rgba(0,191,255,0.5)] cursor-pointer hover:scale-105 transition-transform"
            />
          </div>
        </div>

      </header>
    </div>
  );
}
