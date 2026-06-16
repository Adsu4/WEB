import React, { useState } from 'react';

export default function ThermometerSim({ T }) {
  const [temp, setTemp] = useState(25);

  let r = 0, g = 0, b = 0;
  if (temp < 20) {
    b = 255;
    g = Math.max(0, 255 - (20 - temp) * 20);
  } else if (temp < 30) {
    g = 255;
    b = Math.max(0, 255 - (temp - 20) * 25);
    r = Math.max(0, (temp - 20) * 25);
  } else {
    r = 255;
    g = Math.max(0, 255 - (temp - 30) * 20);
  }

  const rgbColor = `rgb(${r}, ${g}, ${b})`;

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        Drag the temperature slider. Notice how the RGB LED visually represents the room temperature reading from the DHT11 sensor.
      </p>

      <div style={{ background: T.surfaceAlt, padding: 24, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20 }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 30 }}>
          {/* DHT11 Mock */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 40, height: 50, background: '#1e3a8a', borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', border: '1px solid #1e40af' }}>
              <div style={{ width: '80%', height: 2, background: '#3b82f6' }} />
              <div style={{ width: '80%', height: 2, background: '#3b82f6' }} />
              <div style={{ width: '80%', height: 2, background: '#3b82f6' }} />
              <div style={{ width: '80%', height: 2, background: '#3b82f6' }} />
            </div>
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4, fontWeight: 700 }}>DHT11</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.text, marginTop: 4 }}>{temp}°C</div>
          </div>

          {/* RGB LED Mock */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 40, height: 40, marginTop: 10 }}>
              <div style={{
                position: 'absolute', top: -10, left: -10, right: -10, bottom: -10,
                background: rgbColor, borderRadius: '50%', filter: 'blur(15px)', opacity: 0.8
              }} />
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: rgbColor, borderRadius: '50% 50% 10% 10%',
                boxShadow: 'inset -3px -3px 10px rgba(0,0,0,0.5), inset 3px 3px 10px rgba(255,255,255,0.6)'
              }} />
            </div>
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 14, fontWeight: 700 }}>RGB LED</div>
            <div style={{ fontSize: 10, color: rgbColor, marginTop: 4, fontFamily: 'monospace' }}>RGB({Math.round(r)},{Math.round(g)},{Math.round(b)})</div>
          </div>
        </div>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, fontWeight: 700, color: T.text }}>
            <span>0°C (Cold)</span>
            <span>50°C (Hot)</span>
          </div>
          <input 
            type="range" min="0" max="50" value={temp} 
            onChange={(e) => setTemp(Number(e.target.value))}
            style={{ width: '100%', accentColor: T.primary }}
          />
        </div>

      </div>
    </div>
  );
}
