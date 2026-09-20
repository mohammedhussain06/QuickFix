import React, { useState, useEffect, useRef } from 'react';

// Enhanced Mock Data matching the user's exact dashboard screenshot
export const TRIAGE_QUEUE_DATA = [
  {
    id: "#CF-8429",
    rawId: "CF-8429",
    matchScore: "98.4% Match",
    matchColor: "emerald",
    sla: "1h 45m SLA",
    address: "342 Elm Street, Ward 14",
    ward: "Ward 14 (Maplewood)",
    hazardType: "Deep Asphalt Pothole",
    contractor: "Apex Paving Ltd.",
    crew: "Crew #4 (Rajesh S.)",
    citizen: "Maya S.",
    status: "Sign-off Ready",
    depth: "120mm Defect Depth",
    reportedTime: "Oct 24 • 9:15 AM",
    repairedTime: "Oct 26 • 2:10 PM",
    repairType: "Hot-mix Asphalt Patch",
    homographyConfidence: "98.4%",
    anchorsLocked: "3/3 Anchors Locked",
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqN3QvFP4tqPuysr6ufwxUoj95aryz370FdFkg_EGvKUd5RwTSvhiEE6YhYHjD_Y9LwaX93PXa75BcQVDKyVi859KPLgj2WV5NWF7DxgPhrYUKVnFyhBQDX_k0-BagDesfVAwN2fBQd9rA1tCoIjamuC4YNZ0RiDEAPzMI3qGRx_K-vyma1mSrN2iPvEx2fKUC1vgGyJ3lfVp0UpdaTiQ2Ie6iIxOq1rc7RUyknq7eOOMo7VrrFwSPUw",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0TpDjXqMy-XXPRo3jnGEZX6mNFVQwk4uHkdhs8-Rd9MWdBolqnPAC8HAj4SjbrIJl_qpPDrj7w5a7aKbUyACYce8jSnloSQQv3uQAF_nxrWdlIghUuGqfRKB7mgmDW0uRMHs5bqUTTqomyj1F44Dra3zNiF3YqAKTZWI_v-p2z15d4N-6tGfCjvRy_rfbHapOYLCIDB2_a3QCjyBq-w9dF2Csth_j3tZE2kF1pS22493WeVNH0-x35w",
    telemetry: [
      { name: "GPS Delta", detail: "0.9m offset (Tolerance ≤ 2.5m)", icon: "near_me", status: "Pass" },
      { name: "Compass Heading", detail: "282° W vs 284° W (2° variance)", icon: "explore", status: "Pass" },
      { name: "Landmark Geometry", detail: "Kerb & pole matched (99.2%)", icon: "domain", status: "Pass" },
      { name: "Surface Fill & Level", detail: "100% flush patch, void eliminated", icon: "layers", status: "Pass" }
    ],
    hash: "#e7a4f9104c89a01f92e42b109f01",
    anchors: [
      { x1: 28, y1: 38, x2: 30, y2: 36, label: "Kerb Edge" },
      { x1: 66, y1: 26, x2: 64, y2: 24, label: "Sign Pole" },
      { x1: 82, y1: 52, x2: 78, y2: 48, label: "Joint Seam" }
    ]
  },
  {
    id: "#CF-8430",
    rawId: "CF-8430",
    matchScore: "91.2% Match",
    matchColor: "emerald",
    sla: "4h 12m SLA",
    address: "892 Pine Crest Ave",
    ward: "Ward 14 (Maplewood)",
    hazardType: "Crumbling Shoulder",
    contractor: "NorthStar Infra",
    crew: "Crew #2 (Anand K.)",
    citizen: "Vikram R.",
    status: "Under Review",
    depth: "85mm Surface Spall",
    reportedTime: "Oct 25 • 11:20 AM",
    repairedTime: "Oct 26 • 1:40 PM",
    repairType: "Bituminous Cold Overlay",
    homographyConfidence: "91.2%",
    anchorsLocked: "3/3 Anchors Locked",
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhS_lyFD4zIki-hYjRs0J_nj-kUtl-IVmxBC20jIz_3I4baGn5LnFpJbRM3_nmZXkpN0pNOcgWl3GzfVTF1jEBJ6Pzhi_KSxzdBCwqryvn2kI7IWpT3W5CdZ0HLwRIAR-sykN9qkUhz5a6-LLC6nzwPyEjTcWTeR9bfvYd5nLK52kGoGMs2p5aIkb2LG6vKh0r1-1ybH21JX6nXa1FOvOXyjio0lwOb_cAq_489dzWOU_AmH-wPstSKA",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD34BtGNaMowD674Rfy8Ry0_HVg91KXAhn-jOkHLaPl4Qopvgb_EgklAQe-QF6Z2pjtzrFXWn3hTSQoKF9NJCQ3WR6tjSeDC1gWc8tWjwB-zWtBoMG6vUCZYGhYobxQn5LYiP0z57NJPHrlTekmz1WxEdA-SuHcFsMy61yZvoBoRQdBliQl7qkzaP-11zGUeOTykUWSXGj8cwmQS0h_MUNmMzQOal9GE_umK83uVlscwjbOlhsTtnxkaA",
    telemetry: [
      { name: "GPS Delta", detail: "1.4m offset (Tolerance ≤ 2.5m)", icon: "near_me", status: "Pass" },
      { name: "Compass Heading", detail: "190° S vs 194° S (4° variance)", icon: "explore", status: "Pass" },
      { name: "Landmark Geometry", detail: "Curb line matched (93.1%)", icon: "domain", status: "Pass" },
      { name: "Surface Fill & Level", detail: "Smooth rolled edge finish", icon: "layers", status: "Pass" }
    ],
    hash: "#84a1e9b201f893ca...192b",
    anchors: [
      { x1: 32, y1: 44, x2: 34, y2: 42, label: "Drain Grate" },
      { x1: 72, y1: 30, x2: 70, y2: 28, label: "Boundary Wall" }
    ]
  },
  {
    id: "#CF-8431",
    rawId: "CF-8431",
    matchScore: "74.3% Mismatch",
    matchColor: "red",
    sla: "2h left",
    address: "Oak Ridge Ave & 4th",
    ward: "Ward 14 (Maplewood)",
    hazardType: "Sunken Manhole Rim",
    contractor: "Landmark Flagged",
    crew: "Crew #6 (Karan M.)",
    citizen: "Devika N.",
    status: "Flagged Discrepancy",
    depth: "140mm Subsidence",
    reportedTime: "Oct 25 • 3:00 PM",
    repairedTime: "Oct 26 • 11:15 AM",
    repairType: "Cast-iron Riser Ring",
    homographyConfidence: "74.3%",
    anchorsLocked: "1/3 Anchors Misaligned",
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1qtcsNjSXhDrNZ1jTwcY6zDwQC0cchueHYRoZZWS8IU-MpnsO3z0vtK4n8r18-59lqI6kr-urdIkHIkLVWtVeobUzKeSUa-zIPM5nS4NFnIDGllNQ3HIIon70jGs127zxrmc5buSHGCa4Ud7nzOZrJWHshQn8FnHMHROIjxhHxtnSJ2-ubn4XbwTI4kOh0ziBEWdayUXgR8S43ZgeAB9KWUTF3xW-1ItuyMSz4PTpjzTsAK7CzprQKQ",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhS_lyFD4zIki-hYjRs0J_nj-kUtl-IVmxBC20jIz_3I4baGn5LnFpJbRM3_nmZXkpN0pNOcgWl3GzfVTF1jEBJ6Pzhi_KSxzdBCwqryvn2kI7IWpT3W5CdZ0HLwRIAR-sykN9qkUhz5a6-LLC6nzwPyEjTcWTeR9bfvYd5nLK52kGoGMs2p5aIkb2LG6vKh0r1-1ybH21JX6nXa1FOvOXyjio0lwOb_cAq_489dzWOU_AmH-wPstSKA",
    telemetry: [
      { name: "GPS Delta", detail: "8.4m offset (EXCEEDS 2.5m)", icon: "near_me", status: "Fail" },
      { name: "Compass Heading", detail: "045° vs 110° (65° skew)", icon: "explore", status: "Fail" },
      { name: "Landmark Geometry", detail: "Different background curb", icon: "domain", status: "Fail" },
      { name: "Surface Fill & Level", detail: "Level detected", icon: "layers", status: "Pass" }
    ],
    hash: "#71f92a104c99e19d...7721",
    anchors: []
  },
  {
    id: "#CF-8432",
    rawId: "CF-8432",
    matchScore: "99.1% Match",
    matchColor: "emerald",
    sla: "5h 30m",
    address: "1200 Lakeview Blvd",
    ward: "Ward 14 (Maplewood)",
    hazardType: "Pothole & Alligator Cracking",
    contractor: "QuickPatch Co.",
    crew: "Crew #1 (Suresh P.)",
    citizen: "Rohan D.",
    status: "Sign-off Ready",
    depth: "95mm Fatigue Crack",
    reportedTime: "Oct 25 • 4:15 PM",
    repairedTime: "Oct 26 • 12:05 PM",
    repairType: "Infrared Thermal Patch",
    homographyConfidence: "99.1%",
    anchorsLocked: "3/3 Anchors Locked",
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqN3QvFP4tqPuysr6ufwxUoj95aryz370FdFkg_EGvKUd5RwTSvhiEE6YhYHjD_Y9LwaX93PXa75BcQVDKyVi859KPLgj2WV5NWF7DxgPhrYUKVnFyhBQDX_k0-BagDesfVAwN2fBQd9rA1tCoIjamuC4YNZ0RiDEAPzMI3qGRx_K-vyma1mSrN2iPvEx2fKUC1vgGyJ3lfVp0UpdaTiQ2Ie6iIxOq1rc7RUyknq7eOOMo7VrrFwSPUw",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0TpDjXqMy-XXPRo3jnGEZX6mNFVQwk4uHkdhs8-Rd9MWdBolqnPAC8HAj4SjbrIJl_qpPDrj7w5a7aKbUyACYce8jSnloSQQv3uQAF_nxrWdlIghUuGqfRKB7mgmDW0uRMHs5bqUTTqomyj1F44Dra3zNiF3YqAKTZWI_v-p2z15d4N-6tGfCjvRy_rfbHapOYLCIDB2_a3QCjyBq-w9dF2Csth_j3tZE2kF1pS22493WeVNH0-x35w",
    telemetry: [
      { name: "GPS Delta", detail: "0.4m offset (Tolerance ≤ 2.5m)", icon: "near_me", status: "Pass" },
      { name: "Compass Heading", detail: "310° NW vs 311° NW", icon: "explore", status: "Pass" },
      { name: "Landmark Geometry", detail: "Storm inlet match (99.8%)", icon: "domain", status: "Pass" },
      { name: "Surface Fill & Level", detail: "Thermal welded edge flush", icon: "layers", status: "Pass" }
    ],
    hash: "#52d8104c89a01f92...9e44",
    anchors: [
      { x1: 25, y1: 35, x2: 27, y2: 34, label: "Catch Basin" },
      { x1: 65, y1: 22, x2: 63, y2: 23, label: "Tree Trunk" }
    ]
  },
  {
    id: "#CF-8433",
    rawId: "CF-8433",
    matchScore: "88.5% Match",
    matchColor: "emerald",
    sla: "8h 15m",
    address: "45 Maplewood Way",
    ward: "Ward 14 (Maplewood)",
    hazardType: "Curb Erosion",
    contractor: "GreenRoads",
    crew: "Crew #3 (Pooja S.)",
    citizen: "Amit G.",
    status: "Sign-off Ready",
    depth: "60mm Edge Break",
    reportedTime: "Oct 25 • 5:40 PM",
    repairedTime: "Oct 26 • 2:30 PM",
    repairType: "Concrete Curb & Gutter Patch",
    homographyConfidence: "88.5%",
    anchorsLocked: "3/3 Anchors Locked",
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhS_lyFD4zIki-hYjRs0J_nj-kUtl-IVmxBC20jIz_3I4baGn5LnFpJbRM3_nmZXkpN0pNOcgWl3GzfVTF1jEBJ6Pzhi_KSxzdBCwqryvn2kI7IWpT3W5CdZ0HLwRIAR-sykN9qkUhz5a6-LLC6nzwPyEjTcWTeR9bfvYd5nLK52kGoGMs2p5aIkb2LG6vKh0r1-1ybH21JX6nXa1FOvOXyjio0lwOb_cAq_489dzWOU_AmH-wPstSKA",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD34BtGNaMowD674Rfy8Ry0_HVg91KXAhn-jOkHLaPl4Qopvgb_EgklAQe-QF6Z2pjtzrFXWn3hTSQoKF9NJCQ3WR6tjSeDC1gWc8tWjwB-zWtBoMG6vUCZYGhYobxQn5LYiP0z57NJPHrlTekmz1WxEdA-SuHcFsMy61yZvoBoRQdBliQl7qkzaP-11zGUeOTykUWSXGj8cwmQS0h_MUNmMzQOal9GE_umK83uVlscwjbOlhsTtnxkaA",
    telemetry: [
      { name: "GPS Delta", detail: "1.1m offset (Tolerance ≤ 2.5m)", icon: "near_me", status: "Pass" },
      { name: "Compass Heading", detail: "088° E vs 090° E", icon: "explore", status: "Pass" },
      { name: "Landmark Geometry", detail: "Sidewalk slab lines (91.0%)", icon: "domain", status: "Pass" },
      { name: "Surface Fill & Level", detail: "Curb line restored", icon: "layers", status: "Pass" }
    ],
    hash: "#9a21bcf87c55e318...8f7b",
    anchors: [
      { x1: 40, y1: 50, x2: 42, y2: 48, label: "Sidewalk Joint" }
    ]
  }
];

