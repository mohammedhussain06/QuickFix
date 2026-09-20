import React from 'react';

export default function ContractorBottomNav({ activeScreen, setActiveScreen, t }) {
  const navItems = [
    { id: 'contractor-jobs', label: t.jobsQueue, icon: 'format_list_bulleted' },
    { id: 'contractor-camera', label: t.repairProof, isCenter: true, icon: 'camera' },
    { id: 'contractor-scorecard', label: t.scorecard, icon: 'military_tech' }
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 shrink-0 bg-[#f2fcf4]/95 backdrop-blur-xl border-t border-[#e6f0e8] shadow-[0_-4px_16px_rgba(46,125,50,0.05)]">
      <div className="h-16 px-4 w-full flex items-center justify-around">
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <div key={item.id} className="relative -top-3.5 flex flex-col items-center justify-center">
                <button
                  aria-label={t.repairProof}
                  onClick={() => setActiveScreen('contractor-camera')}
                  className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#0d631b] text-white shadow-[0_6px_18px_rgba(46,125,50,0.38)] active:scale-95 hover:bg-[#2e7d32] transition-all ring-4 ring-white"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
                </button>
                <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold text-[#0d631b] mt-0.5">{item.label}</span>
              </div>
            );
          }

          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[40px] transition-colors ${
                isActive ? 'text-[#0d631b] font-bold' : 'text-[#546346] hover:text-[#151d19]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">
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
