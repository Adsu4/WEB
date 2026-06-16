const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf("componentName === '5V Single Channel Relay'");
console.log(code.substring(start - 200, start + 300));
