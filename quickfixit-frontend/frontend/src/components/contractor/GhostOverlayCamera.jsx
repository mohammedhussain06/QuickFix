import React, { useState, useRef } from 'react';
import { MOCK_CONTRACTOR_JOBS } from '../../data/mockData';
import { submitRepairAndVerify } from '../../services/api';

export default function GhostOverlayCamera({
  job = MOCK_CONTRACTOR_JOBS[0],
  setActiveScreen,
  t
}) {
  const [opacity, setOpacity] = useState(45); // percentage (0 - 100)
  const [scenario, setScenario] = useState('genuine'); // 'genuine' | 'different_pothole' | 'wrong_angle' | 'photo_reuse'
  const [isCapturing, setIsCapturing] = useState(false);
  const [verdictResult, setVerdictResult] = useState(null);
  const [customAfterPhoto, setCustomAfterPhoto] = useState(null);
  const [customAfterPreview, setCustomAfterPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleAfterFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomAfterPhoto(file);
      setCustomAfterPreview(URL.createObjectURL(file));
      setScenario('genuine');
    }
  };

  const loadDemoAfterSample = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      setCustomAfterPhoto(blob);
      setCustomAfterPreview(url);
      setScenario('genuine');
    } catch (err) {
      console.error('Failed to load after demo sample:', err);
    }
  };

  const clearCustomAfterPhoto = () => {
    setCustomAfterPhoto(null);
    setCustomAfterPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Sensor telemetry derived from demo scenario
  const getSensorStatus = () => {
    switch (scenario) {
      case 'different_pothole':
        return {
          gps: { val: '182.4m Away', ok: false, label: 'GPS Mismatch' },
          heading: { val: 'Δ 42°', ok: false, label: 'Angle Off' },
          landmark: { val: '18% Match', ok: false, label: 'No Landmarks' },
          ready: false
        };
      case 'wrong_angle':
        return {
          gps: { val: '4.2m (In Range)', ok: true, label: 'GPS Matched' },
          heading: { val: 'Δ 58°', ok: false, label: 'Angle Inverted' },
          landmark: { val: '44% Match', ok: false, label: 'Perspective Skew' },
          ready: false
        };
      case 'photo_reuse':
        return {
          gps: { val: '1.2m (In Range)', ok: true, label: 'GPS Matched' },
          heading: { val: 'Δ 2.1°', ok: true, label: 'Angle Matched' },
          landmark: { val: '99% Match', ok: true, label: 'Duplicate Check...' },
          ready: true,
          isFraud: true
        };
      case 'genuine':
      default:
        return {
          gps: { val: '1.8m (In Range)', ok: true, label: 'GPS Matched' },
          heading: { val: 'Δ 3.4°', ok: true, label: 'Angle Matched' },
          landmark: { val: '94% Match', ok: true, label: 'Kerb & Pole Aligned' },
          ready: true
        };
    }
  };

  const sensors = getSensorStatus();

  const handleCapture = async () => {
    setIsCapturing(true);

    // GPS — real device or Mumbai demo coords
    let gps_lat = 19.076, gps_lng = 72.8777;
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
      );
      gps_lat = pos.coords.latitude;
      gps_lng = pos.coords.longitude;
    } catch (_) { /* use fallback */ }

    // Try calling the real CV verification pipeline
    const complaintId = job.id;
    let backendVerdict = null;
    if (complaintId) {
      backendVerdict = await submitRepairAndVerify(complaintId, { photoBlob: customAfterPhoto, gps_lat, gps_lng });
    }

    setIsCapturing(false);

    // If we got a real verdict, use it; otherwise use scenario-based mock
    if (backendVerdict) {
      setVerdictResult(backendVerdict);
      return;
    }

    // ─── Original scenario mock verdicts (unchanged) ───────────────────────
    if (scenario === 'genuine') {
      setVerdictResult({
        status: 'pass',
        title: 'Auto-Verification Passed! ',
        score: '98.4%',
        color: 'emerald',
        reason: 'All checks passed. Background kerb and lamp-post match citizen complaint. Depth fill confirmed 100%. Payout of ₹12,000 queued into escrow.',
        details: [
          { name: 'GPS Haversine', res: '1.8m (Within 15m radius) ✅' },
          { name: 'Camera Angle Homography', res: 'Δ3.4° (Within 25° tolerance) ✅' },
          { name: 'Background Landmark SIFT', res: '94% Keypoint Invariance ✅' },
          { name: 'Road Bitumen Patch', res: 'YOLOv8 Fresh Asphalt Confirmed ✅' }
        ]
      });
    } else if (scenario === 'different_pothole') {
      setVerdictResult({
        status: 'reject',
        title: 'Verification Rejected: Location Mismatch ',
        score: '22.1%',
        color: 'red',
        reason: 'Anti-Gaming Detection Triggered: Camera location is 182.4 meters away from reported complaint #CF-8429. Background landmarks do not match original scene.',
        details: [
          { name: 'GPS Haversine', res: '182.4m (Exceeds 15m threshold) ❌' },
          { name: 'Landmark ORB/SIFT', res: '18% Match (Failed homography) ❌' },
          { name: 'Integrity Check', res: 'Different road detected ❌' }
        ]
      });
    } else if (scenario === 'wrong_angle') {
      setVerdictResult({
        status: 'review',
        title: 'Officer Review Required: Angle Skew ',
        score: '64.5%',
        color: 'amber',
        reason: 'Heading differs by 58° from citizen submission. Perspective homography could not reliably verify background kerb edge. Flagged for Municipal Engineer sign-off.',
        details: [
          { name: 'GPS Haversine', res: '4.2m (In Range) ✅' },
          { name: 'Camera Heading', res: 'Δ58° (Exceeds 25° tolerance) ❌' },
          { name: 'Landmark Features', res: '44% (Perspective Occluded) ❌' }
        ]
      });
    } else if (scenario === 'photo_reuse') {
      setVerdictResult({
        status: 'reject',
        title: 'Fraud Alert: Perceptual Hash Collision ',
        score: '0.0%',
        color: 'red',
        reason: 'Duplicate Photo Detected: Perceptual hash (pHash distance = 0) matches an existing repair submitted 12 days ago in Ward G/N. Reused proof flagged on municipal ledger.',
        details: [
          { name: 'Integrity Check', res: 'Identical bitstream hash collision ❌' },
          { name: 'Fraud Flag', res: 'Logged on SHA-256 Ledger Block #419 ❌' }
        ]
      });
    }
  };


  return (
    <div className="flex flex-col w-full pb-28 gap-4 pt-1 select-none">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#d7e8c3] shadow-xs">
        <button
          onClick={() => setActiveScreen('contractor-jobs')}
          className="flex items-center gap-1 text-[13px] font-['Plus_Jakarta_Sans'] font-bold text-[#40493d] hover:text-[#151d19]"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Jobs</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#0d631b]">
            {job.id} Proof Capture
          </span>
          <span className="text-[10px] font-['Inter'] text-[#40493d] truncate max-w-[150px]">
            {job.address.split(',')[0]}
          </span>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold font-['Plus_Jakarta_Sans']">
          SLA: 1h 48m
        </span>
      </div>

      {/* Demo Twist Scenario Selector */}
      <div className="p-3 rounded-2xl bg-[#ecf6ee] border border-[#d7e8c3] flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#0d631b] uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">tune</span>
            Interactive Demo Twist Injector
          </span>
          <span className="text-[10px] font-semibold text-[#546346]">Try each scenario:</span>
        </div>
        <select
          value={scenario}
          onChange={(e) => {
            setScenario(e.target.value);
            setVerdictResult(null);
          }}
          className="w-full px-3 py-2 rounded-xl bg-white border border-[#d7e8c3] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#151d19] focus:ring-2 focus:ring-[#2e7d32]"
        >
          <option value="genuine">Scenario 1: Genuine Repair (Same spot, same angle, filled) → Pass</option>
          <option value="different_pothole">Scenario 2: Contractor games different pothole (180m away) → Reject</option>
          <option value="wrong_angle">Scenario 3: Same road, photographed from wrong angle (58° off) → Review</option>
          <option value="photo_reuse">Scenario 4: Reused old photo fraud (pHash match) → Reject & Flag</option>
        </select>
      </div>

      {/* Ghost-Overlay Camera Viewfinder */}
      <div className="relative w-full aspect-[9/14] sm:aspect-[9/16] max-h-[520px] rounded-3xl overflow-hidden shadow-xl bg-black flex flex-col justify-between p-3 border-2 border-[#d7e8c3]">
        {/* Layer 1: Live Viewfinder (Simulated newly repaired road or Custom Photo) */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-300"
          style={{
            backgroundImage: `url('${
              customAfterPreview || (
                scenario === 'different_pothole'
                  ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhS_lyFD4zIki-hYjRs0J_nj-kUtl-IVmxBC20jIz_3I4baGn5LnFpJbRM3_nmZXkpN0pNOcgWl3GzfVTF1jEBJ6Pzhi_KSxzdBCwqryvn2kI7IWpT3W5CdZ0HLwRIAR-sykN9qkUhz5a6-LLC6nzwPyEjTcWTeR9bfvYd5nLK52kGoGMs2p5aIkb2LG6vKh0r1-1ybH21JX6nXa1FOvOXyjio0lwOb_cAq_489dzWOU_AmH-wPstSKA'
                  : 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0TpDjXqMy-XXPRo3jnGEZX6mNFVQwk4uHkdhs8-Rd9MWdBolqnPAC8HAj4SjbrIJl_qpPDrj7w5a7aKbUyACYce8jSnloSQQv3uQAF_nxrWdlIghUuGqfRKB7mgmDW0uRMHs5bqUTTqomyj1F44Dra3zNiF3YqAKTZWI_v-p2z15d4N-6tGfCjvRy_rfbHapOYLCIDB2_a3QCjyBq-w9dF2Csth_j3tZE2kF1pS22493WeVNH0-x35w'
              )
            }')`
          }}
        />

        {/* Layer 2: Translucent GHOST OVERLAY of the Citizen's Original Before Photo */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none transition-opacity duration-200"
          style={{
            backgroundImage: `url('${job.citizenPhoto}')`,
            opacity: opacity / 100,
            filter: 'contrast(120%)'
          }}
        />

        {/* Top HUD: Live Sensor Alignment Chips */}
        <div className="relative z-20 flex flex-col gap-1.5">
          {/* Custom Loaded Photo Banner */}
          {customAfterPreview && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-white border border-[#a3f69c]/50 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold shadow-md">
              <span className="flex items-center gap-1.5 text-[#a3f69c]">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>Custom After-Photo Loaded</span>
              </span>
              <button
                type="button"
                onClick={clearCustomAfterPhoto}
                className="flex items-center gap-0.5 text-white/90 hover:text-white px-2 py-0.5 rounded-md bg-white/20 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[13px]">close</span>
                <span>Reset</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-1.5">
            {/* GPS Chip */}
            <div
              className={`px-2 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1 shadow-sm ${
                sensors.gps.ok
                  ? 'bg-[#0d631b]/90 text-white'
                  : 'bg-[#ba1a1a]/90 text-white animate-pulse'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] uppercase font-bold opacity-80">GPS</span>
                <span className="text-[10px] font-bold truncate">{sensors.gps.val}</span>
              </div>
            </div>

            {/* Heading Chip */}
            <div
              className={`px-2 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1 shadow-sm ${
                sensors.heading.ok
                  ? 'bg-[#0d631b]/90 text-white'
                  : 'bg-[#ba1a1a]/90 text-white animate-pulse'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">explore</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] uppercase font-bold opacity-80">Angle</span>
                <span className="text-[10px] font-bold truncate">{sensors.heading.val}</span>
              </div>
            </div>

            {/* Landmark Match Chip */}
            <div
              className={`px-2 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1 shadow-sm ${
                sensors.landmark.ok
                  ? 'bg-[#0d631b]/90 text-white'
                  : 'bg-[#ba1a1a]/90 text-white animate-pulse'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">domain</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] uppercase font-bold opacity-80">Landmark</span>
                <span className="text-[10px] font-bold truncate">{sensors.landmark.val}</span>
              </div>
            </div>
          </div>

          {/* Alignment status banner */}
          <div className="flex items-center justify-center">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-bold shadow-md flex items-center gap-1.5 ${
                sensors.ready
                  ? 'bg-[#0d631b] text-white'
                  : 'bg-[#ba1a1a] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {sensors.ready ? 'check_circle' : 'warning'}
              </span>
              <span>{sensors.ready ? t.readyToCapture : t.misalignedWarning}</span>
            </span>
          </div>
        </div>

        {/* Center Alignment Framing Overlay */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center pointer-events-none">
          <div
            className={`w-64 h-48 border-2 border-dashed rounded-2xl flex items-center justify-center relative transition-colors ${
              sensors.ready ? 'border-[#a3f69c]' : 'border-red-400'
            }`}
          >
            <span className="absolute top-2 left-2 text-[9px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded">
              GHOST OVERLAY: {opacity}%
            </span>
            <div className="w-10 h-10 rounded-full border border-white/60 flex items-center justify-center">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  sensors.ready ? 'bg-[#a3f69c] shadow-md' : 'bg-red-500'
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Bottom Opacity Slider Floating Bar */}
        <div className="relative z-20 bg-black/75 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-white text-[18px]">layers</span>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between text-[11px] font-['Plus_Jakarta_Sans'] text-white font-bold mb-1">
              <span>{t.ghostOpacity}</span>
              <span>{opacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#a3f69c]"
            />
          </div>
        </div>
      </div>

      {/* Hidden File Picker for Contractor After-Photo */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleAfterFileSelect}
      />

      {/* Quick Demo Repaired Presets */}
      <div className="flex flex-col gap-1.5 bg-[#ecf6ee]/80 p-2.5 rounded-2xl border border-[#d7e8c3]/60">
        <div className="flex items-center justify-between px-1">
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#0d631b] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">bolt</span>
            Live Demo Repair Presets
          </span>
          <span className="font-['Inter'] text-[10px] text-[#40493d]">1-tap asphalt repairs</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            type="button"
            onClick={() => loadDemoAfterSample('/demo_samples/s01_p01_after.jpg')}
            className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-semibold bg-white border border-[#d7e8c3] text-[#151d19] hover:bg-[#d7e8c3]/40 active:scale-95 transition-all shadow-xs flex items-center gap-1"
          >
            <span>Repaired 1</span>
            <span className="text-[10px] text-[#0d631b] font-bold">(Matched)</span>
          </button>
          <button
            type="button"
            onClick={() => loadDemoAfterSample('/demo_samples/s02_p01_after.jpg')}
            className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-semibold bg-white border border-[#d7e8c3] text-[#151d19] hover:bg-[#d7e8c3]/40 active:scale-95 transition-all shadow-xs flex items-center gap-1"
          >
            <span>Repaired 2</span>
            <span className="text-[10px] text-[#0d631b] font-bold">(Fresh Bitumen)</span>
          </button>
          <button
            type="button"
            onClick={() => loadDemoAfterSample('/demo_samples/s03_p01_after.jpg')}
            className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-semibold bg-white border border-[#d7e8c3] text-[#151d19] hover:bg-[#d7e8c3]/40 active:scale-95 transition-all shadow-xs flex items-center gap-1"
          >
            <span>Repaired 3</span>
            <span className="text-[10px] text-[#0d631b] font-bold">(Edge Seal)</span>
          </button>
        </div>
      </div>

      {/* Primary Action Dock */}
      <div className="p-3.5 rounded-3xl bg-white shadow-sm border border-[#d7e8c3]/60 flex flex-col items-center gap-3">
        <div className="w-full flex items-center justify-between px-4">
          {/* Gallery / File Picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-1 text-[#40493d] active:scale-95 transition-transform min-w-[56px]"
            type="button"
            title="Upload repair after-photo from device"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              customAfterPreview ? 'bg-[#0d631b] text-white shadow-md' : 'bg-[#ecf6ee] text-[#151d19]'
            }`}>
              <span className="material-symbols-outlined text-[22px]">
                {customAfterPreview ? 'check' : 'photo_library'}
              </span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold">
              {customAfterPreview ? 'Change' : 'Upload'}
            </span>
          </button>

          {/* Hero Shutter */}
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all ${
              sensors.ready
                ? 'bg-[#0d631b] hover:bg-[#2e7d32] text-white ring-4 ring-[#a3f69c]/60'
                : 'bg-red-700 text-white ring-4 ring-red-400/50'
            } ${isCapturing ? 'animate-pulse scale-90' : ''}`}
          >
            <div className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center">
              <span className="material-symbols-outlined text-[34px]">photo_camera</span>
            </div>
          </button>

          {/* Reset / Live Camera Toggle */}
          <button
            onClick={clearCustomAfterPhoto}
            className="flex flex-col items-center gap-1 text-[#40493d] active:scale-95 transition-transform min-w-[56px]"
            type="button"
            title="Reset to default feed"
          >
            <div className="w-12 h-12 rounded-full bg-[#ecf6ee] flex items-center justify-center text-[#151d19]">
              <span className="material-symbols-outlined text-[22px]">refresh</span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold">Reset</span>
          </button>
        </div>

        <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#40493d] text-center">
          Tap Shutter to Run Multi-Sensor CV Verification
        </span>
      </div>

      {/* Instant AI Multi-Check Verdict Modal */}
      {verdictResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#d7e8c3] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-bold ${
                  verdictResult.status === 'pass'
                    ? 'bg-[#d7e8c3] text-[#0d631b]'
                    : verdictResult.status === 'review'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                Score: {verdictResult.score}
              </span>
              <button
                onClick={() => setVerdictResult(null)}
                className="w-8 h-8 rounded-full bg-[#ecf6ee] flex items-center justify-center text-[#40493d]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1 text-center items-center">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-[28px] shadow-md ${
                  verdictResult.status === 'pass'
                    ? 'bg-[#0d631b]'
                    : verdictResult.status === 'review'
                    ? 'bg-amber-500'
                    : 'bg-[#ba1a1a]'
                }`}
              >
                <span className="material-symbols-outlined text-[32px]">
                  {verdictResult.status === 'pass'
                    ? 'verified'
                    : verdictResult.status === 'review'
                    ? 'help'
                    : 'gpp_bad'}
                </span>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#151d19] mt-2">
                {verdictResult.title}
              </h3>
              <p className="font-['Inter'] text-[12px] text-[#40493d] mt-1 leading-snug">
                {verdictResult.reason}
              </p>
            </div>

            {/* Check Breakdown List */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#f2fcf4] border border-[#d7e8c3]">
              {verdictResult.details.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[#40493d]">
                    {d.name}
                  </span>
                  <span className="font-mono font-bold text-[#151d19]">{d.res}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              {verdictResult.status === 'pass' ? (
                <button
                  onClick={() => {
                    setVerdictResult(null);
                    setActiveScreen('contractor-scorecard');
                  }}
                  className="w-full py-3 rounded-full bg-[#0d631b] hover:bg-[#2e7d32] text-white font-['Plus_Jakarta_Sans'] text-[14px] font-bold shadow-md active:scale-95 transition-all"
                >
                  View Payout & Scorecard →
                </button>
              ) : (
                <button
                  onClick={() => setVerdictResult(null)}
                  className="w-full py-3 rounded-full bg-[#0d631b] text-white font-['Plus_Jakarta_Sans'] text-[14px] font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  <span>{t.retakeProof}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
