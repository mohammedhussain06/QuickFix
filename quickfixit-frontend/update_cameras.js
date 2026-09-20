const fs = require('fs');

const indexPath = 'c:/Users/Maviya Shaikh/Desktop/rough/frontend/index.html';
let content = fs.readFileSync(indexPath, 'utf8');

// Replace lines 3934 and 4470 emojis
content = content.replace(
  /\{isMismatch \? '⚠️ ' : '✓ '\}/g,
  '<span className="material-symbols-outlined text-[13px] inline mr-1 align-middle">{isMismatch ? "warning" : "check_circle"}</span>'
);

content = content.replace(
  /<div className="absolute bottom-28 left-\[280px\] z-10 w-6 h-6 rounded-full bg-\[#1b5e20\] text-white flex items-center justify-center font-bold text-\[11px\] shadow-md ring-2 ring-emerald-200">\s*✓\s*<\/div>/g,
  '<div className="absolute bottom-28 left-[280px] z-10 w-6 h-6 rounded-full bg-[#1b5e20] text-white flex items-center justify-center shadow-md ring-2 ring-emerald-200"><span className="material-symbols-outlined text-[13px]">check</span></div>'
);

content = content.replace(
  /<div className="absolute top-36 left-\[350px\] z-10 w-7 h-7 rounded-full bg-\[#ba1a1a\] text-white flex items-center justify-center font-bold text-\[12px\] shadow-lg ring-4 ring-red-300\/60 animate-bounce">\s*!\s*<\/div>/g,
  '<div className="absolute top-36 left-[350px] z-10 w-7 h-7 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shadow-lg ring-4 ring-red-300/60 animate-bounce"><span className="material-symbols-outlined text-[14px]">priority_high</span></div>'
);

