import React, { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { login as apiLogin } from '../services/api';

export default function LoginPage({ onLogin, lang, setLang, t }) {
  const [selectedRole, setSelectedRole] = useState('citizen'); // 'citizen' | 'contractor'
  const [identifier, setIdentifier] = useState(
    selectedRole === 'citizen' ? '+91 98201 54829' : 'APEX-CREW-04'
  );
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'citizen') {
      setIdentifier('+91 98201 54829');
    } else if (role === 'contractor') {
      setIdentifier('APEX-CREW-04');
    } else {
      setIdentifier('BMC-ENG-8402');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Try real backend first; api.login falls back to mock on failure
    const user = await apiLogin(identifier, password, selectedRole);
    onLogin(user);
  };

  const handleQuickDemo = async (role) => {
    // Quick-demo uses the pre-filled identifier for that role
    const demoId = role === 'citizen' ? '+91 98201 54829' : role === 'contractor' ? 'APEX-CREW-04' : 'BMC-ENG-8402';
    const user = await apiLogin(demoId, 'password123', role);
    onLogin(user);
  };

  return (
    <div className="min-h-screen w-full bg-[#f2fcf4] flex flex-col items-center justify-center p-4">
      {/* Container Box */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#d7e8c3]/80 p-6 flex flex-col gap-5 relative overflow-hidden">
        {/* Soft Background Tint */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#a3f69c]/25 blur-3xl pointer-events-none"></div>

        {/* Top Header with Logo & Language Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2e7d32] text-white flex items-center justify-center font-bold text-lg shadow-md">
              <span className="material-symbols-outlined text-[24px]">handyman</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[20px] text-[#0d631b] leading-tight">
                {t.appTitle}
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#546346] tracking-wider uppercase">
                Municipal Road Integrity
              </span>
            </div>
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
            className="px-3 py-1 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-bold border border-[#2e7d32]/30 bg-[#ecf6ee] hover:bg-[#d7e8c3] text-[#0d631b] transition-all"
          >
            {lang === 'en' ? 'मराठी' : 'ENG'}
          </button>
        </div>

        {/* Welcome Text */}
        <div className="flex flex-col gap-1">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold text-[#151d19]">
            {t.welcomeBack}
          </h1>
          <p className="font-['Inter'] text-[13px] text-[#40493d]">
            {t.loginSub}
          </p>
        </div>

        {/* 3-Role Selector Tabs */}
        <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#ecf6ee] border border-[#d7e8c3] gap-1">
          <button
            type="button"
            onClick={() => handleRoleChange('citizen')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-['Plus_Jakarta_Sans'] text-[12px] font-bold transition-all ${
              selectedRole === 'citizen'
                ? 'bg-white text-[#0d631b] shadow-sm'
                : 'text-[#40493d] hover:text-[#151d19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>Citizen</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('contractor')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-['Plus_Jakarta_Sans'] text-[12px] font-bold transition-all ${
              selectedRole === 'contractor'
                ? 'bg-white text-[#0d631b] shadow-sm'
                : 'text-[#40493d] hover:text-[#151d19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">engineering</span>
            <span>Contractor</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('officer')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-['Plus_Jakarta_Sans'] text-[12px] font-bold transition-all ${
              selectedRole === 'officer'
                ? 'bg-white text-[#0d631b] shadow-sm'
                : 'text-[#40493d] hover:text-[#151d19]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            <span>Municipal</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-['Plus_Jakarta_Sans'] text-[12px] font-bold text-[#40493d] flex items-center justify-between">
              <span>
                {selectedRole === 'citizen'
                  ? t.phoneOrId
                  : selectedRole === 'contractor'
                  ? t.contractorBadgeId
                  : 'Officer / JE ID'}
              </span>
              <span className="text-[#0d631b] text-[11px] font-normal">Pre-filled for Demo</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 material-symbols-outlined text-[#546346] text-[20px]">
                {selectedRole === 'citizen' ? 'phone_iphone' : (selectedRole === 'contractor' ? 'badge' : 'admin_panel_settings')}
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#f2fcf4] border border-[#d7e8c3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-[#151d19] font-['Plus_Jakarta_Sans'] text-[14px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Plus_Jakarta_Sans'] text-[12px] font-bold text-[#40493d] flex items-center justify-between">
              <span>{t.password}</span>
              <span className="text-[#0d631b] text-[11px] cursor-pointer hover:underline">Forgot?</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 material-symbols-outlined text-[#546346] text-[20px]">
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#f2fcf4] border border-[#d7e8c3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-[#151d19] font-['Plus_Jakarta_Sans'] text-[14px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#bfcaba] text-[#2e7d32] focus:ring-[#2e7d32] w-4 h-4"
              />
              <span className="font-['Inter'] text-[12px] text-[#40493d]">
                {t.rememberMe}
              </span>
            </label>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#0d631b]">
              256-Bit Encrypted
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#0d631b] hover:bg-[#2e7d32] text-white font-['Plus_Jakarta_Sans'] text-[15px] font-bold shadow-[0_4px_16px_rgba(46,125,50,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>{t.signInBtn}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="w-full border-t border-[#e6f0e8]"></div>
          <span className="absolute px-3 bg-white font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#546346] uppercase tracking-wider">
            {t.orQuickDemo}
          </span>
        </div>

        {/* 1-Tap Quick Demo Profiles */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('citizen')}
            className="w-full p-2.5 rounded-2xl bg-[#ecf6ee] hover:bg-[#d7e8c3] active:scale-[0.98] transition-all flex items-center justify-between border border-[#d7e8c3]"
          >
            <div className="flex items-center gap-3">
              <img
                src={MOCK_USERS.citizen.avatar}
                alt="Elena"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#0d631b]/30"
              />
              <div className="flex flex-col text-left">
                <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#151d19]">
                  Elena Vasquez
                </span>
                <span className="font-['Inter'] text-[11px] text-[#40493d]">
                  {t.citizenLogin} • Ward 14 Steward
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#0d631b] text-[20px]">
              chevron_right
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('contractor')}
            className="w-full p-2.5 rounded-2xl bg-[#e1ebe3] hover:bg-[#d7e8c3] active:scale-[0.98] transition-all flex items-center justify-between border border-[#bfcaba]"
          >
            <div className="flex items-center gap-3">
              <img
                src={MOCK_USERS.contractor.avatar}
                alt="Rajesh"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#546346]/40"
              />
              <div className="flex flex-col text-left">
                <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#151d19]">
                  Rajesh Shinde
                </span>
                <span className="font-['Inter'] text-[11px] text-[#40493d]">
                  {t.contractorLogin} • Apex Paving Crew #4
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#0d631b] text-[20px]">
              chevron_right
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('officer')}
            className="w-full p-2.5 rounded-2xl bg-[#ecf6ee] hover:bg-[#d7e8c3] active:scale-[0.98] transition-all flex items-center justify-between border border-[#2e7d32]/30"
          >
            <div className="flex items-center gap-3">
              <img
                src={MOCK_USERS.officer.avatar}
                alt="Dr. Arvind"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#0d631b]"
              />
              <div className="flex flex-col text-left">
                <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#151d19]">
                  Dr. Arvind Kulkarni
                </span>
                <span className="font-['Inter'] text-[11px] text-[#40493d]">
                  Municipal Junior Engineer • Ward K/East
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#0d631b] text-[20px]">
              chevron_right
            </span>
          </button>
        </div>

        {/* Security & Integrity Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[#546346] text-[11px] font-['Plus_Jakarta_Sans'] pt-1 border-t border-[#e6f0e8]">
          <span className="material-symbols-outlined text-[14px] text-[#0d631b]">verified</span>
          <span>CivicFix Anti-Gaming Computer Vision Verification Layer</span>
        </div>
      </div>
    </div>
  );
}
