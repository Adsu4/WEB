const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');
const start1 = code.indexOf("componentName === 'Capacitors'");
const start2 = code.indexOf("componentName === '5V Single Channel Relay'");

console.log('--- Capacitors ---');
console.log(code.substring(start1, start1 + 1500));
console.log('\n--- Relay ---');
console.log(code.substring(start2, start2 + 1500));
