import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowDown } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function TypeAView({ user, onBack }) {
  const containerRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isRevoked, setIsRevoked] = useState(false);

  const selectedPhoto = user.content.timeline.find(p => p.id === selectedId);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Keep the colors, user liked them
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    ['#ffdeeb', '#fff9db', '#e2faf3', '#ffe8cc']
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor, minHeight: '400vh', position: 'relative', paddingBottom: '20vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1 } }}
      exit={{ opacity: 0 }}
    >
      {/* Back button */}
      <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 50 }}>
        <button onClick={onBack} className="btn-indie">
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '12vh', paddingBottom: '3vh' }}>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem', letterSpacing: '-0.04em' }}>Dear,</h1>
        <div style={{ position: 'relative', width: '140px', height: '140px', marginBottom: '1.5rem', transform: 'rotate(-3deg)' }}>
          <img 
            src={user.profileIcon} 
            alt={user.name} 
            style={{ width: '100%', height: '100%', borderRadius: '24px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }} 
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%) rotate(4deg)',
              background: '#000',
              color: '#fff',
              padding: '6px 16px',
              borderRadius: '100px',
              fontSize: '1rem',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '2px solid #fff'
            }}
          >
            {user.name}
          </div>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#555', fontWeight: 500, marginTop: '0.5rem' }}>Scroll down our memory lane...</p>
        <CountdownTimer targetDateStr="2026-08-10T23:59:59" />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ marginTop: '1.5rem' }}
        >
          <ArrowDown size={28} />
        </motion.div>
      </div>

      {/* Timeline Layout */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Subtle, minimalist timeline line */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px',
          background: 'rgba(0, 0, 0, 0.1)', transform: 'translateX(-50%)', zIndex: 1
        }} />

        {user.content.timeline.map((photo, i) => {
          const isLeft = i % 2 === 0;
          const randomRotation = (i % 2 === 0 ? -4 : 4) + (i % 3 === 0 ? 1 : -1);

          return (
            <div
              key={photo.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isLeft ? 'flex-start' : 'flex-end',
                position: 'relative',
                zIndex: 2,
                margin: '18vh 0',
                width: '100%'
              }}
            >
              {/* Year Label */}
              <div className="sticker-label" style={{ position: 'absolute', left: '50%', top: '-25px', transform: 'translateX(-50%)' }}>
                {photo.year}
              </div>

              {/* Clean Image Card */}
              <motion.div
                layoutId={`card-${photo.id}`}
                onClick={() => setSelectedId(photo.id)}
                className="indie-card"
                style={{
                  width: '230px',
                  transform: `rotate(${randomRotation}deg)`,
                  marginTop: '15px'
                }}
                whileHover={{ rotate: 0, scale: 1.04 }}
              >
                <div className="indie-img" style={{ backgroundImage: `url(${photo.image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '230px' }} />
                <div className="indie-caption">{photo.period}</div>
              </motion.div>

              <div
                className="glass-panel"
                style={{
                  marginTop: '1.5rem',
                  maxWidth: '280px',
                  padding: '1.2rem',
                  alignSelf: isLeft ? 'flex-start' : 'flex-end',
                  transform: `rotate(${randomRotation * -0.4}deg)`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.03)'
                }}
              >
                <p style={{ fontSize: '1.1rem', lineHeight: 1.5, color: '#333', fontWeight: 500 }}>
                  {photo.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Thanks for the memories / Reactive Stamp */}
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10vh' }}>
        <motion.div
          className="indie-card"
          style={{
            maxWidth: '380px',
            textAlign: 'center',
            padding: '3rem 2rem',
            background: '#ffffff',
            cursor: 'pointer',
            transform: 'rotate(-2deg)',
            position: 'relative',
            overflow: 'visible'
          }}
          whileHover={{ scale: 1.03 }}
          onClick={() => setIsRevoked(!isRevoked)}
        >
          {/* Juainny Stamp overlay */}
          <motion.div 
            style={{ 
              position: 'absolute', top: '-35px', right: '-35px', transform: 'rotate(12deg)', zIndex: 5,
              background: '#1a1a1a', borderRadius: '50%', padding: '6px', border: '2px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}
            animate={isRevoked ? { scale: [1, 1.2, 1], rotate: [12, -10, 15] } : {}}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <img src="/assets/juainny-stamp.png" alt="Approved" style={{ width: '55px', height: '55px', objectFit: 'contain' }} />
            <div style={{ 
              background: isRevoked ? '#ff3b30' : '#4caf50', 
              color: 'white', 
              fontSize: '0.55rem', 
              fontWeight: 800, 
              padding: '2px 8px', 
              borderRadius: '100px', 
              marginTop: '-4px', 
              textTransform: 'uppercase', 
              textAlign: 'center', 
              border: '1px solid white' 
            }}>
              {isRevoked ? 'REVOKED ❌' : 'APPROVED' }
            </div>
          </motion.div>

          <h2 style={{ fontSize: '2.2rem', marginBottom: '1.2rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            Thanks for the memories...
          </h2>
          <p style={{ color: '#555', fontSize: '1.25rem', lineHeight: 1.5, fontWeight: 700, fontFamily: 'var(--font-title)' }}>
            {isRevoked ? "or don't" : "continue being Juainny Approved."}
          </p>

          <AnimatePresence>
            {isRevoked && (
              <motion.div
                initial={{ scale: 3, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: -15 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '5%',
                  right: '5%',
                  background: 'rgba(255, 59, 48, 0.95)',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '1.8rem',
                  border: '3px dashed white',
                  textTransform: 'uppercase',
                  pointerEvents: 'none',
                  zIndex: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}
              >
                STAMP REVOKED
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              layoutId={`card-${selectedId}`}
              className="indie-card"
              style={{
                width: '100%',
                maxWidth: '400px',
                background: '#fff',
                transform: 'none',
                padding: '1rem'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={22} />
                </button>
              </div>
              <div className="indie-img" style={{ backgroundImage: `url(${selectedPhoto.image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '300px', borderRadius: '16px' }} />
              <div className="indie-caption" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{selectedPhoto.period}</div>
              <p style={{ marginTop: '0.5rem', padding: '0 1rem 1rem 1rem', textAlign: 'center', fontSize: '1.1rem', color: '#444', lineHeight: 1.5 }}>
                {selectedPhoto.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </motion.div>
  );
}
