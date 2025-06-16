import React, { useState, useEffect, useRef } from 'react';
import './Game.css';

const Game = () => {
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const gameContainerRef = useRef(null);
  const CHARACTER_WIDTH = 75;

  const [clouds, setClouds] = useState([
    { id: 1, top: '50px', left: '100px' },
    { id: 4, top: '90px', left: '300px' },
    { id: 2, top: '50px', left: '500px' },
    { id: 3, top: '80px', left: '800px' },
    { id: 5, top: '20px', left: '1000px' },
  ]);

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

  useEffect(() => {
    if (gameContainerRef.current) {
      const characterOffsetLeft = position;
      const visibleScreenWidth = window.innerWidth;
      
      const scrollThreshold = (visibleScreenWidth / 2) - (CHARACTER_WIDTH / 2);

      if (characterOffsetLeft >= scrollThreshold) {
        gameContainerRef.current.scrollLeft = characterOffsetLeft - scrollThreshold;
      }
    }
  }, [position]);

  return (
    <div className="game-container" ref={gameContainerRef}>
      <div className="game-title">
        A frontend developer's <br/> adventures in the wild
      </div>
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          className="cloud"
          style={{ top: cloud.top, left: cloud.left }}
        ></div>
      ))}

      <div
        className="flower flower1"
        style={{ left: '200px' }}
      ></div>

      <div
        className="building"
        style={{ left: '300px' }}
      ></div>

      <div
        className="flower flower2"
        style={{ left: '550px' }}
      ></div>
      <div
        className="flower flower3"
        style={{ left: '650px' }}
      ></div>

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