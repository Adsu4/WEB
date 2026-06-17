const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const badBlockStart = `          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}
          >
            {' '}
            <div
              style={{
                width: 36,
                height: 36,
                background: '#fff',
                border: \`1px solid \${T.primaryBorder}\`,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                  stroke={T.primary}
                  strokeWidth={1}
                />
              </svg>
              {' '}
            </div>
            {' '}
            <div>
              {' '}
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  fontWeight: 500,
                  color: T.primary,
                  letterSpacing: 1.5,
                }}
              >
                BFIOT
              </div>
              {' '}
              <div
                style={{
                  fontSize: 9,
                  color: T.textMuted,
                  letterSpacing: 0.8,
                  marginTop: 1,
                }}
              >
                LEARN · BUILD · INNOVATE
              </div>
              {' '}
            </div>
            {' '}
          </div>`;

const newBlock = `          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}
          >
            {' '}
            <div
              style={{
                width: 36,
                height: 36,
                background: '#fff',
                border: \`1px solid \${T.primaryBorder}\`,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              onClick={() => window.open('https://bfiot.app', '_blank')}
            >
              {' '}
              <img src="/logo1.png" alt="BFIOT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {' '}
            <div style={{ cursor: 'pointer' }} onClick={() => { setPage('gz'); setSelectedPhase(null); setSelectedModule(null); }}>
              {' '}
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  fontWeight: 500,
                  color: T.primary,
                  letterSpacing: 1.5,
                }}
              >
                BFIOT
              </div>
              {' '}
              <div
                style={{
                  fontSize: 9,
                  color: T.textMuted,
                  letterSpacing: 0.8,
                  marginTop: 1,
                }}
              >
                LEARN · BUILD · INNOVATE
              </div>
              {' '}
            </div>
            {' '}
          </div>`;

if (code.includes(badBlockStart)) {
  code = code.replace(badBlockStart, newBlock);
  fs.writeFileSync('src/App.jsx', code);
  console.log('Fixed completely!');
} else {
  // If line endings are \r\n, try that
  const badBlockCRLF = badBlockStart.replace(/\n/g, '\r\n');
  if (code.includes(badBlockCRLF)) {
    code = code.replace(badBlockCRLF, newBlock.replace(/\n/g, '\r\n'));
    fs.writeFileSync('src/App.jsx', code);
    console.log('Fixed completely! (CRLF)');
  } else {
    console.log('Could not find the exact block to replace.');
  }
}
