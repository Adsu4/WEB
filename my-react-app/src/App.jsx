import React, { useState, useEffect, useRef } from 'react';

// ── SYSTEM CONFIGURATION ─────────────────────────────────────────────
// Change this:
const OR_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OR_MODEL = 'deepseek/deepseek-chat';

const PROJ_SYSTEM = `You are an expert hardware maker and IoT mentor with the personality of a confident technical YouTuber — think GreatScott! meets The Engineering Mindset. You talk to makers like a knowledgeable friend.

HARD RULES:
1. Always design around the ESP32 development board. That is the only microcontroller.
2. The AI system MUST try its level best to curate the whole step-by-step answer with the minimum number of external components. Prioritize using ONLY components from the user's kit: ESP32 Development Board, 0.96 inch OLED Display, DHT11 (Temp/Humidity) Sensor, Ultrasonic Sensor (HC-SR04), IR Sensor, LDR (Light Sensor), Active Buzzer, SG90 Servo Motor, 555 Timer IC, BC547 Transistors, Potentiometer (10k), Push Buttons, Breadboard, Jumper Wires (M-M, M-F, F-F), LEDs (Single Colors & RGB), Capacitors & Resistors Set, Single channel relay, micro USB cable.
3. While the step-by-step answer tries its best to keep components limited to the kit, it's okay if it mentions things not included in the kit, but it MUST be clearly mentioned that the component should be externally sourced from somewhere and is not present in the kit. If an idea ABSOLUTELY requires a component outside this kit, you MUST flag it in the "why" field by starting with "[EXTERNAL]" and clearly state it needs to be sourced externally.
4. Return ONLY a raw JSON object. Zero markdown fences. Zero preamble. Zero explanation. Just the JSON.
5. All code must be real, working Arduino C++ (no pseudocode).

Return exactly this JSON shape:
{
  "overview": {
    "hook": "2-3 punchy, exciting sentences about what we're building and why it's genuinely cool. Make someone want to build this immediately.",
    "concept": "3-4 sentences explaining how it works in plain English. First person. Use one good analogy. Sound like you're explaining it at a workbench.",
    "difficulty": "Complete Novice OR Weekend Warrior OR Intermediate Builder",
    "buildTime": "e.g. 2-3 hours"
  },
  "parts": [
    { "category": "Microcontroller", "name": "ESP32 Dev Board", "quantity": 1, "why": "one honest sentence on why this part." },
    { "category": "Sensors", "name": "Water Level Sensor", "quantity": 1, "why": "[EXTERNAL] Not in kit. Must be externally sourced to detect water depth." }
  ],
  "steps": [
    {
      "phase": "Phase 1: Breadboarding",
      "number": 1,
      "title": "Short title",
      "instruction": "2-3 clear sentences in your voice. Specific pin numbers.",
      "sanityCheck": "What they should see or hear at this exact point. Or null.",
      "proTip": "A genuinely useful tip for this step. Or null."
    }
  ],
  "code": {
    "language": "cpp",
    "filename": "snake_case_project_name.ino",
    "snippet": "Complete working Arduino C++ with clear inline comments. No shortcuts.",
    "breakdown": "3-4 sentences walking through the logic. Point out anything that trips people up. First person tone."
  }
}

Voice rules inside JSON strings:
- Use first-person naturally ("I usually...", "Here's what caught me off guard the first time...")
- Add ⚠️ PRO TIP: prefix inside instruction text where it adds real value
- Never be condescending. Be a knowledgeable friend.
- Keep it practical. No fluff.`;

// ── STYLING AND PALETTES ──────────────────────────────────────────────
const DARK = {
  bg: '#04080f',
  surface: '#080f1c',
  surfaceAlt: '#0c1525',
  border: '#111d33',
  text: '#e8edf5',
  textSub: '#4a5a78',
  textMuted: '#1e2d4a',
  primary: '#4f4dc8',
  primaryLight: '#6462d8',
  primaryBg: 'rgba(79,77,200,0.08)',
  primaryBorder: 'rgba(79,77,200,0.2)',
  green: '#22c55e',
  greenBg: 'rgba(34,197,94,0.07)',
  greenBorder: 'rgba(34,197,94,0.18)',
  amber: '#f59e0b',
  amberBg: 'rgba(245,158,11,0.05)',
  amberBorder: 'rgba(245,158,11,0.14)',
  red: '#ef4444',
  blue: '#3b82f6',
  codeBg: '#060c18',
  topbar: 'rgba(4,8,15,0.96)',
  shadow: 'none',
  bbBg: '#060c1a',
  bbHole: '#060c1a',
  bbHoleBorder: '#111d33',
  chip: 'rgba(79,77,200,0.1)',
  chipBorder: 'rgba(79,77,200,0.2)',
  navActive: 'rgba(79,77,200,0.12)',
};
const LIGHT = {
  bg: '#f5f7fc',
  surface: '#ffffff',
  surfaceAlt: '#f0f4ff',
  border: '#e2e8f0',
  text: '#0f172a',
  textSub: '#475569',
  textMuted: '#94a3b8',
  primary: '#4338ca',
  primaryLight: '#5b52d8',
  primaryBg: 'rgba(67,56,202,0.06)',
  primaryBorder: 'rgba(67,56,202,0.18)',
  green: '#16a34a',
  greenBg: 'rgba(22,163,74,0.06)',
  greenBorder: 'rgba(22,163,74,0.18)',
  amber: '#d97706',
  amberBg: 'rgba(217,119,6,0.06)',
  amberBorder: 'rgba(217,119,6,0.18)',
  red: '#dc2626',
  blue: '#2563eb',
  codeBg: '#f1f5f9',
  topbar: 'rgba(255,255,255,0.97)',
  shadow: '0 1px 0 #e2e8f0',
  bbBg: '#eef2ff',
  bbHole: '#dde3f5',
  bbHoleBorder: '#c7d0ea',
  chip: 'rgba(67,56,202,0.06)',
  chipBorder: 'rgba(67,56,202,0.15)',
  navActive: 'rgba(67,56,202,0.08)',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:#c7d2e8;border-radius:4px}
::-webkit-scrollbar-track{background:transparent}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp 0.36s cubic-bezier(0.22,1,0.36,1) forwards}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
.pulse{animation:pulse 2.2s ease infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{animation:spin 0.9s linear infinite}
@keyframes shimmer{0%{opacity:0.4}50%{opacity:0.9}100%{opacity:0.4}}
.shim{animation:shimmer 1.6s ease infinite}
@keyframes matrixGlitch{0%{filter:hue-rotate(0deg) contrast(1)} 50%{filter:hue-rotate(95deg) contrast(1.35) brightness(1.2)} 100%{filter:hue-rotate(0deg) contrast(1)}}
.glitch{animation:matrixGlitch 0.45s cubic-bezier(.25,.8,.25,1) 1}
input,textarea{outline:none;font-family:'Plus Jakarta Sans',sans-serif;}
a{text-decoration:none;color:inherit}
button{font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;}

/* Custom Code Colorizer classes */
.st-kw{color:#c678dd;font-weight:600;} 
.st-fn{color:#61afef;} 
.st-st{color:#98c379;} 
.st-cm{color:#7f848e;font-style:italic;}
.st-num{color:#d19a66;} 
.st-op{color:#56b6c2;}

/* Layout Utilities */
.sidebar{width:252px;transition:transform 0.3s ease-out;}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:90;backdrop-filter:blur(4px);}
.menu-btn{display:none;}
.main-pad{padding:48px 48px 80px;}

@media(max-width: 900px) {
  .sidebar{position:fixed;left:0;top:0;bottom:0;z-index:100;transform:translateX(-100%);}
  .sidebar.open{transform:translateX(0);}
  .overlay.open{display:block;}
  .menu-btn{display:block;background:none;border:none;padding:8px;margin-right:12px;color:inherit;}
  .topbar-px{padding:0 16px !important;}
  .main-pad{padding:24px 16px 80px;}
}
`;

// ── CODELIGHT: MICRO C++ HIGHLIGHTER ─────────────────────────────────
const codeLight = (code) => {
  if (!code) return { __html: '' };
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  escaped = escaped.replace(
    /(\/\/.*)|(".*?"|'.*?')|\b(void|int|float|bool|char|const|if|else|for|while|return|define|include|setup|loop|String|long|byte|unsigned|true|false)\b|\b(pinMode|digitalWrite|digitalRead|delay|Serial|begin|print|println|analogRead|analogWrite|pulseIn|delayMicroseconds|map|isnan|WiFi|softAP|server|on|handleClient|Wire|display|dht|myServo|attach|write|ledcSetup|ledcAttachPin|ledcWrite|beginTransmission|endTransmission|clearDisplay|setTextSize|setTextColor|setCursor|readTemperature|readHumidity|addHeader|POST|end)\b|\b(\d+(\.\d+)?)\b|([+\-*\/%=!|^]+)/g,
    (match, cm, st, kw, fn, num, dec, op) => {
      if (cm) return `<span class="st-cm">${cm}</span>`;
      if (st) return `<span class="st-st">${st}</span>`;
      if (kw) return `<span class="st-kw">${kw}</span>`;
      if (fn) return `<span class="st-fn">${fn}</span>`;
      if (num) return `<span class="st-num">${num}</span>`;
      if (op) return `<span class="st-op">${op}</span>`;
      return match;
    }
  );
  return { __html: escaped };
};

const safeJSONParse = (rawText) => {
  const startIdx = rawText.indexOf('{');
  const endIdx = rawText.lastIndexOf('}');
  if (startIdx === -1 || endIdx === -1) {
    throw new Error('Boundary parameters not found.');
  }
  const cleanStr = rawText.substring(startIdx, endIdx + 1);
  return JSON.parse(cleanStr);
};

// ── SVG ICONS ────────────────────────────────────────────────────────
const Sun = ({ s = 16, c }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={1.8}
    strokeLinecap="round"
  >
    <circle cx={12} cy={12} r={4} />
    <line x1={12} y1={2} x2={12} y2={5} />
    <line x1={12} y1={19} x2={12} y2={22} />
    <line x1={4.22} y1={4.22} x2={6.34} y2={6.34} />
    <line x1={17.66} y1={17.66} x2={19.78} y2={19.78} />
    <line x1={2} y1={12} x2={5} y2={12} />
    <line x1={19} y1={12} x2={22} y2={12} />
    <line x1={4.22} y1={19.78} x2={6.34} y2={17.66} />
    <line x1={17.66} y1={6.34} x2={19.78} y2={4.22} />
  </svg>
);
const Moon = ({ s = 16, c }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={1.8}
    strokeLinecap="round"
  >
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const Beaker = ({ s = 16, c }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 3h6M9 3v6l-5 10a1 1 0 00.9 1.5h14.2A1 1 0 0020 19L15 9V3" />
    <line x1={6.5} y1={14} x2={17.5} y2={14} />
  </svg>
);
const ChevD = ({ s = 14, c }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
    <path
      d="M3 5l4 4 4-4"
      stroke={c}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Lock = ({ s = 10, c }) => (
  <svg width={s} height={s + 2} viewBox="0 0 9 11" fill="none">
    <rect
      x={1}
      y={4}
      width={7}
      height={6}
      rx={1.5}
      stroke={c}
      strokeWidth={1}
    />
    <path
      d="M2.5 4V2.5a2 2 0 014 0V4"
      stroke={c}
      strokeWidth={1}
      strokeLinecap="round"
    />
  </svg>
);
const MenuIcon = ({ s = 20 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1={3} y1={12} x2={21} y2={12} />
    <line x1={3} y1={6} x2={21} y2={6} />
    <line x1={3} y1={18} x2={21} y2={18} />
  </svg>
);
const CloseIcon = ({ s = 20 }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1={18} y1={6} x2={6} y2={18} />
    <line x1={6} y1={6} x2={18} y2={18} />
  </svg>
);

// ── ATOM UI COMPONENTS ────────────────────────────────────────────────
const SN = ({ n, T }) => (
  <div
    style={{
      width: 32,
      height: 32,
      borderRadius: 8,
      background: T.primaryBg,
      border: `1px solid ${T.primaryBorder}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 11,
      fontWeight: 500,
      color: T.primary,
      flexShrink: 0,
    }}
  >
    {n}
  </div>
);
const Cd = ({ T, children, style = {} }) => (
  <div
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      ...style,
    }}
  >
    {children}
  </div>
);
const Tg = ({ color, label }) => (
  <div
    style={{
      display: 'inline-block',
      background: `${color}12`,
      border: `1px solid ${color}28`,
      borderRadius: 6,
      padding: '3px 10px',
    }}
  >
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color,
        fontFamily: "'JetBrains Mono',monospace",
      }}
    >
      {label}
    </span>
  </div>
);

function LBtn({ id, title, tag, active, locked, onClick, T, special }) {
  return (
    <button
      onClick={() => !locked && onClick(id)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 14px',
        background: active
          ? special
            ? 'rgba(34,197,94,0.08)'
            : T.navActive || T.primaryBg
          : 'transparent',
        border: 'none',
        borderLeft: `2px solid ${
          active ? (special ? T.green : T.primary) : 'transparent'
        }`,
        borderRadius: '0 8px 8px 0',
        cursor: locked ? 'default' : 'pointer',
        textAlign: 'left',
        marginBottom: 1,
        opacity: locked ? 0.28 : 1,
        transition: 'background 0.15s',
      }}
    >
           {' '}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          flexShrink: 0,
          background: active
            ? special
              ? 'rgba(34,197,94,0.1)'
              : T.primaryBg
            : T.surfaceAlt,
          border: `1px solid ${
            active ? (special ? T.greenBorder : T.primaryBorder) : T.border
          }`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
               {' '}
        {locked ? (
          <Lock s={9} c={T.textMuted} />
        ) : (
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: active
                ? special
                  ? T.green
                  : T.primary
                : T.textMuted,
            }}
          />
        )}
             {' '}
      </div>
           {' '}
      <div style={{ flex: 1, minWidth: 0 }}>
               {' '}
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: active ? T.text : T.textSub,
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
               {' '}
        {tag && (
          <div
            style={{
              fontSize: 10,
              color: special ? T.green : T.textMuted,
              marginTop: 1,
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {tag}
          </div>
        )}
             {' '}
      </div>
         {' '}
    </button>
  );
}

const TToggle = ({ dark, onToggle, T }) => (
  <button
    onClick={onToggle}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: T.primaryBg,
      border: `1px solid ${T.primaryBorder}`,
      borderRadius: 20,
      padding: '6px 12px',
    }}
  >
        {dark ? <Sun s={13} c={T.primary} /> : <Moon s={13} c={T.primary} />}   {' '}
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: T.primary,
        fontFamily: "'JetBrains Mono',monospace",
      }}
    >
      {dark ? 'Light' : 'Dark'}
    </span>
     {' '}
  </button>
);

