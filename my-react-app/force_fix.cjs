const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Use a simple replace with literal strings but handle potential CRLF by replacing everything with \n first
content = content.replace(/\r\n/g, '\n');

const causeOld = `                                <p
                                  style={{
                                    fontSize: 13,
                                    color: T.textSub,
                                    marginBottom: 2,
                                  }}
                                >
                                  <strong style={{ color: T.textMuted }}>
                                    Cause:
                                  </strong>{' '}
                                  {f.cause}
                                </p>`;

const causeNew = `                                {f.cause && (
                                  <p
                                    style={{
                                      fontSize: 13,
                                      color: T.textSub,
                                      marginBottom: 2,
                                    }}
                                  >
                                    <strong style={{ color: T.textMuted }}>
                                      Cause:
                                    </strong>{' '}
                                    {f.cause}
                                  </p>
                                )}`;

if (content.includes(causeOld)) {
    content = content.replace(causeOld, causeNew);
    console.log("Empty cause fixed!");
} else {
    console.log("Could not find exact causeOld block.");
}

// Check if hover btn exists
if (!content.includes('sim-run-btn')) {
    console.log("Hover button class missing! Adding it.");
    content = content.replace("button{font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;}", "button{font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;}\n.sim-run-btn{transition:all 0.2s ease;}\n.sim-run-btn:hover{filter:brightness(1.1);transform:translateY(-1px);}");
    content = content.replace(`          <button
            onClick={() => {
              setOnDelay(parseInt(tempOnDelay) || 10);`, `          <button
            className="sim-run-btn"
            onClick={() => {
              setOnDelay(parseInt(tempOnDelay) || 10);`);
} else {
    console.log("Hover button already added.");
}

// Check if PAGE_ORDER exists
if (!content.includes('const PAGE_ORDER')) {
    console.log("Next page logic missing! Adding it.");
    content = content.replace(`  const [showMobileWarning, setShowMobileWarning] = useState(false);`, `  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const PAGE_ORDER = [
    'gz1', 'gz2', 'gz3', 'gz4', 'gz5',
    'p1m1', 'p1m2', 'p1m3', 'p1m4', 'p1m5', 'p1cap',
    'p2m1', 'p2m2', 'p2m3', 'p2m4', 'p2cap',
    'p3m1', 'p3m2', 'p3m3', 'p3m4', 'p3cap',
    'p4m1', 'p4m2', 'p4m3', 'p4cap'
  ];
  const currentPageIndex = PAGE_ORDER.indexOf(page);
  const nextPageId = currentPageIndex !== -1 && currentPageIndex < PAGE_ORDER.length - 1 ? PAGE_ORDER[currentPageIndex + 1] : null;`);
    
    content = content.replace(`                      </div>
                    )}
                    {' '}
                  </div>
                  {' '}
                  {/* Right Column (Width: 40% on desktop, sticky sandbox panel) */}`, `                      </div>
                    )}
                    {' '}
                    {nextPageId && (
                      <div style={{ marginTop: 40, borderTop: \`1px solid \${T.border}\`, paddingTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => go(nextPageId)}
                          style={{
                            background: T.primary,
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '12px 24px',
                            fontWeight: 700,
                            fontSize: 14,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
                        >
                          Next: {LESSONS[nextPageId]?.title || 'Module'} ➔
                        </button>
                      </div>
                    )}
                  </div>
                  {' '}
                  {/* Right Column (Width: 40% on desktop, sticky sandbox panel) */}`);
} else {
    console.log("Next page logic already added.");
}

fs.writeFileSync('src/App.jsx', content);
