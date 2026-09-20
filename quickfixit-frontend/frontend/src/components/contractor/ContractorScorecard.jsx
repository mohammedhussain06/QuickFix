import React, { useState } from 'react';
import { MOCK_CONTRACTOR_SCORECARD, MOCK_USERS } from '../../data/mockData';

export default function ContractorScorecard({ onLogout, lang, setLang, t }) {
  const scorecard = MOCK_CONTRACTOR_SCORECARD;
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="flex flex-col gap-4 pt-1 pb-28 relative">
      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0d631b] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-[#d7e8c3]/80">
        <div className="flex items-center gap-3">
          <img
            src={MOCK_USERS.contractor.avatar}
            alt="Rajesh Shinde"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0d631b]"
          />
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#151d19]">
              Rajesh Shinde
            </span>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] text-[#546346] font-semibold">
              Apex Paving Ltd. • Tier 1 Verified Vendor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
            className="px-2.5 py-1 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-bold border border-[#2e7d32]/30 bg-[#ecf6ee] text-[#0d631b]"
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

      {/* Main Performance Hero Banner */}
      <section className="p-5 rounded-3xl bg-gradient-to-br from-[#0d631b] to-[#1b5e20] text-white shadow-xl flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-['Plus_Jakarta_Sans'] font-bold">
            <span className="material-symbols-outlined text-[13px] inline mr-1 text-amber-300">military_tech</span>Tier 1 Verified Contractor
          </span>
          <span className="text-[12px] font-bold text-[#cbffc2] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Pay-on-Verification Active
          </span>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-[12px] font-['Plus_Jakarta_Sans'] text-white/80 uppercase tracking-wider">
              {t.verifiedRate}
            </span>
            <span className="text-[36px] font-bold font-['Plus_Jakarta_Sans'] leading-none mt-1">
              {scorecard.verifiedRate}
            </span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] text-white/80">
              Target &gt; 92.0%
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#cbffc2] text-[#002204] text-[11px] font-bold mt-1">
              +4.8% Above SLA
            </span>
          </div>
        </div>
      </section>

      {/* Financial Payout Summary Cards */}
      <section className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-[#d7e8c3] shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between text-[#546346]">
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold uppercase">
              {t.payoutReleased}
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#0d631b]">account_balance_wallet</span>
          </div>
          <span className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#0d631b] mt-1">
            {scorecard.payoutReleased}
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-[#40493d]">Direct to Bank</span>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-2 py-0.5 rounded-lg bg-[#0d631b] text-white text-[10px] font-bold hover:bg-[#2e7d32]"
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#d7e8c3] shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between text-[#546346]">
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold uppercase">
              {t.inEscrow}
            </span>
            <span className="material-symbols-outlined text-[18px] text-amber-600">lock_clock</span>
          </div>
          <span className="text-[20px] font-['Plus_Jakarta_Sans'] font-bold text-[#151d19] mt-1">
            {scorecard.inEscrowReview}
          </span>
          <span className="text-[10px] text-[#40493d]">Auto-releases in 24h</span>
        </div>
      </section>

      {/* 60-Day Monsoon Defect Liability Guarantee */}
      <section className="p-4 rounded-3xl bg-[#ecf6ee] border border-[#d7e8c3] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2e7d32] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </div>
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#151d19]">
              {t.monsoonDefectLiability}
            </span>
            <span className="font-['Inter'] text-[11px] text-[#40493d]">
              {t.zeroFailures}
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#0d631b] text-[20px]">check_circle</span>
      </section>

      {/* Completed Repairs Cryptographic Ledger List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#151d19]">
            Recent Verified Ledger Entries
          </h3>
          <span className="text-[11px] font-bold text-[#0d631b]">SHA-256 Chained</span>
        </div>

        {scorecard.ledgerHistory.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedReceipt(item)}
            className="p-3.5 rounded-2xl bg-white border border-[#d7e8c3]/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#0d631b] active:scale-[0.99] transition-all"
          >
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-[#0d631b]">
                  {item.id}
                </span>
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] text-[#546346]">
                  {item.date}
                </span>
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#151d19] truncate mt-0.5">
                {item.address}
              </span>
              <span className="font-mono text-[10px] text-[#40493d]">
                Hash: {item.hash} • Click for Receipt
              </span>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#0d631b]">
                {item.payout}
              </span>
              <span className="text-[11px] font-bold text-[#0d631b] bg-[#ecf6ee] px-2 py-0.5 rounded-full mt-0.5">
                {item.score}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Download Certificate Action */}
      <button
        type="button"
        onClick={() => showToast('Tax & Cryptographic Ledger Certificate downloaded.')}
        className="w-full py-3.5 rounded-2xl bg-[#ecf6ee] hover:bg-[#d7e8c3] text-[#0d631b] border border-[#d7e8c3] font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-base">download</span>
        <span>Download Tax & Audit Certificate (FY 2025-26)</span>
      </button>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#d7e8c3] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#0d631b]">
                <span className="material-symbols-outlined">payments</span>
                <h4 className="font-bold text-base text-[#151d19]">Instant IMPS Transfer</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            
            <p className="text-xs text-[#40493d] mb-4">
              Transfer verified funds to your linked contractor account (HDFC Bank •••• 4912).
            </p>

            <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200 text-slate-700 font-mono mb-4">
              <div className="flex justify-between">
                <span>Available Payout:</span>
                <strong className="text-[#0d631b]">₹1,84,000</strong>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee:</span>
                <span>₹0 (Govt. Zero Charge)</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Net Transfer:</span>
                <span className="text-[#0d631b]">₹1,84,000</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowWithdrawModal(false);
                  showToast('₹1,84,000 successfully disbursed to Rajesh Shinde via IMPS.');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0d631b] text-white text-xs font-bold hover:bg-[#2e7d32]"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Ledger Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#d7e8c3] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#0d631b]">
                <span className="material-symbols-outlined">receipt_long</span>
                <h4 className="font-bold text-base text-[#151d19]">Audit Ledger Receipt</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-2xl border border-slate-200 text-slate-700 mb-4">
              <div><span className="text-slate-400">Order ID:</span> {selectedReceipt.id}</div>
              <div><span className="text-slate-400">Location:</span> {selectedReceipt.address}</div>
              <div><span className="text-slate-400">Date Verified:</span> {selectedReceipt.date}</div>
              <div><span className="text-slate-400">Disbursed Amount:</span> <strong className="text-[#0d631b]">{selectedReceipt.payout}</strong></div>
              <div><span className="text-slate-400">AI Confidence:</span> {selectedReceipt.score}</div>
              <div className="break-all"><span className="text-slate-400">Ledger Hash:</span> {selectedReceipt.hash}</div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedReceipt(null);
                showToast(`Receipt for ${selectedReceipt.id} saved.`);
              }}
              className="w-full py-2.5 rounded-xl bg-[#0d631b] text-white text-xs font-bold hover:bg-[#2e7d32]"
            >
              Print / Save Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
