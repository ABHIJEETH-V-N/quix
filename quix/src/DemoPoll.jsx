import './App.css';

const samplePoll = {
  title: 'What futuristic feature do you want most?',
  options: ['AI Assistant', 'Teleportation', 'Flying Cars', 'Smart Homes'],
  theme: 'futuristic',
  timeLimit: 60,
};

function DemoPoll() {
  return (
    <div className="quix-app acrylic-bg">
      <h2>Poll Preview</h2>
      <div className="poll-form">
        <h3 style={{marginBottom: '1.2rem'}}>{samplePoll.title}</h3>
        <ul style={{listStyle: 'none', padding: 0, marginBottom: '1.2rem'}}>
          {samplePoll.options.map((opt, idx) => (
            <li key={idx} style={{margin: '0.7rem 0'}}>
              <button style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(90deg, #6ee7ff 0%, #a685fa 100%)',
                color: '#181f2b',
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: 'pointer',
                marginBottom: '0.2rem',
                boxShadow: '0 2px 12px 0 rgba(110, 231, 255, 0.12)'
              }}>{opt}</button>
            </li>
          ))}
        </ul>
        <div style={{color: '#b6b6e0', fontSize: '1rem'}}>Time Limit: {samplePoll.timeLimit} seconds</div>
      </div>
      <footer>Demo Preview &mdash; Quix</footer>
    </div>
  );
}

export default DemoPoll; 