const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace('src="/logo1.png"', 'src="/logo2.png"');
fs.writeFileSync('src/App.jsx', code);
console.log('Logo updated to logo2');
