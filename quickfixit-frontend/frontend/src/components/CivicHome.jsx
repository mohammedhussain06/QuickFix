import React, { useState } from 'react';
import { MOCK_FEED_ITEMS, MOCK_STATS } from '../data/mockData';

export default function CivicHome({
  setActiveScreen,
  setSelectedIncident,
  selectedWard,
  t
}) {
  const [feedItems, setFeedItems] = useState(MOCK_FEED_ITEMS);
  const [helpfulGiven, setHelpfulGiven] = useState({});
  const [sawTooGiven, setSawTooGiven] = useState({});

  const handleHelpful = (e, id) => {
    e.stopPropagation();
    setHelpfulGiven((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSawToo = (e, id) => {
    e.stopPropagation();
    setSawTooGiven((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCardClick = (item) => {
    setSelectedIncident(item);
    setActiveScreen('detail');
  };

  return (
    <div className="flex flex-col gap-5 pt-2 pb-28">
      {/* Greeting Section */}
      <section className="flex flex-col gap-1 pt-1">
        <div className="inline-flex items-center gap-2">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[22px] font-semibold text-[#151d19]">
            {t.goodMorning}
          </h1>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#0d631b] animate-ping"></span>
        </div>
        <p className="font-['Inter'] text-[15px] text-[#40493d]">
          {t.greetingSub}
        </p>
      </section>

      {/* Hero Action Card: Spot damage on the road? */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#d7e8c3]/30 to-[#ecf6ee] shadow-[0_8px_24px_-4px_rgba(46,125,50,0.12)] p-5 border border-[#d7e8c3]/50">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#a3f69c]/30 blur-2xl pointer-events-none"></div>

        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d7e8c3] text-[#121f08] font-['Plus_Jakarta_Sans'] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              {t.instantSync}
            </span>
            <span className="inline-flex items-center gap-1.5 font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#0d631b]">
              <span className="w-2 h-2 rounded-full bg-[#0d631b] animate-ping"></span>
              {selectedWard.split('•')[0]} {t.wardActive}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[26px] font-bold text-[#151d19] leading-tight">
              {t.spotDamage}
            </h2>
            <p className="font-['Inter'] text-[13px] text-[#40493d]">
              {t.quickSub}
            </p>
          </div>

          <button
            id="quickReportBtn"
            onClick={() => setActiveScreen('report')}
            className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-[#2e7d32] hover:bg-[#0d631b] active:scale-[0.98] transition-all duration-200 text-white shadow-[0_10px_20px_rgba(46,125,50,0.28)]"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm text-white">
                <span className="material-symbols-outlined text-[28px]">photo_camera</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-['Plus_Jakarta_Sans'] text-[18px] font-semibold text-white leading-tight">
                  {t.reportBtn}
                </span>
                <span className="font-['Inter'] text-[13px] text-[#cbffc2]">
                  {t.tapToLaunch}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 group-hover:translate-x-1 transition-transform">
              <span className="material-symbols-outlined text-[20px] text-white">arrow_forward</span>
            </div>
          </button>
        </div>
      </section>

      {/* 3 Status Metric Cards */}
      <section className="grid grid-cols-3 gap-2.5">
        <div 
          onClick={() => setActiveScreen('my-reports')}
          className="flex flex-col p-3 rounded-2xl bg-[#ecf6ee] text-[#151d19] shadow-[0_2px_8px_rgba(46,125,50,0.04)] border border-[#dbe5dd]/50 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="material-symbols-outlined text-[#0d631b] text-[20px]">person_pin_circle</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d631b]"></span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#0d631b]">3</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#40493d] leading-tight mt-0.5">
            {t.reportedByYou}
          </span>
        </div>

        <div 
          onClick={() => setActiveScreen('my-reports')}
          className="flex flex-col p-3 rounded-2xl bg-[#e1ebe3] text-[#151d19] shadow-[0_2px_8px_rgba(46,125,50,0.04)] border border-[#dbe5dd]/50 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="material-symbols-outlined text-[#465860] text-[20px]">pending_actions</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#465860]"></span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#465860]">2</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#40493d] leading-tight mt-0.5">
            {t.inProgress}
          </span>
        </div>

        <div 
          onClick={() => setActiveScreen('activity')}
          className="flex flex-col p-3 rounded-2xl bg-[#d7e8c3] text-[#121f08] shadow-[0_2px_8px_rgba(46,125,50,0.04)] border border-[#bfcaba]/50 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="material-symbols-outlined text-[#0d631b] text-[20px]">task_alt</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d631b]"></span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#121f08]">18</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#3d4b30] leading-tight mt-0.5">
            {t.fixedInWard}
          </span>
        </div>
      </section>

      {/* Scheduled Work Banner */}
      <section className="flex items-start gap-3 p-4 rounded-2xl bg-[#e6f0e8] text-[#151d19] shadow-[0_4px_16px_rgba(46,125,50,0.05)] border border-[#dbe5dd]">
        <div className="p-2.5 rounded-xl bg-[#a3f69c] text-[#002204] shrink-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px]">engineering</span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-['Plus_Jakarta_Sans'] text-[12px] text-[#0d631b] font-bold uppercase tracking-wider">
              {t.scheduledWork}
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold text-[#40493d]">
              {MOCK_STATS.scheduledTime}
            </span>
          </div>
          <p className="font-['Inter'] text-[13px] text-[#151d19] mt-0.5 leading-snug">
            {MOCK_STATS.scheduledWork}
          </p>
        </div>
      </section>

      {/* Neighborhood Feed */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#151d19]">
              {t.neighborhoodFeed}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#e6f0e8] font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#0d631b]">
              {selectedWard.split('•')[0]}
            </span>
          </div>
          <button
            onClick={() => setActiveScreen('community-map')}
            className="font-['Plus_Jakarta_Sans'] text-[13px] font-semibold text-[#0d631b] hover:underline flex items-center gap-0.5"
            type="button"
          >
            <span>{t.viewMap}</span>
            <span className="material-symbols-outlined text-[16px]">map</span>
          </button>
        </div>

        {/* Feed Card 1: Verified Fix (Clickable to detail) */}
        <article
          onClick={() => handleCardClick(feedItems[0])}
          className="flex flex-col gap-3 p-4 rounded-3xl bg-white shadow-[0_4px_20px_-2px_rgba(46,125,50,0.06)] border border-[#d7e8c3]/60 cursor-pointer hover:border-[#2e7d32]/60 hover:shadow-md transition-all active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d7e8c3] text-[#0d631b] font-['Plus_Jakarta_Sans'] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#0d631b]"></span>
              {feedItems[0].badge}
            </span>
            <span className="font-['Inter'] text-[13px] text-[#40493d]">{feedItems[0].timeAgo}</span>
          </div>

          <div className="flex flex-col">
            <h4 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#151d19]">
              {feedItems[0].title}
            </h4>
            <p className="font-['Inter'] text-[13px] text-[#40493d] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[16px] text-[#0d631b]">pin_drop</span>
              <span>{feedItems[0].address} • {feedItems[0].matchScore}</span>
            </p>
          </div>

          <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
            <img
              className="w-full h-full object-cover"
              alt="Repaired road"
              src={feedItems[0].image}
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#151d19] font-['Plus_Jakarta_Sans'] text-[11px] font-bold shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#0d631b]">compare</span>
                {t.beforeAfterInspected}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block h-6 w-6 rounded-full bg-[#a3f69c] text-[#002204] text-center font-['Plus_Jakarta_Sans'] text-[10px] font-bold leading-6">MK</span>
                <span className="inline-block h-6 w-6 rounded-full bg-[#d7e8c3] text-[#121f08] text-center font-['Plus_Jakarta_Sans'] text-[10px] font-bold leading-6">JL</span>
                <span className="inline-block h-6 w-6 rounded-full bg-[#d2e6ef] text-[#0b1e24] text-center font-['Plus_Jakarta_Sans'] text-[10px] font-bold leading-6">+12</span>
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#40493d]">
                14 {t.neighborsConfirmed}
              </span>
            </div>

            <button
              onClick={(e) => handleHelpful(e, feedItems[0].id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-['Plus_Jakarta_Sans'] text-[13px] font-semibold transition-colors ${
                helpfulGiven[feedItems[0].id]
                  ? 'bg-[#2e7d32] text-white'
                  : 'bg-[#ecf6ee] text-[#0d631b] active:bg-[#d7e8c3]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              <span>{helpfulGiven[feedItems[0].id] ? 'Confirmed ' : t.helpful}</span>
            </button>
          </div>
        </article>

        {/* Feed Card 2: Dispatched */}
        <article className="flex flex-col gap-3 p-4 rounded-3xl bg-white shadow-[0_4px_20px_-2px_rgba(46,125,50,0.06)] border border-[#dbe5dd]">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e1ebe3] text-[#40493d] font-['Plus_Jakarta_Sans'] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px] text-[#465860]">local_shipping</span>
              {feedItems[1].badge}
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#ba1a1a] font-bold">
              {feedItems[1].expectedFix}
            </span>
          </div>

          <div className="flex flex-col">
            <h4 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#151d19]">
              {feedItems[1].title}
            </h4>
            <p className="font-['Inter'] text-[13px] text-[#40493d] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[16px] text-[#0d631b]">navigation</span>
              <span>{feedItems[1].address}</span>
            </p>
          </div>

          <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-100">
            <img
              className="w-full h-full object-cover"
              alt="Cracked shoulder road"
              src={feedItems[1].image}
            />
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#29322d]/80 backdrop-blur-md text-[#e9f3eb] font-['Plus_Jakarta_Sans'] text-[11px] font-bold">
              {feedItems[1].assignedTeam}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-[#0d631b]">
              <span className="material-symbols-outlined text-[18px]">update</span>
              <span className="font-['Inter'] text-[13px] text-[#40493d]">{feedItems[1].slaInfo}</span>
            </div>
            <button
              onClick={() => setActiveScreen('community-map')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#e6f0e8] hover:bg-[#e1ebe3] text-[#151d19] font-['Plus_Jakarta_Sans'] text-[13px] font-semibold transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span>Track</span>
            </button>
          </div>
        </article>

        {/* Feed Card 3: Under Verification */}
        <article className="flex flex-col gap-3 p-4 rounded-3xl bg-white shadow-[0_4px_20px_-2px_rgba(46,125,50,0.06)] border border-[#dbe5dd]">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecf6ee] text-[#0b1e24] font-['Plus_Jakarta_Sans'] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px] text-[#465860]">search</span>
              {feedItems[2].badge}
            </span>
            <span className="font-['Inter'] text-[13px] text-[#40493d]">{feedItems[2].timeAgo}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <h4 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#151d19]">
                {feedItems[2].title}
              </h4>
              <p className="font-['Inter'] text-[13px] text-[#40493d] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-[#0d631b]">location_on</span>
                <span>{feedItems[2].address}</span>
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[#40493d] font-['Plus_Jakarta_Sans'] text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#546346]"></span>
                <span>{feedItems[2].confirmations} neighbors confirmed hazard</span>
              </div>
            </div>

            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
              <img
                className="w-full h-full object-cover"
                alt="Manhole hazard"
                src={feedItems[2].image}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={(e) => handleSawToo(e, feedItems[2].id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full font-['Plus_Jakarta_Sans'] text-[13px] font-semibold active:scale-95 transition-all ${
                sawTooGiven[feedItems[2].id]
                  ? 'bg-[#2e7d32] text-white'
                  : 'bg-[#d7e8c3] text-[#121f08]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{sawTooGiven[feedItems[2].id] ? 'Confirmed ' : t.sawThisToo}</span>
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: feedItems[2].title, text: feedItems[2].address });
                } else {
                  alert("Link copied to clipboard!");
                }
              }}
              className="px-4 py-2 rounded-full bg-[#e6f0e8] text-[#40493d] font-['Plus_Jakarta_Sans'] text-[13px] font-semibold hover:text-[#151d19]"
              type="button"
            >
              {t.share}
            </button>
          </div>
        </article>
      </section>

      {/* Civic Tip Footer */}
      <section className="flex items-center gap-3 p-4 rounded-2xl bg-[#d7e8c3]/40 text-[#5a694c] border border-[#d7e8c3]">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2e7d32] text-white shrink-0">
          <span className="material-symbols-outlined text-[18px]">lightbulb</span>
        </div>
        <p className="font-['Inter'] text-[13px] text-[#151d19] leading-snug">
          <strong className="font-semibold text-[#0d631b] font-['Plus_Jakarta_Sans']">{t.civicTipTitle} </strong>
          {t.civicTipText}
        </p>
      </section>
    </div>
  );
}
