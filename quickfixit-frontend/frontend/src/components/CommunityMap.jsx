import React, { useState } from 'react';
import { MOCK_FEED_ITEMS } from '../data/mockData';

export default function CommunityMap({
  setActiveScreen,
  setSelectedIncident,
  selectedWard,
  t
}) {
  const [selectedPin, setSelectedPin] = useState(MOCK_FEED_ITEMS[0]);

  const mapPins = [
    { ...MOCK_FEED_ITEMS[0], top: '42%', left: '55%', status: 'verified' },
    { ...MOCK_FEED_ITEMS[1], top: '65%', left: '30%', status: 'in_progress' },
    { ...MOCK_FEED_ITEMS[2], top: '28%', left: '72%', status: 'review' }
  ];

  return (
    <div className="flex flex-col gap-4 pt-2 pb-28">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#151d19]">
            {t.liveMap}
          </h2>
          <p className="font-['Inter'] text-[13px] text-[#40493d]">
            {selectedWard}
          </p>
        </div>
        <button
          onClick={() => setActiveScreen('report')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0d631b] text-white font-['Plus_Jakarta_Sans'] text-[12px] font-bold shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
          <span>{t.report}</span>
        </button>
      </div>

      {/* Stylized Interactive Leaflet/SVG Map Canvas */}
      <div className="relative w-full h-80 rounded-3xl overflow-hidden bg-[#e6f0e8] border border-[#d7e8c3] shadow-inner">
        {/* Subtle Map Grid Roads */}
        <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 100 Q 150 80 400 130 T 800 120" stroke="#c8e6c9" strokeWidth="18" fill="none" />
          <path d="M 120 0 Q 140 200 180 400" stroke="#c8e6c9" strokeWidth="14" fill="none" />
          <path d="M 0 240 Q 200 230 400 280 T 800 250" stroke="#d7e8c3" strokeWidth="16" fill="none" />
          <path d="M 300 0 Q 280 180 320 400" stroke="#c8e6c9" strokeWidth="12" fill="none" />
          <circle cx="160" cy="110" r="28" fill="#a3f69c" opacity="0.4" />
          <circle cx="290" cy="260" r="34" fill="#a3f69c" opacity="0.3" />
        </svg>

        {/* Map Legend Overlay */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#151d19] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0d631b]"></span>
          <span>Verified (18)</span>
          <span className="w-2 h-2 rounded-full bg-amber-500 ml-1"></span>
          <span>Repairing (2)</span>
        </div>

        {/* Interactive Location Markers */}
        {mapPins.map((pin) => {
          const isSelected = selectedPin.id === pin.id;
          return (
            <button
              key={pin.id}
              onClick={() => setSelectedPin(pin)}
              style={{ top: pin.top, left: pin.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                  pin.status === 'verified'
                    ? 'bg-[#0d631b] text-white'
                    : pin.status === 'in_progress'
                    ? 'bg-amber-500 text-white'
                    : 'bg-sky-600 text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {pin.status === 'verified' ? 'check' : 'warning'}
                </span>
              </div>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-[#0d631b] mt-0.5 animate-ping"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Marker Drawer Card */}
      {selectedPin && (
        <div className="p-4 rounded-3xl bg-white shadow-md border border-[#d7e8c3] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-[#d7e8c3] text-[#0d631b] text-[11px] font-['Plus_Jakarta_Sans'] font-bold">
              {selectedPin.badge}
            </span>
            <span className="font-['Inter'] text-[12px] text-[#40493d]">
              {selectedPin.timeAgo}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[#ecf6ee]">
              <img
                src={selectedPin.image}
                alt={selectedPin.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#151d19]">
                {selectedPin.title}
              </h4>
              <p className="font-['Inter'] text-[13px] text-[#40493d] truncate">
                {selectedPin.address}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedIncident(selectedPin);
              setActiveScreen('detail');
            }}
            className="w-full py-2.5 rounded-full bg-[#2e7d32] text-white font-['Plus_Jakarta_Sans'] text-[13px] font-bold shadow-sm hover:bg-[#0d631b] active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>{t.incidentDetails}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}
