const fs = require('fs');

function checkFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}★✓❌⚠️🚨👋🧑👷✨🔥🗺🕒🚩🎉]/gu;

  console.log(`=== ${filepath} ===`);
  lines.forEach((line, idx) => {
    const matches = line.match(emojiRegex);
    if (matches) {
      console.log(`L${idx + 1} [${matches.join(',')}]: ${line.trim()}`);
    }
  });
}

checkFile('c:/Users/Maviya Shaikh/Desktop/rough/frontend/index.html');
