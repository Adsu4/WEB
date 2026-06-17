const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

const styledMotorBlock = `) : componentName === 'DC Motor with Fan Blade' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>
              {componentName}
            </h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://i.ibb.co/Ps6kdgvy/file-00000000b07071fab5951d676892daaa.png" alt="DC Motor with Fan Blade" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Wind Maker</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              A simple, continuous rotation motor paired with a lightweight plastic propeller. It turns electrical energy into physical motion and aerodynamic thrust, perfect for automated cooling systems or hovercraft prototypes.
            </p>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h3>
              </div>
              <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 32 }}>
                Inside the metal canister of the DC motor are stationary magnets (the stator) and a coil of wire wrapped around a central shaft (the rotor/armature). When electricity flows through the wire coil, it creates a temporary electromagnetic field. This field is constantly pushed and pulled by the permanent magnets surrounding it, forcing the central shaft to spin rapidly. When you attach the plastic fan blade to this spinning shaft, the angled blades push air molecules backward, creating an equal and opposite physical thrust forward.
                <br /><br />
                <strong>The Brains of the Module:</strong> A standard DC motor has no "brains" or internal chips—it is purely analog. If you give it power, it spins. If you reverse the power (swap the positive and negative wires), it spins in the exact opposite direction!
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
                <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  <strong style={{ color: T.text }}>Terminals:</strong> The motor has two metal tabs on the back. It does not matter which one is positive or negative; swapping them just changes the spin direction.
                </p>

                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#ef4444' }}>The Hazard</h4>
                <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  A DC motor pulls a large amount of current and creates dangerous voltage spikes (flyback) when it spins down. <strong style={{ color: '#ef4444' }}>NEVER</strong> wire a DC motor directly to your ESP32's delicate GPIO pins.
                </p>
                
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#10b981' }}>The Solution</h4>
                <p style={{ color: T.textSub, lineHeight: 1.8 }}>
                  You must use your <strong style={{ color: T.text }}>BC547 Transistor</strong> or your <strong style={{ color: T.text }}>5V Relay Module</strong> to control the motor safely. Connect the motor to the VIN (5V) power rail and Ground through your transistor or relay switch, and use the ESP32 to simply turn that switch on or off.
                </p>
              </div>
            </div>

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: \`1px solid \${T.primary}\`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>
        `;

const regex = /([^ \t]*\)[ \t]*:[ \t]*\([ \t]*\r?\n[ \t]*<div style=\{\{ textAlign: 'center', padding: 40 \}\}>)/;

if (regex.test(code)) {
  code = code.replace(regex, styledMotorBlock + "$1");
  fs.writeFileSync('src/App.jsx', code);
  console.log('Appended DC Motor block!');
} else {
  console.log('Target still not found.');
}
