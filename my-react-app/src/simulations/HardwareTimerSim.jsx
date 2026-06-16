import React, { useState, useEffect } from 'react';

export default function HardwareTimerSim({ T }) {
  const [capacitance, setCapacitance] = useState(10); // uF
  const [resistance, setResistance] = useState(10); // kOhm
  const [ledState, setLedState] = useState(false);

  // Frequency ~ 1.44 / ((R1 + 2R2) * C)
  // Simplifying for visual effect:
  // Freq is inversely proportional to R * C
  const delayMs = Math.max(50, (capacitance * resistance * 5));

  useEffect(() => {
    const timer = setInterval(() => {
      setLedState(prev => !prev);
    }, delayMs);
    return () => clearInterval(timer);
  }, [delayMs]);

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        Adjust the resistor (R) and capacitor (C) values to see how the RC time constant changes the 555 Timer's pulse rate.
      </p>
      
      <div style={{ background: T.surfaceAlt, padding: 20, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            width: 80, height: 60, background: '#222', borderRadius: 8, border: '2px solid #444',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontFamily: 'monospace'
          }}>
            NE555
          </div>
          <div style={{ width: 40, height: 4, background: '#555', alignSelf: 'center' }} />
          <div style={{
            width: 30, height: 30, borderRadius: '50%', background: ledState ? '#ef4444' : '#450a0a',
            boxShadow: ledState ? '0 0 20px #ef4444' : 'none', alignSelf: 'center', border: '2px solid #333'
          }} />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: 'block', marginBottom: 8 }}>
            Capacitor Value: {capacitance} μF
          </label>
          <input 
            type="range" min="1" max="100" value={capacitance} 
            onChange={(e) => setCapacitance(e.target.value)}
            style={{ width: '100%', accentColor: T.primary }}
          />
        </div>
        
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: 'block', marginBottom: 8 }}>
            Resistor Value: {resistance} kΩ
          </label>
          <input 
            type="range" min="1" max="50" value={resistance} 
            onChange={(e) => setResistance(e.target.value)}
            style={{ width: '100%', accentColor: T.primary }}
          />
        </div>
      </div>
      
      <div style={{ fontSize: 11, color: T.textMuted, textAlign: 'center', fontFamily: 'monospace' }}>
        Current Delay: {delayMs}ms
      </div>
    </div>
  );
}
