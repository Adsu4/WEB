import React, { useState } from 'react';

export default function EnvSensingSim({ T }) {
  const [temp, setTemp] = useState(25);
  const [humidity, setHumidity] = useState(50);

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        Adjust the environmental conditions. Notice how the ESP32 reads the DHT11 sensor and dynamically updates the OLED display over I2C.
      </p>

      <div style={{ background: T.surfaceAlt, padding: 32, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginBottom: 40, width: '100%', maxWidth: 400 }}>
          {/* DHT11 Mock */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 40, height: 50, background: '#1e3a8a', borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', border: '1px solid #1e40af' }}>
              <div style={{ width: '80%', height: 2, background: '#3b82f6' }} />
              <div style={{ width: '80%', height: 2, background: '#3b82f6' }} />
              <div style={{ width: '80%', height: 2, background: '#3b82f6' }} />
              <div style={{ width: '80%', height: 2, background: '#3b82f6' }} />
            </div>
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4, fontWeight: 700 }}>DHT11</div>
          </div>

          {/* I2C Arrows */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 10, color: '#38bdf8', fontFamily: 'monospace' }}>DATA --{'>'}</div>
            <div style={{ fontSize: 10, color: '#fbbf24', fontFamily: 'monospace' }}>{'<'}-- I2C --{'>'}</div>
          </div>

          {/* OLED Mock */}
          <div style={{ width: 100, height: 70, background: '#111', borderRadius: 4, border: '2px solid #333', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ margin: 'auto', width: 80, height: 40, background: '#000', border: '1px solid #222', padding: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ color: '#38bdf8', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, textShadow: '0 0 2px #38bdf8' }}>
                Temp: {temp}C
              </div>
              <div style={{ color: '#38bdf8', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, textShadow: '0 0 2px #38bdf8', marginTop: 4 }}>
                Hum : {humidity}%
              </div>
            </div>
            <div style={{ fontSize: 9, color: T.textMuted, textAlign: 'center', marginTop: 2, fontWeight: 800 }}>OLED 0.96"</div>
          </div>
        </div>

        <div style={{ width: '100%', marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: 'block', marginBottom: 8 }}>
            Temperature: {temp}°C
          </label>
          <input 
            type="range" min="-10" max="50" value={temp} 
            onChange={(e) => setTemp(Number(e.target.value))}
            style={{ width: '100%', accentColor: T.primary }}
          />
        </div>

        <div style={{ width: '100%' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: 'block', marginBottom: 8 }}>
            Humidity: {humidity}%
          </label>
          <input 
            type="range" min="0" max="100" value={humidity} 
            onChange={(e) => setHumidity(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#38bdf8' }}
          />
        </div>

      </div>
    </div>
  );
}
