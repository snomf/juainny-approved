import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Play, Pause, X, Music, Film, FileText } from 'lucide-react';

export default function TypeCView({ user, onBack }) {
  const containerRef = useRef(null);
  const [moviesData, setMoviesData] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#e8e0ff', '#e2f0fa', '#e8f5e9']
  );

  const togglePlay = (url) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.error("Audio playback error:", err));
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) return;

    const fetchAllMovies = async () => {
      const allFetched = {};
      const movieItems = user.content.timeline.filter(item => item.type === 'movie');
      
      for (const item of movieItems) {
        try {
          const res = await fetch(`https://api.themoviedb.org/3/movie/${item.tmdbId}?api_key=${apiKey}`);
          if (!res.ok) throw new Error("TMDB fetch failed");
          const data = await res.json();
          allFetched[item.tmdbId] = {
            id: data.id,
            title: data.title,
            poster: data.poster_path ? `https://image.tmdb.org/t/p/w300${data.poster_path}` : 'https://placehold.co/300x450?text=No+Poster',
            overview: data.overview,
            rating: data.vote_average.toFixed(1),
            genres: data.genres?.map(g => g.name).slice(0, 2).join(', '),
            approvedNote: item.approvedNote,
            customImage: item.image
          };
        } catch (e) {
          console.error(e);
          allFetched[item.tmdbId] = {
            id: item.tmdbId,
            title: `Movie ID: ${item.tmdbId}`,
            poster: 'https://placehold.co/300x450?text=Movie',
            overview: 'Could not load details from TMDB.',
            rating: 'N/A',
            genres: 'Unknown',
            approvedNote: item.approvedNote,
            customImage: item.image
          };
        }
      }
      setMoviesData(allFetched);
    };

    fetchAllMovies();
  }, [user]);

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor, minHeight: '250vh', position: 'relative', paddingBottom: '10vh' }}
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
        <p style={{ fontSize: '1.1rem', color: '#555', fontWeight: 500, marginTop: '0.5rem' }}>A 1-Year Movie Chronicle</p>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Minimalist timeline track */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px',
          background: 'rgba(0, 0, 0, 0.1)', transform: 'translateX(-50%)', zIndex: 1
        }} />

        {user.content.timeline.map((item, index) => {
          const rotation = index % 2 === 0 ? -3 : 3;

          return (
            <div key={item.id} style={{ position: 'relative', margin: '15vh 0', zIndex: 2 }}>
              
              {/* Timeline Item Icon Badge */}
              <div 
                style={{ 
                  position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '-20px',
                  background: '#000', color: '#fff', padding: '6px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }}
              >
                {item.type === 'notepad' && <FileText size={16} />}
                {item.type === 'movie' && <Film size={16} />}
                {item.type === 'song' && <Music size={16} />}
              </div>

              {/* 1. NOTEPAD TYPE */}
              {item.type === 'notepad' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
                  <motion.div
                    className="indie-card"
                    style={{ width: '260px', transform: `rotate(${rotation}deg)` }}
                    whileHover={{ scale: 1.03, rotate: 0 }}
                  >
                    <img src={item.image} alt="AMC" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ padding: '1rem', background: '#fff' }}>
                      <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#333' }}>
                        {item.note}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* 2. MOVIE TYPE */}
              {item.type === 'movie' && (() => {
                const movie = moviesData[item.tmdbId];
                if (!movie) {
                  return (
                    <div style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                      Loading movie...
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>
                      {/* Movie Poster Card */}
                      <motion.div
                        className="indie-card"
                        style={{ width: '150px', transform: `rotate(${rotation}deg)` }}
                        whileHover={{ scale: 1.05, rotate: 0 }}
                        onClick={() => setSelectedMovie(movie)}
                      >
                        <div
                          className="indie-img"
                          style={{ backgroundImage: `url(${movie.poster})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '220px' }}
                        />
                        <div className="indie-caption" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {movie.title}
                        </div>
                      </motion.div>

                      {/* Associated Custom Picture Card (if present) */}
                      {movie.customImage && (
                        <motion.div
                          className="indie-card"
                          style={{ width: '150px', transform: `rotate(${rotation * -1}deg)`, alignSelf: 'flex-end', marginTop: '2rem' }}
                          whileHover={{ scale: 1.05, rotate: 0 }}
                          onClick={() => setSelectedMovie(movie)}
                        >
                          <div
                            className="indie-img"
                            style={{ backgroundImage: `url(${movie.customImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '180px' }}
                          />
                          <div className="indie-caption" style={{ fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
                            Our Memory 📸
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <button 
                      className="btn-indie" 
                      style={{ marginTop: '1.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                      onClick={() => setSelectedMovie(movie)}
                    >
                      Expand Details
                    </button>
                  </div>
                );
              })()}

              {/* 3. SONG TYPE */}
              {item.type === 'song' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  <motion.div
                    className="indie-card"
                    style={{
                      background: '#ffffff', width: '280px', display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.8rem', transform: `rotate(${rotation * -0.5}deg)`
                    }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => togglePlay(item.audioUrl)}
                  >
                    <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                      <img src={item.cover} alt="album cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {isPlaying && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="playing-bar-animation" style={{ display: 'inline-block', width: '3px', height: '15px', background: '#fff', margin: '0 2px' }} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <h4 style={{ fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{item.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#666', margin: '2px 0 0 0' }}>{item.artist}</p>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                  </motion.div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Movie Modal */}
      <AnimatePresence>
        {selectedMovie && (
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
            onClick={() => setSelectedMovie(null)}
          >
            <div
              className="indie-card"
              style={{
                width: '100%',
                maxWidth: '420px',
                background: '#fff',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '1.5rem'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMovie(null)}
                style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  style={{ width: '110px', height: '165px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', objectFit: 'cover' }}
                />
                <div>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>{selectedMovie.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f5c518', marginBottom: '0.4rem' }}>
                    <Star size={16} fill="currentColor" />
                    <span style={{ color: '#1a1a1a', fontWeight: 'bold' }}>{selectedMovie.rating}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>{selectedMovie.genres}</p>
                </div>
              </div>

              {/* Memory Picture inside modal (if present) */}
              {selectedMovie.customImage && (
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Memory Photo
                  </p>
                  <img
                    src={selectedMovie.customImage}
                    alt="Memory"
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }}
                  />
                </div>
              )}

              {/* Juainny Approved Custom Note */}
              <div 
                style={{ 
                  marginTop: '1.5rem', 
                  background: '#1a1a1a', 
                  padding: '1.2rem', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  position: 'relative'
                }}
              >
                {/* Stamp label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.8rem' }}>
                  <img src="/assets/juainny-stamp.png" alt="Stamp" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>JUAINNY'S APPROVED NOTE</span>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#eee', fontWeight: 500 }}>
                  "{selectedMovie.approvedNote}"
                </p>
              </div>

              <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', lineHeight: 1.5, color: '#666' }}>
                {selectedMovie.overview}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
