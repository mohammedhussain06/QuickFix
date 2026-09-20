import React, { useState } from 'react';
import { MOCK_INCIDENT_DETAIL } from '../data/mockData';

export default function CivicActivity({ setActiveScreen, setSelectedIncident, selectedWard, t }) {
  const [stewardPoints, setStewardPoints] = useState(320);
  const [votes, setVotes] = useState({});
  const [rewardToast, setRewardToast] = useState(null);

  const pendingVerifications = [
    {
      id: "CF-8429",
      title: "Deep Pothole at 342 Elm St",
      address: "342 Elm Street, Ward 14",
      contractor: "Apex Paving Ltd. (Crew #4)",
      repairedDate: "2 hours ago",
      confidence: "98.4% AI Match",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0TpDjXqMy-XXPRo3jnGEZX6mNFVQwk4uHkdhs8-Rd9MWdBolqnPAC8HAj4SjbrIJl_qpPDrj7w5a7aKbUyACYce8jSnloSQQv3uQAF_nxrWdlIghUuGqfRKB7mgmDW0uRMHs5bqUTTqomyj1F44Dra3zNiF3YqAKTZWI_v-p2z15d4N-6tGfCjvRy_rfbHapOYLCIDB2_a3QCjyBq-w9dF2Csth_j3tZE2kF1pS22493WeVNH0-x35w"
    },
    {
      id: "CF-8420",
      title: "Asphalt Restoration at Victoria Terminus Link",
      address: "Victoria Terminus Link Rd, Ward 14",
      contractor: "Apex Paving Ltd. (Crew #4)",
      repairedDate: "Yesterday",
      confidence: "98.9% AI Match",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD34BtGNaMowD674Rfy8Ry0_HVg91KXAhn-jOkHLaPl4Qopvgb_EgklAQe-QF6Z2pjtzrFXWn3hTSQoKF9NJCQ3WR6tjSeDC1gWc8tWjwB-zWtBoMG6vUCZYGhYobxQn5LYiP0z57NJPHrlTekmz1WxEdA-SuHcFsMy61yZvoBoRQdBliQl7qkzaP-11zGUeOTykUWSXGj8cwmQS0h_MUNmMzQOal9GE_umK83uVlscwjbOlhsTtnxkaA"
    }
  ];

  const auditStream = [
    { time: "12m ago", text: "Apex Paving Crew #4 submitted repair proof photo for CF-8429", tag: "Proof Logged" },
    { time: "24m ago", text: "AI Computer Vision validated homography & depth with 98.4% score", tag: "AI Auto-Pass" },
    { time: "1h ago", text: "BMC Executive Officer Dr. Arvind Kulkarni approved ₹12,000 escrow release", tag: "Payout Approved" },
    { time: "3h ago", text: "Citizen Elena Vasquez reported hazard at Oak Ridge Ave", tag: "Report Filed" },
    { time: "5h ago", text: "SHA-256 Ledger Block #1429 sealed on municipal chain", tag: "Ledger Sealed" }
  ];

  const handleVote = (id, isFixed) => {
    setVotes(p => ({ ...p, [id]: isFixed ? 'fixed' : 'disputed' }));
    if (isFixed) {
      setStewardPoints(p => p + 10);
      setRewardToast(`+10 Civic Points awarded! Repair #${id} verified.`);
    } else {
      setRewardToast(`Inspection dispute logged for #${id}. Flagged for BMC engineer review.`);
    }
    setTimeout(() => setRewardToast(null), 3000);
  };

  return (
    <div className="flex flex-col gap-4 pt-2 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#151d19]">Citizen Activity & Voting</h2>
          <p className="font-['Inter'] text-[12px] text-[#40493d]">{selectedWard}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#d7e8c3] text-[#0d631b] font-['Plus_Jakarta_Sans'] text-[12px] font-bold">
          Steward Active
        </span>
      </div>

      {/* Reward Toast */}
      {rewardToast && (
        <div className="p-3 bg-[#0d631b] text-white rounded-2xl flex items-center justify-between text-[12px] font-bold shadow-lg animate-in fade-in">
          <span>{rewardToast}</span>
          <span className="material-symbols-outlined text-[18px]">verified</span>
        </div>
      )}

      {/* Steward Reputation Card */}
      <section className="p-4 rounded-3xl bg-gradient-to-br from-[#0d631b] to-[#1b5e20] text-white shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm"></span>
            <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold">Level 3 Neighborhood Steward</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#cbffc2] text-[#002204] text-[11px] font-extrabold">
            {stewardPoints} Pts
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] text-white/80">
            <span>Progress to Level 4 Chief Steward</span>
            <span>{stewardPoints} / 400</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-[#cbffc2] rounded-full transition-all duration-500" style={{ width: `${(stewardPoints / 400) * 100}%` }}></div>
          </div>
        </div>
        <p className="text-[11px] text-white/80">Earn +10 points for every completed road repair confirmed in your ward.</p>
      </section>

      {/* Community Verification Cards */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#151d19]">Pending Local Confirmation</h3>
          <span className="text-[11px] font-bold text-[#0d631b]">Vote to Earn</span>
        </div>

        {pendingVerifications.map((item) => {
          const vote = votes[item.id];
          return (
            <div key={item.id} className="p-4 rounded-3xl bg-white border border-[#d7e8c3] shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#0d631b] bg-[#ecf6ee] px-2.5 py-0.5 rounded-full">{item.id}</span>
                <span className="text-[11px] font-bold text-[#0d631b] bg-[#d7e8c3] px-2 py-0.5 rounded-full">{item.confidence}</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-[#ecf6ee] relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">AFTER</span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <h4 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#151d19] truncate">{item.title}</h4>
                  <p className="font-['Inter'] text-[12px] text-[#40493d] truncate mt-0.5">{item.address}</p>
                  <span className="text-[11px] text-[#546346] mt-1">{item.contractor} • {item.repairedDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f2fcf4]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIncident({
                      ...MOCK_INCIDENT_DETAIL,
                      id: item.id,
                      title: item.title,
                      address: item.address,
                      afterImage: item.image
                    });
                    setActiveScreen('detail');
                  }}
                  className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#0d631b] hover:underline flex items-center gap-1"
                >
                  <span>Inspect Telemetry</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>

                {vote ? (
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                    vote === 'fixed' ? 'bg-[#d7e8c3] text-[#0d631b]' : 'bg-red-100 text-red-700'
                  }`}>
                    {vote === 'fixed' ? 'Confirmed Fixed ' : 'Disputed '}
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleVote(item.id, false)}
                      className="px-3 py-1.5 rounded-full bg-[#f2fcf4] hover:bg-red-50 text-red-700 font-bold text-[11px] border border-red-200 active:scale-95"
                    >
                      Still Bad 
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVote(item.id, true)}
                      className="px-3.5 py-1.5 rounded-full bg-[#0d631b] hover:bg-[#2e7d32] text-white font-bold text-[11px] shadow-xs active:scale-95 flex items-center gap-1"
                    >
                      <span>Looks Fixed </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Neighborhood Live Audit Stream */}
      <div className="flex flex-col gap-3 mt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#151d19]">Live Neighborhood Audit Stream</h3>
          <span className="text-[11px] font-bold text-[#0d631b]">Real-Time</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#d7e8c3] shadow-sm flex flex-col gap-3">
          {auditStream.map((ev, i) => (
            <div key={i} className="flex items-start gap-3 pb-2.5 border-b border-[#f2fcf4] last:border-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-[#0d631b] mt-1.5 shrink-0"></div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-[12px] font-['Inter'] text-[#151d19] leading-snug">{ev.text}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-[#40493d]">
                  <span className="font-semibold">{ev.time}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#ecf6ee] text-[#0d631b] font-bold">{ev.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
