import React, { useState } from 'react';
import { MOCK_WARD_ANALYTICS, MOCK_AUDIT_LEDGER, MOCK_USERS } from '../../data/mockData';

export default function WardHeatmapAnalytics({ onLogout, lang, setLang, t }) {
  const [selectedZone, setSelectedZone] = useState('All');
  const [isVerifyingLedger, setIsVerifyingLedger] = useState(false);
  const [ledgerVerified, setLedgerVerified] = useState(true);
  const [selectedWardData, setSelectedWardData] = useState(MOCK_WARD_ANALYTICS[0]);

  const handleVerifyChain = () => {
    setIsVerifyingLedger(true);
    setTimeout(() => {
      setIsVerifyingLedger(false);
      setLedgerVerified(true);
    }, 800);
  };

  const filteredWards = MOCK_WARD_ANALYTICS.filter((w) => {
    if (selectedZone === 'All') return true;
    return w.zone === selectedZone;
  });

  return (
    <div className="flex flex-col gap-4 pt-1 pb-24 max-w-5xl mx-auto w-full">
      {/* Header */}
      <header className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-[#d7e8c3]/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0d631b] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">analytics</span>
          </div>
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[17px] text-[#151d19]">
              {t.wardHeatmap}
            </span>
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] text-[#546346] font-semibold">
              BMC Infrastructure Command • Mumbai Metropolitan
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
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </header>

      {/* BMC Hierarchy Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#d7e8c3] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#151d19]">
            {t.drilldownHierarchy}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Zone I', 'Zone II', 'Zone IV'].map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-bold transition-all ${
                selectedZone === zone
                  ? 'bg-[#0d631b] text-white shadow-xs'
                  : 'bg-[#ecf6ee] text-[#40493d] hover:bg-[#e1ebe3]'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Ward Heatmap GIS Visual Canvas */}
      <section className="p-5 rounded-3xl bg-white border border-[#d7e8c3] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#151d19]">
              Mumbai Municipal Ward Density & Hotspots
            </h3>
            <span className="text-[12px] text-[#40493d]">
              Live GPS telemetry from citizen reports & contractor repair completions
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d7e8c3] text-[#0d631b] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#0d631b]"></span>
              High Fix Rate (&gt;90%)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
              Repeat Hotspots
            </span>
          </div>
        </div>

        {/* Stylized GIS Map Canvas with Density Clusters */}
        <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-[#e6f0e8] border border-[#d7e8c3] flex items-center justify-center">
          {/* Roads SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-50" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 20 Q 200 150 450 180 T 900 240" stroke="#c8e6c9" strokeWidth="24" fill="none" />
            <path d="M 280 10 Q 320 180 380 340" stroke="#c8e6c9" strokeWidth="18" fill="none" />
            <path d="M 120 300 Q 350 260 700 310" stroke="#d7e8c3" strokeWidth="20" fill="none" />
          </svg>

          {/* Heatmap Blobs */}
          <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-emerald-400/30 blur-2xl pointer-events-none"></div>
          <div className="absolute top-1/2 left-2/3 w-40 h-40 rounded-full bg-amber-400/25 blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-10 left-1/4 w-28 h-28 rounded-full bg-red-400/20 blur-xl pointer-events-none"></div>

          {/* Interactive Ward Pins */}
          {filteredWards.map((w, i) => (
            <button
              key={w.ward}
              onClick={() => setSelectedWardData(w)}
              className="absolute p-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#d7e8c3] hover:scale-105 transition-all text-left flex items-center gap-2.5"
              style={{
                top: `${25 + i * 18}%`,
                left: `${15 + i * 22}%`
              }}
            >
              <div className="w-8 h-8 rounded-full bg-[#0d631b] text-white flex items-center justify-center text-[12px] font-bold">
                {w.rate.split('.')[0]}%
              </div>
              <div className="flex flex-col">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] text-[#151d19]">
                  {w.ward.split('•')[0]}
                </span>
                <span className="text-[10px] text-[#40493d]">
                  {w.verifiedFixed} / {w.totalComplaints} Fixed
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Selected Ward Breakdown Detail */}
      {selectedWardData && (
        <section className="p-4 rounded-3xl bg-[#ecf6ee] border border-[#d7e8c3] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-mono text-[11px] font-bold text-[#0d631b]">
              {selectedWardData.zone} SELECTED
            </span>
            <h4 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#151d19]">
              {selectedWardData.ward}
            </h4>
            <span className="text-[12px] text-[#40493d]">
              Active Hotspot: <strong className="text-[#151d19]">{selectedWardData.activeHotspot}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl border border-[#d7e8c3] flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-[#546346]">Repair Rate</span>
              <span className="text-[18px] font-bold text-[#0d631b]">{selectedWardData.rate}</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#d7e8c3] flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-[#ba1a1a]">Repeat Fails</span>
              <span className="text-[18px] font-bold text-[#ba1a1a]">{selectedWardData.repeatFailures}</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#d7e8c3] flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-[#546346]">Top Contractor</span>
              <span className="text-[12px] font-bold text-[#151d19]">{selectedWardData.topContractor.split('(')[0]}</span>
            </div>
          </div>
        </section>
      )}

      {/* Cryptographic SHA-256 Tamper-Evident Audit Ledger */}
      <section className="p-5 rounded-3xl bg-white border border-[#d7e8c3] shadow-sm flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0d631b] text-[22px]">lock</span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#151d19]">
              {t.auditLedger}
            </h3>
          </div>

          <button
            onClick={handleVerifyChain}
            disabled={isVerifyingLedger}
            className="px-4 py-2 rounded-full bg-[#0d631b] hover:bg-[#2e7d32] text-white font-['Plus_Jakarta_Sans'] text-[12px] font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span className={`material-symbols-outlined text-[16px] ${isVerifyingLedger ? 'animate-spin' : ''}`}>
              {isVerifyingLedger ? 'sync' : 'verified'}
            </span>
            <span>{isVerifyingLedger ? 'Verifying Hashes...' : t.verifyLedger}</span>
          </button>
        </div>

        {ledgerVerified && !isVerifyingLedger && (
          <div className="p-3 rounded-2xl bg-[#d7e8c3] text-[#121f08] border border-[#a3f69c] flex items-center gap-2 text-[12px] font-['Plus_Jakarta_Sans'] font-bold">
            <span className="material-symbols-outlined text-[#0d631b] text-[18px]">check_circle</span>
            <span>Cryptographic Chain Verified: All SHA-256 block hashes match evidence proofs with 0 tamper events.</span>
          </div>
        )}

        {/* Ledger Blocks Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#d7e8c3]/80">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#ecf6ee] text-[#546346] font-['Plus_Jakarta_Sans'] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Block</th>
                <th className="p-3">Timestamp (UTC)</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Evidence Hash</th>
                <th className="p-3">Block Hash</th>
                <th className="p-3 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6f0e8] font-['Inter']">
              {MOCK_AUDIT_LEDGER.map((block) => (
                <tr key={block.block} className="hover:bg-[#f8fdf9]">
                  <td className="p-3 font-mono font-bold text-[#0d631b]">#{block.block}</td>
                  <td className="p-3 text-[#40493d]">{block.timestamp}</td>
                  <td className="p-3 font-['Plus_Jakarta_Sans'] font-bold text-[#151d19]">
                    <span className="px-2 py-0.5 rounded-full bg-[#ecf6ee] text-[#0d631b] text-[10px]">
                      {block.event}
                    </span>
                  </td>
                  <td className="p-3 text-[#151d19] truncate max-w-[150px]">{block.actor}</td>
                  <td className="p-3 font-mono text-[11px] text-[#546346]">{block.evidenceHash}</td>
                  <td className="p-3 font-mono text-[11px] text-[#0d631b]">{block.blockHash}</td>
                  <td className="p-3 text-right">
                    <span className="material-symbols-outlined text-[18px] text-[#0d631b]">verified</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
