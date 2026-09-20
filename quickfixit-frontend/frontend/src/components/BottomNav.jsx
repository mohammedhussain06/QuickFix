import React from 'react';

export default function BottomNav({ activeScreen, setActiveScreen, t }) {
  const navItems = [
    { id: 'home', label: t.home, icon: 'home' },
    { id: 'my-reports', label: t.myReports, icon: 'assignment' },
    { id: 'report', label: t.report, isCenter: true, icon: 'add_a_photo' },
    { id: 'activity', label: t.activity, icon: 'how_to_vote' },
    { id: 'community-map', label: t.liveMap, icon: 'map' }
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 shrink-0 bg-[#f2fcf4]/95 backdrop-blur-xl border-t border-[#e6f0e8] shadow-[0_-4px_16px_rgba(46,125,50,0.05)]">
      <div className="h-16 px-2 w-full flex items-center justify-around">
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <div key={item.id} className="relative -top-3.5 flex flex-col items-center justify-center">
                <button
                  aria-label={t.reportBtn}
                  onClick={() => setActiveScreen('report')}
                  className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#2e7d32] text-white shadow-[0_6px_18px_rgba(46,125,50,0.38)] active:scale-95 active:bg-[#0d631b] hover:bg-[#1b6d24] transition-all ring-4 ring-white"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
                </button>
                <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold text-[#0d631b] mt-0.5">
                  {item.label}
                </span>
              </div>
            );
          }

          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[50px] min-h-[40px] transition-colors ${
                isActive ? 'text-[#0d631b] font-bold' : 'text-[#546346] hover:text-[#151d19]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-[10px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
