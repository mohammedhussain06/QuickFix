export const MOCK_USERS = {
  citizen: {
    id: "CITIZEN-084",
    name: "Elena Vasquez",
    role: "citizen",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-Xf-jQv8SiZkiLLaEAGtPtpd7U8fd7dQK8l_6WUM3hVb6OokBxRCuKSJN6eiNZpt4bfdoDSiLZgry_N77l_iawuoujXYQSs44tkEvZFEEKMOcuvbEmDz3N9iayE4B5Blektpd5RZ1sW_ZVOx0ozztljQ8ST0-_w25r5g3ldFxCRUy0ycO7aAP1xsFMLBjc-STnMy6oxWQsc9mVllsHTZ6r1fOc_sook8EZtgW6P8ztTyf4GIR_13vDA",
    ward: "Ward 14 • Maplewood",
    badge: "Neighborhood Steward ",
    phone: "+91 98201 54829"
  },
  contractor: {
    id: "APEX-CREW-04",
    name: "Rajesh Shinde",
    company: "Apex Paving Ltd.",
    crew: "Crew #4",
    role: "contractor",
    avatar: "/rajesh_shinde.jpg",
    ward: "Ward 14 / Ward K-West",
    rating: "4.9 ",
    verifiedRate: "96.8%",
    phone: "+91 98334 10294"
  },
  officer: {
    id: "BMC-ENG-108",
    name: "Dr. Arvind Kulkarni",
    role: "officer",
    title: "Executive Road Engineer",
    department: "BMC Roads & Traffic Infrastructure",
    ward: "Zone IV • Ward K/W",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-Xf-jQv8SiZkiLLaEAGtPtpd7U8fd7dQK8l_6WUM3hVb6OokBxRCuKSJN6eiNZpt4bfdoDSiLZgry_N77l_iawuoujXYQSs44tkEvZFEEKMOcuvbEmDz3N9iayE4B5Blektpd5RZ1sW_ZVOx0ozztljQ8ST0-_w25r5g3ldFxCRUy0ycO7aAP1xsFMLBjc-STnMy6oxWQsc9mVllsHTZ6r1fOc_sook8EZtgW6P8ztTyf4GIR_13vDA",
    phone: "+91 98190 28471"
  }
};

export const MOCK_INCIDENT_DETAIL = {
  id: "CF-8429",
  status: "Fix Verified & Completed",
  statusType: "verified",
  title: "Deep Asphalt Pothole",
  address: "342 Elm Street, Ward 14",
  reportedDate: "Oct 24",
  repairedDate: "Oct 26",
  reporter: "Elena Vasquez (You)",
  contractor: "Apex Paving Ltd.",
  crew: "Crew #4",
  confidence: 98.4,
  ledgerHash: "#e7a4f91b8d2...9f01",
  metrics: [
    { label: "GPS Location", value: "Matched (±0.9m)", passed: true, icon: "location_on" },
    { label: "Camera Heading", value: "Angle (282° W)", passed: true, icon: "explore" },
    { label: "Kerb Landmark", value: "Geometry Match (96%)", passed: true, icon: "domain" },
    { label: "Depth Fill", value: "100% Level Patch", passed: true, icon: "layers" }
  ],
  timeline: [
    { title: "Report Submitted", date: "Oct 24 • 9:15 AM", actor: "Citizen", completed: true },
    { title: "Triaged & Work Order Issued", date: "Oct 24 • 11:30 AM", actor: "Priority 2 • Auto-geofenced", completed: true },
    { title: "Contractor Repaired", date: "Oct 26 • 2:10 PM", actor: "Apex Paving Crew #4", completed: true },
    { title: "AI Telemetry Verified", date: "Oct 26 • 2:12 PM", actor: "98.4% Confidence Score", completed: true },
    { title: "Community Confirmation", date: "In Progress", actor: "Awaiting your local feedback", completed: false, current: true }
  ],
  beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqN3QvFP4tqPuysr6ufwxUoj95aryz370FdFkg_EGvKUd5RwTSvhiEE6YhYHjD_Y9LwaX93PXa75BcQVDKyVi859KPLgj2WV5NWF7DxgPhrYUKVnFyhBQDX_k0-BagDesfVAwN2fBQd9rA1tCoIjamuC4YNZ0RiDEAPzMI3qGRx_K-vyma1mSrN2iPvEx2fKUC1vgGyJ3lfVp0UpdaTiQ2Ie6iIxOq1rc7RUyknq7eOOMo7VrrFwSPUw",
  afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0TpDjXqMy-XXPRo3jnGEZX6mNFVQwk4uHkdhs8-Rd9MWdBolqnPAC8HAj4SjbrIJl_qpPDrj7w5a7aKbUyACYce8jSnloSQQv3uQAF_nxrWdlIghUuGqfRKB7mgmDW0uRMHs5bqUTTqomyj1F44Dra3zNiF3YqAKTZWI_v-p2z15d4N-6tGfCjvRy_rfbHapOYLCIDB2_a3QCjyBq-w9dF2Csth_j3tZE2kF1pS22493WeVNH0-x35w"
};

