import React, { useState } from 'react';

export default function OledDisplaySim({ T }) {
  const [text, setText] = useState('Hello World!');

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        Type in the text box below. Notice how the OLED screen updates to display your custom payload.
      </p>

      <div style={{ background: T.surfaceAlt, padding: 32, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* OLED Mock */}
        <div style={{ width: 140, height: 100, background: '#111', borderRadius: 4, border: '2px solid #333', marginBottom: 30, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* Pins */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, position: 'absolute', top: -6, width: '100%' }}>
            <div style={{ width: 4, height: 6, background: '#fbbf24' }} />
            <div style={{ width: 4, height: 6, background: '#fbbf24' }} />
            <div style={{ width: 4, height: 6, background: '#fbbf24' }} />
            <div style={{ width: 4, height: 6, background: '#fbbf24' }} />
          </div>
          <div style={{ fontSize: 8, color: '#fff', display: 'flex', justifyContent: 'center', gap: 2, marginTop: 4 }}>
            <span>GND</span><span>VCC</span><span>SCL</span><span>SDA</span>
          </div>
          
          {/* Screen Area */}
          <div style={{ margin: 'auto', width: 110, height: 60, background: '#000', border: '1px solid #222', padding: 4, overflow: 'hidden' }}>
            <div style={{ 
              color: '#38bdf8', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.2, 
              textShadow: '0 0 2px #38bdf8', wordBreak: 'break-all'
            }}>
              {text}
            </div>
          </div>
        </div>

        <div style={{ width: '100%' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: 'block', marginBottom: 8 }}>
            display.print() payload:
          </label>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value.substring(0, 50))}
            style={{ 
              width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${T.border}`, 
              background: T.surface, color: T.text, fontFamily: 'monospace'
            }}
            placeholder="Enter text..."
          />
        </div>

      </div>
    </div>
  );
}
