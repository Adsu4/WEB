const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.lastIndexOf("{ n: 'ESP32 Development Board'");
console.log(code.substring(start, start + 3000));
