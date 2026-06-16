import React, { useState } from 'react';

export default function KitArsenalSim({ T }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const kit = [
    {
      id: 'brains',
      name: 'The Brains',
      color: T.primary,
      icon: '🧠',
      items: ['ESP32 Dev Board'],
      desc: 'The master controller. It runs your C++ code and connects to Wi-Fi.'
    },
    {
      id: 'senses',
      name: 'The Senses',
      color: T.amber,
      icon: '👀',
      items: ['Push Buttons', 'LDR (Light Sensor)', 'Ultrasonic Sensor', 'IR Sensor', 'DHT11 Temp Sensor'],
      desc: 'Input devices. They translate the physical world (light, distance, temp) into digital numbers.'
    },
    {
      id: 'muscles',
      name: 'The Muscles',
      color: T.red,
      icon: '💪',
      items: ['LEDs', 'RGB LED', 'Active Buzzer', 'SG90 Servo Motor', '0.96" OLED', 'Relay Module'],
      desc: 'Output devices. They translate digital numbers back into the physical world (light, sound, motion).'
    },
    {
      id: 'glue',
      name: 'The Glue',
      color: T.green,
      icon: '🔗',
      items: ['Breadboard', 'Jumper Wires', 'Resistors', 'Capacitors', 'BC547 Transistors', '555 Timer IC'],
      desc: 'The infrastructure. They connect the Brains to the Senses and Muscles.'
    }
  ];

  return (
    <div style={{ padding: 20, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <h3 style={{ color: T.primary, margin: '0 0 8px 0' }}>The Maker's Arsenal</h3>
        <p style={{ color: T.textSub, fontSize: 13, margin: 0 }}>Hover over the categories to understand how we classify components.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {kit.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <div 
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat.id)}
              onMouseLeave={() => setActiveCategory(null)}
              style={{
                padding: 20,
                borderRadius: 12,
                background: isActive ? cat.color + '1A' : T.surfaceAlt,
                border: `2px solid ${isActive ? cat.color : T.border}`,
                transition: 'all 0.2s',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 32 }}>{cat.icon}</div>
                <h4 style={{ margin: 0, color: isActive ? cat.color : T.text, fontSize: 16 }}>{cat.name}</h4>
              </div>
              
              <div style={{ fontSize: 13, color: T.textSub, lineHeight: 1.5, minHeight: 40 }}>
                {cat.desc}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
                {cat.items.map(item => (
                  <div key={item} style={{ 
                    padding: '4px 8px', 
                    background: isActive ? cat.color : T.border, 
                    color: isActive ? '#fff' : T.textSub, 
                    borderRadius: 20, 
                    fontSize: 11,
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
