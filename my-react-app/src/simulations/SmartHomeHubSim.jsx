import React, { useState, useEffect } from 'react';

export default function SmartHomeHubSim({ T }) {
  const [temp, setTemp] = useState(24);
  const [relay1, setRelay1] = useState(false);
  const [relay2, setRelay2] = useState(true);
  const [radarPing, setRadarPing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRadarPing(prev => !prev);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        The grand finale! Your ESP32 serves a complete Smart Home Dashboard over your local network. It aggregates all the sensors (Temp, Radar) and actuators (Relays) into one interface.
      </p>

      <div style={{ background: T.surfaceAlt, padding: 24, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20 }}>
        
        {/* Tablet UI */}
        <div style={{ width: '100%', maxWidth: 500, margin: '0 auto', background: '#0f172a', borderRadius: 16, border: '8px solid #1e293b', padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, color: '#f8fafc', margin: 0 }}>Maker Hub</h2>
            <div style={{ fontSize: 12, color: '#38bdf8' }}>192.168.1.104</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            
            {/* Climate Widget */}
            <div style={{ background: '#1e293b', padding: 16, borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>CLIMATE</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc' }}>{temp}°C</div>
              <input type="range" min="10" max="40" value={temp} onChange={e => setTemp(e.target.value)} style={{ width: '100%', marginTop: 12 }} />
            </div>

            {/* Security Widget */}
            <div style={{ background: '#1e293b', padding: 16, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, alignSelf: 'flex-start' }}>SECURITY</div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: radarPing ? '#ef4444' : '#10b981', boxShadow: radarPing ? '0 0 15px #ef4444' : 'none', transition: 'all 0.3s' }} />
              <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 8 }}>{radarPing ? 'MOTION DETECTED' : 'CLEAR'}</div>
            </div>

            {/* Relays */}
            <div style={{ background: '#1e293b', padding: 16, borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>MAIN LIGHTS</div>
              <button 
                onClick={() => setRelay1(!relay1)}
                style={{ width: '100%', padding: 10, background: relay1 ? '#fbbf24' : '#334155', color: relay1 ? '#000' : '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                {relay1 ? 'ON' : 'OFF'}
              </button>
            </div>

            <div style={{ background: '#1e293b', padding: 16, borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>FAN / AC</div>
              <button 
                onClick={() => setRelay2(!relay2)}
                style={{ width: '100%', padding: 10, background: relay2 ? '#38bdf8' : '#334155', color: relay2 ? '#000' : '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                {relay2 ? 'ON' : 'OFF'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
