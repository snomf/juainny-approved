import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

function ReelVideo({ src, isActive, isMuted, onToggleMute }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().catch(err => console.log("Autoplay blocked or video loading:", err));
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
      onClick={onToggleMute}
    >
      <video
        ref={videoRef}
        src={src}
        loop
        muted={isMuted}
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {/* Tap to Unmute Overlay Label (visible only when muted) */}
      {isMuted && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.6)', borderRadius: '100px', padding: '8px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          opacity: 0.8, zIndex: 10
        }}>
          <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>
            🔇 Tap to Unmute
          </span>
        </div>
      )}
    </div>
  );
}

function FinalAudioPlayer({ src, isActive }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.loop = true;
      }
      audioRef.current.play().catch(err => console.log("Final slide audio play error:", err));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isActive, src]);

  return null;
}

export default function TypeBView({ user, onBack }) {
  const [activeCarouselIndexes, setActiveCarouselIndexes] = useState({});
  const [isMuted, setIsMuted] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  const nextImage = (reelId, imagesLength) => {
    setActiveCarouselIndexes(prev => ({
      ...prev,
      [reelId]: ((prev[reelId] || 0) + 1) % imagesLength
    }));
  };

  const prevImage = (reelId, imagesLength) => {
    setActiveCarouselIndexes(prev => ({
      ...prev,
      [reelId]: ((prev[reelId] || 0) - 1 + imagesLength) % imagesLength
    }));
  };

  const handleScroll = (e) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (!isNaN(index) && index !== activeReelIndex) {
      setActiveReelIndex(index);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1 } }}
      exit={{ opacity: 0 }}
      onScroll={handleScroll}
      style={{
        height: '100vh',
        width: '100vw',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        background: 'black',
        position: 'relative'
      }}
    >
      {/* Back button */}
      <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 50 }}>
        <button 
          onClick={onBack} 
          className="btn-indie" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: '#fff', 
            color: '#000', 
            border: '2px solid #000', 
            boxShadow: '3px 3px 0px #000',
            fontWeight: 800,
            borderRadius: '12px'
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {user.content.reels.map((reel, index) => {
        const carouselIndex = activeCarouselIndexes[reel.id] || 0;
        const isActive = index === activeReelIndex;

        return (
          <div
            key={reel.id}
            style={{
              height: '100vh',
              width: '100vw',
              scrollSnapAlign: 'start',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            {/* Background Content */}
            {reel.type === 'final' ? (
              <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                <img src={reel.image} alt="Final Memories" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <FinalAudioPlayer src={reel.audioUrl} isActive={isActive} />
              </div>
            ) : reel.type === 'video' ? (
              <ReelVideo 
                src={reel.videoUrl} 
                isActive={isActive} 
                isMuted={isMuted} 
                onToggleMute={() => setIsMuted(!isMuted)} 
              />
            ) : (
              // Quirky Image Carousel
              <div style={{ width: '100%', height: '100%', position: 'relative', background: '#222' }}>
                <motion.div
                  key={carouselIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${reel.images[carouselIndex]})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                />

                {/* Carousel Controls */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage(reel.id, reel.images.length);
                  }}
                  style={{
                    position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%',
                    width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 10
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage(reel.id, reel.images.length);
                  }}
                  style={{
                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%',
                    width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 10
                  }}
                >
                  <ChevronRight size={24} />
                </button>

                {/* Dots indicator */}
                <div style={{ position: 'absolute', bottom: '9rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                  {reel.images.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: i === carouselIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                        transition: 'background 0.3s'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Overlay UI (Lively Comment Section) */}
            {reel.type !== 'final' && (
              <div
                onClick={(e) => e.stopPropagation()} // Stop clicking comments/buttons from muting the video
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '2rem 1.5rem',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  zIndex: 20
                }}
              >
                <div style={{ flex: 1, maxWidth: '80%' }}>
                  <h2 style={{ fontFamily: 'var(--font-handwritten)', fontSize: '2rem', marginBottom: '0.5rem', textShadow: '1px 1px 2px black' }}>
                    @{user.name}
                  </h2>
                  <CountdownTimer targetDateStr="2026-08-11T23:59:59" dark />
                  <div 
                    style={{ 
                      maxHeight: '120px', 
                      overflowY: 'auto', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '0.4rem',
                      background: 'rgba(0,0,0,0.4)',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    {reel.fakeComments.map((comment, i) => (
                      <div key={i} style={{ fontSize: '0.9rem' }}>
                        <strong style={{ color: '#ffd54f' }}>{comment.username}</strong>: {comment.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center', marginLeft: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                    <Heart size={28} />
                    <span style={{ fontSize: '0.8rem', marginTop: '0.1rem' }}>{reel.likes}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                    <MessageCircle size={28} />
                    <span style={{ fontSize: '0.8rem', marginTop: '0.1rem' }}>{reel.commentsCount}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                    <Share2 size={28} />
                    <span style={{ fontSize: '0.8rem', marginTop: '0.1rem' }}>Share</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
