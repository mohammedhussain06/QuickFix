import React, { useState, useRef, useEffect } from 'react';
import { MOCK_MUNICIPAL_QUEUE, MOCK_USERS } from '../../data/mockData';

export default function MunicipalReviewDashboard({ onLogout, lang, setLang, t }) {
  const [queue, setQueue] = useState(MOCK_MUNICIPAL_QUEUE);
  const [selectedItem, setSelectedItem] = useState(MOCK_MUNICIPAL_QUEUE[0]);
  const [showKeypoints, setShowKeypoints] = useState(true);
  const [showYoloMask, setShowYoloMask] = useState(false);
  const [decisionFeedback, setDecisionFeedback] = useState(null);
  const canvasRef = useRef(null);

  // Redraw keypoints canvas when item or toggle changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showKeypoints || !selectedItem.keypoints || selectedItem.keypoints.length === 0) return;

    const w = canvas.width;
    const h = canvas.height;
    const midX = w / 2;

    selectedItem.keypoints.forEach((kp, idx) => {
      // Point 1 on Left (Before) image
      const x1 = (kp.x1 / 100) * midX;
      const y1 = (kp.y1 / 100) * h;

      // Point 2 on Right (After) image
      const x2 = midX + (kp.x2 / 100) * midX;
      const y2 = (kp.y2 / 100) * h;

      // Draw matched connecting line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#10b981'; // emerald
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw point on left
      ctx.beginPath();
      ctx.arc(x1, y1, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#0d631b';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Draw point on right
      ctx.beginPath();
      ctx.arc(x2, y2, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.stroke();
    });
  }, [selectedItem, showKeypoints]);

  const handleApprove = () => {
    setDecisionFeedback({
      type: 'approved',
      title: 'Work Order Approved & Escrow Released! ',
      msg: `Pothole repair at ${selectedItem.address} has been signed off. ${selectedItem.payout} released to ${selectedItem.contractor}. Tamper-evident ledger Block #422 generated.`
    });
  };

  const handleReject = () => {
    setDecisionFeedback({
      type: 'rejected',
      title: 'Work Order Rejected & Fine Issued! ',
      msg: `Repair at ${selectedItem.address} rejected. Discrepancy logged on municipal ledger. Contractor must retake alignment within 12 hours.`
    });
  };

  return (
    <div className="flex flex-col gap-4 pt-1 pb-24 max-w-5xl mx-auto w-full">
      {/* Officer Header */}
      <header className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-[#d7e8c3]/80">
        <div className="flex items-center gap-3">
          <img
            src={MOCK_USERS.officer.avatar}
            alt="Dr. Arvind Kulkarni"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0d631b]"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[17px] text-[#151d19]">
                {MOCK_USERS.officer.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ecf6ee] text-[#0d631b] font-mono text-[10px] font-bold">
                {MOCK_USERS.officer.id}
              </span>
            </div>
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] text-[#546346] font-semibold">
              {MOCK_USERS.officer.title} • {MOCK_USERS.officer.department}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
            className="px-3 py-1 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-bold border border-[#2e7d32]/30 bg-[#ecf6ee] text-[#0d631b]"
          >
            {lang === 'en' ? 'मराठी' : 'ENG'}
          </button>
          <button
            onClick={onLogout}
            className="w-9 h-9 rounded-full bg-[#ecf6ee] text-[#ba1a1a] hover:bg-[#ffdad6] flex items-center justify-center transition-colors"
            title={t.logout}
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </header>

      {/* Main Split Grid: Queue on Left, Evidence Inspector on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Verification Queue (4 cols on desktop) */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#151d19] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#0d631b] text-[20px]">fact_check</span>
              <span>{t.reviewQueue}</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#d7e8c3] text-[#0d631b] text-[11px] font-bold">
              {queue.length} Pending
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {queue.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setDecisionFeedback(null);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white border-[#2e7d32] shadow-md ring-2 ring-[#0d631b]/20'
                      : 'bg-[#f8fdf9] border-[#d7e8c3]/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#546346]">
                      {item.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold ${
                        item.aiStatus === 'AUTO_PASS'
                          ? 'bg-[#d7e8c3] text-[#0d631b]'
                          : item.aiStatus === 'FLAGGED_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      AI: {item.confidence}%
                    </span>
                  </div>

                  <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#151d19] truncate mt-1">
                    {item.address}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-[#40493d] mt-1">
                    <span className="truncate max-w-[160px]">{item.contractor}</span>
                    <span className="font-semibold text-[#0d631b]">{item.payout}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Evidence Inspector (8 cols on desktop) */}
        <div className="md:col-span-8 flex flex-col gap-4 bg-white p-5 rounded-3xl shadow-sm border border-[#d7e8c3]/80">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[11px] font-bold text-[#0d631b]">
                EVIDENCE DOSSIER: #{selectedItem.id} ({selectedItem.complaintId})
              </span>
              <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#151d19]">
                {selectedItem.address}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-bold ${
                  selectedItem.aiStatus === 'AUTO_PASS'
                    ? 'bg-[#d7e8c3] text-[#0d631b]'
                    : selectedItem.aiStatus === 'FLAGGED_REVIEW'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                AI Confidence: {selectedItem.confidence}%
              </span>
            </div>
          </div>

          {/* Dual Photos View with Keypoint Overlays & Canvas Match Lines */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-[#29322d] border border-[#d7e8c3]">
            {/* Grid of Two Photos Side by Side */}
            <div className="grid grid-cols-2 w-full h-64 sm:h-80">
              {/* Left Photo: Citizen Before */}
              <div className="relative w-full h-full overflow-hidden border-r border-white/20">
                <img
                  src={selectedItem.beforeImage}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white font-['Plus_Jakarta_Sans'] text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  CITIZEN BEFORE
                </span>
              </div>

              {/* Right Photo: Contractor After */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={selectedItem.afterImage}
                  alt="After"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white font-['Plus_Jakarta_Sans'] text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                  CONTRACTOR AFTER
                </span>

                {/* YOLOv8 Segmentation Mask Glow Overlay */}
                {showYoloMask && (
                  <div className="absolute inset-0 bg-emerald-500/25 pointer-events-none flex items-center justify-center">
                    <div className="w-36 h-28 border-2 border-emerald-400 rounded-full bg-emerald-400/30 flex items-center justify-center animate-pulse">
                      <span className="text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded">
                        100% Bitumen Patch
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Canvas overlay for Matched Keypoint Connection Lines */}
            <canvas
              ref={canvasRef}
              width={760}
              height={320}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            />
          </div>

          {/* Toggle Controls for Inspector */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#ecf6ee] border border-[#d7e8c3]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowKeypoints(!showKeypoints)}
                className={`px-3 py-1 rounded-xl text-[11px] font-['Plus_Jakarta_Sans'] font-bold flex items-center gap-1.5 transition-all ${
                  showKeypoints
                    ? 'bg-[#0d631b] text-white shadow-xs'
                    : 'bg-white text-[#40493d] border border-[#d7e8c3]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">linear_scale</span>
                <span>{t.keypointMatching}</span>
              </button>

              <button
                onClick={() => setShowYoloMask(!showYoloMask)}
                className={`px-3 py-1 rounded-xl text-[11px] font-['Plus_Jakarta_Sans'] font-bold flex items-center gap-1.5 transition-all ${
                  showYoloMask
                    ? 'bg-[#0d631b] text-white shadow-xs'
                    : 'bg-white text-[#40493d] border border-[#d7e8c3]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">highlight</span>
                <span>{t.yoloMaskToggle}</span>
              </button>
            </div>

            <span className="text-[11px] font-semibold text-[#546346]">
              {selectedItem.keypoints.length} landmark keypoints linked
            </span>
          </div>

          {/* Multi-Sensor Verification Checks Table */}
          <div className="flex flex-col gap-2">
            <h4 className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#151d19] uppercase tracking-wider">
              Verification Check Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedItem.checks.map((chk, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-[#f8fdf9] border border-[#d7e8c3]/80 flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-['Plus_Jakarta_Sans'] text-[12px] font-bold text-[#151d19]">
                      {chk.name}
                    </span>
                    <span className="font-['Inter'] text-[11px] text-[#40493d]">
                      {chk.detail}
                    </span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      chk.passed ? 'text-[#0d631b]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {chk.passed ? 'check_circle' : 'cancel'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Feedback Banner */}
          {decisionFeedback && (
            <div
              className={`p-4 rounded-2xl flex flex-col gap-1 animate-in fade-in duration-200 ${
                decisionFeedback.type === 'approved'
                  ? 'bg-[#d7e8c3] text-[#121f08] border border-[#a3f69c]'
                  : 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/40'
              }`}
            >
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[14px]">
                {decisionFeedback.title}
              </span>
              <p className="font-['Inter'] text-[12px]">{decisionFeedback.msg}</p>
            </div>
          )}

          {/* Officer Decision Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e6f0e8]">
            <button
              onClick={handleApprove}
              className="py-3 px-4 rounded-full bg-[#0d631b] hover:bg-[#2e7d32] text-white font-['Plus_Jakarta_Sans'] text-[14px] font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>{t.approveRepair} ({selectedItem.payout})</span>
            </button>

            <button
              onClick={handleReject}
              className="py-3 px-4 rounded-full bg-[#ffdad6] hover:bg-[#ba1a1a] hover:text-white text-[#ba1a1a] font-['Plus_Jakarta_Sans'] text-[14px] font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">gpp_bad</span>
              <span>{t.rejectRepair}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
