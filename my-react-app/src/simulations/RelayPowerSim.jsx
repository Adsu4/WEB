import React, { useState } from 'react';

export default function RelayPowerSim({ T }) {
  const [relayOn, setRelayOn] = useState(false);

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        Click the button to send a digital HIGH signal to the relay. Notice how the low-voltage ESP32 can mechanically switch a high-voltage 120V AC lightbulb.
      </p>

      <div style={{ background: T.surfaceAlt, padding: 32, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 40, width: '100%' }}>
          
          {/* ESP32 Side */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 700 }}>3.3V Logic</div>
            <button 
              onClick={() => setRelayOn(!relayOn)}
              style={{ 
                padding: '8px 16px', background: relayOn ? T.green : '#333', color: '#fff', 
                border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer',
                boxShadow: relayOn ? `0 0 10px ${T.green}` : 'none', transition: 'all 0.2s'
              }}
            >
              {relayOn ? 'GPIO HIGH' : 'GPIO LOW'}
            </button>
          </div>

          {/* Relay Module */}
          <div style={{ width: 60, height: 50, background: '#1e3a8a', borderRadius: 4, position: 'relative', border: '2px solid #1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 10, color: '#93c5fd', fontWeight: 800 }}>RELAY</div>
            {/* Click animation */}
            <div style={{ 
              position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: '50%', 
              background: relayOn ? '#ef4444' : '#450a0a', boxShadow: relayOn ? '0 0 5px #ef4444' : 'none'
            }} />
            {/* Mechanical Switch Mock inside Relay */}
            <div style={{ position: 'absolute', bottom: 5, left: 10, right: 10, height: 10, borderBottom: '2px dashed #93c5fd' }} />
            <div style={{ 
              position: 'absolute', bottom: 5, left: 15, width: 20, height: 2, background: '#fff',
              transformOrigin: 'left center', transform: `rotate(${relayOn ? '0deg' : '-20deg'})`, transition: 'transform 0.1s'
            }} />
          </div>

          {/* High Voltage Side */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>120V AC</div>
            <div style={{ position: 'relative', width: 40, height: 40 }}>
              <div style={{
                position: 'absolute', top: -20, left: -20, right: -20, bottom: -20,
                background: '#fbbf24', borderRadius: '50%', filter: 'blur(20px)',
                opacity: relayOn ? 1 : 0, transition: 'opacity 0.1s'
              }} />
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: relayOn ? '#fef08a' : '#451a03', border: `2px solid ${relayOn ? '#eab308' : '#78350f'}`,
                borderRadius: '50%', boxShadow: relayOn ? 'inset -5px -5px 15px rgba(0,0,0,0.2)' : 'inset -5px -5px 15px rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, transition: 'all 0.1s'
              }}>
                💡
              </div>
            </div>
          </div>

        </div>

        <div style={{ fontSize: 11, color: T.textSub, textAlign: 'center', fontFamily: 'monospace' }}>
          {relayOn ? 'Circuit CLOSED. Current flows to lightbulb.' : 'Circuit OPEN. No current flows.'}
        </div>

      </div>
    </div>
  );
}
