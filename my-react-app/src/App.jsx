import { useState, useEffect, useRef } from 'react';
import { LESSONS } from './db.js';
import Login from './Login.jsx';
import PlumbingSim from './simulations/PlumbingSim.jsx';
import ResistorDecoderSim from './simulations/ResistorDecoderSim.jsx';
import BBViz from './simulations/BBViz.jsx';
import HardwareTimerSim from './simulations/HardwareTimerSim.jsx';
import VaultAlarmSim from './simulations/VaultAlarmSim.jsx';
import AnalogOutputSim from './simulations/AnalogOutputSim.jsx';
import SerialCommSim from './simulations/SerialCommSim.jsx';
import ThermometerSim from './simulations/ThermometerSim.jsx';
import ServoMotorSim from './simulations/ServoMotorSim.jsx';
import OledDisplaySim from './simulations/OledDisplaySim.jsx';
import EnvSensingSim from './simulations/EnvSensingSim.jsx';
import RelayPowerSim from './simulations/RelayPowerSim.jsx';
import DesktopRadarSim from './simulations/DesktopRadarSim.jsx';
import HighVoltageBridgeSim from './simulations/HighVoltageBridgeSim.jsx';
import LocalHotspotSim from './simulations/LocalHotspotSim.jsx';
import TwoWayDataSim from './simulations/TwoWayDataSim.jsx';
import SmartHomeHubSim from './simulations/SmartHomeHubSim.jsx';


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

