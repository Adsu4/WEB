import React, { useState } from 'react';

export default function ResistorDecoderSim({ T }) {
  const [band1, setBand1] = useState(2); // Red
  const [band2, setBand2] = useState(2); // Red
  const [multiplier, setMultiplier] = useState(1); // Brown
  const [tolerance, setTolerance] = useState('gold');

  const colorCodes = [
    { name: 'Black', val: 0, color: '#000000', label: '#fff' },
    { name: 'Brown', val: 1, color: '#8B4513', label: '#fff' },
    { name: 'Red', val: 2, color: '#FF0000', label: '#fff' },
    { name: 'Orange', val: 3, color: '#FFA500', label: '#000' },
    { name: 'Yellow', val: 4, color: '#FFFF00', label: '#000' },
    { name: 'Green', val: 5, color: '#008000', label: '#fff' },
    { name: 'Blue', val: 6, color: '#0000FF', label: '#fff' },
    { name: 'Violet', val: 7, color: '#EE82EE', label: '#000' },
    { name: 'Gray', val: 8, color: '#808080', label: '#fff' },
    { name: 'White', val: 9, color: '#FFFFFF', label: '#000' }
  ];

  const tolCodes = [
    { name: 'Gold (±5%)', val: 'gold', color: '#FFD700' },
    { name: 'Silver (±10%)', val: 'silver', color: '#C0C0C0' }
  ];

  const calculateResistance = () => {
    const base = (band1 * 10) + band2;
    const mult = Math.pow(10, multiplier);
    const total = base * mult;
    
    if (total >= 1000000) return `${total / 1000000} MΩ`;
    if (total >= 1000) return `${total / 1000} kΩ`;
    return `${total} Ω`;
  };

  const getBandColor = (val) => colorCodes.find(c => c.val === val).color;
  const getTolColor = (val) => tolCodes.find(c => c.val === val).color;

  return (
    <div style={{ padding: 20, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
      <div style={{ marginBottom: 30, textAlign: 'center' }}>
        <h3 style={{ color: T.primary, margin: '0 0 8px 0' }}>4-Band Resistor Decoder</h3>
        <p style={{ color: T.textSub, fontSize: 13, margin: 0 }}>Select the colors on your resistor to calculate its value.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        
        {/* The Physical Resistor Graphic */}
        <div style={{ position: 'relative', width: 300, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Wire left */}
          <div style={{ width: 60, height: 4, background: '#9ca3af' }} />
          
          {/* Resistor Body */}
          <div style={{ 
            width: 180, height: 60, background: '#eab308', borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
            boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.2), 0 10px 15px rgba(0,0,0,0.1)'
          }}>
             <div style={{ width: 12, height: '100%', background: getBandColor(band1) }} />
             <div style={{ width: 12, height: '100%', background: getBandColor(band2) }} />
             <div style={{ width: 12, height: '100%', background: getBandColor(multiplier) }} />
             <div style={{ width: 20 }} /> {/* Gap */}
             <div style={{ width: 12, height: '100%', background: getTolColor(tolerance) }} />
          </div>

          {/* Wire right */}
          <div style={{ width: 60, height: 4, background: '#9ca3af' }} />
        </div>

        {/* The Result */}
        <div style={{ fontSize: 32, fontWeight: 800, color: T.text, fontFamily: "'JetBrains Mono',monospace", background: T.surfaceAlt, padding: '10px 30px', borderRadius: 12, border: `1px solid ${T.border}` }}>
          {calculateResistance()} <span style={{ fontSize: 16, color: T.textSub }}>±{tolerance === 'gold' ? '5%' : '10%'}</span>
        </div>

        {/* Selectors */}
        <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center' }}>
          {[
            { label: 'Digit 1', val: band1, set: setBand1, options: colorCodes },
            { label: 'Digit 2', val: band2, set: setBand2, options: colorCodes },
            { label: 'Multiplier', val: multiplier, set: setMultiplier, options: colorCodes },
            { label: 'Tolerance', val: tolerance, set: setTolerance, options: tolCodes, isTol: true }
          ].map((col, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 100 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.textSub, textAlign: 'center', textTransform: 'uppercase' }}>{col.label}</label>
              <select 
                value={col.val} 
                onChange={e => col.set(col.isTol ? e.target.value : Number(e.target.value))}
                style={{
                  padding: 8, borderRadius: 6, border: `1px solid ${T.border}`, background: T.surfaceAlt, color: T.text, fontSize: 13, outline: 'none', cursor: 'pointer'
                }}
              >
                {col.options.map(opt => (
                  <option key={opt.val} value={opt.val}>{opt.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
