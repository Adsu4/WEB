import React, { useState } from 'react';

export default function BBViz({ T, activeWireState = true }) {
  const [hov, setHov] = useState(null);
  const R = 30,
    RH = 24,
    SY = 44; // Shifted CX coordinates outward to prevent rail overlaps
  const CX = {
    A: 60,
    B: 78,
    C: 96,
    D: 114,
    E: 132,
    F: 156,
    G: 174,
    H: 192,
    I: 210,
    J: 228,
  };
  const LC = ['A', 'B', 'C', 'D', 'E'],
    RC = ['F', 'G', 'H', 'I', 'J'];
  const ry = (r) => SY + (r - 1) * RH;
  const W = 288,
    H = SY + R * RH + 24;
  const dk = T.bg === '#04080f'; // Defined rail zones explicitly for easier hover grouping

  const RAILS = [
    { id: 'l_red', cx: 18, rx: 8, sign: '+', color: T.red },
    { id: 'l_blue', cx: 38, rx: 28, sign: 'ΓêÆ', color: T.blue },
    { id: 'r_red', cx: 250, rx: 240, sign: '+', color: T.red },
    { id: 'r_blue', cx: 270, rx: 260, sign: 'ΓêÆ', color: T.blue },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {' '}
      <svg
        width={W}
        height={H}
        style={{
          borderRadius: 12,
          display: 'block',
          background: T.bbBg,
          border: `1px solid ${T.border}`,
        }}
      >
        {/* Interactive Power Rails */}       {' '}
        {RAILS.map((rail) => {
          const isLit = hov?.id === rail.id;
          return (
            <g
              key={rail.id}
              style={{ cursor: 'crosshair', transition: 'all 0.1s' }}
              onMouseEnter={() =>
                setHov({
                  type: 'rail',
                  id: rail.id,
                  color: rail.color,
                  sign: rail.sign,
                })
              }
              onMouseLeave={() => setHov(null)}
            >
              {' '}
              <rect
                x={rail.rx}
                y={SY - 16}
                width={20}
                height={H - SY + 8}
                rx={4}
                fill={
                  isLit
                    ? dk
                      ? '#0f172a'
                      : '#dbeafe'
                    : dk
                      ? '#040810'
                      : '#e0e7ff'
                }
              />
              {' '}
              <line
                x1={rail.cx}
                y1={SY}
                x2={rail.cx}
                y2={H - 12}
                stroke={isLit ? rail.color : rail.color + '40'}
                strokeWidth={isLit ? 2 : 1.2}
              />
              {' '}
              <text
                x={rail.cx}
                y={SY - 6}
                textAnchor="middle"
                fill={rail.color + '80'}
                fontSize={10}
                fontWeight={700}
                fontFamily="monospace"
              >
                {rail.sign}
              </text>
              {' '}
              {Array.from({ length: R }, (_, i) => i + 1).map((row) => (
                <circle
                  key={row}
                  cx={rail.cx}
                  cy={ry(row)}
                  r={isLit ? 4.5 : 3.5}
                  fill={isLit ? rail.color : T.bbHole}
                  stroke={isLit ? rail.color : rail.color + '30'}
                  strokeWidth={1}
                />
              ))}
              {' '}
            </g>
          );
        })}
        {' '}
        {/* Render physical wire connections if activeWireState is on */}       {' '}
        {activeWireState && (
          <g style={{ pointerEvents: 'none' }}>
            {/* 3V3 Jumper (entering from top off-board) */}
            {' '}
            <path
              d={`M 18 0 L 18 ${ry(1)}`}
              fill="none"
              stroke={T.red}
              strokeWidth={2.5}
              opacity={0.85}
            />
            {/* GND Jumper (entering from top off-board) */}
            {' '}
            <path
              d={`M 38 0 L 38 ${ry(1)}`}
              fill="none"
              stroke={T.blue}
              strokeWidth={2.5}
              opacity={0.85}
            />
            {/* Resistor Jumper */}           {' '}
            <path
              d={`M 18 ${ry(10)} Q 35 ${ry(8)}, 60 ${ry(10)}`}
              fill="none"
              stroke={T.green}
              strokeWidth={2.5}
              opacity={0.85}
            />
            {/* LED Jumper spanning 10 & 11 */}           {' '}
            <path
              d={`M 78 ${ry(10)} Q 86 ${ry(8)}, 78 ${ry(11)}`}
              fill="none"
              stroke={T.amber}
              strokeWidth={2.5}
              opacity={0.85}
            />
            {/* Return loop jumper */}           {' '}
            <path
              d={`M 132 ${ry(11)} Q 90 ${ry(14)}, 38 ${ry(11)}`}
              fill="none"
              stroke="#2563eb"
              strokeWidth={2.5}
              opacity={0.85}
            />
            {' '}
          </g>
        )}
        {/* Center Grid Elements */}       {' '}
        {[...LC, ...RC].map((c) => (
          <text
            key={c}
            x={CX[c]}
            y={SY - 7}
            textAnchor="middle"
            fill={T.textMuted}
            fontSize={8}
            fontFamily="monospace"
          >
            {c}
          </text>
        ))}
        {' '}
        <rect
          x={142}
          y={SY - 8}
          width={4}
          height={H - SY + 4}
          fill={T.bg}
          opacity={0.9}
        />
        {' '}
        {Array.from({ length: R }, (_, i) => i + 1).map((row) => (
          <g key={row}>
            {' '}
            <text
              x={144}
              y={ry(row) + 3}
              textAnchor="middle"
              fill={T.textMuted}
              fontSize={7}
              fontFamily="monospace"
            >
              {row}
            </text>
            {' '}
            {LC.map((c) => {
              const isLit =
                hov?.type === 'row' && hov.r === row && hov.s === 'l';
              return (
                <circle
                  key={c}
                  cx={CX[c]}
                  cy={ry(row)}
                  r={isLit ? 5.5 : 4.5}
                  fill={isLit ? T.primary : T.bbHole}
                  stroke={isLit ? T.primaryLight : T.bbHoleBorder}
                  strokeWidth={isLit ? 1.5 : 1}
                  style={{ cursor: 'crosshair', transition: 'all 0.1s' }}
                  onMouseEnter={() => setHov({ type: 'row', r: row, s: 'l' })}
                  onMouseLeave={() => setHov(null)}
                />
              );
            })}
            {' '}
            {RC.map((c) => {
              const isLit =
                hov?.type === 'row' && hov.r === row && hov.s === 'r';
              return (
                <circle
                  key={c}
                  cx={CX[c]}
                  cy={ry(row)}
                  r={isLit ? 5.5 : 4.5}
                  fill={isLit ? T.primary : T.bbHole}
                  stroke={isLit ? T.primaryLight : T.bbHoleBorder}
                  strokeWidth={isLit ? 1.5 : 1}
                  style={{ cursor: 'crosshair', transition: 'all 0.1s' }}
                  onMouseEnter={() => setHov({ type: 'row', r: row, s: 'r' })}
                  onMouseLeave={() => setHov(null)}
                />
              );
            })}
            {' '}
          </g>
        ))}
        {' '}
      </svg>
      {' '}
      <div
        style={{
          height: 30,
          display: 'flex',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        {' '}
        {hov?.type === 'rail' ? (
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11.5,
              color: hov.color,
              fontWeight: 600,
            }}
          >
            ΓùÅ Vertical {hov.sign === '+' ? 'Power' : 'Ground'} Rail ΓÇö continuous
            copper strip
          </span>
        ) : hov?.type === 'row' ? (
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11.5,
              color: T.primary,
              fontWeight: 600,
            }}
          >
            ΓùÅ Row {hov.r} ΓÇö {hov.s === 'l' ? 'columns AΓÇôE' : 'columns FΓÇôJ'} ΓÇö
            shared copper strip
          </span>
        ) : (
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11,
              color: T.textMuted,
            }}
          >
            Γåæ Hover any hole to see the copper strip underneath it
          </span>
        )}
        {' '}
      </div>
      {/* Physics Tooltip Overlay for Module 1 */}     {' '}
      {activeWireState && (
        <div
          style={{
            position: 'absolute',
            top: 120,
            right: -20,
            background: T.surface,
            border: `1px solid ${T.border}`,
            padding: '8px 12px',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
        >
          {' '}
          <div
            style={{ color: T.primary, fontWeight: 'bold', marginBottom: 4 }}
          >
            Ohm's Law: LED Circuit
          </div>
          <div style={{ color: T.textSub }}>V_source: 3.3V</div>
          <div style={{ color: T.textSub }}>V_led: ~2.0V</div>         {' '}
          <div
            style={{
              color: T.textSub,
              borderTop: `1px solid ${T.border}`,
              marginTop: 4,
              paddingTop: 4,
            }}
          >
            V_drop (R): 1.3V
          </div>
          {' '}
          <div style={{ color: T.green, fontWeight: 'bold' }}>
            I = 1.3V / 220╬⌐ Γëê 6mA
          </div>
          {' '}
        </div>
      )}
      {' '}
    </div>
  );
}