@media(max-width: 900px) {.sidebar{position:fixed;left:0;top:0;bottom:0;z-index:100;transform:translateX(-100%);}.sidebar.open{transform:translateX(0);}.overlay.open{display:block;}.menu-btn{display:block;background:none;border:none;padding:8px;margin-right:12px;color:inherit;}.topbar-px{padding:0 16px !important;}.main-pad{padding:24px 16px 80px;}
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
    /(\/\/.*)|(".*?"|'.*?')|\b(void|int|float|bool|char|const|if|else|for|while|return|define|include|setup|loop|String|long|byte|unsigned|true|false)\b|\b(pinMode|digitalWrite|digitalRead|delay|Serial|begin|print|println|analogRead|analogWrite|pulseIn|delayMicroseconds|map|isnan|WiFi|softAP|server|on|handleClient|Wire|display|dht|myServo|attach|write|ledcSetup|ledcAttachPin|ledcWrite|beginTransmission|endTransmission|clearDisplay|setTextSize|setTextColor|setCursor|readTemperature|readHumidity|addHeader|POST|end)\b|\b(\d+(\.\d+)?)\b|([+\-*/%=!|^]+)/g,
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
        borderLeft: `2px solid ${active ? (special ? T.green : T.primary) : 'transparent'
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
          border: `1px solid ${active ? (special ? T.greenBorder : T.primaryBorder) : T.border
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
    {dark ? <Sun s={13} c={T.primary} /> : <Moon s={13} c={T.primary} />}   {' '}
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

function LessonSimulator({ pageId, T }) {
  const isDark = T.bg === '#04080f'; // Module 1 States

  const [wireOnE11, setWireOnE11] = useState(true); // Mechanical Dial & Button States (M2, M3, M4, M6)

  const [toggleStateA, setToggleStateA] = useState(false);
  const [toggleStateB, setToggleStateB] = useState(false);
  const [knobAngle, setKnobAngle] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null); // M5 (Blink timing)

  const [onboardBlink, setOnboardBlink] = useState(false);
  const [onDelay, setOnDelay] = useState(100);
  const [offDelay, setOffDelay] = useState(1000);
  const [tempOnDelay, setTempOnDelay] = useState('100');
  const [tempOffDelay, setTempOffDelay] = useState('1000'); // Handle Rotary Dial Mouse Drag

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]); // Derived Potentiometer Value (0 to 100)

  const potVal = Math.round(((knobAngle - 30) / 300) * 100) || 0; // Blink precise interval engine (M5)

  useEffect(() => {
    if (pageId !== 'p2m1') return;
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
      {pageId === 'p1m1' && (
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
      {pageId === 'p1m2' && (
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
            {/* Circular Potentiometer Dial */}           {' '}
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
              {/* Notches */}             {' '}
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
              {/* Dial Indicator */}             {' '}
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
      {pageId === 'p1m3' && (
        <div>
          {' '}
          <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
            Click the buttons to toggle their mechanical states. Observe the
            Boolean logic applied to the LED output.
          </p>
          {' '}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {/* Click-to-Toggle Mechanical Buttons */}           {' '}
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
              BUTTON A            {' '}
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
              BUTTON B            {' '}
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
      {pageId === 'p1m4' && (
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
            <input
              type="range"
              min="0" max="100"
              value={potVal}
              onChange={(e) => setKnobAngle((Number(e.target.value) / 100) * 300 + 30)}
              style={{ width: '100%', maxWidth: 220, accentColor: T.primary, marginTop: 40, marginBottom: 40 }}
            />
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
      {pageId === 'p2m1' && (
        <div>
          {' '}
          <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
            Modulate the precise millisecond delay metrics inside setup and loop
            parameters and watch the simulated onboard LED timing.
          </p>
          {' '}
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
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
              <input
                type="text"
                value={tempOnDelay}
                onChange={(e) => setTempOnDelay(e.target.value)}
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
            </div>
            <div style={{ flex: 1 }}>
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
              <input
                type="text"
                value={tempOffDelay}
                onChange={(e) => setTempOffDelay(e.target.value)}
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
            </div>
          </div>
          <button
            onClick={() => {
              setOnDelay(parseInt(tempOnDelay) || 10);
              setOffDelay(parseInt(tempOffDelay) || 10);
            }}
            style={{
              width: '100%',
              background: T.green,
              color: '#000',
              border: 'none',
              borderRadius: 6,
              padding: '10px 0',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>▶</span> RUN SIMULATION
          </button>
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
      {pageId === 'p2m2' && (
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
      {pageId === 'p1m5' && <HardwareTimerSim T={T} />}
      {pageId === 'p1cap' && <VaultAlarmSim T={T} />}
      {pageId === 'p2m3' && <AnalogOutputSim T={T} />}
      {pageId === 'p2m4' && <SerialCommSim T={T} />}
      {pageId === 'p2cap' && <ThermometerSim T={T} />}
      {pageId === 'p3m1' && <ServoMotorSim T={T} />}
      {pageId === 'p3m2' && <OledDisplaySim T={T} />}
      {pageId === 'p3m3' && <EnvSensingSim T={T} />}
      {pageId === 'p3m4' && <RelayPowerSim T={T} />}
      {pageId === 'p3cap' && <DesktopRadarSim T={T} />}
      {pageId === 'p4m1' && <HighVoltageBridgeSim T={T} />}
      {pageId === 'p4m2' && <LocalHotspotSim T={T} />}
      {pageId === 'p4m3' && <TwoWayDataSim T={T} />}
      {pageId === 'p4cap' && <SmartHomeHubSim T={T} />}

      {/* Fallback for Phase 3/4 modules */}     {' '}
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
      <span style={{ fontSize: 24 }}>⚡</span>     {' '}
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
          first, and verify safe isolation parameters.        {' '}
        </p>
        {' '}
      </div>
      {' '}
    </div>
  );
}

// ── COMPONENT MODAL ──────────────────────────────────────────────────
function ComponentModal({ componentName, T, onClose }) {
  if (!componentName) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 24,
          padding: 40,
          position: 'relative',
          color: T.text,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: T.surface,
            border: `1px solid ${T.border}`,
            color: T.textSub,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.primaryBg; e.currentTarget.style.color = T.primary; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.surface; e.currentTarget.style.color = T.textSub; }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {componentName === 'ESP32 Development Board' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>
              {componentName}
            </h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://robukits.in/static/uploads/esp32devkit1.png" alt="ESP32" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>Meet the ESP32: The Brain of Your Projects</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Think of the ESP32 as a tiny, highly capable computer on a single board. It’s built to read sensors, control motors, connect to the internet, and make decisions all at the same time.
            </p>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 32 }}>
              Here is what makes it tick:
            </p>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>The Core Brain (ESP-WROOM-32)</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Dual-Core Power</div>
                  <div style={{ fontSize: 15, color: T.textSub, lineHeight: 1.6 }}>Unlike older single-core chips, the ESP32 can run a web server and check sensors simultaneously.</div>
                </div>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Blazing Speed</div>
                  <div style={{ fontSize: 15, color: T.textSub, lineHeight: 1.6 }}>It runs at up to <strong style={{ color: T.text }}>240 MHz</strong>, making it incredibly fast in the microcontroller world.</div>
                </div>
              </div>

              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 12, marginTop: 24 }}>Memory Architecture</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 40 }}>
                <div style={{ padding: 16, background: T.primaryBg, borderRadius: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 4 }}>ROM</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.primary, marginBottom: 8 }}>448 KB</div>
                  <div style={{ fontSize: 13, color: T.textSub, lineHeight: 1.5 }}>Permanent instructions to wake the chip up.</div>
                </div>
                <div style={{ padding: 16, background: T.primaryBg, borderRadius: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 4 }}>SRAM</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.primary, marginBottom: 8 }}>520 KB</div>
                  <div style={{ fontSize: 13, color: T.textSub, lineHeight: 1.5 }}>Short-term memory while code is actively running.</div>
                </div>
                <div style={{ padding: 16, background: T.primaryBg, borderRadius: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 4 }}>Flash</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.primary, marginBottom: 8 }}>4 MB</div>
                  <div style={{ fontSize: 13, color: T.textSub, lineHeight: 1.5 }}>The "hard drive". Code is saved here permanently.</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>Wireless Connection</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
              <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.green, marginRight: 8 }}></div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>WiFi Built-In</div>
                </div>
                <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>Connects to your home router for internet access, or acts as its own mini-router.</div>
              </div>
              <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginRight: 8 }}></div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Bluetooth & BLE</div>
                </div>
                <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>Supports standard Bluetooth for audio and super power-efficient BLE for wearables.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>Powering the Board</h2>
            </div>

            <div style={{ padding: 24, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ padding: '4px 10px', background: T.primaryBg, color: T.primary, borderRadius: 6, fontSize: 13, fontWeight: 700, marginRight: 12 }}>CRITICAL</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.text }}>The 3.3V Rule</div>
              </div>
              <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, marginBottom: 24 }}>
                The ESP32 chip itself runs strictly on <strong style={{ color: T.text }}>3.3 Volts</strong>.
              </p>

              <div style={{ width: '100%', height: 1, background: T.border, marginBottom: 24 }}></div>

              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 16 }}>How to Power It:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2, flexShrink: 0 }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>USB Port</div>
                    <div style={{ fontSize: 13, color: T.textSub, lineHeight: 1.5 }}>The easiest way. Plug a Micro-USB into your PC.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2, flexShrink: 0 }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><rect x="4" y="6" width="16" height="16" rx="2" ry="2"></rect><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>VIN Pin</div>
                    <div style={{ fontSize: 13, color: T.textSub, lineHeight: 1.5 }}>Feed a 5V battery directly for standalone robots.</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: 16, background: T.primaryBg, borderRadius: 12, fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>
                <strong style={{ color: T.text }}>The Regulator:</strong> USB and VIN provide 5V, so the board has a built-in voltage regulator to safely step it down to 3.3V. You can borrow this 3.3V power for sensors using the 3V3 pin.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>The Pins (I/O)</h2>
            </div>
            <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, marginBottom: 20 }}>
              The metal pins on the sides are how the ESP32 talks to the physical world:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div style={{ padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.primary, marginBottom: 4 }}>15</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Analog Inputs</div>
                <div style={{ fontSize: 12, color: T.textSub, lineHeight: 1.5 }}>For reading variable voltage sensors.</div>
              </div>
              <div style={{ padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.primary, marginBottom: 4 }}>25</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>PWM Outputs</div>
                <div style={{ fontSize: 12, color: T.textSub, lineHeight: 1.5 }}>For fading LEDs or controlling motors.</div>
              </div>
              <div style={{ padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.primary, marginBottom: 4 }}>9</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Touch Pads</div>
                <div style={{ fontSize: 12, color: T.textSub, lineHeight: 1.5 }}>Use pins directly as touch buttons!</div>
              </div>
            </div>
            <div style={{ padding: 16, background: T.primaryBg, borderRadius: 12, fontSize: 14, color: T.textSub, lineHeight: 1.6, marginBottom: 40 }}>
              <strong style={{ color: T.text }}>Pin Multiplexing:</strong> Most pins aren't locked into just one job. You can program them to act as an input, an output, or a sensor reader depending on what you need.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>Buttons & Lights</h2>
                </div>
                <ul style={{ fontSize: 14, color: T.textSub, lineHeight: 1.8, paddingLeft: 24, listStyleType: 'disc', margin: 0 }}>
                  <li><strong style={{ color: T.text }}>EN Button:</strong> Reset button. Press to restart code.</li>
                  <li><strong style={{ color: T.text }}>BOOT Button:</strong> Hold to prepare for new code uploads.</li>
                  <li><strong style={{ color: T.text }}>Red LED:</strong> Power indicator.</li>
                  <li><strong style={{ color: T.text }}>Blue LED:</strong> User programmable (wired to D2).</li>
                </ul>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>Computer Translation</h2>
                </div>
                <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.8, margin: 0 }}>
                  Your computer speaks "USB", but the ESP32 speaks "Serial". The tiny <strong style={{ color: T.text }}>CP2102 chip</strong> near the USB port acts as a live translator between the two so you can easily upload code.
                </p>
              </div>
            </div>
          </div>
        ) : componentName === 'Breadboard' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>
              {componentName}
            </h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://auhbsvzkkblo2s0k.public.blob.vercel-storage.com/breadboard-840-tie-point-500x500-removebg-preview.png" alt="Breadboard" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>Meet the Breadboard: Your Prototyping Canvas</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
              Think of a breadboard as a reusable canvas for building electronics. Instead of permanently soldering wires together, you just push component legs into the little holes to connect them.
            </p>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 32 }}>
              Here is the secret to how it works under the plastic:
            </p>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="8" y1="2" x2="8" y2="4"></line><line x1="16" y1="2" x2="16" y2="4"></line><line x1="8" y1="20" x2="8" y2="22"></line><line x1="16" y1="20" x2="16" y2="22"></line><line x1="22" y1="8" x2="20" y2="8"></line><line x1="22" y1="16" x2="20" y2="16"></line><line x1="4" y1="8" x2="2" y2="8"></line><line x1="4" y1="16" x2="2" y2="16"></line></svg>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>The Power Rails (The Long Highways)</h2>
              </div>
              <div style={{ padding: 24, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 40 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ padding: '4px 10px', background: T.primaryBg, color: T.primary, borderRadius: 6, fontSize: 12, fontWeight: 700, marginRight: 12, width: 80, textAlign: 'center', flexShrink: 0 }}>WHERE</div>
                    <div style={{ fontSize: 15, color: T.textSub, lineHeight: 1.6 }}>The long rows running down the far left and right edges (usually marked with + and - lines).</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ padding: '4px 10px', background: T.primaryBg, color: T.primary, borderRadius: 6, fontSize: 12, fontWeight: 700, marginRight: 12, width: 80, textAlign: 'center', flexShrink: 0 }}>HOW</div>
                    <div style={{ fontSize: 15, color: T.textSub, lineHeight: 1.6 }}>Underneath, these holes are connected in <strong style={{ color: T.text }}>long horizontal lines</strong>.</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ padding: '4px 10px', background: T.primaryBg, color: T.primary, borderRadius: 6, fontSize: 12, fontWeight: 700, marginRight: 12, width: 80, textAlign: 'center', flexShrink: 0 }}>JOB</div>
                    <div style={{ fontSize: 15, color: T.textSub, lineHeight: 1.6 }}>These are your power highways. You plug your ESP32's 3V3 pin into the positive line, and the GND pin into the negative line. Now, any hole on that entire positive line provides 3.3V power, and any hole on the negative line provides Ground.</div>
                  </div>
                </div>
                <div style={{ width: '100%', height: 1, background: T.border, margin: '20px 0' }}></div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2, flexShrink: 0 }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>The Split Trap</div>
                    <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.5 }}>Important! On full-size breadboards, these power lines are usually <strong style={{ color: T.text }}>split right in the middle</strong>. If you want power to reach the bottom half, you have to use a jumper wire to connect the top power line to the bottom power line.</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Terminal Strips</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.primary, letterSpacing: 0.5, marginBottom: 4 }}>WHERE</div>
                    <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>The main grids of holes in the middle, usually lettered A-E and F-J.</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.primary, letterSpacing: 0.5, marginBottom: 4 }}>HOW</div>
                    <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>Underneath, these are connected in <strong style={{ color: T.text }}>short vertical columns of 5 holes</strong>. Row 1, holes A, B, C, D, and E are all connected to each other.</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.primary, letterSpacing: 0.5, marginBottom: 4 }}>JOB</div>
                    <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>This is where you place your components. If you push an LED leg into Row 10 (hole A), and a resistor into Row 10 (hole B), they are electrically connected because they share the same metal clip underneath.</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="4" y1="12" x2="20" y2="12"></line></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Trench</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.primary, letterSpacing: 0.5, marginBottom: 4 }}>WHERE</div>
                    <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>The empty gap running straight down the middle of the board.</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.primary, letterSpacing: 0.5, marginBottom: 4 }}>HOW</div>
                    <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>The trench completely separates the left side (A-E) from the right side (F-J).</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.primary, letterSpacing: 0.5, marginBottom: 4 }}>JOB</div>
                    <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>This gap is designed specifically for microchips (like your 555 Timer). You straddle the chip across the trench so its left legs plug into the left side, and its right legs plug into the right side. If the trench wasn't there, the left and right legs would short-circuit together.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : componentName === 'Jumper Wires' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://robocraze.com/cdn/shop/files/3_Male_to_Female_Jumper_Wires_20cm_20pcs_1000x.png?v=1758691490" alt="Jumper Wires" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Circulatory System</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              The circulatory system of your hardware. These carry voltage and digital signals between your ESP32 microcontroller, your breadboard, and your components.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h2>
            </div>
            <div style={{ padding: 24, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 40 }}>
              <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                Jumper wires are simple electrical conductors. Inside the colored plastic insulation is a bundle of highly conductive copper wire. Copper has loosely bound electrons in its outer atomic shell, meaning it offers almost zero resistance to electricity. When you connect a jumper wire from a power source to a component, the electrical pressure (voltage) instantly pushes those free electrons from one end of the wire to the other, creating a current.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>Types & Wiring</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 40 }}>
              <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: T.primary, marginBottom: 4 }}>M-M</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Male-to-Male</div>
                <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>Both ends have pointy metal pins. Used strictly for connecting one hole on the breadboard to another hole.</div>
              </div>
              <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: T.primary, marginBottom: 4 }}>M-F</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Male-to-Female</div>
                <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>One pointy pin, one hollow socket. Connects a breadboard hole directly to pins sticking out of a sensor module.</div>
              </div>
              <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: T.primary, marginBottom: 4 }}>F-F</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Female-to-Female</div>
                <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>Both ends have hollow sockets. Used to connect two components directly to each other without a breadboard.</div>
              </div>
            </div>
          </div>
        ) : componentName === '0.96" OLED Display' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://auhbsvzkkblo2s0k.public.blob.vercel-storage.com/ChatGPT_Image_Jun_8__2026__01_20_57_AM-removebg-preview.png" alt="0.96 OLED Display" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Micro Monitor</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              A tiny, crisp screen that uses I2C communication. It is perfect for showing live sensor data, status messages, or debugging information directly on the physical hardware instead of your computer monitor.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Physics (OLED)</h2>
                </div>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                    OLED stands for Organic Light Emitting Diode. Unlike traditional LCD screens that require a bulky backlight behind the display, every single microscopic pixel on an OLED screen produces its own light. When a pixel needs to be black, it physically turns off completely. This results in perfect contrast, ultra-sharp text, and very low power consumption.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Brains (SSD1306)</h2>
                </div>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                    The glass screen is driven by a hidden chip called the SSD1306. Because controlling 8,192 individual pixels would normally require hundreds of wires, the SSD1306 chip uses the I2C communication protocol. It takes complex graphics commands from your ESP32 over a digital "highway" and translates them into pixel rendering, requiring only two data wires to function.
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: T.primaryBg, color: T.primary, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>VCC</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Power input. Connect to the <strong style={{ color: T.text }}>3V3 (3.3 Volt)</strong> pin on the ESP32.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(107, 114, 128, 0.1)', color: T.text, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>GND</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Ground connection. Connect to the <strong style={{ color: T.text }}>ESP32 GND</strong>.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>SDA</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}><strong style={{ color: T.text }}>Serial Data:</strong> The data highway line. Connect to ESP32 <strong style={{ color: T.text }}>GPIO 21</strong>.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>SCK</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}><strong style={{ color: T.text }}>Serial Clock:</strong> The timing line that keeps data synchronized. Connect to ESP32 <strong style={{ color: T.text }}>GPIO 22</strong>.</div>
              </div>
            </div>
          </div>
        ) : componentName === 'DHT11 Sensor' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://auhbsvzkkblo2s0k.public.blob.vercel-storage.com/DHT11_Humidity_Temperature_Sensor_Module_1000x.jpg" alt="DHT11 Sensor" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Climate Tracker</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              A digital sensor module that measures ambient room temperature and humidity simultaneously. It is the foundation for smart agriculture and weather station projects.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Physics</h2>
                </div>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0, marginBottom: 12 }}>
                    <strong style={{ color: T.text }}>Humidity:</strong> It measures the electrical resistance between two tiny electrodes. Sandwiched between them is a moisture-holding substrate. As the air gets more humid, the substrate absorbs water vapor, releasing ions and dropping the electrical resistance.
                  </p>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                    <strong style={{ color: T.text }}>Temperature:</strong> It uses a surface-mounted thermistor. A thermistor is a special resistor that drastically changes its resistance based on how hot or cold it is.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Brains</h2>
                </div>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                    Because resistance is an analog measurement, the DHT11 contains a built-in 8-bit microchip. This chip converts those raw analog resistance readings into a clean digital signal. Because you are using the "Module" version, a required 10k Ohm pull-up resistor is already soldered onto the circuit board for you.
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ width: 100, fontSize: 16, fontWeight: 800, color: T.primary }}>VCC (or +)</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Power input. Connect to <strong style={{ color: T.text }}>3V3</strong>.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ width: 100, fontSize: 16, fontWeight: 800, color: T.text }}>GND (or -)</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Ground connection. Connect to <strong style={{ color: T.text }}>GND</strong>.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ width: 100, fontSize: 16, fontWeight: 800, color: '#10b981' }}>DATA (OUT)</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>The single-wire digital output. Connect this to an input GPIO pin on your ESP32 (e.g., <strong style={{ color: T.text }}>GPIO 15</strong>).</div>
              </div>
            </div>
          </div>
        ) : componentName === 'Ultrasonic Sensor (HC-SR04)' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://spare3d.in/wp-content/uploads/2017/06/Spare3d_ultrasonic_sensor_hc_sr04.jpg" alt="Ultrasonic Sensor (HC-SR04)" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Bat Radar</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              Acts identically to bat echolocation. It sends out an ultrasonic ping and measures exactly how long it takes to bounce back, calculating physical distance to an object.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Physics</h2>
                </div>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0, marginBottom: 12 }}>
                    If you look at the HC-SR04, you see two silver mesh cylinders.
                  </p>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0, marginBottom: 12 }}>
                    <strong style={{ color: T.text }}>The Trigger:</strong> One cylinder acts as a high-frequency speaker. It blasts a burst of sound waves at 40,000 Hz (way too high for human ears to hear).
                  </p>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                    <strong style={{ color: T.text }}>The Echo:</strong> The sound wave travels through the air at roughly 343 meters per second. The second cylinder acts as a microphone, waiting to hear that specific high-frequency bounce.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Brains</h2>
                </div>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                    An onboard chip triggers the speaker and then times exactly how many microseconds it takes for the microphone to hear the echo. You use math in your code <strong style={{ color: T.primary }}>(Distance = Time * Speed of Sound)</strong> to convert that delay into centimeters.
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ width: 100, fontSize: 16, fontWeight: 800, color: '#ef4444' }}>VCC (5V)</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Power input. This sensor requires 5 Volts to generate a loud enough sound wave. Connect to the <strong style={{ color: T.text }}>VIN (5V)</strong> pin of the ESP32.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(107, 114, 128, 0.1)', color: T.text, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>GND</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Ground connection. Connect to <strong style={{ color: T.text }}>GND</strong>.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>TRIG</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Trigger: Connect to an ESP32 output GPIO. The ESP32 sends a quick HIGH signal here to command the sensor to shout.</div>
              </div>
              <div style={{ padding: 16, background: 'rgba(239, 68, 68, 0.1)', border: `1px solid #ef4444`, borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ width: 100, fontSize: 16, fontWeight: 800, color: '#ef4444' }}>ECHO</div>
                  <div style={{ padding: '2px 6px', background: '#ef4444', color: '#fff', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>WARNING</div>
                </div>
                <div style={{ fontSize: 14, color: T.text, lineHeight: 1.6 }}>Connect to an ESP32 input GPIO. Because the sensor is powered by 5V, the ECHO pin will shoot a 5V signal back to the ESP32. You <strong style={{ color: '#ef4444' }}>MUST</strong> use a voltage divider (two 10k Ohm resistors) to lower this to a safe 2.5V before it reaches the ESP32, or you will damage the microcontroller.</div>
              </div>
            </div>
          </div>
        ) : componentName === 'IR Sensor' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://probots.co.in/pub/media/catalog/product/cache/d8ddd0f9b0cd008b57085cd218b48832/i/r/ir-sensor-module-line-following.jpg" alt="IR Sensor" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Digital Eye</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              Think of the IR (Infrared) Sensor as a simple digital eye that can detect if an object is in front of it without actually touching it. It is the foundation of obstacle-avoiding robots and automated factory conveyor belts.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Physics</h2>
                </div>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0, marginBottom: 12 }}>
                    If you look closely at the front of the module, you will see two LED-like bulbs (usually one clear, one black).
                  </p>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0, marginBottom: 12 }}>
                    <strong style={{ color: T.text }}>The Transmitter:</strong> The clear bulb acts like an invisible flashlight, constantly shooting out a beam of infrared light (light that human eyes cannot see).
                  </p>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                    <strong style={{ color: T.text }}>The Receiver:</strong> The black bulb is a photodiode tuned to look for that exact infrared light. When an object gets close, the invisible beam bounces off the object and reflects back into the black receiver.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Brains</h2>
                </div>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                    The module has a tiny black chip on it called an <strong style={{ color: T.text }}>LM393 Comparator</strong>. This chip compares the reflected light against a threshold. You can manually adjust this threshold by twisting the small blue box (potentiometer) on the board with a screwdriver. This changes how close an object needs to be before the sensor triggers.
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: T.primaryBg, color: T.primary, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>VCC</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Power input. Connect to the <strong style={{ color: T.text }}>3V3 (3.3 Volt)</strong> pin on the ESP32.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(107, 114, 128, 0.1)', color: T.text, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>GND</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Ground connection. Connect to the <strong style={{ color: T.text }}>ESP32 GND</strong>.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ width: 100, fontSize: 16, fontWeight: 800, color: '#10b981' }}>OUT (or DO)</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}><strong style={{ color: T.text }}>Digital Output:</strong> Normally sends HIGH (3.3V). When an object reflects light, it snaps to LOW (0V). Wire to any input GPIO.</div>
              </div>
            </div>
          </div>
        ) : componentName === 'LDR (Light Sensor)' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://www.sunrobotics.in/cdn/shop/files/LDR-module-1_60b4d653-45a9-4e6f-83f5-d8877c29bbcb_1920x.png?v=1746160216" alt="LDR (Light Sensor)" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Electronic Pupil</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              The LDR (Light Dependent Resistor) module allows your project to measure ambient light. It tells your microcontroller if it is day, night, or if someone just turned off the room lights.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Physics</h2>
                </div>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                    The sensor on the front has a squiggly track running across its face. This is made of a special semiconductor material. When it is in a dark room, the material has very high electrical resistance—it acts like a thick wall blocking electricity. As light particles (photons) hit the squiggly track, they knock electrons loose, drastically lowering the resistance and allowing electricity to flow easily.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect></svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>The Brains</h2>
                </div>
                <div style={{ padding: 20, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, flex: 1 }}>
                  <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                    Just like the IR sensor, this module uses an <strong style={{ color: T.text }}>LM393 chip</strong> and a blue twist-dial to let you set exactly what "dark" means for your specific room.
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: T.primaryBg, color: T.primary, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>VCC</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Power input. Connect to <strong style={{ color: T.text }}>3V3</strong>.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(107, 114, 128, 0.1)', color: T.text, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>GND</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Ground connection. Connect to <strong style={{ color: T.text }}>GND</strong>.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>DO</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}><strong style={{ color: T.text }}>Digital Out:</strong> Sends a simple HIGH or LOW signal based on the blue dial threshold. Perfect for "turn on the nightlight" logic.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>AO</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}><strong style={{ color: T.text }}>Analog Out:</strong> The magic pin. Outputs a variable voltage based on exact brightness. Connect to an ADC pin (like GPIO 34) for precise 0-4095 readings.</div>
              </div>
            </div>
          </div>
        ) : componentName === 'Active Buzzer' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://robu.in/_next/image/?url=https%3A%2F%2Frobu-prod-media.s3.ap-south-1.amazonaws.com%2Fuploads%2F2024%2F10%2FActive-Buzzer.png&w=1920&q=90" alt="Active Buzzer" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Alarm Bell</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              The Active Buzzer is the simplest way to give your projects a voice. It is designed to be loud, annoying, and instantly grab your attention.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h2>
            </div>
            <div style={{ padding: 24, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 40 }}>
              <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, margin: 0, marginBottom: 16 }}>
                Inside the black plastic casing is a piezoelectric ceramic disk. When electricity hits this disk, it physically bends and warps.
              </p>
              <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                The word <strong style={{ color: T.text }}>"Active"</strong> is the most important part of this component's name. It means it has a built-in oscillator circuit. You do not need to write complex audio frequencies in your code; the moment the buzzer receives steady DC power, the internal circuit forces the ceramic disk to warp back and forth thousands of times per second, generating a loud, continuous beep.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>Pinout & Wiring</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ width: 120, fontSize: 16, fontWeight: 800, color: '#ef4444' }}>Positive (+)</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>The longer leg, or the pin marked with a plus sign. The buzzers in this kit are rated for 5V. To get the loudest sound, this should be powered from the <strong style={{ color: T.text }}>VIN (5V)</strong> rail of the ESP32, not the 3.3V rail.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ width: 120, fontSize: 16, fontWeight: 800, color: T.text }}>Negative (-)</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>The shorter leg. Connect this to Ground to complete the circuit and trigger the sound.</div>
              </div>
            </div>
          </div>
        ) : componentName === 'SG90 Servo Motor' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://robukits.in/static/uploads/sg90.png" alt="SG90 Servo Motor" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Precision Arm</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              Unlike standard DC motors in toy cars that just spin endlessly in circles, a servo motor is a highly intelligent actuator built for exact precision.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h2>
            </div>
            <div style={{ padding: 24, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 40 }}>
              <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, margin: 0, marginBottom: 16 }}>
                Inside the blue casing, there is a tiny standard motor, a series of nylon gears to slow it down and increase its physical strength (torque), and a potentiometer attached to the main shaft.
              </p>
              <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                As the motor turns, it also turns the potentiometer, which acts as an internal sensor to tell the servo's brain exactly what angle the arm is currently pointing at. This allows it to lock into precise positions anywhere between <strong style={{ color: T.text }}>0 and 180 degrees</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>Pinout & Wiring</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ width: 140, fontSize: 16, fontWeight: 800, color: '#78350f' }}>Brown (GND)</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Connect to the Ground rail.</div>
              </div>
              <div style={{ padding: 16, background: 'rgba(239, 68, 68, 0.1)', border: `1px solid #ef4444`, borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ width: 140, fontSize: 16, fontWeight: 800, color: '#ef4444' }}>Red (VCC)</div>
                  <div style={{ padding: '2px 6px', background: '#ef4444', color: '#fff', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>CRITICAL</div>
                </div>
                <div style={{ fontSize: 14, color: T.text, lineHeight: 1.6 }}>Servos require a massive spike of power to physically move. You <strong style={{ color: '#ef4444' }}>MUST</strong> connect this to the VIN (5V) pin of the ESP32. Connecting it to the 3.3V pin will starve the ESP32 of power and crash your microcontroller.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ width: 140, fontSize: 16, fontWeight: 800, color: '#f59e0b' }}>Orange (Signal)</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6, paddingTop: 2 }}>Connect to a PWM-capable GPIO pin. Your ESP32 sends a rapid series of electrical pulses down this wire. The specific width of those pulses tells the servo exactly what angle to rotate to.</div>
              </div>
            </div>
          </div>
        ) : componentName === 'Push Buttons' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://projectpoint.in/image/cache/catalog/button_12mm-800x800.jpg" alt="Push Buttons" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Digital Trigger</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              Also known as tactile switches, these are the most reliable way for a human to give a physical command to a computer chip.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h2>
            </div>
            <div style={{ padding: 24, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 40 }}>
              <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                A push button is simply a broken bridge. Inside the plastic housing, there is a slightly curved metal dome. When you are not touching the button, the dome hovers above the contact pads, keeping the circuit open so no electricity can flow. When you press down, the dome clicks flat, bridging the gap and allowing electricity to instantly cross to the other side.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>Pinout & Wiring</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: T.primaryBg, color: T.primary, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>The 4-Pin Layout</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>The button has four metal legs, but internally, the legs on the left side are permanently connected to each other, and the legs on the right side are permanently connected to each other.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>Breadboard Trick</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>To avoid confusion, always wire your buttons <strong style={{ color: T.text }}>diagonally across the breadboard trench</strong>. Connect the top-left pin to Ground, and the bottom-right pin to your ESP32 GPIO.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>Software Secret</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>To read a button reliably, you configure your ESP32 pin using the code <strong style={{ color: T.text, background: T.primaryBg, padding: '2px 4px', borderRadius: 4 }}>INPUT_PULLUP</strong>. This uses a microscopic resistor inside the ESP32 to keep the pin at 3.3V (HIGH) normally. When you press the button, the electricity drains to Ground, and the pin drops to 0V (LOW).</div>
              </div>
            </div>
          </div>
        ) : componentName === 'LEDs' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://dynokart.in/wp-content/uploads/2018/08/3mm-led-1.jpg" alt="LEDs" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Status Lights</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              LEDs (Light Emitting Diodes) are highly efficient components that turn electrical current directly into a bright, focused light with almost zero heat waste.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h2>
            </div>
            <div style={{ padding: 24, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 40 }}>
              <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, margin: 0, marginBottom: 16 }}>
                An LED is a semiconductor. When electrons cross a microscopic gap inside the bulb, they release their extra energy in the form of photons (light). The color of the plastic bulb doesn't actually matter; the chemical composition of the metal inside dictates what color the light will be.
              </p>
              <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                Because it is a "diode," it is a <strong style={{ color: T.text }}>strict one-way street</strong> for electricity.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>Pinout & Wiring</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ width: 140, fontSize: 16, fontWeight: 800, color: '#ef4444' }}>Anode (+)</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6 }}><strong style={{ color: T.text }}>The longer leg.</strong> Electrical current must enter through this leg. It connects toward the power source.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ width: 140, fontSize: 16, fontWeight: 800, color: T.text }}>Cathode (-)</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6 }}><strong style={{ color: T.text }}>The shorter leg.</strong> If you look closely at the plastic bulb, the side with the shorter leg also has a flattened edge. Current exits this leg toward Ground. If you plug an LED in backward, it completely blocks the power.</div>
              </div>
            </div>
          </div>
        ) : componentName === 'Resistors' ? (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: T.text }}>{componentName}</h1>
            <div style={{ width: '100%', height: 300, background: T.primaryBg, borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="https://5.imimg.com/data5/SELLER/Default/2023/12/369621363/DH/RH/UO/21085075/resistors-th-and-smd.jpg" alt="Resistors" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }} />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: T.primary, marginBottom: 12 }}>The Speed Bumps</h2>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8, marginBottom: 40 }}>
              Resistors are the unsung heroes of electronics. They do not move, light up, or make noise, but without them, your other components would instantly destroy themselves.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>How It Works (The Physics)</h2>
            </div>
            <div style={{ padding: 24, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 40 }}>
              <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, margin: 0, marginBottom: 16 }}>
                Think of electricity like high-pressure water rushing through a pipe. A resistor acts like a narrow pinch in that pipe, physically slowing down and strictly limiting how much water can rush through at once. The strength of this pinch is measured in <strong style={{ color: T.text }}>Ohms</strong>.
              </p>
              <p style={{ fontSize: 15, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                They work by being poor conductors (often made of carbon film). When electricity fights its way through the carbon, the resistor absorbs the excess electrical pressure and releases it safely as heat into the air.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primaryBg, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0 }}>Wiring & Usage</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: T.primaryBg, color: T.primary, borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>Non-Polarized</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>Resistors have no specific positive or negative leg. You can plug them in facing either direction and they will work perfectly.</div>
              </div>
              <div style={{ padding: 16, background: 'rgba(239, 68, 68, 0.1)', border: `1px solid #ef4444`, borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ width: 140, fontSize: 16, fontWeight: 800, color: '#ef4444' }}>The Golden Rule</div>
                  <div style={{ padding: '2px 6px', background: '#ef4444', color: '#fff', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>CRITICAL</div>
                </div>
                <div style={{ fontSize: 14, color: T.text, lineHeight: 1.6 }}>You must ALWAYS put a <strong style={{ color: '#ef4444' }}>220 Ohm resistor</strong> in series with an LED. An LED has no internal electrical resistance. If you connect it directly to 3.3V or 5V, it will consume as much power as it possibly can, overheat in a fraction of a second, and permanently burn out with a popping sound.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 6, fontSize: 12, fontWeight: 800, marginRight: 16, minWidth: 70, textAlign: 'center', flexShrink: 0 }}>Reading Values</div>
                <div style={{ flex: 1, fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>You know how strong a resistor is by reading the painted color bands on its body.<br /><br /><strong style={{ color: T.text }}>220 Ohm</strong> (used for LEDs) = Red-Red-Brown.<br /><strong style={{ color: T.text }}>10k Ohm</strong> (used for sensors) = Brown-Black-Orange.</div>
              </div>
            </div>
          </div>
        ) : componentName === '5V Single Channel Relay' ? (
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

              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
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

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${T.primary}`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>
        ) : componentName === 'DC Motor with Fan Blade' ? (
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

              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
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

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${T.primary}`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>
        ) : componentName === 'Capacitors' ? (
          <div>
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

              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
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

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${T.primary}`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>
        ) : componentName === 'Potentiometer' ? (
          <div>
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

              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  <li><strong style={{ color: T.text }}>Outer Pins:</strong> The two outside legs are for power. Connect the left leg to 3V3 and the right leg to Ground (you can actually swap these to reverse the direction the dial works).</li>
                  <li><strong style={{ color: T.text }}>Middle Pin (Wiper):</strong> This is the output pin that carries the altered voltage. You connect this to an Analog-to-Digital (ADC) pin on your ESP32 so your code can read exactly how far the knob has been twisted.</li>
                </ul>
              </div>
            </div>

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${T.primary}`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>
        ) : componentName === 'BC547 transistors' ? (
          <div>
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

              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 12 }}>Hold the transistor so the flat side with the text is facing you, and the pins point down:</p>
                <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  <li><strong style={{ color: T.text }}>Pin 1 (Collector):</strong> The left pin. Connect this to the negative side of the heavy component you want to power (like a buzzer or motor).</li>
                  <li><strong style={{ color: T.text }}>Pin 2 (Base):</strong> The middle pin. This is the trigger. Connect this to your ESP32 or sensor through a resistor.</li>
                  <li><strong style={{ color: T.text }}>Pin 3 (Emitter):</strong> The right pin. Connect this directly to Ground to let the heavy current escape.</li>
                </ul>
              </div>
            </div>

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${T.primary}`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>
        ) : componentName === '555 Timer IC' ? (
          <div>
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

              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 12 }}>The chip has 8 pins. Look for the small indented dot or half-circle notch on the top of the chip to find Pin 1 (top left).</p>
                <ul style={{ paddingLeft: 24, color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  <li><strong style={{ color: T.text }}>Power (Pin 8):</strong> Must be connected to the VIN (5V) rail, not the 3.3V rail.</li>
                  <li><strong style={{ color: T.text }}>Ground (Pin 1):</strong> Connect to Ground.</li>
                  <li><strong style={{ color: T.text }}>Output (Pin 3):</strong> This is where the heartbeat pulse comes out. Connect it to an LED (with a 220 Ohm resistor) to see the pulse in action.</li>
                </ul>
              </div>
            </div>

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${T.primary}`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>
        ) : componentName === 'USB Cable' ? (
          <div>
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

              <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <p style={{ color: T.textSub, lineHeight: 1.8, marginBottom: 24 }}>
                  <strong style={{ color: T.text }}>The Connection:</strong> Plug the micro-USB end into the silver port on the ESP32 and the large USB-A end into your computer.
                </p>
                <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#ef4444' }}>The Warning</h4>
                <p style={{ color: T.textSub, lineHeight: 1.8 }}>
                  Always ensure you are using the cable provided in the kit. Many cheap cables found around the house are <strong>"Charge-only"</strong> cables—they are missing the two internal data wires completely. If you use one of those, your board will turn on, but your computer will refuse to talk to it!
                </p>
              </div>
            </div>

            <button onClick={() => setComponentName(null)} style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${T.primary}`, color: T.primary, borderRadius: 8, marginTop: 20, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}>
              &larr; Back to Kit
            </button>
          </div>) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🛠️</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: T.text }}>
              {componentName}
            </h1>
            <p style={{ fontSize: 16, color: T.textSub, lineHeight: 1.8 }}>
              Detailed deep-dive information for this component is currently being written. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── REFERRAL MODAL ───────────────────────────────────────────────────
function Referral({ T, onClose }) {
  const [name, setName] = useState('');
  const [ok, setOk] = useState(false);
  const txt = `I just unlocked the Beginners Formula to IoT platform!\n\nThe breadboard visualizer is genuinely something else — hover any row and the hidden copper tracks light up live. Plus there's an AI project builder that spits out full ESP32 code for any IoT idea you throw at it.\n\nbfiot.app\n\n— ${name || 'A curious builder'
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

function ProjectLabPage({ T, result, setResult, setHistory }) {
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
      } catch {
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
    } catch {
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

      const systemPrompt = `You are the technical mentor from the YouTube channel "BFIOT".    You are helping the user assemble the following project. Avoid generic replies.    PROJECT WORKBENCH DATA:    ${JSON.stringify(projectBrief)}
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
    } catch {
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
    let md = `# ${overview.hook || 'Project Blueprint'}\n\n**Concept:** ${overview.concept
      }\n**Difficulty:** ${overview.difficulty} | **Time:** ${overview.buildTime
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
    link.download = `${result.code?.filename?.replace('.ino', '') || 'project'
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
      {/* Header */}     {' '}
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
          <span style={{ color: T.primary }}>I'll handle the rest.</span>       {' '}
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
          categorised parts, and commented C++ code.        {' '}
        </p>
        {' '}
      </div>
      {/* Input */}     {' '}
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
              border: `1px solid ${idea.trim() && !loading ? T.primary : T.border
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
      {/* Suggested Quick Starts */}     {' '}
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
                {e}             {' '}
              </button>
            ))}
            {' '}
          </div>
          {' '}
        </div>
      )}
      {/* Loading state indicator */}     {' '}
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
      {/* Results Section */}     {' '}
      {result && (
        <div className="fu">
          {/* Dynamic Safety Checker */}
          <SafetyAlert result={result} T={T} />         {' '}
          {/* Action Tabs and Export Toolbar */}         {' '}
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
                  {t.l}               {' '}
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
          {/* Overview Tab Content */}         {' '}
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
          {/* Parts Tab Content */}         {' '}
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
          {/* Steps Tab Content */}         {' '}
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
          {/* Code Tab Content */}         {' '}
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
                        Copy                      {' '}
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
          {/* Rebuild Reset */}         {' '}
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
            ← Build a different project          {' '}
          </button>
          {' '}
        </div>
      )}
      {/* Floating Glassmorphic Mentor Chat Panel */}     {' '}
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
                {log.m}             {' '}
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
            <div ref={chatEndRef} />         {' '}
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
// eslint-disable-next-line no-unused-vars
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
    } catch {
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
// eslint-disable-next-line no-unused-vars
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
  c1: { title: 'Capstone: Vault Alarm' },
  c2: { title: 'Capstone: Thermometer' },
  c3: { title: 'Capstone: Desktop Radar' },
  p4m1: { title: '4.1 High-Voltage Bridge' },
  p4m2: { title: '4.2 The Local Hotspot' },
  p4m3: { title: '4.3 Two-Way Data' },
  p4cap: { title: 'Capstone: Smart Home Hub' },
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('bfiot_auth') === 'true');
  const [dark, setDark] = useState(false);
  const T = dark ? DARK : LIGHT;
  const [p0, setP0] = useState(true);
  const [page, setPage] = useState('gz'); // default to Ground Zero
  const [p1, setP1] = useState(true);
  const [p2, setP2] = useState(true);
  const [p3, setP3] = useState(true);
  const [p4, setP4] = useState(true);
  const [modal, setModal] = useState(false);
  const [k, setK] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [activeComponentModal, setActiveComponentModal] = useState(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setFaqOpen(false), [page]); // Persistent Maker's Log & Cheat Code states
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const unlocked = true;
  const [overrideGlitch, setOverrideGlitch] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowMobileWarning(true);
    }
  }, []);

  useEffect(() => {
    const cachedHistory = localStorage.getItem('bfiot_history_log');
    if (cachedHistory) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHistory(JSON.parse(cachedHistory));
      } catch {
        localStorage.removeItem('bfiot_history_log');
      }
    }
  }, []); // System unlock bfiot listener

  useEffect(() => {
    let strokeSequence = '';
    const handleKeyStroke = (e) => {
      strokeSequence = (strokeSequence + e.key).slice(-5).toLowerCase();
      if (strokeSequence === 'bfiot') {
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
    gz1: ['Phase 0', '0.1 · The Language of Electricity'],
    gz2: ['Phase 0', '0.2 · Anatomy of a Breadboard'],
    gz3: ['Phase 0', '0.3 · The Multimeter'],
    gz4: ['Phase 0', '0.4 · Reading Resistors'],
    gz5: ['Phase 0', '0.5 · The Maker Kit'],

    p1m1: ['Phase 1', 'Module 1.1 · The Physical Handshake'],
    p1m2: ['Phase 1', 'Module 1.2 · The Analog Bridge'],
    p1m3: ['Phase 1', 'Module 1.3 · Physical Logic Gates'],
    p1m4: ['Phase 1', 'Module 1.4 · The Automatic Night Light'],
    p1m5: ['Phase 1', 'Module 1.5 · Hardware Timers'],
    p1cap: ['Phase 1', 'Capstone · Vault Alarm'],

    p2m1: ['Phase 2', 'Module 2.1 · Software Gatekeeper'],
    p2m2: ['Phase 2', 'Module 2.2 · Digital Inputs'],
    p2m3: ['Phase 2', 'Module 2.3 · Analog Outputs & PWM'],
    p2m4: ['Phase 2', 'Module 2.4 · Serial Communication'],
    p2cap: ['Phase 2', 'Capstone · Thermometer'],

    p3m1: ['Phase 3', 'Module 3.1 · Servos & Motors'],
    p3m2: ['Phase 3', 'Module 3.2 · OLED Displays'],
    p3m3: ['Phase 3', 'Module 3.3 · Environmental Sensing'],
    p3m4: ['Phase 3', 'Module 3.4 · Relay Power Control'],
    p3cap: ['Phase 3', 'Capstone · Desktop Radar'],

    p4m1: ['Phase 4', 'Module 4.1 · High-Voltage Bridge'],
    p4m2: ['Phase 4', 'Module 4.2 · The Local Hotspot'],
    p4m3: ['Phase 4', 'Module 4.3 · Two-Way Data'],
    p4m4: ['Phase 4', 'Module 4.4 · Cloud Dashboard'],
    p4cap: ['Phase 4', 'Capstone · Smart Home Hub'],
  }[page] || ['', ''];

  // Global auth removed

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
      <style>{CSS}</style>
      {showMobileWarning && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, background: T.amber, color: '#fff',
          padding: '12px 24px', zIndex: 9999, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: 600, fontSize: 14
        }}>
          <span><span style={{ marginRight: 8 }}>⚠️</span> For the best experience, please use a computer.</span>
          <button onClick={() => setShowMobileWarning(false)} style={{
            background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold'
          }}>✕</button>
        </div>
      )}
      {/* Hamburger Overlay for Mobile */}     {' '}
      <div
        className={`overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />
      {/* SIDEBAR NAVIGATION */}     {' '}
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
                width: 48,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
                overflow: 'visible'
              }}
              onClick={() => window.open('https://bfiot.app', '_blank')}
            >
              {' '}
              <img src="/logo2.png" alt="BFIOT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {' '}
            <div style={{ cursor: 'pointer' }} onClick={() => { setPage('gz'); setSelectedPhase(null); setSelectedModule(null); }}>
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
          <button
            onClick={() => setP0(!p0)}
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
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: 9,
                  color: T.textMuted,
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                PHASE 0
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textSub,
                  marginTop: 1,
                }}
              >
                Before You Build
              </div>
            </div>
            <div
              style={{
                transform: p0 ? 'rotate(0)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ChevD s={14} c={T.textMuted} />
            </div>
          </button>
          {p0 && (
            <div style={{ paddingLeft: 2 }}>
              <LBtn id="gz1" title="Module 0.1" tag="Language of Electricity" active={page === 'gz1'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="gz2" title="Module 0.2" tag="Inside a Breadboard" active={page === 'gz2'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="gz3" title="Module 0.3" tag="Component Anatomy" active={page === 'gz3'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="gz4" title="Module 0.4" tag="Reading Resistors" active={page === 'gz4'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="gz5" title="Module 0.5" tag="The Formula " active={page === 'gz5'} locked={!unlocked} onClick={go} T={T} />
            </div>
          )}
          <div style={{ height: 8 }} />

          {/* Phase 1 */}
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
            <div style={{ textAlign: 'left' }}>
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
            </div>
            <div
              style={{
                transform: p1 ? 'rotate(0)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ChevD s={14} c={T.textMuted} />
            </div>
          </button>
          {p1 && (
            <div style={{ paddingLeft: 2 }}>
              <LBtn id="p1m1" title="Module 1.1" tag="Physical Handshake" active={page === 'p1m1'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p1m2" title="Module 1.2" tag="Analog Bridge" active={page === 'p1m2'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p1m3" title="Module 1.3" tag="Logic Gates" active={page === 'p1m3'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p1m4" title="Module 1.4" tag="Auto Night Light" active={page === 'p1m4'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p1m5" title="Module 1.5" tag="Hardware Timers" active={page === 'p1m5'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p1cap" title="Capstone" tag="Vault Alarm" active={page === 'p1cap'} locked={!unlocked} onClick={go} T={T} special />
            </div>
          )}
          <div style={{ height: 8 }} />

          {/* Phase 2 */}
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
            <div style={{ textAlign: 'left' }}>
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
            </div>
            <div
              style={{
                transform: p2 ? 'rotate(0)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ChevD s={14} c={T.textMuted} />
            </div>
          </button>
          {p2 && (
            <div style={{ paddingLeft: 2 }}>
              <LBtn id="p2m1" title="Module 2.1" tag="Software Gatekeeper" active={page === 'p2m1'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p2m2" title="Module 2.2" tag="Digital Inputs" active={page === 'p2m2'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p2m3" title="Module 2.3" tag="Analog Outputs" active={page === 'p2m3'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p2m4" title="Module 2.4" tag="Serial Comm" active={page === 'p2m4'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p2cap" title="Capstone" tag="Thermometer" active={page === 'p2cap'} locked={!unlocked} onClick={go} T={T} special />
            </div>
          )}
          <div style={{ height: 8 }} />

          {/* Phase 3 */}
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
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: 9,
                  color: T.primary,
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                PHASE 3
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textSub,
                  marginTop: 1,
                }}
              >
                Analog & Real World
              </div>
            </div>
            <div
              style={{
                transform: p3 ? 'rotate(0)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ChevD s={14} c={T.textMuted} />
            </div>
          </button>
          {p3 && (
            <div style={{ paddingLeft: 2 }}>
              <LBtn id="p3m1" title="Module 3.1" tag="Servos & Motors" active={page === 'p3m1'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p3m2" title="Module 3.2" tag="OLED Displays" active={page === 'p3m2'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p3m3" title="Module 3.3" tag="Env. Sensing" active={page === 'p3m3'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p3m4" title="Module 3.4" tag="Relay Power" active={page === 'p3m4'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p3cap" title="Capstone" tag="Desktop Radar" active={page === 'p3cap'} locked={!unlocked} onClick={go} T={T} special />
            </div>
          )}
          <div style={{ height: 8 }} />

          {/* Phase 4 */}
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
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: 9,
                  color: '#d946ef',
                  fontFamily: "'JetBrains Mono',monospace",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                PHASE 4
              </div>
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
            </div>
            <div
              style={{
                transform: p4 ? 'rotate(0)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
              }}
            >
              <ChevD s={14} c={T.textMuted} />
            </div>
          </button>
          {p4 && (
            <div style={{ paddingLeft: 2 }}>
              <LBtn id="p4m1" title="Module 4.1" tag="High-Voltage Bridge" active={page === 'p4m1'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p4m2" title="Module 4.2" tag="The Local Hotspot" active={page === 'p4m2'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p4m3" title="Module 4.3" tag="Two-Way Data" active={page === 'p4m3'} locked={!unlocked} onClick={go} T={T} />
              <LBtn id="p4cap" title="Capstone" tag="Smart Home Hub" active={page === 'p4cap'} locked={!unlocked} onClick={go} T={T} special />
            </div>
          )}
          {/* Maker's Log persistence timeline */}         {' '}
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
                    {item.name}                 {' '}
                  </button>
                ))}
                {' '}
              </div>
              {' '}
            </div>
          )}
          <div style={{ height: 12 }} />         {' '}
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
              <Beaker s={11} c={T.green} />             {' '}
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
            Share Workbench          {' '}
          </button>
          {' '}
        </div>
        {' '}
      </aside>
      {/* MAIN CONTENT AREA */}     {' '}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Top Header Block */}       {' '}
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
              <span
                style={{ color: T.textMuted, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = T.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = T.textMuted}
                onClick={() => window.open('https://bfiot.app', '_blank')}
              >
                bfiot
              </span>
              {crumb[0] ? (
                <>
                  <span style={{ color: T.textMuted }}>/</span>             {' '}
                  <span style={{ color: T.textSub }}>{crumb[0]}</span>
                  <span style={{ color: T.textMuted }}>/</span>             {' '}
                  <span style={{ color: T.primary }}>{crumb[1]}</span>           {' '}
                </>
              ) : (
                <>
                  <span style={{ color: T.textMuted }}>/</span>             {' '}
                  <span style={{ color: T.primary }}>home /</span>           {' '}
                </>
              )}
            </div>
            {' '}
          </div>
          {' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {' '}

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
        {/* Page Container */}       {' '}
        <div
          className="main-pad"
          style={{ flex: 1, overflowY: 'auto' }}
          key={k}
        >
          {' '}
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            {' '}
            {page !== 'gz' && !isAuthenticated && (
              <div className="fu" style={{ padding: '40px 0', height: '100%', minHeight: 500 }}>
                <Login
                  onLogin={() => {
                    setIsAuthenticated(true);
                    localStorage.setItem('bfiot_auth', 'true');
                  }}
                  onCancel={() => setPage('gz')}
                  T={T}
                />
              </div>
            )}
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
                    We built this material because we know firsthand how brutally tough the initial learning curve can be. We never want you to hit a wall and give up just because the right guidance wasn't there. It genuinely hurts to see beginners accidentally fry their first components and feel utterly defeated.
                    <br /><br />
                    But please understand, we aren't here to spoon-feed you. This guide is purposefully incomplete, which is meant to challenge you. We want to push you to step into the unknown, ask the hard questions, and seek out new answers on your own. That is the exact moment when real learning begins.
                    <br /><br />
                    And truth be told, no matter how carefully you follow along, you <i>will</i> eventually plug something in backward. You will experience the dreaded "magic smoke." Don't let it break you. Embrace it. It's an essential, beautiful part of the journey.
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
                    those holes even do —                    {' '}
                    <strong style={{ color: T.text }}>
                      you're exactly who this was written for. Don't skip it.
                    </strong>
                    {' '}
                  </p>
                  {' '}
                </div>
                {' '}
              </div>
            )}

            {page === 'gz1' && (
              <div className="fu">
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
                  {/* Physics Ohm's Law block */}                 {' '}
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

                <div style={{ marginTop: 52, paddingBottom: 52 }}>
                  <PlumbingSim T={T} />
                </div>
              </div>
            )}

            {page === 'gz2' && (
              <div className="fu">
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
                    see the hidden copper strips underneath.                  {' '}
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
                      <BBViz T={T} activeWireState={false} />                   {' '}
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
                      <div
                        style={{
                          background: `${T.primary}10`,
                          border: `1px solid ${T.primaryBorder}`,
                          borderRadius: 10,
                          padding: 16,
                          marginTop: 20,
                        }}
                      >
                        {' '}
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: T.primary,
                            marginBottom: 6,
                          }}
                        >
                          Important Note on Power Rails
                        </div>
                        {' '}
                        <p
                          style={{
                            fontSize: 13,
                            color: T.textSub,
                            lineHeight: 1.6,
                            margin: 0,
                          }}
                        >
                          Not all breadboards are created equal! Some have continuous painted power lines (meaning the power rail runs the entire length of the board). Others, like the one visualized here, have a break in the painted lines exactly in the middle. This broken line signifies an invisible electrical break in the copper strip, separating the top half from the bottom half. This is incredibly useful if you need to supply two different voltages (e.g., 5V to the top section and 3.3V to the bottom section) on the same board. Always check the painted lines on your physical breadboard to see which type you have!
                        </p>
                        {' '}
                      </div>
                      {' '}
                    </div>
                    {' '}
                  </div>
                  {' '}
                </section>
                {' '}
              </div>
            )}

            {page === 'gz3' && (
              <div className="fu">
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
                    each one.                  {' '}
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
              </div>
            )}

            {page === 'gz4' && (
              <div className="fu">
                <div style={{ marginBottom: 48 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.primaryBg, border: `1px solid ${T.primaryBorder}`, borderRadius: 20, padding: '4px 12px', marginBottom: 18 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: T.primary, letterSpacing: 0.5 }}>SKILL ACQUISITION</span>
                  </div>
                  <h1 style={{ fontSize: 38, fontWeight: 800, color: T.text, lineHeight: 1.12, marginBottom: 16 }}>
                    Reading <span style={{ color: T.primary }}>Resistors</span>
                  </h1>
                  <p style={{ fontSize: 16, lineHeight: 1.9, color: T.textSub, maxWidth: 600 }}>
                    Resistors are too small to print numbers on. Instead, they use colored bands. Let's decode them so you never accidentally use a 10kΩ instead of a 220Ω.
                  </p>
                </div>

                <div style={{ marginBottom: 52 }}>
                  <ResistorDecoderSim T={T} />
                </div>

                <section style={{ marginBottom: 52 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 12 }}>Standard 4-Band Resistors</h3>
                      <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.8, marginBottom: 16 }}>
                        Most common in starter kits. The last band is separated by a gap and indicates tolerance (usually Gold). The other three bands give you the value.
                      </p>
                      <ul style={{ paddingLeft: 20, color: T.textSub, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                        <li><strong style={{ color: T.text }}>Band 1 & 2:</strong> The first two digits.</li>
                        <li><strong style={{ color: T.text }}>Band 3:</strong> The multiplier (add this many zeros).</li>
                        <li><strong style={{ color: T.text }}>Band 4:</strong> Tolerance (Gold = ±5%).</li>
                      </ul>
                    </div>

                    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 12 }}>Precision 5-Band Resistors</h3>
                      <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.8, marginBottom: 16 }}>
                        Used when precise resistance is needed. They just add a third digit band before the multiplier. Often found with a blue casing.
                      </p>
                      <ul style={{ paddingLeft: 20, color: T.textSub, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                        <li><strong style={{ color: T.text }}>Band 1, 2 & 3:</strong> The first three digits.</li>
                        <li><strong style={{ color: T.text }}>Band 4:</strong> The multiplier (add this many zeros).</li>
                        <li><strong style={{ color: T.text }}>Band 5:</strong> Tolerance (Brown = ±1%).</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <div style={{ background: T.amberBg, border: `1px solid ${T.amberBorder}`, borderLeft: `3px solid ${T.amber}`, borderRadius: '0 10px 10px 0', padding: '16px 22px', marginBottom: 52 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.amber, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8 }}>QUICK REFERENCE</div>
                  <p style={{ fontSize: 14, lineHeight: 1.85, color: T.textSub, margin: 0 }}>
                    <strong style={{ color: T.text }}>220Ω (Red-Red-Brown):</strong> Your best friend. Use this to protect LEDs from burning out. <br />
                    <strong style={{ color: T.text }}>10kΩ (Brown-Black-Orange):</strong> Your second best friend. Used as "pull-up" or "pull-down" resistors for buttons.
                  </p>
                </div>
              </div>
            )}

            {page === 'gz5' && (
              <div className="fu">
                <div style={{ marginBottom: 48 }}>
                  <h1 style={{ fontSize: 38, fontWeight: 800, color: T.text, lineHeight: 1.12, marginBottom: 16 }}>
                    The <span style={{ color: T.primary }}>Maker Kit</span>
                  </h1>
                  <p style={{ fontSize: 16, lineHeight: 1.9, color: T.textSub, maxWidth: 600 }}>
                    Here's exactly what is inside your kit and what each component does. You will use these throughout the curriculum.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 52 }}>
                  {[
                    { n: 'ESP32 Development Board', icon: '🧠', img: 'https://5.imimg.com/data5/SELLER/Default/2024/5/415247702/WU/WQ/YV/60596912/esp-32-development-board-with-wifi-and-bluetooth.jpg', d: 'The brain of the operation. Contains a dual-core processor, Wi-Fi, and Bluetooth. It runs your code and controls everything else.' },
                    { n: 'Breadboard', icon: '🧲', img: 'https://robocraze.com/cdn/shop/products/2_GL12_840_Points_Breadboard.png?v=1743775778', d: 'The prototyping base. Allows you to connect components together without any soldering using internal metal clips.' },
                    { n: 'Jumper Wires', icon: '🔌', img: 'https://robocraze.com/cdn/shop/files/3_Male_to_Female_Jumper_Wires_20cm_20pcs_1000x.png?v=1758691490', d: 'The circulatory system. These carry voltage and signals between your ESP32 and your components.' },
                    { n: '0.96" OLED Display', icon: '📺', img: 'https://i.ibb.co/FkDrwpqd/Untitled-design-3.png', d: 'A tiny, crisp screen that uses I2C communication. Perfect for showing sensor data or debugging information directly on the hardware.' },
                    { n: 'DHT11 Sensor', icon: '🌡️', img: 'https://auhbsvzkkblo2s0k.public.blob.vercel-storage.com/DHT11_Humidity_Temperature_Sensor_Module_1000x.jpg', d: 'A digital sensor that measures ambient temperature and humidity. Great for weather stations.' },
                    { n: 'Ultrasonic Sensor (HC-SR04)', icon: '🦇', img: 'https://spare3d.in/wp-content/uploads/2017/06/Spare3d_ultrasonic_sensor_hc_sr04.jpg', d: 'Acts like bat echolocation. It sends out an ultrasonic ping and measures how long it takes to bounce back, calculating distance.' },
                    { n: 'IR Sensor', icon: '👁️', img: 'https://probots.co.in/pub/media/catalog/product/cache/d8ddd0f9b0cd008b57085cd218b48832/i/r/ir-sensor-module-line-following.jpg', d: 'Detects infrared light bouncing off objects. Used for obstacle avoidance or detecting black/white lines.' },
                    { n: 'LDR (Light Sensor)', icon: '☀️', img: 'https://www.sunrobotics.in/cdn/shop/files/LDR-module-1_60b4d653-45a9-4e6f-83f5-d8877c29bbcb_1920x.png?v=1746160216', d: 'A Light Dependent Resistor. Its resistance changes based on how much light hits its face.' },
                    { n: 'Active Buzzer', icon: '🔊', img: 'https://robu.in/_next/image/?url=https%3A%2F%2Frobu-prod-media.s3.ap-south-1.amazonaws.com%2Fuploads%2F2024%2F10%2FActive-Buzzer.png&w=1920&q=90', d: 'A simple speaker that emits a loud beep when provided with power. Great for alarms.' },
                    { n: 'SG90 Servo Motor', icon: '🦾', img: 'https://store.moonpreneur.com/cdn/shop/files/servo_800x1026_crop_center@2x.jpg?v=1744700803', d: 'A precise motor that can rotate to specific angles (0-180 degrees) based on PWM signals.' },
                    { n: '5V Single Channel Relay', icon: '⚡', img: 'https://5.imimg.com/data5/SELLER/Default/2020/11/FK/WK/OH/15458098/5v-relay-module-500x500.jpg', d: 'An electromechanical switch. It allows your delicate, low-voltage ESP32 to safely control high-power devices by using an internal electromagnet.' },
                    { n: 'DC Motor with Fan Blade', icon: '🌀', img: 'https://i.ibb.co/Ps6kdgvy/file-00000000b07071fab5951d676892daaa.png', d: 'A continuous rotation motor paired with a plastic propeller. It turns electrical energy into physical motion and aerodynamic thrust, perfect for automated cooling fans.' },
                    { n: 'Push Buttons', icon: '🔘', img: 'https://projectpoint.in/image/cache/catalog/button_12mm-800x800.jpg', d: 'Simple tactile switches that close a circuit when pressed, used for user input.' },
                    { n: 'LEDs', icon: '💡', img: 'https://dynokart.in/wp-content/uploads/2018/08/3mm-led-1.jpg', d: 'Light Emitting Diodes. They turn electrical current into light. Always use them with a resistor!' },
                    { n: 'Resistors', icon: '🛑', img: 'https://5.imimg.com/data5/SELLER/Default/2023/12/369621363/DH/RH/UO/21085075/resistors-th-and-smd.jpg', d: 'They restrict the flow of current. Essential for protecting delicate components like LEDs from receiving too much power.' },
                    { n: 'Capacitors', icon: '🔋', img: 'https://i.ibb.co/VcwYXGcq/file-0000000008687208ae5bb40738f77c57.png', d: 'They act like tiny, lightning-fast batteries. They store and release electrical energy quickly to smooth out power drops and keep your circuits stable.' },
                    { n: 'Potentiometer', icon: '🎛️', img: 'https://robodo.in/cdn/shop/products/51mNAteWA9L.jpg?v=1672847436', d: 'An adjustable twist-knob resistor. Turn the dial to smoothly increase or decrease the voltage flowing through your circuit, exactly like a volume knob on a speaker.' },
                    { n: 'BC547 transistors', icon: '🔀', img: 'https://etechrobot.com/wp-content/uploads/2025/11/BC547-Transistor-300x300.png', d: 'The electronic muscle of your kit. It acts as a digital switch, allowing a tiny, weak signal from your ESP32 to safely control high-power devices like motors.' },
                    { n: '555 Timer IC', icon: '⏱️', img: 'https://probots.co.in/pub/media/catalog/product/cache/d8ddd0f9b0cd008b57085cd218b48832/5/5/555_lrg.jpg', d: 'A legendary microchip that acts as a heartbeat for your circuit. It creates perfect timing pulses to blink lights or make sirens without needing any code.' },
                    { n: 'USB Cable', icon: '🔌', img: 'https://rukmini1.flixcart.com/image/1500/1500/xif0q/data-cable/micro-usb-cable/7/9/l/15w-micro-usb-cable-for-super-fast-charge-treams-original-imahgmeeq4ttrahz.jpeg?q=70', d: 'The lifeline of your project. It provides raw power to your board and transfers your compiled code from your computer straight into the ESP32\'s memory.' }
                  ].map(item => (
                    <div key={item.n} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ width: '100%', aspectRatio: '1/1', background: T.primaryBg, borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={item.img || `https://placehold.co/300x300/png?text=${encodeURIComponent(item.n)}`} alt={item.n} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, background: T.primaryBg, border: `1px solid ${T.primaryBorder}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                          {item.icon}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{item.n}</div>
                      </div>
                      <p style={{ fontSize: 13.5, color: T.textSub, lineHeight: 1.7, flex: 1 }}>{item.d}</p>
                      <button
                        onClick={() => setActiveComponentModal(item.n)}
                        style={{
                          marginTop: 16,
                          padding: '8px 16px',
                          background: 'transparent',
                          border: `1px solid ${T.primary}`,
                          color: T.primary,
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          width: '100%',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.primary; }}
                      >
                        Read More
                      </button>
                    </div>
                  ))}
                </div>
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
                    onClick={() => go('p1m1')}
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
              </div>
            )}
            {' '}
            {/* If our active page matches an internal Lesson Database key, render the dynamic premium view */}
            {' '}
            {isAuthenticated && activeLesson && !page.startsWith('gz') ? (
              (
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
                    {(activeLesson.observation || activeLesson.whatYouWillObserve) && (
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
                          Will Observe                        {' '}
                        </h3>
                        {' '}
                        <p
                          style={{
                            fontSize: 14,
                            color: T.text,
                            lineHeight: 1.8,
                          }}
                        >
                          {activeLesson.observation || activeLesson.whatYouWillObserve}
                        </p>
                        {' '}
                      </div>
                    )}
                    {/* FAQ Section */}                   {' '}
                    {(activeLesson.faq || activeLesson.troubleshooting) && (activeLesson.faq || activeLesson.troubleshooting).length > 0 && (
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
                            {(activeLesson.faq || activeLesson.troubleshooting).map((f, i) => (
                              <div
                                key={i}
                                style={{
                                  marginBottom:
                                    i === (activeLesson.faq || activeLesson.troubleshooting).length - 1 ? 0 : 16,
                                  paddingBottom:
                                    i === (activeLesson.faq || activeLesson.troubleshooting).length - 1 ? 0 : 16,
                                  borderBottom:
                                    i === (activeLesson.faq || activeLesson.troubleshooting).length - 1
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
                                  • {f.error || f.q}
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
                                  {f.solution || f.a}
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
                            {Array.isArray(activeLesson.code.breakdown) ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {activeLesson.code.breakdown.map((b, i) => (
                                  <div key={i} style={{ display: 'flex', gap: 12 }}>
                                    <div style={{ background: T.primary, color: T.surface, padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 'bold', height: 'fit-content', whiteSpace: 'nowrap' }}>Line {b.line}</div>
                                    <div style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>{b.desc}</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              activeLesson.code.breakdown
                            )}
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
              isAuthenticated && page === 'lab' ? (
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
      {modal && <Referral T={T} onClose={() => setModal(false)} />}
      <ComponentModal componentName={activeComponentModal} T={T} onClose={() => setActiveComponentModal(null)} />
    </div>
  );
}
