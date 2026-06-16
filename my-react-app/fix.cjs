const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Replace emojis
const images = {
  'Jumper Wires': ['🔌', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Jump_wire.jpg/640px-Jump_wire.jpg'],
  '0.96" OLED Display': ['📺', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/OLED_Display.jpg/640px-OLED_Display.jpg'],
  'DHT11 Sensor': ['🌡️', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/DHT11.jpg/640px-DHT11.jpg'],
  'Ultrasonic Sensor (HC-SR04)': ['🦇', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/HC-SR04_ultrasonic_sensor.jpg/640px-HC-SR04_ultrasonic_sensor.jpg'],
  'IR Sensor': ['👁️', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Infrared_sensor.jpg/640px-Infrared_sensor.jpg'],
  'LDR (Light Sensor)': ['☀️', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Photoresistor.jpg/640px-Photoresistor.jpg'],
  'Active Buzzer': ['🔊', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Piezoelectric_buzzer.jpg/640px-Piezoelectric_buzzer.jpg'],
  'SG90 Servo Motor': ['🦾', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Servo_Motor.jpg/640px-Servo_Motor.jpg'],
  'Push Buttons': ['🔘', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Tact_switch.jpg/640px-Tact_switch.jpg'],
  'LEDs': ['💡', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/5mm_Red_LED.jpg/640px-5mm_Red_LED.jpg'],
  'Resistors': ['🛑', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/4_Resistors.jpg/640px-4_Resistors.jpg']
};

for (const [name, [emoji, url]] of Object.entries(images)) {
  const find = `<div style={{ fontSize: 100 }}>${emoji}</div>`;
  const replace = `<img src="${url}" alt="${name}" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />`;
  code = code.replace(find, replace);
}

// Fix Pinout align-items from 'center' to 'flex-start' and add paddingTop to text
// For pinout rows:
code = code.replace(/<div style={{ display: 'flex', alignItems: 'center', padding: 16, background: T\.surface, border: `1px solid \$\{T\.border\}`, borderRadius: 12 }}>/g, 
  `<div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: \`1px solid \${T.border}\`, borderRadius: 12 }}>`);

// Change generic labels to pills.
const pinColors = [
  { text: 'VCC (or +)', color: 'T.primary', bg: 'T.primaryBg' },
  { text: 'VCC', color: 'T.primary', bg: 'T.primaryBg' },
  { text: 'VCC (5V)', color: "'#ef4444'", bg: "'rgba(239, 68, 68, 0.1)'" },
  { text: 'GND (or -)', color: 'T.text', bg: "'rgba(107, 114, 128, 0.1)'" },
  { text: 'GND', color: 'T.text', bg: "'rgba(107, 114, 128, 0.1)'" },
  { text: 'SDA', color: "'#3b82f6'", bg: "'rgba(59, 130, 246, 0.1)'" },
  { text: 'SCK', color: "'#f59e0b'", bg: "'rgba(245, 158, 11, 0.1)'" },
  { text: 'DATA (OUT)', color: "'#10b981'", bg: "'rgba(16, 185, 129, 0.1)'" },
  { text: 'TRIG', color: "'#3b82f6'", bg: "'rgba(59, 130, 246, 0.1)'" },
  { text: 'OUT (or DO)', color: "'#10b981'", bg: "'rgba(16, 185, 129, 0.1)'" },
  { text: 'DO', color: "'#10b981'", bg: "'rgba(16, 185, 129, 0.1)'" },
  { text: 'AO', color: "'#8b5cf6'", bg: "'rgba(139, 92, 246, 0.1)'" },
  { text: 'Positive (+)', color: "'#ef4444'", bg: "'rgba(239, 68, 68, 0.1)'" },
  { text: 'Negative (-)', color: 'T.text', bg: "'rgba(107, 114, 128, 0.1)'" },
  { text: 'Brown (GND)', color: "'#78350f'", bg: "'rgba(120, 53, 15, 0.1)'" },
  { text: 'Orange (Signal)', color: "'#f59e0b'", bg: "'rgba(245, 158, 11, 0.1)'" },
  { text: 'Anode (+)', color: "'#ef4444'", bg: "'rgba(239, 68, 68, 0.1)'" },
  { text: 'Cathode (-)', color: 'T.text', bg: "'rgba(107, 114, 128, 0.1)'" },
  { text: 'Non-Polarized', color: 'T.primary', bg: 'T.primaryBg' },
  { text: 'Reading Values', color: "'#10b981'", bg: "'rgba(16, 185, 129, 0.1)'" },
  { text: 'The 4-Pin Layout', color: 'T.primary', bg: 'T.primaryBg' },
  { text: 'Breadboard Trick', color: "'#10b981'", bg: "'rgba(16, 185, 129, 0.1)'" },
  { text: 'Software Secret', color: "'#8b5cf6'", bg: "'rgba(139, 92, 246, 0.1)'" }
];

for (const p of pinColors) {
  const regex = new RegExp(`<div style=\\{\\{ width: \\d+, fontSize: 16, fontWeight: 800, color: [^}]+\\}\\}>${p.text.replace(/([()+])/g, '\\\\$1')}</div>`, 'g');
  const replace = `<div style={{ padding: '4px 10px', background: ${p.bg}, color: ${p.color}, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>${p.text}</div>`;
  code = code.replace(regex, replace);
}

// Adjust right side text to have paddingTop and line height for alignment
code = code.replace(/<div style={{ flex: 1, fontSize: 14, color: T\.textSub }}>/g, `<div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>`);

// Clean up some 4-pin specific replacements
const regex4pin = new RegExp(`<div style=\\{\\{ width: 140, fontSize: 16, fontWeight: 800, color: T.primary \\}\\}>The 4-Pin Layout</div>`, 'g');
code = code.replace(regex4pin, `<div style={{ padding: '4px 10px', background: T.primaryBg, color: T.primary, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>The 4-Pin Layout</div>`);

const regexBreadboardTrick = new RegExp(`<div style=\\{\\{ width: 140, fontSize: 16, fontWeight: 800, color: '#10b981' \\}\\}>Breadboard Trick</div>`, 'g');
code = code.replace(regexBreadboardTrick, `<div style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>Breadboard Trick</div>`);

const regexSoftwareSecret = new RegExp(`<div style=\\{\\{ width: 140, fontSize: 16, fontWeight: 800, color: '#8b5cf6' \\}\\}>Software Secret</div>`, 'g');
code = code.replace(regexSoftwareSecret, `<div style={{ padding: '4px 10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>Software Secret</div>`);

fs.writeFileSync('src/App.jsx', code);
console.log('Script completed');
