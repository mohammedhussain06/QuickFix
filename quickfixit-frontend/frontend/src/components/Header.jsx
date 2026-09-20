import React, { useState } from 'react';
import { WARDS_LIST } from '../data/mockData';

export default function Header({
  activeScreen,
  setActiveScreen,
  lang,
  setLang,
  selectedWard,
  setSelectedWard,
  t
}) {
  const [showWardMenu, setShowWardMenu] = useState(false);

  const isHome = activeScreen === 'home';

  return (
    <header className="sticky top-0 w-full z-30 shrink-0 bg-[#f2fcf4]/95 backdrop-blur-md border-b border-[#e6f0e8]/80 shadow-[0_1px_10px_rgba(46,125,50,0.04)]">
      <div className="h-14 px-3 w-full flex items-center justify-between gap-1.5">
        {/* Left: Logo or Back Button */}
        <div className="flex items-center gap-2 min-w-0">
          {!isHome && (
            <button
              aria-label="Go back"
              onClick={() => setActiveScreen('home')}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-[#151d19] hover:bg-[#e6f0e8] active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}

          <div
            onClick={() => setActiveScreen('home')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#2e7d32] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[19px]">handyman</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] text-[#0d631b] leading-none truncate">
                {t.appTitle}
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#40493d] truncate">
                {isHome ? t.home : activeScreen === 'report' ? t.reportHazard : activeScreen === 'activity' ? t.activity : activeScreen === 'my-reports' ? t.myReports : activeScreen === 'community-map' ? t.liveMap : t.incidentDetails}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Ward Selector (on home) or Title */}
        {isHome ? (
          <div className="relative">
            <button
              onClick={() => setShowWardMenu(!showWardMenu)}
              aria-label="Change location"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#e6f0e8] hover:bg-[#e1ebe3] transition-colors text-[#151d19] shrink min-h-[38px]"
              type="button"
            >
              <span className="material-symbols-outlined text-[#0d631b] text-[16px]">location_on</span>
              <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[13px] truncate max-w-[120px]">
                {selectedWard.split('•')[0]}
              </span>
              <span className="material-symbols-outlined text-[#40493d] text-[14px]">expand_more</span>
            </button>

            {showWardMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#d7e8c3] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[11px] font-bold text-[#707a6c] uppercase tracking-wider">
                  Select Ward / प्रभाग निवडा
                </div>
                {WARDS_LIST.map((ward) => (
                  <button
                    key={ward}
                    onClick={() => {
                      setSelectedWard(ward);
                      setShowWardMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] font-['Plus_Jakarta_Sans'] font-medium flex items-center justify-between hover:bg-[#f2fcf4] transition-colors ${
                      selectedWard === ward ? 'text-[#0d631b] font-bold bg-[#ecf6ee]' : 'text-[#151d19]'
                    }`}
                  >
                    <span>{ward}</span>
                    {selectedWard === ward && (
                      <span className="material-symbols-outlined text-[16px] text-[#0d631b]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Right: Language Toggle & Profile */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* English / Marathi switch */}
          <button
            onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
            className="px-2.5 py-1 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-bold border border-[#2e7d32]/30 bg-white hover:bg-[#ecf6ee] text-[#0d631b] transition-all shadow-xs"
            title="Toggle English / मराठी"
          >
            {lang === 'en' ? 'मराठी' : 'ENG'}
          </button>

          {/* Profile Avatar with Notification Dot */}
          <div className="relative shrink-0 flex items-center justify-center">
            <button
              aria-label="User profile and notifications"
              className="relative p-0.5 rounded-full ring-2 ring-[#0d631b]/20 hover:ring-[#0d631b]/40 transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
              type="button"
            >
              <img
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-Xf-jQv8SiZkiLLaEAGtPtpd7U8fd7dQK8l_6WUM3hVb6OokBxRCuKSJN6eiNZpt4bfdoDSiLZgry_N77l_iawuoujXYQSs44tkEvZFEEKMOcuvbEmDz3N9iayE4B5Blektpd5RZ1sW_ZVOx0ozztljQ8ST0-_w25r5g3ldFxCRUy0ycO7aAP1xsFMLBjc-STnMy6oxWQsc9mVllsHTZ6r1fOc_sook8EZtgW6P8ztTyf4GIR_13vDA"
              />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
