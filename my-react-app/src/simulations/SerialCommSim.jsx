import React, { useState, useEffect, useRef } from 'react';

export default function SerialCommSim({ T }) {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setLogs(prev => {
          const newLogs = [...prev, `Sensor Value: ${Math.floor(Math.random() * 1024)}`];
          if (newLogs.length > 50) newLogs.shift();
          return newLogs;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (containerRef.current && logs.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLog = () => setLogs([]);

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: T.textSub, marginBottom: 16 }}>
        The Serial Monitor is your window into the ESP32's brain. Click Run to simulate sensor data streaming to your PC via the USB cable.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button 
          onClick={() => setIsRunning(!isRunning)}
          style={{ flex: 1, padding: '8px 0', background: isRunning ? T.red : T.green, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
        >
          {isRunning ? '⏹ STOP SERIAL' : '▶ START SERIAL'}
        </button>
        <button 
          onClick={clearLog}
          style={{ padding: '8px 16px', background: 'transparent', color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
        >
          CLEAR
        </button>
      </div>

      <div ref={containerRef} style={{ 
        background: '#0f172a', height: 200, borderRadius: 8, padding: 12, overflowY: 'auto',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#38bdf8', border: '1px solid #1e293b'
      }}>
        {logs.length === 0 && <div style={{ color: '#64748b', fontStyle: 'italic' }}>Waiting for data on COM3 at 115200 baud...</div>}
        {logs.map((l, i) => (
          <div key={i} style={{ marginBottom: 4 }}>
            <span style={{ color: '#64748b' }}>{new Date().toISOString().split('T')[1].slice(0, -1)} -{'>'} </span>
            {l}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: T.textMuted, fontFamily: 'monospace' }}>
        <span>COM3</span>
        <span>115200 baud</span>
      </div>
    </div>
  );
}
