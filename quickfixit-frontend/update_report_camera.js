const fs = require('fs');

const indexPath = 'c:/Users/Maviya Shaikh/Desktop/rough/frontend/index.html';
let content = fs.readFileSync(indexPath, 'utf8');

const repStart = '    function ReportCamera({ setActiveScreen, addNewReport, selectedWard, t }) {';
const repEnd = '    function ComplaintDetail({ incident = MOCK_INCIDENT_DETAIL, setActiveScreen, t }) {';

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
              videoRef.current.play().catch(e => console.log('Video play error:', e));
            }
            setUseLiveCamera(true);
          } catch (err) {
            console.warn('Citizen webcam stream unavailable, using AR simulator:', err);
            setUseLiveCamera(false);
          }
        }
      };

      const stopCamera = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
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
    }

`;

const rStartIndex = content.indexOf(repStart);
const rEndIndex = content.indexOf(repEnd);

if (rStartIndex !== -1 && rEndIndex !== -1) {
  content = content.substring(0, rStartIndex) + newReportCamera + content.substring(rEndIndex);
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('ReportCamera successfully replaced with live WebRTC camera.');
} else {
  console.error('Could not find ReportCamera boundaries:', rStartIndex, rEndIndex);
}
