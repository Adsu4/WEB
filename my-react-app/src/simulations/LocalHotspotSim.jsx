import React from 'react';

export default function LocalHotspotSim({ T }) {
  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        By running a Web Server on the ESP32, you can open any browser on your network and access the board directly. Try interacting with the mock phone below.
      </p>

      <div style={{ background: T.surfaceAlt, padding: 32, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Mock Phone */}
        <div style={{ width: 220, height: 400, background: '#111', borderRadius: 24, border: '4px solid #333', padding: 12, position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          
          {/* Phone Notch */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 80, height: 16, background: '#333', borderRadius: '0 0 10px 10px' }} />
          
          {/* Browser UI */}
          <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            {/* Address Bar */}
            <div style={{ background: '#f1f5f9', padding: '24px 10px 10px 10px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 6 }}>
              <div style={{ background: '#e2e8f0', flex: 1, borderRadius: 12, padding: '4px 10px', fontSize: 10, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>🔒</span> 192.168.1.104
              </div>
            </div>

            {/* Web Page Served by ESP32 */}
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, background: '#f8fafc' }}>
              <h1 style={{ fontSize: 18, color: '#1e293b', marginBottom: 6 }}>ESP32 Server</h1>
              <p style={{ fontSize: 10, color: '#64748b', textAlign: 'center', marginBottom: 20 }}>This HTML is hosted directly on the microcontroller!</p>
              
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>Uptime</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0ea5e9' }}>00:14:23</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
