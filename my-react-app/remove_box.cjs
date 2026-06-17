const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const oldStyle = `                width: 36,
                height: 36,
                background: '#fff',
                border: \`1px solid \${T.primaryBorder}\`,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
                overflow: 'hidden'`;

const newStyle = `                width: 48,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
                overflow: 'visible'`;

if (code.includes(oldStyle)) {
  code = code.replace(oldStyle, newStyle);
  fs.writeFileSync('src/App.jsx', code);
  console.log('Removed square box around logo');
} else {
  // Try CRLF
  const oldStyleCRLF = oldStyle.replace(/\n/g, '\r\n');
  if (code.includes(oldStyleCRLF)) {
    code = code.replace(oldStyleCRLF, newStyle.replace(/\n/g, '\r\n'));
    fs.writeFileSync('src/App.jsx', code);
    console.log('Removed square box around logo (CRLF)');
  } else {
    console.log('Could not find the style block to replace');
  }
}
