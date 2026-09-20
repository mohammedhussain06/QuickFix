const fs = require('fs');

const indexPath = 'c:/Users/Maviya Shaikh/Desktop/rough/frontend/index.html';
let content = fs.readFileSync(indexPath, 'utf8');

// 1. Update Rajesh Shinde avatar
content = content.replace(
  /avatar:\s*"https:\/\/images\.unsplash\.com\/photo-1541888946425-d0fbb186156a[^"]*"/g,
  'avatar: "./rajesh_shinde.jpg"'
);

content = content.replace(
  /src="https:\/\/images\.unsplash\.com\/photo-1541888946425-d0fbb186156a[^"]*"/g,
  'src="./rajesh_shinde.jpg"'
);

console.log('Rajesh Shinde avatar updated.');
fs.writeFileSync(indexPath, content, 'utf8');
