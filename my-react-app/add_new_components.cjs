const fs = require('fs');

const components = [
  {
    name: 'Capacitors',
    title: 'The Energy Buckets',
    hook: 'Capacitors act like tiny, lightning-fast batteries. They store and release electrical energy quickly, making them essential for smoothing out power drops in your circuits.',
    physics: 'Inside a capacitor are two conductive metal plates separated by an insulator (a material that blocks electricity). When power is applied, electrons pile up on one plate, creating an electrical charge. If the main power suddenly drops—like when a heavy servo motor jerks and pulls too much current—the capacitor instantly empties its stored electrons into the circuit to fill the gap and keep your ESP32 from crashing.',
    wiringPre: '',
    pinout: [
      { pin: 'Ceramic Capacitors (100nF)', desc: 'These look like tiny brown discs. They are non-polarized, meaning they have no positive or negative leg. You can plug them in facing either direction.', bg: 'T.primaryBg', color: 'T.primary' },
      { pin: 'Electrolytic Capacitors (1uF, 10uF, 100uF)', desc: 'These look like miniature soda cans. They <strong style={{ color: T.text }}>ARE</strong> polarized. The longer leg is positive, and the side of the can with the large minus stripe marks the negative leg. If you plug these in backward, they can pop!', bg: "'rgba(16, 185, 129, 0.1)'", color: "'#10b981'" }
    ]
  },
  {
    name: 'Potentiometer',
    title: 'The Twist Valve',
    hook: 'A potentiometer is simply an adjustable resistor. It is the exact same component used for volume knobs on speakers or dimmer switches on lights.',
    physics: 'Inside the metal housing is a curved track made of carbon (which resists electricity). A metal wiper is attached to the twisting knob. As you turn the knob, the wiper slides across the carbon track. A longer path across the carbon creates more resistance, and a shorter path creates less resistance. This allows you to smoothly increase or decrease the voltage passing through it.',
    wiringPre: '',
    pinout: [
      { pin: 'Outer Pins', desc: 'The two outside legs are for power. Connect the left leg to <strong style={{ color: T.text }}>3V3</strong> and the right leg to <strong style={{ color: T.text }}>Ground</strong> (you can actually swap these to reverse the direction the dial works).', bg: 'T.primaryBg', color: 'T.primary' },
      { pin: 'Middle Pin (Wiper)', desc: 'This is the output pin that carries the altered voltage. You connect this to an <strong style={{ color: T.text }}>Analog-to-Digital (ADC)</strong> pin on your ESP32 so your code can read exactly how far the knob has been twisted.', bg: "'rgba(245, 158, 11, 0.1)'", color: "'#f59e0b'" }
    ]
  },
  {
    name: 'BC547 transistors',
    title: 'The Electronic Muscle',
    hook: 'The transistor is arguably the most important invention of the 20th century. In your kit, it acts as a digital switch or an amplifier, letting a weak signal control a high-power device.',
    physics: 'The BC547 is an NPN silicon transistor. Think of it as a heavy-duty water pipe with a trap door. Normally, electricity cannot flow down the main pipe (from the Collector to the Emitter). However, if you apply a very tiny electrical current to the side door (the Base), it forces the trap door open, allowing a massive rush of electricity to flow through the main pipe. This allows a delicate 3.3V pin on your ESP32 to safely turn on a heavy 5V motor or a bright light.',
    wiringPre: 'Hold the transistor so the flat side with the text is facing you, and the pins point down:',
    pinout: [
      { pin: 'Pin 1 (Collector)', desc: 'The left pin. Connect this to the <strong style={{ color: T.text }}>negative</strong> side of the heavy component you want to power (like a buzzer or motor).', bg: "'rgba(59, 130, 246, 0.1)'", color: "'#3b82f6'" },
      { pin: 'Pin 2 (Base)', desc: 'The middle pin. This is the <strong style={{ color: T.text }}>trigger</strong>. Connect this to your ESP32 or sensor through a resistor.', bg: 'T.primaryBg', color: 'T.primary' },
      { pin: 'Pin 3 (Emitter)', desc: 'The right pin. Connect this directly to <strong style={{ color: T.text }}>Ground</strong> to let the heavy current escape.', bg: "'rgba(107, 114, 128, 0.1)'", color: "T.text" }
    ]
  },
  {
    name: '555 Timer IC',
    title: 'The Heartbeat',
    hook: 'The 555 Timer is a legendary microchip that creates perfect timing pulses without you needing to write a single line of code.',
    physics: 'Inside this tiny black chip are dozens of microscopic transistors and resistors. When you connect it to external capacitors and resistors on your breadboard, the chip constantly checks how fast the capacitor is filling up with electricity. When the capacitor is full, the 555 empties it and sends out an electrical pulse. By changing the size of the capacitor or resistor, you change the speed of the heartbeat, allowing you to blink lights or create sirens automatically.',
    wiringPre: 'The chip has 8 pins. Look for the small indented dot or half-circle notch on the top of the chip to find Pin 1 (top left).',
    pinout: [
      { pin: 'Power (Pin 8)', desc: 'Must be connected to the <strong style={{ color: T.text }}>VIN (5V)</strong> rail, not the 3.3V rail.', bg: "'rgba(239, 68, 68, 0.1)'", color: "'#ef4444'" },
      { pin: 'Ground (Pin 1)', desc: 'Connect to <strong style={{ color: T.text }}>Ground</strong>.', bg: "'rgba(107, 114, 128, 0.1)'", color: "T.text" },
      { pin: 'Output (Pin 3)', desc: 'This is where the heartbeat pulse comes out. Connect it to an LED (with a 220 Ohm resistor) to see the pulse in action.', bg: 'T.primaryBg', color: 'T.primary' }
    ]
  },
  {
    name: 'USB Cable',
    title: 'The Lifeline',
    hook: 'The lifeline of your entire project. It provides raw power and transfers data between your computer and the ESP32.',
    physics: `Inside the thick rubber casing are four separate, tiny wires. Two wires are dedicated entirely to power (carrying 5 Volts and Ground) to wake up the ESP32. The other two wires (Data+ and Data-) carry high-speed electrical pulses. These pulses transfer your compiled C++ code from your computer's hard drive straight into the ESP32's flash memory at thousands of bits per second.`,
    wiringPre: '',
    pinout: [
      { pin: 'The Connection', desc: 'Plug the micro-USB end into the silver port on the ESP32 and the large USB-A end into your computer.', bg: 'T.primaryBg', color: 'T.primary' },
      { pin: 'The Warning', desc: 'Always ensure you are using the cable provided in the kit. Many cheap cables found around the house are <strong style={{ color: T.text }}>"Charge-only"</strong> cables—they are missing the two internal data wires completely. If you use one of those, your board will turn on, but your computer will refuse to talk to it!', bg: "'rgba(239, 68, 68, 0.1)'", color: "'#ef4444'" }
    ]
  }
];

