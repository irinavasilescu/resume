import React, { useState, useEffect, useRef } from 'react';
import './Game.css';
import backgroundMusic from '../assets/music.mp3';
import trophyImage from '../assets/trophy.png';
import earthImage from '../assets/earth.png';

const Game = () => {
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [direction, setDirection] = useState('right');
  const [isMuted, setIsMuted] = useState(true);
  const [isAbilitiesModalOpen, setIsAbilitiesModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isLanguagesModalOpen, setIsLanguagesModalOpen] = useState(false);
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

  const skills = [
    'Angular', 'Vue', 'React', 'TypeScript', 'JavaScript',
    'Angular Material', 'Bootstrap', 'HTML', 'CSS', 'SCSS',
    'REST', 'GraphQL', 'Cypress', 'Jasmine', 'Git',
    'Bitbucket', 'NPM', 'Yarn', 'RxJS', 'Apollo',
    'Chart.js', 'Agile', 'Google Analytics', 'Sonar',
    'Sentry', 'Linux', 'Mirage JS'
  ];

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

  const handleHeadClick = () => {
    setIsAbilitiesModalOpen(true);
  };

  const handleAbilitiesCloseModal = () => {
    setIsAbilitiesModalOpen(false);
  };

  const handleTrophyClick = () => {
    setIsAchievementsModalOpen(true);
  };

  const handleAchievementsCloseModal = () => {
    setIsAchievementsModalOpen(false);
  }

  const handleEarthClick = () => {
    setIsLanguagesModalOpen(true);
  };

  const handleLanguagesCloseModal = () => {
    setIsLanguagesModalOpen(false);
  };

  return (
    <div className="game-container" ref={gameContainerRef}>
      <audio ref={audioRef} src={backgroundMusic} loop />
      
      <div className="player-status">
        <div className="player-head" onClick={handleHeadClick}>
          <div className="speech-bubble">
            Click here to see my abilities
          </div>
        </div>
        <div className="trophy-container" onClick={handleTrophyClick}>
          <img src={trophyImage} alt="Trophy" className="trophy-image" />
        </div>
        <div onClick={handleEarthClick}>
          <img src={earthImage} alt="Earth" className="earth-image" />
        </div>
        <div className="hearts-container">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="heart"></div>
          ))}
        </div>
      </div>

      {isAbilitiesModalOpen && (
        <div className="modal-overlay" onClick={handleAbilitiesCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleAbilitiesCloseModal}>×</button>
            <div className="modal-content">
              {skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isAchievementsModalOpen && (
        <div className="modal-overlay" onClick={handleAchievementsCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleAchievementsCloseModal}>×</button>
            <div className="modal-content achievements">
              <h2>Achievements</h2>
              <div className="achievement-item">
                <h3>Component library</h3>
                <p>Introduced a component library increasing development speed and UI consistency across frontend projects.</p>
              </div>
              <div className="achievement-item">
                <h3>Monolith migration</h3>
                <p>Successfully transitioned up to 50% of PHP-based eMAG Marketplace interfaces to Angular within less than 4 years.</p>
              </div>
              <div className="achievement-item">
                <h3>Team building</h3>
                <p>Expanded the frontend team from a solo developer to a 10-member team.</p>
              </div>
              <div className="achievement-item">
                <h3>Onboarding</h3>
                <p>Created onboarding documentation, technical guides, environment setup steps, coding standards. Facilitated regular feedback sessions.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLanguagesModalOpen && (
        <div className="modal-overlay" onClick={handleLanguagesCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleLanguagesCloseModal}>×</button>
            <div className="modal-content languages">
              <h2>Languages</h2>
              <div className="language-item">
                <div className="flag romanian-flag">🇷🇴</div>
                <div className="language-text">
                  <h3>Romanian</h3>
                  <p>Native language</p>
                </div>
              </div>
              <div className="language-item">
                <div className="flag english-flag">🇬🇧</div>
                <div className="language-text">
                  <h3>English</h3>
                  <p>Professional working proficiency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button 
        className={`audio-control ${isMuted ? 'muted' : ''}`}
        onClick={toggleAudio}
      >
        {isMuted ? 'SOUND OFF' : 'SOUND ON'}
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