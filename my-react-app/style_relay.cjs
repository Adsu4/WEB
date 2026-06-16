const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

const relayStartIdx = code.indexOf("componentName === '5V Single Channel Relay'");
if (relayStartIdx !== -1) {
  let relayEndIdx = code.indexOf(") : (\n          <div style={{ textAlign: 'center', padding: 40 }}>", relayStartIdx);
  if (relayEndIdx === -1) {
    relayEndIdx = code.indexOf(") : (\r\n          <div style={{ textAlign: 'center', padding: 40 }}>", relayStartIdx);
  }
  
  if (relayEndIdx !== -1) {
    const styledRelayBlock = `componentName === '5V Single Channel Relay' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>
              {componentName}
            </h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://5.imimg.com/data5/SELLER/Default/2020/11/FK/WK/OH/15458098/5v-relay-module-500x500.jpg" alt="5V Single Channel Relay" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The High-Power Bridge</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              The Relay is an electromechanical switch. It safely bridges the gap between your delicate, low-power microcontroller (the ESP32) and heavy, high-power devices (like large motors or home appliances).
            </p>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h3>
              </div>
              <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 32 }}>
                Inside the plastic box on the module is an electromagnet (a coil of wire) and a physical metal switch. The ESP32's 3.3V signal alone isn't strong enough to power a heavy device. But when you send a tiny signal to the relay, it powers the electromagnet. The magnet physically pulls the metal switch shut with a satisfying click. The high-power electricity flows entirely through this separated metal switch, meaning the dangerous high voltage never actually touches your ESP32.
                <br /><br />
                <strong>The Brains of the Module:</strong> Because an electromagnet can cause a harsh backward spike of electricity when turned off, the module includes a built-in transistor to trigger the coil and a "flyback diode" to protect your circuit from any sudden voltage kicks.
              </p>
            </div>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>Pinout & Wiring</h3>
              </div>
              
              <div style={{ background: T.surfaceAlt, border: \`1px solid \${T.border}\`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: T.primary }}>Low-Voltage Side (ESP32)</h4>
                <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  <li><strong style={{ color: T.text }}>VCC (or DC+):</strong> Power input for the electromagnet. This MUST be connected to the VIN (5V) rail of the ESP32. If connected to 3.3V, it won't have enough magnetic force to pull the switch shut.</li>
                  <li><strong style={{ color: T.text }}>GND (or DC-):</strong> Ground connection. Connect to GND.</li>
                  <li><strong style={{ color: T.text }}>IN:</strong> The signal pin. Connect this to an output GPIO on your ESP32. Sending a signal here triggers the switch. (Note: Many relays are "Active-Low", meaning sending LOW turns it ON).</li>
                </ul>
                
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: T.primary }}>High-Voltage Side (Screw Terminals)</h4>
                <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8 }}>
                  <li><strong style={{ color: T.text }}>COM (Common):</strong> The main power coming in from your heavy battery or wall plug.</li>
                  <li><strong style={{ color: T.text }}>NO (Normally Open):</strong> Connects to your heavy device. It only receives power when the relay clicks ON.</li>
                  <li><strong style={{ color: T.text }}>NC (Normally Closed):</strong> Receives power until the relay clicks ON. Usually left empty for basic projects.</li>
                </ul>
              </div>
            </div>

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: \`1px solid \${T.primary}\`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>
        `;
        
    code = code.substring(0, relayStartIdx) + styledRelayBlock + code.substring(relayEndIdx);
    fs.writeFileSync('src/App.jsx', code);
    console.log('Successfully styled Relay block!');
  } else {
    console.log('Could not find end of relay block.');
  }
} else {
  console.log('Could not find Relay block start.');
}
