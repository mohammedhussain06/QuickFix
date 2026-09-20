import React, { useState, useRef, useEffect } from 'react';
import { MOCK_INCIDENT_DETAIL } from '../data/mockData';

export default function ComplaintDetail({
  incident = MOCK_INCIDENT_DETAIL,
  setActiveScreen,
  t
}) {
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState(false);
  const [citizenVote, setCitizenVote] = useState(null); // 'yes' | 'no' | null
  const [showBlockModal, setShowBlockModal] = useState(false);
  const sliderRef = useRef(null);

  const handleSliderMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const onTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  const recordVote = (isAffirmative) => {
    setCitizenVote(isAffirmative ? 'yes' : 'no');
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 gap-4 pt-1">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => setActiveScreen('home')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[#0d631b] font-['Plus_Jakarta_Sans'] text-[13px] font-bold shadow-sm border border-[#d7e8c3] hover:bg-[#ecf6ee] active:scale-95 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Feed</span>
        </button>
        <span className="text-xs font-bold text-[#546346]">Incident Audit Dossier</span>
      </div>

      {/* Header Meta & Status Card */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#d7e8c3]/60 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#546346] tracking-wider uppercase">
            Report #{incident.id || "CF-8429"}
          </span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d7e8c3] text-[#121f08] rounded-full font-['Plus_Jakarta_Sans'] text-[11px] font-bold">
            <span className="material-symbols-outlined text-[15px] text-[#0d631b]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span>{incident.status || "Fix Verified & Completed"}</span>
          </div>
        </div>

        <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#151d19]">
          {incident.address || "342 Elm Street, Ward 14"}
        </h2>

        <div className="flex flex-wrap items-center gap-y-1 text-[#40493d] font-['Inter'] text-[13px]">
          <span className="inline-flex items-center gap-1 mr-3">
            <span className="material-symbols-outlined text-[16px] text-[#0d631b]">person</span>
            Reported {incident.reportedDate || "Oct 24"} by {incident.reporter || "You"}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#546346]">engineering</span>
            Repaired {incident.repairedDate || "Oct 26"} by {incident.crew || "Crew #4"}
          </span>
        </div>
      </div>

      {/* Interactive Before / After Comparison Showcase */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#d7e8c3]/60 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#0d631b] text-[20px]">compare</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#151d19]">
              {t.inspectionProof}
            </span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#40493d] bg-[#ecf6ee] px-2.5 py-0.5 rounded-full">
            Interactive Slider
          </span>
        </div>

        {/* Draggable Slider Box */}
        <div
          ref={sliderRef}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleSliderMove(e.clientX);
          }}
          onTouchMove={onTouchMove}
          className="relative w-full h-72 rounded-2xl overflow-hidden select-none touch-pan-y shadow-inner bg-[#ecf6ee] cursor-ew-resize border border-[#d7e8c3]"
        >
          {/* AFTER Image (Full Width Base) */}
          <img
            alt="After road repair"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            src={incident.afterImage || MOCK_INCIDENT_DETAIL.afterImage}
          />
          <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full font-['Plus_Jakarta_Sans'] text-[11px] font-bold pointer-events-none flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#a3f69c]"></span>
            AFTER (Oct 26)
          </div>

          {/* BEFORE Image (Clipped Left Overlay) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              alt="Before repair pothole"
              className="absolute top-0 left-0 h-full object-cover max-w-none"
              style={{ width: sliderRef.current ? `${sliderRef.current.clientWidth}px` : '100vw' }}
              src={incident.beforeImage || MOCK_INCIDENT_DETAIL.beforeImage}
            />
            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full font-['Plus_Jakarta_Sans'] text-[11px] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
              BEFORE (Oct 24)
            </div>
          </div>

          {/* Center Draggable Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 -ml-4 w-8 flex flex-col items-center justify-center z-20 pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-1 h-full bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)]"></div>
            <div className="absolute w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center text-[#0d631b] border-2 border-[#2e7d32]">
              <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
            </div>
          </div>
        </div>

        {/* Preset quick buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSliderPos(100)}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
              sliderPos === 100
                ? 'bg-[#2e7d32] text-white shadow-sm'
                : 'bg-[#ecf6ee] text-[#40493d] hover:bg-[#d7e8c3]'
            }`}
          >
            100% Before
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(50)}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
              sliderPos === 50
                ? 'bg-[#2e7d32] text-white shadow-sm'
                : 'bg-[#ecf6ee] text-[#40493d] hover:bg-[#d7e8c3]'
            }`}
          >
            50/50 Split
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(0)}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
              sliderPos === 0
                ? 'bg-[#2e7d32] text-white shadow-sm'
                : 'bg-[#ecf6ee] text-[#40493d] hover:bg-[#d7e8c3]'
            }`}
          >
            100% After
          </button>
        </div>

        <p className="text-center font-['Plus_Jakarta_Sans'] text-[12px] font-semibold text-[#40493d] flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-[#0d631b]">touch_app</span>
          {t.dragSliderTip}
        </p>
      </div>

      {/* Verification Confidence & Telemetry Chips */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#d7e8c3]/60 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#546346] uppercase">
              {t.validationMetrics}
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-[22px] font-bold text-[#0d631b]">
              {incident.confidence || 98.4}% Match
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecf6ee] text-[#0d631b] border border-[#d7e8c3]">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold">{t.highAiConf}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          {(incident.metrics || MOCK_INCIDENT_DETAIL.metrics).map((m, idx) => (
            <div key={idx} className="p-2.5 rounded-2xl bg-[#ecf6ee] flex items-center gap-2 border border-[#dbe5dd]/60">
              <span className="material-symbols-outlined text-[#0d631b] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <div className="min-w-0">
                <p className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#151d19] font-bold truncate">
                  {m.label}
                </p>
                <p className="font-['Inter'] text-[12px] text-[#40493d] truncate">
                  {m.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#d7e8c3]/60 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0d631b] text-[20px]">timeline</span>
          <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#151d19]">
            {t.resolutionJourney}
          </h3>
        </div>

        <div className="relative pl-6 flex flex-col gap-4 mt-2">
          {/* Vertical Connecting Bar */}
          <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-[#d7e8c3]"></div>

          {(incident.timeline || MOCK_INCIDENT_DETAIL.timeline).map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-3">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-xs z-10 ${
                  step.completed
                    ? 'bg-[#2e7d32] text-white'
                    : step.current
                    ? 'bg-[#546346] text-white animate-pulse'
                    : 'bg-[#dbe5dd] text-[#707a6c]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {step.completed ? 'check' : step.current ? 'pending' : 'schedule'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <p className={`font-['Plus_Jakarta_Sans'] text-[13px] font-bold ${
                  step.current ? 'text-[#0d631b]' : 'text-[#151d19]'
                }`}>
                  {step.title}
                </p>
                <p className="font-['Inter'] text-[12px] text-[#40493d]">
                  {step.date} • {step.actor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Confirmation Prompt Card ("Is it fixed?") */}
      <div className="bg-[#ecf6ee] p-4 rounded-3xl shadow-sm border border-[#d7e8c3] flex flex-col gap-3 transition-all duration-300">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#d7e8c3] flex items-center justify-center text-[#0d631b] shrink-0">
            <span className="material-symbols-outlined text-[22px]">how_to_vote</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#151d19]">
              {t.doesItLookFixed}
            </h4>
            <p className="font-['Inter'] text-[13px] text-[#40493d] mt-0.5">
              {t.confirmPromptSub}
            </p>
          </div>
        </div>

        {citizenVote === null ? (
          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              onClick={() => recordVote(true)}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-[#0d631b] text-white font-['Plus_Jakarta_Sans'] text-[13px] font-bold active:scale-95 transition-all shadow-[0_4px_14px_rgba(46,125,50,0.3)] hover:bg-[#2e7d32]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              <span>{t.yesLooksGreat}</span>
            </button>
            <button
              onClick={() => recordVote(false)}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-[#e1ebe3] text-[#151d19] font-['Plus_Jakarta_Sans'] text-[13px] font-bold active:scale-95 transition-all hover:bg-[#dbe5dd]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">thumb_down</span>
              <span>{t.stillAnIssue}</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-[#d7e8c3] text-[#121f08] rounded-2xl flex items-center gap-2 font-['Inter'] text-[13px] animate-in fade-in zoom-in-95 duration-200">
            <span className="material-symbols-outlined text-[20px] text-[#0d631b]">
              {citizenVote === 'yes' ? 'check_circle' : 'report'}
            </span>
            <span>
              {citizenVote === 'yes'
                ? t.feedbackLogged
                : 'Report flagged for secondary municipal crew inspection. Thank you!'}
            </span>
          </div>
        )}
      </div>

      {/* Contractor & Cryptographic Ledger Footer */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#d7e8c3]/60 flex flex-col gap-2 text-[#40493d] font-['Inter'] text-[13px]">
        <div className="flex items-center justify-between">
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#546346] uppercase">
            {t.assignedVendor}
          </span>
          <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#151d19]">
            {incident.contractor || "Apex Paving Ltd."}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#546346] uppercase">
            {t.ledgerSeal}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] text-[#0d631b] font-bold">
              {incident.ledgerHash || "#e7a4...9f01"} (Verified)
            </span>
            <button
              type="button"
              onClick={() => setShowBlockModal(true)}
              className="text-[11px] font-bold text-[#0d631b] bg-[#ecf6ee] hover:bg-[#d7e8c3] px-2 py-0.5 rounded-md border border-[#d7e8c3]"
            >
              Inspect Block
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-1 text-[#546346] border-t border-[#ecf6ee] text-[12px]">
          <span className="material-symbols-outlined text-[15px] text-[#0d631b]">lock</span>
          <span>{t.immutableAudit}</span>
        </div>
      </div>

      {/* Block Inspection Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#d7e8c3] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#0d631b]">
                <span className="material-symbols-outlined">token</span>
                <h4 className="font-bold text-base text-[#151d19]">Cryptographic Merkle Block</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            
            <div className="space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-2xl border border-slate-200 text-slate-700">
              <div><span className="text-slate-400">Block Height:</span> #1,842,903</div>
              <div><span className="text-slate-400">Ledger Root:</span> 0x9f83a21...8b40</div>
              <div><span className="text-slate-400">Sensor Proof:</span> GPS ±1.2m, HDG 284°</div>
              <div><span className="text-slate-400">Timestamp:</span> {new Date().toISOString()}</div>
              <div><span className="text-slate-400">State:</span> Consensus Finalized </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBlockModal(false)}
              className="mt-5 w-full py-3 rounded-2xl bg-[#0d631b] text-white font-bold text-sm hover:bg-[#2e7d32] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
