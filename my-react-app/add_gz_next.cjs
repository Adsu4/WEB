const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// Replace \r\n with \n
content = content.replace(/\r\n/g, '\n');

const getNextBtn = () => `
                <div style={{ marginTop: 40, borderTop: \`1px solid \${T.border}\`, paddingTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      go(nextPageId);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="sim-run-btn"
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
                    }}
                  >
                    Next: {crumb[nextPageId] ? crumb[nextPageId][1] : (LESSONS[nextPageId]?.title || 'Module')} ➔
                  </button>
                </div>`;

const gz1_old = `                <div style={{ marginTop: 52, paddingBottom: 52 }}>
                  <PlumbingSim T={T} />
                </div>
              </div>
            )}`;
const gz1_new = `                <div style={{ marginTop: 52, paddingBottom: 52 }}>
                  <PlumbingSim T={T} />
                </div>${getNextBtn()}
              </div>
            )}`;
content = content.replace(gz1_old, gz1_new);

const gz2_old = `                </section>
                {' '}
              </div>
            )}

            {page === 'gz3'`;
const gz2_new = `                </section>
                {' '}
${getNextBtn()}
              </div>
            )}

            {page === 'gz3'`;
content = content.replace(gz2_old, gz2_new);

const gz3_old = `                    </Cd>
                    {' '}
                  </div>
                  {' '}
                </section>
                {' '}
              </div>
            )}

            {page === 'gz4'`;
const gz3_new = `                    </Cd>
                    {' '}
                  </div>
                  {' '}
                </section>
                {' '}
${getNextBtn()}
              </div>
            )}

            {page === 'gz4'`;
content = content.replace(gz3_old, gz3_new);


const gz4_old = `                    <strong style={{ color: T.text }}>10kΩ (Brown-Black-Orange):</strong> Your second best friend. Used as "pull-up" or "pull-down" resistors for buttons.
                  </p>
                </div>
              </div>
            )}

            {page === 'gz5'`;
const gz4_new = `                    <strong style={{ color: T.text }}>10kΩ (Brown-Black-Orange):</strong> Your second best friend. Used as "pull-up" or "pull-down" resistors for buttons.
                  </p>
                </div>${getNextBtn()}
              </div>
            )}

            {page === 'gz5'`;
content = content.replace(gz4_old, gz4_new);


// We also need to fix the Next button in the main lessons area to use the new title logic
const mainBtnOld = `Next: {LESSONS[nextPageId]?.title || 'Module'} ➔`;
const mainBtnNew = `Next: {crumb[nextPageId] ? crumb[nextPageId][1] : (LESSONS[nextPageId]?.title || 'Module')} ➔`;
content = content.replace(mainBtnOld, mainBtnNew);

fs.writeFileSync('src/App.jsx', content);
console.log("GZ buttons injected.");
