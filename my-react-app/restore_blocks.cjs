const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

const newBlocks = `) : componentName === 'Capacitors' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>Capacitors</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://www.codrey.com/wp-content/uploads/2019/01/Capcitors.jpg" alt="Capacitors" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>
            
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: T.text }}>The Energy Buckets</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Capacitors act like tiny, lightning-fast batteries. They store and release electrical energy quickly, making them essential for smoothing out power drops in your circuits.
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>How It Works (The Physics):</h3>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Inside a capacitor are two conductive metal plates separated by an insulator (a material that blocks electricity). When power is applied, electrons pile up on one plate, creating an electrical charge. If the main power suddenly drops—like when a heavy servo motor jerks and pulls too much current—the capacitor instantly empties its stored electrons into the circuit to fill the gap and keep your ESP32 from crashing.
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>Pinout & Wiring:</h3>
            
            <div style={{ background: T.surfaceAlt, border: \`1px solid \${T.border}\`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: T.primary }}>Ceramic Capacitors (100nF)</h4>
              <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                These look like tiny brown discs. They are <strong>non-polarized</strong>, meaning they have no positive or negative leg. You can plug them in facing either direction.
              </p>
              
              <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: T.primary }}>Electrolytic Capacitors (1uF, 10uF, 100uF)</h4>
              <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 12 }}>
                These look like tiny tin cans. They are <strong>polarized</strong>, meaning direction matters!
              </p>
              <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8 }}>
                <li><strong style={{ color: T.text }}>Long Leg (Anode):</strong> Connects to Positive (VCC).</li>
                <li><strong style={{ color: T.text }}>Short Leg (Cathode):</strong> Connects to Ground (GND). There is also a thick white stripe with minus (-) signs pointing to this leg.</li>
                <li><strong style={{ color: '#ef4444' }}>Warning:</strong> Plugging an electrolytic capacitor in backwards can cause it to pop or explode!</li>
              </ul>
            </div>
            
            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: T.surface, border: \`1px solid \${T.border}\`, color: T.text, borderRadius: 8, marginTop: 20 }}>
              &larr; Back to Kit
            </button>
          </div>
        ) : componentName === 'Potentiometer' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>Potentiometer</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://robodo.in/cdn/shop/products/51mNAteWA9L.jpg?v=1672847436" alt="Potentiometer" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>
            
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: T.text }}>The Volume Knob</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              A potentiometer (or "pot") is a variable resistor. Instead of having a fixed resistance value, you can adjust how much it resists the flow of electricity by turning a knob.
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>How It Works (The Physics):</h3>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Inside the plastic casing is a circular track made of a resistive material (like carbon). A metal "wiper" sits on this track and is connected to the center pin. When you turn the knob, the wiper slides along the track.
              <br/><br/>
              If the wiper is close to the power source, electricity doesn't have to travel far through the resistive track, so resistance is LOW. If you turn it the other way, the electricity has to force its way through a long section of the track, so resistance is HIGH.
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>Pinout & Wiring:</h3>
            
            <div style={{ background: T.surfaceAlt, border: \`1px solid \${T.border}\`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8 }}>
                <li><strong style={{ color: T.text }}>Left Pin (Terminal 1):</strong> Connect to Power (3.3V).</li>
                <li><strong style={{ color: T.text }}>Right Pin (Terminal 2):</strong> Connect to Ground (GND).</li>
                <li><strong style={{ color: T.text }}>Center Pin (Wiper):</strong> Connect to an Analog Input Pin (e.g., GPIO34). This pin reads the shifting voltage as you turn the knob (from 0 to 4095 on the ESP32).</li>
              </ul>
              <p style={{ color: T.textSub, lineHeight: 1.8, marginTop: 12, fontStyle: 'italic' }}>
                Note: You can swap the Left and Right pins! It will just reverse the direction you have to turn the knob to increase the voltage.
              </p>
            </div>
            
            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: T.surface, border: \`1px solid \${T.border}\`, color: T.text, borderRadius: 8, marginTop: 20 }}>
              &larr; Back to Kit
            </button>
          </div>
        ) : componentName === 'BC547 transistors' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>BC547 Transistor</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://robukits.in/static/uploads/bc547_2.png" alt="BC547 Transistor" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>
            
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: T.text }}>The Electronic Switch</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              The transistor is the most important invention of the 20th century. In your kit, it acts as an electronic switch. It allows the weak 3.3V signal from your ESP32 to safely control components that need 5V (like buzzers or small motors) without frying your microcontroller.
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>How It Works (The Physics):</h3>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Think of a transistor like a water valve. You have a huge pipe of high-pressure water (the main power supply) that is blocked by a gate. The ESP32 doesn't have the strength to push the gate open itself.
              <br/><br/>
              However, if the ESP32 sends a tiny trickle of water (a small current) to a specific pin on the transistor, that trickle triggers a mechanism that swings the massive gate wide open, allowing the high-pressure water to blast through and power the heavy device.
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>Pinout & Wiring (NPN Type):</h3>
            
            <div style={{ background: T.surfaceAlt, border: \`1px solid \${T.border}\`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 12 }}>
                Hold the transistor so the flat side with the writing is facing you, and the legs are pointing down. From left to right:
              </p>
              <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8 }}>
                <li><strong style={{ color: T.text }}>Pin 1 (Collector):</strong> Connects to the negative side of the heavy device you want to power.</li>
                <li><strong style={{ color: T.text }}>Pin 2 (Base):</strong> The trigger pin. Connect this to your ESP32 through a 1k resistor. When the ESP32 sends power here, the switch turns ON.</li>
                <li><strong style={{ color: T.text }}>Pin 3 (Emitter):</strong> Connects directly to Ground (GND).</li>
              </ul>
            </div>
            
            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: T.surface, border: \`1px solid \${T.border}\`, color: T.text, borderRadius: 8, marginTop: 20 }}>
              &larr; Back to Kit
            </button>
          </div>
        ) : componentName === '555 Timer IC' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>555 Timer IC</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://5.imimg.com/data5/SELLER/Default/2020/11/SW/FE/YR/15458098/555-timer-ic.png" alt="555 Timer IC" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>
            
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: T.text }}>The Heartbeat Chip</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Designed in 1971, the 555 Timer is one of the most famous microchips in history. Billions are made every year. It creates perfect, rhythmic timing pulses in hardware, requiring absolutely no code.
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>How It Works (The Physics):</h3>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Inside this tiny black chip are 25 transistors, 2 diodes, and 15 resistors. It works by constantly filling and emptying a capacitor (like a bucket of water).
              <br/><br/>
              When the bucket is full, the chip flips its output switch ON and empties the bucket. When the bucket is empty, it flips its output switch OFF and starts filling it again. By changing the sizes of the resistors and capacitors attached to it, you can make it blink an LED once a second, or buzz a speaker 1,000 times a second!
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>Pinout & Wiring:</h3>
            
            <div style={{ background: T.surfaceAlt, border: \`1px solid \${T.border}\`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 12 }}>
                Find the small circular dimple or notch on the top of the chip. Pin 1 is the top-left pin next to the dimple. Count down the left side, then up the right side (in a U-shape).
              </p>
              <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8 }}>
                <li><strong style={{ color: T.text }}>Pin 1 (GND):</strong> Ground.</li>
                <li><strong style={{ color: T.text }}>Pin 2 (Trigger):</strong> Detects when the capacitor is empty.</li>
                <li><strong style={{ color: T.text }}>Pin 3 (Output):</strong> The main power out. Connect your LED or Buzzer here.</li>
                <li><strong style={{ color: T.text }}>Pin 4 (Reset):</strong> Forces the chip to restart. Usually connected to Power to keep it running.</li>
                <li><strong style={{ color: T.text }}>Pin 5 (Control):</strong> Usually left disconnected or attached to a tiny capacitor.</li>
                <li><strong style={{ color: T.text }}>Pin 6 (Threshold):</strong> Detects when the capacitor is full.</li>
                <li><strong style={{ color: T.text }}>Pin 7 (Discharge):</strong> Empties the capacitor.</li>
                <li><strong style={{ color: T.text }}>Pin 8 (VCC):</strong> Main power input (5V).</li>
              </ul>
            </div>
            
            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: T.surface, border: \`1px solid \${T.border}\`, color: T.text, borderRadius: 8, marginTop: 20 }}>
              &larr; Back to Kit
            </button>
          </div>
        ) : componentName === 'USB Cable' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>USB Cable</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://rukmini1.flixcart.com/image/1500/1500/xif0q/data-cable/micro-usb-cable/7/9/l/15w-micro-usb-cable-for-super-fast-charge-treams-original-imahgmeeq4ttrahz.jpeg?q=70" alt="USB Cable" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>
            
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: T.text }}>The Lifeline</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              The Micro USB cable is the umbilical cord for your ESP32. It serves two critical functions simultaneously: providing raw electrical power and transferring high-speed data.
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>How It Works (The Physics):</h3>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Inside the thick rubber casing are four separate thin wires surrounded by metal foil shielding (to prevent magnetic interference). Two of these wires carry exactly 5 Volts of DC power directly to the voltage regulator on the ESP32. 
              <br/><br/>
              The other two wires (D+ and D-) act like a microscopic telegraph line. When you click 'Upload' on your computer, your code is converted into millions of rapid 1s and 0s. The computer sends these bits by rapidly fluctuating the voltage on the data wires millions of times per second. A dedicated chip on the ESP32 reads these fluctuations and writes them permanently into its flash memory.
            </p>
            
            <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 16, color: T.text }}>Important Warning:</h3>
            
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: \`1px solid #ef4444\`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#ef4444' }}>Data vs. Power-Only Cables</h4>
              <p style={{ color: T.textSub, lineHeight: 1.8 }}>
                Many cheap USB cables that come with toys or gas station chargers are <strong>Power-Only</strong>. They are missing the internal Data wires to save money! If you plug your ESP32 in and the computer says "Device Not Recognized" or nothing happens, 99% of the time you are using a power-only cable. Always use the cable provided in the kit.
              </p>
            </div>
            
            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: T.surface, border: \`1px solid \${T.border}\`, color: T.text, borderRadius: 8, marginTop: 20 }}>
              &larr; Back to Kit
            </button>
          </div>
        `;

const regex = /([^ \t]*\)[ \t]*:[ \t]*\([ \t]*\r?\n[ \t]*<div style=\{\{ textAlign: 'center', padding: 40 \}\}>)/;

if (regex.test(code)) {
  code = code.replace(regex, newBlocks + "$1");
  fs.writeFileSync('src/App.jsx', code);
  console.log('Appended ALL missing blocks!');
} else {
  console.log('Target still not found.');
}
