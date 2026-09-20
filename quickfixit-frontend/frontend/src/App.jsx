import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import CivicHome from './components/CivicHome';
import ReportCamera from './components/ReportCamera';
import ComplaintDetail from './components/ComplaintDetail';
import MyReports from './components/MyReports';
import CommunityMap from './components/CommunityMap';
import CivicActivity from './components/CivicActivity';
import LoginPage from './components/LoginPage';

// Contractor components
import ContractorJobFeed from './components/contractor/ContractorJobFeed';
import GhostOverlayCamera from './components/contractor/GhostOverlayCamera';
import ContractorScorecard from './components/contractor/ContractorScorecard';
import ContractorBottomNav from './components/contractor/ContractorBottomNav';

// Municipal components
import MunicipalPortal from './components/municipal/MunicipalPortal';
import MunicipalReviewDashboard from './components/municipal/MunicipalReviewDashboard';
import WardHeatmapAnalytics from './components/municipal/WardHeatmapAnalytics';

import { MOCK_INCIDENT_DETAIL, MOCK_CONTRACTOR_JOBS, MOCK_USERS, WARDS_LIST } from './data/mockData';
import { TRANSLATIONS } from './data/translations';

// ==========================================
// MOBILE APP SHELL (Authentic Smartphone Mockup on Desktop, 100% Native Mobile App UI)
// ==========================================
function MobileAppShell({ children, activeRole, onSwitchRole }) {
  const [time, setTime] = useState(() => {
    const d = new Date();
    const hrs = d.getHours();
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${hrs}:${mins}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const hrs = d.getHours();
      const mins = String(d.getMinutes()).padStart(2, '0');
      setTime(`${hrs}:${mins}`);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0a140d] text-[#151d19] font-['Inter'] antialiased flex flex-col items-center justify-center relative overflow-x-hidden selection:bg-[#2e7d32] selection:text-white sm:py-6 sm:px-4">
      {/* Subtle Ambient Background Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#2e7d32_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#2e7d32]/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Floating Studio Switcher Bar (Outside the phone, only on desktop screens) */}
      <div className="hidden sm:flex items-center gap-3 mb-4 z-50 px-4 py-2 rounded-full bg-[#142318]/90 border border-[#26442e] shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 pr-3 border-r border-[#26442e]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3cd070] animate-pulse"></span>
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-wider text-[#9ecba7] uppercase">
            Mobile App Mode
          </span>
        </div>

        <div className="flex items-center bg-[#0a140d] p-1 rounded-full border border-[#26442e]/80 gap-1">
          <button
            type="button"
            onClick={() => onSwitchRole('citizen')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-bold transition-all ${
              activeRole === 'citizen'
                ? 'bg-[#2e7d32] text-white shadow-xs'
                : 'text-[#7da787] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span>Citizen App</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchRole('contractor')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-bold transition-all ${
              activeRole === 'contractor'
                ? 'bg-[#2e7d32] text-white shadow-xs'
                : 'text-[#7da787] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">engineering</span>
            <span>Contractor App</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSwitchRole('officer')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-bold bg-[#1d3824] hover:bg-[#274d31] text-[#a3f69c] border border-[#3b6b47] transition-all ml-1 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
          <span>Municipal Web Portal</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      {/* REALISTIC SMARTPHONE CHASSIS */}
      <div className="w-full sm:w-[412px] h-screen sm:h-[860px] bg-black sm:rounded-[52px] shadow-[0_25px_90px_rgba(0,0,0,0.7),0_0_0_12px_#132017,0_0_0_14px_#203828] sm:border-[4px] sm:border-[#385e44]/40 flex flex-col overflow-hidden relative z-10">
        {/* Dynamic Island Speaker Notch */}
        <div className="hidden sm:flex items-center justify-center w-full pt-2.5 pb-1 shrink-0 bg-black">
          <div className="w-28 h-6 bg-[#0c140e] rounded-full flex items-center justify-between px-3 border border-[#1f3424]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#18261b] border border-[#2a4531]"></div>
            <div className="w-3 h-3 rounded-full bg-[#050a06] border border-[#18261b] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0d631b]/60"></div>
            </div>
          </div>
        </div>

        {/* Native Mobile Status Bar */}
        <div className="w-full bg-[#f2fcf4] text-[#151d19] px-6 pt-2 pb-1 flex items-center justify-between shrink-0 select-none text-[13px] font-bold font-['Plus_Jakarta_Sans'] border-b border-[#e6f0e8]/40">
          <span className="tracking-tight">{time}</span>
          <div className="flex items-center gap-1.5 text-[#151d19]">
            <span className="material-symbols-outlined text-[15px]">signal_cellular_4_bar</span>
            <span className="text-[11px] font-extrabold tracking-tight">5G</span>
            <span className="material-symbols-outlined text-[15px] -rotate-90">battery_full</span>
          </div>
        </div>

        {/* Screen Viewport: Inner Phone Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f2fcf4] relative">
          {children}
        </div>

        {/* Home Indicator Swipe Bar */}
        <div className="w-full bg-[#f2fcf4] py-1.5 shrink-0 flex justify-center items-center select-none border-t border-[#e6f0e8]/30">
          <div className="w-32 h-1 bg-[#40493d]/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APPLICATION CONTROLLER
// ==========================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS.citizen);
  const [activeScreen, setActiveScreen] = useState('home');
  const [lang, setLang] = useState('en');
  const [selectedWard, setSelectedWard] = useState(WARDS_LIST[0]);
  const [selectedIncident, setSelectedIncident] = useState(MOCK_INCIDENT_DETAIL);
  const [selectedJob, setSelectedJob] = useState(MOCK_CONTRACTOR_JOBS[0]);
  const [userReports, setUserReports] = useState([]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === 'citizen') {
      setActiveScreen('home');
    } else if (user.role === 'contractor') {
      setActiveScreen('contractor-jobs');
    } else {
      setActiveScreen('municipal-review');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveScreen('login');
  };

  const switchRoleQuickly = (role) => {
    if (role === 'citizen') {
      setCurrentUser(MOCK_USERS.citizen);
      setActiveScreen('home');
    } else if (role === 'contractor') {
      setCurrentUser(MOCK_USERS.contractor);
      setActiveScreen('contractor-jobs');
    } else {
      setCurrentUser(MOCK_USERS.officer);
      setActiveScreen('municipal-review');
    }
  };

  const addNewReport = (newIncident) => {
    setUserReports((prev) => [newIncident, ...prev]);
    setSelectedIncident(newIncident);
  };

  if (!currentUser || activeScreen === 'login') {
    return (
      <MobileAppShell activeRole="citizen" onSwitchRole={switchRoleQuickly}>
        <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col justify-center">
          <LoginPage
            onLogin={handleLogin}
            lang={lang}
            setLang={setLang}
            t={t}
          />
        </div>
      </MobileAppShell>
    );
  }

  const isContractor = currentUser.role === 'contractor';
  const isOfficer = currentUser.role === 'officer';

  // 1. MUNICIPAL OFFICER: Full-Screen Desktop Web Dashboard
  if (isOfficer) {
    return (
      <div className="min-h-screen w-full bg-[#f4f7f4] text-[#151d19] font-['Inter'] antialiased">
        <MunicipalPortal
          onLogout={handleLogout}
          lang={lang}
          setLang={setLang}
          t={t}
          onSwitchRole={switchRoleQuickly}
        />
      </div>
    );
  }

  // 2. CITIZEN & CONTRACTOR: 100% Native Mobile App Experience
  return (
    <MobileAppShell
      activeRole={currentUser.role}
      onSwitchRole={switchRoleQuickly}
    >
      {/* CITIZEN APP */}
      {!isContractor && (
        <>
          <Header
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
            lang={lang}
            setLang={setLang}
            selectedWard={selectedWard}
            setSelectedWard={setSelectedWard}
            onLogout={handleLogout}
            t={t}
          />
          <main className="flex-1 w-full overflow-y-auto no-scrollbar px-4 pt-2 pb-20 flex flex-col">
            {activeScreen === 'home' && (
              <CivicHome
                setActiveScreen={setActiveScreen}
                setSelectedIncident={setSelectedIncident}
                selectedWard={selectedWard}
                t={t}
              />
            )}
            {activeScreen === 'report' && (
              <ReportCamera
                setActiveScreen={setActiveScreen}
                addNewReport={addNewReport}
                selectedWard={selectedWard}
                t={t}
              />
            )}
            {activeScreen === 'detail' && (
              <ComplaintDetail
                incident={selectedIncident}
                setActiveScreen={setActiveScreen}
                t={t}
              />
            )}
            {activeScreen === 'my-reports' && (
              <MyReports
                userReports={userReports}
                setActiveScreen={setActiveScreen}
                setSelectedIncident={setSelectedIncident}
                t={t}
              />
            )}
            {activeScreen === 'activity' && (
              <CivicActivity
                setActiveScreen={setActiveScreen}
                setSelectedIncident={setSelectedIncident}
                selectedWard={selectedWard}
                t={t}
              />
            )}
            {activeScreen === 'community-map' && (
              <CommunityMap
                setActiveScreen={setActiveScreen}
                setSelectedIncident={setSelectedIncident}
                selectedWard={selectedWard}
                t={t}
              />
            )}
          </main>
          {activeScreen !== 'report' && (
            <BottomNav
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
              t={t}
            />
          )}
        </>
      )}

      {/* CONTRACTOR APP */}
      {isContractor && (
        <>
          <main className="flex-1 w-full overflow-y-auto no-scrollbar px-3 pt-2 pb-20 flex flex-col">
            {activeScreen === 'contractor-jobs' && (
              <ContractorJobFeed
                onSelectJob={setSelectedJob}
                setActiveScreen={setActiveScreen}
                onLogout={handleLogout}
                lang={lang}
                setLang={setLang}
                t={t}
              />
            )}
            {activeScreen === 'contractor-camera' && (
              <GhostOverlayCamera
                job={selectedJob}
                setActiveScreen={setActiveScreen}
                t={t}
              />
            )}
            {activeScreen === 'contractor-scorecard' && (
              <ContractorScorecard
                onLogout={handleLogout}
                lang={lang}
                setLang={setLang}
                t={t}
              />
            )}
          </main>
          {activeScreen !== 'contractor-camera' && (
            <ContractorBottomNav
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
              t={t}
            />
          )}
        </>
      )}
    </MobileAppShell>
  );
}
