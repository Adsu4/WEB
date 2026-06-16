const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const start = code.indexOf("componentName === 'Single channel relay'");
const imgStart = code.indexOf('<img src=', start);
const imgEnd = code.indexOf(' alt=', imgStart);

code = code.substring(0, imgStart) + '<img src="https://5.imimg.com/data5/SELLER/Default/2020/11/FK/WK/OH/15458098/5v-relay-module-500x500.jpg"' + code.substring(imgEnd);

fs.writeFileSync('src/App.jsx', code);
console.log('Fixed 5V relay image');
