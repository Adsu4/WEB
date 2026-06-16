import React, { useState, useEffect } from 'react';

export default function HighVoltageBridgeSim({ T }) {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [dots, setDots] = useState('');

  const handleConnect = () => {
    setConnecting(true);
    setConnected(false);
    setDots('');
    
    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount++;
      setDots('.'.repeat(dotCount));
      if (dotCount > 4) {
        clearInterval(interval);
        setConnecting(false);
        setConnected(true);
      }
    }, 500);
  };

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        Click 'Begin WiFi' to see the ESP32 connect to your router. In a real project, this gives the board a local IP address so you can access it via a web browser!
      </p>

      <div style={{ background: T.surfaceAlt, padding: 32, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ width: '100%', maxWidth: 300 }}>
          {/* Terminal Mock */}
          <div style={{ 
            background: '#0f172a', height: 120, borderRadius: 8, padding: 12, overflow: 'hidden',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#38bdf8', border: '1px solid #1e293b',
            marginBottom: 20
          }}>
            <div style={{ color: '#64748b', fontStyle: 'italic', marginBottom: 8 }}>ESP32 Boot Sequence Complete</div>
            {connecting && <div>Connecting to "Maker_Network"{dots}</div>}
            {connected && (
              <>
                <div style={{ color: T.green, marginTop: 4 }}>WiFi Connected!</div>
                <div style={{ marginTop: 4 }}>IP Address: 192.168.1.104</div>
                <div style={{ marginTop: 4 }}>Signal Strength: -55 dBm</div>
              </>
            )}
          </div>

          <button 
            onClick={handleConnect}
            disabled={connecting}
            style={{ 
              width: '100%', padding: '10px', background: connecting ? '#333' : T.primary, color: '#fff', 
              border: 'none', borderRadius: 8, fontWeight: 700, cursor: connecting ? 'not-allowed' : 'pointer'
            }}
          >
            {connecting ? 'WiFi.begin() ...' : 'Run WiFi.begin()'}
          </button>
        </div>

      </div>
    </div>
  );
}
