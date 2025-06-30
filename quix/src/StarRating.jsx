import { useState } from 'react';

function StarRating({ value, onChange }) {
  const [internal, setInternal] = useState(0);
  const rating = typeof value === 'number' ? value : internal;
  const setRating = onChange || setInternal;
  return (
    <div className="star-rating minimal">
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          className={star <= rating ? 'star filled' : 'star'}
          onClick={() => setRating(star)}
          tabIndex={0}
          style={{fontSize: '1.2rem', margin: '0 0.08rem', cursor: 'pointer', padding: '0.1rem'}}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setRating(star); }}
        >★</span>
      ))}
    </div>
  );
}

export default StarRating; 