export const MOCK_FEED_ITEMS = [
  {
    id: "CF-8429",
    type: "verified",
    badge: "Fix Verified ",
    timeAgo: "2 hours ago",
    title: "Deep Asphalt Pothole",
    address: "342 Elm Street",
    matchScore: "98% AI Match",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD34BtGNaMowD674Rfy8Ry0_HVg91KXAhn-jOkHLaPl4Qopvgb_EgklAQe-QF6Z2pjtzrFXWn3hTSQoKF9NJCQ3WR6tjSeDC1gWc8tWjwB-zWtBoMG6vUCZYGhYobxQn5LYiP0z57NJPHrlTekmz1WxEdA-SuHcFsMy61yZvoBoRQdBliQl7qkzaP-11zGUeOTykUWSXGj8cwmQS0h_MUNmMzQOal9GE_umK83uVlscwjbOlhsTtnxkaA",
    tag: "Before & After Inspected",
    neighborCount: 14,
    avatars: ["MK", "JL", "+12"],
    helpfulCount: 28,
    isUserReport: true
  },
  {
    id: "CF-8432",
    type: "dispatched",
    badge: "Crew Dispatched ",
    badgeColor: "amber",
    timeAgo: "45 mins ago",
    expectedFix: "Expected fix by 4 PM",
    title: "Crumbling Shoulder & Crack",
    address: "Oak Ridge Ave • 120m away from you",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhS_lyFD4zIki-hYjRs0J_nj-kUtl-IVmxBC20jIz_3I4baGn5LnFpJbRM3_nmZXkpN0pNOcgWl3GzfVTF1jEBJ6Pzhi_KSxzdBCwqryvn2kI7IWpT3W5CdZ0HLwRIAR-sykN9qkUhz5a6-LLC6nzwPyEjTcWTeR9bfvYd5nLK52kGoGMs2p5aIkb2LG6vKh0r1-1ybH21JX6nXa1FOvOXyjio0lwOb_cAq_489dzWOU_AmH-wPstSKA",
    assignedTeam: "Assigned: Team B",
    slaInfo: "SLA: On schedule (2h remaining)",
    neighborCount: 8,
    helpfulCount: 11
  },
  {
    id: "CF-8435",
    type: "under_verification",
    badge: "Under Verification ",
    badgeColor: "sky",
    timeAgo: "35 mins ago",
    title: "Sunken Manhole Cover",
    address: "5th & Pine intersection",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1qtcsNjSXhDrNZ1jTwcY6zDwQC0cchueHYRoZZWS8IU-MpnsO3z0vtK4n8r18-59lqI6kr-urdIkHIkLVWtVeobUzKeSUa-zIPM5nS4NFnIDGllNQ3HIIon70jGs127zxrmc5buSHGCa4Ud7nzOZrJWHshQn8FnHMHROIjxhHxtnSJ2-ubn4XbwTI4kOh0ziBEWdayUXgR8S43ZgeAB9KWUTF3xW-1ItuyMSz4PTpjzTsAK7CzprQKQ",
    confirmations: 3,
    helpfulCount: 5
  }
];

export const MOCK_STATS = {
  reportedByYou: 3,
  inProgress: 2,
  fixedInWard: 18,
  wardName: "Ward 14 • Maplewood",
  scheduledWork: "Maple St. resurfacing underway • 4 potholes marked for cold patch by public works.",
  scheduledTime: "Tomorrow 8 AM"
};

