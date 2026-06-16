import React, { useState } from 'react';

export default function ServoMotorSim({ T }) {
  const [angle, setAngle] = useState(90);

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        Drag the slider to sweep the servo motor from 0° to 180°. Notice how the physical arm responds to the requested PWM signal.
      </p>

      <div style={{ background: T.surfaceAlt, padding: 32, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* SG90 Mock */}
        <div style={{ position: 'relative', width: 80, height: 60, background: '#1e40af', borderRadius: 8, border: '2px solid #1e3a8a', marginBottom: 60 }}>
          <div style={{ position: 'absolute', top: 10, left: -10, width: 10, height: 40, background: '#1e3a8a', borderRadius: '4px 0 0 4px' }} />
          <div style={{ position: 'absolute', top: 10, right: -10, width: 10, height: 40, background: '#1e3a8a', borderRadius: '0 4px 4px 0' }} />
          
          <div style={{ position: 'absolute', top: '50%', left: 20, transform: 'translateY(-50%)', width: 40, height: 40, background: '#1e3a8a', borderRadius: '50%', border: '2px solid #172554' }}>
            {/* Servo Horn (Arm) */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', width: 6, height: 50, background: '#fff',
              transformOrigin: 'top center', transform: `translate(-50%, 0) rotate(${angle - 90}deg)`,
              borderRadius: 3, border: '1px solid #ccc', zIndex: 2, transition: 'transform 0.1s'
            }}>
              {/* Center screw */}
              <div style={{ position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, background: '#999', borderRadius: '50%' }} />
              {/* Holes */}
              <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', width: 2, height: 2, background: '#999', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: 2, height: 2, background: '#999', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', width: 2, height: 2, background: '#999', borderRadius: '50%' }} />
            </div>
          </div>
          
          <div style={{ position: 'absolute', bottom: 5, right: 10, fontSize: 10, color: '#93c5fd', fontWeight: 800 }}>SG90</div>
          
          {/* Wires */}
          <div style={{ position: 'absolute', bottom: -20, left: 10, width: 3, height: 20, background: '#ca8a04' }} />
          <div style={{ position: 'absolute', bottom: -20, left: 15, width: 3, height: 20, background: '#ef4444' }} />
          <div style={{ position: 'absolute', bottom: -20, left: 20, width: 3, height: 20, background: '#450a0a' }} />
        </div>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, fontWeight: 700, color: T.text }}>
            <span>0°</span>
            <span style={{ color: T.primary }}>{angle}°</span>
            <span>180°</span>
          </div>
          <input 
            type="range" min="0" max="180" value={angle} 
            onChange={(e) => setAngle(Number(e.target.value))}
            style={{ width: '100%', accentColor: T.primary }}
          />
        </div>

      </div>
    </div>
  );
}