// New GhostOverlayCamera with Real-Time WebRTC Camera & Dynamic Ghost Overlay
const newGhostOverlayCamera = `    function GhostOverlayCamera({ job = MOCK_CONTRACTOR_JOBS[0], setActiveScreen, t }) {
      const [opacity, setOpacity] = useState(45);
      const [scenario, setScenario] = useState('genuine');
      const [isCapturing, setIsCapturing] = useState(false);
      const [verdictResult, setVerdictResult] = useState(null);
      const [useLiveCamera, setUseLiveCamera] = useState(false);
      const [cameraError, setCameraError] = useState(null);
      const [overlayMode, setOverlayMode] = useState('both'); // 'photo' | 'wireframe' | 'both'
      const [capturedPhoto, setCapturedPhoto] = useState(null);

      const videoRef = useRef(null);
      const streamRef = useRef(null);
      const canvasRef = useRef(null);

      // Start Real-Time WebRTC Camera
      const startCamera = async () => {
        setCameraError(null);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }
            });
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play().catch(e => console.log('Video play failed:', e));
            }
            setUseLiveCamera(true);
          } catch (err) {
            console.warn('Webcam stream unavailable, maintaining high-precision AR simulation:', err);
            setCameraError(err.name === 'NotAllowedError' ? 'Camera permission was denied. Tap to retry or use AR simulation.' : 'No camera hardware detected. Using calibrated AR simulator.');
            setUseLiveCamera(false);
          }
        } else {
          setCameraError('MediaDevices API not supported in current environment.');
          setUseLiveCamera(false);
        }
      };

      const stopCamera = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setUseLiveCamera(false);
      };

      useEffect(() => {
        startCamera();
        return () => {
          stopCamera();
        };
      }, []);

      const toggleCameraMode = () => {
        if (useLiveCamera) {
          stopCamera();
        } else {
          startCamera();
        }
      };

      const getSensorStatus = () => {
        if (scenario === 'different_pothole') {
          return {
            gps: { val: '182.4m Away', ok: false },
            heading: { val: 'Δ 42°', ok: false },
            landmark: { val: '18% Match', ok: false },
            ready: false
          };
        } else if (scenario === 'wrong_angle') {
          return {
            gps: { val: '4.2m (In Range)', ok: true },
            heading: { val: 'Δ 58°', ok: false },
            landmark: { val: '44% Match', ok: false },
            ready: false
          };
        } else if (scenario === 'photo_reuse') {
          return {
            gps: { val: '1.2m (In Range)', ok: true },
            heading: { val: 'Δ 2.1°', ok: true },
            landmark: { val: '99% Match', ok: true },
            ready: true,
            isFraud: true
          };
        }
        return {
          gps: { val: '1.8m (In Range)', ok: true },
          heading: { val: 'Δ 3.4°', ok: true },
          landmark: { val: '94% Match', ok: true },
          ready: true
        };
      };

      const sensors = getSensorStatus();

      const handleCapture = () => {
        setIsCapturing(true);

        // Extract real-time frame from video canvas if available
        let liveSnapshot = null;
        if (useLiveCamera && videoRef.current && canvasRef.current) {
          try {
            const v = videoRef.current;
            const c = canvasRef.current;
            c.width = v.videoWidth || 640;
            c.height = v.videoHeight || 480;
            const ctx = c.getContext('2d');
            ctx.drawImage(v, 0, 0, c.width, c.height);
            liveSnapshot = c.toDataURL('image/jpeg', 0.85);
            setCapturedPhoto(liveSnapshot);
          } catch (err) {
            console.log('Capture error:', err);
          }
        }

        setTimeout(() => {
          setIsCapturing(false);
          if (scenario === 'genuine') {
            setVerdictResult({
              status: 'pass',
              title: 'Auto-Verification Passed',
              score: '98.4%',
              reason: 'All multi-sensor checks passed. Background kerb and lamp-post match original citizen photo. Depth fill 100%. Payout of ₹12,000 queued into escrow.',
              capturedImage: liveSnapshot,
              details: [
                { name: 'GPS Haversine', res: '1.8m (Threshold <15m)', passed: true },
                { name: 'Camera Angle Homography', res: 'Δ 3.4° (Threshold <25°)', passed: true },
                { name: 'Background Landmark SIFT', res: '94% Keypoint Invariance', passed: true },
                { name: 'Road Patch Segment', res: 'YOLOv8 Level Patch Confirmed', passed: true }
              ]
            });
          } else if (scenario === 'different_pothole') {
            setVerdictResult({
              status: 'reject',
              title: 'Verification Rejected: Location Mismatch',
              score: '22.1%',
              reason: 'Anti-Gaming Detection Triggered: Camera is 182.4 meters away from reported complaint #CF-8429. Landmarks do not match original scene.',
              capturedImage: liveSnapshot,
              details: [
                { name: 'GPS Haversine', res: '182.4m (Exceeds 15m threshold)', passed: false },
                { name: 'Landmark ORB/SIFT', res: '18% Match (Failed homography)', passed: false }
              ]
            });
          } else if (scenario === 'wrong_angle') {
            setVerdictResult({
              status: 'review',
              title: 'Officer Review Required: Angle Skew',
              score: '64.5%',
              reason: 'Heading differs by 58° from citizen submission. Homography could not verify background kerb edge. Flagged for Municipal Engineer sign-off.',
              capturedImage: liveSnapshot,
              details: [
                { name: 'GPS Haversine', res: '4.2m (In Range)', passed: true },
                { name: 'Camera Heading', res: 'Δ 58° (Exceeds 25° tolerance)', passed: false }
              ]
            });
          } else if (scenario === 'photo_reuse') {
            setVerdictResult({
              status: 'reject',
              title: 'Fraud Alert: Perceptual Hash Collision',
              score: '0.0%',
              reason: 'Duplicate Photo Detected: Perceptual hash (pHash distance = 0) matches an existing repair submitted 12 days ago in Ward G/N. Reused proof flagged on municipal ledger.',
              capturedImage: liveSnapshot,
              details: [
                { name: 'Integrity Check', res: 'Identical bitstream collision', passed: false },
                { name: 'Fraud Flag', res: 'Logged on SHA-256 Block #419', passed: false }
              ]
            });
          }
        }, 600);
      };

      return (
        <div className="flex flex-col w-full pb-28 gap-3 pt-1 select-none">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#d7e8c3] shadow-xs">
            <button
              onClick={() => setActiveScreen('contractor-jobs')}
              className="flex items-center gap-1 text-[13px] font-['Plus_Jakarta_Sans'] font-bold text-[#40493d] hover:text-[#151d19]"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>Jobs</span>
            </button>
            <div className="flex flex-col items-center">
              <span className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#0d631b]">{job.id} Proof</span>
              <span className="text-[10px] text-[#40493d]">{job.address.split(',')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleCameraMode}
                className={"px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-all " + (
                  useLiveCamera
                    ? "bg-[#0d631b] text-white border-[#0d631b]"
                    : "bg-[#ecf6ee] text-[#0d631b] border-[#d7e8c3]"
                )}
                title={useLiveCamera ? "Switch to AR Simulation" : "Switch to Live Web Camera"}
              >
                <span className="material-symbols-outlined text-[13px]">{useLiveCamera ? "videocam" : "view_in_ar"}</span>
                <span>{useLiveCamera ? "Live Cam" : "AR Sim"}</span>
              </button>
            </div>
          </div>

          {/* Anti-Gaming Scenario Selector */}
          <div className="p-3 rounded-2xl bg-[#ecf6ee] border border-[#d7e8c3] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#0d631b] uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">tune</span> Anti-Gaming Twist Injector
              </span>
              <span className="text-[10px] text-[#546346]">Test CV verification:</span>
            </div>
            <select
              value={scenario}
              onChange={(e) => { setScenario(e.target.value); setVerdictResult(null); }}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#d7e8c3] text-[12px] font-['Plus_Jakarta_Sans'] font-semibold text-[#151d19]"
            >
              <option value="genuine">Scenario 1: Genuine Repair (Same spot & angle) → Auto-Pass</option>
              <option value="different_pothole">Scenario 2: Contractor games different pothole (180m away) → Reject</option>
              <option value="wrong_angle">Scenario 3: Same road, wrong camera angle (58° off) → Review</option>
              <option value="photo_reuse">Scenario 4: Reused photo fraud (pHash collision) → Fraud Reject</option>
            </select>
          </div>

          {/* Real-time Viewfinder Container */}
          <div className="relative w-full aspect-[9/14] sm:aspect-[9/16] max-h-[500px] rounded-3xl overflow-hidden shadow-xl bg-black flex flex-col justify-between p-3 border-2 border-[#d7e8c3]">
            {/* Hidden capture canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* REAL-TIME LIVE WEBCAM VIDEO */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={"absolute inset-0 w-full h-full object-cover transition-opacity duration-300 " + (useLiveCamera ? "opacity-100" : "opacity-0 pointer-events-none")}
            />

            {/* SIMULATED AR ROAD FEED FALLBACK */}
            {!useLiveCamera && (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500"
                style={{
                  backgroundImage: "url('" + (scenario === 'different_pothole'
                    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhS_lyFD4zIki-hYjRs0J_nj-kUtl-IVmxBC20jIz_3I4baGn5LnFpJbRM3_nmZXkpN0pNOcgWl3GzfVTF1jEBJ6Pzhi_KSxzdBCwqryvn2kI7IWpT3W5CdZ0HLwRIAR-sykN9qkUhz5a6-LLC6nzwPyEjTcWTeR9bfvYd5nLK52kGoGMs2p5aIkb2LG6vKh0r1-1ybH21JX6nXa1FOvOXyjio0lwOb_cAq_489dzWOU_AmH-wPstSKA'
                    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0TpDjXqMy-XXPRo3jnGEZX6mNFVQwk4uHkdhs8-Rd9MWdBolqnPAC8HAj4SjbrIJl_qpPDrj7w5a7aKbUyACYce8jSnloSQQv3uQAF_nxrWdlIghUuGqfRKB7mgmDW0uRMHs5bqUTTqomyj1F44Dra3zNiF3YqAKTZWI_v-p2z15d4N-6tGfCjvRy_rfbHapOYLCIDB2_a3QCjyBq-w9dF2Csth_j3tZE2kF1pS22493WeVNH0-x35w') + "')"
                }}
              />
            )}

            {/* REAL-TIME GHOST OVERLAY LAYER (Original Defect) */}
            {(overlayMode === 'photo' || overlayMode === 'both') && (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none transition-opacity duration-150"
                style={{
                  backgroundImage: "url('" + job.citizenPhoto + "')",
                  opacity: opacity / 100,
                  filter: 'contrast(125%) saturate(85%)',
                  mixBlendMode: 'screen'
                }}
              />
            )}

            {/* HIGH-TECH COMPUTER VISION WIREFRAME & SIFT KEYPOINTS */}
            {(overlayMode === 'wireframe' || overlayMode === 'both') && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon
                  points="28,42 72,38 80,68 34,72"
                  fill="rgba(163,246,156,0.12)"
                  stroke={sensors.ready ? "#a3f69c" : "#ff8a80"}
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                  className="animate-pulse"
                />
                <circle cx="28" cy="42" r="1.4" fill={sensors.ready ? "#a3f69c" : "#ff8a80"} />
                <circle cx="72" cy="38" r="1.4" fill={sensors.ready ? "#a3f69c" : "#ff8a80"} />
                <circle cx="80" cy="68" r="1.4" fill={sensors.ready ? "#a3f69c" : "#ff8a80"} />
                <circle cx="34" cy="72" r="1.4" fill={sensors.ready ? "#a3f69c" : "#ff8a80"} />
                <circle cx="50" cy="55" r="1.6" fill={sensors.ready ? "#a3f69c" : "#ff8a80"} />
              </svg>
            )}

            {/* Live Camera Status Badge */}
            <div className="relative z-20 flex items-center justify-between">
              <span className={"px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-md " + (
                useLiveCamera
                  ? "bg-[#0d631b]/90 text-white"
                  : "bg-black/70 text-slate-200"
              )}>
                <span className={"w-2 h-2 rounded-full " + (useLiveCamera ? "bg-emerald-400 animate-ping" : "bg-amber-400")}></span>
                <span>{useLiveCamera ? "LIVE WEBCAM STREAM" : "CALIBRATED AR SIMULATOR"}</span>
              </span>

              {/* Overlay Mode Selector */}
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/20">
                <button
                  type="button"
                  onClick={() => setOverlayMode('both')}
                  className={"px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all " + (overlayMode === 'both' ? "bg-[#0d631b] text-white" : "text-white/70 hover:text-white")}
                >
                  Both
                </button>
                <button
                  type="button"
                  onClick={() => setOverlayMode('photo')}
                  className={"px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all " + (overlayMode === 'photo' ? "bg-[#0d631b] text-white" : "text-white/70 hover:text-white")}
                >
                  Photo
                </button>
                <button
                  type="button"
                  onClick={() => setOverlayMode('wireframe')}
                  className={"px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all " + (overlayMode === 'wireframe' ? "bg-[#0d631b] text-white" : "text-white/70 hover:text-white")}
                >
                  Wireframe
                </button>
              </div>
            </div>

            {/* Live HUD Multi-Sensor Chips */}
            <div className="relative z-20 flex flex-col gap-1.5 mt-2">
              <div className="grid grid-cols-3 gap-1.5">
                <div className={"px-2 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1 shadow-sm " + (
                  sensors.gps.ok ? 'bg-[#0d631b]/90 text-white' : 'bg-[#ba1a1a]/90 text-white animate-pulse'
                )}>
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] uppercase font-bold opacity-80">GPS</span>
                    <span className="text-[10px] font-bold truncate">{sensors.gps.val}</span>
                  </div>
                </div>

                <div className={"px-2 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1 shadow-sm " + (
                  sensors.heading.ok ? 'bg-[#0d631b]/90 text-white' : 'bg-[#ba1a1a]/90 text-white animate-pulse'
                )}>
                  <span className="material-symbols-outlined text-[14px]">explore</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] uppercase font-bold opacity-80">Angle</span>
                    <span className="text-[10px] font-bold truncate">{sensors.heading.val}</span>
                  </div>
                </div>

                <div className={"px-2 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1 shadow-sm " + (
                  sensors.landmark.ok ? 'bg-[#0d631b]/90 text-white' : 'bg-[#ba1a1a]/90 text-white animate-pulse'
                )}>
                  <span className="material-symbols-outlined text-[14px]">domain</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] uppercase font-bold opacity-80">Landmark</span>
                    <span className="text-[10px] font-bold truncate">{sensors.landmark.val}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <span className={"px-3 py-1 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-bold shadow-md flex items-center gap-1.5 " + (
                  sensors.ready ? 'bg-[#0d631b] text-white' : 'bg-[#ba1a1a] text-white'
                )}>
                  <span className="material-symbols-outlined text-[14px]">
                    {sensors.ready ? 'check_circle' : 'warning'}
                  </span>
                  <span>{sensors.ready ? t.readyToCapture : t.misalignedWarning}</span>
                </span>
              </div>
            </div>

            {/* Center Reticle */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center pointer-events-none">
              <div className={"w-60 h-44 border-2 border-dashed rounded-2xl flex items-center justify-center relative " + (
                sensors.ready ? 'border-[#a3f69c]' : 'border-red-400'
              )}>
                <span className="absolute top-2 left-2 text-[9px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">
                  GHOST: {opacity}%
                </span>
                <div className="w-10 h-10 rounded-full border border-white/60 flex items-center justify-center">
                  <div className={"w-2.5 h-2.5 rounded-full " + (sensors.ready ? 'bg-[#a3f69c]' : 'bg-red-500')}></div>
                </div>
              </div>
            </div>

            {/* Real-time Opacity Slider & Quick Presets */}
            <div className="relative z-20 bg-black/80 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] font-['Plus_Jakarta_Sans'] text-white font-bold">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#a3f69c]">layers</span>
                  <span>{t.ghostOpacity}</span>
                </span>
                <div className="flex items-center gap-1">
                  {[25, 50, 75, 100].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setOpacity(p)}
                      className={"px-1.5 py-0.5 rounded text-[10px] font-mono " + (opacity === p ? "bg-[#a3f69c] text-black font-bold" : "bg-white/20 text-white")}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
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

          {/* Shutter Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleCapture}
              disabled={isCapturing}
              className={"w-20 h-20 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all " + (
                sensors.ready
                  ? 'bg-[#0d631b] hover:bg-[#2e7d32] text-white ring-4 ring-[#a3f69c]/60'
                  : 'bg-red-700 text-white ring-4 ring-red-400/50'
              ) + (isCapturing ? ' animate-pulse scale-90' : '')}
            >
              <div className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center">
                <span className="material-symbols-outlined text-[34px]">photo_camera</span>
              </div>
            </button>
            <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#40493d]">
              Tap Shutter to Run Multi-Sensor CV Verification
            </span>
          </div>

          {/* Verdict Modal */}
          {verdictResult && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#d7e8c3] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className={"px-3 py-1 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-bold " + (
                    verdictResult.status === 'pass' ? 'bg-[#d7e8c3] text-[#0d631b]' : 'bg-red-100 text-red-700'
                  )}>
                    Score: {verdictResult.score}
                  </span>
                  <button onClick={() => setVerdictResult(null)} className="w-8 h-8 rounded-full bg-[#ecf6ee] flex items-center justify-center text-[#40493d]">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1 text-center items-center">
                  <div className={"w-14 h-14 rounded-2xl flex items-center justify-center text-white text-[28px] shadow-md " + (
                    verdictResult.status === 'pass' ? 'bg-[#0d631b]' : 'bg-[#ba1a1a]'
                  )}>
                    <span className="material-symbols-outlined text-[32px]">
                      {verdictResult.status === 'pass' ? 'verified' : 'gpp_bad'}
                    </span>
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#151d19] mt-2">
                    {verdictResult.title}
                  </h3>
                  <p className="font-['Inter'] text-[12px] text-[#40493d] mt-1 leading-snug">
                    {verdictResult.reason}
                  </p>
                </div>

                {verdictResult.capturedImage && (
                  <div className="w-full h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                    <img src={verdictResult.capturedImage} alt="Captured Proof" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#f2fcf4] border border-[#d7e8c3]">
                  {verdictResult.details.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[#40493d]">{d.name}</span>
                      <span className={"font-mono font-bold flex items-center gap-1 " + (d.passed ? "text-[#0d631b]" : "text-[#ba1a1a]")}>
                        <span className="material-symbols-outlined text-[13px]">{d.passed ? "check_circle" : "cancel"}</span>
                        <span>{d.res}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  {verdictResult.status === 'pass' ? (
                    <button
                      onClick={() => { setVerdictResult(null); setActiveScreen('contractor-scorecard'); }}
                      className="w-full py-3 rounded-full bg-[#0d631b] hover:bg-[#2e7d32] text-white font-['Plus_Jakarta_Sans'] text-[14px] font-bold shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>View Payout & Scorecard</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setVerdictResult(null)}
                      className="w-full py-3 rounded-full bg-[#0d631b] text-white font-['Plus_Jakarta_Sans'] text-[14px] font-bold shadow-md flex items-center justify-center gap-1.5"
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
    }`;

