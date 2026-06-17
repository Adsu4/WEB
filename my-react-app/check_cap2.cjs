const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');
console.log('Capacitors:', code.indexOf("componentName === 'Capacitors'"));
