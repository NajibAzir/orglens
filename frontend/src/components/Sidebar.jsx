import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Network, History, Users, HeartPulse, 
  BarChart3, TrendingUp, BookOpen, GraduationCap, Zap, Sparkles
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import PersonaToggle from './PersonaToggle';

export default function Sidebar() {
  const { persona, staffEmployeeId } = useContext(AppContext);

  const adminSections = [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
      ]
    },
    {
      label: 'STRUCTURE & ROLES',
      items: [
        { name: 'Interactive Org Chart', path: '/org-chart', icon: Network, badge: 'Live', badgeType: 'live' },
        { name: 'Role Evolution & History', path: '/roles', icon: History },
        { name: 'Role Relevancy & Tech Trends', path: '/relevancy', icon: TrendingUp, badge: 'AI', badgeType: 'ai' },
      ]
    },
    {
      label: 'TALENT & INTELLIGENCE',
      items: [
        { name: 'People & Talent Journey', path: '/people', icon: Users },
        { name: 'Staff Upskill Recommendations', path: '/upskilling', icon: GraduationCap, badge: 'AI', badgeType: 'ai' },
      ]
    },
    {
      label: 'CHANGE & CARE',
      items: [
        { name: 'Change Wellbeing', path: '/wellbeing', icon: HeartPulse },
      ]
    }
  ];

  const staffSections = [
    {
      label: 'MY CAREER & UPSKILLING',
      items: [
        { name: 'My Career Journey', path: `/people/${staffEmployeeId}`, icon: Users },
        { name: 'My Upskill Plan', path: '/my-upskill', icon: BookOpen, badge: 'Plan', badgeType: 'live' },
        { name: 'My Role Relevancy', path: '/my-relevancy', icon: TrendingUp, badge: 'AI', badgeType: 'ai' },
      ]
    },
    {
      label: 'STRUCTURE & ROLES',
      items: [
        { name: 'Interactive Org Chart', path: '/org-chart', icon: Network },
        { name: 'Role Evolution', path: '/roles', icon: History },
      ]
    },
    {
      label: 'CARE & WELLBEING',
      items: [
        { name: 'My Wellbeing Check-ins', path: '/wellbeing', icon: HeartPulse },
      ]
    }
  ];

  const sections = persona === 'admin' ? adminSections : staffSections;

  const badgeStyles = {
    live: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40 dark:shadow-[0_0_10px_rgba(52,211,153,0.3)]',
    ai:   'bg-setel-500/20 text-setel-700 dark:text-cyan-300 border-setel-500/40 dark:shadow-[0_0_10px_rgba(0,191,255,0.3)]',
  };

  return (
    <aside className="w-80 bg-white dark:bg-[#070D1B]/80 dark:backdrop-blur-2xl text-slate-900 dark:text-white flex flex-col border-r border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.7)] flex-shrink-0 select-none transition-all duration-300 z-20 overflow-hidden">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/40 dark:backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative flex items-center justify-center flex-shrink-0 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-sm border border-slate-200 dark:border-cyan-500/30 dark:shadow-[0_0_15px_rgba(0,191,255,0.25)]">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
              <line x1="50" y1="25" x2="35" y2="50" stroke="#00BFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <line x1="50" y1="25" x2="65" y2="50" stroke="#253DE8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <circle cx="50" cy="20" r="6.5" fill="#00BFFF" />
              <circle cx="35" cy="55" r="6" fill="#00BFFF" />
              <circle cx="65" cy="55" r="6" fill="#253DE8" />
            </svg>
          </div>
          <div className="flex flex-col justify-center leading-tight">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">OrgLens</h1>
            <p className="text-[12px] text-cyan-600 dark:text-cyan-400 font-bold mt-0.5 whitespace-nowrap">Organizational Intelligence</p>
          </div>
        </div>
      </div>

      {/* Grouped Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {sections.map((section, idx) => {
          const visibleItems = section.items.filter(item => !item.adminOnly || persona === 'admin');
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx}>
              <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {section.label}
              </div>
              <div className="space-y-1">
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13.5px] font-bold transition-all duration-200 group ${
                        isActive 
                          ? 'bg-gradient-to-r from-setel-500 to-setel-600 dark:from-cyan-400 dark:to-blue-500 text-slate-950 shadow-md shadow-setel-500/20 dark:shadow-[0_0_20px_rgba(0,191,255,0.35)] font-black' 
                          : 'text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-cyan-300'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <item.icon size={17} className="opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wide border flex-shrink-0 ml-1.5 ${
                        badgeStyles[item.badgeType] || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Persona Toggle Card Footer */}
      <div className="p-3.5 border-t border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/50 dark:backdrop-blur-md">
        <PersonaToggle />
      </div>
    </aside>
  );
}
