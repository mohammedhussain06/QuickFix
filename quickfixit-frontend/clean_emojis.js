const fs = require('fs');

const indexPath = 'c:/Users/Maviya Shaikh/Desktop/rough/frontend/index.html';
let content = fs.readFileSync(indexPath, 'utf8');

// Replace all casual emojis with professional Material Symbols or clean text

// Translations
content = content.replace(
  /autoPassed:\s*"Auto-Passed & Escrow Payout Queued 🎉"/g,
  'autoPassed: "Auto-Passed & Escrow Payout Queued"'
);
content = content.replace(
  /autoPassed:\s*"स्वयंचलित मान्यता & एस्क्रो रक्कम मंजूर 🎉"/g,
  'autoPassed: "स्वयंचलित मान्यता & एस्क्रो रक्कम मंजूर"'
);

// MOCK_USERS badges and ratings
content = content.replace(/badge:\s*"Neighborhood Steward ★"/g, 'badge: "Neighborhood Steward (Tier 3)"');
content = content.replace(/rating:\s*"4\.9 ★"/g, 'rating: "4.9 / 5.0"');
content = content.replace(/rating:\s*"4\.8 ★"/g, 'rating: "4.8 / 5.0"');
content = content.replace(/rating:\s*"4\.5 ★"/g, 'rating: "4.5 / 5.0"');
content = content.replace(/rating:\s*"3\.6 ★"/g, 'rating: "3.6 / 5.0"');

// Feed badges
content = content.replace(/badge:\s*"Fix Verified 🎉"/g, 'badge: "Fix Verified"');
content = content.replace(/badge:\s*"Crew Dispatched 🚜"/g, 'badge: "Crew Dispatched"');
content = content.replace(/badge:\s*"Under Verification 🔍"/g, 'badge: "Under Verification"');

// Timer emoji
content = content.replace(/⏱️\s*\{formatCountdown\(countdown\)\}/g, '<span className="material-symbols-outlined text-[15px] inline mr-1 align-middle">timer</span>{formatCountdown(countdown)}');

// Tier 1 badge
content = content.replace(/★ Tier 1 Verified Contractor/g, '<span className="material-symbols-outlined text-[13px] inline mr-1 align-middle text-amber-300">military_tech</span>Tier 1 Verified Contractor');

// Waving hand
content = content.replace(/<span className="text-xl animate-bounce">👋<\/span>/g, '<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#0d631b] animate-ping"></span>');

// Saw too and helpful buttons
content = content.replace(/'Saw This ✓'/g, "'Saw This'");
content = content.replace(/'Confirmed ✓'/g, "'Confirmed'");
content = content.replace(/Looks Fixed ✓/g, "Looks Fixed");
content = content.replace(/Still Bad ❌/g, "Still Bad");
content = content.replace(/Confirmed Fixed ✓/g, "Confirmed Fixed");
content = content.replace(/Disputed ❌/g, "Disputed");

// Toast messages
content = content.replace(/🎉 \+10 Civic Points/g, "+10 Civic Points");
content = content.replace(/⚠️ Inspection dispute/g, "Inspection dispute");

// Star badge
content = content.replace(
  /<span className="w-8 h-8 rounded-full bg-white\/20 flex items-center justify-center font-bold text-sm">★<\/span>/g,
  '<span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm"><span className="material-symbols-outlined text-[18px]">military_tech</span></span>'
);

// Roles emojis 🧑 / 👷
content = content.replace(/<span>🧑<\/span>/g, '<span className="material-symbols-outlined text-[18px]">person</span>');
content = content.replace(/<span>👷<\/span>/g, '<span className="material-symbols-outlined text-[18px]">engineering</span>');
content = content.replace(/<span>✨<\/span>/g, '<span className="material-symbols-outlined text-[18px]">verified</span>');

// Municipal tabs
content = content.replace(/🔥 Heatmap/g, '<span className="material-symbols-outlined text-[16px] inline mr-1 align-middle">local_fire_department</span>Heatmap');
content = content.replace(/🗺️ Territories/g, '<span className="material-symbols-outlined text-[16px] inline mr-1 align-middle">map</span>Territories');
content = content.replace(/🕒 Historical/g, '<span className="material-symbols-outlined text-[16px] inline mr-1 align-middle">history</span>Historical');
content = content.replace(/✓ On Track/g, '<span className="material-symbols-outlined text-[14px] inline mr-1 align-middle text-[#1b5e20]">check_circle</span>On Track');
content = content.replace(/QuickPatch Co\. 🚩/g, 'QuickPatch Co. <span className="material-symbols-outlined text-[13px] inline text-amber-600 align-middle">flag</span>');

console.log('Finished basic emoji replacements.');
fs.writeFileSync(indexPath, content, 'utf8');
