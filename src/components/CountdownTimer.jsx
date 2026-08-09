import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDateStr, dark }) {
  const targetDate = new Date(targetDateStr).getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft <= 0) {
    return (
      <div 
        style={{ 
          fontSize: '0.85rem', 
          color: '#ff3b30', 
          fontWeight: 'bold', 
          marginTop: '0.5rem',
          textAlign: 'center'
        }}
      >
        This memory box is no longer available.
      </div>
    );
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const containerBg = dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,0.03)';
  const borderColor = dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.12)';
  const textColor = dark ? '#ccc' : '#555';
  const labelColor = dark ? '#fff' : '#222';
  const numColor = dark ? '#ff453a' : '#ff3b30';

  return (
    <div 
      style={{ 
        fontSize: '0.8rem', 
        color: textColor, 
        background: containerBg, 
        border: `1px dashed ${borderColor}`,
        padding: '6px 12px',
        borderRadius: '10px',
        textAlign: 'center',
        marginTop: '0.5rem',
        maxWidth: '320px',
        display: 'inline-block',
        boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
      }}
    >
      <span style={{ fontWeight: 600, color: labelColor, fontSize: '0.78rem', display: 'block', marginBottom: '2px' }}>
        this will no longer be available after this timer; cherish.
      </span>
      <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 800, color: numColor }}>
        {days}d {hours}h {minutes}m {seconds}s
      </div>
    </div>
  );
}
