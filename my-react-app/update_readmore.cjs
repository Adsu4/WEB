const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

function replaceBlock(componentName, newContent) {
  const startStr = `componentName === '${componentName}' ? (`;
  const startIdx = code.indexOf(startStr);
  if (startIdx === -1) {
    console.log(`Could not find ${componentName}`);
    return;
  }
  
  let endIdx = code.indexOf(") : componentName === '", startIdx);
  if (endIdx === -1) {
    endIdx = code.indexOf(") : (\n          <div style={{ textAlign: 'center', padding: 40 }}>", startIdx);
    if (endIdx === -1) {
      endIdx = code.indexOf(") : (\r\n          <div style={{ textAlign: 'center', padding: 40 }}>", startIdx);
    }
  }
  
  if (endIdx !== -1) {
    code = code.substring(0, startIdx) + startStr + "\n" + newContent + "\n        " + code.substring(endIdx);
    console.log(`Successfully replaced ${componentName}`);
  } else {
    console.log(`Could not find end of ${componentName}`);
  }
}

// 1. Capacitors
const capContent = `          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>
              {componentName}
            </h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://i.ibb.co/VcwYXGcq/file-0000000008687208ae5bb40738f77c57.png" alt="Capacitors" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Energy Buckets</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Capacitors act like tiny, lightning-fast batteries. They store and release electrical energy quickly, making them essential for smoothing out power drops in your circuits.
            </p>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h3>
              </div>
              <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 32 }}>
                Inside a capacitor are two conductive metal plates separated by an insulator (a material that blocks electricity). When power is applied, electrons pile up on one plate, creating an electrical charge. If the main power suddenly drops—like when a heavy servo motor jerks and pulls too much current—the capacitor instantly empties its stored electrons into the circuit to fill the gap and keep your ESP32 from crashing.
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
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: T.primary }}>Ceramic Capacitors (100nF)</h4>
                <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  These look like tiny brown discs. They are <strong style={{ color: T.text }}>non-polarized</strong>, meaning they have no positive or negative leg. You can plug them in facing either direction.
                </p>
                
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: T.primary }}>Electrolytic Capacitors (1uF, 10uF, 100uF)</h4>
                <p style={{ color: T.textSub, lineHeight: 1.8 }}>
                  These look like miniature soda cans. They <strong style={{ color: T.text }}>ARE polarized</strong>. The longer leg is positive, and the side of the can with the large minus stripe marks the negative leg. If you plug these in backward, they can pop!
                </p>
              </div>
            </div>

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: \`1px solid \${T.primary}\`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>`;

// 2. Potentiometer
const potContent = `          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>
              {componentName}
            </h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://robodo.in/cdn/shop/products/51mNAteWA9L.jpg?v=1672847436" alt="Potentiometer" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Twist Valve</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              A potentiometer is simply an adjustable resistor. It is the exact same component used for volume knobs on speakers or dimmer switches on lights.
            </p>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h3>
              </div>
              <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 32 }}>
                Inside the metal housing is a curved track made of carbon (which resists electricity). A metal wiper is attached to the twisting knob. As you turn the knob, the wiper slides across the carbon track. A longer path across the carbon creates more resistance, and a shorter path creates less resistance. This allows you to smoothly increase or decrease the voltage passing through it.
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
                <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  <li><strong style={{ color: T.text }}>Outer Pins:</strong> The two outside legs are for power. Connect the left leg to 3V3 and the right leg to Ground (you can actually swap these to reverse the direction the dial works).</li>
                  <li><strong style={{ color: T.text }}>Middle Pin (Wiper):</strong> This is the output pin that carries the altered voltage. You connect this to an Analog-to-Digital (ADC) pin on your ESP32 so your code can read exactly how far the knob has been twisted.</li>
                </ul>
              </div>
            </div>

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: \`1px solid \${T.primary}\`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>`;

