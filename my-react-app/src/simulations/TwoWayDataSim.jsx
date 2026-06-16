import React, { useState } from 'react';

export default function TwoWayDataSim({ T }) {
  const [ledOn, setLedOn] = useState(false);

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        Click the button on the mock web interface. Notice how the request is sent over WiFi, processed by the ESP32, and toggles the physical hardware.
      </p>

      <div style={{ background: T.surfaceAlt, padding: 16, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'nowrap', gap: 10, width: '100%' }}>
          
          {/* Mock Phone (Client) */}
          <div style={{ width: 140, height: 260, background: '#111', borderRadius: 16, border: '3px solid #333', padding: 8, position: 'relative' }}>
            <div style={{ width: '100%', height: '100%', background: '#f8fafc', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 10 }}>
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 20 }}>192.168.1.104</div>
              
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>Control Panel</div>
              
              <button 
                onClick={() => setLedOn(!ledOn)}
                style={{ 
                  width: '100%', padding: '12px 0', background: ledOn ? '#ef4444' : '#10b981', color: '#fff', 
                  border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                {ledOn ? 'TURN OFF' : 'TURN ON'}
              </button>
            </div>
          </div>

          {/* WiFi waves */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 24, color: '#38bdf8', animation: ledOn ? 'pulse 1s infinite' : 'none' }}>📶</div>
            <div style={{ fontSize: 9, color: T.textMuted }}>HTTP GET /led?state={ledOn ? 'off' : 'on'}</div>
          </div>

          {/* ESP32 Mock (Server/Hardware) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 50, height: 80, background: '#1e293b', borderRadius: 4, border: '1px solid #334155', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800 }}>ESP32</div>
            </div>
            
            {/* LED */}
            <div style={{ position: 'relative', width: 30, height: 30 }}>
              <div style={{
                position: 'absolute', top: -10, left: -10, right: -10, bottom: -10,
                background: '#ef4444', borderRadius: '50%', filter: 'blur(10px)',
                opacity: ledOn ? 0.8 : 0, transition: 'opacity 0.2s'
              }} />
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: ledOn ? '#f87171' : '#450a0a', border: `2px solid ${ledOn ? '#ef4444' : '#7f1d1d'}`,
                borderRadius: '50% 50% 10% 10%', transition: 'all 0.2s'
              }} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
