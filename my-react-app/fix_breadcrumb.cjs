const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const oldBreadcrumb = `            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 11,
              }}
            >
              <span style={{ color: T.textMuted }}>bfiot</span>
              <span style={{ color: T.textMuted }}>/</span>             {' '}
              <span style={{ color: T.textSub }}>{crumb[0]}</span>
              <span style={{ color: T.textMuted }}>/</span>             {' '}
              <span style={{ color: T.primary }}>{crumb[1]}</span>           {' '}
            </div>`;

const newBreadcrumb = `            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 11,
              }}
            >
              <span 
                style={{ color: T.textMuted, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = T.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = T.textMuted}
                onClick={() => window.open('https://bfiot.app', '_blank')}
              >
                bfiot
              </span>
              {crumb[0] ? (
                <>
                  <span style={{ color: T.textMuted }}>/</span>             {' '}
                  <span style={{ color: T.textSub }}>{crumb[0]}</span>
                  <span style={{ color: T.textMuted }}>/</span>             {' '}
                  <span style={{ color: T.primary }}>{crumb[1]}</span>           {' '}
                </>
              ) : (
                <>
                  <span style={{ color: T.textMuted }}>/</span>             {' '}
                  <span style={{ color: T.primary }}>home/</span>           {' '}
                </>
              )}
            </div>`;

if (code.includes(oldBreadcrumb)) {
  code = code.replace(oldBreadcrumb, newBreadcrumb);
  fs.writeFileSync('src/App.jsx', code);
  console.log('Breadcrumb replaced');
} else {
  const crlfOld = oldBreadcrumb.replace(/\n/g, '\r\n');
  if (code.includes(crlfOld)) {
    code = code.replace(crlfOld, newBreadcrumb.replace(/\n/g, '\r\n'));
    fs.writeFileSync('src/App.jsx', code);
    console.log('Breadcrumb replaced (CRLF)');
  } else {
    console.log('Could not find breadcrumb');
  }
}
