import React, { useState, useEffect, useRef } from 'react';
import './Game.css';
import backgroundMusic from '../assets/music.mp3';

const Game = () => {
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [direction, setDirection] = useState('right');
  const [isMuted, setIsMuted] = useState(true);
  const gameContainerRef = useRef(null);
  const audioRef = useRef(null);
  const CHARACTER_WIDTH = 75;

  const [clouds, setClouds] = useState([
    { id: 1, top: '50px', left: '100px' },
    { id: 2, top: '90px', left: '300px' },
    { id: 3, top: '50px', left: '500px' },
    { id: 4, top: '80px', left: '800px' },
    { id: 5, top: '20px', left: '1000px' },
    { id: 6, top: '40px', left: '1300px' },
    { id: 6, top: '90px', left: '1500px' },
  ]);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio(backgroundMusic);
    audioRef.current.loop = true;
  }, []);

  const toggleAudio = () => {
    if (isMuted) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        setPosition(prev => prev + 20);
        setDirection('right');
      }
      if (event.key === 'ArrowLeft') {
        setPosition(prev => Math.max(0, prev - 20));
        setDirection('left');
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

  const handleLeftClick = () => {
    setPosition(prev => Math.max(0, prev - 20));
    setDirection('left');
  };

  const handleRightClick = () => {
    setPosition(prev => prev + 20);
    setDirection('right');
  };

  const handleJumpClick = () => {
    if (!isJumping) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  };

  return (
    <div className="game-container" ref={gameContainerRef}>
      <audio ref={audioRef} src={backgroundMusic} loop />
      
      <button 
        className={`audio-control ${isMuted ? 'muted' : ''}`}
        onClick={toggleAudio}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      <div className="game-title">
        A frontend developer's <br /> adventures in the wild
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
        style={{ left: '150px' }}
      ></div>

      <div
        className="building"
        style={{ left: '200px' }}
      ></div>

      <div
        className="flower flower2"
        style={{ left: '440px' }}
      ></div>

      <div
        className="pet1"
        style={{ left: '490px' }}
      ></div>

      <div
        className="flower flower3"
        style={{ left: '560px' }}
      ></div>

      <div
        className="corporate1"
        style={{ left: '600px' }}
      ></div>

      <div
        className="tree"
        style={{ left: '830px' }}
      ></div>

      <div
        className="pet2"
        style={{ left: '950px' }}
      ></div>

      <div
        className="flower flower4"
        style={{ left: '1050px' }}
      ></div>

      <div
        className="corporate2"
        style={{ left: '1100px' }}
      ></div>

      <div
        className="crochet"
        style={{ left: '1350px' }}
      ></div>

      <div
        className="pet3"
        style={{ left: '1450px' }}
      ></div>

      <div
        className="flower flower1"
        style={{ left: '1540px' }}
      ></div>

      <div
        className="portal"
        style={{ left: '1600px' }}
      ></div>

      <div
        className={`character ${isJumping ? 'jump' : ''} ${direction === 'left' ? 'face-left' : ''}`}
        style={{ left: `${position}px` }}
      >
      </div>
      <div className="ground"></div>

      <div className="control-buttons">
        <button className="control-button" onClick={handleLeftClick}>
          ←
        </button>
        <button className="control-button" onClick={handleJumpClick}>
          ↑
        </button>
        <button className="control-button" onClick={handleRightClick}>
          →
        </button>
      </div>
    </div>
  );
};

export default Game; 