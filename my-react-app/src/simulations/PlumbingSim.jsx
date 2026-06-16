import React, { useState, useEffect } from 'react';

export default function PlumbingSim({ T }) {
  const [voltage, setVoltage] = useState(3);
  const [resistance, setResistance] = useState(220);
  const [popped, setPopped] = useState(false);

  // Ohm's law: I = V / R
  // Let's normalize it for visualization.
  // 3.3V and 220 Ohm = safe (let's say flow = 1)
  // 3.3V and 10 Ohm = danger (flow = 22)
  const current = (voltage / Math.max(resistance, 1)) * 100;
  
  useEffect(() => {
    if (current > 50 && !popped) {
      setPopped(true);
    } else if (current <= 50 && popped) {
      setPopped(false);
    }
  }, [current, popped]);

  return (
    <div style={{ padding: 20, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <h3 style={{ color: T.primary, margin: '0 0 8px 0' }}>The Plumbing Visualizer (Ohm's Law)</h3>
        <p style={{ color: T.textSub, fontSize: 13, margin: 0 }}>V = I × R. Adjust the pump pressure and the pipe squeeze to see the flow.</p>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Controls */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', color: T.text, fontSize: 13, marginBottom: 8, fontWeight: 600 }}>
              <span>Pump Pressure (Voltage)</span>
              <span>{voltage} V</span>
            </label>
            <input 
              type="range" 
              min="1" max="12" step="0.5" 
              value={voltage} 
              onChange={(e) => setVoltage(Number(e.target.value))}
              style={{ width: '100%', accentColor: T.primary }}
            />
          </div>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', color: T.text, fontSize: 13, marginBottom: 8, fontWeight: 600 }}>
              <span>Pipe Squeeze (Resistance)</span>
              <span>{resistance} Ω</span>
            </label>
            <input 
              type="range" 
              min="0" max="1000" step="10" 
              value={resistance} 
              onChange={(e) => setResistance(Number(e.target.value))}
              style={{ width: '100%', accentColor: T.amber }}
            />
            {resistance < 50 && <div style={{ color: T.red, fontSize: 11, marginTop: 4, fontWeight: 700 }}>⚠️ DANGEROUSLY LOW RESISTANCE!</div>}
          </div>
        </div>

        {/* Visualizer */}
        <div style={{ flex: 1.5, position: 'relative', height: 160, background: T.surfaceAlt, borderRadius: 12, border: `1px solid ${T.border}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Water Pipe */}
          <div style={{ 
            position: 'relative', 
            width: '80%', 
            height: Math.max(10, (resistance / 1000) * 40 + 10), // Pipe thickness depends inversely on resistance? No, resistance IS the squeeze. High resistance = thin pipe.
            // Wait, let's make the pipe thickness fixed, but show a "squeeze" visually.
          }}>
             {/* Squeeze overlay */}
             <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: '#3b82f6', opacity: 0.2, borderRadius: 20 }} />
             
             {/* Particles */}
             <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', overflow: 'hidden', clipPath: 'inset(0)' }}>
                <div style={{ 
                  width: '100%', height: '100%', 
                  background: 'linear-gradient(90deg, transparent 50%, rgba(59, 130, 246, 0.8) 50%)',
                  backgroundSize: '20px 100%',
                  animation: popped ? 'none' : `flow ${Math.max(0.1, 5 / current)}s linear infinite`
                }} />
             </div>
          </div>

          {/* Squeeze Indication */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', gap: Math.max(20, 80 - (resistance / 1000) * 60) }}>
             <div style={{ width: 40, height: 20, background: T.amber, borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>R</div>
             <div style={{ width: 40, height: 20, background: T.amber, borderRadius: '0 0 4px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>R</div>
          </div>

          {/* LED at the end */}
          <div style={{ position: 'absolute', right: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <div style={{ 
               width: 30, height: 40, borderRadius: '15px 15px 4px 4px', 
               background: popped ? '#333' : (current > 5 ? T.red : '#552222'),
               boxShadow: popped ? 'none' : (current > 5 ? `0 0 ${Math.min(20, current)}px ${T.red}` : 'none'),
               transition: 'all 0.2s',
               position: 'relative'
             }}>
                {popped && <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 24 }}>💥</div>}
             </div>
             <div style={{ height: 10, width: 2, background: '#888' }} />
             <div style={{ height: 10, width: 2, background: '#888' }} />
          </div>

        </div>
      </div>
      <style>{`
        @keyframes flow {
          from { background-position: 0 0; }
          to { background-position: 20px 0; }
        }
      `}</style>
    </div>
  );
}