// Replace GhostOverlayCamera in index.html
const startMarker = '    // 3. COMPONENT: GHOST OVERLAY CAMERA';
const endMarker = '    // 4. COMPONENT: CONTRACTOR SCORECARD';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) +
    startMarker + '\n    // ==========================================\n' +
    newGhostOverlayCamera + '\n\n    // ==========================================\n' +
    content.substring(endIndex);
  console.log('GhostOverlayCamera successfully replaced with real-time camera.');
} else {
  console.error('Could not find GhostOverlayCamera boundaries');
}

// New ReportCamera with Real-Time WebRTC Camera & Live Viewfinder
const newReportCamera = `    function ReportCamera({ setActiveScreen, addNewReport, selectedWard, t }) {
      const [selectedCategory, setSelectedCategory] = useState('Pothole');
      const [isCapturing, setIsCapturing] = useState(false);
      const [flashOn, setFlashOn] = useState(false);
      const [useLiveCamera, setUseLiveCamera] = useState(false);

      const videoRef = useRef(null);
      const streamRef = useRef(null);
      const canvasRef = useRef(null);

      const categories = ['Pothole', 'Crack / Shoulder', 'Manhole Collar', 'Waterlogging'];

      const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }
            });
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play().catch(e => console.log('Video play failed:', e));
            }
            setUseLiveCamera(true);
          } catch (err) {
            console.warn('Citizen camera stream unavailable, using AR simulation:', err);
            setUseLiveCamera(false);
          }
        }
      };

      const stopCamera = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setUseLiveCamera(false);
      };

      useEffect(() => {
        startCamera();
        return () => {
          stopCamera();
        };
      }, []);

      const toggleCameraMode = () => {
        if (useLiveCamera) {
          stopCamera();
        } else {
          startCamera();
        }
      };

      const handleCapture = () => {
        setIsCapturing(true);

        let capturedImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuD60Aqj9C8dTlzUl949E_dd8yZ-WowtrHai5ewaExJf8-lwJB0QMBxSfZRhSoEHjR5l7_qvsgth4inkbO2SwTHT91rG1DimkoN7Tgs5kay1AxdLeH1k9KDiom9Vo8u79Gwu2jkRgV-rjn60T1opNMbB9Wj8KL_dqzpSo0Io7qrEYRXsRozOMYQFnDoKy8GsokEROU9inYPYAV4zWug2KEzhl8N4gWhP8A516SqpYV4ouAgel43GeIRCow";

        if (useLiveCamera && videoRef.current && canvasRef.current) {
          try {
            const v = videoRef.current;
            const c = canvasRef.current;
            c.width = v.videoWidth || 640;
            c.height = v.videoHeight || 480;
            const ctx = c.getContext('2d');
            ctx.drawImage(v, 0, 0, c.width, c.height);
            capturedImage = c.toDataURL('image/jpeg', 0.85);
          } catch (err) {
            console.log('Capture error:', err);
          }
        }

        setTimeout(() => {
          const newIncident = {
            id: 'CF-' + Math.floor(1000 + Math.random() * 9000),
            status: "Report Submitted & AI-Verified",
            statusType: "verified",
            title: selectedCategory + ' Detected',
            address: 'Near 108 Main St, ' + selectedWard.split('•')[0],
            reportedDate: "Just now",
            repairedDate: "Pending dispatch",
            reporter: "Elena Vasquez (Verified)",
            contractor: "DPW Rapid Response Unit",
            crew: "Pending Crew Assignment",
            confidence: 97.8,
            ledgerHash: '#' + Math.random().toString(16).substring(2, 10) + '...9f01',
            metrics: [
              { label: "GPS Location", value: "Matched (±1.2m)", icon: "location_on" },
              { label: "Camera Heading", value: "Angle (284° WNW)", icon: "explore" },
              { label: "Kerb Landmark", value: "Geometry Match (95%)", icon: "domain" },
              { label: "Depth Baseline", value: "Depth: 4.8cm (Est.)", icon: "layers" }
            ],
            timeline: [
              { title: "Report Submitted", date: "Just now • by You", actor: "Citizen", completed: true },
              { title: "Triaged & Work Order Issued", date: "Auto-geofenced", actor: "Municipal Engine", completed: true },
              { title: "Contractor Repaired", date: "SLA: 24h Window", actor: "Pending Dispatch", completed: false },
              { title: "AI Telemetry Verified", date: "Pending", actor: "Auto-Verifier", completed: false },
              { title: "Community Confirmation", date: "Upcoming", actor: "Ward Stewards", completed: false }
            ],
            beforeImage: capturedImage,
            afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0TpDjXqMy-XXPRo3jnGEZX6mNFVQwk4uHkdhs8-Rd9MWdBolqnPAC8HAj4SjbrIJl_qpPDrj7w5a7aKbUyACYce8jSnloSQQv3uQAF_nxrWdlIghUuGqfRKB7mgmDW0uRMHs5bqUTTqomyj1F44Dra3zNiF3YqAKTZWI_v-p2z15d4N-6tGfCjvRy_rfbHapOYLCIDB2_a3QCjyBq-w9dF2Csth_j3tZE2kF1pS22493WeVNH0-x35w"
          };
          addNewReport(newIncident);
          setIsCapturing(false);
          setActiveScreen('detail');
        }, 700);
      };

      return (
        <div className="flex flex-col w-full pb-8 select-none gap-3">
          <canvas ref={canvasRef} className="hidden" />

          {/* Top Camera Controls */}
          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-2xl border border-[#d7e8c3] shadow-xs">
            <button
              type="button"
              onClick={() => setActiveScreen('home')}
              className="flex items-center gap-1 text-[13px] font-['Plus_Jakarta_Sans'] font-bold text-[#40493d] hover:text-[#151d19]"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>Cancel</span>
            </button>
            
            <button
              type="button"
              onClick={toggleCameraMode}
              className={"px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 border transition-all " + (
                useLiveCamera
                  ? "bg-[#0d631b] text-white border-[#0d631b]"
                  : "bg-[#ecf6ee] text-[#0d631b] border-[#d7e8c3]"
              )}
            >
              <span className="material-symbols-outlined text-[14px]">{useLiveCamera ? "videocam" : "view_in_ar"}</span>
              <span>{useLiveCamera ? "Live WebCam" : "AR Sim"}</span>
            </button>

            <button
              type="button"
              onClick={() => setFlashOn(!flashOn)}
              className={"w-8 h-8 rounded-full flex items-center justify-center transition-all " + (
                flashOn ? 'bg-amber-400 text-black' : 'bg-[#ecf6ee] text-[#40493d]'
              )}
            >
              <span className="material-symbols-outlined text-[18px]">{flashOn ? 'flash_on' : 'flash_off'}</span>
            </button>
          </div>

          {/* Defect Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={"px-3 py-1.5 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-bold whitespace-nowrap transition-all " + (
                  selectedCategory === cat
                    ? 'bg-[#0d631b] text-white shadow-xs'
                    : 'bg-white border border-[#d7e8c3] text-[#40493d]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Camera Viewport */}
          <div className="relative w-full aspect-[9/14] sm:aspect-[9/16] max-h-[500px] rounded-3xl overflow-hidden shadow-xl bg-[#29322d] flex flex-col justify-between p-4 border border-[#d7e8c3]/40">
            {/* Live Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={"absolute inset-0 w-full h-full object-cover transition-opacity duration-300 " + (useLiveCamera ? "opacity-100" : "opacity-0 pointer-events-none")}
            />

            {/* Fallback AR Road Background */}
            {!useLiveCamera && (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD60Aqj9C8dTlzUl949E_dd8yZ-WowtrHai5ewaExJf8-lwJB0QMBxSfZRhSoEHjR5l7_qvsgth4inkbO2SwTHT91rG1DimkoN7Tgs5kay1AxdLeH1k9KDiom9Vo8u79Gwu2jkRgV-rjn60T1opNMbB9Wj8KL_dqzpSo0Io7qrEYRXsRozOMYQFnDoKy8GsokEROU9inYPYAV4zWug2KEzhl8N4gWhP8A516SqpYV4ouAgel43GeIRCow')" }}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none"></div>

            <div className="relative z-20 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#0d631b] animate-ping"></span>
                  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold text-[#0d631b]">{t.gpsPrecision}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#151d19] shadow-sm">
                  <span className="material-symbols-outlined text-[15px] text-[#0d631b]">explore</span>
                  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold">284° WNW • {selectedWard.split('•')[0]}</span>
                </div>
              </div>
            </div>

            {/* Reticle with AI Tag */}
            <div className="relative z-20 my-auto flex flex-col items-center justify-center pointer-events-none">
              <div className="relative w-64 h-48 flex items-center justify-center">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#a3f69c] rounded-tl-lg shadow-sm"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#a3f69c] rounded-tr-lg shadow-sm"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#a3f69c] rounded-bl-lg shadow-sm"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#a3f69c] rounded-br-lg shadow-sm"></div>
                <div className="absolute -top-3.5 left-4 px-2.5 py-0.5 rounded-full bg-[#0d631b] text-white font-['Plus_Jakarta_Sans'] text-[11px] font-bold shadow-md">
                  {selectedCategory} (97.8% conf.)
                </div>
                <span className="text-white font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/60">
                  {t.curbInFrame}
                </span>
              </div>
              <div className="mt-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg flex items-center gap-2 max-w-[92%] border border-[#d7e8c3]">
                <span className="material-symbols-outlined text-[#0d631b] text-[18px]">lightbulb</span>
                <p className="font-['Inter'] text-[12px] text-[#151d19] truncate">{t.curbTip}</p>
              </div>
            </div>

            <div></div>
          </div>

          {/* Shutter Button */}
          <div className="p-4 rounded-3xl bg-white shadow-sm border border-[#d7e8c3]/60 flex flex-col items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-2 rounded-full bg-[#d7e8c3]/60 animate-ping opacity-60"></div>
              <button
                type="button"
                onClick={handleCapture}
                disabled={isCapturing}
                className={"relative w-20 h-20 rounded-full bg-[#0d631b] text-white flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-[#2e7d32] " + (
                  isCapturing ? 'animate-pulse scale-90' : ''
                )}
              >
                <div className="w-16 h-16 rounded-full border-2 border-white/60 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px]">photo_camera</span>
                </div>
              </button>
            </div>
            <div className="text-center">
              <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#151d19]">{t.snapAutoReport}</h2>
              <p className="font-['Inter'] text-[12px] text-[#40493d] mt-0.5">{t.snapSub}</p>
            </div>
          </div>
        </div>
      );
    }`;

// Replace ReportCamera in index.html
const repStart = '    function ReportCamera({ setActiveScreen, addNewReport, selectedWard, t }) {';
const repEnd = '    // ==========================================\n    // 6. COMPONENT: COMMUNITY ACTIVITY (STEWARD REPAIR VERIFICATION)\n    // ==========================================';

const rStartIndex = content.indexOf(repStart);
const rEndIndex = content.indexOf(repEnd);

if (rStartIndex !== -1 && rEndIndex !== -1) {
  content = content.substring(0, rStartIndex) +
    newReportCamera + '\n\n    // ==========================================\n    // 6. COMPONENT: COMMUNITY ACTIVITY (STEWARD REPAIR VERIFICATION)\n    // ==========================================\n' +
    content.substring(rEndIndex + repEnd.length);
  console.log('ReportCamera successfully replaced with real-time camera.');
} else {
  console.error('Could not find ReportCamera boundaries:', rStartIndex, rEndIndex);
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log('update_cameras.js completed successfully.');
