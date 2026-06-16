const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

const newBlock = `) : componentName === '5V Single Channel Relay' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>5V Single Channel Relay</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://5.imimg.com/data5/SELLER/Default/2020/11/FK/WK/OH/15458098/5v-relay-module-500x500.jpg" alt="5V Single Channel Relay" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>
            
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: T.text }}>The High-Power Bridge</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              The Relay is an electromechanical switch. It safely bridges the gap between your delicate, low-power microcontroller (the ESP32) and heavy, high-power devices (like large motors or home appliances).
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>How It Works (The Physics):</h3>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Inside the plastic box on the module is an electromagnet (a coil of wire) and a physical metal switch. The ESP32's 3.3V signal alone isn't strong enough to power a heavy device. But when you send a tiny signal to the relay, it powers the electromagnet. The magnet physically pulls the metal switch shut with a satisfying click. The high-power electricity flows entirely through this separated metal switch, meaning the dangerous high voltage never actually touches your ESP32.
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>The Brains of the Module:</h3>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Because an electromagnet can cause a harsh backward spike of electricity when turned off, the module includes a built-in transistor to trigger the coil and a "flyback diode" to protect your circuit from any sudden voltage kicks.
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>Pinout & Wiring:</h3>
            
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
            
            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: T.surface, border: \`1px solid \${T.border}\`, color: T.text, borderRadius: 8, marginTop: 20 }}>
              &larr; Back to Kit
            </button>
          </div>
        `;

const regex = /([^ \t]*\)[ \t]*:[ \t]*\([ \t]*\r?\n[ \t]*<div style=\{\{ textAlign: 'center', padding: 40 \}\}>)/;

if (regex.test(code)) {
  code = code.replace(regex, newBlock + "$1");
  fs.writeFileSync('src/App.jsx', code);
  console.log('Appended 5V Relay with regex!');
} else {
  console.log('Target still not found.');
}