export const WARDS_LIST = [
  "Ward 14 • Maplewood",
  "Ward A • Colaba / Fort",
  "Ward D • Malabar Hill",
  "Ward K/W • Andheri West",
  "Ward G/N • Dadar / Mahim"
];

// --- CONTRACTOR JOBS ---
export const MOCK_CONTRACTOR_JOBS = [
  {
    id: "WO-8429",
    complaintId: "CF-8429",
    title: "Deep Arterial Pothole",
    address: "342 Elm Street, Ward 14",
    roadClass: "Major Arterial Road (High Traffic)",
    distance: "0.4 km away",
    slaSecondsLeft: 6480,
    slaLabel: "1h 48m remaining",
    priority: "CRITICAL",
    payout: "₹12,000",
    depth: "5.4 cm",
    reportedHeading: "284° WNW",
    citizenPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqN3QvFP4tqPuysr6ufwxUoj95aryz370FdFkg_EGvKUd5RwTSvhiEE6YhYHjD_Y9LwaX93PXa75BcQVDKyVi859KPLgj2WV5NWF7DxgPhrYUKVnFyhBQDX_k0-BagDesfVAwN2fBQd9rA1tCoIjamuC4YNZ0RiDEAPzMI3qGRx_K-vyma1mSrN2iPvEx2fKUC1vgGyJ3lfVp0UpdaTiQ2Ie6iIxOq1rc7RUyknq7eOOMo7VrrFwSPUw",
    repairedPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0TpDjXqMy-XXPRo3jnGEZX6mNFVQwk4uHkdhs8-Rd9MWdBolqnPAC8HAj4SjbrIJl_qpPDrj7w5a7aKbUyACYce8jSnloSQQv3uQAF_nxrWdlIghUuGqfRKB7mgmDW0uRMHs5bqUTTqomyj1F44Dra3zNiF3YqAKTZWI_v-p2z15d4N-6tGfCjvRy_rfbHapOYLCIDB2_a3QCjyBq-w9dF2Csth_j3tZE2kF1pS22493WeVNH0-x35w",
    status: "assigned"
  },
  {
    id: "WO-8432",
    complaintId: "CF-8432",
    title: "Crumbling Shoulder & Edge",
    address: "Oak Ridge Ave, Ward 14",
    roadClass: "Residential Collector Road",
    distance: "1.2 km away",
    slaSecondsLeft: 15120,
    slaLabel: "4h 12m remaining",
    priority: "STANDARD",
    payout: "₹8,500",
    depth: "3.8 cm",
    reportedHeading: "192° SSW",
    citizenPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhS_lyFD4zIki-hYjRs0J_nj-kUtl-IVmxBC20jIz_3I4baGn5LnFpJbRM3_nmZXkpN0pNOcgWl3GzfVTF1jEBJ6Pzhi_KSxzdBCwqryvn2kI7IWpT3W5CdZ0HLwRIAR-sykN9qkUhz5a6-LLC6nzwPyEjTcWTeR9bfvYd5nLK52kGoGMs2p5aIkb2LG6vKh0r1-1ybH21JX6nXa1FOvOXyjio0lwOb_cAq_489dzWOU_AmH-wPstSKA",
    repairedPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuD34BtGNaMowD674Rfy8Ry0_HVg91KXAhn-jOkHLaPl4Qopvgb_EgklAQe-QF6Z2pjtzrFXWn3hTSQoKF9NJCQ3WR6tjSeDC1gWc8tWjwB-zWtBoMG6vUCZYGhYobxQn5LYiP0z57NJPHrlTekmz1WxEdA-SuHcFsMy61yZvoBoRQdBliQl7qkzaP-11zGUeOTykUWSXGj8cwmQS0h_MUNmMzQOal9GE_umK83uVlscwjbOlhsTtnxkaA",
    status: "assigned"
  },
  {
    id: "WO-8438",
    complaintId: "CF-8438",
    title: "Sunken Utility Manhole Collar",
    address: "5th & Pine Intersection",
    roadClass: "Secondary Arterial",
    distance: "2.1 km away",
    slaSecondsLeft: 66600,
    slaLabel: "18h 30m remaining",
    priority: "STANDARD",
    payout: "₹14,000",
    depth: "6.1 cm",
    reportedHeading: "045° NE",
    citizenPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1qtcsNjSXhDrNZ1jTwcY6zDwQC0cchueHYRoZZWS8IU-MpnsO3z0vtK4n8r18-59lqI6kr-urdIkHIkLVWtVeobUzKeSUa-zIPM5nS4NFnIDGllNQ3HIIon70jGs127zxrmc5buSHGCa4Ud7nzOZrJWHshQn8FnHMHROIjxhHxtnSJ2-ubn4XbwTI4kOh0ziBEWdayUXgR8S43ZgeAB9KWUTF3xW-1ItuyMSz4PTpjzTsAK7CzprQKQ",
    repairedPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0TpDjXqMy-XXPRo3jnGEZX6mNFVQwk4uHkdhs8-Rd9MWdBolqnPAC8HAj4SjbrIJl_qpPDrj7w5a7aKbUyACYce8jSnloSQQv3uQAF_nxrWdlIghUuGqfRKB7mgmDW0uRMHs5bqUTTqomyj1F44Dra3zNiF3YqAKTZWI_v-p2z15d4N-6tGfCjvRy_rfbHapOYLCIDB2_a3QCjyBq-w9dF2Csth_j3tZE2kF1pS22493WeVNH0-x35w",
    status: "assigned"
  }
];