export default function MunicipalPortal({ onLogout, lang, setLang, t, onSwitchRole }) {
  const [activeTab, setActiveTab] = useState('review-queue');
  const [docketsList, setDocketsList] = useState(TRIAGE_QUEUE_DATA);
  const [selectedDocket, setSelectedDocket] = useState(TRIAGE_QUEUE_DATA[0]);
  const [searchFilter, setSearchFilter] = useState('');
  const [queueFilter, setQueueFilter] = useState('all');
  const [actionNotice, setActionNotice] = useState(null);
  const [defectFilter, setDefectFilter] = useState('potholes');
  const [timeRange, setTimeRange] = useState('30d');
  const [mapLayer, setMapLayer] = useState('heatmap');
  const [selectedHotspot, setSelectedHotspot] = useState(true);
  const [isVerifyingChain, setIsVerifyingChain] = useState(false);
  const [chainVerified, setChainVerified] = useState(true);
  const [auditFilter, setAuditFilter] = useState('all');

  // Modals
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedAuditBlock, setSelectedAuditBlock] = useState(null);
  const [inspectContractor, setInspectContractor] = useState(null);

  // Contractors & Scorecards State
  const [contractorsList, setContractorsList] = useState([
    {
      id: "APEX-01",
      name: "Apex Paving Ltd.",
      lead: "Rajesh Shinde",
      crew: "Crew #4",
      avatar: "/rajesh_shinde.jpg",
      tier: "Tier 1 Verified",
      rating: "4.9 ",
      slaRate: 96.8,
      completed: 142,
      firstPassRate: 98.4,
      avgResponse: "14.2h",
      payoutTotal: "₹14,80,000",
      penalties: "₹0",
      status: "Good Standing",
      statusType: "good",
      ward: "Ward 14 • Maplewood",
      phone: "+91 98334 10294"
    },
    {
      id: "HRTG-02",
      name: "Heritage Paving Infra",
      lead: "Amit Patil",
      crew: "Crew #2",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      tier: "Tier 1 Verified",
      rating: "4.8 ",
      slaRate: 98.2,
      completed: 198,
      firstPassRate: 97.9,
      avgResponse: "12.8h",
      payoutTotal: "₹22,10,000",
      penalties: "₹0",
      status: "Good Standing",
      statusType: "good",
      ward: "Ward K/W • Andheri West",
      phone: "+91 98205 77192"
    },
    {
      id: "METRO-03",
      name: "Metro Asphalt Works",
      lead: "Vikram Deshmukh",
      crew: "Crew #3",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      tier: "Tier 2 Active",
      rating: "4.5 ",
      slaRate: 91.5,
      completed: 115,
      firstPassRate: 89.2,
      avgResponse: "22.4h",
      payoutTotal: "₹11,20,000",
      penalties: "₹30,000",
      status: "SLA Warning",
      statusType: "warning",
      ward: "Ward A • Colaba",
      phone: "+91 98190 44820"
    },
    {
      id: "MUMBAI-04",
      name: "Mumbai Infra Roads",
      lead: "Sunil Jadhav",
      crew: "Crew #1",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
      tier: "Tier 3 Under Review",
      rating: "3.6 ",
      slaRate: 82.1,
      completed: 88,
      firstPassRate: 78.5,
      avgResponse: "38.6h",
      payoutTotal: "₹6,40,000",
      penalties: "₹1,50,000",
      status: "Penalized (Sec 12-B)",
      statusType: "danger",
      ward: "Ward G/N • Dadar",
      phone: "+91 98920 11983"
    }
  ]);



  return (
    <div className="min-h-screen w-full bg-[#f4f7f4] text-[#151d19] font-['Inter'] flex antialiased">
      {/* 1. LEFT OPERATIONS HUB SIDEBAR */}
      <aside className="w-64 bg-white border-r border-[#e0ece2] flex flex-col justify-between shrink-0 select-none">
        <div className="flex flex-col">
          {/* Logo & DPW Ops Tag */}
          <div className="p-4 flex flex-col gap-2 border-b border-[#e0ece2]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1b5e20] text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[20px]">handyman</span>
              </div>
              <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-[20px] text-[#151d19] tracking-tight">
                CivicFix
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#eef7ee] border border-[#d2e7d3] text-[#1b5e20] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[15px]">account_balance</span>
              <span>Maplewood DPW Ops</span>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-4 flex flex-col gap-1">
            <span className="px-3 pb-2 text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#6f7e73] uppercase tracking-wider">
              Operations Hub
            </span>

            <button
              onClick={() => setActiveTab('review-queue')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-[13px] font-bold transition-all ${
                activeTab === 'review-queue'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-[#414d45] hover:bg-[#f0f6f1] hover:text-[#151d19]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">fact_check</span>
              <span>Review Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('ward-heatmap')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-[13px] font-bold transition-all ${
                activeTab === 'ward-heatmap'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-[#414d45] hover:bg-[#f0f6f1] hover:text-[#151d19]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">map</span>
              <span>Ward Heatmap Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('contractor-scorecards')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-[13px] font-bold transition-all ${
                activeTab === 'contractor-scorecards'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-[#414d45] hover:bg-[#f0f6f1] hover:text-[#151d19]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">engineering</span>
              <span>Contractor Scorecards</span>
            </button>

            <button
              onClick={() => setActiveTab('contractor-batches')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-[13px] font-bold transition-all ${
                activeTab === 'contractor-batches'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-[#414d45] hover:bg-[#f0f6f1] hover:text-[#151d19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[19px]">badge</span>
                <span>Contractor ID & Batch</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'contractor-batches' ? 'bg-white/20 text-white' : 'bg-[#d7e8c3] text-[#1b5e20]'
              }`}>
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('audit-ledger')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-[13px] font-bold transition-all ${
                activeTab === 'audit-ledger'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-[#414d45] hover:bg-[#f0f6f1] hover:text-[#151d19]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">lock</span>
              <span>Audit Ledger</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-[13px] font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-[#414d45] hover:bg-[#f0f6f1] hover:text-[#151d19]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">settings</span>
              <span>Settings</span>
            </button>

            <div className="pt-4">
              <button
                onClick={() => setShowBatchModal(true)}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-[#b6ccb9] text-[#1b5e20] hover:bg-[#eef7ee] font-['Plus_Jakarta_Sans'] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Create Batch / Contractor ID</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom SLA Health indicator */}
        <div className="p-4 border-t border-[#e0ece2] flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-['Plus_Jakarta_Sans'] font-bold">
            <span className="text-[#414d45]">SLA Health</span>
            <span className="text-[#1b5e20]">98.4%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#e0ece2] overflow-hidden">
            <div className="h-full bg-[#1b5e20] rounded-full" style={{ width: '98.4%' }}></div>
          </div>
          <span className="text-[10px] text-[#6f7e73] leading-tight">
            All 6 Wards meeting municipal response benchmarks
          </span>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#e0ece2] px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f6f1] text-[#1b5e20] text-[12px] font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#1b5e20] animate-pulse"></span>
              <span>24 Open Dispatches</span>
            </div>

            {/* Global Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#7a887d] text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search hazard ID, ward, or contractor..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f4f8f4] border border-[#e0ece2] text-[13px] placeholder-[#7a887d] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1b5e20]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 rounded-xl hover:bg-[#f0f6f1] flex items-center justify-center text-[#414d45] transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            </button>
            <button className="w-9 h-9 rounded-xl hover:bg-[#f0f6f1] flex items-center justify-center text-[#414d45] transition-colors">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>

            {onSwitchRole && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef7ee] border border-[#d2e7d3]">
                <span className="text-[11px] font-bold text-[#1b5e20] uppercase mr-1">Field Apps:</span>
                <button
                  type="button"
                  onClick={() => onSwitchRole('citizen')}
                  className="px-2.5 py-1 rounded-lg bg-white text-[#1b5e20] hover:bg-[#1b5e20] hover:text-white transition-all text-[11px] font-bold shadow-xs border border-[#d2e7d3] flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  <span>Citizen App</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchRole('contractor')}
                  className="px-2.5 py-1 rounded-lg bg-white text-[#1b5e20] hover:bg-[#1b5e20] hover:text-white transition-all text-[11px] font-bold shadow-xs border border-[#d2e7d3] flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">engineering</span>
                  <span>Contractor App</span>
                </button>
              </div>
            )}

            {/* Officer Profile Badge */}
            <div className="flex items-center gap-3 pl-3 border-l border-[#e0ece2]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                alt="Elena Rostova"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1b5e20]"
              />
              <div className="flex flex-col text-left">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] text-[#151d19] leading-tight">
                  Elena Rostova
                </span>
                <span className="font-['Inter'] text-[11px] text-[#6f7e73]">
                  Chief Roads Inspector
                </span>
              </div>

              <button
                onClick={onLogout}
                className="w-8 h-8 rounded-xl hover:bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center transition-colors ml-1"
                title={t.logout}
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Global Toast Action Notice */}
        {actionNotice && (
          <div
            className={`mx-6 mt-4 p-3 rounded-2xl flex items-center gap-2.5 font-['Plus_Jakarta_Sans'] text-[13px] font-bold shadow-sm transition-all ${
              actionNotice.type === 'approved'
                ? 'bg-[#d7e8c3] text-[#12230b] border border-[#a3f69c]'
                : 'bg-[#ffdad6] text-[#93000a] border border-[#ffb4ab]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {actionNotice.type === 'approved' ? 'verified' : 'history'}
            </span>
            <span>{actionNotice.msg}</span>
          </div>
        )}

        {/* TAB 1: REVIEW QUEUE (Inspection Evidence & Triage) */}
        {activeTab === 'review-queue' && (
          <main className="p-6 flex flex-col gap-6">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#1b5e20]">pending_actions</span>
                    <span>Pending Triage & AI Review</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#eef7ee] text-[#1b5e20] text-[10px] font-extrabold">
                    Queue Active
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#151d19] tracking-tight">
                    38
                  </span>
                  <span className="text-[12px] text-[#6f7e73]">reports awaiting sign-off</span>
                </div>
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#f0f4f0] text-[11px] font-bold">
                  <span className="px-2 py-0.5 rounded-full bg-[#d7e8c3] text-[#1b5e20]">
                    ● 14 High (&gt;95%)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#fff4cc] text-[#8a6500]">
                    ● 19 Mod
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a]">
                    ● 5 Flagged
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#1b5e20]">timer</span>
                    <span>Median Review Turnaround</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#d7e8c3] text-[#1b5e20] text-[10px] font-extrabold">
                    -34% MoM
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#151d19] tracking-tight">
                    2.4 <span className="text-[20px] font-bold">min</span>
                  </span>
                  <span className="text-[12px] text-[#6f7e73]">target ≤ 6.0m</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0f4f0] text-[11px]">
                  <span className="text-[#6f7e73]">Automated AI approval rate</span>
                  <span className="font-bold text-[#1b5e20]">92.0%</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#1b5e20]">verified</span>
                    <span>Contractor SLA Compliance</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#eef7ee] text-[#1b5e20] text-[10px] font-extrabold">
                    Active Period
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#1b5e20] tracking-tight">
                    96.8%
                  </span>
                  <span className="text-[12px] text-[#6f7e73]">Ward 14 & 15</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#e0ece2] mt-3 overflow-hidden">
                  <div className="h-full bg-[#1b5e20] rounded-full" style={{ width: '96.8%' }}></div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#1b5e20]">lock</span>
                    <span>Cryptographic Audit Ledger</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#eef7ee] text-[#1b5e20] text-[10px] font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1b5e20]"></span>
                    Sync
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#151d19] tracking-tight">
                    1,429
                  </span>
                  <span className="text-[12px] text-[#6f7e73]">blocks sealed</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0f4f0] text-[11px]">
                  <span className="text-[#6f7e73]">Tampering instances</span>
                  <span className="font-bold text-[#1b5e20]">0 detected (Immutable)</span>
                </div>
              </div>
            </div>

            {/* Split Main Grid: Triage Queue on Left (4.5 cols), Active Docket on Right (7.5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Triage Queue */}
              <div className="lg:col-span-5 flex flex-col gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#1b5e20]">ballot</span>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#151d19]">
                        Triage Queue
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eef7ee] text-[#1b5e20] text-[11px] font-bold">
                      Live Stream
                    </span>
                  </div>

                  {/* Filter & Ward selectors */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#7a887d] text-[16px]">
                        search
                      </span>
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Filter ID, street, contractor..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#f4f8f4] border border-[#e0ece2] text-[12px] placeholder-[#7a887d] focus:outline-none focus:border-[#1b5e20]"
                      />
                    </div>
                    <select className="px-2.5 py-1.5 rounded-xl bg-[#f4f8f4] border border-[#e0ece2] text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#151d19] focus:outline-none">
                      <option>Ward 14 • Maplewood</option>
                      <option>Ward A • Colaba</option>
                      <option>Ward K/W • Andheri</option>
                    </select>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                    {[
                      { key: 'all', label: `All (${docketsList.length})` },
                      { key: 'ai-verified', label: 'AI Verified' },
                      { key: 'disputed', label: 'Disputed' },
                      { key: 'approved', label: 'Approved' }
                    ].map((pill) => (
                      <button
                        key={pill.key}
                        onClick={() => setQueueFilter(pill.key)}
                        className={`px-3 py-1 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-bold whitespace-nowrap transition-all ${
                          queueFilter === pill.key
                            ? 'bg-[#1b5e20] text-white'
                            : 'bg-[#f0f6f1] text-[#414d45] hover:bg-[#e0ece2]'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Queue Cards List */}
                <div className="flex flex-col gap-2.5">
                  {filteredDockets.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white border border-[#e0ece2] text-center flex flex-col items-center justify-center gap-2 shadow-xs">
                      <span className="material-symbols-outlined text-[36px] text-[#7a887d]">search_off</span>
                      <span className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#151d19]">No reports match your search</span>
                      <span className="text-[12px] text-[#6f7e73]">Try clearing search keywords or switching filters.</span>
                      <button 
                        onClick={() => { setSearchFilter(''); setQueueFilter('all'); }}
                        className="mt-2 px-3 py-1.5 rounded-xl bg-[#eef7ee] hover:bg-[#d7e8c3] text-[#1b5e20] text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    filteredDockets.map((item) => {
                      const isSelected = selectedDocket && selectedDocket.id === item.id;
                      const isMismatch = item.matchColor === 'red';
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedDocket(item)}
                          className={`p-3.5 rounded-2xl bg-white border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#1b5e20] ring-2 ring-[#1b5e20]/25 shadow-md'
                              : 'border-[#e0ece2] hover:border-[#b6ccb9] shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[12px] font-bold text-[#151d19]">
                                {item.id}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold ${
                                  isMismatch
                                    ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                    : 'bg-[#d7e8c3] text-[#1b5e20]'
                                }`}
                              >
                                {isMismatch ? ' ' : ' '}
                                {item.matchScore}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold ${
                                item.sla.includes('left')
                                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                  : 'bg-[#f0f6f1] text-[#6f7e73]'
                              }`}
                            >
                              {item.sla}
                            </span>
                          </div>

                          <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#151d19] mt-1.5">
                            {item.address}
                          </h4>

                          <div className="flex items-center justify-between text-[11px] text-[#6f7e73] mt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">
                                dangerous
                              </span>
                              <span className="truncate">{item.hazardType}</span>
                            </div>
                            <span className="truncate max-w-[140px] text-right font-medium text-[#414d45]">
                              {item.contractor}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#f0f4f0] text-[11px]">
                            <span className="text-[#6f7e73]">
                              Depth: <strong className="text-[#151d19]">{item.depth}</strong>
                            </span>
                            <span className={`font-bold ${
                              item.status === 'Approved' ? 'text-[#1b5e20]' : item.status === 'Rejected & Fined' ? 'text-[#ba1a1a]' : 'text-[#6f7e73]'
                            }`}>
                              {item.status}
                            </span>
                          </div>

                          {/* Sign-off Ready footer for top item */}
                          {item.status === 'Sign-off Ready' && (
                            <div className="mt-2.5 pt-2 border-t border-[#f0f4f0] flex items-center justify-between text-[11px]">
                              <span className="font-bold text-[#1b5e20]">Sign-off Ready</span>
                              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[#1b5e20] flex items-center gap-0.5">
                                <span>Inspect Evidence</span>
                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                              </span>
                            </div>
                          )}
                          {item.status === 'Flagged Discrepancy' && (
                            <div className="mt-2.5 pt-2 border-t border-[#f0f4f0] flex items-center justify-between text-[11px]">
                              <span className="font-bold text-[#ba1a1a]">Landmark Flagged</span>
                              <span className="text-[#ba1a1a] font-bold">Inspect Warning →</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Active Inspection Docket (Inspection Evidence) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {/* Header of Active Docket */}
                <div className="p-5 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#1b5e20] text-white text-[10px] font-['Plus_Jakarta_Sans'] font-extrabold tracking-wider uppercase">
                          Active Docket
                        </span>
                        <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[20px] text-[#151d19]">
                          Inspection Evidence {selectedDocket.id}
                        </h2>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-[#6f7e73] mt-1">
                        <span className="material-symbols-outlined text-[15px] text-[#1b5e20]">location_on</span>
                        <span>{selectedDocket.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#f0f6f1] text-[#414d45] text-[11px] font-['Plus_Jakarta_Sans'] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                        <span>Citizen: {selectedDocket.citizen}</span>
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#eef7ee] text-[#1b5e20] text-[11px] font-['Plus_Jakarta_Sans'] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                        <span>{selectedDocket.contractor}</span>
                      </span>
                    </div>
                  </div>

                  {/* Subhead: Computer Vision Geometric Alignment */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#f0f4f0]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#1b5e20]">photo_camera</span>
                      <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#151d19]">
                        Computer Vision Geometric Alignment
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d7e8c3] text-[#1b5e20] text-[11px] font-['Plus_Jakarta_Sans'] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>{selectedDocket.homographyConfidence} Homography Confidence</span>
                    </span>
                  </div>

                  {/* DUAL BEFORE / AFTER IMAGE CANVAS WITH HOMOGRAPHY ANCHORS */}
                  <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-[#d2e7d3]">
                    {/* Two Photos Grid */}
                    <div className="grid grid-cols-2 w-full h-64 sm:h-72">
                      {/* Left Photo: Before Fix */}
                      <div className="relative w-full h-full border-r border-white/20 overflow-hidden">
                        <img
                          src={selectedDocket.beforeImage}
                          alt="Before Fix"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-['Plus_Jakarta_Sans'] font-bold">
                          Before Fix
                        </span>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2.5 flex flex-col text-white">
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[11px]">
                            Citizen Initial Report
                          </span>
                          <span className="text-[10px] text-white/80">
                            {selectedDocket.reportedTime} • {selectedDocket.depth}
                          </span>
                        </div>
                      </div>

                      {/* Right Photo: After Repair */}
                      <div className="relative w-full h-full overflow-hidden">
                        <img
                          src={selectedDocket.afterImage}
                          alt="After Repair"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-[#1b5e20] text-white text-[10px] font-['Plus_Jakarta_Sans'] font-bold">
                          After Repair
                        </span>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2.5 flex flex-col text-white">
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[11px]">
                            Contractor Repair Proof
                          </span>
                          <span className="text-[10px] text-white/80">
                            {selectedDocket.repairedTime} • {selectedDocket.repairType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Center Top Badge: 3/3 Anchors Locked */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#1b5e20]/90 backdrop-blur-md text-white text-[10px] font-['Plus_Jakarta_Sans'] font-bold flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a3f69c] animate-ping"></span>
                      <span>{selectedDocket.anchorsLocked}</span>
                    </div>

                    {/* Canvas Overlay for Dotted Lines */}
                    <canvas
                      ref={canvasRef}
                      width={680}
                      height={288}
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    />
                  </div>

                  {/* 4 Sensor Telemetry Breakdown Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedDocket.telemetry.map((tel, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#eef7ee] text-[#1b5e20] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[16px]">{tel.icon}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] text-[#151d19]">
                              {tel.name}
                            </span>
                            <span className="text-[11px] text-[#6f7e73] leading-tight">
                              {tel.detail}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-['Plus_Jakarta_Sans'] font-bold ${
                            tel.status === 'Pass'
                              ? 'bg-[#d7e8c3] text-[#1b5e20]'
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}
                        >
                          {tel.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Cryptographic SHA-256 Merkle Banner */}
                  <div className="p-3.5 rounded-xl bg-[#f0f6f1] border border-[#d2e7d3] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#1b5e20] text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] text-[#151d19]">
                            Audit Trail Immutable & Validated
                          </span>
                          <span className="material-symbols-outlined text-[15px] text-[#1b5e20]">
                            verified
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[#6f7e73] truncate">
                          SHA-256: {selectedDocket.hash}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleVerifyChain}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#e0ece2] border border-[#c3d9c5] text-[#1b5e20] font-['Plus_Jakarta_Sans'] text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <span>Inspect Merkle Block</span>
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </button>
                  </div>

                  {/* Inspector Sign-off Dropdown & Actions */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45]">
                        Inspector Sign-off Finding / Justification
                      </label>
                      <select className="w-full px-3 py-2.5 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] text-[13px] font-['Plus_Jakarta_Sans'] text-[#151d19] focus:outline-none">
                        <option>Work fully compliant with municipal road standard SPEC-2024</option>
                        <option>Satisfactory patch with minor edge seam variance (acceptable)</option>
                        <option>Requires thermal re-smoothing on northern seam</option>
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        onClick={handleApprove}
                        className="w-full py-3 rounded-full bg-[#1b5e20] hover:bg-[#256e2b] text-white font-['Plus_Jakarta_Sans'] text-[14px] font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Approve Repair & Authorize Payout</span>
                      </button>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={handleRework}
                          className="px-4 py-2 rounded-xl bg-[#eef7ee] hover:bg-[#d7e8c3] text-[#1b5e20] font-['Plus_Jakarta_Sans'] text-[12px] font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">replay</span>
                          <span>Request Rework</span>
                        </button>

                        <button
                          onClick={handleRejectClaim}
                          className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#ba1a1a] hover:underline cursor-pointer"
                        >
                          Reject Claim
                        </button>
                      </div>

                      {/* Keyboard shortcut hint */}
                      <div className="flex items-center justify-between text-[10px] text-[#6f7e73] pt-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">keyboard</span>
                          <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-[#d2e7d3] rounded font-mono font-bold">A</kbd> to quick-approve, <kbd className="px-1.5 py-0.5 bg-white border border-[#d2e7d3] rounded font-mono font-bold">R</kbd> to request rework</span>
                        </span>
                        <span className="font-semibold text-[#1b5e20]">Auto-seal upon sign-off</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* TAB 2: WARD HEATMAP ANALYTICS */}
        {activeTab === 'ward-heatmap' && (
          <main className="p-6 flex flex-col gap-6">
            {/* Top Breadcrumbs & Filter Bar */}
            <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Hierarchy Breadcrumb dropdowns */}
                <div className="flex flex-wrap items-center gap-2 text-[12px] font-['Plus_Jakarta_Sans'] font-bold">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#f0f6f1] border border-[#e0ece2] text-[#151d19]">
                    <span className="material-symbols-outlined text-[16px] text-[#1b5e20]">apartment</span>
                    <span>Ward 14 (Maplewood West)</span>
                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                  </div>
                  <span className="text-[#6f7e73]">›</span>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#f0f6f1] border border-[#e0ece2] text-[#151d19]">
                    <span>Zone B (Residential Corridors)</span>
                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                  </div>
                  <span className="text-[#6f7e73]">›</span>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#f0f6f1] border border-[#e0ece2] text-[#151d19]">
                    <span>Division 3 (Arterials)</span>
                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                  </div>
                  <span className="text-[#6f7e73]">›</span>
                  <div className="px-3 py-1.5 rounded-xl bg-[#1b5e20] text-white">
                    <span>● Beat 12 (Elm & Pine Precinct)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-[#6f7e73] uppercase">
                    Telemetry Sync: 2m ago
                  </span>
                  <button className="px-3 py-1.5 rounded-xl bg-[#eef7ee] hover:bg-[#d7e8c3] text-[#1b5e20] text-[12px] font-['Plus_Jakarta_Sans'] font-bold flex items-center gap-1.5 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">file_download</span>
                    <span>Export GeoJSON & PDF</span>
                  </button>
                </div>
              </div>

              {/* Time and Defect Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#f0f4f0]">
                {/* Time Range Tabs */}
                <div className="flex items-center bg-[#f0f6f1] p-1 rounded-xl">
                  {['Last 7 Days', 'Last 30 Days', 'Q3 2024', 'Custom Range'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-['Plus_Jakarta_Sans'] font-bold transition-all ${
                        timeRange === range || (timeRange === '30d' && range === 'Last 30 Days')
                          ? 'bg-white text-[#1b5e20] shadow-xs'
                          : 'text-[#414d45] hover:text-[#151d19]'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>

                {/* Defect Type Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-['Plus_Jakarta_Sans'] font-bold">
                  <span className="text-[#6f7e73] text-[11px] pr-1">Defects:</span>
                  <button
                    onClick={() => setDefectFilter('potholes')}
                    className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                      defectFilter === 'potholes'
                        ? 'bg-[#1b5e20] text-white'
                        : 'bg-[#f0f6f1] text-[#414d45]'
                    }`}
                  >
                    <span>●</span>
                    <span>Deep Potholes</span>
                    <span className="px-1.5 rounded bg-black/20 text-[10px]">112</span>
                  </button>
                  <button
                    onClick={() => setDefectFilter('shoulders')}
                    className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                      defectFilter === 'shoulders'
                        ? 'bg-[#1b5e20] text-white'
                        : 'bg-[#f0f6f1] text-[#414d45]'
                    }`}
                  >
                    <span>Crumbling Shoulders</span>
                    <span className="px-1.5 rounded bg-black/10 text-[10px]">34</span>
                  </button>
                  <button
                    onClick={() => setDefectFilter('manhole')}
                    className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                      defectFilter === 'manhole'
                        ? 'bg-[#1b5e20] text-white'
                        : 'bg-[#f0f6f1] text-[#414d45]'
                    }`}
                  >
                    <span>Manhole Rims</span>
                    <span className="px-1.5 rounded bg-black/10 text-[10px]">23</span>
                  </button>
                  <button
                    onClick={() => setDefectFilter('heaves')}
                    className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                      defectFilter === 'heaves'
                        ? 'bg-[#1b5e20] text-white'
                        : 'bg-[#f0f6f1] text-[#414d45]'
                    }`}
                  >
                    <span>Frost Heaves</span>
                    <span className="px-1.5 rounded bg-black/10 text-[10px]">15</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Hazard KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Hazard KPI 1 */}
              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#6f7e73] tracking-wider uppercase">
                    Active Road Hazards
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#fff4cc] text-[#8a6500] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#151d19]">
                    184
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0f4f0] text-[11px]">
                  <span className="text-[#1b5e20] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">trending_down</span>
                    <span>14% vs last mo</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f0f6f1] text-[#6f7e73] font-bold">
                    3.8 / km²
                  </span>
                </div>
              </div>

              {/* Hazard KPI 2 */}
              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#ba1a1a] tracking-wider uppercase">
                    Critical SLA Breach Risk
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">notification_important</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#ba1a1a]">
                    6
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0f4f0] text-[11px]">
                  <span className="text-[#6f7e73]">Exceeds 48h limit</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-bold">
                    Immediate Dispatch
                  </span>
                </div>
              </div>

              {/* Hazard KPI 3 */}
              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#6f7e73] tracking-wider uppercase">
                    Median Fix Resolution
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#eef7ee] text-[#1b5e20] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#151d19]">
                    34.2 <span className="text-[20px] font-bold">hrs</span>
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0f4f0] text-[11px]">
                  <span className="text-[#6f7e73]">Benchmark: &lt; 40.0 hrs</span>
                  <span className="text-[#1b5e20] font-bold"><span className="material-symbols-outlined text-[14px] inline mr-1 text-[#1b5e20]">check_circle</span>On Track</span>
                </div>
              </div>

              {/* Hazard KPI 4 */}
              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#6f7e73] tracking-wider uppercase">
                    Repeat Hotspots
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#f0f6f1] text-[#414d45] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#151d19]">
                    11
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0f4f0] text-[11px]">
                  <span className="text-[#6f7e73]">&gt;2 fixes in 90 days</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#fff4cc] text-[#8a6500] font-bold">
                    Review Alert
                  </span>
                </div>
              </div>
            </div>

            {/* Main Split Analytics Grid: Left Map + Charts (8 cols), Right Scorecards (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* GIS Heatmap Map Canvas Card */}
                <div className="p-5 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1b5e20]"></span>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#151d19]">
                        GIS Street Layer: Ward 14 Grid
                      </h3>
                      <span className="font-mono text-[11px] text-[#6f7e73]">EPSG: 3857</span>
                    </div>

                    {/* Map Layers */}
                    <div className="flex items-center bg-[#f0f6f1] p-0.5 rounded-xl text-[11px] font-['Plus_Jakarta_Sans'] font-bold">
                      <button
                        onClick={() => setMapLayer('heatmap')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          mapLayer === 'heatmap' ? 'bg-[#1b5e20] text-white shadow-xs' : 'text-[#414d45]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] inline mr-1">local_fire_department</span>Heatmap
                      </button>
                      <button
                        onClick={() => setMapLayer('territories')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          mapLayer === 'territories' ? 'bg-[#1b5e20] text-white shadow-xs' : 'text-[#414d45]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] inline mr-1">map</span>Territories
                      </button>
                      <button
                        onClick={() => setMapLayer('historical')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          mapLayer === 'historical' ? 'bg-[#1b5e20] text-white shadow-xs' : 'text-[#414d45]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] inline mr-1">history</span>Historical
                      </button>
                    </div>
                  </div>

                  {/* STYLIZED ROAD NETWORK & HEATMAP CANVAS */}
                  <div className="relative w-full h-96 rounded-2xl bg-[#eaf4ec] border border-[#d2e7d3] overflow-hidden flex items-center justify-center">
                    {/* SVG Street Grid lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                      <line x1="80" y1="0" x2="80" y2="400" stroke="#ffffff" strokeWidth="18" />
                      <line x1="200" y1="0" x2="200" y2="400" stroke="#ffffff" strokeWidth="22" />
                      <line x1="360" y1="0" x2="360" y2="400" stroke="#ffffff" strokeWidth="28" strokeDasharray="6 3" />
                      <line x1="520" y1="0" x2="520" y2="400" stroke="#ffffff" strokeWidth="18" />
                      <line x1="0" y1="90" x2="800" y2="90" stroke="#ffffff" strokeWidth="18" />
                      <line x1="0" y1="200" x2="800" y2="200" stroke="#ffffff" strokeWidth="24" />
                      <line x1="0" y1="310" x2="800" y2="310" stroke="#ffffff" strokeWidth="18" strokeDasharray="6 3" />
                    </svg>

                    {/* Heat Glowing Gradient Blobs */}
                    <div className="absolute top-28 left-[330px] w-36 h-48 rounded-full bg-red-500/35 blur-2xl pointer-events-none animate-pulse"></div>
                    <div className="absolute top-16 left-[180px] w-28 h-28 rounded-full bg-amber-400/25 blur-xl pointer-events-none"></div>
                    <div className="absolute bottom-12 left-[480px] w-32 h-32 rounded-full bg-emerald-400/30 blur-2xl pointer-events-none"></div>

                    {/* Street Labels */}
                    <span className="absolute top-1/2 left-[370px] -rotate-90 text-[10px] font-mono tracking-widest text-[#738876] font-bold">
                      OAK RIDGE AVE
                    </span>

                    {/* Hotspot Pin on the Map */}
                    <div className="absolute top-36 left-[350px] z-10 w-7 h-7 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center font-bold text-[12px] shadow-lg ring-4 ring-red-300/60 animate-bounce">
                      !
                    </div>

                    {/* Green Fix Pin */}
                    <div className="absolute bottom-28 left-[280px] z-10 w-6 h-6 rounded-full bg-[#1b5e20] text-white flex items-center justify-center font-bold text-[11px] shadow-md ring-2 ring-emerald-200">
                      
                    </div>

                    {/* INTERACTIVE HOTSPOT POPUP DIALOG (Elm Street Corridor) */}
                    {selectedHotspot && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 w-84 bg-white/95 backdrop-blur-md rounded-2xl border border-[#d2e7d3] p-4 shadow-xl flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
                            <h4 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[14px] text-[#151d19]">
                              Elm Street Corridor
                            </h4>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-['Plus_Jakarta_Sans'] font-extrabold">
                            Beat 12 Hotspot
                          </span>
                        </div>

                        <p className="text-[11px] text-[#6f7e73] leading-relaxed">
                          Critical wear corridor between 4th Ave & Lakeview. Elevated heavy freight deflection.
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#f0f4f0] text-[11px]">
                          <div>
                            <span className="text-[#6f7e73] block text-[10px]">Pothole Count</span>
                            <span className="font-bold text-[#151d19]">14 Active</span>
                          </div>
                          <div>
                            <span className="text-[#6f7e73] block text-[10px]">Rework Notices</span>
                            <span className="font-bold text-[#ba1a1a]">2 Issued</span>
                          </div>
                          <div>
                            <span className="text-[#6f7e73] block text-[10px]">Asphalt Age</span>
                            <span className="font-bold text-[#151d19]">12.4 Yrs</span>
                          </div>
                          <div>
                            <span className="text-[#6f7e73] block text-[10px]">Est. Fix Cost</span>
                            <span className="font-bold text-[#1b5e20]">$4,850</span>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex flex-col gap-0.5 text-[10px]">
                          <span className="font-bold text-[#151d19] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-[#1b5e20]">construction</span>
                            <span>Engineering Recommendation</span>
                          </span>
                          <span className="text-[#6f7e73]">
                            Milling & 2-inch bitumen overlay recommended. Patch-work no longer cost-effective.
                          </span>
                        </div>

                        <button className="w-full py-2 rounded-xl bg-[#1b5e20] hover:bg-[#256e2b] text-white font-['Plus_Jakarta_Sans'] text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all">
                          <span>Dispatch Overlay Crew</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    )}

                    {/* Bottom Map Legend & Zoom controls */}
                    <div className="absolute bottom-3 left-3 z-20 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-[#d2e7d3] flex items-center gap-3 text-[11px] font-bold text-[#414d45]">
                      <span>Density:</span>
                      <span className="flex items-center gap-1 text-[#1b5e20]">
                        <span className="w-2 h-2 rounded-full bg-[#1b5e20]"></span> Low
                      </span>
                      <span className="flex items-center gap-1 text-[#8a6500]">
                        <span className="w-2 h-2 rounded-full bg-[#8a6500]"></span> Med
                      </span>
                      <span className="flex items-center gap-1 text-[#ba1a1a]">
                        <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span> Severe
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-[#d2e7d3] text-[11px] font-bold text-[#414d45]">
                      <button className="w-7 h-7 rounded-lg hover:bg-[#f0f6f1] flex items-center justify-center">+</button>
                      <button className="w-7 h-7 rounded-lg hover:bg-[#f0f6f1] flex items-center justify-center">-</button>
                      <button className="px-2 h-7 rounded-lg hover:bg-[#f0f6f1] flex items-center justify-center">3D Tilt</button>
                      <button className="w-7 h-7 rounded-lg hover:bg-[#f0f6f1] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">my_location</span>
                      </button>
                    </div>
                  </div>

                  {/* 3 Telemetry Data cards below map */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#eef7ee] text-[#1b5e20] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#6f7e73] font-semibold">Imagery Baseline</span>
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] text-[#151d19]">
                          Maplewood Drone Survey (Aug 2024)
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#eef7ee] text-[#1b5e20] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">sensors</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#6f7e73] font-semibold">Bus Accelerometer Data</span>
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] text-[#151d19]">
                          Line 12 & 44 Telemetry Synced
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#eef7ee] text-[#1b5e20] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">local_police</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#6f7e73] font-semibold">Patrol Verification</span>
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] text-[#151d19]">
                          Crew 4 Active on Lakeview
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Surface Roughness Index (IRI) Bar Chart */}
                <div className="p-5 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#1b5e20]">equalizer</span>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#151d19]">
                        Ward 14 Arterial Surface Roughness Index (IRI)
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#6f7e73]">
                      International Roughness Index (m/km)
                    </span>
                  </div>

                  {/* Bar Chart Bars */}
                  <div className="grid grid-cols-6 gap-3 items-end h-44 pt-4 px-2 border-b border-[#e0ece2]">
                    {/* Elm St: 4.6 (Red, severe) */}
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[11px] font-bold text-[#ba1a1a]">4.6</span>
                      <div className="w-full bg-[#ba1a1a] rounded-t-lg" style={{ height: '90%' }}></div>
                      <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] truncate w-full text-center">
                        Elm St
                      </span>
                    </div>

                    {/* Pine Crest: 3.1 (Muted) */}
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[11px] font-bold text-[#7a887d]">3.1</span>
                      <div className="w-full bg-[#a8bba9] rounded-t-lg" style={{ height: '62%' }}></div>
                      <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] truncate w-full text-center">
                        Pine Crest
                      </span>
                    </div>

                    {/* Lakeview: 1.8 (Good) */}
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[11px] font-bold text-[#1b5e20]">1.8</span>
                      <div className="w-full bg-[#99e2a4] rounded-t-lg" style={{ height: '36%' }}></div>
                      <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] truncate w-full text-center">
                        Lakeview
                      </span>
                    </div>

                    {/* Oak Ridge: 2.2 (Medium) */}
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[11px] font-bold text-[#1b5e20]">2.2</span>
                      <div className="w-full bg-[#72c781] rounded-t-lg" style={{ height: '44%' }}></div>
                      <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] truncate w-full text-center">
                        Oak Ridge
                      </span>
                    </div>

                    {/* Maplewood: 1.2 (Excellent) */}
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[11px] font-bold text-[#1b5e20]">1.2</span>
                      <div className="w-full bg-[#1b5e20] rounded-t-lg" style={{ height: '24%' }}></div>
                      <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] truncate w-full text-center">
                        Maplewood
                      </span>
                    </div>

                    {/* 8th Precinct: 2.9 (Muted) */}
                    <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[11px] font-bold text-[#7a887d]">2.9</span>
                      <div className="w-full bg-[#d2e2d3] rounded-t-lg" style={{ height: '58%' }}></div>
                      <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] truncate w-full text-center">
                        8th Precinct
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {/* 1. Beat SLA Performance */}
                <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#151d19]">
                      Beat SLA Performance
                    </h3>
                    <span className="text-[11px] font-bold text-[#1b5e20]">Ward 14: 92.4%</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-[#151d19]">Beat 12 (Elm Corridor)</span>
                        <span className="font-bold text-[#ba1a1a]">78.2% (Behind)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#ffdad6] overflow-hidden">
                        <div className="h-full bg-[#ba1a1a] rounded-full" style={{ width: '78.2%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-[#151d19]">Beat 11 (North Hills)</span>
                        <span className="font-bold text-[#1b5e20]">98.1%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#eef7ee] overflow-hidden">
                        <div className="h-full bg-[#1b5e20] rounded-full" style={{ width: '98.1%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-[#151d19]">Beat 13 (Maple Gardens)</span>
                        <span className="font-bold text-[#1b5e20]">95.0%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#eef7ee] overflow-hidden">
                        <div className="h-full bg-[#1b5e20] rounded-full" style={{ width: '95.0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Contractor Scorecard */}
                <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px] text-[#1b5e20]">engineering</span>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#151d19]">
                        Contractor Scorecard
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-[#6f7e73]">Ward 14 Active</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Contractor 1: Apex Paving */}
                    <div className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#1b5e20] text-white flex items-center justify-center font-bold text-[11px]">
                            A
                          </div>
                          <div>
                            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] text-[#151d19] block leading-tight">
                              Apex Paving Ltd.
                            </span>
                            <span className="text-[10px] text-[#6f7e73]">42 repairs completed</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#d7e8c3] text-[#1b5e20] text-[10px] font-bold">
                          Grade A
                        </span>
                      </div>
                      <div className="grid grid-cols-3 text-center pt-1 border-t border-[#f0f4f0] text-[10px]">
                        <div>
                          <span className="text-[#6f7e73] block">On-Time</span>
                          <span className="font-bold text-[#1b5e20]">96.8%</span>
                        </div>
                        <div>
                          <span className="text-[#6f7e73] block">Failure</span>
                          <span className="font-bold text-[#151d19]">0.8%</span>
                        </div>
                        <div>
                          <span className="text-[#6f7e73] block">Avg Turn</span>
                          <span className="font-bold text-[#151d19]">22 hrs</span>
                        </div>
                      </div>
                    </div>

                    {/* Contractor 2: NorthStar Infra */}
                    <div className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#3d7a46] text-white flex items-center justify-center font-bold text-[11px]">
                            B+
                          </div>
                          <div>
                            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] text-[#151d19] block leading-tight">
                              NorthStar Infra
                            </span>
                            <span className="text-[10px] text-[#6f7e73]">31 repairs completed</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#eef7ee] text-[#1b5e20] text-[10px] font-bold">
                          Grade B+
                        </span>
                      </div>
                      <div className="grid grid-cols-3 text-center pt-1 border-t border-[#f0f4f0] text-[10px]">
                        <div>
                          <span className="text-[#6f7e73] block">On-Time</span>
                          <span className="font-bold text-[#1b5e20]">89.2%</span>
                        </div>
                        <div>
                          <span className="text-[#6f7e73] block">Failure</span>
                          <span className="font-bold text-[#ba1a1a]">3.2%</span>
                        </div>
                        <div>
                          <span className="text-[#6f7e73] block">Avg Turn</span>
                          <span className="font-bold text-[#151d19]">36 hrs</span>
                        </div>
                      </div>
                    </div>

                    {/* Contractor 3: QuickPatch Co. */}
                    <div className="p-3 rounded-xl bg-[#fff8f7] border border-[#ffdad6] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center font-bold text-[11px]">
                            C
                          </div>
                          <div>
                            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] text-[#151d19] block leading-tight">
                              QuickPatch Co. <span className="material-symbols-outlined text-[13px] inline text-amber-600">flag</span>
                            </span>
                            <span className="text-[10px] text-[#ba1a1a] font-bold">Flagged for Audit</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">
                          Grade C
                        </span>
                      </div>
                      <div className="grid grid-cols-3 text-center pt-1 border-t border-[#fce4e4] text-[10px]">
                        <div>
                          <span className="text-[#6f7e73] block">On-Time</span>
                          <span className="font-bold text-[#ba1a1a]">74.5%</span>
                        </div>
                        <div>
                          <span className="text-[#6f7e73] block">Repeat Fail</span>
                          <span className="font-bold text-[#ba1a1a]">8.1%</span>
                        </div>
                        <div>
                          <span className="text-[#6f7e73] block">Avg Turn</span>
                          <span className="font-bold text-[#151d19]">47 hrs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Chronic Wear Hotspots */}
                <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px] text-[#ba1a1a]">pin_drop</span>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-[#151d19]">
                        Chronic Wear Hotspots
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-[#ba1a1a]">11 Total</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div className="p-3 rounded-xl bg-[#fff8f7] border border-[#ffdad6] flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] text-[#151d19]">
                          342–380 Elm Street
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">
                          3 Reports in 60d
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6f7e73] leading-relaxed">
                        Sub-base water erosion suspected beneath east lane storm runoff inlet.
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-[#fce4e4] text-[10px]">
                        <span className="text-[#6f7e73]">Last Patched: Oct 12 by QuickPatch</span>
                        <button className="font-bold text-[#1b5e20] hover:underline">
                          Order Core Sample
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#fffbf2] border border-[#ffe0b2] flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-[12px] text-[#151d19]">
                          Oak Ridge & 4th Intersection
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#fff3e0] text-[#e65100] text-[10px] font-bold">
                          2 Reports in 45d
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6f7e73] leading-relaxed">
                        Sunken manhole recurring displacement caused by heavy municipal bus turning radius.
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-[#ffe8cc] text-[10px]">
                        <span className="text-[#6f7e73]">Last Patched: Oct 29 by NorthStar</span>
                        <button className="font-bold text-[#1b5e20] hover:underline">
                          Adjust Casting
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* TAB 3: CONTRACTOR SCORECARDS */}
        {activeTab === 'contractor-scorecards' && (
          <main className="p-6 flex flex-col gap-6">
            {/* Executive Performance Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#1b5e20]">groups</span>
                  <span>Active Certified Contractors</span>
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#151d19]">{contractorsList.length}</span>
                  <span className="text-[12px] text-[#6f7e73]">authorized vendors</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[11px] font-bold text-[#1b5e20]">
                  <span className="w-2 h-2 rounded-full bg-[#1b5e20]"></span>
                  <span>3 Tier-1 • 1 Under Audit</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#1b5e20]">speed</span>
                  <span>Mean SLA Compliance</span>
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#1b5e20]">94.2%</span>
                  <span className="text-[12px] text-[#6f7e73]">across all 6 wards</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#e0ece2] mt-2 overflow-hidden">
                  <div className="h-full bg-[#1b5e20] rounded-full" style={{ width: '94.2%' }}></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#1b5e20]">account_balance_wallet</span>
                  <span>Municipal Escrow Reserved</span>
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#151d19]">₹54.5L</span>
                  <span className="text-[12px] text-[#6f7e73]">smart contract backed</span>
                </div>
                <span className="text-[11px] text-[#6f7e73] mt-2">Disbursed on Homography proof</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col justify-between">
                <span className="text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#414d45] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">gavel</span>
                  <span>Section 12-B Penalties</span>
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-[32px] font-extrabold font-['Plus_Jakarta_Sans'] text-[#ba1a1a]">₹1,80,000</span>
                  <span className="text-[12px] text-[#6f7e73]">clawed back</span>
                </div>
                <span className="text-[11px] text-[#ba1a1a] font-bold mt-2">Deducted from escrow balances</span>
              </div>
            </div>

            {/* Top Performer Showcase: Rajesh Shinde */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#eef7ee] to-white border border-[#c3d9c5] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src="/rajesh_shinde.jpg"
                    alt="Rajesh Shinde"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80";
                    }}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#1b5e20] shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#1b5e20] text-white text-[9px] font-extrabold">
                    #1 RANK
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[17px] text-[#151d19]">
                      Rajesh Shinde • Apex Paving Ltd.
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#d7e8c3] text-[#1b5e20] text-[10px] font-bold">
                      Tier 1 Verified
                    </span>
                  </div>
                  <p className="text-[12px] text-[#414d45] mt-0.5">
                    Chief Civil Contractor for Ward 14 (Maplewood) • 142 Verified Road Repairs • 98.4% First-Pass Homography Accuracy
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] font-bold text-[#6f7e73]">
                    <span className="text-[#1b5e20] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      Zero Disputed Submissions in 90 Days
                    </span>
                    <span>•</span>
                    <span>Avg Turnaround: 14.2 hrs (SLA: 24h)</span>
                    <span>•</span>
                    <span>Contact: +91 98334 10294</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleAuthorizePayout(contractorsList[0])}
                  className="px-4 py-2.5 rounded-xl bg-[#1b5e20] hover:bg-[#256e2b] text-white text-[12px] font-['Plus_Jakarta_Sans'] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  <span>Authorize Escrow Payout</span>
                </button>
                <button
                  onClick={() => setInspectContractor(contractorsList[0])}
                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#f0f6f1] border border-[#c3d9c5] text-[#1b5e20] text-[12px] font-['Plus_Jakarta_Sans'] font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                  <span>View Dossier</span>
                </button>
              </div>
            </div>

            {/* Master Contractor Leaderboard Table */}
            <div className="p-5 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#151d19]">
                    Contractor Performance & Escrow Registry
                  </h3>
                  <p className="text-[12px] text-[#6f7e73]">
                    Rankings automatically recalculated from computer vision verification rates and GPS on-time compliance.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBatchModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#eef7ee] hover:bg-[#d7e8c3] text-[#1b5e20] font-['Plus_Jakarta_Sans'] text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    <span>Assign Work Order Batch</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr className="border-b border-[#e0ece2] text-[#6f7e73] font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Contractor & Crew Lead</th>
                      <th className="py-3 px-3">Tier Status</th>
                      <th className="py-3 px-3 text-center">Repairs Done</th>
                      <th className="py-3 px-3 text-center">First-Pass Match</th>
                      <th className="py-3 px-3 text-center">SLA Compliance</th>
                      <th className="py-3 px-3 text-right">Escrow Payout</th>
                      <th className="py-3 px-3 text-right">Penalties</th>
                      <th className="py-3 px-3 text-center">Standing</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f0]">
                    {contractorsList.map((c) => (
                      <tr key={c.id} className="hover:bg-[#f8fbf8] transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={c.avatar}
                              alt={c.lead}
                              onError={(e) => {
                                e.target.src = "/rajesh_shinde.jpg";
                              }}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#e0ece2]"
                            />
                            <div className="flex flex-col">
                              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] text-[#151d19]">
                                {c.name}
                              </span>
                              <span className="text-[11px] text-[#6f7e73]">
                                {c.lead} • {c.ward}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#f0f6f1] text-[#1b5e20] font-bold text-[10px]">
                            {c.tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-[#151d19]">
                          {c.completed}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`font-bold ${c.firstPassRate >= 90 ? 'text-[#1b5e20]' : 'text-[#ba1a1a]'}`}>
                            {c.firstPassRate}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`font-bold ${c.slaRate >= 90 ? 'text-[#1b5e20]' : 'text-[#ba1a1a]'}`}>
                              {c.slaRate}%
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-[#e0ece2] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${c.slaRate >= 90 ? 'bg-[#1b5e20]' : 'bg-[#ba1a1a]'}`}
                                style={{ width: `${c.slaRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-[#151d19]">
                          {c.payoutTotal}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-[#ba1a1a]">
                          {c.penalties}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.statusType === 'good'
                              ? 'bg-[#d7e8c3] text-[#1b5e20]'
                              : c.statusType === 'warning'
                              ? 'bg-[#fff4cc] text-[#8a6500]'
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleAuthorizePayout(c)}
                              className="p-1.5 rounded-lg bg-[#eef7ee] hover:bg-[#d7e8c3] text-[#1b5e20] transition-colors"
                              title="Authorize Payout"
                            >
                              <span className="material-symbols-outlined text-[16px]">payments</span>
                            </button>
                            <button
                              onClick={() => handleIssueWarning(c)}
                              className="p-1.5 rounded-lg bg-[#fff0f0] hover:bg-[#ffdad6] text-[#ba1a1a] transition-colors"
                              title="Issue SLA Warning & Penalty"
                            >
                              <span className="material-symbols-outlined text-[16px]">warning</span>
                            </button>
                            <button
                              onClick={() => setInspectContractor(c)}
                              className="p-1.5 rounded-lg bg-[#f0f6f1] hover:bg-[#e0ece2] text-[#414d45] transition-colors"
                              title="View Profile Dossier"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* TAB 4: CONTRACTOR ID & BATCH DISPATCH */}
        {activeTab === 'contractor-batches' && (
          <main className="p-6 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[22px] text-[#151d19]">
                  Contractor Work Order Batches & Crew Badges
                </h2>
                <p className="text-[12px] text-[#6f7e73]">
                  Geofenced work-order batches cryptographically assigned to contractor crews with SLA tracking.
                </p>
              </div>

              <button
                onClick={() => setShowBatchModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#1b5e20] hover:bg-[#256e2b] text-white font-['Plus_Jakarta_Sans'] text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">add_task</span>
                <span>Create & Dispatch Work Order Batch</span>
              </button>
            </div>

            {/* Active Batches Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {contractorBatches.map((batch) => {
                const percent = Math.round((batch.completed / batch.count) * 100);
                const isOverdue = batch.status.includes('Overdue');
                return (
                  <div
                    key={batch.id}
                    className={`p-5 rounded-2xl bg-white border flex flex-col justify-between shadow-xs transition-all ${
                      isOverdue ? 'border-[#ffdad6] ring-1 ring-[#ffdad6]' : 'border-[#e0ece2] hover:border-[#b6ccb9]'
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[12px] font-bold text-[#1b5e20] bg-[#eef7ee] px-2.5 py-1 rounded-lg">
                          {batch.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          batch.priority === 'CRITICAL'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : 'bg-[#eef7ee] text-[#1b5e20]'
                        }`}>
                          {batch.priority}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#151d19]">
                          {batch.contractor}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#6f7e73] mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                          <span>{batch.ward}</span>
                          <span>•</span>
                          <span>{batch.crew}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#6f7e73]">Batch Progress</span>
                          <span className="font-bold text-[#151d19]">{batch.completed} of {batch.count} Patched ({percent}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#e0ece2] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isOverdue ? 'bg-[#ba1a1a]' : 'bg-[#1b5e20]'}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="flex flex-col">
                          <span className="text-[#6f7e73]">SLA Window</span>
                          <span className={`font-bold ${isOverdue ? 'text-[#ba1a1a]' : 'text-[#1b5e20]'}`}>
                            {batch.slaRemaining}
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[#6f7e73]">Escrow Budget</span>
                          <span className="font-bold text-[#151d19]">{batch.budget}</span>
                        </div>
                      </div>

                      {/* Digital Crew ID Badge Preview */}
                      <div className="mt-2 p-2.5 rounded-xl bg-[#f4f8f4] border border-[#d2e7d3] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white border border-[#b6ccb9] flex items-center justify-center text-[#1b5e20]">
                            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#151d19]">
                              Crew Dispatch QR
                            </span>
                            <span className="text-[10px] text-[#6f7e73] font-mono truncate max-w-[120px]">
                              {batch.hash}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-[#c3d9c5] text-[#1b5e20] text-[10px] font-bold">
                          Geo-Locked
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#f0f4f0] flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        batch.status === 'Ready for Sign-off'
                          ? 'bg-[#d7e8c3] text-[#1b5e20]'
                          : isOverdue
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#f0f6f1] text-[#414d45]'
                      }`}>
                        {batch.status}
                      </span>

                      <button
                        onClick={() => {
                          setActionNotice({
                            type: 'approved',
                            msg: `Digital Crew QR badge generated for ${batch.contractor} (${batch.id}). Ready for on-site scanning.`
                          });
                        }}
                        className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#1b5e20] hover:underline flex items-center gap-0.5"
                      >
                        <span>Print QR Pass</span>
                        <span className="material-symbols-outlined text-[13px]">download</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        )}

        {/* TAB 5: AUDIT LEDGER (TAMPER-EVIDENT SHA-256) */}
        {activeTab === 'audit-ledger' && (
          <main className="p-6 flex flex-col gap-6 max-w-6xl">
            {/* Cryptographic Integrity Banner */}
            <div className="p-5 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#eef7ee] text-[#1b5e20] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">verified_user</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[18px] text-[#151d19]">
                      Tamper-Evident SHA-256 Cryptographic Audit Trail
                    </h3>
                    <p className="text-[12px] text-[#6f7e73]">
                      Every citizen report, computer vision homography alignment, contractor proof, and inspector sign-off is sealed into immutable blocks.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleVerifyChain}
                  disabled={isVerifyingChain}
                  className="px-4 py-2 rounded-xl bg-[#1b5e20] hover:bg-[#256e2b] text-white text-[12px] font-['Plus_Jakarta_Sans'] font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <span className={`material-symbols-outlined text-[16px] ${isVerifyingChain ? 'animate-spin' : ''}`}>
                    {isVerifyingChain ? 'sync' : 'gavel'}
                  </span>
                  <span>{isVerifyingChain ? 'Verifying Block Hashes...' : 'Cryptographic Merkle Audit'}</span>
                </button>
              </div>

              {chainVerified && (
                <div className="p-3.5 rounded-xl bg-[#d7e8c3] text-[#12230b] border border-[#a3f69c] font-bold text-[12px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#1b5e20]">verified</span>
                    <span>Zero Discrepancies Found Across {1425 + auditBlocks.length} Blocks. Current Root: 0x9a8f4c28...e71c</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#1b5e20]">Groth16 ZK-Proof OK</span>
                </div>
              )}

              {/* Filter Pills */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#f0f4f0] overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-['Plus_Jakarta_Sans'] font-bold text-[#6f7e73] mr-1">Event Type:</span>
                {['all', 'OFFICER_SIGN_OFF', 'AI_HOMOGRAPHY_MATCH', 'CONTRACTOR_PROOF_SUBMIT', 'CITIZEN_REPORT_SUBMIT'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setAuditFilter(type)}
                    className={`px-3 py-1 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-bold whitespace-nowrap transition-all ${
                      auditFilter === type
                        ? 'bg-[#1b5e20] text-white'
                        : 'bg-[#f0f6f1] text-[#414d45] hover:bg-[#e0ece2]'
                    }`}
                  >
                    {type === 'all' ? 'All Events' : type.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Blocks Timeline List */}
            <div className="flex flex-col gap-3">
              {auditBlocks
                .filter((b) => auditFilter === 'all' || b.event === auditFilter)
                .map((b) => (
                  <div
                    key={b.block}
                    onClick={() => setSelectedAuditBlock(b)}
                    className="p-4 rounded-2xl bg-white border border-[#e0ece2] hover:border-[#1b5e20] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f0f6f1] text-[#1b5e20] font-mono font-bold text-[12px] flex items-center justify-center shrink-0 group-hover:bg-[#1b5e20] group-hover:text-white transition-colors">
                        #{b.block}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] text-[#151d19]">
                            {b.event}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#eef7ee] text-[#1b5e20] text-[10px] font-extrabold">
                            {b.docket}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#d7e8c3] text-[#1b5e20] text-[10px] font-bold">
                            {b.zkp}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#6f7e73] mt-0.5">
                          Actor: <strong className="text-[#151d19]">{b.actor}</strong> • Timestamp: {b.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px] text-[#6f7e73] shrink-0">
                      <span className="bg-[#f8fbf8] px-2.5 py-1 rounded-lg border border-[#e0ece2] text-[#1b5e20] font-bold">
                        {b.hash.substring(0, 14)}...
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-[#7a887d] group-hover:text-[#1b5e20] group-hover:translate-x-0.5 transition-all">
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </main>
        )}

        {/* TAB 6: SETTINGS & SYSTEM CONFIGURATION */}
        {activeTab === 'settings' && (
          <main className="p-6 flex flex-col gap-6 max-w-4xl">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[22px] text-[#151d19]">
                Municipal Verification System Settings
              </h2>
              <p className="text-[12px] text-[#6f7e73]">
                Tune computer vision tolerance, SLA breach penalties, zero-knowledge proofs, and automated payout parameters.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-5">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#151d19] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#1b5e20]">tune</span>
                <span>Computer Vision & Alignment Thresholds</span>
              </h3>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between text-[12px] font-bold mb-1">
                    <span className="text-[#151d19]">Minimum Homography Match Confidence</span>
                    <span className="text-[#1b5e20]">{settingsState.aiThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="99"
                    value={settingsState.aiThreshold}
                    onChange={(e) => setSettingsState({ ...settingsState, aiThreshold: parseInt(e.target.value) })}
                    className="w-full accent-[#1b5e20]"
                  />
                  <span className="text-[11px] text-[#6f7e73]">
                    Submissions scoring below this threshold are automatically redirected to manual officer triage.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[12px] font-bold mb-1">
                    <span className="text-[#151d19]">Required Static SIFT / ORB Keypoints</span>
                    <span className="text-[#1b5e20]">{settingsState.minKeypoints} Fixed Anchors</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={settingsState.minKeypoints}
                    onChange={(e) => setSettingsState({ ...settingsState, minKeypoints: parseInt(e.target.value) })}
                    className="w-full accent-[#1b5e20]"
                  />
                  <span className="text-[11px] text-[#6f7e73]">
                    Number of background landmark anchors (manholes, curbs, paint markings) required for perspective correction.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[12px] font-bold mb-1">
                    <span className="text-[#151d19]">GPS Geofence Max Radius</span>
                    <span className="text-[#1b5e20]">{settingsState.geofenceRadius} meters</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={settingsState.geofenceRadius}
                    onChange={(e) => setSettingsState({ ...settingsState, geofenceRadius: parseInt(e.target.value) })}
                    className="w-full accent-[#1b5e20]"
                  />
                  <span className="text-[11px] text-[#6f7e73]">
                    Permissible distance between original citizen report coordinates and contractor repair photo GPS.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-5">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#151d19] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#1b5e20]">timer</span>
                <span>SLA Windows & Section 12-B Penalties</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#151d19]">Emergency Hazard SLA (Hours)</label>
                  <input
                    type="number"
                    value={settingsState.emergencySla}
                    onChange={(e) => setSettingsState({ ...settingsState, emergencySla: parseInt(e.target.value) || 6 })}
                    className="p-2.5 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] text-[13px] font-bold text-[#151d19] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#6f7e73]">Default 6 hours for severe arterial craters.</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#151d19]">Standard Pothole SLA (Hours)</label>
                  <input
                    type="number"
                    value={settingsState.standardSla}
                    onChange={(e) => setSettingsState({ ...settingsState, standardSla: parseInt(e.target.value) || 24 })}
                    className="p-2.5 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] text-[13px] font-bold text-[#151d19] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#6f7e73]">Default 24 hours for standard urban roads.</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-2 border-t border-[#f0f4f0]">
                <label className="text-[12px] font-bold text-[#151d19]">Section 12-B SLA Breach Penalty (₹)</label>
                <input
                  type="number"
                  value={settingsState.penaltyAmount}
                  onChange={(e) => setSettingsState({ ...settingsState, penaltyAmount: parseInt(e.target.value) || 15000 })}
                  className="p-2.5 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] text-[13px] font-bold text-[#ba1a1a] focus:outline-none"
                />
                <span className="text-[10px] text-[#6f7e73]">
                  Clawed back automatically from the contractor's locked escrow account upon overdue expiration.
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e0ece2] shadow-xs flex flex-col gap-4">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[15px] text-[#151d19] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#1b5e20]">security</span>
                <span>Security & Privacy Controls</span>
              </h3>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2]">
                <div className="flex flex-col">
                  <span className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] text-[#151d19]">
                    Auto-Seal SHA-256 Merkle Block on Officer Approval
                  </span>
                  <span className="text-[11px] text-[#6f7e73]">
                    Instantly appends verified sign-offs into the tamper-evident municipal audit ledger.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsState.autoSealMerkle}
                  onChange={(e) => setSettingsState({ ...settingsState, autoSealMerkle: e.target.checked })}
                  className="w-5 h-5 accent-[#1b5e20] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2]">
                <div className="flex flex-col">
                  <span className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] text-[#151d19]">
                    Automated Face & License Plate Blurring
                  </span>
                  <span className="text-[11px] text-[#6f7e73]">
                    Mask citizen faces and vehicle registration plates in evidence captures before storing.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsState.privacyMasking}
                  onChange={(e) => setSettingsState({ ...settingsState, privacyMasking: e.target.checked })}
                  className="w-5 h-5 accent-[#1b5e20] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setActionNotice({
                    type: 'approved',
                    msg: 'Municipal Settings Saved Successfully. All thresholds and SLA configurations synchronized across wards.'
                  });
                }}
                className="px-6 py-3 rounded-full bg-[#1b5e20] hover:bg-[#256e2b] text-white font-['Plus_Jakarta_Sans'] text-[13px] font-bold shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Save System Configuration</span>
              </button>
            </div>
          </main>
        )}

        {/* MODAL 1: CREATE WORK ORDER BATCH / CONTRACTOR ID */}
        {showBatchModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-[#e0ece2] animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-[#f0f4f0] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#eef7ee] text-[#1b5e20] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">add_task</span>
                  </div>
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#151d19]">
                      Create Work Order Batch & Dispatch Crew
                    </h3>
                    <p className="text-[11px] text-[#6f7e73]">Issue geofenced dispatch ID & digital badge</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBatchModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-[#f0f6f1] text-[#7a887d] flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateBatchSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#151d19]">Target Municipal Ward</label>
                  <select
                    value={batchForm.ward}
                    onChange={(e) => setBatchForm({ ...batchForm, ward: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] text-[13px] font-bold text-[#151d19] focus:outline-none"
                  >
                    <option>Ward 14 • Maplewood</option>
                    <option>Ward K/W • Andheri West</option>
                    <option>Ward A • Colaba</option>
                    <option>Ward G/N • Dadar</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#151d19]">Authorized Contractor</label>
                  <select
                    value={batchForm.contractor}
                    onChange={(e) => setBatchForm({ ...batchForm, contractor: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] text-[13px] font-bold text-[#151d19] focus:outline-none"
                  >
                    <option>Apex Paving Ltd. (Rajesh Shinde) - Tier 1</option>
                    <option>Heritage Paving Infra (Amit Patil) - Tier 1</option>
                    <option>Metro Asphalt Works (Vikram Deshmukh) - Tier 2</option>
                    <option>Mumbai Infra Roads (Sunil Jadhav) - Tier 3</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#151d19]">Pothole Defect Count</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={batchForm.count}
                      onChange={(e) => setBatchForm({ ...batchForm, count: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] text-[13px] font-bold text-[#151d19] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#151d19]">Priority Window</label>
                    <select
                      value={batchForm.priority}
                      onChange={(e) => setBatchForm({ ...batchForm, priority: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] text-[13px] font-bold text-[#151d19] focus:outline-none"
                    >
                      <option value="CRITICAL">CRITICAL (6h Emergency)</option>
                      <option value="HIGH">HIGH (12h Arterial)</option>
                      <option value="STANDARD">STANDARD (24h Window)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#151d19]">Escrow Budget Allocation</label>
                  <input
                    type="text"
                    value={batchForm.budget}
                    onChange={(e) => setBatchForm({ ...batchForm, budget: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] text-[13px] font-bold text-[#151d19] focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#eef7ee] border border-[#d2e7d3] flex items-center gap-2 text-[11px] text-[#1b5e20] font-bold">
                  <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                  <span>A cryptographic Merkle QR pass will be issued immediately to the contractor crew app.</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f4f0]">
                  <button
                    type="button"
                    onClick={() => setShowBatchModal(false)}
                    className="px-4 py-2 rounded-xl text-[12px] font-['Plus_Jakarta_Sans'] font-bold text-[#6f7e73] hover:bg-[#f0f6f1]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#1b5e20] hover:bg-[#256e2b] text-white text-[13px] font-['Plus_Jakarta_Sans'] font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Dispatch Batch & Issue Badge
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: CRYPTOGRAPHIC BLOCK INSPECTOR */}
        {selectedAuditBlock && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-[#e0ece2]">
              <div className="flex items-center justify-between border-b border-[#f0f4f0] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#eef7ee] text-[#1b5e20] flex items-center justify-center font-mono font-bold">
                    #{selectedAuditBlock.block}
                  </div>
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#151d19]">
                      Audit Block #{selectedAuditBlock.block} Inspection
                    </h3>
                    <span className="text-[11px] text-[#6f7e73] font-mono">Immutable Cryptographic Record</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAuditBlock(null)}
                  className="w-8 h-8 rounded-full hover:bg-[#f0f6f1] text-[#7a887d] flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-2.5 text-[12px]">
                <div className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex flex-col gap-1">
                  <span className="text-[10px] text-[#6f7e73] font-bold uppercase">SHA-256 Block Hash</span>
                  <span className="font-mono text-[11px] text-[#1b5e20] break-all font-bold">
                    {selectedAuditBlock.hash}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex flex-col">
                    <span className="text-[10px] text-[#6f7e73] font-bold uppercase">Event Type</span>
                    <span className="font-bold text-[#151d19]">{selectedAuditBlock.event}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex flex-col">
                    <span className="text-[10px] text-[#6f7e73] font-bold uppercase">Docket Ref</span>
                    <span className="font-bold text-[#1b5e20]">{selectedAuditBlock.docket}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#f8fbf8] border border-[#e0ece2] flex flex-col">
                  <span className="text-[10px] text-[#6f7e73] font-bold uppercase">Signing Entity & Public Key</span>
                  <span className="font-bold text-[#151d19]">{selectedAuditBlock.actor}</span>
                  <span className="font-mono text-[10px] text-[#7a887d]">secp256k1: 0x4f89...b192 verified</span>
                </div>

                <div className="p-3 rounded-xl bg-[#d7e8c3] border border-[#a3f69c] flex items-center justify-between text-[11px] text-[#12230b] font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#1b5e20]">lock</span>
                    <span>Zero-Knowledge Verification:</span>
                  </div>
                  <span className="font-mono">{selectedAuditBlock.zkp}</span>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-[#f0f4f0]">
                <button
                  onClick={() => setSelectedAuditBlock(null)}
                  className="px-5 py-2 rounded-xl bg-[#1b5e20] text-white text-[12px] font-['Plus_Jakarta_Sans'] font-bold cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: CONTRACTOR DOSSIER */}
        {inspectContractor && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-[#e0ece2]">
              <div className="flex items-center justify-between border-b border-[#f0f4f0] pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={inspectContractor.avatar}
                    alt={inspectContractor.lead}
                    onError={(e) => {
                      e.target.src = "/rajesh_shinde.jpg";
                    }}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#1b5e20]"
                  />
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[16px] text-[#151d19]">
                      {inspectContractor.name}
                    </h3>
                    <p className="text-[12px] text-[#6f7e73]">
                      Lead: {inspectContractor.lead} • {inspectContractor.tier}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setInspectContractor(null)}
                  className="w-8 h-8 rounded-full hover:bg-[#f0f6f1] text-[#7a887d] flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center text-[11px]">
                <div className="p-2.5 rounded-xl bg-[#f8fbf8] border border-[#e0ece2]">
                  <span className="text-[#6f7e73] block">Repairs Completed</span>
                  <span className="font-bold text-[14px] text-[#151d19]">{inspectContractor.completed}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#f8fbf8] border border-[#e0ece2]">
                  <span className="text-[#6f7e73] block">Homography Rate</span>
                  <span className="font-bold text-[14px] text-[#1b5e20]">{inspectContractor.firstPassRate}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#f8fbf8] border border-[#e0ece2]">
                  <span className="text-[#6f7e73] block">Rating</span>
                  <span className="font-bold text-[14px] text-[#151d19]">{inspectContractor.rating}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-[12px]">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fbf8]">
                  <span className="text-[#6f7e73]">Assigned Municipal Ward</span>
                  <span className="font-bold text-[#151d19]">{inspectContractor.ward}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fbf8]">
                  <span className="text-[#6f7e73]">Total Escrow Disbursed</span>
                  <span className="font-bold text-[#1b5e20]">{inspectContractor.payoutTotal}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fbf8]">
                  <span className="text-[#6f7e73]">Section 12-B Penalties</span>
                  <span className="font-bold text-[#ba1a1a]">{inspectContractor.penalties}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fbf8]">
                  <span className="text-[#6f7e73]">Official Contact Phone</span>
                  <span className="font-mono text-[#151d19]">{inspectContractor.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f4f0]">
                <button
                  onClick={() => setInspectContractor(null)}
                  className="px-5 py-2 rounded-xl bg-[#1b5e20] text-white text-[12px] font-['Plus_Jakarta_Sans'] font-bold cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