let generatedCode = '';

for (const comp of components) {
  generatedCode += `        ) : componentName === '${comp.name}' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src={\`https://placehold.co/800x400/png?text=\${encodeURIComponent('${comp.name}')}\`} alt="${comp.name}" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>${comp.title}</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              ${comp.hook}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h2>
                </div>
                <div style={{ padding: 20, background: T.surface, border: \`1px solid \${T.border}\`, borderRadius: 16, flex: 1 }}>
                  <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                    ${comp.physics}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>Pinout & Wiring</h2>
            </div>
            ${comp.wiringPre ? '<p style={{ fontSize: 15, color: T.textSub, marginBottom: 20 }}>' + comp.wiringPre + '</p>' : ''}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 40 }}>
`;

  for (const p of comp.pinout) {
    generatedCode += `              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: \\\`1px solid \\\${T.border}\\\`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: ${p.bg}, color: ${p.color}, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>${p.pin}</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>${p.desc}</div>
              </div>
`;
  }

  generatedCode += `            </div>
          </div>
`;
}

let code = fs.readFileSync('src/App.jsx', 'utf8');

// Find the end of the Resistors block
const target = `) : (
          <div style={{ textAlign: 'center', padding: 40 }}>`;

code = code.replace(target, generatedCode + target);

fs.writeFileSync('src/App.jsx', code);
console.log('Successfully injected new components!');