export const MOCK_CONTRACTOR_SCORECARD = {
  verifiedRate: "96.8%",
  totalRepairs: 62,
  slaBreaches: 1,
  rejections: 2,
  payoutReleased: "₹1,84,000",
  inEscrowReview: "₹48,000",
  ledgerHistory: [
    { id: "WO-8420", address: "Victoria Terminus Link Rd", date: "Oct 22", score: "98.9%", payout: "₹14,000", hash: "#84a1...9e02" },
    { id: "WO-8415", address: "Hill Road, Bandra West", date: "Oct 20", score: "97.4%", payout: "₹11,500", hash: "#71c4...3b19" },
    { id: "WO-8409", address: "Linking Road Junction", date: "Oct 18", score: "99.1%", payout: "₹16,000", hash: "#52d8...fa07" }
  ]
};

// --- MUNICIPAL REVIEW QUEUE & EVIDENCE DATA ---
export const MOCK_MUNICIPAL_QUEUE = [
  {
    id: "REV-8429",
    complaintId: "CF-8429",
    contractor: "Apex Paving Ltd.",
    crew: "Crew #4 (Rajesh Shinde)",
    address: "342 Elm Street, Ward 14",
    ward: "Ward 14 / Ward K-West",
    submittedTime: "12 mins ago",
    confidence: 98.4,
    aiStatus: "AUTO_PASS",
    payout: "₹12,000",
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqN3QvFP4tqPuysr6ufwxUoj95aryz370FdFkg_EGvKUd5RwTSvhiEE6YhYHjD_Y9LwaX93PXa75BcQVDKyVi859KPLgj2WV5NWF7DxgPhrYUKVnFyhBQDX_k0-BagDesfVAwN2fBQd9rA1tCoIjamuC4YNZ0RiDEAPzMI3qGRx_K-vyma1mSrN2iPvEx2fKUC1vgGyJ3lfVp0UpdaTiQ2Ie6iIxOq1rc7RUyknq7eOOMo7VrrFwSPUw",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0TpDjXqMy-XXPRo3jnGEZX6mNFVQwk4uHkdhs8-Rd9MWdBolqnPAC8HAj4SjbrIJl_qpPDrj7w5a7aKbUyACYce8jSnloSQQv3uQAF_nxrWdlIghUuGqfRKB7mgmDW0uRMHs5bqUTTqomyj1F44Dra3zNiF3YqAKTZWI_v-p2z15d4N-6tGfCjvRy_rfbHapOYLCIDB2_a3QCjyBq-w9dF2Csth_j3tZE2kF1pS22493WeVNH0-x35w",
    checks: [
      { name: "Integrity (pHash)", detail: "Distance = 48 (Zero reuse)", passed: true },
      { name: "GPS Haversine", detail: "Δ 1.8m (Within 15m radius)", passed: true },
      { name: "Angle Homography", detail: "Δ 3.4° (Within 25° limit)", passed: true },
      { name: "Landmark ORB/SIFT", detail: "94% Kerb & Facade Match", passed: true },
      { name: "YOLOv8 Fill Score", detail: "100% Bitumen Compaction", passed: true }
    ],
    // Coordinates for matched keypoints between before & after photos
    keypoints: [
      { x1: 28, y1: 34, x2: 29, y2: 35, label: "Kerb Edge" },
      { x1: 64, y1: 22, x2: 63, y2: 24, label: "Lamp Post" },
      { x1: 82, y1: 45, x2: 80, y2: 44, label: "Shop Signboard" },
      { x1: 45, y1: 78, x2: 46, y2: 77, label: "Road Marking" }
    ]
  },
  {
    id: "REV-8436",
    complaintId: "CF-8436",
    contractor: "Mumbai Infra Roads",
    crew: "Crew #7 (Vikas More)",
    address: "Juhu Tara Rd, Santacruz",
    ward: "Ward K/W • Andheri West",
    submittedTime: "48 mins ago",
    confidence: 62.1,
    aiStatus: "FLAGGED_REVIEW",
    payout: "₹9,500",
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhS_lyFD4zIki-hYjRs0J_nj-kUtl-IVmxBC20jIz_3I4baGn5LnFpJbRM3_nmZXkpN0pNOcgWl3GzfVTF1jEBJ6Pzhi_KSxzdBCwqryvn2kI7IWpT3W5CdZ0HLwRIAR-sykN9qkUhz5a6-LLC6nzwPyEjTcWTeR9bfvYd5nLK52kGoGMs2p5aIkb2LG6vKh0r1-1ybH21JX6nXa1FOvOXyjio0lwOb_cAq_489dzWOU_AmH-wPstSKA",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD34BtGNaMowD674Rfy8Ry0_HVg91KXAhn-jOkHLaPl4Qopvgb_EgklAQe-QF6Z2pjtzrFXWn3hTSQoKF9NJCQ3WR6tjSeDC1gWc8tWjwB-zWtBoMG6vUCZYGhYobxQn5LYiP0z57NJPHrlTekmz1WxEdA-SuHcFsMy61yZvoBoRQdBliQl7qkzaP-11zGUeOTykUWSXGj8cwmQS0h_MUNmMzQOal9GE_umK83uVlscwjbOlhsTtnxkaA",
    checks: [
      { name: "Integrity (pHash)", detail: "Distance = 38 (Clean)", passed: true },
      { name: "GPS Haversine", detail: "Δ 18.2m (Borderline)", passed: true },
      { name: "Angle Homography", detail: "Δ 48.6° (Exceeds 25°)", passed: false },
      { name: "Landmark ORB/SIFT", detail: "42% Match (Angle Skew)", passed: false },
      { name: "YOLOv8 Fill Score", detail: "92% Patch Verified", passed: true }
    ],
    keypoints: [
      { x1: 35, y1: 40, x2: 48, y2: 46, label: "Tilted Kerb" },
      { x1: 70, y1: 30, x2: 82, y2: 38, label: "Tree Base" }
    ]
  },
  {
    id: "REV-8441",
    complaintId: "CF-8441",
    contractor: "Coastal Civils Pvt Ltd",
    crew: "Crew #2 (Sunil Jadhav)",
    address: "Dadar TT Circle, Dadar",
    ward: "Ward G/N • Dadar",
    submittedTime: "1h 15m ago",
    confidence: 14.8,
    aiStatus: "REJECTED_FRAUD",
    payout: "₹18,000",
    beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1qtcsNjSXhDrNZ1jTwcY6zDwQC0cchueHYRoZZWS8IU-MpnsO3z0vtK4n8r18-59lqI6kr-urdIkHIkLVWtVeobUzKeSUa-zIPM5nS4NFnIDGllNQ3HIIon70jGs127zxrmc5buSHGCa4Ud7nzOZrJWHshQn8FnHMHROIjxhHxtnSJ2-ubn4XbwTI4kOh0ziBEWdayUXgR8S43ZgeAB9KWUTF3xW-1ItuyMSz4PTpjzTsAK7CzprQKQ",
    afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhS_lyFD4zIki-hYjRs0J_nj-kUtl-IVmxBC20jIz_3I4baGn5LnFpJbRM3_nmZXkpN0pNOcgWl3GzfVTF1jEBJ6Pzhi_KSxzdBCwqryvn2kI7IWpT3W5CdZ0HLwRIAR-sykN9qkUhz5a6-LLC6nzwPyEjTcWTeR9bfvYd5nLK52kGoGMs2p5aIkb2LG6vKh0r1-1ybH21JX6nXa1FOvOXyjio0lwOb_cAq_489dzWOU_AmH-wPstSKA",
    checks: [
      { name: "Integrity (pHash)", detail: "Distance = 0 (Photo Reused from WO-8104)", passed: false },
      { name: "GPS Haversine", detail: "Δ 1.4 km (Completely wrong road)", passed: false },
      { name: "Angle Homography", detail: "Homography failed", passed: false },
      { name: "Landmark ORB/SIFT", detail: "0% Shared Landmarks", passed: false }
    ],
    keypoints: []
  }
];

