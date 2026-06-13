import React, { useState } from 'react';

export default function Login({ onLogin, onCancel, T }) {
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let users = {};
    try {
      users = JSON.parse(import.meta.env.VITE_USERS || '{"admin":"maker123"}');
    } catch (e) {
      users = { "admin": import.meta.env.VITE_ACCESS_PASSCODE || "maker123" };
    }
    
    if (users[username] && users[username] === passcode) {
      setError(false);
      onLogin();
    } else {
      setError(true);
      setPasscode('');
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: T?.bg || '#04080f',
        color: T?.text || '#e8edf5',
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: T?.surface || '#080f1c',
          border: `1px solid ${T?.primaryBorder || 'rgba(79,77,200,0.2)'}`,
          borderRadius: 16,
          padding: 40,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Top Accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: T?.primary || '#4f4dc8' }} />

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 14,
              background: T?.primaryBg || 'rgba(79,77,200,0.08)',
              border: `1px solid ${T?.primaryBorder || 'rgba(79,77,200,0.2)'}`,
              marginBottom: 16,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T?.primary || '#4f4dc8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px 0', letterSpacing: -0.5 }}>Restricted Access</h1>
          <p style={{ fontSize: 14, color: T?.textSub || '#4a5a78', margin: 0 }}>Enter your student credentials to access the module.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label 
              style={{ 
                display: 'block', 
                fontSize: 12, 
                fontWeight: 600, 
                marginBottom: 8, 
                color: T?.textMuted || '#1e2d4a',
                fontFamily: "'JetBrains Mono',monospace",
                letterSpacing: 1
              }}
            >
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="student1"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: T?.bbBg || '#060c1a',
                border: `1px solid ${error ? (T?.red || '#ef4444') : (T?.border || '#111d33')}`,
                borderRadius: 8,
                color: T?.text || '#e8edf5',
                fontSize: 16,
                fontFamily: "'JetBrains Mono',monospace",
                outline: 'none',
                transition: 'all 0.2s'
              }}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label 
              style={{ 
                display: 'block', 
                fontSize: 12, 
                fontWeight: 600, 
                marginBottom: 8, 
                color: T?.textMuted || '#1e2d4a',
                fontFamily: "'JetBrains Mono',monospace",
                letterSpacing: 1
              }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: T?.bbBg || '#060c1a',
                border: `1px solid ${error ? (T?.red || '#ef4444') : (T?.border || '#111d33')}`,
                borderRadius: 8,
                color: T?.text || '#e8edf5',
                fontSize: 16,
                fontFamily: "'JetBrains Mono',monospace",
                outline: 'none',
                transition: 'all 0.2s'
              }}
              autoFocus
            />
            {error && (
              <div style={{ color: T?.red || '#ef4444', fontSize: 12, marginTop: 8, fontWeight: 500 }}>
                Access Denied. Incorrect username or password.
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: T?.primary || '#4f4dc8',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              marginBottom: onCancel ? 12 : 0
            }}
            onMouseOver={(e) => e.target.style.opacity = 0.9}
            onMouseOut={(e) => e.target.style.opacity = 1}
          >
            Authenticate
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                width: '100%',
                padding: '14px',
                background: 'transparent',
                color: T?.textSub || '#4a5a78',
                border: `1px solid ${T?.border || '#111d33'}`,
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: "'Plus Jakarta Sans',sans-serif"
              }}
              onMouseOver={(e) => { e.target.style.background = T?.surfaceAlt || '#0c1525'; e.target.style.color = T?.text || '#e8edf5'; }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = T?.textSub || '#4a5a78'; }}
            >
              Return to Home
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
