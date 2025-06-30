import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

// For demo, use localStorage to persist polls
function getPolls() {
  return JSON.parse(localStorage.getItem('quix_polls') || '[]');
}

function Dashboard() {
  const [polls, setPolls] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setPolls(getPolls());
  }, []);

  return (
    <div className="quix-app">
      <div className="bento-layout">
        <div className="bento-left">
          <div className="bento-card" style={{gap: '2rem', alignItems: 'flex-start', justifyContent: 'center', minHeight: '200px'}}>
            <h1 style={{fontSize: '2.2rem', margin: 0, lineHeight: 1.1}}>Dashboard</h1>
            <Link to="/" className="icon-btn" style={{fontSize: '1.3rem', marginTop: '1.5rem'}} title="Home">🏠 Home</Link>
          </div>
        </div>
        <div className="bento-right" style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
          <div className="bento-card" style={{minWidth: 220, minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            {polls.length === 0 ? (
              <div className="hint">No polls deployed yet.</div>
            ) : (
              <div className="poll-list" style={{justifyContent: 'center'}}>
                {polls.map((poll, idx) => (
                  <div key={idx} className="poll-card" onClick={() => setSelected(poll)}>
                    <img src={poll.screenshot} alt="Poll Screenshot" className="dashboard-thumb" />
                    <div className="poll-meta">
                      <div className="poll-title">Poll #{idx + 1}</div>
                      <div className="poll-hotspots">{poll.hotspots.length} points</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Poll Results</h2>
            <img src={selected.screenshot} alt="Poll Screenshot" className="dashboard-thumb" style={{maxWidth: 300}} />
            <ul style={{marginTop: '1.2rem'}}>
              {selected.hotspots.map((pt, i) => (
                <li key={i} style={{marginBottom: '0.7rem'}}>
                  Point {i + 1}: <b>{pt.ratings ? (pt.ratings.reduce((a, b) => a + b, 0) / pt.ratings.length).toFixed(2) : 'N/A'}</b> stars ({pt.ratings ? pt.ratings.length : 0} votes)
                </li>
              ))}
            </ul>
            <button onClick={() => setSelected(null)} style={{marginTop: '1.2rem'}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 