import React, { useState, useEffect } from 'react';

export default function DesktopRadarSim({ T }) {
  const [angle, setAngle] = useState(0);
  const [direction, setDirection] = useState(1);
  const [targetAngle, setTargetAngle] = useState(45);
  const [targetDistance, setTargetDistance] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setAngle(prev => {
        let next = prev + (direction * 5);
        if (next >= 180) {
          setDirection(-1);
          next = 180;
        } else if (next <= 0) {
          setDirection(1);
          next = 0;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [direction]);

  // Check if radar beam hits target
  const diff = Math.abs(angle - targetAngle);
  const isHit = diff < 10;

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        Watch the simulated ultrasonic sensor sweep on a servo motor. Drag the sliders to place a virtual object in its path and see it appear on the OLED radar!
      </p>

      <div style={{ background: T.surfaceAlt, padding: 24, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20 }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 30 }}>
          {/* Servo & Ultrasonic Assembly */}
          <div style={{ position: 'relative', width: 100, height: 100, background: '#111', borderRadius: '50% 50% 0 0', overflow: 'hidden', borderBottom: `2px solid ${T.border}` }}>
            {/* Target Object */}
            <div style={{ 
              position: 'absolute', 
              bottom: targetDistance, 
              left: 50 + Math.cos((targetAngle) * Math.PI / 180) * targetDistance, 
              width: 8, height: 8, background: '#ef4444', borderRadius: '50%', transform: 'translate(-50%, 50%)'
            }} />
            
            {/* Sensor / Servo Arm */}
            <div style={{
              position: 'absolute', bottom: 0, left: 50, width: 4, height: 40, background: '#fbbf24',
              transformOrigin: 'bottom center', transform: `translate(-50%, 0) rotate(${angle - 90}deg)`,
              boxShadow: isHit ? '0 -20px 20px #ef4444' : 'none'
            }}>
              <div style={{ position: 'absolute', top: -10, left: -6, width: 16, height: 10, background: '#1e3a8a', borderRadius: 2 }} />
            </div>
            <div style={{ position: 'absolute', bottom: -5, left: 45, width: 10, height: 10, background: '#1e3a8a', borderRadius: '50%' }} />
          </div>

          {/* OLED Radar Screen */}
          <div style={{ width: 100, height: 100, background: '#000', borderRadius: 4, border: '2px solid #333', position: 'relative', overflow: 'hidden' }}>
            {/* Radar Arc */}
            <div style={{ position: 'absolute', bottom: -50, left: 0, width: 100, height: 100, borderTop: '1px solid #166534', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -25, left: 25, width: 50, height: 50, borderTop: '1px solid #166534', borderRadius: '50%' }} />
            
            {/* Sweep Line */}
            <div style={{
              position: 'absolute', bottom: 0, left: 49, width: 2, height: 50, background: '#22c55e',
              transformOrigin: 'bottom center', transform: `rotate(${angle - 90}deg)`
            }} />
            
            {/* Blip */}
            {isHit && (
              <div style={{ 
                position: 'absolute', 
                bottom: targetDistance / 2, 
                left: 50 + Math.cos((targetAngle) * Math.PI / 180) * (targetDistance / 2), 
                width: 4, height: 4, background: '#22c55e', borderRadius: '50%', transform: 'translate(-50%, 50%)',
                boxShadow: '0 0 5px #22c55e'
              }} />
            )}
            
            <div style={{ position: 'absolute', top: 2, left: 2, fontSize: 8, color: '#22c55e', fontFamily: 'monospace' }}>RADAR</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.textMuted, marginBottom: 4 }}>
              <span>Target Angle</span><span>{targetAngle}°</span>
            </div>
            <input type="range" min="0" max="180" value={targetAngle} onChange={(e) => setTargetAngle(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.textMuted, marginBottom: 4 }}>
              <span>Target Distance</span><span>{targetDistance} cm</span>
            </div>
            <input type="range" min="10" max="90" value={targetDistance} onChange={(e) => setTargetDistance(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
          </div>
        </div>

      </div>
    </div>
  );
}
