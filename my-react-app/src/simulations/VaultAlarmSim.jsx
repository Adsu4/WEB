import React, { useState } from 'react';

export default function VaultAlarmSim({ T }) {
  const [beamBroken, setBeamBroken] = useState(false);
  const [latched, setLatched] = useState(false);

  const breakBeam = () => {
    setBeamBroken(true);
    setLatched(true);
    setTimeout(() => {
      setBeamBroken(false);
    }, 1000);
  };

  const resetAlarm = () => {
    setLatched(false);
    setBeamBroken(false);
  };

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        In a real circuit, an SCR or Transistor latching circuit keeps the alarm ringing even after the intruder has passed the laser beam.
      </p>

      <div style={{ background: T.surfaceAlt, padding: 24, borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        
        {/* Laser Emitter & Receiver */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, marginTop: 20 }}>
          <div style={{ width: 40, height: 20, background: '#333', borderRadius: 4, position: 'relative' }}>
            <div style={{ position: 'absolute', right: -5, top: 5, width: 10, height: 10, background: '#ef4444', borderRadius: '50%' }} />
          </div>
          
          {/* Laser Beam */}
          <div style={{ flex: 1, height: 2, background: beamBroken ? 'transparent' : '#ef4444', boxShadow: beamBroken ? 'none' : '0 0 10px #ef4444', transition: 'all 0.1s' }} />
          
          <div style={{ width: 40, height: 20, background: '#333', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 12, height: 12, background: '#000', borderRadius: '50%', border: '2px solid #666' }} /> {/* LDR */}
          </div>
        </div>

        {/* Hand interrupting */}
        <div style={{ 
          position: 'absolute', top: beamBroken ? 40 : -100, left: '45%', 
          width: 30, height: 60, background: '#fca5a5', borderRadius: 15, transition: 'top 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />

        {/* Alarm Buzzer */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 60, height: 60, borderRadius: '50%', background: '#222', border: `4px solid ${latched ? '#ef4444' : '#444'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            animation: latched ? 'shake 0.1s infinite' : 'none'
          }}>
            🔔
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: latched ? T.red : T.textSub, letterSpacing: 1 }}>
            {latched ? 'ALARM TRIGGERED' : 'SYSTEM ARMED'}
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button 
          onClick={breakBeam} 
          disabled={beamBroken}
          style={{ flex: 1, padding: '10px 0', background: T.primary, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: beamBroken ? 'not-allowed' : 'pointer' }}
        >
          Break Laser Beam
        </button>
        <button 
          onClick={resetAlarm}
          style={{ flex: 1, padding: '10px 0', background: 'transparent', color: T.text, border: `1px solid ${T.border}`, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
        >
          Reset System
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}