// --- WARD HEATMAP & ANALYTICS DATA ---
export const MOCK_WARD_ANALYTICS = [
  {
    ward: "Ward K/W • Andheri West",
    zone: "Zone IV",
    totalComplaints: 284,
    verifiedFixed: 268,
    rate: "94.4%",
    slaBreaches: 3,
    repeatFailures: 1,
    activeHotspot: "S.V. Road & Ceaser Rd Junction",
    topContractor: "Apex Paving Ltd (96.8%)"
  },
  {
    ward: "Ward A • Colaba / Fort",
    zone: "Zone I",
    totalComplaints: 142,
    verifiedFixed: 139,
    rate: "97.8%",
    slaBreaches: 0,
    repeatFailures: 0,
    activeHotspot: "Mahatma Gandhi Rd",
    topContractor: "Heritage Paving (98.2%)"
  },
  {
    ward: "Ward D • Malabar Hill",
    zone: "Zone I",
    totalComplaints: 98,
    verifiedFixed: 95,
    rate: "96.9%",
    slaBreaches: 1,
    repeatFailures: 0,
    activeHotspot: "Walkeshwar Rd",
    topContractor: "Apex Paving Ltd (96.8%)"
  },
  {
    ward: "Ward G/N • Dadar / Mahim",
    zone: "Zone II",
    totalComplaints: 312,
    verifiedFixed: 281,
    rate: "90.1%",
    slaBreaches: 6,
    repeatFailures: 4,
    activeHotspot: "Tilak Bridge Approaches",
    topContractor: "Mumbai Infra Roads (82.1%)"
  }
];

