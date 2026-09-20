const fs = require('fs');

['ComplaintDetail.jsx', 'contractor/ContractorJobFeed.jsx', 'contractor/ContractorScorecard.jsx'].forEach(f => {
  const p = 'c:/Users/Maviya Shaikh/Desktop/rough/frontend/src/components/' + f;
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/✕/g, '<span className="material-symbols-outlined text-[18px]">close</span>');
    fs.writeFileSync(p, c, 'utf8');
  }
});
