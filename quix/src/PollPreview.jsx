import { useEffect, useState, useRef } from 'react';
import './App.css';
import GrainOverlay from './GrainOverlay.jsx';
import { Link } from 'react-router-dom';
import StarRating from './StarRating.jsx';

function PollPreview() {
  const [poll, setPoll] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const imgRef = useRef();

  useEffect(() => {
    const data = localStorage.getItem('quix_preview_poll');
    if (data) {
      const parsed = JSON.parse(data);
      setPoll(parsed);
      setHotspots(parsed.hotspots.map(pt => ({ ...pt, rating: 0 })));
    }
  }, []);

  const handleRate = (idx, value) => {
    setHotspots(hotspots => hotspots.map((pt, i) => i === idx ? { ...pt, rating: value } : pt));
  };

  if (!poll) return <div className="quix-app glass-bg"><GrainOverlay /><div className="hint">No poll to preview.</div></div>;

  return (
    <div className="quix-app">
      <GrainOverlay />
      <div className="bento-layout">
        <div className="bento-left">
          <div className="bento-card" style={{gap: '2rem', alignItems: 'flex-start', justifyContent: 'center', minHeight: '200px'}}>
            <h1 style={{fontSize: '2.2rem', margin: 0, lineHeight: 1.1}}>Poll<br/>Preview</h1>
            <Link to="/" className="icon-btn" style={{fontSize: '1.3rem', marginTop: '1.5rem'}} title="Home">🏠 Home</Link>
          </div>
        </div>
        <div className="bento-right">
          <div className="bento-card screenshot-panel" style={{alignItems: 'center', justifyContent: 'center', minHeight: '60vh'}}>
            <div className="screenshot-container right-pane" style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
              <img
                src={poll.screenshot}
                alt="Poll Screenshot"
                ref={imgRef}
                className="screenshot-img"
                style={{ pointerEvents: 'none', maxHeight: '70vh', maxWidth: '100%', objectFit: 'contain', margin: '0 auto', display: 'block' }}
              />
              {hotspots.map((pt, idx) => (
                <div
                  key={idx}
                  className="hotspot"
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                >
                  <StarRating value={pt.rating} onChange={val => handleRate(idx, val)} />
                </div>
              ))}
            </div>
            <p className="hint" style={{textAlign: 'center', marginTop: '2rem'}}>Click stars to rate each point.<br/>(Demo only, not saved to server.)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollPreview; 