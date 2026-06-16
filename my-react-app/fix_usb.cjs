const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/ESP32\\\\'s memory/g, "ESP32\\'s memory");
fs.writeFileSync('src/App.jsx', code);
console.log('Fixed');
