const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const updates = [
  {
    n: 'Capacitors',
    icon: '🔋',
    d: 'They act like tiny, lightning-fast batteries. They store and release electrical energy quickly to smooth out power drops and keep your circuits stable.'
  },
  {
    n: 'Potentiometer',
    icon: '🎛️',
    d: 'An adjustable twist-knob resistor. Turn the dial to smoothly increase or decrease the voltage flowing through your circuit, exactly like a volume knob on a speaker.'
  },
  {
    n: 'BC547 transistors',
    icon: '🔀',
    d: 'The electronic muscle of your kit. It acts as a digital switch, allowing a tiny, weak signal from your ESP32 to safely control high-power devices like motors.'
  },
  {
    n: '555 Timer IC',
    icon: '⏱️',
    d: 'A legendary microchip that acts as a heartbeat for your circuit. It creates perfect timing pulses to blink lights or make sirens without needing any code.'
  },
  {
    n: 'USB Cable',
    icon: '🔌',
    d: "The lifeline of your project. It provides raw power to your board and transfers your compiled code from your computer straight into the ESP32\\'s memory."
  }
];

for (const update of updates) {
  const regex = new RegExp(`({\\s*n:\\s*'${update.n}'\\s*,\\s*icon:\\s*)'[^']+'(.*?,\\s*d:\\s*)'[^']+'(.*?})`);
  const match = code.match(regex);
  if (match) {
    code = code.replace(regex, `$1'${update.icon}'$2'${update.d.replace(/'/g, "\\'")}'$3`);
    console.log(`Updated ${update.n}`);
  } else {
    console.log(`Could not find ${update.n}`);
  }
}

fs.writeFileSync('src/App.jsx', code);