// ── MASTER CURRICULUM DATABASE ───────────────────────────────────────────
const LESSONS = {
  m1: {
    title: 'Module 1: The Physical Handshake',
    phase: 'Phase 1: Pure Hardware Fundamentals',
    overview: {
      hook: "Let's build your very first circuit without a single line of code! We are using our ESP32 strictly as a 3.3V battery to prove how hardware loops function.",
      concept:
        "An LED needs about 1.8V to 3.0V (depending on color) to glow safely. Our board pushes 3.3V of pressure. If we connect them directly, the LED burns out instantly. We add a 220Ω resistor to act as a 'toll booth', eating the extra voltage so the LED stays safe.",
      difficulty: 'Complete Novice',
      buildTime: '15 mins',
    },
    parts: [
      {
        category: 'Microcontroller',
        name: 'ESP32 Dev Board',
        quantity: 1,
        why: 'Acts purely as a 3.3V power supply.',
      },
      {
        category: 'Consumables',
        name: 'Red LED',
        quantity: 1,
        why: 'Visual indicator of current flow.',
      },
      {
        category: 'Consumables',
        name: '220Ω Resistor',
        quantity: 1,
        why: 'Slows the current and drops the voltage.',
      },
      {
        category: 'Consumables',
        name: 'Jumper Wires',
        quantity: 2,
        why: 'Closes the physical loops.',
      },
    ],
    steps: [
      {
        phase: 'Hardware',
        number: 1,
        title: 'Mount the Brain',
        instruction:
          'Gently press your ESP32 board anywhere into the breadboard so it straddles the central dividing valley.',
        sanityCheck: null,
        proTip: 'Never force pins. Wiggle gently if they resist.',
      },
      {
        phase: 'Hardware',
        number: 2,
        title: 'Power Rails',
        instruction:
          'Connect a wire from the 3V3 pin on the ESP32 to the Red (+) Rail. Connect a wire from the GND pin to the Blue (-) Rail.',
        sanityCheck: 'The entire vertical power column is now live.',
        proTip: 'Always use red for power and blue/black for ground.',
      },
      {
        phase: 'Hardware',
        number: 3,
        title: 'Resistor Bodyguard',
        instruction:
          'Plug one leg of the 220Ω resistor into the Red (+) rail, and the other leg into any free row on the main board.',
        sanityCheck: 'That specific row now has safe, restricted 3.3V power.',
        proTip: null,
      },
      {
        phase: 'Hardware',
        number: 4,
        title: 'LED Gate',
        instruction:
          "Insert the LED's long leg (+) into the same row as the resistor. Push the short leg (-) into a different free row next to it. Run a jumper wire from the short leg's row to the Blue (-) Rail.",
        sanityCheck: 'Plug your ESP32 into a USB power source.',
        proTip:
          "If you move the ground wire to a completely separate row, the light dies. That's row isolation!",
      },
    ],
    observation:
      'The red LED should immediately light up brilliantly, but safely! Current is successfully flowing from the board, through the resistor, into the LED, and back to ground.',
    faq: [
      {
        error: "The LED doesn't light up.",
        cause: 'LED is backwards (polarity mismatch) or resistor is loose.',
        solution:
          'Flip the LED so the longer leg faces the positive power source.',
      },
    ],
    code: null,
  },
  m2: {
    title: 'Module 2: The Analog Bridge',
    phase: 'Phase 1: Pure Hardware Fundamentals',
    overview: {
      hook: "Welcome to the gray area! We're building an Analog Bridge to control electricity manually using a volume knob.",
      concept:
        "Real-world control isn't just ON/OFF. A Potentiometer functions like a dial-operated water valve. By turning it, we physically change the resistance, which smoothly limits the current flowing into our LED.",
      difficulty: 'Complete Novice',
      buildTime: '20 mins',
    },
    parts: [
      {
        category: 'Actuators',
        name: '10k Potentiometer Module',
        quantity: 1,
        why: 'Varies resistance dynamically as you turn the central shaft.',
      },
      {
        category: 'Consumables',
        name: 'Red LED',
        quantity: 1,
        why: 'To visually display the analog dimming effect.',
      },
    ],
    steps: [
      {
        phase: 'Hardware',
        number: 1,
        title: 'Place Potentiometer',
        instruction:
          'Insert the potentiometer legs into three separate free horizontal rows on your breadboard.',
        sanityCheck:
          'Make sure all three legs occupy completely separate rows.',
        proTip: 'Squeeze wide curved pins closer gently before pushing.',
      },
      {
        phase: 'Hardware',
        number: 2,
        title: 'Wire Entrance/Exit',
        instruction:
          'Wire one outer leg to the Red (+) Power Rail. Wire the other outer leg to the Blue (-) Ground Rail.',
        sanityCheck: null,
        proTip: null,
      },
      {
        phase: 'Hardware',
        number: 3,
        title: 'The Middle Wiper',
        instruction:
          "Wire the middle signal leg to a new empty row. Plug the LED's long leg into this row, and connect the short leg back to the Blue Ground Rail.",
        sanityCheck: 'Power on the board and gently turn the knob.',
        proTip: "You are manually adjusting the 'squeeze' on the electricity.",
      },
    ],
    observation:
      'Rotating the potentiometer smoothly adjusts the brightness of the LED from completely off to full maximum.',
    faq: [
      {
        error: 'The LED stays at full brightness.',
        cause: 'Wired to a static power rail instead of the wiper pin.',
        solution:
          "Ensure the LED connects strictly to the middle 'Signal' pin of the potentiometer.",
      },
    ],
    code: null,
  },
  m3: {
    title: 'Module 3: Physical Logic Gates',
    phase: 'Phase 1: Pure Hardware Fundamentals',
    overview: {
      hook: "Let's teach a circuit to make decisions without a brain! We are building physical computer science logic using switches.",
      concept:
        'Computers run on Boolean logic. If we wire two buttons in a line (Series), electricity must cross both bridges to work — this is an AND gate. If we wire them side-by-side (Parallel), electricity can cross either bridge — this is an OR gate.',
      difficulty: 'Weekend Warrior',
      buildTime: '25 mins',
    },
    parts: [
      {
        category: 'Sensors',
        name: 'Push Buttons',
        quantity: 2,
        why: 'Acts as our mechanical logic operators.',
      },
      {
        category: 'Consumables',
        name: 'Red LED & Resistor',
        quantity: 1,
        why: 'Visual indicator of a true/false output.',
      },
    ],
    steps: [
      {
        phase: 'Hardware',
        number: 1,
        title: 'Mount Buttons',
        instruction:
          'Push two buttons across the center valley of the breadboard, leaving space between them.',
        sanityCheck: null,
        proTip:
          'Buttons are non-polarized. Direction across the valley does not matter.',
      },
      {
        phase: 'Hardware',
        number: 2,
        title: 'AND Gate Wiring (Series)',
        instruction:
          "Wire Red (+) to Button A's entrance. Wire Button A's exit to Button B's entrance. Wire Button B's exit to an LED setup (with a resistor) going to Ground.",
        sanityCheck: 'Pressing just one button does nothing.',
        proTip: 'This is the physical foundation of all computer processing.',
      },
      {
        phase: 'Hardware',
        number: 3,
        title: 'OR Gate Wiring (Parallel)',
        instruction:
          'Now, wire Red (+) to BOTH Button A and Button B entrances. Wire BOTH exits to the same LED setup.',
        sanityCheck: 'Pressing either button completes the circuit.',
        proTip: null,
      },
    ],
    observation:
      'For the Series setup, the LED lights up ONLY when you press BOTH buttons simultaneously. For Parallel, pressing EITHER button lights the LED.',
    faq: [
      {
        error: "Buttons don't affect the LED at all.",
        cause:
          'Buttons are plugged in incorrectly, bridging the connection permanently.',
        solution:
          'Rotate the buttons 90 degrees to properly bridge the breadboard valley.',
      },
    ],
    code: null,
  },
  m4: {
    title: 'Module 4: The Automatic Night Light',
    phase: 'Phase 1: Pure Hardware Fundamentals',
    overview: {
      hook: 'Our masterpiece of Phase 1! We are building a smart light that turns on automatically when the room goes dark, using zero code.',
      concept:
        'Instead of building complex transistor circuits from scratch, we use an LDR Sensor Module. It has a built-in comparator chip. When it gets dark, its Digital Out (DO) pin automatically switches from LOW to HIGH. We can wire this directly to an LED!',
      difficulty: 'Intermediate Builder',
      buildTime: '30 mins',
    },
    parts: [
      {
        category: 'Sensors',
        name: 'LDR Sensor Module',
        quantity: 1,
        why: 'Detects light and triggers a digital output.',
      },
      {
        category: 'Consumables',
        name: 'Red LED',
        quantity: 1,
        why: 'Our automated street lamp.',
      },
      {
        category: 'Consumables',
        name: 'Jumper Wires',
        quantity: 3,
        why: 'Routes the module signals.',
      },
    ],
    steps: [
      {
        phase: 'Hardware',
        number: 1,
        title: 'Power the Sensor',
        instruction:
          "Connect the LDR Module's VCC pin to the Red (+) Power Rail and the GND pin to the Blue (-) Ground Rail.",
        sanityCheck: 'A small power LED on the module should turn on.',
        proTip: null,
      },
      {
        phase: 'Hardware',
        number: 2,
        title: 'Wire the Output',
        instruction:
          "Connect the LDR Module's DO (Digital Out) pin to a free row on your breadboard.",
        sanityCheck: null,
        proTip:
          'The DO pin acts like a smart switch, providing voltage when the threshold is met.',
      },
      {
        phase: 'Hardware',
        number: 3,
        title: 'Connect the Light',
        instruction:
          "Plug the LED's long leg (+) into the DO pin's row. Connect the LED's short leg (-) back to the Blue Ground Rail.",
        sanityCheck: 'Cast a shadow over the LDR sensor.',
        proTip: 'You just built industrial automation using pure physics.',
      },
    ],
    observation:
      'When you cast a shadow over the LDR sensor to block the light, the LED instantly turns on!',
    faq: [
      {
        error: 'The LED is always ON or always OFF.',
        cause: "The module's sensitivity threshold needs tuning.",
        solution:
          "Use a small screwdriver to turn the blue potentiometer block on the sensor module until it calibrates to your room's light.",
      },
    ],
    code: null,
  },
  m5: {
    title: 'Module 5: The Software Gatekeeper',
    phase: 'Phase 2: The Software Gatekeeper',
    overview: {
      hook: 'Welcome to Phase 2. We are moving from physical wires to writing digital instructions. We will setup our environment and compile our first software script.',
      concept:
        'Instead of hardwiring everything, we write code loops that flip internal electronic switches on and off. We write this inside two critical structures: setup() configures hardware on boot, and loop() runs endlessly.',
      difficulty: 'Complete Novice',
      buildTime: '30 mins',
    },
    parts: [
      {
        category: 'Microcontroller',
        name: 'ESP32 Dev Board',
        quantity: 1,
        why: 'The target for our compiled software upload.',
      },
      {
        category: 'Consumables',
        name: 'Micro USB B Cable',
        quantity: 1,
        why: 'Routes serial packets from your PC to the CP2102 chip.',
      },
    ],
    steps: [
      {
        phase: 'Software',
        number: 1,
        title: 'IDE & Drivers',
        instruction:
          'Download the Arduino IDE. Install the CP210x driver so your computer can recognize the board.',
        sanityCheck: "Your board should appear in the 'Tools -> Port' menu.",
        proTip: 'Driver installation fixes 90% of beginner errors.',
      },
      {
        phase: 'Software',
        number: 2,
        title: 'Upload Blink',
        instruction:
          "Paste the code, select 'ESP32 Dev Module', and hit Upload. The blue onboard LED will blink.",
        sanityCheck:
          "If upload hangs on 'Connecting...', hold the physical BOOT button on the ESP32.",
        proTip: null,
      },
    ],
    observation:
      'The small blue LED directly on the ESP32 board flashes on and off every second, proving your software is running.',
    faq: [
      {
        error: 'Upload fails / Timeout error',
        cause: 'ESP32 requires manual boot mode.',
        solution:
          "Hold down the physical 'BOOT' button on the board when the IDE terminal says 'Connecting...'.",
      },
      {
        error: 'Port not showing up',
        cause: 'Using a charge-only cable or missing driver.',
        solution:
          'Ensure you installed the CP2102 driver and are using a data-sync USB cable.',
      },
    ],
    code: {
      filename: 'onboard_blink.ino',
      snippet: `const int LED_PIN = 2; // Onboard Blue LED

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000); // Wait 1000ms (1 second)
  
  digitalWrite(LED_PIN, LOW);
  delay(1000); 
}`,
      breakdown:
        'This code declares GPIO 2 as an Output. In the loop, `digitalWrite(2, HIGH)` raises voltage to 3.3V, lighting the LED. It waits 1000ms, drops the pin back to 0V (LOW), and repeats.',
    },
  },
  m6: {
    title: 'Module 6: Digital Inputs & If-Statements',
    phase: 'Phase 2: The Software Gatekeeper',
    overview: {
      hook: "Let's make our software react to the physical environment! We are programming a digital input bridge using an if-statement.",
      concept:
        "Unlike output pins, input pins listen for voltage. To prevent pins from picking up static electricity and floating, we configure the ESP32's Internal Pull-Up Resistor. This holds the pin at 3.3V (HIGH) until a button press pulls it to Ground (LOW).",
      difficulty: 'Complete Novice',
      buildTime: '40 mins',
    },
    parts: [
      {
        category: 'Microcontroller',
        name: 'ESP32 Dev Board',
        quantity: 1,
        why: 'Acts as the logic brain parsing the digital button states.',
      },
      {
        category: 'Sensors',
        name: 'Push Button',
        quantity: 1,
        why: 'Bridges the circuit loop dynamically when pressed.',
      },
    ],
    steps: [
      {
        phase: 'Hardware',
        number: 1,
        title: 'Mount Button',
        instruction:
          'Push a button over the center groove. Wire one side to a free GPIO pin (e.g., GPIO 4), and the other side to Ground.',
        sanityCheck:
          'Do not use an external resistor! Our software handles it.',
        proTip: null,
      },
    ],
    observation:
      "Pressing the breadboard button immediately toggles the ESP32's onboard LED and prints text to the Serial Monitor.",
    faq: [
      {
        error: 'LED flickers randomly without touch',
        cause: 'Pin is floating (INPUT instead of INPUT_PULLUP).',
        solution:
          'Ensure your code explicitly uses pinMode(BUTTON_PIN, INPUT_PULLUP).',
      },
    ],
    code: {
      filename: 'button_logic.ino',
      snippet: `const int BUTTON_PIN = 4;
const int LED_PIN = 2;

void setup() {
  Serial.begin(115200);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int state = digitalRead(BUTTON_PIN);
  
  if (state == LOW) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("Button Pressed!");
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  delay(50);
}`,
      breakdown:
        'By setting `INPUT_PULLUP`, the ESP32 feeds 3.3V directly to GPIO 4 internally. Unpressed reads HIGH. Pressing the button pulls it to Ground (LOW). Our conditional `if` captures this switch and flashes the blue LED.',
    },
  },
  m7: {
    title: 'Module 7: Analog Outputs & PWM',
    phase: 'Phase 3: Actuation & Sensors',
    overview: {
      hook: "Digital is boring when it's just ON or OFF. We will fade an LED using Pulse Width Modulation (PWM).",
      concept:
        "Microcontrollers cannot output true analog voltage (like 1.5V). We fake it by flipping the pin ON and OFF incredibly fast. By changing the 'Duty Cycle' (ratio of ON to OFF time), our eyes see an averaged, dimmed brightness.",
      difficulty: 'Complete Novice',
      buildTime: '30 mins',
    },
    parts: [
      {
        category: 'Actuators',
        name: 'LED',
        quantity: 1,
        why: 'Our output element to display fading brightness.',
      },
    ],
    steps: [
      {
        phase: 'Hardware',
        number: 1,
        title: 'Wiring PWM',
        instruction:
          'Wire an LED and a 220Ω resistor to a PWM-capable pin, like GPIO 18.',
        sanityCheck: 'Ensure the wire maps correctly to GPIO 18.',
        proTip:
          'The ESP32 uses dedicated hardware channels for PWM, making it extremely precise.',
      },
    ],
    observation:
      'The external LED breathes, smoothly fading in and out endlessly.',
    faq: [
      {
        error: 'LED blinks sharply instead of fading',
        cause: 'Delay is too long or PWM channel is misconfigured.',
        solution:
          'Double check that your delay(5) is extremely short to allow smooth visual transitions.',
      },
    ],
    code: {
      filename: 'led_pwm_fader.ino',
      snippet: `const int LED_PIN = 18;
const int FREQ = 5000;
const int CHANNEL = 0;
const int RESOLUTION = 8; // 0-255

void setup() {
  ledcSetup(CHANNEL, FREQ, RESOLUTION);
  ledcAttachPin(LED_PIN, CHANNEL);
}

void loop() {
  for (int duty = 0; duty <= 255; duty++) {
    ledcWrite(CHANNEL, duty);
    delay(5);
  }
  for (int duty = 255; duty >= 0; duty--) {
    ledcWrite(CHANNEL, duty);
    delay(5);
  }
}`,
      breakdown:
        'We configure an internal PWM generator on Channel 0 running at 5000Hz. Using a standard `for` loop, we increment the duty cycle from 0 to 255, producing a smooth breathing effect on the LED.',
    },
  },
  m8: {
    title: 'Module 8: Servos & Motors',
    phase: 'Phase 3: Actuation & Sensors',
    overview: {
      hook: "Let's make things move! We are commanding a physical servo motor to rotate to specific degree angles.",
      concept:
        'Standard motors spin wildly, but Servos use feedback loops to pivot exactly to an angle. We send control pulses every 20ms — the width of this pulse locks the physical gears in place.',
      difficulty: 'Weekend Warrior',
      buildTime: '45 mins',
    },
    parts: [
      {
        category: 'Actuators',
        name: 'SG90 Micro Servo',
        quantity: 1,
        why: 'A geared 180-degree micro-servo.',
      },
    ],
    steps: [
      {
        phase: 'Hardware',
        number: 1,
        title: 'Wiring to Board',
        instruction:
          "Connect the servo's Brown wire to GND, Red wire to VIN (5V power), and Orange wire to GPIO 13.",
        sanityCheck: 'Ensure Red goes to VIN (5V), not 3.3V!',
        proTip:
          'Servos are power-hungry. The 3.3V pin cannot provide enough current for the motor.',
      },
    ],
    observation:
      'The servo motor arm smoothly sweeps back and forth between 0 and 180 degrees.',
    faq: [
      {
        error: 'Servo twitches and ESP32 crashes',
        cause: 'Servo is pulling too much power from the 3.3V pin.',
        solution:
          "Move the servo's red power wire directly to the VIN (5V) pin.",
      },
    ],
    code: {
      filename: 'servo_sweep.ino',
      snippet: `#include <ESP32Servo.h>

Servo myServo;
const int SERVO_PIN = 13;

void setup() {
  ESP32PWM::allocateTimer(0);
  myServo.setPeriodHertz(50);
  myServo.attach(SERVO_PIN, 500, 2400);
}

void loop() {
  for (int pos = 0; pos <= 180; pos++) {
    myServo.write(pos);
    delay(15);
  }
  for (int pos = 180; pos >= 0; pos--) {
    myServo.write(pos);
    delay(15);
  }
}`,
      breakdown:
        'Using the `ESP32Servo` library, we allocate a hardware timer. We attach our servo and invoke `myServo.write(angle)`. The library handles the complex microsecond PWM math to lock the motor at the exact degree.',
    },
  },
  m9: {
    title: 'Module 9: OLED Displays (I2C)',
    phase: 'Phase 3: Actuation & Sensors',
    overview: {
      hook: 'Ditch the boring Serial Monitor! We are going to draw clean text and data on an external OLED screen.',
      concept:
        'Instead of running 10 wires, we use a 2-wire serial bus called I2C. SDA (Data) and SCL (Clock) carry address packets. Our ESP32 acts as the master, telling the screen (at address 0x3C) which pixels to light up.',
      difficulty: 'Intermediate Builder',
      buildTime: '45 mins',
    },
    parts: [
      {
        category: 'Displays',
        name: '0.96" I2C OLED Screen Module',
        quantity: 1,
        why: 'High-contrast graphical display over 2 wires.',
      },
    ],
    steps: [
      {
        phase: 'Hardware',
        number: 1,
        title: 'Wire I2C Paths',
        instruction:
          "Connect the OLED's GND to Ground, VCC to 3.3V. Wire SDA to GPIO 21, and SCL to GPIO 22.",
        sanityCheck: 'Swapping SDA and SCL will prevent display boot.',
        proTip:
          'OLED glass is extremely fragile. Handle the plastic header only.',
      },
    ],
    observation:
      "The OLED screen lights up and cleanly displays 'BFIOT SYSTEM OK'.",
    faq: [
      {
        error: 'Screen remains totally black',
        cause: 'SDA and SCL pins are swapped or wrong I2C address.',
        solution:
          'Ensure SDA is on GPIO 21 and SCL is on GPIO 22. Verify the I2C address in code is 0x3C.',
      },
    ],
    code: {
      filename: 'oled_hello.ino',
      snippet: `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  Serial.begin(115200);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    for(;;); // Halt on error
  }
  
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 10);
  display.println("BFIOT SYSTEM OK");
  display.display(); // Push buffer to screen
}

void loop() {}`,
      breakdown:
        "We initiate communication at I2C address 0x3C. We write text to the ESP32's internal memory buffer quietly, then call `display.display()` to push the entire image to the glass instantly, preventing flickering.",
    },
  },
  m10: {
    title: 'Module 10: Environmental Sensing',
    phase: 'Phase 3: Actuation & Sensors',
    overview: {
      hook: 'Teach your project spatial and climate perception! We combine the DHT11 and Ultrasonic sensors to read the real world.',
      concept:
        'The DHT11 uses a thermistor, and the HC-SR04 uses sound waves. We trigger a high-frequency sound blast (40 kHz). By measuring the echo flight time, we calculate distance using the speed of sound.',
      difficulty: 'Intermediate Builder',
      buildTime: '60 mins',
    },
    parts: [
      {
        category: 'Sensors',
        name: 'DHT11 Sensor Module',
        quantity: 1,
        why: 'Reads temp and humidity (VCC, DATA, GND).',
      },
      {
        category: 'Sensors',
        name: 'HC-SR04 Ultrasonic',
        quantity: 1,
        why: 'Measures distance via sound waves.',
      },
    ],
    steps: [
      {
        phase: 'Hardware',
        number: 1,
        title: 'Sonar Setup',
        instruction:
          'Wire Ultrasonic VCC to VIN(5V), GND to Ground. Wire TRIG to GPIO 5, ECHO to GPIO 18.',
        sanityCheck:
          'Ensure VCC goes to 5V, not 3.3V, for stronger acoustic waves.',
        proTip:
          'Sound travels 343m/s. We divide the round-trip microsecond time to find distance.',
      },
    ],
    observation:
      'Your Serial Monitor continuously prints accurate distance measurements and climate data every couple of seconds.',
    faq: [
      {
        error: "DHT11 returns 'Failed to read' or 'nan'",
        cause: 'Querying the sensor too fast.',
        solution:
          'Ensure there is a delay of at least 2000ms between sensor reads in your loop.',
      },
    ],
    code: {
      filename: 'sensor_hub.ino',
      snippet: `const int TRIG_PIN = 5;
const int ECHO_PIN = 18;

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  
  // Screech for 10us
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Listen for echo
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.0343 / 2;
  
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  delay(200);
}`,
      breakdown:
        'We use `delayMicroseconds()` for surgical precision. A 10us pulse fires the acoustic screech. `pulseIn()` acts as a stopwatch, measuring how long the ECHO pin stays HIGH. We calculate distance by multiplying the time by the speed of sound and dividing by two for the round trip.',
    },
  },
  m11: {
    title: 'Module 11: Relay Power Control',
    phase: 'Phase 3: Actuation & Sensors',
    overview: {
      hook: 'Control industrial appliances safely! We are setting up a mechanical Relay module to toggle high-power devices using our tiny 3.3V chip.',
      concept:
        'A relay is an electromagnetic switch. Our microchip pin powers a coil, creating a magnetic field that physically pulls a metal contact to bridge a gap. This keeps our delicate 3.3V brain completely isolated from heavy loads.',
      difficulty: 'Weekend Warrior',
      buildTime: '40 mins',
    },
    parts: [
      {
        category: 'Actuators',
        name: '5V Relay Module',
        quantity: 1,
        why: 'Opto-isolated switch module.',
      },
    ],
    steps: [
      {
        phase: 'Hardware',
        number: 1,
        title: 'Control Wiring',
        instruction:
          "Hook the relay's GND to Ground, VCC to VIN(5V). Wire the IN control pin to GPIO 19.",
        sanityCheck:
          "You will hear a loud mechanical 'click' when the coil energizes.",
        proTip:
          '⚠️ PRO TIP: Never plug mains AC voltage into the relay during this tutorial! Test with battery power only.',
      },
    ],
    observation:
      "You will hear a distinct mechanical 'click' from the relay module every 3 seconds, and its onboard indicator LED will flash.",
    faq: [
      {
        error: 'Relay LED flashes but no click sound',
        cause: 'Not enough activation voltage.',
        solution:
          'Make sure the relay module VCC is connected to the 5V (VIN) pin, not 3.3V.',
      },
    ],
    code: {
      filename: 'relay_toggle.ino',
      snippet: `const int RELAY_PIN = 19;

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
}

void loop() {
  digitalWrite(RELAY_PIN, HIGH); // Click!
  delay(3000); 
  
  digitalWrite(RELAY_PIN, LOW); // Click!
  delay(3000); 
}`,
      breakdown:
        'Setting the pin HIGH energizes the electromagnet inside the blue box, physically swinging a copper plate closed to bridge the high-power circuit (NO terminal). LOW releases the spring.',
    },
  },
  m12: {
    title: 'Module 12: Local Web Server & Dashboard',
    phase: 'Phase 4: Connected IoT',
    overview: {
      hook: 'Welcome to the grand finale! We are decoupling from USB entirely, hosting a local Wi-Fi web server to toggle hardware from your smartphone browser.',
      concept:
        'The ESP32 generates its own private Wi-Fi network (Access Point Mode). Your phone logs in, requests an IP address, and the ESP32 serves up a custom HTML dashboard to trigger pins wirelessly.',
      difficulty: 'Intermediate Builder',
      buildTime: '1 hour',
    },
    parts: [
      {
        category: 'Microcontroller',
        name: 'ESP32 Dev Board',
        quantity: 1,
        why: 'Utilizing the built-in Wi-Fi radio antenna.',
      },
    ],
    steps: [
      {
        phase: 'Software',
        number: 1,
        title: 'Connect via Phone',
        instruction:
          "Upload code, open Phone WiFi, connect to 'BFIOT-Hub'. Visit 192.168.4.1 in your browser.",
        sanityCheck:
          'Tapping the HTML buttons on your phone screen will toggle the physical LED on your desk.',
        proTip:
          'Wi-Fi operates like an invisible ethernet cable. No ISP router needed for Access Point mode!',
      },
    ],
    observation:
      "Tapping the ON/OFF buttons on your phone's browser instantly toggles the physical LED connected to your ESP32.",
    faq: [
      {
        error: 'Phone cannot find the webpage',
        cause: 'Not connected to the correct network.',
        solution:
          "Ensure your phone's Wi-Fi is connected directly to the 'BFIOT-Hub' network.",
      },
    ],
    code: {
      filename: 'wifi_dashboard.ino',
      snippet: `#include <WiFi.h>
#include <WebServer.h>

WebServer server(80);
const int LED_PIN = 2;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  
  // Create our own Wi-Fi hotspot
  WiFi.softAP("BFIOT-Hub", "password123");
  
  server.on("/", [](){
    String html = "<h1>BFIOT Control</h1><a href='/on'>TURN ON</a> <br> <a href='/off'>TURN OFF</a>";
    server.send(200, "text/html", html);
  });
  
  server.on("/on", [](){ digitalWrite(LED_PIN, HIGH); server.sendHeader("Location","/"); server.send(303); });
  server.on("/off", [](){ digitalWrite(LED_PIN, LOW); server.sendHeader("Location","/"); server.send(303); });
  
  server.begin();
}

void loop() {
  server.handleClient(); // Listen for phone requests
}`,
      breakdown:
        "We boot the ESP32 radio in `softAP` mode. The `server.on` routing intercepts URL requests (like `/on`), triggers `digitalWrite()`, and instantly redirects the user's browser back to the main HTML dashboard.",
    },
  },
};

