import React, { useState } from 'react';
import { MOCK_FEED_ITEMS } from '../data/mockData';

export default function MyReports({
  userReports,
  setActiveScreen,
  setSelectedIncident,
  t
}) {
  const [filter, setFilter] = useState('all');

  const allReports = [...userReports, ...MOCK_FEED_ITEMS];

  const filtered = allReports.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'verified') return item.type === 'verified';
    if (filter === 'in_progress') return item.type === 'dispatched' || item.type === 'under_verification';
    return true;
  });

  return (
    <div className="flex flex-col gap-4 pt-2 pb-28">
      <div className="flex items-center justify-between">
        <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#151d19]">
          {t.myReports}
        </h2>
        <span className="px-3 py-1 rounded-full bg-[#d7e8c3] text-[#0d631b] font-['Plus_Jakarta_Sans'] text-[12px] font-bold">
          {filtered.length} Total
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'in_progress', 'verified'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full font-['Plus_Jakarta_Sans'] text-[12px] font-semibold transition-all ${
              filter === f
                ? 'bg-[#0d631b] text-white shadow-xs'
                : 'bg-[#ecf6ee] text-[#40493d] hover:bg-[#e1ebe3]'
            }`}
          >
            {f === 'all' ? 'All' : f === 'in_progress' ? t.inProgress : t.beforeAfterInspected.split('&')[0]}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-3">
        {filtered.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => {
              setSelectedIncident(item);
              setActiveScreen('detail');
            }}
            className="p-4 rounded-3xl bg-white shadow-sm border border-[#d7e8c3]/60 hover:border-[#2e7d32] cursor-pointer transition-all flex items-center justify-between gap-3 active:scale-[0.99]"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[#ecf6ee]">
              <img
                src={item.image || item.beforeImage}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#546346]">
                  #{item.id}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#d7e8c3] text-[#0d631b] text-[10px] font-bold">
                  {item.badge || "Verified"}
                </span>
              </div>
              <h4 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#151d19] truncate mt-0.5">
                {item.title}
              </h4>
              <p className="font-['Inter'] text-[12px] text-[#40493d] truncate">
                {item.address}
              </p>
            </div>
            <span className="material-symbols-outlined text-[#40493d] text-[20px]">
              chevron_right
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
