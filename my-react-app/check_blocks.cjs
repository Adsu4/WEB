const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');
console.log('5V Relay:', code.indexOf("componentName === '5V Single Channel Relay'"));
console.log('USB Cable:', code.indexOf("componentName === 'USB Cable'"));
console.log('micro USB cable:', code.indexOf("componentName === 'micro USB cable'"));
console.log('Single channel relay:', code.indexOf("componentName === 'Single channel relay'"));
