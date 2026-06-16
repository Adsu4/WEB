const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

const oldArrows = '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>';
const plugIcon = '<path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path>';

code = code.split(oldArrows).join(plugIcon);

fs.writeFileSync('src/App.jsx', code);
console.log('Fixed arrows to plug icons.');
