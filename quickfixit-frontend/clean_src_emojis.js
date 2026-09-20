const fs = require('fs');
const path = require('path');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Avatars
  content = content.replace(
    /https:\/\/images\.unsplash\.com\/photo-1541888946425-d0fbb186156a[^"]*/g,
    '/rajesh_shinde.jpg'
  );

  // Common emoji replacements
  content = content.replace(/🎉 \+10 Civic Points/g, "+10 Civic Points");
  content = content.replace(/⚠️ Inspection dispute/g, "Inspection dispute");
  content = content.replace(/★ Tier 1 Verified Contractor/g, '<span className="material-symbols-outlined text-[13px] inline mr-1 text-amber-300">military_tech</span>Tier 1 Verified Contractor');
  content = content.replace(/<span>🧑<\/span>/g, '<span className="material-symbols-outlined text-[18px]">person</span>');
  content = content.replace(/<span>👷<\/span>/g, '<span className="material-symbols-outlined text-[18px]">engineering</span>');
  content = content.replace(/<span>✨<\/span>/g, '<span className="material-symbols-outlined text-[18px]">verified</span>');
  content = content.replace(/<span className="text-xl animate-bounce">👋<\/span>/g, '<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#0d631b] animate-ping"></span>');
  content = content.replace(/⏱️/g, '<span className="material-symbols-outlined text-[15px] inline mr-1">timer</span>');

  content = content.replace(/★/g, '');
  content = content.replace(/🎉/g, '');
  content = content.replace(/🚜/g, '');
  content = content.replace(/🔍/g, '');
  content = content.replace(/❌/g, '');
  content = content.replace(/⚠️/g, '');
  content = content.replace(/🚨/g, '');
  content = content.replace(/🔥 Heatmap/g, '<span className="material-symbols-outlined text-[16px] inline mr-1">local_fire_department</span>Heatmap');
  content = content.replace(/🗺️ Territories/g, '<span className="material-symbols-outlined text-[16px] inline mr-1">map</span>Territories');
  content = content.replace(/🕒 Historical/g, '<span className="material-symbols-outlined text-[16px] inline mr-1">history</span>Historical');
  content = content.replace(/✓ On Track/g, '<span className="material-symbols-outlined text-[14px] inline mr-1 text-[#1b5e20]">check_circle</span>On Track');
  content = content.replace(/QuickPatch Co\. 🚩/g, 'QuickPatch Co. <span className="material-symbols-outlined text-[13px] inline text-amber-600">flag</span>');
  content = content.replace(/✓/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walk(fullPath);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      cleanFile(fullPath);
    }
  });
}

walk('c:/Users/Maviya Shaikh/Desktop/rough/frontend/src');
console.log('Finished cleaning src files.');
