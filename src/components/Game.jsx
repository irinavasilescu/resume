import React, { useState, useEffect } from 'react';
import './Game.css';

const Game = () => {
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        setPosition(prev => prev + 20);
      }
      if (event.key === 'ArrowLeft') {
        setPosition(prev => Math.max(0, prev - 20));
      }
      if (event.key === 'ArrowUp' && !isJumping) {
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJumping]);

  return (
    <div className="game-container">
      <div 
        className={`character ${isJumping ? 'jump' : ''}`}
        style={{ left: `${position}px` }}
      >
        
      </div>
      <div className="ground"></div>
    </div>
  );
};

export default Game; 