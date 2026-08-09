import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function LoginView({ users, onSelectUser }) {
  const [verifyingUser, setVerifyingUser] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === '0') {
      onSelectUser(verifyingUser);
      setVerifyingUser(null);
      setPasswordInput('');
      setError(false);
    } else {
      setError(true);
      setPasswordInput('');
    }
  };

  return (
    <motion.div
      className="login-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fce4ec 0%, #fffde7 50%, #e0f2f1 100%)',
        padding: '2rem',
        position: 'relative'
      }}
    >
      {/* Juainny Approved Stamp */}
      <div 
        style={{ 
          position: 'fixed', 
          top: '1.5rem', 
          right: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          background: '#1a1a1a', 
          color: '#fff',
          padding: '6px 14px', 
          borderRadius: '100px', 
          border: '1px solid rgba(255,255,255,0.1)', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)', 
          transform: 'rotate(2deg)', 
          zIndex: 10 
        }}
      >
        <img src="/assets/juainny-stamp.png" alt="Juainny" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>JUAINNY APPROVED</span>
      </div>

      <motion.h1
        style={{
          fontSize: '3rem',
          marginBottom: '4rem',
          textAlign: 'center',
          color: '#1a1a1a',
          fontWeight: 800
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Who's entering the memories?
      </motion.h1>

      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {users.map((user, index) => {
          const rotation = (index % 2 === 0 ? -3 : 3) + (index % 3 === 0 ? 1 : -1);

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <motion.div
                whileHover={{ scale: 1.06, rotate: 0 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setVerifyingUser(user);
                  setError(false);
                  setPasswordInput('');
                }}
                className="indie-card"
                style={{
                  width: '140px',
                  height: '140px',
                  transform: `rotate(${rotation}deg)`,
                  cursor: 'pointer'
                }}
              >
                <div
                  className="indie-img"
                  style={{
                    backgroundImage: `url(${user.profileIcon})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%'
                  }}
                />
              </motion.div>
              <div 
                style={{ 
                  marginTop: '1rem', 
                  fontSize: '1.2rem', 
                  fontWeight: 700, 
                  color: '#1a1a1a',
                  fontFamily: 'var(--font-title)'
                }}
              >
                {user.name}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Password Overlay Modal */}
      <AnimatePresence>
        {verifyingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '1rem'
            }}
            onClick={() => setVerifyingUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="indie-card"
              style={{
                width: '100%',
                maxWidth: '340px',
                background: '#fff',
                padding: '2rem',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setVerifyingUser(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>

              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
                Enter Passcode
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#666', textAlign: 'center', marginBottom: '1.5rem' }}>
                Verify to view {verifyingUser.name}'s memories
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <motion.input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setError(false);
                  }}
                  animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                  placeholder="Passcode"
                  autoFocus
                  style={{
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    border: error ? '2px solid #ff3b30' : '1px solid rgba(0,0,0,0.15)',
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    letterSpacing: '0.2em'
                  }}
                />
                
                {error && (
                  <p style={{ color: '#ff3b30', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', marginTop: '-0.3rem' }}>
                    Incorrect Passcode! Hint: 0
                  </p>
                )}

                <button type="submit" className="btn-indie" style={{ justifyContent: 'center', width: '100%', marginTop: '0.5rem' }}>
                  Unlock
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
