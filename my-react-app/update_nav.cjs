const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Replace the Sidebar Logo block (SVG + Text)
const sidebarStartIdx = code.indexOf('<div\n              style={{\n                width: 36,\n                height: 36,');
if (sidebarStartIdx !== -1) {
  let sidebarEndIdx = code.indexOf('          </div>\n          {' + "' '}\n          <div\n            style={{\n              display: 'flex',', sidebarStartIdx);
  if (sidebarEndIdx === -1) {
    sidebarEndIdx = code.indexOf('          </div>\r\n          {' + "' '}\r\n          <div\r\n            style={{\r\n              display: 'flex',', sidebarStartIdx);
  }
  if (sidebarEndIdx === -1) {
    // fallback search
    const textSearch = "LEARN · BUILD · INNOVATE\n              </div>\n              {' '}\n            </div>\n            {' '}\n          </div>";
    sidebarEndIdx = code.indexOf(textSearch) + textSearch.length;
  }
  if (sidebarEndIdx === -1) {
    const textSearch = "LEARN · BUILD · INNOVATE\r\n              </div>\r\n              {' '}\r\n            </div>\r\n            {' '}\r\n          </div>";
    sidebarEndIdx = code.indexOf(textSearch) + textSearch.length;
  }

  if (sidebarEndIdx !== -1 && sidebarEndIdx > sidebarStartIdx) {
    const newSidebarBlock = `<div
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
              <img src="/logo2.png" alt="BFIOT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {' '}
            <div style={{ cursor: 'pointer' }} onClick={() => setPage('gz')}>
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
    
    code = code.substring(0, sidebarStartIdx) + newSidebarBlock + code.substring(sidebarEndIdx);
    console.log('Sidebar updated');
  } else {
    console.log('Could not find sidebar end index');
  }
} else {
  console.log('Could not find sidebar start index');
}


// 2. Replace the Breadcrumb
const breadcrumbStartIdx = code.indexOf('<span style={{ color: T.textMuted }}>bfiot</span>');
if (breadcrumbStartIdx !== -1) {
  let breadcrumbEndIdx = code.indexOf('</div>\n            {' + "' '}\n          </div>\n          {' '}\n          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>", breadcrumbStartIdx);
  if (breadcrumbEndIdx === -1) {
    breadcrumbEndIdx = code.indexOf('</div>\r\n            {' + "' '}\r\n          </div>\r\n          {' '}\r\n          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>", breadcrumbStartIdx);
  }
  if (breadcrumbEndIdx !== -1) {
    const newBreadcrumbBlock = `<span 
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
    
    code = code.substring(0, breadcrumbStartIdx) + newBreadcrumbBlock + code.substring(breadcrumbEndIdx);
    console.log('Breadcrumb updated');
  } else {
    console.log('Could not find breadcrumb end index');
  }
} else {
  console.log('Could not find breadcrumb start index');
}

fs.writeFileSync('src/App.jsx', code);