// ── BREADBOARD MECHANICS VISUALIZER (840-Point Standard) ───────────────
function BBViz({ T, activeWireState = true }) {
  const [hov, setHov] = useState(null);
  const R = 30,
    RH = 24,
    SY = 44; // Shifted CX coordinates outward to prevent rail overlaps
  const CX = {
    A: 60,
    B: 78,
    C: 96,
    D: 114,
    E: 132,
    F: 156,
    G: 174,
    H: 192,
    I: 210,
    J: 228,
  };
  const LC = ['A', 'B', 'C', 'D', 'E'],
    RC = ['F', 'G', 'H', 'I', 'J'];
  const ry = (r) => SY + (r - 1) * RH;
  const W = 288,
    H = SY + R * RH + 24;
  const dk = T.bg === '#04080f'; // Defined rail zones explicitly for easier hover grouping

  const RAILS = [
    { id: 'l_red', cx: 18, rx: 8, sign: '+', color: T.red },
    { id: 'l_blue', cx: 38, rx: 28, sign: '−', color: T.blue },
    { id: 'r_red', cx: 250, rx: 240, sign: '+', color: T.red },
    { id: 'r_blue', cx: 270, rx: 260, sign: '−', color: T.blue },
  ];

  return (
    <div style={{ position: 'relative' }}>
           {' '}
      <svg
        width={W}
        height={H}
        style={{
          borderRadius: 12,
          display: 'block',
          background: T.bbBg,
          border: `1px solid ${T.border}`,
        }}
      >
                         {/* Interactive Power Rails */}       {' '}
        {RAILS.map((rail) => {
          const isLit = hov?.id === rail.id;
          return (
            <g
              key={rail.id}
              style={{ cursor: 'crosshair', transition: 'all 0.1s' }}
              onMouseEnter={() =>
                setHov({
                  type: 'rail',
                  id: rail.id,
                  color: rail.color,
                  sign: rail.sign,
                })
              }
              onMouseLeave={() => setHov(null)}
            >
                           {' '}
              <rect
                x={rail.rx}
                y={SY - 16}
                width={20}
                height={H - SY + 8}
                rx={4}
                fill={
                  isLit
                    ? dk
                      ? '#0f172a'
                      : '#dbeafe'
                    : dk
                    ? '#040810'
                    : '#e0e7ff'
                }
              />
                           {' '}
              <line
                x1={rail.cx}
                y1={SY}
                x2={rail.cx}
                y2={H - 12}
                stroke={isLit ? rail.color : rail.color + '40'}
                strokeWidth={isLit ? 2 : 1.2}
              />
                           {' '}
              <text
                x={rail.cx}
                y={SY - 6}
                textAnchor="middle"
                fill={rail.color + '80'}
                fontSize={10}
                fontWeight={700}
                fontFamily="monospace"
              >
                {rail.sign}
              </text>
                           {' '}
              {Array.from({ length: R }, (_, i) => i + 1).map((row) => (
                <circle
                  key={row}
                  cx={rail.cx}
                  cy={ry(row)}
                  r={isLit ? 4.5 : 3.5}
                  fill={isLit ? rail.color : T.bbHole}
                  stroke={isLit ? rail.color : rail.color + '30'}
                  strokeWidth={1}
                />
              ))}
                         {' '}
            </g>
          );
        })}
               {' '}
        {/* Render physical wire connections if activeWireState is on */}       {' '}
        {activeWireState && (
          <g style={{ pointerEvents: 'none' }}>
                        {/* 3V3 Jumper (entering from top off-board) */}       
               {' '}
            <path
              d={`M 18 0 L 18 ${ry(1)}`}
              fill="none"
              stroke={T.red}
              strokeWidth={2.5}
              opacity={0.85}
            />
                        {/* GND Jumper (entering from top off-board) */}       
               {' '}
            <path
              d={`M 38 0 L 38 ${ry(1)}`}
              fill="none"
              stroke={T.blue}
              strokeWidth={2.5}
              opacity={0.85}
            />
                        {/* Resistor Jumper */}           {' '}
            <path
              d={`M 18 ${ry(10)} Q 35 ${ry(8)}, 60 ${ry(10)}`}
              fill="none"
              stroke={T.green}
              strokeWidth={2.5}
              opacity={0.85}
            />
                        {/* LED Jumper spanning 10 & 11 */}           {' '}
            <path
              d={`M 78 ${ry(10)} Q 86 ${ry(8)}, 78 ${ry(11)}`}
              fill="none"
              stroke={T.amber}
              strokeWidth={2.5}
              opacity={0.85}
            />
                        {/* Return loop jumper */}           {' '}
            <path
              d={`M 132 ${ry(11)} Q 90 ${ry(14)}, 38 ${ry(11)}`}
              fill="none"
              stroke="#2563eb"
              strokeWidth={2.5}
              opacity={0.85}
            />
                     {' '}
          </g>
        )}
                {/* Center Grid Elements */}       {' '}
        {[...LC, ...RC].map((c) => (
          <text
            key={c}
            x={CX[c]}
            y={SY - 7}
            textAnchor="middle"
            fill={T.textMuted}
            fontSize={8}
            fontFamily="monospace"
          >
            {c}
          </text>
        ))}
               {' '}
        <rect
          x={142}
          y={SY - 8}
          width={4}
          height={H - SY + 4}
          fill={T.bg}
          opacity={0.9}
        />
                        {' '}
        {Array.from({ length: R }, (_, i) => i + 1).map((row) => (
          <g key={row}>
                       {' '}
            <text
              x={144}
              y={ry(row) + 3}
              textAnchor="middle"
              fill={T.textMuted}
              fontSize={7}
              fontFamily="monospace"
            >
              {row}
            </text>
                                    {' '}
            {LC.map((c) => {
              const isLit =
                hov?.type === 'row' && hov.r === row && hov.s === 'l';
              return (
                <circle
                  key={c}
                  cx={CX[c]}
                  cy={ry(row)}
                  r={isLit ? 5.5 : 4.5}
                  fill={isLit ? T.primary : T.bbHole}
                  stroke={isLit ? T.primaryLight : T.bbHoleBorder}
                  strokeWidth={isLit ? 1.5 : 1}
                  style={{ cursor: 'crosshair', transition: 'all 0.1s' }}
                  onMouseEnter={() => setHov({ type: 'row', r: row, s: 'l' })}
                  onMouseLeave={() => setHov(null)}
                />
              );
            })}
                                    {' '}
            {RC.map((c) => {
              const isLit =
                hov?.type === 'row' && hov.r === row && hov.s === 'r';
              return (
                <circle
                  key={c}
                  cx={CX[c]}
                  cy={ry(row)}
                  r={isLit ? 5.5 : 4.5}
                  fill={isLit ? T.primary : T.bbHole}
                  stroke={isLit ? T.primaryLight : T.bbHoleBorder}
                  strokeWidth={isLit ? 1.5 : 1}
                  style={{ cursor: 'crosshair', transition: 'all 0.1s' }}
                  onMouseEnter={() => setHov({ type: 'row', r: row, s: 'r' })}
                  onMouseLeave={() => setHov(null)}
                />
              );
            })}
                     {' '}
          </g>
        ))}
             {' '}
      </svg>
                  {' '}
      <div
        style={{
          height: 30,
          display: 'flex',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
               {' '}
        {hov?.type === 'rail' ? (
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11.5,
              color: hov.color,
              fontWeight: 600,
            }}
          >
            ● Vertical {hov.sign === '+' ? 'Power' : 'Ground'} Rail — continuous
            copper strip
          </span>
        ) : hov?.type === 'row' ? (
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11.5,
              color: T.primary,
              fontWeight: 600,
            }}
          >
            ● Row {hov.r} — {hov.s === 'l' ? 'columns A–E' : 'columns F–J'} —
            shared copper strip
          </span>
        ) : (
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11,
              color: T.textMuted,
            }}
          >
            ↑ Hover any hole to see the copper strip underneath it
          </span>
        )}
             {' '}
      </div>
            {/* Physics Tooltip Overlay for Module 1 */}     {' '}
      {activeWireState && (
        <div
          style={{
            position: 'absolute',
            top: 120,
            right: -20,
            background: T.surface,
            border: `1px solid ${T.border}`,
            padding: '8px 12px',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
        >
                   {' '}
          <div
            style={{ color: T.primary, fontWeight: 'bold', marginBottom: 4 }}
          >
            Ohm's Law: LED Circuit
          </div>
                    <div style={{ color: T.textSub }}>V_source: 3.3V</div>     
              <div style={{ color: T.textSub }}>V_led: ~2.0V</div>         {' '}
          <div
            style={{
              color: T.textSub,
              borderTop: `1px solid ${T.border}`,
              marginTop: 4,
              paddingTop: 4,
            }}
          >
            V_drop (R): 1.3V
          </div>
                   {' '}
          <div style={{ color: T.green, fontWeight: 'bold' }}>
            I = 1.3V / 220Ω ≈ 6mA
          </div>
                 {' '}
        </div>
      )}
         {' '}
    </div>
  );
}

