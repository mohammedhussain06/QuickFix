import React, { useState, useEffect, useRef } from 'react';
import { submitComplaint } from '../services/api';

export default function ReportCamera({
  setActiveScreen,
  addNewReport,
  selectedWard,
  t
}) {
  const [selectedCategory, setSelectedCategory] = useState('Pothole');
  const [flashState, setFlashState] = useState('Auto');
  const [showGrid, setShowGrid] = useState(false);
  const [isVerifiedCitizen, setIsVerifiedCitizen] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [useLiveWebcam, setUseLiveWebcam] = useState(false);
  const [customPhotoFile, setCustomPhotoFile] = useState(null);
  const [customPhotoPreview, setCustomPhotoPreview] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const categories = [
    { id: 'Pothole', label: 'Pothole', icon: 'check' },
    { id: 'Crumbling Curb', label: 'Crumbling Curb' },
    { id: 'Manhole Rim', label: 'Manhole Rim' },
    { id: 'Sidewalk Crack', label: 'Sidewalk Crack' }
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomPhotoFile(file);
      setCustomPhotoPreview(URL.createObjectURL(file));
    }
  };

  const loadDemoSample = async (url, label) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      setCustomPhotoFile(blob);
      setCustomPhotoPreview(url);
      setSelectedCategory('Pothole');
    } catch (err) {
      console.error('Failed to load demo sample:', err);
    }
  };

  const clearCustomPhoto = () => {
    setCustomPhotoFile(null);
    setCustomPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleFlash = () => {
    const states = ['Auto', 'On', 'Off'];
    const next = states[(states.indexOf(flashState) + 1) % states.length];
    setFlashState(next);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setUseLiveWebcam(true);
      }
    } catch (err) {
      console.log('Webcam not available or denied, using simulated AR camera feed:', err);
      setUseLiveWebcam(false);
    }
  };

  const handleCapture = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    // Audio / Haptic feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }

    // Use uploaded/preset photoBlob if present, otherwise grab from webcam
    let photoBlob = customPhotoFile;
    if (!photoBlob && useLiveWebcam && videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      photoBlob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.85));
    }

    // GPS — use real device GPS or fall back to Mumbai demo coords
    let gps_lat = 19.076, gps_lng = 72.8777;
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
      );
      gps_lat = pos.coords.latitude;
      gps_lng = pos.coords.longitude;
    } catch (_) { /* use fallback coords */ }

    // Attempt real submission; fallback builds a local mock incident
    let newIncident;
    if (photoBlob) {
      newIncident = await submitComplaint({
        photoBlob,
        gps_lat,
        gps_lng,
        description: selectedCategory,
        address_text: `Near ${selectedWard.split('•')[0]}`,
      });
    }

    // If no photoBlob or backend returned null, build the original mock shape
    if (!newIncident) {
      newIncident = {
        id: `CF-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "Report Submitted & AI-Verified",
        statusType: "verified",
        title: `${selectedCategory} Detected`,
        address: `Near 108 Main St, ${selectedWard.split('•')[0]}`,
        reportedDate: "Just now",
        repairedDate: "Pending dispatch",
        reporter: isVerifiedCitizen ? "Elena Vasquez (Verified)" : "Anonymous Citizen",
        contractor: "DPW Rapid Response Unit",
        crew: "Pending Crew Assignment",
        confidence: 97.2,
        ledgerHash: `#${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        metrics: [
          { label: "GPS Location", value: "Matched (±1.2m)", passed: true, icon: "location_on" },
          { label: "Camera Heading", value: "Angle (284° WNW)", passed: true, icon: "explore" },
          { label: "Kerb Landmark", value: "Geometry Match (94%)", passed: true, icon: "domain" },
          { label: "Depth Fill", value: "Pre-Repair Baseline (4.2cm)", passed: true, icon: "layers" }
        ],
        timeline: [
          { title: "Report Submitted", date: "Just now • by You", actor: "Citizen", completed: true },
          { title: "Triaged & Work Order Issued", date: "Auto-geofenced (Priority 1)", actor: "Municipal Engine", completed: true },
          { title: "Contractor Repaired", date: "SLA: 24h Window", actor: "Pending Dispatch", completed: false },
          { title: "AI Telemetry Verified", date: "Pending", actor: "Auto-Verifier", completed: false },
          { title: "Community Confirmation", date: "Upcoming", actor: "Ward Stewards", completed: false }
        ],
        beforeImage: customPhotoPreview || "https://lh3.googleusercontent.com/aida-public/AB6AXuD60Aqj9C8dTlzUl949E_dd8yZ-WowtrHai5ewaExJf8-lwJB0QMBxSfZRhSoEHjR5l7_qvsgth4inkbO2SwTHT91rG1DimkoN7Tgs5kay1AxdLeH1k9KDiom9Vo8u79Gwu2jkRgV-rjn60T1opNMbB9Wj8KL_dqzpSo0Io7qrEYRXsRozOMYQFnDoKy8GsokEROU9inYPYAV4zWug2KEzhl8N4gWhP8A516SqpYV4ouAgel43GeIRCow",
        afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0TpDjXqMy-XXPRo3jnGEZX6mNFVQwk4uHkdhs8-Rd9MWdBolqnPAC8HAj4SjbrIJl_qpPDrj7w5a7aKbUyACYce8jSnloSQQv3uQAF_nxrWdlIghUuGqfRKB7mgmDW0uRMHs5bqUTTqomyj1F44Dra3zNiF3YqAKTZWI_v-p2z15d4N-6tGfCjvRy_rfbHapOYLCIDB2_a3QCjyBq-w9dF2Csth_j3tZE2kF1pS22493WeVNH0-x35w"
      };
    }

    setShowSuccessToast(true);
    addNewReport(newIncident);

    setTimeout(() => {
      setIsCapturing(false);
      setActiveScreen('detail');
    }, 1600);
  };


  return (
    <div className="flex flex-col w-full pb-8 select-none gap-3">
      {/* High-Visibility Upload & Live Demo Bar (Immediately visible on top) */}
      <div className="bg-white p-3 rounded-2xl border-2 border-[#d7e8c3] shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#0d631b] font-['Plus_Jakarta_Sans'] font-bold text-[13px]">
            <span className="material-symbols-outlined text-[20px]">photo_library</span>
            <span>Upload or Pick Test Photo</span>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-full bg-[#0d631b] text-white text-[12px] font-['Plus_Jakarta_Sans'] font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5 hover:bg-[#2e7d32]"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>Choose File</span>
          </button>
        </div>

        {/* 1-Tap Hackathon Presets */}
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#e6f0e8] overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-[#40493d] shrink-0">Presets:</span>
          <button
            type="button"
            onClick={() => loadDemoSample('/demo_samples/s01_p01_before.jpg', 'Severe Pothole')}
            className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#ecf6ee] text-[#151d19] border border-[#d7e8c3] hover:bg-[#d7e8c3]/60 active:scale-95 transition-all flex items-center gap-1"
          >
            <span className="text-[10px] text-[#0d631b] font-bold">Sample 1</span>
            <span>(Severe)</span>
          </button>
          <button
            type="button"
            onClick={() => loadDemoSample('/demo_samples/s02_p01_before.jpg', 'Deep Pothole')}
            className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#ecf6ee] text-[#151d19] border border-[#d7e8c3] hover:bg-[#d7e8c3]/60 active:scale-95 transition-all flex items-center gap-1"
          >
            <span className="text-[10px] text-[#0d631b] font-bold">Sample 2</span>
            <span>(Deep)</span>
          </button>
          <button
            type="button"
            onClick={() => loadDemoSample('/demo_samples/s03_p01_before.jpg', 'Curb Pothole')}
            className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#ecf6ee] text-[#151d19] border border-[#d7e8c3] hover:bg-[#d7e8c3]/60 active:scale-95 transition-all flex items-center gap-1"
          >
            <span className="text-[10px] text-[#0d631b] font-bold">Sample 3</span>
            <span>(Rim)</span>
          </button>
        </div>
      </div>

      {/* Viewfinder Main Container */}
      <div className="relative w-full aspect-[4/3] max-h-[360px] rounded-3xl overflow-hidden shadow-xl bg-[#29322d] flex flex-col justify-between p-3.5 border border-[#d7e8c3]/40">
        {/* Background Feed: Video or High-Res Camera Capture */}
        {customPhotoPreview ? (
          <img
            src={customPhotoPreview}
            alt="Selected Pothole"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          />
        ) : useLiveWebcam ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD60Aqj9C8dTlzUl949E_dd8yZ-WowtrHai5ewaExJf8-lwJB0QMBxSfZRhSoEHjR5l7_qvsgth4inkbO2SwTHT91rG1DimkoN7Tgs5kay1AxdLeH1k9KDiom9Vo8u79Gwu2jkRgV-rjn60T1opNMbB9Wj8KL_dqzpSo0Io7qrEYRXsRozOMYQFnDoKy8GsokEROU9inYPYAV4zWug2KEzhl8N4gWhP8A516SqpYV4ouAgel43GeIRCow')`
            }}
          />
        )}

        {/* 3x3 Grid Overlay Toggle */}
        {showGrid && (
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 opacity-30">
            <div className="border-r border-b border-white"></div>
            <div className="border-r border-b border-white"></div>
            <div className="border-b border-white"></div>
            <div className="border-r border-b border-white"></div>
            <div className="border-r border-b border-white"></div>
            <div className="border-b border-white"></div>
            <div className="border-r border-white"></div>
            <div className="border-r border-white"></div>
            <div></div>
          </div>
        )}

        {/* Soft Vignette & Mint Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none"></div>

        {/* Top Telemetry & Precision Sensor Stack */}
        <div className="relative z-20 flex flex-col gap-2">
          {/* Custom Loaded Photo Banner */}
          {customPhotoPreview && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-white border border-[#a3f69c]/50 text-[11px] font-['Plus_Jakarta_Sans'] font-semibold shadow-md">
              <span className="flex items-center gap-1.5 text-[#a3f69c]">
                <span className="material-symbols-outlined text-[15px]">photo_library</span>
                <span>Photo Loaded from Device / Preset</span>
              </span>
              <button
                type="button"
                onClick={clearCustomPhoto}
                className="flex items-center gap-0.5 text-white/90 hover:text-white px-2 py-0.5 rounded-md bg-white/20 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[13px]">close</span>
                <span>Reset</span>
              </button>
            </div>
          )}

          {/* Row 1: GPS Quality & Orientation */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#0d631b] animate-ping"></span>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#0d631b] flex items-center gap-1">
                {t.gpsPrecision}
              </span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#151d19] shadow-sm">
              <span className="material-symbols-outlined text-[15px] text-[#0d631b]">explore</span>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold">
                284° WNW • {selectedWard.split('•')[0]}
              </span>
            </div>
          </div>

          {/* Row 2: Optical Condition Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm text-[#40493d] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold">
              <span className="material-symbols-outlined text-[13px] text-amber-600">sunny</span>
              <span>{t.lightingCrisp}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm text-[#40493d] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold">
              <span className="material-symbols-outlined text-[13px] text-[#0d631b]">vibration</span>
              <span>{t.steadyDevice}</span>
            </div>
            <div className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm text-[#40493d] text-[11px] font-['Plus_Jakarta_Sans'] font-semibold">
              <span className="material-symbols-outlined text-[13px] text-[#0d631b]">auto_awesome</span>
              <span>{t.aiDetectActive}</span>
            </div>
          </div>
        </div>

        {/* Center AR Bounding Box & Alignment HUD */}
        <div className="relative z-20 my-auto flex flex-col items-center justify-center pointer-events-none">
          <div className="relative w-64 h-48 flex items-center justify-center">
            {/* Corner Brackets in Theme Tint */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#a3f69c] rounded-tl-lg shadow-sm"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#a3f69c] rounded-tr-lg shadow-sm"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#a3f69c] rounded-bl-lg shadow-sm"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#a3f69c] rounded-br-lg shadow-sm"></div>

            {/* Detection Pill */}
            <div className="absolute -top-3.5 left-4 px-2.5 py-0.5 rounded-full bg-[#0d631b] text-white font-['Plus_Jakarta_Sans'] text-[11px] font-bold shadow-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span>{t.deepPothole}</span>
            </div>

            {/* Kerb Proximity Alignment Line Indicator */}
            <div className="w-full flex items-center justify-between px-4 opacity-85">
              <div className="h-0.5 w-16 bg-[#a3f69c]"></div>
              <span className="text-white font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                {t.curbInFrame}
              </span>
              <div className="h-0.5 w-16 bg-[#a3f69c]"></div>
            </div>

            {/* Subtle Target Center Reticle */}
            <div className="w-8 h-8 rounded-full border border-dashed border-[#a3f69c]/80 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#a3f69c] shadow-sm"></div>
            </div>
          </div>

          {/* Smart AR Guidance Hint Pill */}
          <div className="mt-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg flex items-center gap-2 max-w-[92%] pointer-events-auto transition-transform active:scale-95 border border-[#d7e8c3]">
            <span className="material-symbols-outlined text-[#0d631b] text-[18px]">lightbulb</span>
            <p className="font-['Inter'] text-[12px] text-[#151d19] truncate">
              <span className="font-bold text-[#0d631b]">{t.civicTipTitle}</span> {t.curbTip}
            </p>
          </div>
        </div>

        {/* In-Viewfinder Floating Quick Controls */}
        <div className="relative z-20 flex items-center justify-between px-1">
          {/* Flash Toggle Button */}
          <button
            onClick={toggleFlash}
            aria-label="Flash Toggle"
            className="min-w-[40px] min-h-[40px] px-3 rounded-full bg-white/90 backdrop-blur-md text-[#151d19] flex items-center gap-1.5 shadow-sm active:scale-90 transition-transform"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#40493d]">
              {flashState === 'Off' ? 'flash_off' : flashState === 'On' ? 'flash_on' : 'flash_auto'}
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold">{flashState}</span>
          </button>

          {/* Lens Depth Reading Badge */}
          <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#151d19] flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-[#0d631b]">straighten</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold">Depth: 4.2 cm</span>
          </div>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            aria-label="Grid Toggle"
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm active:scale-90 transition-all ${
              showGrid ? 'bg-[#2e7d32] text-white' : 'bg-white/90 text-[#40493d]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">grid_on</span>
          </button>
        </div>
      </div>

      {/* Category Selector Pills (Auto-Detected) */}
      <div className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#40493d] uppercase tracking-wider">
            Detected Defect Type
          </span>
          <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold text-[#0d631b] flex items-center gap-0.5">
            Auto-Tagged <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full font-['Plus_Jakarta_Sans'] text-[13px] font-semibold shadow-xs transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#0d631b] text-white'
                    : 'bg-[#e6f0e8] text-[#40493d] hover:bg-[#e1ebe3]'
                }`}
                type="button"
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Shutter & Action Dock */}
      <div className="mt-4 p-4 rounded-3xl bg-white shadow-sm border border-[#d7e8c3]/60 flex flex-col items-center gap-4">
        {/* Hidden File Picker */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Shutter Button Row */}
        <div className="w-full flex items-center justify-between px-4">
          {/* Gallery / File Picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-1 text-[#40493d] active:scale-95 transition-transform min-w-[48px]"
            type="button"
            title="Upload any pothole image from device"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              customPhotoPreview ? 'bg-[#0d631b] text-white shadow-md' : 'bg-[#ecf6ee] text-[#151d19]'
            }`}>
              <span className="material-symbols-outlined text-[22px]">
                {customPhotoPreview ? 'check' : 'photo_library'}
              </span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold">
              {customPhotoPreview ? 'Change' : t.upload}
            </span>
          </button>

          {/* Hero Shutter Button with Soft Mint Ripple */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-2 rounded-full bg-[#d7e8c3]/60 animate-ping opacity-60"></div>
            <button
              id="snap-submit-btn"
              onClick={handleCapture}
              disabled={isCapturing}
              className={`relative w-20 h-20 rounded-full bg-[#0d631b] text-white flex flex-col items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-[#2e7d32] ${
                isCapturing ? 'animate-pulse scale-95 opacity-80' : ''
              }`}
              type="button"
            >
              <div className="w-16 h-16 rounded-full border-2 border-white/60 flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">photo_camera</span>
              </div>
            </button>
          </div>

          {/* Quick Switch / Real Webcam Toggle */}
          <button
            onClick={startWebcam}
            className="flex flex-col items-center gap-1 text-[#40493d] active:scale-95 transition-transform min-w-[48px]"
            type="button"
            title="Switch between live device camera and simulated road feed"
          >
            <div className="w-12 h-12 rounded-full bg-[#ecf6ee] flex items-center justify-center text-[#151d19]">
              <span className="material-symbols-outlined text-[22px]">flip_camera_ios</span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold">{t.rotate}</span>
          </button>
        </div>

        {/* Direct 1-Tap Submission Tag */}
        <div className="text-center">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#151d19]">
            {t.snapAutoReport}
          </h2>
          <p className="font-['Inter'] text-[13px] text-[#40493d] mt-0.5">
            {t.snapSub}
          </p>
        </div>

        {/* Anonymous / Verified Privacy Toggle */}
        <div className="w-full flex items-center justify-between bg-[#ecf6ee] p-3 rounded-2xl border border-[#d7e8c3]/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0d631b] text-[20px]">verified_user</span>
            <div className="flex flex-col">
              <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-semibold text-[#151d19]">
                {t.verifiedCitizen}
              </span>
              <span className="font-['Inter'] text-[11px] text-[#40493d]">
                {t.verifiedCitizenSub}
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isVerifiedCitizen}
              onChange={(e) => setIsVerifiedCitizen(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#dbe5dd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0d631b]"></div>
          </label>
        </div>
      </div>

      {/* Floating Success Confirmation Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full bg-[#0d631b] text-white font-['Plus_Jakarta_Sans'] text-[13px] font-bold shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
          <span>Captured! Dispatching to DPW with SHA-256 seal...</span>
        </div>
      )}
    </div>
  );
}
