import { createContext, useState, useEffect, useCallback } from 'react';
import { getEmployee } from '../utils/api';

export const AppContext = createContext();

// Timeline boundaries matching our seed data
const TIMELINE_START = new Date('2021-01-01');
const TIMELINE_END   = new Date('2025-06-30');
const TOTAL_MONTHS   = (TIMELINE_END.getFullYear() - TIMELINE_START.getFullYear()) * 12 
                     + (TIMELINE_END.getMonth() - TIMELINE_START.getMonth());

// Scenario boundaries (auto-detected by date)
function scenarioFromDate(dateStr) {
  const d = new Date(dateStr);
  if (d >= new Date('2025-01-01')) return 3;
  if (d >= new Date('2023-07-01')) return 2;
  return 1;
}

function scenarioLabel(id) {
  if (id === 1) return 'Baseline 2021';
  if (id === 2) return 'Platform Split 2023';
  return 'AI & Automation 2025';
}

function dateToProgress(dateStr) {
  const d = new Date(dateStr);
  const elapsed = (d.getFullYear() - TIMELINE_START.getFullYear()) * 12 
                + (d.getMonth() - TIMELINE_START.getMonth());
  return Math.min(100, Math.max(0, (elapsed / TOTAL_MONTHS) * 100));
}

function progressToDate(pct) {
  const months = Math.round((pct / 100) * TOTAL_MONTHS);
  const d = new Date(TIMELINE_START);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function AppProvider({ children }) {
  const [persona, setPersona] = useState('admin');
  const [staffEmployeeId, setStaffEmployeeId] = useState(4); // Default to Muthu Krishnan
  const [staffMember, setStaffMember] = useState(null);
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2023-07-01');
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('orglens-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    return 'light';
  });

  // Sync staff member details whenever staffEmployeeId changes
  useEffect(() => {
    let isMounted = true;
    getEmployee(staffEmployeeId)
      .then((res) => {
        if (isMounted && res.data) {
          setStaffMember(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch staff member info:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [staffEmployeeId]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem('orglens-theme', newTheme);
    } catch (e) {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Initial sync on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem('orglens-theme', theme);
    } catch (e) {}
  }, [theme]);

  const activeScenarioId = scenarioFromDate(selectedDate);
  const timelineProgress = dateToProgress(selectedDate);

  // Switch to a scenario's start date
  const switchScenario = useCallback((scenarioId) => {
    if (scenarioId === 1) setSelectedDate('2021-01-01');
    else if (scenarioId === 2) setSelectedDate('2023-07-01');
    else if (scenarioId === 3) setSelectedDate('2025-01-01');
  }, []);

  // Move timeline by N months (clamped to boundaries)
  const advanceMonths = useCallback((n) => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + n);
      if (d < TIMELINE_START) return TIMELINE_START.toISOString().slice(0, 10);
      if (d > TIMELINE_END)   return TIMELINE_END.toISOString().slice(0, 10);
      return d.toISOString().slice(0, 10);
    });
  }, []);

  // Set timeline from a 0-100 progress value (for slider / click)
  const setTimelineProgress = useCallback((pct) => {
    setSelectedDate(progressToDate(pct));
  }, []);

  return (
    <AppContext.Provider value={{ 
      persona, 
      setPersona, 
      staffEmployeeId, 
      setStaffEmployeeId,
      staffMember,
      isStaffPickerOpen,
      setIsStaffPickerOpen,
      selectedDate, 
      setSelectedDate,
      theme,
      setTheme,
      toggleTheme,
      activeScenarioId,
      switchScenario,
      timelineProgress,
      advanceMonths,
      setTimelineProgress,
      scenarioLabel,
      TIMELINE_START: TIMELINE_START.toISOString().slice(0, 10),
      TIMELINE_END:   TIMELINE_END.toISOString().slice(0, 10),
    }}>
      {children}
    </AppContext.Provider>
  );
}