// ── CUSTOM LESSON SIMULATOR COMPONENT ─────────────────────────────────
function LessonSimulator({ pageId, T }) {
  const isDark = T.bg === '#04080f'; // Module 1 States

  const [wireOnE11, setWireOnE11] = useState(true); // Mechanical Dial & Button States (M2, M3, M4, M6)

  const [toggleStateA, setToggleStateA] = useState(false);
  const [toggleStateB, setToggleStateB] = useState(false);
  const [knobAngle, setKnobAngle] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null); // M5 (Blink timing)

  const [onboardBlink, setOnboardBlink] = useState(false);
  const [onDelay, setOnDelay] = useState(1000);
  const [offDelay, setOffDelay] = useState(1000); // Handle Rotary Dial Mouse Drag

  const handleMouseMove = (e) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = e.clientX - cx;
    const y = e.clientY - cy;
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360; // Clamp dial between 30 and 330 degrees for a realistic pot feel
    if (angle > 330) angle = 330;
    if (angle < 30) angle = 30;
    setKnobAngle(angle);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]); // Derived Potentiometer Value (0 to 100)

  const potVal = Math.round(((knobAngle - 30) / 300) * 100) || 0; // Blink precise interval engine (M5)

  useEffect(() => {
    if (pageId !== 'm5') return;
    let timer;
    const cycle = () => {
      setOnboardBlink((prev) => {
        const nextState = !prev;
        timer = setTimeout(cycle, nextState ? onDelay : offDelay);
        return nextState;
      });
    };
    timer = setTimeout(cycle, onDelay);
    return () => clearTimeout(timer);
  }, [pageId, onDelay, offDelay]);

  return (
    <div
      style={{
        width: '100%',
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      }}
    >
           {' '}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: `1px solid ${T.border}`,
          paddingBottom: 12,
          marginBottom: 16,
        }}
      >
               {' '}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: T.green,
          }}
          className="pulse"
        />
               {' '}
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "'JetBrains Mono'",
            color: T.textMuted,
          }}
        >
          VIRTUAL MAKE LAB // LIVE SIMULATION
        </span>
             {' '}
      </div>
           {' '}
      {pageId === 'm1' && (
        <div>
                   {' '}
          <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
            Simulate the jumper connection. Moving the ground wire from Row 11
            to a separate row breaks the physical loop.
          </p>
                   {' '}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: T.surfaceAlt,
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              marginBottom: 16,
            }}
          >
                       {' '}
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              Jumper Terminal Route:
            </span>
                       {' '}
            <button
              onClick={() => setWireOnE11(!wireOnE11)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                background: wireOnE11 ? T.primary : T.textMuted,
                color: 'white',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
                           {' '}
              {wireOnE11 ? 'Hooked to E11 (ON)' : 'Moved to E12 (OFF)'}         
               {' '}
            </button>
                     {' '}
          </div>
                   {' '}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 100,
              background: T.surfaceAlt,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
            }}
          >
                       {' '}
            <div style={{ textAlign: 'center' }}>
                           {' '}
              <div
                style={{
                  fontSize: 42,
                  filter: wireOnE11 ? `drop-shadow(0 0 15px ${T.red})` : 'none',
                  opacity: wireOnE11 ? 1 : 0.2,
                  transition: 'all 0.1s',
                }}
              >
                🔴
              </div>
                           {' '}
              <span
                style={{ fontSize: 11, fontWeight: 700, color: T.textMuted }}
              >
                CIRCUIT STATE: {wireOnE11 ? 'CLOSED LOOP' : 'BROKEN LOOP'}
              </span>
                         {' '}
            </div>
                     {' '}
          </div>
                 {' '}
        </div>
      )}
           {' '}
      {pageId === 'm2' && (
        <div>
                   {' '}
          <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
            Rotate the dial of your physical potentiometer. Observe the LED
            fading proportionally as resistance drops.
          </p>
                              {' '}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
                        {/* Circular Potentiometer Dial */}           {' '}
            <svg
              ref={svgRef}
              width="160"
              height="160"
              onMouseDown={(e) => {
                setIsDragging(true);
                handleMouseMove(e);
              }}
              style={{ cursor: 'pointer' }}
            >
                           {' '}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill={isDark ? '#1e293b' : '#e2e8f0'}
                stroke={T.border}
                strokeWidth="4"
              />
                            {/* Notches */}             {' '}
              {[30, 90, 150, 210, 270, 330].map((a) => (
                <line
                  key={a}
                  x1={80 + 55 * Math.cos(((a - 90) * Math.PI) / 180)}
                  y1={80 + 55 * Math.sin(((a - 90) * Math.PI) / 180)}
                  x2={80 + 65 * Math.cos(((a - 90) * Math.PI) / 180)}
                  y2={80 + 65 * Math.sin(((a - 90) * Math.PI) / 180)}
                  stroke={T.textMuted}
                  strokeWidth="2"
                />
              ))}
                            {/* Dial Indicator */}             {' '}
              <line
                x1="80"
                y1="80"
                x2={80 + 60 * Math.cos(((knobAngle - 90) * Math.PI) / 180)}
                y2={80 + 60 * Math.sin(((knobAngle - 90) * Math.PI) / 180)}
                stroke={T.amber}
                strokeWidth="6"
                strokeLinecap="round"
              />
                            <circle cx="80" cy="80" r="15" fill={T.amber} />   
                     {' '}
            </svg>
                     {' '}
          </div>
                              {' '}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 100,
              background: T.surfaceAlt,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
            }}
          >
                       {' '}
            <div style={{ textAlign: 'center' }}>
                           {' '}
              <div
                style={{
                  fontSize: 42,
                  filter: `drop-shadow(0 0 ${potVal / 4}px ${T.amber})`,
                  opacity: potVal / 100 + 0.15,
                  transition: 'all 0.1s',
                }}
              >
                💡
              </div>
                           {' '}
              <span
                style={{ fontSize: 11, fontWeight: 700, color: T.textMuted }}
              >
                LED INTENSITY: {potVal}%
              </span>
                         {' '}
            </div>
                     {' '}
          </div>
                 {' '}
        </div>
      )}
           {' '}
      {pageId === 'm3' && (
        <div>
                   {' '}
          <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
            Click the buttons to toggle their mechanical states. Observe the
            Boolean logic applied to the LED output.
          </p>
                   {' '}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                        {/* Click-to-Toggle Mechanical Buttons */}           {' '}
            <button
              onClick={() => setToggleStateA(!toggleStateA)}
              style={{
                flex: 1,
                padding: '20px 10px',
                borderRadius: 10,
                border: `2px solid ${T.border}`,
                background: toggleStateA ? T.green : T.surfaceAlt,
                color: toggleStateA ? 'white' : T.textSub,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.1s',
                boxShadow: toggleStateA
                  ? `inset 0 4px 6px rgba(0,0,0,0.2)`
                  : `0 4px 0 ${T.border}`,
                transform: toggleStateA ? 'translateY(4px)' : 'none',
              }}
            >
                            BUTTON A            {' '}
            </button>
                       {' '}
            <button
              onClick={() => setToggleStateB(!toggleStateB)}
              style={{
                flex: 1,
                padding: '20px 10px',
                borderRadius: 10,
                border: `2px solid ${T.border}`,
                background: toggleStateB ? T.green : T.surfaceAlt,
                color: toggleStateB ? 'white' : T.textSub,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.1s',
                boxShadow: toggleStateB
                  ? `inset 0 4px 6px rgba(0,0,0,0.2)`
                  : `0 4px 0 ${T.border}`,
                transform: toggleStateB ? 'translateY(4px)' : 'none',
              }}
            >
                            BUTTON B            {' '}
            </button>
                     {' '}
          </div>
                              {' '}
          <div
            style={{
              background: T.surfaceAlt,
              padding: 14,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
                         
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.primary,
                fontFamily: "'JetBrains Mono'",
                marginBottom: 6,
              }}
            >
              AND GATE LOGIC (SERIES)
            </div>
                         
            <div
              style={{
                fontSize: 32,
                filter:
                  toggleStateA && toggleStateB
                    ? `drop-shadow(0 0 15px ${T.red})`
                    : 'none',
                opacity: toggleStateA && toggleStateB ? 1 : 0.2,
                transition: 'all 0.1s',
              }}
            >
              🔴
            </div>
                     {' '}
          </div>
                   {' '}
          <div
            style={{
              background: T.surfaceAlt,
              padding: 14,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              textAlign: 'center',
            }}
          >
                         
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.amber,
                fontFamily: "'JetBrains Mono'",
                marginBottom: 6,
              }}
            >
              OR GATE LOGIC (PARALLEL)
            </div>
                         
            <div
              style={{
                fontSize: 32,
                filter:
                  toggleStateA || toggleStateB
                    ? `drop-shadow(0 0 15px ${T.amber})`
                    : 'none',
                opacity: toggleStateA || toggleStateB ? 1 : 0.2,
                transition: 'all 0.1s',
              }}
            >
              💡
            </div>
                     {' '}
          </div>
                 {' '}
        </div>
      )}
           {' '}
      {pageId === 'm4' && (
        <div>
                   {' '}
          <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
            Slide the ambient light level to affect the LDR module. Observe how
            the module's Digital Out triggers the LED when darkness falls.
          </p>
                   {' '}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
                        {/* Circular Dial acting as Ambient Light proxy */}     
                 {' '}
            <svg
              ref={svgRef}
              width="160"
              height="160"
              onMouseDown={(e) => {
                setIsDragging(true);
                handleMouseMove(e);
              }}
              style={{ cursor: 'pointer' }}
            >
                           {' '}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill={isDark ? '#1e293b' : '#e2e8f0'}
                stroke={T.border}
                strokeWidth="4"
              />
                           {' '}
              {[30, 90, 150, 210, 270, 330].map((a) => (
                <line
                  key={a}
                  x1={80 + 55 * Math.cos(((a - 90) * Math.PI) / 180)}
                  y1={80 + 55 * Math.sin(((a - 90) * Math.PI) / 180)}
                  x2={80 + 65 * Math.cos(((a - 90) * Math.PI) / 180)}
                  y2={80 + 65 * Math.sin(((a - 90) * Math.PI) / 180)}
                  stroke={T.textMuted}
                  strokeWidth="2"
                />
              ))}
                           {' '}
              <line
                x1="80"
                y1="80"
                x2={80 + 60 * Math.cos(((knobAngle - 90) * Math.PI) / 180)}
                y2={80 + 60 * Math.sin(((knobAngle - 90) * Math.PI) / 180)}
                stroke={T.primaryLight}
                strokeWidth="6"
                strokeLinecap="round"
              />
                           {' '}
              <circle cx="80" cy="80" r="15" fill={T.primaryLight} />           {' '}
            </svg>
                     {' '}
          </div>
                   {' '}
          <div
            style={{
              textAlign: 'center',
              marginBottom: 16,
              fontSize: 12,
              fontWeight: 'bold',
              color: T.textSub,
            }}
          >
            AMBIENT LIGHT (LDR) ({potVal}%)
          </div>
                   {' '}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120,
              background: '#04080f',
              borderRadius: 10,
              border: `1px solid ${T.border}`,
            }}
          >
                       {' '}
            <div style={{ textAlign: 'center' }}>
                           {' '}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: potVal < 50 ? T.green : T.red,
                  marginBottom: 8,
                }}
              >
                LDR MODULE DIGITAL OUT: {potVal < 50 ? 'HIGH' : 'LOW'}
              </div>
                           {' '}
              <div
                style={{
                  fontSize: 42,
                  filter: potVal < 50 ? `drop-shadow(0 0 20px #fff)` : 'none',
                  opacity: potVal < 50 ? 1 : 0.2,
                  transition: 'all 0.2s',
                }}
              >
                💡
              </div>
                         {' '}
            </div>
                     {' '}
          </div>
                 {' '}
        </div>
      )}
           {' '}
      {pageId === 'm5' && (
        <div>
                   {' '}
          <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
            Modulate the precise millisecond delay metrics inside setup and loop
            parameters and watch the simulated onboard LED timing.
          </p>
                   {' '}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 16,
            }}
          >
                       {' '}
            <div style={{ flex: 1 }}>
                           {' '}
              <label
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono'",
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                delay(ON_ms)
              </label>
                           {' '}
              <input
                type="number"
                value={onDelay}
                onChange={(e) => setOnDelay(parseInt(e.target.value) || 100)}
                style={{
                  width: '100%',
                  background: T.bg,
                  border: `1px solid ${T.border}`,
                  padding: 8,
                  borderRadius: 6,
                  color: T.text,
                  fontSize: 13,
                }}
              />
                         {' '}
            </div>
                       {' '}
            <div style={{ flex: 1 }}>
                           {' '}
              <label
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono'",
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                delay(OFF_ms)
              </label>
                           {' '}
              <input
                type="number"
                value={offDelay}
                onChange={(e) => setOffDelay(parseInt(e.target.value) || 100)}
                style={{
                  width: '100%',
                  background: T.bg,
                  border: `1px solid ${T.border}`,
                  padding: 8,
                  borderRadius: 6,
                  color: T.text,
                  fontSize: 13,
                }}
              />
                         {' '}
            </div>
                     {' '}
          </div>
                   {' '}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120,
              background: '#04080f',
              borderRadius: 10,
              border: `1px solid ${T.border}`,
            }}
          >
                       {' '}
            <div style={{ textAlign: 'center' }}>
                           {' '}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: onboardBlink ? '#3b82f6' : '#1e2d4a',
                  boxShadow: onboardBlink ? '0 0 20px #3b82f6' : 'none',
                  margin: '0 auto 10px',
                  transition: 'all 0.05s',
                }}
              />
                           {' '}
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono'",
                  color: '#888',
                }}
              >
                ESP32 ONBOARD GPIO_2 LED
              </span>
                         {' '}
            </div>
                     {' '}
          </div>
                 {' '}
        </div>
      )}
           {' '}
      {pageId === 'm6' && (
        <div>
                   {' '}
          <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
            Click the button to toggle its mechanical state. The INPUT_PULLUP
            logic in code flips the LED output.
          </p>
                   {' '}
          <button
            onClick={() => setToggleStateA(!toggleStateA)}
            style={{
              width: '100%',
              padding: '20px 10px',
              borderRadius: 10,
              border: `2px solid ${T.border}`,
              background: toggleStateA ? T.green : T.surfaceAlt,
              color: toggleStateA ? 'white' : T.textSub,
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.1s',
              boxShadow: toggleStateA
                ? `inset 0 4px 6px rgba(0,0,0,0.2)`
                : `0 4px 0 ${T.border}`,
              transform: toggleStateA ? 'translateY(4px)' : 'none',
              marginBottom: 16,
            }}
          >
                       {' '}
            {toggleStateA ? 'BUTTON PRESSED (LOW)' : 'BUTTON RELEASED (HIGH)'} 
                   {' '}
          </button>
                              {' '}
          <div
            style={{
              background: T.surfaceAlt,
              padding: 14,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
                         
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.primary,
                fontFamily: "'JetBrains Mono'",
                marginBottom: 6,
              }}
            >
              LED STATE
            </div>
                         
            <div
              style={{
                fontSize: 32,
                filter: toggleStateA
                  ? `drop-shadow(0 0 15px ${T.red})`
                  : 'none',
                opacity: toggleStateA ? 1 : 0.2,
                transition: 'all 0.1s',
              }}
            >
              🔴
            </div>
                     {' '}
          </div>
                 {' '}
        </div>
      )}
                   {/* Fallback for Phase 3/4 modules */}     {' '}
      {['m7', 'm8', 'm9', 'm10', 'm11', 'm12'].includes(pageId) && (
        <div style={{ padding: 20, textAlign: 'center' }}>
                     <div style={{ fontSize: 40, marginBottom: 10 }}>🚀</div>   
                 
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text }}>
            Simulator Online
          </h3>
                     
          <p style={{ fontSize: 13, color: T.textSub }}>
            Advanced Phase hardware parameters loaded into memory.
          </p>
                 {' '}
        </div>
      )}
         {' '}
    </div>
  );
}

// ── SAFETY INTERCEPT WARNING ─────────────────────────────────────────
function SafetyAlert({ result, T }) {
  const codeCheck =
    result && result.code && result.code.snippet ? result.code.snippet : '';
  const partsList = result && result.parts ? result.parts : [];
  const partsCheck = partsList.map((p) => p.name).join(' ');
  const isDangerous = `${codeCheck} ${partsCheck}`
    .toLowerCase()
    .match(/(relay|ac |110v|220v|mains|power socket|mains electrical)/);
  if (!isDangerous) return null;
  return (
    <div
      style={{
        background: T.red + '12',
        border: `1px solid ${T.red}30`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
      }}
      className="fu"
    >
            <span style={{ fontSize: 24 }}>⚡</span>     {' '}
      <div>
               {' '}
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.red,
            marginBottom: 6,
          }}
        >
          ⚠️ HIGH VOLTAGE WORKBENCH WARNING
        </div>
               {' '}
        <p style={{ fontSize: 13, color: T.textSub, lineHeight: 1.8 }}>
                    I detected references to high-voltage AC mains components.
          Never work on alternating current components while they are connected
          to a wall socket. Complete your breadboard and low-voltage connections
          first, and verify safe isolation parameters.        {' '}
        </p>
             {' '}
      </div>
         {' '}
    </div>
  );
}

// ── REFERRAL MODAL ───────────────────────────────────────────────────
function Referral({ T, onClose }) {
  const [name, setName] = useState('');
  const [ok, setOk] = useState(false);
  const txt = `I just unlocked the Beginners Formula to IoT platform!\n\nThe breadboard visualizer is genuinely something else — hover any row and the hidden copper tracks light up live. Plus there's an AI project builder that spits out full ESP32 code for any IoT idea you throw at it.\n\nbfiot.vercel.app\n\n— ${
    name || 'A curious builder'
  }`;
  const copy = () => {
    const el = document.createElement('textarea');
    el.value = txt;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setOk(true);
    setTimeout(() => setOk(false), 2500);
  };
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
           {' '}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
               {' '}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${T.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
                   {' '}
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: T.text,
                marginBottom: 2,
              }}
            >
              Share the Platform
            </div>
            <div style={{ fontSize: 12, color: T.textSub }}>
              Generate your referral card
            </div>
          </div>
                   {' '}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: T.textSub,
              fontSize: 22,
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
                 {' '}
        </div>
               {' '}
        <div style={{ padding: '20px 24px' }}>
                   {' '}
          <label
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T.textSub,
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: 0.5,
              display: 'block',
              marginBottom: 8,
            }}
          >
            YOUR NAME
          </label>
                   {' '}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Adharsh Suvi"
            style={{
              width: '100%',
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 14,
              color: T.text,
              marginBottom: 16,
              display: 'block',
            }}
          />
                   {' '}
          <div
            style={{
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: '14px 16px',
              marginBottom: 14,
            }}
          >
                       {' '}
            <div
              style={{
                fontSize: 9,
                color: T.primary,
                fontFamily: "'JetBrains Mono',monospace",
                marginBottom: 8,
                fontWeight: 700,
              }}
            >
              PREVIEW
            </div>
                       {' '}
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.82,
                color: T.textSub,
                margin: 0,
                whiteSpace: 'pre-line',
              }}
            >
              {txt}
            </p>
                     {' '}
          </div>
                   {' '}
          <button
            onClick={copy}
            style={{
              width: '100%',
              background: ok ? T.greenBg : T.primary,
              border: ok ? `1px solid ${T.greenBorder}` : 'none',
              borderRadius: 10,
              color: ok ? T.green : 'white',
              padding: '13px',
              fontWeight: 700,
              fontSize: 14,
              transition: 'all 0.2s',
            }}
          >
            {ok ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
                 {' '}
        </div>
             {' '}
      </div>
         {' '}
    </div>
  );
}

// ── PROJECT LAB COMPONENT ────────────────────────────────────────────
const EXAMPLES = [
  'Smart plant watering system',
  'Room temperature monitor on OLED',
  'Motion-triggered alarm with buzzer',
  'Web-controlled LED from phone',
  'Ultrasonic parking distance sensor',
  'Smart automatic night light',
];

const LOAD_MSGS = [
  'Firing up the ESP32 brain...',
  'Mapping out your circuit...',
  'Writing clean code...',
  'Refining compilation instructions...',
];

