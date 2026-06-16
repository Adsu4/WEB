const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf("componentName === 'Resistors'");
const nextComponent = code.indexOf(") : (", start);
console.log(code.substring(nextComponent - 100, nextComponent + 200));
