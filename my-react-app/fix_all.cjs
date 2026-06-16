const fs = require('fs');

const componentImages = {
  'ESP32 Development Board': 'https://robukits.in/static/uploads/esp32devkit1.png',
  'Breadboard': 'https://auhbsvzkkblo2s0k.public.blob.vercel-storage.com/breadboard-840-tie-point-500x500-removebg-preview.png',
  'Jumper Wires': 'https://robocraze.com/cdn/shop/files/3_Male_to_Female_Jumper_Wires_20cm_20pcs_1000x.png?v=1758691490',
  '0.96" OLED Display': 'https://auhbsvzkkblo2s0k.public.blob.vercel-storage.com/ChatGPT_Image_Jun_8__2026__01_20_57_AM-removebg-preview.png',
  'DHT11 Sensor': 'https://auhbsvzkkblo2s0k.public.blob.vercel-storage.com/DHT11_Humidity_Temperature_Sensor_Module_1000x.jpg',
  'Ultrasonic Sensor (HC-SR04)': 'https://www.kitkraft.in/cdn/shop/files/ultrasonic_sensor_3_e3673ef4-1f94-4979-be20-213ccbe626b4.png?v=1752597803',
  'IR Sensor': 'https://probots.co.in/pub/media/catalog/product/cache/d8ddd0f9b0cd008b57085cd218b48832/i/r/ir-sensor-module-line-following.jpg',
  'LDR (Light Sensor)': 'https://www.sunrobotics.in/cdn/shop/files/LDR-module-1_60b4d653-45a9-4e6f-83f5-d8877c29bbcb_1920x.png?v=1746160216',
  'Active Buzzer': 'https://robu.in/_next/image/?url=https%3A%2F%2Frobu-prod-media.s3.ap-south-1.amazonaws.com%2Fuploads%2F2024%2F10%2FActive-Buzzer.png&w=1920&q=90',
  'SG90 Servo Motor': 'https://robukits.in/static/uploads/sg90.png',
  'Push Buttons': 'https://projectpoint.in/image/cache/catalog/button_12mm-800x800.jpg',
  'LEDs': 'https://dynokart.in/wp-content/uploads/2018/08/3mm-led-1.jpg',
  'Resistors': 'https://5.imimg.com/data5/SELLER/Default/2023/12/369621363/DH/RH/UO/21085075/resistors-th-and-smd.jpg',
  'Capacitors': 'https://www.codrey.com/wp-content/uploads/2019/01/Capcitors.jpg',
  'Potentiometer': 'https://robodo.in/cdn/shop/products/51mNAteWA9L.jpg?v=1672847436',
  'BC547 transistors': 'https://robukits.in/static/uploads/bc547_2.png',
  '555 Timer IC': 'https://5.imimg.com/data5/SELLER/Default/2020/11/SW/FE/YR/15458098/555-timer-ic.png',
  'USB Cable': 'https://rukmini1.flixcart.com/image/1500/1500/xif0q/data-cable/micro-usb-cable/7/9/l/15w-micro-usb-cable-for-super-fast-charge-treams-original-imahgmeeq4ttrahz.jpeg?q=70',
  '5V Single Channel Relay': 'https://5.imimg.com/data5/SELLER/Default/2020/11/FK/WK/OH/15458098/5v-relay-module-500x500.jpg'
};

const missingItems = [
  { n: 'Capacitors', icon: '🔋', d: "They act like tiny, lightning-fast batteries. They store and release electrical energy quickly to smooth out power drops and keep your circuits stable." },
  { n: 'Potentiometer', icon: '🎛️', d: "An adjustable twist-knob resistor. Turn the dial to smoothly increase or decrease the voltage flowing through your circuit, exactly like a volume knob on a speaker." },
  { n: 'BC547 transistors', icon: '🔀', d: "The electronic muscle of your kit. It acts as a digital switch, allowing a tiny, weak signal from your ESP32 to safely control high-power devices like motors." },
  { n: '555 Timer IC', icon: '⏱️', d: "A legendary microchip that acts as a heartbeat for your circuit. It creates perfect timing pulses to blink lights or make sirens without needing any code." },
  { n: 'USB Cable', icon: '🔌', d: "The lifeline of your project. It provides raw power to your board and transfers your compiled code from your computer straight into the ESP32's memory." },
  { n: '5V Single Channel Relay', icon: '⚡', d: "An electromechanical switch. It allows your delicate, low-voltage ESP32 to safely control high-power devices by using an internal electromagnet." }
];

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add missing components to the inline array
const resistorsStr = "{ n: 'Resistors', icon: '🛑', d: 'They restrict the flow of current. Essential for protecting delicate components like LEDs from receiving too much power.' }";
const appendStr = missingItems.map(item => `,\n                    { n: '${item.n}', icon: '${item.icon}', d: '${item.d.replace(/'/g, "\\'")}' }`).join('');

if (!code.includes("n: '5V Single Channel Relay'")) {
  code = code.replace(resistorsStr, resistorsStr + appendStr);
}

// 2. Add img property to ALL array items
for (const [name, imgUrl] of Object.entries(componentImages)) {
  const regex = new RegExp(`(\\{\\s*n:\\s*'${name}'\\s*,\\s*icon:\\s*'[^']+'\\s*,\\s*)(d:\\s*')`);
  if (regex.test(code)) {
    code = code.replace(regex, `$1img: '${imgUrl}', $2`);
  }
}

// 3. Update the map img tag
const oldImgTag = "<img src={`https://placehold.co/300x120/png?text=${encodeURIComponent(item.n)}`} alt={item.n} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />";
const newImgTag = "<img src={item.img || `https://placehold.co/300x120/png?text=${encodeURIComponent(item.n)}`} alt={item.n} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />";

code = code.replace(oldImgTag, newImgTag);

// 4. Update the detailed block for Single channel relay
const oldRelayName = "componentName === 'Single channel relay'";
const newRelayName = "componentName === '5V Single Channel Relay'";
code = code.replace(oldRelayName, newRelayName);

// 5. Update the detailed text for 5V Single Channel Relay
const oldRelayBlockStart = code.indexOf(newRelayName);
if (oldRelayBlockStart !== -1) {
  const blockEnd = code.indexOf(") : componentName === 'micro USB cable'", oldRelayBlockStart);
  if (blockEnd !== -1) {
const newBlock = `componentName === '5V Single Channel Relay' ? (
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
            
            <div style={{ background: T.surfaceAlt, border: \\\`1px solid \\\${T.border}\\\`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
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
            
            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: T.surface, border: \\\`1px solid \\\${T.border}\\\`, color: T.text, borderRadius: 8, marginTop: 20 }}>
              &larr; Back to Kit
            </button>
          </div>
        `;
    code = code.substring(0, oldRelayBlockStart) + newBlock + code.substring(blockEnd);
  }
}

fs.writeFileSync('src/App.jsx', code);
console.log('Fixed everything');
