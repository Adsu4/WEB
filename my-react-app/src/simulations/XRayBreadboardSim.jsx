import React, { useState } from 'react';

export default function XRayBreadboardSim({ T }) {
  const [xrayActive, setXrayActive] = useState(false);
  const [hoveredHole, setHoveredHole] = useState(null); // { type: 'power', col: 'left-red' } or { type: 'terminal', row: 1, side: 'left' }

  // We'll generate a small 10-row breadboard for visualization
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);
  const leftCols = ['A', 'B', 'C', 'D', 'E'];
  const rightCols = ['F', 'G', 'H', 'I', 'J'];

  const getHoleBackground = (type, id) => {
    if (!xrayActive && !hoveredHole) return '#1a1a1a';
    
    const isHoveredGroup = hoveredHole && hoveredHole.type === type && hoveredHole.id === id;
    
    if (isHoveredGroup) {
      if (type === 'power-red') return '#ef4444';
      if (type === 'power-blue') return '#3b82f6';
      return '#22c55e'; // terminal
    }
    
    if (xrayActive) {
      if (type === 'power-red') return 'rgba(239, 68, 68, 0.2)';
      if (type === 'power-blue') return 'rgba(59, 130, 246, 0.2)';
      return 'rgba(34, 197, 94, 0.2)';
    }

    return '#1a1a1a';
  };

  const getRailStyle = (type, id) => {
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: 4,
      background: xrayActive ? getHoleBackground(type, id).replace('0.2', '0.1') : 'transparent',
      borderRadius: 4,
      transition: 'all 0.2s',
      cursor: 'crosshair'
    };
  };

  const getTerminalRowStyle = (side, row) => {
    return {
      display: 'flex',
      gap: 4,
      padding: 4,
        background: xrayActive ? getHoleBackground('terminal', `${side}-${row}`).replace('0.2', '0.1') : 'transparent',
      borderRadius: 4,
      transition: 'all 0.2s',
      cursor: 'crosshair'
    };
  };

  return (
    <div style={{ padding: 20, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
      <div style={{ marginBottom: 20, textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ color: T.primary, margin: '0 0 8px 0', textAlign: 'left' }}>X-Ray Breadboard</h3>
          <p style={{ color: T.textSub, fontSize: 13, margin: 0, textAlign: 'left' }}>Hover over the holes to see what they are connected to.</p>
        </div>
        <button 
          onClick={() => setXrayActive(!xrayActive)}
          style={{
            padding: '8px 16px',
            background: xrayActive ? T.primary : 'transparent',
            color: xrayActive ? '#fff' : T.primary,
            border: `1px solid ${T.primary}`,
            borderRadius: 8,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {xrayActive ? 'Disable X-Ray' : 'Enable X-Ray'}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#e5e7eb', padding: '20px 30px', borderRadius: 8, display: 'flex', gap: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          
          {/* Left Power Rails */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div 
              style={getRailStyle('power-red', 'left')}
              onMouseEnter={() => setHoveredHole({ type: 'power-red', id: 'left' })}
              onMouseLeave={() => setHoveredHole(null)}
            >
              <div style={{ color: '#ef4444', fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}>+</div>
              {rows.map(r => <div key={r} style={{ width: 12, height: 12, background: getHoleBackground('power-red', 'left'), borderRadius: 2 }} />)}
            </div>
            <div 
              style={getRailStyle('power-blue', 'left')}
              onMouseEnter={() => setHoveredHole({ type: 'power-blue', id: 'left' })}
              onMouseLeave={() => setHoveredHole(null)}
            >
              <div style={{ color: '#3b82f6', fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}>-</div>
              {rows.map(r => <div key={r} style={{ width: 12, height: 12, background: getHoleBackground('power-blue', 'left'), borderRadius: 2 }} />)}
            </div>
          </div>

          {/* Left Terminal Strips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 18 }}>
            {rows.map(row => (
              <div 
                key={row} 
                style={getTerminalRowStyle('left', row)}
                onMouseEnter={() => setHoveredHole({ type: 'terminal', id: `left-${row}` })}
                onMouseLeave={() => setHoveredHole(null)}
              >
                <div style={{ fontSize: 10, width: 14, color: '#666', textAlign: 'right', paddingRight: 4, lineHeight: '12px' }}>{row}</div>
                {leftCols.map(c => <div key={c} style={{ width: 12, height: 12, background: getHoleBackground('terminal', `left-${row}`), borderRadius: 2 }} />)}
              </div>
            ))}
          </div>

          {/* Middle Ravine */}
          <div style={{ width: 12, background: '#d1d5db', borderRadius: 4, marginTop: 18, marginBottom: 4, boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }} />

          {/* Right Terminal Strips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 18 }}>
            {rows.map(row => (
              <div 
                key={row} 
                style={getTerminalRowStyle('right', row)}
                onMouseEnter={() => setHoveredHole({ type: 'terminal', id: `right-${row}` })}
                onMouseLeave={() => setHoveredHole(null)}
              >
                {rightCols.map(c => <div key={c} style={{ width: 12, height: 12, background: getHoleBackground('terminal', `right-${row}`), borderRadius: 2 }} />)}
                <div style={{ fontSize: 10, width: 14, color: '#666', paddingLeft: 4, lineHeight: '12px' }}>{row}</div>
              </div>
            ))}
          </div>

          {/* Right Power Rails */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div 
              style={getRailStyle('power-red', 'right')}
              onMouseEnter={() => setHoveredHole({ type: 'power-red', id: 'right' })}
              onMouseLeave={() => setHoveredHole(null)}
            >
              <div style={{ color: '#ef4444', fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}>+</div>
              {rows.map(r => <div key={r} style={{ width: 12, height: 12, background: getHoleBackground('power-red', 'right'), borderRadius: 2 }} />)}
            </div>
            <div 
              style={getRailStyle('power-blue', 'right')}
              onMouseEnter={() => setHoveredHole({ type: 'power-blue', id: 'right' })}
              onMouseLeave={() => setHoveredHole(null)}
            >
              <div style={{ color: '#3b82f6', fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}>-</div>
              {rows.map(r => <div key={r} style={{ width: 12, height: 12, background: getHoleBackground('power-blue', 'right'), borderRadius: 2 }} />)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
