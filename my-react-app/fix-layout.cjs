const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Fix the parent div missing flex column
// The pattern is:
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
//               <div>
//                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
// We want to change the `<div>` to `<div style={{ display: 'flex', flexDirection: 'column' }}>`

const gridPattern = /<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 \}\}>\s*<div>/g;
code = code.replace(gridPattern, "<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>\n              <div style={{ display: 'flex', flexDirection: 'column' }}>");

// 2. The second column also needs the flex column:
//               </div>
//               <div>
//                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>

const secondColPattern = /<\/div>\s*<div>\s*<div style=\{\{ display: 'flex', alignItems: 'center', marginBottom: 20 \}\}>/g;
code = code.replace(secondColPattern, "</div>\n              <div style={{ display: 'flex', flexDirection: 'column' }}>\n                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>");

// 3. Change height: '100%' to flex: 1
const heightPattern = /<div style=\{\{ padding: 20, background: T\.surface, border: `1px solid \$\{T\.border\}`, borderRadius: 16, height: '100%' \}\}>/g;
code = code.replace(heightPattern, "<div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, flex: 1 }}>");

fs.writeFileSync('src/App.jsx', code);
console.log('Fixed flex layout bugs.');