function ProjectLabPage({ T, result, setResult, history, setHistory }) {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState(0);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('overview'); // Floating Interactive Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLog, setChatLog] = useState([
    { r: 'ai', m: "I'm ready. What's on your workbench today?" },
  ]);
  const [chatIn, setChatIn] = useState('');
  const [chatLoad, setChatLoad] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(
      () => setLoadMsg((m) => (m + 1) % LOAD_MSGS.length),
      1800
    );
    return () => clearInterval(iv);
  }, [loading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, chatOpen]); // Persistence Load on Mount

  useEffect(() => {
    const saved = localStorage.getItem('bfiot_current_project');
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('bfiot_current_project');
      }
    }
  }, [setResult]);

  const generate = async () => {
    if (!idea.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setChatOpen(false);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OR_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://bfiot.vercel.app',
          'X-Title': 'BFIOT Workbench',
        },
        body: JSON.stringify({
          model: OR_MODEL,
          messages: [
            { role: 'system', content: PROJ_SYSTEM },
            { role: 'user', content: `Build me this: ${idea}` },
          ],
          max_tokens: 2500,
        }),
      });
      if (!res.ok) throw new Error('API call failed');
      const d = await res.json();
      const raw = d.choices?.[0]?.message?.content || ''; // Boundaries extracted safely
      const parsed = safeJSONParse(raw);
      setResult(parsed);
      setTab('overview');
      localStorage.setItem('bfiot_current_project', JSON.stringify(parsed)); // Update persistent Maker's log
      const logItem = {
        id: Date.now(),
        name: parsed.code?.filename || 'hardware_project',
        data: parsed,
      };
      setHistory((prev) => {
        const updated = [
          logItem,
          ...prev.filter((item) => item.data.code?.filename !== logItem.name),
        ].slice(0, 10);
        localStorage.setItem('bfiot_history_log', JSON.stringify(updated));
        return updated;
      });

      setChatLog([
        {
          r: 'ai',
          m: `I generated your project blueprint! Ask me anything about the wiring steps or the logic.`,
        },
      ]);
    } catch (e) {
      setError(
        'Something went wrong during generation. Check your API parameters or write-up syntax.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatIn.trim() || chatLoad) return;
    const userQuery = chatIn;
    setChatIn('');
    setChatLog((prev) => [...prev, { r: 'user', m: userQuery }]);
    setChatLoad(true);

    try {
      const projectBrief = {
        brief: result.overview,
        wiring: (result.steps || []).map(
          (s) => `Step ${s.number}: ${s.title} (${s.instruction})`
        ),
        code: result.code?.snippet,
      };

      const systemPrompt = `You are the technical mentor from the YouTube channel "BFIOT".
      You are helping the user assemble the following project. Avoid generic replies.
      PROJECT WORKBENCH DATA:
      ${JSON.stringify(projectBrief)}

      Keep your answers helpful, highly brief (max 2-3 sentences), and explain matching the active pinouts.`;

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OR_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OR_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuery },
          ],
          max_tokens: 300,
        }),
      });
      const d = await res.json();
      const answer =
        d.choices?.[0]?.message?.content || "I couldn't fetch an answer.";
      setChatLog((prev) => [...prev, { r: 'ai', m: answer }]);
    } catch (e) {
      setChatLog((prev) => [
        ...prev,
        { r: 'ai', m: "Dropped connection packet. Let's try that again." },
      ]);
    } finally {
      setChatLoad(false);
    }
  };

  const exportMarkdown = () => {
    if (!result) return;
    const overview = result.overview || {};
    let md = `# ${overview.hook || 'Project Blueprint'}\n\n**Concept:** ${
      overview.concept
    }\n**Difficulty:** ${overview.difficulty} | **Time:** ${
      overview.buildTime
    }\n\n## Parts Needed\n`;
    (result.parts || []).forEach(
      (p) => (md += `- ${p.quantity}x ${p.name} (${p.why})\n`)
    );
    md += `\n## Wiring Instructions\n`;
    (result.steps || []).forEach((s) => {
      md += `### ${s.number}. ${s.title}\n${s.instruction}\n`;
      if (s.sanityCheck) md += `> **Check:** ${s.sanityCheck}\n`;
      if (s.proTip) md += `> **Tip:** ${s.proTip}\n`;
    });
    if (result.code) {
      md += `\n## Code (${result.code.filename})\n\`\`\`cpp\n${result.code.snippet}\n\`\`\`\n\n**Logic:** ${result.code.breakdown}`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${
      result.code?.filename?.replace('.ino', '') || 'project'
    }_blueprint.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyCode = () => {
    if (!result?.code) return;
    const el = document.createElement('textarea');
    el.value = result.code.snippet;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', position: 'relative' }}>
            {/* Header */}     {' '}
      <div style={{ marginBottom: 36 }}>
               {' '}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: T.greenBg,
            border: `1px solid ${T.greenBorder}`,
            borderRadius: 20,
            padding: '4px 12px',
            marginBottom: 18,
          }}
        >
                    <Beaker s={12} c={T.green} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: T.green,
              letterSpacing: 0.5,
            }}
          >
            AI PROJECT LAB
          </span>
                 {' '}
        </div>
               {' '}
        <h1
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: T.text,
            lineHeight: 1.15,
            marginBottom: 14,
          }}
        >
                    Tell me what you want to build.
          <br />
          <span style={{ color: T.primary }}>I'll handle the rest.</span>       {' '}
        </h1>
               {' '}
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.9,
            color: T.textSub,
            maxWidth: 580,
          }}
        >
                    Enter any IoT concept or component combination. I'll
          construct a centered, clean blueprint with active breadboard steps,
          categorised parts, and commented C++ code.        {' '}
        </p>
             {' '}
      </div>
            {/* Input */}     {' '}
      <Cd T={T} style={{ padding: 24, marginBottom: 20 }}>
               {' '}
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              generate();
            }
          }}
          placeholder="e.g. I want to build an automated soil tracker with ESP32..."
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            fontSize: 15,
            color: T.text,
            lineHeight: 1.8,
            resize: 'none',
            height: 80,
            display: 'block',
          }}
        />
               {' '}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${T.border}`,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
                   {' '}
          <span
            style={{
              fontSize: 11,
              color: T.textMuted,
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            ↵ Enter to generate · Shift+Enter for new line
          </span>
                   {' '}
          <button
            onClick={generate}
            disabled={!idea.trim() || loading}
            style={{
              background: idea.trim() && !loading ? T.primary : 'transparent',
              border: `1px solid ${
                idea.trim() && !loading ? T.primary : T.border
              }`,
              borderRadius: 8,
              color: idea.trim() && !loading ? 'white' : T.textMuted,
              padding: '9px 22px',
              fontWeight: 700,
              fontSize: 13,
              opacity: loading ? 0.7 : 1,
            }}
          >
                       {' '}
            {loading ? 'Assembling Framework...' : 'Generate Project →'}       
             {' '}
          </button>
                 {' '}
        </div>
             {' '}
      </Cd>
            {/* Suggested Quick Starts */}     {' '}
      {!result && !loading && (
        <div style={{ marginBottom: 32 }}>
                   {' '}
          <div
            style={{
              fontSize: 11,
              color: T.textMuted,
              fontFamily: "'JetBrains Mono',monospace",
              marginBottom: 10,
            }}
          >
            QUICK BENCHMARK STARTS
          </div>
                   {' '}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                       {' '}
            {EXAMPLES.map((e) => (
              <button
                key={e}
                onClick={() => setIdea(e)}
                style={{
                  background: T.chip,
                  border: `1px solid ${T.chipBorder}`,
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontSize: 13,
                  color: T.textSub,
                  transition: 'all 0.15s',
                }}
              >
                                {e}             {' '}
              </button>
            ))}
                     {' '}
          </div>
                 {' '}
        </div>
      )}
            {/* Loading state indicator */}     {' '}
      {loading && (
        <Cd
          T={T}
          style={{
            padding: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
            marginBottom: 20,
          }}
        >
                   {' '}
          <div
            className="spin"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: `3px solid ${T.border}`,
              borderTop: `3px solid ${T.primary}`,
              marginBottom: 20,
            }}
          />
                   {' '}
          <div
            className="shim"
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: T.primary,
              fontFamily: "'JetBrains Mono',monospace",
              textAlign: 'center',
            }}
          >
            {LOAD_MSGS[loadMsg]}
          </div>
                 {' '}
        </Cd>
      )}
           {' '}
      {error && (
        <div
          style={{
            background: T.amberBg,
            border: `1px solid ${T.amberBorder}`,
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: 20,
          }}
        >
                    <p style={{ fontSize: 13.5, color: T.amber }}>{error}</p>   
             {' '}
        </div>
      )}
            {/* Results Section */}     {' '}
      {result && (
        <div className="fu">
                    {/* Dynamic Safety Checker */}
                    <SafetyAlert result={result} T={T} />         {' '}
          {/* Action Tabs and Export Toolbar */}         {' '}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
                       {' '}
            <div
              style={{
                display: 'flex',
                gap: 4,
                background: T.surfaceAlt,
                borderRadius: 10,
                padding: 4,
                border: `1px solid ${T.border}`,
                flex: 1,
                maxWidth: 400,
              }}
            >
                           {' '}
              {[
                { id: 'overview', l: 'Overview' },
                { id: 'parts', l: 'Parts' },
                { id: 'steps', l: 'Steps' },
                { id: 'code', l: 'Code' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1,
                    padding: '7px 0',
                    borderRadius: 7,
                    border: 'none',
                    background: tab === t.id ? T.surface : 'transparent',
                    color: tab === t.id ? T.text : T.textSub,
                    fontWeight: tab === t.id ? 700 : 500,
                    fontSize: 13,
                    transition: 'all 0.15s',
                    boxShadow:
                      tab === t.id ? `0 1px 3px rgba(0,0,0,0.1)` : 'none',
                  }}
                >
                                    {t.l}               {' '}
                </button>
              ))}
                         {' '}
            </div>
                       {' '}
            <div style={{ display: 'flex', gap: 10 }}>
                           {' '}
              <button
                onClick={() => setChatOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: T.amberBg,
                  border: `1px solid ${T.amberBorder}`,
                  color: T.amber,
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                💬 Mentoring Chat
              </button>
                           {' '}
              <button
                onClick={exportMarkdown}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  color: T.text,
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ↓ Save Blueprint (.md)
              </button>
                         {' '}
            </div>
                     {' '}
          </div>
                    {/* Overview Tab Content */}         {' '}
          {tab === 'overview' && (
            <div>
                           {' '}
              <div
                style={{
                  background: `linear-gradient(135deg,${T.primaryBg},${T.greenBg})`,
                  border: `1px solid ${T.primaryBorder}`,
                  borderRadius: 14,
                  padding: 28,
                  marginBottom: 20,
                }}
              >
                               {' '}
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.85,
                    color: T.text,
                    fontWeight: 500,
                    marginBottom: 20,
                  }}
                >
                  {result.overview?.hook}
                </p>
                               {' '}
                <p
                  style={{ fontSize: 14.5, lineHeight: 1.9, color: T.textSub }}
                >
                  {result.overview?.concept}
                </p>
                             {' '}
              </div>
                           {' '}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                               {' '}
                <div
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: '12px 18px',
                    flex: 1,
                    minWidth: 140,
                  }}
                >
                                   {' '}
                  <div
                    style={{
                      fontSize: 10,
                      color: T.textMuted,
                      fontFamily: "'JetBrains Mono',monospace",
                      marginBottom: 6,
                    }}
                  >
                    DIFFICULTY
                  </div>
                                   {' '}
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: T.green }}
                  >
                    {result.overview?.difficulty}
                  </div>
                                 {' '}
                </div>
                               {' '}
                <div
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: '12px 18px',
                    flex: 1,
                    minWidth: 140,
                  }}
                >
                                   {' '}
                  <div
                    style={{
                      fontSize: 10,
                      color: T.textMuted,
                      fontFamily: "'JetBrains Mono',monospace",
                      marginBottom: 6,
                    }}
                  >
                    BUILD TIME
                  </div>
                                   {' '}
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
                    {result.overview?.buildTime}
                  </div>
                                 {' '}
                </div>
                               {' '}
                <div
                  style={{
                    background: T.primaryBg,
                    border: `1px solid ${T.primaryBorder}`,
                    borderRadius: 10,
                    padding: '12px 18px',
                    flex: 1,
                    minWidth: 140,
                  }}
                >
                                   {' '}
                  <div
                    style={{
                      fontSize: 10,
                      color: T.textMuted,
                      fontFamily: "'JetBrains Mono',monospace",
                      marginBottom: 6,
                    }}
                  >
                    MICROCONTROLLER
                  </div>
                                   {' '}
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: T.primary }}
                  >
                    ESP32 Dev Board
                  </div>
                                 {' '}
                </div>
                             {' '}
              </div>
                         {' '}
            </div>
          )}
                    {/* Parts Tab Content */}         {' '}
          {tab === 'parts' && (
            <div>
                           {' '}
              {Object.entries(
                (result.parts || []).reduce((acc, p) => {
                  (acc[p.category] = acc[p.category] || []).push(p);
                  return acc;
                }, {})
              ).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: 20 }}>
                                   {' '}
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: T.primary,
                      fontFamily: "'JetBrains Mono',monospace",
                      letterSpacing: 0.5,
                      marginBottom: 10,
                      padding: '0 4px',
                    }}
                  >
                    {cat.toUpperCase()}
                  </div>
                                   {' '}
                  <Cd T={T} style={{ overflow: 'hidden' }}>
                                       {' '}
                    {items.map((p, i) => (
                      <div
                        key={p.name}
                        style={{
                          display: 'flex',
                          gap: 16,
                          padding: '14px 18px',
                          borderBottom:
                            i < items.length - 1
                              ? `1px solid ${T.border}`
                              : 'none',
                          alignItems: 'flex-start',
                        }}
                      >
                                               {' '}
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 7,
                            background: T.primaryBg,
                            border: `1px solid ${T.primaryBorder}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: 12,
                            fontWeight: 700,
                            color: T.primary,
                            flexShrink: 0,
                          }}
                        >
                          ×{p.quantity}
                        </div>
                                               {' '}
                        <div style={{ flex: 1 }}>
                                                   {' '}
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: T.text,
                              marginBottom: 4,
                            }}
                          >
                            {p.name}
                          </div>
                                                   {' '}
                          <p
                            style={{
                              fontSize: 13,
                              color: T.textSub,
                              lineHeight: 1.65,
                            }}
                          >
                            {p.why}
                          </p>
                                                 {' '}
                        </div>
                                             {' '}
                      </div>
                    ))}
                                     {' '}
                  </Cd>
                                 {' '}
                </div>
              ))}
                         {' '}
            </div>
          )}
                    {/* Steps Tab Content */}         {' '}
          {tab === 'steps' && (
            <div>
                           {' '}
              {Object.entries(
                (result.steps || []).reduce((acc, s) => {
                  (acc[s.phase] = acc[s.phase] || []).push(s);
                  return acc;
                }, {})
              ).map(([phase, steps]) => (
                <div key={phase} style={{ marginBottom: 24 }}>
                                   {' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                                       {' '}
                    <div style={{ height: 1, flex: 1, background: T.border }} />
                                       {' '}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: T.primary,
                        fontFamily: "'JetBrains Mono',monospace",
                        letterSpacing: 0.5,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {phase.toUpperCase()}
                    </span>
                                       {' '}
                    <div style={{ height: 1, flex: 1, background: T.border }} />
                                     {' '}
                  </div>
                                   {' '}
                  <Cd T={T} style={{ overflow: 'hidden' }}>
                                       {' '}
                    {steps.map((s, i) => (
                      <div
                        key={s.number}
                        style={{
                          padding: '18px 20px',
                          borderBottom:
                            i < steps.length - 1
                              ? `1px solid ${T.border}`
                              : 'none',
                        }}
                      >
                                               {' '}
                        <div
                          style={{
                            display: 'flex',
                            gap: 14,
                            marginBottom: s.sanityCheck || s.proTip ? 12 : 0,
                          }}
                        >
                                                   {' '}
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 6,
                              background: T.primaryBg,
                              border: `1px solid ${T.primaryBorder}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: 10,
                              fontWeight: 600,
                              color: T.primary,
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {String(s.number).padStart(2, '0')}
                          </div>
                                                   {' '}
                          <div style={{ flex: 1 }}>
                                                       {' '}
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: T.text,
                                marginBottom: 6,
                              }}
                            >
                              {s.title}
                            </div>
                                                       {' '}
                            <p
                              style={{
                                fontSize: 13.5,
                                color: T.textSub,
                                lineHeight: 1.78,
                              }}
                            >
                              {s.instruction}
                            </p>
                                                     {' '}
                          </div>
                                                 {' '}
                        </div>
                                               {' '}
                        {s.sanityCheck && (
                          <div
                            style={{
                              marginLeft: 40,
                              background: T.greenBg,
                              border: `1px solid ${T.greenBorder}`,
                              borderRadius: 7,
                              padding: '9px 14px',
                              marginBottom: s.proTip ? 8 : 0,
                            }}
                          >
                                                     {' '}
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: T.green,
                                fontFamily: "'JetBrains Mono',monospace",
                                marginRight: 6,
                              }}
                            >
                              ✓ SANITY CHECK
                            </span>
                                                     {' '}
                            <span style={{ fontSize: 12.5, color: T.textSub }}>
                              {s.sanityCheck}
                            </span>
                                                   {' '}
                          </div>
                        )}
                                               {' '}
                        {s.proTip && (
                          <div
                            style={{
                              marginLeft: 40,
                              background: T.amberBg,
                              border: `1px solid ${T.amberBorder}`,
                              borderRadius: 7,
                              padding: '9px 14px',
                            }}
                          >
                                                     {' '}
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: T.amber,
                                fontFamily: "'JetBrains Mono',monospace",
                                marginRight: 6,
                              }}
                            >
                              ⚠️ PRO TIP
                            </span>
                                                     {' '}
                            <span style={{ fontSize: 12.5, color: T.textSub }}>
                              {s.proTip}
                            </span>
                                                   {' '}
                          </div>
                        )}
                                             {' '}
                      </div>
                    ))}
                                     {' '}
                  </Cd>
                                 {' '}
                </div>
              ))}
                         {' '}
            </div>
          )}
                    {/* Code Tab Content */}         {' '}
          {tab === 'code' && (
            <div>
                           {' '}
              {result.code ? (
                <>
                                   {' '}
                  <div
                    style={{
                      background: T.codeBg,
                      border: `1px solid ${T.border}`,
                      borderRadius: 12,
                      overflow: 'hidden',
                      marginBottom: 20,
                    }}
                  >
                                       {' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 18px',
                        borderBottom: `1px solid ${T.border}`,
                        background: 'rgba(0,0,0,0.15)',
                      }}
                    >
                                           {' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                                               {' '}
                        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                          <div
                            key={c}
                            style={{
                              width: 11,
                              height: 11,
                              borderRadius: '50%',
                              background: c,
                            }}
                          />
                        ))}
                                               {' '}
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: 11,
                            color: T.textMuted,
                            marginLeft: 8,
                          }}
                        >
                          {result.code.filename}
                        </span>
                                             {' '}
                      </div>
                                           {' '}
                      <button
                        onClick={copyCode}
                        style={{
                          background: 'none',
                          border: `1px solid ${T.border}`,
                          borderRadius: 6,
                          padding: '4px 12px',
                          fontSize: 11,
                          color: T.textSub,
                          fontFamily: "'JetBrains Mono',monospace",
                        }}
                      >
                                                Copy                      {' '}
                      </button>
                                         {' '}
                    </div>
                                       {' '}
                    <pre
                      style={{
                        padding: '20px 22px',
                        overflowX: 'auto',
                        margin: 0,
                      }}
                    >
                                           {' '}
                      <code
                        dangerouslySetInnerHTML={codeLight(result.code.snippet)}
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: 12.5,
                          lineHeight: 1.9,
                          display: 'block',
                        }}
                      />
                                         {' '}
                    </pre>
                                     {' '}
                  </div>
                                   {' '}
                  <div
                    style={{
                      background: T.primaryBg,
                      border: `1px solid ${T.primaryBorder}`,
                      borderRadius: 12,
                      padding: '20px 22px',
                      marginBottom: 40,
                    }}
                  >
                                       {' '}
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: T.primary,
                        fontFamily: "'JetBrains Mono',monospace",
                        marginBottom: 10,
                      }}
                    >
                      🧠 LOGIC BREAKDOWN
                    </div>
                                       {' '}
                    <p
                      style={{
                        fontSize: 14,
                        color: T.textSub,
                        lineHeight: 1.9,
                      }}
                    >
                      {result.code.breakdown}
                    </p>
                                     {' '}
                  </div>
                                 {' '}
                </>
              ) : (
                <div
                  style={{
                    padding: 40,
                    textAlign: 'center',
                    background: T.surfaceAlt,
                    borderRadius: 12,
                    border: `1px dashed ${T.border}`,
                  }}
                >
                                   {' '}
                  <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>     
                             {' '}
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: T.text,
                      marginBottom: 6,
                    }}
                  >
                    Hardware Only Project
                  </div>
                                   {' '}
                  <p style={{ fontSize: 14, color: T.textSub }}>
                    This phase requires no software compilation. Pure physics!
                  </p>
                                 {' '}
                </div>
              )}
                         {' '}
            </div>
          )}
                    {/* Rebuild Reset */}         {' '}
          <button
            onClick={() => {
              setResult(null);
              setIdea('');
              localStorage.removeItem('bfiot_current_project');
            }}
            style={{
              marginTop: 24,
              background: 'none',
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: '9px 18px',
              fontSize: 13,
              color: T.textSub,
              display: 'block',
            }}
          >
                        ← Build a different project          {' '}
          </button>
                 {' '}
        </div>
      )}
            {/* Floating Glassmorphic Mentor Chat Panel */}     {' '}
      {chatOpen && result && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 340,
            height: 480,
            background:
              T.bg === '#04080f'
                ? 'rgba(8,15,28,0.88)'
                : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
          className="fu"
        >
                   {' '}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
                       {' '}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                           {' '}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: T.green,
                }}
                className="pulse"
              />
                           {' '}
              <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
                AI Project Mentor
              </span>
                         {' '}
            </div>
                       {' '}
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: T.textSub,
                cursor: 'pointer',
              }}
            >
              <CloseIcon s={18} />
            </button>
                     {' '}
          </div>
                   {' '}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
                       {' '}
            {chatLog.map((log, i) => (
              <div
                key={i}
                style={{
                  alignSelf: log.r === 'user' ? 'flex-end' : 'flex-start',
                  background: log.r === 'user' ? T.primary : T.surfaceAlt,
                  color: log.r === 'user' ? 'white' : T.text,
                  padding: '10px 14px',
                  borderRadius: 12,
                  maxWidth: '85%',
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  border: log.r === 'user' ? 'none' : `1px solid ${T.border}`,
                }}
              >
                                {log.m}             {' '}
              </div>
            ))}
                       {' '}
            {chatLoad && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 12,
                  color: T.textMuted,
                  fontFamily: "'JetBrains Mono'",
                }}
                className="pulse"
              >
                Formulating feedback...
              </div>
            )}
                        <div ref={chatEndRef} />         {' '}
          </div>
                   {' '}
          <div style={{ padding: 12, borderTop: `1px solid ${T.border}` }}>
                       {' '}
            <input
              value={chatIn}
              onChange={(e) => setChatIn(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChat()}
              placeholder="Ask me about this circuit's pins or code..."
              style={{
                width: '100%',
                background: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 13,
                color: T.text,
              }}
            />
                     {' '}
          </div>
                 {' '}
        </div>
      )}
         {' '}
    </div>
  );
}

// ── LOCKED MODULAR VIEWS (Fallback Component) ─────────────────────────
function LockedPage({ info, T, unlocked, setUnlocked }) {
  const title = info ? info.title : 'Module Locked';
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Talk to our new Vercel Serverless Function
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode }),
      });

      if (response.ok) {
        setUnlocked(true);
        // Persist the login state so they don't get kicked out on refresh
        localStorage.setItem('bfiot_unlocked', 'true');
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid access key.');
      }
    } catch (err) {
      setError('Network error. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 520,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 40px',
        maxWidth: 560,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: T.primaryBg,
          border: `1px solid ${T.primaryBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <svg width={26} height={30} viewBox="0 0 26 30" fill="none">
          <rect
            x={2}
            y={12}
            width={22}
            height={16}
            rx={4}
            stroke={T.primary}
            strokeWidth={1.5}
          />
          <path
            d="M7 12V7.5a6 6 0 0112 0V12"
            stroke={T.primary}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <circle cx={13} cy={20} r={2.5} fill={T.primary} opacity={0.5} />
        </svg>
      </div>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: T.text,
          marginBottom: 12,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 15,
          color: T.textSub,
          maxWidth: 380,
          lineHeight: 1.9,
          marginBottom: 28,
        }}
      >
        {unlocked
          ? 'Module unlocked via system parameters.'
          : 'Enter the access key provided with your hardware kit to unlock the curriculum.'}
      </p>

      {!unlocked && (
        <form
          onSubmit={handleUnlock}
          style={{
            width: '100%',
            maxWidth: 320,
            position: 'relative',
            zIndex: 10,
          }}
        >
          <input
            type="text"
            placeholder="Enter Access Key..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            style={{
              width: '100%',
              background: T.surface,
              border: `1px solid ${error ? T.red : T.border}`,
              borderRadius: 10,
              padding: '12px 16px',
              fontSize: 14,
              color: T.text,
              marginBottom: 12,
              textAlign: 'center',
              letterSpacing: 1,
            }}
          />
          {error && (
            <div
              style={{
                fontSize: 12,
                color: T.red,
                marginBottom: 12,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !inputCode.trim()}
            style={{
              width: '100%',
              background: T.primary,
              borderRadius: 10,
              color: 'white',
              padding: '12px',
              fontWeight: 700,
              fontSize: 14,
              cursor: loading || !inputCode.trim() ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              border: 'none',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Verifying...' : 'Unlock Workbench →'}
          </button>
        </form>
      )}

      {/* Decorative blurred code snippet in the background */}
      <div style={{ marginTop: 40, width: '100%', position: 'relative' }}>
        <div
          style={{
            filter: 'blur(5px)',
            opacity: 0.1,
            pointerEvents: 'none',
            userSelect: 'none',
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 22,
            textAlign: 'left',
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              color: T.textSub,
              lineHeight: 2.2,
            }}
          >
            {'#define LED_PIN 2'}
            <br />
            {'void setup() {'}
            <br />
            {'  pinMode(LED_PIN, OUTPUT);'}
            <br />
            {'}'}
            <br />
            {'void loop() {'}
            <br />
            {'  digitalWrite(LED_PIN, HIGH);'}
            <br />
            {'  delay(1000);'}
            <br />
            {'}'}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '65%',
            background: `linear-gradient(to top,${T.bg},transparent)`,
            borderRadius: '0 0 12px 12px',
          }}
        />
      </div>
    </div>
  );
}

// ── ROOT APP CONTROLLER ──────────────────────────────────────────────
const LINFO = {
  m1: { title: 'Module 1: The Physical Handshake' },
  m2: { title: 'Module 2: The Analog Bridge' },
  m3: { title: 'Module 3: Physical Logic Gates' },
  m4: { title: 'Module 4: The Automatic Night Light' },
  m5: { title: 'Module 5: The Software Gatekeeper' },
  m6: { title: 'Module 6: Digital Inputs & If-Statements' },
  m7: { title: 'Module 7: Analog Outputs & PWM' },
  m8: { title: 'Module 8: Servos & Motors' },
  m9: { title: 'Module 9: OLED Displays (I2C)' },
  m10: { title: 'Module 10: Environmental Sensing' },
  m11: { title: 'Module 11: Relay Power Control' },
  m12: { title: 'Module 12: Local Web Server' },
};

export default function App() {
  const [dark, setDark] = useState(false);
  const T = dark ? DARK : LIGHT;
  const [page, setPage] = useState('gz'); // default to Ground Zero
  const [p1, setP1] = useState(true);
  const [p2, setP2] = useState(true);
  const [p3, setP3] = useState(true);
  const [p4, setP4] = useState(true);
  const [modal, setModal] = useState(false);
  const [k, setK] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  useEffect(() => setFaqOpen(false), [page]); // Persistent Maker's Log & Cheat Code states
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem('bfiot_unlocked') === 'true'
  );
  const [overrideGlitch, setOverrideGlitch] = useState(false);

  useEffect(() => {
    const cachedHistory = localStorage.getItem('bfiot_history_log');
    if (cachedHistory) {
      try {
        setHistory(JSON.parse(cachedHistory));
      } catch (e) {
        localStorage.removeItem('bfiot_history_log');
      }
    }
  }, []); // System unlock bfiot listener

  useEffect(() => {
    let strokeSequence = '';
    const handleKeyStroke = (e) => {
      strokeSequence = (strokeSequence + e.key).slice(-5).toLowerCase();
      if (strokeSequence === 'bfiot') {
        setUnlocked(true);
        // Add this line so the cheat code persists through a refresh!
        localStorage.setItem('bfiot_unlocked', 'true');
        setOverrideGlitch(true);
        setTimeout(() => setOverrideGlitch(false), 500);
      }
    };
    window.addEventListener('keydown', handleKeyStroke);
    return () => window.removeEventListener('keydown', handleKeyStroke);
  }, []);
  const go = (id) => {
    setPage(id);
    setK((n) => n + 1);
    setMenuOpen(false);
  };

  const activeLesson = LESSONS[page];

  const crumb = {
    gz: ['Ground Zero', 'Before You Build'],
    m1: ['Phase 1', 'Module 1 · The Physical Handshake'],
    m2: ['Phase 1', 'Module 2 · The Analog Bridge'],
    m3: ['Phase 1', 'Module 3 · Physical Logic Gates'],
    m4: ['Phase 1', 'Module 4 · The Automatic Night Light'],
    m5: ['Phase 2', 'Module 5 · The Software Gatekeeper'],
    m6: ['Phase 2', 'Module 6 · Digital Inputs'],
    m7: ['Phase 3', 'Module 7 · Analog Outputs & PWM'],
    m8: ['Phase 3', 'Module 8 · Servos & Motors'],
    m9: ['Phase 3', 'Module 9 · OLED Displays (I2C)'],
    m10: ['Phase 3', 'Module 10 · Environmental Sensing'],
    m11: ['Phase 3', 'Module 11 · Relay Power Control'],
    m12: ['Phase 4', 'Module 12 · Local Web Server'],
    lab: ['Project Lab', 'AI Project Builder'],
  }[page] || ['', ''];

  return (
    <div
      className={overrideGlitch ? 'glitch' : ''}
      style={{
        display: 'flex',
        height: '100vh',
        background: T.bg,
        color: T.text,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        overflow: 'hidden',
        transition: 'background 0.25s,color 0.25s',
      }}
    >
            <style>{CSS}</style>      {/* Hamburger Overlay for Mobile */}     {' '}
      <div
        className={`overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />
            {/* SIDEBAR NAVIGATION */}     {' '}
      <aside
        className={`sidebar ${menuOpen ? 'open' : ''}`}
        style={{
          background: T.surface,
          borderRight: `1px solid ${T.border}`,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
               {' '}
        <div
          style={{
            padding: '18px 16px',
            borderBottom: `1px solid ${T.border}`,
          }}
        >
                   {' '}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}
          >
                       {' '}
            <div
              style={{
                width: 36,
                height: 36,
                background: T.primaryBg,
                border: `1px solid ${T.primaryBorder}`,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
                           {' '}
              <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                <rect
                  x={1}
                  y={1}
                  width={16}
                  height={16}
                  rx={3}
                  stroke={T.primary}
                  strokeWidth={1}
                />
                <circle
                  cx={9}
                  cy={9}
                  r={2.5}
                  stroke={T.primaryLight}
                  strokeWidth={1}
                />
                <line
                  x1={1}
                  y1={9}
                  x2={6.5}
                  y2={9}
                  stroke={T.primary}
                  strokeWidth={1}
                />
                <line
                  x1={11.5}
                  y1={9}
                  x2={17}
                  y2={9}
                  stroke={T.primary}
                  strokeWidth={1}
                />
                <line
                  x1={9}
                  y1={1}
                  x2={9}
                  y2={6.5}
                  stroke={T.primary}
                  strokeWidth={1}
                />
                <line
                  x1={9}
                  y1={11.5}
                  x2={9}
                  y2={17}
                  stroke={T.primary}
                  strokeWidth={1}
                />
              </svg>
                         {' '}
            </div>
                       {' '}
            <div>
                           {' '}
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11,
                  fontWeight: 500,
                  color: T.primary,
                  letterSpacing: 1.5,
                }}
              >
                BFIOT
              </div>
                           {' '}
              <div
                style={{
                  fontSize: 9,
                  color: T.textMuted,
                  letterSpacing: 0.8,
                  marginTop: 1,
                }}
              >
                LEARN · BUILD · INNOVATE
              </div>
                         {' '}
            </div>
                     {' '}
          </div>
                   {' '}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: T.greenBg,
              border: `1px solid ${T.greenBorder}`,
              borderRadius: 6,
              padding: '5px 10px',
            }}
          >
                       {' '}
            <div
              className="pulse"
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: T.green,
              }}
            />
                       {' '}
            <span
              style={{
                fontSize: 10,
                color: T.green,
                fontWeight: 600,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              Workbench System Live
            </span>
                     {' '}
          </div>
                 {' '}
        </div>
               {' '}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
                   {' '}
          <div
            style={{
              fontSize: 9,
              color: T.textMuted,
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: 1.5,
              padding: '4px 14px 8px',
              fontWeight: 500,
            }}
          >
            STARTING GATE
          </div>
                   {' '}
          <LBtn
            id="gz"
            title="Before You Build"
            tag="Breadboard 101"
            active={page === 'gz'}
            locked={false}
            onClick={go}
            T={T}
          />
                    <div style={{ height: 8 }} />         {' '}
          {/* Phase 1 Collapsible */}         {' '}
          <button
            onClick={() => setP1(!p1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '5px 14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: 4,
            }}
          >
                       {' '}
            <div style={{ textAlign: 'left' }}>
                           {' '}
              <div
                style={{
                  fontSize: 9,
                  color: T.green,
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                PHASE 1
              </div>
                           {' '}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textSub,
                  marginTop: 1,
                }}
              >
                Pure Hardware
              </div>
                         {' '}
            </div>
                       {' '}
            <div
              style={{
                transform: p1 ? 'rotate(0)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ChevD s={14} c={T.textMuted} />
            </div>
                     {' '}
          </button>
                   {' '}
          {p1 && (
            <div style={{ paddingLeft: 2 }}>
                         {' '}
              <LBtn
                id="m1"
                title="Module 1"
                tag="Physical Handshake"
                active={page === 'm1'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                         {' '}
              <LBtn
                id="m2"
                title="Module 2"
                tag="Analog Bridge"
                active={page === 'm2'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                         {' '}
              <LBtn
                id="m3"
                title="Module 3"
                tag="Logic Gates"
                active={page === 'm3'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                         {' '}
              <LBtn
                id="m4"
                title="Module 4"
                tag="Auto Night Light"
                active={page === 'm4'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                       {' '}
            </div>
          )}
                    {/* Phase 2 Collapsible */}
                    <div style={{ height: 8 }} />         {' '}
          <button
            onClick={() => setP2(!p2)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '5px 14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: 4,
            }}
          >
                       {' '}
            <div style={{ textAlign: 'left' }}>
                           {' '}
              <div
                style={{
                  fontSize: 9,
                  color: T.amber,
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                PHASE 2
              </div>
                           {' '}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textSub,
                  marginTop: 1,
                }}
              >
                Software Gatekeeper
              </div>
                         {' '}
            </div>
                       {' '}
            <div
              style={{
                transform: p2 ? 'rotate(0)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ChevD s={14} c={T.textMuted} />
            </div>
                     {' '}
          </button>
                   {' '}
          {p2 && (
            <div style={{ paddingLeft: 2 }}>
                         {' '}
              <LBtn
                id="m5"
                title="Module 5"
                tag="ESP32 Setup & Blink"
                active={page === 'm5'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                         {' '}
              <LBtn
                id="m6"
                title="Module 6"
                tag="Inputs & If-Statements"
                active={page === 'm6'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                       {' '}
            </div>
          )}
                    {/* Phase 3 Collapsible */}
                    <div style={{ height: 8 }} />         {' '}
          <button
            onClick={() => setP3(!p3)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '5px 14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: 4,
            }}
          >
                       {' '}
            <div style={{ textAlign: 'left' }}>
                           {' '}
              <div
                style={{
                  fontSize: 9,
                  color: T.blue,
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                PHASE 3
              </div>
                           {' '}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textSub,
                  marginTop: 1,
                }}
              >
                Actuation & Sensors
              </div>
                         {' '}
            </div>
                       {' '}
            <div
              style={{
                transform: p3 ? 'rotate(0)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ChevD s={14} c={T.textMuted} />
            </div>
                     {' '}
          </button>
                   {' '}
          {p3 && (
            <div style={{ paddingLeft: 2 }}>
                         {' '}
              <LBtn
                id="m7"
                title="Module 7"
                tag="Analog PWM"
                active={page === 'm7'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                         {' '}
              <LBtn
                id="m8"
                title="Module 8"
                tag="Servos & Motors"
                active={page === 'm8'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                         {' '}
              <LBtn
                id="m9"
                title="Module 9"
                tag="OLED Displays (I2C)"
                active={page === 'm9'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                         {' '}
              <LBtn
                id="m10"
                title="Module 10"
                tag="Enviro Sensing"
                active={page === 'm10'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                         {' '}
              <LBtn
                id="m11"
                title="Module 11"
                tag="Relay Power Control"
                active={page === 'm11'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                       {' '}
            </div>
          )}
                    {/* Phase 4 Collapsible */}
                    <div style={{ height: 8 }} />         {' '}
          <button
            onClick={() => setP4(!p4)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '5px 14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: 4,
            }}
          >
                       {' '}
            <div style={{ textAlign: 'left' }}>
                           {' '}
              <div
                style={{
                  fontSize: 9,
                  color: T.primaryLight,
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                PHASE 4
              </div>
                           {' '}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textSub,
                  marginTop: 1,
                }}
              >
                Connected IoT
              </div>
                         {' '}
            </div>
                       {' '}
            <div
              style={{
                transform: p4 ? 'rotate(0)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ChevD s={14} c={T.textMuted} />
            </div>
                     {' '}
          </button>
                   {' '}
          {p4 && (
            <div style={{ paddingLeft: 2 }}>
                         {' '}
              <LBtn
                id="m12"
                title="Module 12"
                tag="Smart Dashboard"
                active={page === 'm12'}
                locked={!unlocked}
                onClick={go}
                T={T}
              />
                       {' '}
            </div>
          )}
                    {/* Maker's Log persistence timeline */}         {' '}
          {history.length > 0 && (
            <div style={{ marginTop: 20, padding: '0 10px' }}>
                           {' '}
              <div
                style={{
                  fontSize: 9,
                  color: T.textMuted,
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: 1,
                  marginBottom: 10,
                }}
              >
                MAKER'S PERSISTENT LOG
              </div>
                           {' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                               {' '}
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setResult(item.data);
                      go('lab');
                    }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: T.textSub,
                      textAlign: 'left',
                      fontSize: 12,
                      fontFamily: "'JetBrains Mono',monospace",
                      padding: '6px 8px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      borderLeft: `2px solid ${T.primary}`,
                    }}
                  >
                                        {item.name}                 {' '}
                  </button>
                ))}
                             {' '}
              </div>
                         {' '}
            </div>
          )}
                    <div style={{ height: 12 }} />         {' '}
          <div
            style={{
              margin: '0 4px',
              background: T.greenBg,
              border: `1px solid ${T.greenBorder}`,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
                       {' '}
            <div
              style={{
                padding: '8px 12px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
                            <Beaker s={11} c={T.green} />             {' '}
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: T.green,
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: 1.2,
                }}
              >
                AI PROJECT LAB
              </span>
                           {' '}
              <span
                style={{
                  fontSize: 8,
                  background: T.green,
                  color: 'white',
                  borderRadius: 4,
                  padding: '1px 5px',
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                V3
              </span>
                         {' '}
            </div>
                       {' '}
            <LBtn
              id="lab"
              title="Project Builder"
              tag="Context-Aware · ESP32"
              active={page === 'lab'}
              locked={false}
              onClick={go}
              T={T}
              special={true}
            />
                     {' '}
          </div>
                 {' '}
        </nav>
               {' '}
        <div style={{ padding: 12, borderTop: `1px solid ${T.border}` }}>
                   {' '}
          <button
            onClick={() => setModal(true)}
            style={{
              width: '100%',
              background: T.primaryBg,
              border: `1px solid ${T.primaryBorder}`,
              borderRadius: 10,
              color: T.primary,
              padding: '11px',
              fontWeight: 600,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              cursor: 'pointer',
            }}
          >
                       {' '}
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <circle
                cx={11}
                cy={2.5}
                r={1.5}
                stroke={T.primary}
                strokeWidth={1}
              />
              <circle
                cx={11}
                cy={11.5}
                r={1.5}
                stroke={T.primary}
                strokeWidth={1}
              />
              <circle
                cx={2.5}
                cy={7}
                r={1.5}
                stroke={T.primary}
                strokeWidth={1}
              />
              <path
                d="M4 7l5.5-4M4 7l5.5 4.5"
                stroke={T.primary}
                strokeWidth={1}
                strokeLinecap="round"
              />
            </svg>
                        Share Workbench          {' '}
          </button>
                 {' '}
        </div>
             {' '}
      </aside>
            {/* MAIN CONTENT AREA */}     {' '}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
                {/* Top Header Block */}       {' '}
        <header
          style={{
            height: 52,
            borderBottom: `1px solid ${T.border}`,
            padding: '0 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            background: T.topbar,
            transition: 'background 0.25s',
          }}
        >
                   {' '}
          <div style={{ display: 'flex', alignItems: 'center' }}>
                       {' '}
            <button
              className="menu-btn"
              onClick={() => setMenuOpen(true)}
              style={{ marginRight: 12, cursor: 'pointer' }}
            >
              <MenuIcon s={20} />
            </button>
                       {' '}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 11,
              }}
            >
                            <span style={{ color: T.textMuted }}>bfiot</span>
              <span style={{ color: T.textMuted }}>/</span>             {' '}
              <span style={{ color: T.textSub }}>{crumb[0]}</span>
              <span style={{ color: T.textMuted }}>/</span>             {' '}
              <span style={{ color: T.primary }}>{crumb[1]}</span>           {' '}
            </div>
                     {' '}
          </div>
                   {' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                       {' '}
            <TToggle dark={dark} onToggle={() => setDark((d) => !d)} T={T} />   
                   {' '}
            <a
              href="https://forms.gle/FLKkVrgrYy6tQxm16"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: T.primary,
                borderRadius: 8,
                color: 'white',
                padding: '7px 16px',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}
            >
              Pre-order Kit
            </a>
                     {' '}
          </div>
                 {' '}
        </header>
                {/* Page Container */}       {' '}
        <div
          className="main-pad"
          style={{ flex: 1, overflowY: 'auto' }}
          key={k}
        >
                   {' '}
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>
                       {' '}
            {page === 'gz' && (
              <div className="fu">
                               {' '}
                <div style={{ marginBottom: 48 }}>
                                   {' '}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: T.greenBg,
                      border: `1px solid ${T.greenBorder}`,
                      borderRadius: 20,
                      padding: '4px 12px',
                      marginBottom: 18,
                    }}
                  >
                                       {' '}
                    <div
                      className="pulse"
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: T.green,
                      }}
                    />
                                       {' '}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: T.green,
                        letterSpacing: 0.5,
                      }}
                    >
                      START HERE
                    </span>
                                     {' '}
                  </div>
                                   {' '}
                  <h1
                    style={{
                      fontSize: 38,
                      fontWeight: 800,
                      color: T.text,
                      lineHeight: 1.12,
                      marginBottom: 16,
                    }}
                  >
                                        Alright — before we plug
                    <br />
                    anything in,{' '}
                    <span style={{ color: T.primary }}>read this first.</span> 
                                   {' '}
                  </h1>
                                   {' '}
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: 1.9,
                      color: T.textSub,
                      maxWidth: 600,
                    }}
                  >
                                        I've watched a lot of students fry their
                    first LED in the first 10 minutes of a lab session. Not
                    because they weren't smart — because nobody pulled them
                    aside beforehand and said{' '}
                    <em style={{ color: T.text }}>
                      "here's what the textbook skips."
                    </em>{' '}
                    That's what this page is.                  {' '}
                  </p>
                                 {' '}
                </div>
                               {' '}
                <div
                  style={{
                    background: T.amberBg,
                    border: `1px solid ${T.amberBorder}`,
                    borderLeft: `3px solid ${T.amber}`,
                    borderRadius: '0 10px 10px 0',
                    padding: '16px 22px',
                    marginBottom: 52,
                  }}
                >
                                   {' '}
                  <p
                    style={{ fontSize: 14, lineHeight: 1.85, color: T.textSub }}
                  >
                                       {' '}
                    <span style={{ color: T.amber, fontWeight: 700 }}>
                      Already touched a circuit board before?
                    </span>{' '}
                    Skim through, make sure your mental model lines up with
                    ours, then jump straight to Module 1. But if you're the kind
                    of person who just stared at a breadboard wondering what
                    those holes even do —                    {' '}
                    <strong style={{ color: T.text }}>
                      you're exactly who this was written for. Don't skip it.
                    </strong>
                                     {' '}
                  </p>
                                 {' '}
                </div>
                               {' '}
                <section style={{ marginBottom: 52 }}>
                                   {' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 20,
                    }}
                  >
                                        <SN n="01" T={T} />
                    <h2
                      style={{ fontSize: 21, fontWeight: 700, color: T.text }}
                    >
                      The Language of Electricity
                    </h2>
                                     {' '}
                  </div>
                                   {' '}
                  <p
                    style={{
                      fontSize: 15,
                      color: T.textSub,
                      lineHeight: 1.9,
                      marginBottom: 10,
                      maxWidth: 660,
                    }}
                  >
                                        Think of electricity not as a scary
                    invisible force, but as water flowing in your home plumbing.
                                     {' '}
                  </p>
                                   {' '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: 12,
                      marginBottom: 22,
                    }}
                  >
                                       {' '}
                    {[
                      {
                        sym: 'V',
                        name: 'Voltage',
                        unit: 'Volts',
                        color: T.primary,
                        simple: 'the push',
                        desc: `The water pressure. Our ESP32 provides 3.3V pressure. It’s gentle enough that you can't even feel it.`,
                      },
                      {
                        sym: 'I',
                        name: 'Current',
                        unit: 'milliamps (mA)',
                        color: T.bg === '#04080f' ? '#818cf8' : '#6366f1',
                        simple: 'the flow',
                        desc: `The volume of water flow. If too much "volume" hits a tiny LED without a "throttle," it pops.`,
                      },
                      {
                        sym: 'Ω',
                        name: 'Resistance',
                        unit: 'Ohms',
                        color: T.green,
                        simple: 'the squeeze',
                        desc: `The "throttle" or "squeeze" in the pipe. We use resistors to deliberately slow down the flow so we don't blow up our LEDs.`,
                      },
                    ].map((c) => (
                      <div
                        key={c.sym}
                        style={{
                          background: T.surface,
                          border: `1px solid ${T.border}`,
                          borderTop: `2px solid ${c.color}`,
                          borderRadius: 12,
                          padding: 20,
                        }}
                      >
                                               {' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 8,
                            marginBottom: 14,
                          }}
                        >
                                                   {' '}
                          <div
                            style={{
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: 26,
                              fontWeight: 500,
                              color: c.color,
                            }}
                          >
                            {c.sym}
                          </div>
                                                   {' '}
                          <div
                            style={{
                              fontSize: 10,
                              color: c.color,
                              fontFamily: "'JetBrains Mono',monospace",
                              opacity: 0.7,
                            }}
                          >
                            = {c.simple}
                          </div>
                                                 {' '}
                        </div>
                                               {' '}
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: T.text,
                            marginBottom: 3,
                          }}
                        >
                          {c.name}
                        </div>
                                               {' '}
                        <div
                          style={{
                            fontSize: 10,
                            color: T.textMuted,
                            fontFamily: "'JetBrains Mono',monospace",
                            marginBottom: 12,
                          }}
                        >
                          {c.unit}
                        </div>
                                               {' '}
                        <p
                          style={{
                            fontSize: 13,
                            lineHeight: 1.75,
                            color: T.textSub,
                          }}
                        >
                          {c.desc}
                        </p>
                                             {' '}
                      </div>
                    ))}
                                     {' '}
                  </div>
                                                      {' '}
                  {/* Physics Ohm's Law block */}                 {' '}
                  <div
                    style={{
                      background: T.codeBg,
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      padding: '18px 24px',
                    }}
                  >
                                       {' '}
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: T.amber,
                        fontFamily: "'JetBrains Mono',monospace",
                        marginBottom: 8,
                        letterSpacing: 0.5,
                      }}
                    >
                      PHYSICS NOTE: OHM'S LAW
                    </div>
                                       {' '}
                    <p
                      style={{
                        fontSize: 14,
                        color: T.textSub,
                        lineHeight: 1.8,
                      }}
                    >
                                            To calculate the perfect resistor
                      value for an LED, we subtract the LED's forward voltage
                      from the source, and divide by the desired current: <br />
                                           {' '}
                      <code
                        style={{
                          color: T.primary,
                          marginTop: 4,
                          display: 'inline-block',
                          fontWeight: 'bold',
                        }}
                      >
                        R = (V_source - V_led) / I_target
                      </code>
                                         {' '}
                    </p>
                                     {' '}
                  </div>
                                 {' '}
                </section>
                               {' '}
                <section style={{ marginBottom: 52 }}>
                                   {' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 20,
                    }}
                  >
                                        <SN n="02" T={T} />
                    <h2
                      style={{ fontSize: 21, fontWeight: 700, color: T.text }}
                    >
                      Breadboard Internal Mechanics
                    </h2>
                                     {' '}
                  </div>
                                   {' '}
                  <p
                    style={{
                      fontSize: 15,
                      color: T.textSub,
                      lineHeight: 1.9,
                      marginBottom: 28,
                      maxWidth: 660,
                    }}
                  >
                                        Most beginners treat the breadboard like
                    a magic grid where everything connects to everything. That's
                    the wrong mental model, and it's exactly why circuits fail
                    in ways that make no sense. Hover over the holes below to
                    see the hidden copper strips underneath.                  {' '}
                  </p>
                                                      {' '}
                  <div
                    style={{
                      display: 'flex',
                      gap: 28,
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                    }}
                  >
                                       {' '}
                    <div className="bb-wrap">
                                           {' '}
                      <BBViz T={T} activeWireState={false} />                   {' '}
                    </div>
                                       {' '}
                    <div style={{ flex: 1, minWidth: 200 }}>
                                           {' '}
                      <div
                        style={{
                          background: T.primaryBg,
                          border: `1px solid ${T.primaryBorder}`,
                          borderRadius: 10,
                          padding: 18,
                          marginBottom: 12,
                        }}
                      >
                                               {' '}
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: T.primary,
                            fontFamily: "'JetBrains Mono',monospace",
                            marginBottom: 8,
                          }}
                        >
                          THE SECRET OF "UNDERGROUND" LINKS
                        </div>
                                               {' '}
                        <p
                          style={{
                            fontSize: 13.5,
                            color: T.textSub,
                            lineHeight: 1.82,
                          }}
                        >
                          You never need to jam two metal legs into the same
                          tiny hole. Plug your resistor into A10, and your LED
                          into B10 — because they share Row 10, they are already
                          linked underground. This is how we prototype without
                          soldering.
                        </p>
                                             {' '}
                      </div>
                                           {' '}
                      <Cd T={T} style={{ padding: 16 }}>
                                               {' '}
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: T.amber,
                            fontFamily: "'JetBrains Mono',monospace",
                            marginBottom: 10,
                          }}
                        >
                          QUICK BENCH REFERENCE
                        </div>
                                               {' '}
                        {[
                          {
                            l: '+ Power Rail',
                            d: 'Vertical bus — live when powered',
                            c: T.red,
                          },
                          {
                            l: '− Ground Rail',
                            d: 'Vertical bus — return pathway',
                            c: T.blue,
                          },
                          {
                            l: 'A–E Row Strip',
                            d: 'One connected strip of metal clips',
                            c: T.primary,
                          },
                          {
                            l: 'F–J Row Strip',
                            d: 'Separated clip strip across divide',
                            c: T.bg === '#04080f' ? '#818cf8' : '#6366f1',
                          },
                          {
                            l: 'Row 10 vs 11',
                            d: 'Completely separate tracks. No link.',
                            c: T.textMuted,
                          },
                        ].map((t, i, a) => (
                          <div
                            key={t.l}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '6px 0',
                              borderBottom:
                                i < a.length - 1
                                  ? `1px solid ${T.border}`
                                  : 'none',
                            }}
                          >
                                                       {' '}
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: 11.5,
                                color: t.c,
                              }}
                            >
                              {t.l}
                            </span>
                                                       {' '}
                            <span
                              style={{
                                fontSize: 12,
                                color: T.textSub,
                                textAlign: 'right',
                                maxWidth: 160,
                              }}
                            >
                              {t.d}
                            </span>
                                                     {' '}
                          </div>
                        ))}
                                             {' '}
                      </Cd>
                                         {' '}
                    </div>
                                     {' '}
                  </div>
                                 {' '}
                </section>
                               {' '}
                <section style={{ marginBottom: 52 }}>
                                   {' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 20,
                    }}
                  >
                                        <SN n="03" T={T} />
                    <h2
                      style={{ fontSize: 21, fontWeight: 700, color: T.text }}
                    >
                      Component Anatomy & Tells
                    </h2>
                                     {' '}
                  </div>
                                   {' '}
                  <p
                    style={{
                      fontSize: 15,
                      color: T.textSub,
                      lineHeight: 1.9,
                      marginBottom: 28,
                      maxWidth: 660,
                    }}
                  >
                                        Some components care deeply about which
                    way you plug them in. Get it wrong and they either don't
                    work, or they burn out silently. No error message. Just a
                    dead component and a lot of confusion. Here's how to read
                    each one.                  {' '}
                  </p>
                                   {' '}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(320px, 1fr))',
                      gap: 12,
                    }}
                  >
                                       {' '}
                    <Cd T={T} style={{ padding: 22 }}>
                                           {' '}
                      <Tg color={T.red} label="ONE-WAY · POLARIZED" />         
                                 {' '}
                      <p
                        style={{
                          fontSize: 12.5,
                          color: T.textSub,
                          marginTop: 10,
                          marginBottom: 18,
                          lineHeight: 1.75,
                        }}
                      >
                        These only work if electricity enters the correct side.
                        Reverse them and they either refuse to work, or they
                        take permanent damage. No second chances.
                      </p>
                                           {' '}
                      <div
                        style={{
                          marginBottom: 20,
                          paddingBottom: 20,
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                                               {' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 10,
                          }}
                        >
                                                   {' '}
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              background: `${T.amber}15`,
                              border: `1px solid ${T.amber}30`,
                              borderRadius: 7,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 15,
                            }}
                          >
                            💡
                          </div>
                                                   {' '}
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: T.text,
                            }}
                          >
                            LED
                          </div>
                                                 {' '}
                        </div>
                                               {' '}
                        <p
                          style={{
                            fontSize: 13.5,
                            color: T.textSub,
                            lineHeight: 1.8,
                            marginBottom: 14,
                          }}
                        >
                                                    Converts electricity into
                          light — but only in one direction. The rule is simple
                          and you should never forget it:{' '}
                          <strong style={{ color: T.text }}>
                            long leg is positive, short leg is negative.
                          </strong>{' '}
                          Long leg toward power. Short leg toward ground.      
                                           {' '}
                        </p>
                                                                        {' '}
                        <div
                          style={{
                            background: T.primaryBg,
                            border: `1px solid ${T.primaryBorder}`,
                            borderRadius: 8,
                            padding: '12px 14px',
                            marginBottom: 12,
                          }}
                        >
                                                   {' '}
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: T.primary,
                              fontFamily: "'JetBrains Mono',monospace",
                              marginBottom: 6,
                            }}
                          >
                            ⚠️ THE FLAT NOTCH SECRET
                          </div>
                                                   {' '}
                          <p
                            style={{
                              fontSize: 13,
                              color: T.textSub,
                              lineHeight: 1.75,
                            }}
                          >
                            If the legs are trimmed, run your finger along the
                            bottom rim of the plastic bulb. You'll feel a{' '}
                            <strong style={{ color: T.text }}>flat spot</strong>{' '}
                            — that side is always the negative Cathode. Also,
                            inside the bulb, the large "flag-shaped" piece is
                            the Cathode.
                          </p>
                                                 {' '}
                        </div>
                                               {' '}
                        <div
                          style={{
                            background: T.codeBg,
                            border: `1px solid ${T.border}`,
                            borderRadius: 8,
                            padding: '12px 14px',
                          }}
                        >
                                                   {' '}
                          {[
                            {
                              dot: T.green,
                              label: 'LONG LEG (+) — Anode',
                              desc: 'Faces your power source or the ESP32 GPIO pin.',
                            },
                            {
                              dot: T.red,
                              label: 'SHORT LEG (−) — Cathode',
                              desc: 'Always connects back to GND. Completes the loop.',
                            },
                          ].map((r) => (
                            <div
                              key={r.label}
                              style={{
                                display: 'flex',
                                gap: 10,
                                marginBottom: 8,
                                alignItems: 'flex-start',
                              }}
                            >
                                                           {' '}
                              <div
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  background: r.dot,
                                  marginTop: 4,
                                  flexShrink: 0,
                                }}
                              />
                                                           {' '}
                              <div>
                                                               {' '}
                                <div
                                  style={{
                                    fontFamily: "'JetBrains Mono',monospace",
                                    fontSize: 11,
                                    fontWeight: 500,
                                    color: r.dot,
                                    marginBottom: 2,
                                  }}
                                >
                                  {r.label}
                                </div>
                                                               {' '}
                                <p style={{ fontSize: 12.5, color: T.textSub }}>
                                  {r.desc}
                                </p>
                                                             {' '}
                              </div>
                                                         {' '}
                            </div>
                          ))}
                                                 {' '}
                        </div>
                                             {' '}
                      </div>
                                           {' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 10,
                        }}
                      >
                                               {' '}
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            background: `${T.red}12`,
                            border: `1px solid ${T.red}25`,
                            borderRadius: 7,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 15,
                          }}
                        >
                          🔊
                        </div>
                                               {' '}
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: T.text,
                          }}
                        >
                          Active Buzzer
                        </div>
                                             {' '}
                      </div>
                                           {' '}
                      <p
                        style={{
                          fontSize: 13.5,
                          color: T.textSub,
                          lineHeight: 1.8,
                        }}
                      >
                        Makes a continuous beep when powered. Same (+/−) leg
                        rule as the LED. Check the top of the casing — there's a{' '}
                        <strong style={{ color: T.amber }}>
                          small sticker with a + symbol
                        </strong>{' '}
                        right next to the positive leg.
                      </p>
                                         {' '}
                    </Cd>
                                       {' '}
                    <Cd T={T} style={{ padding: 22 }}>
                                           {' '}
                      <Tg color={T.green} label="TWO-WAY · NON-POLARIZED" />   
                                       {' '}
                      <p
                        style={{
                          fontSize: 12.5,
                          color: T.textSub,
                          marginTop: 10,
                          marginBottom: 18,
                          lineHeight: 1.75,
                        }}
                      >
                        No direction, no drama. Flip them, rotate them, plug
                        them in backwards — they behave exactly the same every
                        time.
                      </p>
                                           {' '}
                      {[
                        {
                          icon: '≈',
                          name: 'Resistors',
                          color: T.green,
                          desc: `Your LED's bodyguard. It sits between power and the component, squeezing the current down to a safe level. No direction needed — just plug it in. Read the resistance value from the colored bands painted on the body.`,
                        },
                        {
                          icon: '⊕',
                          name: 'Push Button',
                          color: T.blue,
                          desc: `Think of it as a physical drawbridge. You press it — the bridge drops and electricity crosses. Release it — the bridge lifts and the circuit breaks. Sits across the center groove of the breadboard, and any orientation works.`,
                        },
                      ].map((c, i) => (
                        <div
                          key={c.name}
                          style={{
                            marginBottom: i === 0 ? 20 : 0,
                            paddingBottom: i === 0 ? 20 : 0,
                            borderBottom:
                              i === 0 ? `1px solid ${T.border}` : 'none',
                          }}
                        >
                                                   {' '}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              marginBottom: 10,
                            }}
                          >
                                                       {' '}
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                background: `${c.color}12`,
                                border: `1px solid ${c.color}25`,
                                borderRadius: 7,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 15,
                                color: c.color,
                                fontWeight: 700,
                              }}
                            >
                              {c.icon}
                            </div>
                                                       {' '}
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: T.text,
                              }}
                            >
                              {c.name}
                            </div>
                                                     {' '}
                          </div>
                                                   {' '}
                          <p
                            style={{
                              fontSize: 13.5,
                              color: T.textSub,
                              lineHeight: 1.8,
                            }}
                          >
                            {c.desc}
                          </p>
                                                 {' '}
                        </div>
                      ))}
                                         {' '}
                    </Cd>
                                     {' '}
                  </div>
                                 {' '}
                </section>
                               {' '}
                <div
                  style={{
                    background: T.primaryBg,
                    border: `1px solid ${T.primaryBorder}`,
                    borderRadius: 14,
                    padding: '26px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    flexWrap: 'wrap',
                  }}
                >
                                   {' '}
                  <div>
                                       {' '}
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: T.text,
                        marginBottom: 5,
                      }}
                    >
                      That's your foundation. Let's touch some hardware.
                    </div>
                                       {' '}
                    <p style={{ fontSize: 14, color: T.textSub }}>
                      Module 1 is where we plug things in for the first time.
                    </p>
                                     {' '}
                  </div>
                                   {' '}
                  <button
                    onClick={() => go('m1')}
                    style={{
                      background: T.primary,
                      border: 'none',
                      borderRadius: 10,
                      color: 'white',
                      padding: '13px 28px',
                      fontWeight: 700,
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    Module 1 →
                  </button>
                                 {' '}
                </div>
                             {' '}
              </div>
            )}
                                    {' '}
            {/* If our active page matches an internal Lesson Database key, render the dynamic premium view */}
                       {' '}
            {activeLesson && page !== 'gz' ? (
              // FIX: Only render locked screen if user hasn't overridden and it's a phase 1-12 restriction.
              [
                'm1',
                'm2',
                'm3',
                'm4',
                'm5',
                'm6',
                'm7',
                'm8',
                'm9',
                'm10',
                'm11',
                'm12',
              ].includes(page) && !unlocked ? (
                <LockedPage
                  info={LINFO[page]}
                  T={T}
                  unlocked={unlocked}
                  setUnlocked={setUnlocked}
                />
              ) : (
                <div
                  className="fu"
                  style={{
                    display: 'flex',
                    gap: 28,
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                  }}
                >
                                    {/* Left Column (Width: 60% on desktop) */} 
                                 {' '}
                  <div style={{ flex: '1 1 500px' }}>
                                       {' '}
                    <div style={{ marginBottom: 32 }}>
                                           {' '}
                      <div
                        style={{
                          display: 'inline-block',
                          background: T.primaryBg,
                          border: `1px solid ${T.primaryBorder}`,
                          borderRadius: 20,
                          padding: '4px 12px',
                          marginBottom: 18,
                        }}
                      >
                                               {' '}
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: T.primary,
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          {activeLesson.phase.toUpperCase()}
                        </span>
                                             {' '}
                      </div>
                                           {' '}
                      <h1
                        style={{
                          fontSize: 36,
                          fontWeight: 800,
                          color: T.text,
                          lineHeight: 1.15,
                          marginBottom: 14,
                        }}
                      >
                        {activeLesson.title}
                      </h1>
                                         {' '}
                    </div>
                                       {' '}
                    <div
                      style={{
                        background: `linear-gradient(135deg,${T.primaryBg},${T.greenBg})`,
                        border: `1px solid ${T.primaryBorder}`,
                        borderRadius: 14,
                        padding: 28,
                        marginBottom: 32,
                      }}
                    >
                                           {' '}
                      <p
                        style={{
                          fontSize: 17,
                          lineHeight: 1.85,
                          color: T.text,
                          fontWeight: 500,
                          marginBottom: 20,
                        }}
                      >
                        {activeLesson.overview.hook}
                      </p>
                                           {' '}
                      <p
                        style={{
                          fontSize: 14.5,
                          lineHeight: 1.9,
                          color: T.textSub,
                        }}
                      >
                        {activeLesson.overview.concept}
                      </p>
                                         {' '}
                    </div>
                                        {/* Supplies Section */}               
                       {' '}
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: T.text,
                        marginBottom: 12,
                      }}
                    >
                      Required Supplies
                    </h3>
                                       {' '}
                    <Cd T={T} style={{ overflow: 'hidden', marginBottom: 32 }}>
                                           {' '}
                      {activeLesson.parts.map((p, i, arr) => (
                        <div
                          key={p.name}
                          style={{
                            display: 'flex',
                            gap: 16,
                            padding: '14px 18px',
                            borderBottom:
                              i < arr.length - 1
                                ? `1px solid ${T.border}`
                                : 'none',
                            alignItems: 'flex-start',
                          }}
                        >
                                                   {' '}
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 7,
                              background: T.primaryBg,
                              border: `1px solid ${T.primaryBorder}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontFamily: "'JetBrains Mono',monospace",
                              fontSize: 12,
                              fontWeight: 700,
                              color: T.primary,
                              flexShrink: 0,
                            }}
                          >
                            ×{p.quantity}
                          </div>
                                                   {' '}
                          <div style={{ flex: 1 }}>
                                                       {' '}
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: T.text,
                                marginBottom: 4,
                              }}
                            >
                              {p.name}
                            </div>
                                                       {' '}
                            <p
                              style={{
                                fontSize: 13,
                                color: T.textSub,
                                lineHeight: 1.65,
                              }}
                            >
                              {p.why}
                            </p>
                                                     {' '}
                          </div>
                                                 {' '}
                        </div>
                      ))}
                                         {' '}
                    </Cd>
                                        {/* Build Steps Section */}             
                         {' '}
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: T.text,
                        marginBottom: 12,
                      }}
                    >
                      Build & Assembly Steps
                    </h3>
                                       {' '}
                    <Cd T={T} style={{ overflow: 'hidden', marginBottom: 32 }}>
                                           {' '}
                      {activeLesson.steps &&
                        activeLesson.steps.map((s, i, arr) => (
                          <div
                            key={s.number}
                            style={{
                              padding: '18px 20px',
                              borderBottom:
                                i < arr.length - 1
                                  ? `1px solid ${T.border}`
                                  : 'none',
                            }}
                          >
                                                     {' '}
                            <div
                              style={{
                                display: 'flex',
                                gap: 14,
                                marginBottom:
                                  s.sanityCheck || s.proTip ? 12 : 0,
                              }}
                            >
                                                         {' '}
                              <div
                                style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: 6,
                                  background: T.primaryBg,
                                  border: `1px solid ${T.primaryBorder}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: 10,
                                  fontWeight: 600,
                                  color: T.primary,
                                  flexShrink: 0,
                                  marginTop: 1,
                                }}
                              >
                                {String(s.number).padStart(2, '0')}
                              </div>
                                                         {' '}
                              <div style={{ flex: 1 }}>
                                                             {' '}
                                <div
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: T.text,
                                    marginBottom: 6,
                                  }}
                                >
                                  {s.title}
                                </div>
                                                             {' '}
                                <p
                                  style={{
                                    fontSize: 13.5,
                                    color: T.textSub,
                                    lineHeight: 1.78,
                                  }}
                                >
                                  {s.instruction}
                                </p>
                                                           {' '}
                              </div>
                                                       {' '}
                            </div>
                                                     {' '}
                            {s.sanityCheck && (
                              <div
                                style={{
                                  marginLeft: 40,
                                  background: T.greenBg,
                                  border: `1px solid ${T.greenBorder}`,
                                  borderRadius: 7,
                                  padding: '9px 14px',
                                  marginBottom: s.proTip ? 8 : 0,
                                }}
                              >
                                                           {' '}
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: T.green,
                                    fontFamily: "'JetBrains Mono',monospace",
                                    marginRight: 6,
                                  }}
                                >
                                  ✓ SANITY CHECK
                                </span>
                                                           {' '}
                                <span
                                  style={{ fontSize: 12.5, color: T.textSub }}
                                >
                                  {s.sanityCheck}
                                </span>
                                                         {' '}
                              </div>
                            )}
                                                     {' '}
                            {s.proTip && (
                              <div
                                style={{
                                  marginLeft: 40,
                                  background: T.amberBg,
                                  border: `1px solid ${T.amberBorder}`,
                                  borderRadius: 7,
                                  padding: '9px 14px',
                                }}
                              >
                                                           {' '}
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: T.amber,
                                    fontFamily: "'JetBrains Mono',monospace",
                                    marginRight: 6,
                                  }}
                                >
                                  ⚠️ PRO TIP
                                </span>
                                                           {' '}
                                <span
                                  style={{ fontSize: 12.5, color: T.textSub }}
                                >
                                  {s.proTip}
                                </span>
                                                         {' '}
                              </div>
                            )}
                                                   {' '}
                          </div>
                        ))}
                                         {' '}
                    </Cd>
                                        {/* Observation Section */}             
                         {' '}
                    {activeLesson.observation && (
                      <div
                        style={{
                          background: T.surfaceAlt,
                          border: `1px solid ${T.border}`,
                          borderRadius: 12,
                          padding: '24px',
                          marginBottom: 24,
                        }}
                      >
                                               {' '}
                        <h3
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: T.primary,
                            marginBottom: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                                                    <span>🎯</span> What You
                          Will Observe                        {' '}
                        </h3>
                                               {' '}
                        <p
                          style={{
                            fontSize: 14,
                            color: T.text,
                            lineHeight: 1.8,
                          }}
                        >
                          {activeLesson.observation}
                        </p>
                                             {' '}
                      </div>
                    )}
                                        {/* FAQ Section */}                   {' '}
                    {activeLesson.faq && activeLesson.faq.length > 0 && (
                      <div style={{ marginBottom: 40 }}>
                                               {' '}
                        <button
                          onClick={() => setFaqOpen(!faqOpen)}
                          style={{
                            background: T.primaryBg,
                            border: `1px solid ${T.primaryBorder}`,
                            color: T.primary,
                            padding: '12px 20px',
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                          }}
                        >
                                                   {' '}
                          <span>
                            🤔 Didn't get the right output? Don't worry! Click
                            here..
                          </span>
                                                   {' '}
                          <span>{faqOpen ? '▲' : '▼'}</span>                   
                             {' '}
                        </button>
                                                                        {' '}
                        {faqOpen && (
                          <div
                            style={{
                              marginTop: 12,
                              padding: 20,
                              background: T.red + '0A',
                              border: `1px solid ${T.red}30`,
                              borderRadius: 10,
                            }}
                            className="fu"
                          >
                                                       {' '}
                            <h4
                              style={{
                                color: T.red,
                                fontWeight: 700,
                                marginBottom: 16,
                                fontSize: 14,
                              }}
                            >
                              Common Errors & Solutions
                            </h4>
                                                       {' '}
                            {activeLesson.faq.map((f, i) => (
                              <div
                                key={i}
                                style={{
                                  marginBottom:
                                    i === activeLesson.faq.length - 1 ? 0 : 16,
                                  paddingBottom:
                                    i === activeLesson.faq.length - 1 ? 0 : 16,
                                  borderBottom:
                                    i === activeLesson.faq.length - 1
                                      ? 'none'
                                      : `1px solid ${T.red}20`,
                                }}
                              >
                                                               {' '}
                                <strong
                                  style={{
                                    color: T.text,
                                    fontSize: 14,
                                    display: 'block',
                                    marginBottom: 4,
                                  }}
                                >
                                  • {f.error}
                                </strong>
                                                               {' '}
                                <p
                                  style={{
                                    fontSize: 13,
                                    color: T.textSub,
                                    marginBottom: 2,
                                  }}
                                >
                                  <strong style={{ color: T.textMuted }}>
                                    Cause:
                                  </strong>{' '}
                                  {f.cause}
                                </p>
                                                               {' '}
                                <p style={{ fontSize: 13, color: T.textSub }}>
                                  <strong style={{ color: T.textMuted }}>
                                    Solution:
                                  </strong>{' '}
                                  {f.solution}
                                </p>
                                                             {' '}
                              </div>
                            ))}
                                                     {' '}
                          </div>
                        )}
                                             {' '}
                      </div>
                    )}
                                        {/* Code Terminal Section */}           
                           {' '}
                    {activeLesson.code ? (
                      <>
                                               {' '}
                        <h3
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: T.text,
                            marginBottom: 12,
                          }}
                        >
                          The Software Architecture
                        </h3>
                                               {' '}
                        <div
                          style={{
                            background: T.codeBg,
                            border: `1px solid ${T.border}`,
                            borderRadius: 12,
                            overflow: 'hidden',
                            marginBottom: 20,
                          }}
                        >
                                                   {' '}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 18px',
                              borderBottom: `1px solid ${T.border}`,
                              background: 'rgba(0,0,0,0.15)',
                            }}
                          >
                                                       {' '}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                              }}
                            >
                                                           {' '}
                              {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                                <div
                                  key={c}
                                  style={{
                                    width: 11,
                                    height: 11,
                                    borderRadius: '50%',
                                    background: c,
                                  }}
                                />
                              ))}
                                                           {' '}
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: 11,
                                  color: T.textMuted,
                                  marginLeft: 8,
                                }}
                              >
                                {activeLesson.code.filename}
                              </span>
                                                         {' '}
                            </div>
                                                     {' '}
                          </div>
                                                   {' '}
                          <pre
                            style={{
                              padding: '20px 22px',
                              overflowX: 'auto',
                              margin: 0,
                            }}
                          >
                                                       {' '}
                            <code
                              dangerouslySetInnerHTML={codeLight(
                                activeLesson.code.snippet
                              )}
                              style={{
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: 12.5,
                                lineHeight: 1.9,
                                display: 'block',
                              }}
                            />
                                                     {' '}
                          </pre>
                                                 {' '}
                        </div>
                                               {' '}
                        <div
                          style={{
                            background: T.primaryBg,
                            border: `1px solid ${T.primaryBorder}`,
                            borderRadius: 12,
                            padding: '20px 22px',
                            marginBottom: 40,
                          }}
                        >
                                                   {' '}
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: T.primary,
                              fontFamily: "'JetBrains Mono',monospace",
                              marginBottom: 10,
                            }}
                          >
                            🧠 LOGIC BREAKDOWN
                          </div>
                                                   {' '}
                          <p
                            style={{
                              fontSize: 14,
                              color: T.textSub,
                              lineHeight: 1.9,
                            }}
                          >
                            {activeLesson.code.breakdown}
                          </p>
                                                 {' '}
                        </div>
                                             {' '}
                      </>
                    ) : (
                      <div
                        style={{
                          background: T.surfaceAlt,
                          border: `1px dashed ${T.border}`,
                          borderRadius: 12,
                          padding: '40px 22px',
                          marginBottom: 40,
                          textAlign: 'center',
                        }}
                      >
                                               {' '}
                        <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
                                               {' '}
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: T.text,
                            marginBottom: 6,
                          }}
                        >
                          Hardware Only Project
                        </div>
                                               {' '}
                        <p style={{ fontSize: 14, color: T.textSub }}>
                          This phase requires no software compilation. Pure
                          physics!
                        </p>
                                             {' '}
                      </div>
                    )}
                                     {' '}
                  </div>
                                   {' '}
                  {/* Right Column (Width: 40% on desktop, sticky sandbox panel) */}
                                   {' '}
                  <div
                    style={{
                      flex: '0 0 320px',
                      position: 'sticky',
                      top: 24,
                      width: '100%',
                    }}
                  >
                                        <LessonSimulator pageId={page} T={T} /> 
                                   {' '}
                  </div>
                                 {' '}
                </div>
              )
            ) : // If page is lab, or some other loaded fallback page
            page === 'lab' ? (
              <ProjectLabPage
                T={T}
                result={result}
                setResult={setResult}
                history={history}
                setHistory={setHistory}
              />
            ) : null}
                     {' '}
          </div>
                 {' '}
        </div>
             {' '}
      </div>
            {modal && <Referral T={T} onClose={() => setModal(false)} />}   {' '}
    </div>
  );
}
