const fs = require('fs');

const code = fs.readFileSync('src/App.jsx', 'utf8');

// The array items look like:
// { n: 'ESP32 Development Board', icon: '🧠', img: '...', d: '...' }

const regex = /\{\s*n:\s*'([^']+)',\s*icon:\s*'[^']+',\s*img:\s*'([^']*)'/g;

let match;
const componentImages = {};

while ((match = regex.exec(code)) !== null) {
  if (match[2]) {
    componentImages[match[1]] = match[2];
  }
}

console.log('Extracted images:', componentImages);
