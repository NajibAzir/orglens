import { useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopNavCapsule from './components/TopNavCapsule';
import TopNavFull from './components/TopNavFull';
import StaffPickerModal from './components/StaffPickerModal';
import Dashboard from './pages/Dashboard';
import OrgChart from './pages/OrgChart';
import RoleHistory from './pages/RoleHistory';
import RoleDetail from './pages/RoleDetail';
import PersonJourney from './pages/PersonJourney';
import PersonDetail from './pages/PersonDetail';
import WellbeingDashboard from './pages/WellbeingDashboard';
import TicketingAnalysis from './pages/TicketingAnalysis';
import TicketingDetail from './pages/TicketingDetail';
import TopNavDemo from './pages/TopNavDemo';
import RoleRelevancyTrends from './pages/RoleRelevancyTrends';
import StaffUpskillingMatrix from './pages/StaffUpskillingMatrix';
import PersonalUpskillPlan from './pages/PersonalUpskillPlan';
import PersonalRoleRelevancy from './pages/PersonalRoleRelevancy';
import RoyaltyWallet from './pages/RoyaltyWallet';
import WalletDashboard from './pages/WalletDashboard';
import AdminOnlyRoute from './components/AdminOnlyRoute';

function App() {
  const { theme } = useContext(AppContext);
  const location = useLocation();
  const isTopNavDemo = location.pathname === '/top-nav-demo';

  // Absolute fail-safe: Force DOM to match React state on every render
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="relative flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 select-none">
      
      {/* ── Ambient Radial Mesh Light Orbs (Shining in Dark Mode) ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-500">
        {/* Top-Center Cyan Glow */}
        <div className="absolute -top-32 left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[130px]" />
        {/* Right-Center Electric Indigo Glow */}
        <div className="absolute top-1/4 -right-20 w-[550px] h-[550px] rounded-full bg-indigo-600/15 blur-[140px]" />
        {/* Bottom-Left Electric Blue Glow */}
        <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-setel-600/10 blur-[120px]" />
        {/* Deep Violet Sub-glow */}
        <div className="absolute top-2/3 right-1/3 w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      {/* ── Application Shell ── */}
      {!isTopNavDemo && <Sidebar />}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        
        {/* Conditional Top Navigation */}
        {isTopNavDemo ? <TopNavFull /> : <TopNavCapsule />}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/top-nav-demo" element={<TopNavDemo />} />
            <Route path="/org-chart" element={<OrgChart />} />
            <Route path="/roles" element={<AdminOnlyRoute><RoleHistory /></AdminOnlyRoute>} />
            <Route path="/roles/:id" element={<AdminOnlyRoute><RoleDetail /></AdminOnlyRoute>} />
            <Route path="/people" element={<PersonJourney />} />
            <Route path="/people/:id" element={<PersonDetail />} />
            <Route path="/relevancy" element={<RoleRelevancyTrends />} />
            <Route path="/upskilling" element={<StaffUpskillingMatrix />} />
            <Route path="/my-upskill" element={<PersonalUpskillPlan />} />
            <Route path="/my-relevancy" element={<PersonalRoleRelevancy />} />
            <Route path="/my-wallet" element={<RoyaltyWallet />} />
            <Route path="/wallet-dashboard" element={<WalletDashboard />} />
            <Route path="/wellbeing" element={<WellbeingDashboard />} />
            <Route path="/ticketing" element={<TicketingAnalysis />} />
            <Route path="/ticketing/:id" element={<TicketingDetail />} />
          </Routes>
        </main>
      </div>

      {/* ── Global Staff Avatar Picker Modal ── */}
      <StaffPickerModal />
    </div>
    </div>
  );
}

export default App;
