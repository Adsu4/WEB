const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');

const regex = /\{\s*n:\s*'([^']+)',\s*icon:\s*'[^']+',\s*img:\s*'([^']*)'/g;
let match;
while ((match = regex.exec(code)) !== null) {
  console.log(match[1], '->', match[2]);
}
