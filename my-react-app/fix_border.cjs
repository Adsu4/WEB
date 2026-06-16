const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Find all matches
const regex = /border: \\`1px solid \\\$\{T\.border\}\\`/g;
console.log('Matches found:', (code.match(regex) || []).length);

code = code.replace(regex, 'border: `1px solid ${T.border}`');
fs.writeFileSync('src/App.jsx', code);
console.log('Done.');