// --- CRYPTOGRAPHIC SHA-256 AUDIT LEDGER ---
export const MOCK_AUDIT_LEDGER = [
  {
    block: 421,
    timestamp: "2026-09-19 15:42:10 UTC",
    event: "OFFICER_APPROVED",
    complaintId: "CF-8429",
    actor: "Dr. Arvind Kulkarni (BMC-ENG-108)",
    prevHash: "8f7b2c...a194",
    evidenceHash: "e7a4f9...9f01",
    blockHash: "9a21e4b872c019df...e318",
    valid: true
  },
  {
    block: 420,
    timestamp: "2026-09-19 15:38:04 UTC",
    event: "AI_VERIFIED_PASS",
    complaintId: "CF-8429",
    actor: "QuickFix-AI Engine (v2.4)",
    prevHash: "3d18e9...b401",
    evidenceHash: "e7a4f9...9f01",
    blockHash: "8f7b2c39d81a94e1...a194",
    valid: true
  },
  {
    block: 419,
    timestamp: "2026-09-19 15:35:12 UTC",
    event: "CONTRACTOR_PROOF_SUBMITTED",
    complaintId: "CF-8429",
    actor: "Rajesh Shinde (APEX-CREW-04)",
    prevHash: "11e9a2...7c55",
    evidenceHash: "6c2b18...d840",
    blockHash: "3d18e9842fbc401e...b401",
    valid: true
  },
  {
    block: 418,
    timestamp: "2026-09-19 09:15:30 UTC",
    event: "CITIZEN_REPORT_SUBMITTED",
    complaintId: "CF-8429",
    actor: "Elena Vasquez (CITIZEN-084)",
    prevHash: "000000...0000",
    evidenceHash: "44d819...a029",
    blockHash: "11e9a21bcf87c55e...7c55",
    valid: true
  }
];