// 3. BC547 transistors
const bcContent = `          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>
              {componentName}
            </h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://etechrobot.com/wp-content/uploads/2025/11/BC547-Transistor-300x300.png" alt="BC547 Transistors" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Electronic Muscle</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              The transistor is arguably the most important invention of the 20th century. In your kit, it acts as a digital switch or an amplifier, letting a weak signal control a high-power device.
            </p>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h3>
              </div>
              <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 32 }}>
                The BC547 is an NPN silicon transistor. Think of it as a heavy-duty water pipe with a trap door. Normally, electricity cannot flow down the main pipe (from the Collector to the Emitter). However, if you apply a very tiny electrical current to the side door (the Base), it forces the trap door open, allowing a massive rush of electricity to flow through the main pipe. This allows a delicate 3.3V pin on your ESP32 to safely turn on a heavy 5V motor or a bright light.
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
                <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 12 }}>Hold the transistor so the flat side with the text is facing you, and the pins point down:</p>
                <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  <li><strong style={{ color: T.text }}>Pin 1 (Collector):</strong> The left pin. Connect this to the negative side of the heavy component you want to power (like a buzzer or motor).</li>
                  <li><strong style={{ color: T.text }}>Pin 2 (Base):</strong> The middle pin. This is the trigger. Connect this to your ESP32 or sensor through a resistor.</li>
                  <li><strong style={{ color: T.text }}>Pin 3 (Emitter):</strong> The right pin. Connect this directly to Ground to let the heavy current escape.</li>
                </ul>
              </div>
            </div>

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: \`1px solid \${T.primary}\`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>`;

// 4. 555 Timer IC
const timerContent = `          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>
              {componentName}
            </h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://probots.co.in/pub/media/catalog/product/cache/d8ddd0f9b0cd008b57085cd218b48832/5/5/555_lrg.jpg" alt="555 Timer IC" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Heartbeat</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              The 555 Timer is a legendary microchip that creates perfect timing pulses without you needing to write a single line of code.
            </p>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h3>
              </div>
              <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 32 }}>
                Inside this tiny black chip are dozens of microscopic transistors and resistors. When you connect it to external capacitors and resistors on your breadboard, the chip constantly checks how fast the capacitor is filling up with electricity. When the capacitor is full, the 555 empties it and sends out an electrical pulse. By changing the size of the capacitor or resistor, you change the speed of the heartbeat, allowing you to blink lights or create sirens automatically.
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
                <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 12 }}>The chip has 8 pins. Look for the small indented dot or half-circle notch on the top of the chip to find Pin 1 (top left).</p>
                <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  <li><strong style={{ color: T.text }}>Power (Pin 8):</strong> Must be connected to the VIN (5V) rail, not the 3.3V rail.</li>
                  <li><strong style={{ color: T.text }}>Ground (Pin 1):</strong> Connect to Ground.</li>
                  <li><strong style={{ color: T.text }}>Output (Pin 3):</strong> This is where the heartbeat pulse comes out. Connect it to an LED (with a 220 Ohm resistor) to see the pulse in action.</li>
                </ul>
              </div>
            </div>

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: \`1px solid \${T.primary}\`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>`;

// 5. USB Cable
const usbContent = `          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>
              {componentName}
            </h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://rukmini1.flixcart.com/image/1500/1500/xif0q/data-cable/micro-usb-cable/7/9/l/15w-micro-usb-cable-for-super-fast-charge-treams-original-imahgmeeq4ttrahz.jpeg?q=70" alt="USB Cable" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Lifeline</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              The lifeline of your entire project. It provides raw power and transfers data between your computer and the ESP32.
            </p>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h3>
              </div>
              <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 32 }}>
                Inside the thick rubber casing are four separate, tiny wires. Two wires are dedicated entirely to power (carrying 5 Volts and Ground) to wake up the ESP32. The other two wires (Data+ and Data-) carry high-speed electrical pulses. These pulses transfer your compiled C++ code from your computer's hard drive straight into the ESP32's flash memory at thousands of bits per second.
              </p>
            </div>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>Types & Wiring</h3>
              </div>
              
              <div style={{ background: T.surfaceAlt, border: \`1px solid \${T.border}\`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  <strong style={{ color: T.text }}>The Connection:</strong> Plug the micro-USB end into the silver port on the ESP32 and the large USB-A end into your computer.
                </p>
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#ef4444' }}>The Warning</h4>
                <p style={{ color: T.textSub, lineHeight: 1.8 }}>
                  Always ensure you are using the cable provided in the kit. Many cheap cables found around the house are <strong>"Charge-only"</strong> cables—they are missing the two internal data wires completely. If you use one of those, your board will turn on, but your computer will refuse to talk to it!
                </p>
              </div>
            </div>

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: \`1px solid \${T.primary}\`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>`;

replaceBlock('Capacitors', capContent);
replaceBlock('Potentiometer', potContent);
replaceBlock('BC547 transistors', bcContent);
replaceBlock('555 Timer IC', timerContent);
replaceBlock('USB Cable', usbContent);

fs.writeFileSync('src/App.jsx', code);
