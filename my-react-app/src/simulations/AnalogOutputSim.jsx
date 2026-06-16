import React, { useState } from 'react';

export default function AnalogOutputSim({ T }) {
  const [pwmValue, setPwmValue] = useState(0);

  // Map 0-255 to 0-1 opacity for visual effect
  const brightness = pwmValue / 255;

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        Drag the slider to adjust the duty cycle (0-255). This changes the average voltage reaching the LED, simulating analog fading.
      </p>

      <div style={{ background: T.surfaceAlt, padding: 32, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ position: 'relative', width: 60, height: 60, marginBottom: 40 }}>
          {/* LED Glow */}
          <div style={{
            position: 'absolute', top: -20, left: -20, right: -20, bottom: -20,
            background: '#3b82f6', borderRadius: '50%', filter: 'blur(20px)',
            opacity: brightness, transition: 'opacity 0.1s'
          }} />
          
          {/* Physical LED */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `rgba(59, 130, 246, ${0.2 + (brightness * 0.8)})`,
            border: `2px solid #1d4ed8`, borderRadius: '50% 50% 10% 10%',
            boxShadow: `inset -5px -5px 15px rgba(0,0,0,0.5), inset 5px 5px 15px rgba(255,255,255,${0.3 + brightness * 0.5})`
          }} />
          
          {/* Legs */}
          <div style={{ position: 'absolute', bottom: -30, left: 20, width: 4, height: 30, background: '#94a3b8' }} />
          <div style={{ position: 'absolute', bottom: -25, left: 36, width: 4, height: 25, background: '#94a3b8' }} />
        </div>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, fontWeight: 700, color: T.text }}>
            <span>0 (0V)</span>
            <span style={{ color: T.primary }}>{pwmValue} / 255</span>
            <span>255 (3.3V)</span>
          </div>
          <input 
            type="range" min="0" max="255" value={pwmValue} 
            onChange={(e) => setPwmValue(Number(e.target.value))}
            style={{ width: '100%', accentColor: T.primary }}
          />
        </div>

      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, padding: 12, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 4 }}>DUTY CYCLE</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: 'monospace' }}>{Math.round((pwmValue / 255) * 100)}%</div>
        </div>
        <div style={{ flex: 1, padding: 12, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 4 }}>AVG VOLTAGE</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: 'monospace' }}>{(brightness * 3.3).toFixed(2)}V</div>
        </div>
      </div>
    </div>
  );
}
