import React, { useState, useEffect, useRef } from 'react';
import './Game.css';
import backgroundMusic from '../assets/music.mp3';
import trophyImage from '../assets/trophy.png';
import earthImage from '../assets/earth.png';
import bearImage from '../assets/bear.png';

const Game = () => {
  const [position, setPosition] = useState(0);
  const [characterScreenPosition, setCharacterScreenPosition] = useState(5); // Percentage from left
  
  // Keep refs in sync with state - update immediately
  useEffect(() => {
    positionRef.current = position;
  }, [position]);
  
  useEffect(() => {
    characterScreenPositionRef.current = characterScreenPosition;
  }, [characterScreenPosition]);
  
  // Wrapper functions to update both state and refs synchronously
  const updatePosition = (newPosition) => {
    positionRef.current = newPosition;
    setPosition(newPosition);
  };
  
  const updateCharacterScreenPosition = (newPos) => {
    characterScreenPositionRef.current = newPos;
    setCharacterScreenPosition(newPos);
  };
  const [isJumping, setIsJumping] = useState(false);
  const [direction, setDirection] = useState('right');
  const [isMusicMuted, setIsMusicMuted] = useState(true);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Modals
  const [isAbilitiesModalOpen, setIsAbilitiesModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isLanguagesModalOpen, setIsLanguagesModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isCorporate1ModalOpen, setIsCorporate1ModalOpen] = useState(false);
  const [isCorporate2ModalOpen, setIsCorporate2ModalOpen] = useState(false);
  const [isYarnBallModalOpen, setIsYarnBallModalOpen] = useState(false);
  const [showPortalDialogue, setShowPortalDialogue] = useState(false);
  const [portalDialogueLeft, setPortalDialogueLeft] = useState(0);
  const [explodedCoins, setExplodedCoins] = useState(new Set());
  const [explodingCoins, setExplodingCoins] = useState(new Set());
  const [particles, setParticles] = useState([]);

  const gameContainerRef = useRef(null);
  const audioRef = useRef(null);
  const positionRef = useRef(0);
  const characterScreenPositionRef = useRef(5);
  
  // Sound effect functions using Web Audio API
  const playJumpSound = () => {
    if (isSoundMuted) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };
  
  const playCoinSound = () => {
    if (isSoundMuted) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.15);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };
  
  const playExplosionSound = () => {
    if (isSoundMuted) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };
  
  const playClickSound = () => {
    if (isSoundMuted) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  // Create particle effects
  const createParticles = (x, y, type = 'default') => {
    const particleCount = type === 'coin' ? 12 : 8;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = type === 'coin' ? 80 + Math.random() * 40 : 60 + Math.random() * 30;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        vx,
        vy,
        type,
        life: 1.0,
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => {
        const gravity = particle.type === 'jump' ? 0.5 : 0.3;
        return {
          ...particle,
          x: particle.x + particle.vx * 0.016,
          y: particle.y + particle.vy * 0.016,
          vy: particle.vy + gravity,
          life: particle.life - 0.016,
        };
      }).filter(p => p.life > 0));
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [particles.length]);

  const [clouds, setClouds] = useState([
    { id: 1, top: '50px', left: '100px' },
    { id: 2, top: '90px', left: '300px' },
    { id: 3, top: '50px', left: '500px' },
    { id: 4, top: '80px', left: '800px' },
    { id: 5, top: '20px', left: '1000px' },
    { id: 6, top: '40px', left: '1300px' },
    { id: 7, top: '90px', left: '1500px' },
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
    // Fix viewport height for mobile browsers (address bar issue)
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setViewportHeight();
    
    // Initialize audio
    audioRef.current = new Audio(backgroundMusic);
    audioRef.current.loop = true;

    // Check screen size on mount
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
      setViewportHeight(); // Update viewport height on resize
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('orientationchange', setViewportHeight);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  const toggleAudio = () => {
    if (isMusicMuted) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsMusicMuted(!isMusicMuted);
  };

  const toggleSoundEffects = () => {
    setIsSoundMuted(!isSoundMuted);
  };

  // Check portal proximity continuously
  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const gameContainerWidth = 1800;
    const maxBackgroundScroll = gameContainerWidth - viewportWidth;
    
    // Calculate character's world position
    let charWorldX;
    
    if (position >= maxBackgroundScroll) {
      // Character is at end
      const screenPixelsFromLeft = (characterScreenPosition / 100) * viewportWidth;
      charWorldX = maxBackgroundScroll + screenPixelsFromLeft;
    } else {
      // Character is in normal scrolling area
      const screenPixelsFromLeft = (characterScreenPosition / 100) * viewportWidth;
      charWorldX = position + screenPixelsFromLeft;
    }
    
    // Check if character is near portal (1600px)
    if (charWorldX >= 1550 && charWorldX <= 1650) {
      setShowPortalDialogue(true);
      
      // Calculate portal's screen position for dialogue bubble
      const portalWorldX = 1600;
      let portalScreenX;
      
      if (position >= maxBackgroundScroll) {
        // Portal is at end, calculate screen position
        portalScreenX = portalWorldX - maxBackgroundScroll;
      } else {
        // Portal is in normal scrolling area
        portalScreenX = portalWorldX - position;
      }
      
      // Position dialogue bubble above portal (centered on portal)
      const bubbleLeft = Math.max(10, Math.min(viewportWidth - 310, portalScreenX - 150));
      setPortalDialogueLeft(bubbleLeft);
    } else {
      setShowPortalDialogue(false);
    }
  }, [position, characterScreenPosition]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      closeAllModals();

      if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
        const gameContainerWidth = 1800;
        const viewportWidth = window.innerWidth;
        const moveAmount = 20;
        const maxBackgroundScroll = gameContainerWidth - viewportWidth;
        
        setPosition(prev => {
          // Check if we've reached the end of the background
          if (prev >= maxBackgroundScroll) {
            // At the end - move character instead of background
            setCharacterScreenPosition(prevCharPos => {
              const newCharPos = prevCharPos + (moveAmount / viewportWidth * 100);
              // Allow character to move to right edge (90% to keep some margin)
              return Math.min(90, Math.max(5, newCharPos));
            });
            return prev; // Background position stays at max
          }
          
          // Normal movement - move background
          const newPosition = prev + moveAmount;
          return newPosition;
        });
        setDirection('right');
      }

      if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') {
        const gameContainerWidth = 1800;
        const viewportWidth = window.innerWidth;
        const moveAmount = 20;
        const maxBackgroundScroll = gameContainerWidth - viewportWidth;
        
        setPosition(prev => {
          // If at end and character has moved right, move character back first
          if (prev >= maxBackgroundScroll) {
            setCharacterScreenPosition(prevCharPos => {
              if (prevCharPos > 10) {
                const newCharPos = prevCharPos - (moveAmount / viewportWidth * 100);
                const clampedPos = Math.min(90, Math.max(5, newCharPos));
                // If character is back to starting position (10%), allow background to scroll
                if (clampedPos <= 10) {
                  const newPosition = Math.max(0, prev - moveAmount);
                  setPosition(newPosition);
                }
                return clampedPos;
              }
              return prevCharPos;
            });
            return prev; // Background stays at max until character is back
          }
          
          // Normal movement when not at end
          const newPosition = Math.max(0, prev - moveAmount);
          return newPosition;
        });
        setDirection('left');
      }
      
      if ((event.key === 'w' || event.key === 'W' || event.key === 'ArrowUp') && !isJumping) {
        playJumpSound();
        
        // Create jump particles
        const viewportWidth = window.innerWidth;
        const charScreenX = (characterScreenPositionRef.current / 100) * viewportWidth;
        createParticles(charScreenX, window.innerHeight - 125, 'jump'); // Character bottom position
        
        setIsJumping(true);
        // Small delay to ensure state has updated before checking collision
        setTimeout(() => {
          // Check for coin collision multiple times during jump to catch the intersection
          let collisionDetected = false;
          const checkInterval = setInterval(() => {
            // Get latest values from refs
            const currentPos = positionRef.current;
            const currentCharPos = characterScreenPositionRef.current;
            // Only check if we haven't detected a collision yet
            if (!collisionDetected) {
              collisionDetected = checkCoinCollision(currentPos, currentCharPos, explodedCoins);
              if (collisionDetected) {
                clearInterval(checkInterval);
              }
            }
          }, 50); // Check every 50ms during jump
          
          // Stop checking after jump completes
          setTimeout(() => {
            clearInterval(checkInterval);
            setIsJumping(false);
          }, 450); // 500ms total - 50ms initial delay
        }, 50);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJumping]);

  const closeAllModals = () => {
    setIsAbilitiesModalOpen(false);
    setIsAchievementsModalOpen(false);
    setIsLanguagesModalOpen(false);
    setIsEducationModalOpen(false);
    setIsCorporate1ModalOpen(false);
    setIsCorporate2ModalOpen(false);
    setIsYarnBallModalOpen(false);
  }

  const handleLeftClick = () => {
    const gameContainerWidth = 1800;
    const viewportWidth = window.innerWidth;
    const moveAmount = 20;
    const maxBackgroundScroll = gameContainerWidth - viewportWidth;
    
    setPosition(prev => {
      // If at end and character has moved right, move character back first
      if (prev >= maxBackgroundScroll) {
        setCharacterScreenPosition(prevCharPos => {
          if (prevCharPos > 10) {
            const newCharPos = prevCharPos - (moveAmount / viewportWidth * 100);
            const clampedPos = Math.min(90, Math.max(5, newCharPos));
            
            // If character is back to starting position (10%), allow background to scroll
            if (clampedPos <= 10) {
              const newPosition = Math.max(0, prev - moveAmount);
              setPosition(newPosition);
            }
            return clampedPos;
          }
          return prevCharPos;
        });
        return prev; // Background stays at max until character is back
      }
      
      // Normal movement when not at end
      const newPosition = Math.max(0, prev - moveAmount);
      return newPosition;
    });
    setDirection('left');
  };

  const handleRightClick = () => {
    const gameContainerWidth = 1800;
    const viewportWidth = window.innerWidth;
    const moveAmount = 20;
    const maxBackgroundScroll = gameContainerWidth - viewportWidth;
    
    setPosition(prev => {      
      // Check if we've reached the end of the background
      if (prev >= maxBackgroundScroll) {
        // At the end - move character instead of background
        setCharacterScreenPosition(prevCharPos => {
          const newCharPos = prevCharPos + (moveAmount / viewportWidth * 100);
          const clampedPos = Math.min(90, Math.max(5, newCharPos));
          return clampedPos;
        });
        return prev; // Background position stays at max
      }
      
      // Normal movement - move background
      const newPosition = prev + moveAmount;
      return newPosition;
    });
    setDirection('right');
  };

  const checkCoinCollision = (currentPos, currentCharPos, explodedCoins) => {
    // Character position in the game world
    const viewportWidth = window.innerWidth;
    const gameContainerWidth = 1800;
    const maxBackgroundScroll = gameContainerWidth - viewportWidth;
    
    // Character dimensions
    const charWidth = 75;
    
    // Calculate character's world X position (center of character)
    let charWorldX;
    
    if (currentPos >= maxBackgroundScroll) {
      // Character is at end, calculate world position from screen position
      const screenPixelsFromLeft = (currentCharPos / 100) * viewportWidth;
      charWorldX = maxBackgroundScroll + screenPixelsFromLeft;
    } else {
      // Character is in normal scrolling area
      const screenPixelsFromLeft = (currentCharPos / 100) * viewportWidth;
      charWorldX = currentPos + screenPixelsFromLeft;
    }
    
    // Character bounding box (X coordinates)
    const charLeft = charWorldX - (charWidth / 2);
    const charRight = charWorldX + (charWidth / 2);
    
    // Coin positions and dimensions
    const coinWidth = 30;
    const coinPositions = [
      { x: 285, modal: 'education' },      // UPB building
      { x: 685, modal: 'corporate1' },    // Bitdefender building
      { x: 1185, modal: 'corporate2' },   // eMAG building
      { x: 1385, modal: 'yarnBall' }      // Yarn ball
    ];
    
    // Check for actual intersection with coins
    let hitCoin = null;
    
    coinPositions.forEach(coin => {
      // Skip if coin is already exploded
      if (explodedCoins.has(coin.modal)) {
        return;
      }
      
      // Coin bounding box (X coordinates)
      const coinLeft = coin.x - (coinWidth / 2);
      const coinRight = coin.x + (coinWidth / 2);
      
      // Check if character and coin intersect on X axis
      if (charLeft < coinRight && charRight > coinLeft) {
        hitCoin = coin;
      }
    });
    
    // Only open modal for the coin that was actually hit
    if (hitCoin) {
      // Play coin collection and explosion sounds
      playCoinSound();
      playExplosionSound();
      
      // Create particle effect for coin explosion
      const viewportWidth = window.innerWidth;
      const gameContainerWidth = 1800;
      const maxBackgroundScroll = gameContainerWidth - viewportWidth;
      
      let coinScreenX;
      if (currentPos >= maxBackgroundScroll) {
        coinScreenX = hitCoin.x - maxBackgroundScroll;
      } else {
        coinScreenX = hitCoin.x - currentPos;
      }
      
      createParticles(coinScreenX, window.innerHeight - 275, 'coin'); // 275px from bottom
      
      // Trigger explosion
      setExplodingCoins(prev => new Set(prev).add(hitCoin.modal));
      
      // Hide coin after explosion animation
      setTimeout(() => {
        setExplodingCoins(prev => {
          const newSet = new Set(prev);
          newSet.delete(hitCoin.modal);
          return newSet;
        });
        setExplodedCoins(prev => new Set(prev).add(hitCoin.modal));
        
        // Regenerate coin after 5 seconds
        setTimeout(() => {
          setExplodedCoins(prev => {
            const newSet = new Set(prev);
            newSet.delete(hitCoin.modal);
            return newSet;
          });
        }, 5000);
      }, 500); // Explosion animation duration
      
      switch(hitCoin.modal) {
        case 'education':
          setIsEducationModalOpen(true);
          break;
        case 'corporate1':
          setIsCorporate1ModalOpen(true);
          break;
        case 'corporate2':
          setIsCorporate2ModalOpen(true);
          break;
        case 'yarnBall':
          setIsYarnBallModalOpen(true);
          break;
      }
      return true; // Return true if collision detected
    }
    return false;
  };

  const handleJumpClick = () => {
    if (!isJumping) {
      playJumpSound();
      
      // Create jump particles
      const viewportWidth = window.innerWidth;
      const charScreenX = (characterScreenPositionRef.current / 100) * viewportWidth;
      createParticles(charScreenX, window.innerHeight - 125, 'jump'); // Character bottom position
      
      setIsJumping(true);
      // Small delay to ensure state has updated before checking collision
      setTimeout(() => {
        // Check for coin collision multiple times during jump to catch the intersection
        let collisionDetected = false;
        const checkInterval = setInterval(() => {
          // Get latest values from refs
          const currentPos = positionRef.current;
          const currentCharPos = characterScreenPositionRef.current;
          // Only check if we haven't detected a collision yet
          if (!collisionDetected) {
            collisionDetected = checkCoinCollision(currentPos, currentCharPos, explodedCoins);
            if (collisionDetected) {
              clearInterval(checkInterval);
            }
          }
        }, 50); // Check every 50ms during jump
        
        // Stop checking after jump completes
        setTimeout(() => {
          clearInterval(checkInterval);
          setIsJumping(false);
        }, 450); // 500ms total - 50ms initial delay
      }, 50);
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

  const handleEducationCloseModal = () => {
    setIsEducationModalOpen(false);
  };

  const handleCorporate1CloseModal = () => {
    setIsCorporate1ModalOpen(false);
  };

  const handleCorporate2CloseModal = () => {
    setIsCorporate2ModalOpen(false);
  };

  const handleYarnBallCloseModal = () => {
    setIsYarnBallModalOpen(false);
  };

  const handleCorporate1BuildingClick = () => {
    setIsCorporate1ModalOpen(true);
  };

  const handleCorporate2BuildingClick = () => {
    setIsCorporate2ModalOpen(true);
  };

  const handleEducationBuildingClick = () => {
    setIsEducationModalOpen(true);
  };

  const handleInstagramRedirect = () => {
    window.open('https://www.instagram.com/crosetele_irinei', '_blank');
  };

  const handleLinkedInRedirect = () => {
    window.open('https://www.linkedin.com/in/irina-vasilescu', '_blank');
  };

  const handleGmailRedirect = () => {
    window.open('mailto:irinavasilescu@gmail.com', '_blank');
  };

  const handleWebsiteRedirect = () => {
    window.open('https://croseteleirinei.com', '_blank');
  };

  const handleYarnBallClick = () => {
    setIsYarnBallModalOpen(true);
  };

  return (
    <div className="game-wrapper">
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
        <div className="earth-container" onClick={handleEarthClick}>
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
              <div className="abilities-description">
                <p>Experienced Frontend Team Leader and Frontend Developer with 5+ years of experience in web development. Proficient in Agile methodologies, I guide my colleagues to implement best practices, adhere to high-quality coding standards, and ensure seamless collaboration between frontend, backend and UX/UI teams.</p>
              </div>
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
              <h2>Socials</h2>
              <div className="social-item">
                <button className="social-button instagram" onClick={handleInstagramRedirect}>
                  Instagram
                </button>
              </div>
              <div className="social-item">
                <button className="social-button linkedin" onClick={handleLinkedInRedirect}>
                  LinkedIn
                </button>
              </div>
              <div className="social-item">
                <button className="social-button gmail" onClick={handleGmailRedirect}>
                  Gmail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEducationModalOpen && (
        <div className="modal-overlay" onClick={handleEducationCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleEducationCloseModal}>×</button>
            <div className="modal-content education">
              <h2>EDUCATION</h2>
              <div className="education-item">
                <h3>Bachelor's Degree in Computer Science</h3>
                <p>University Politehnica of Bucharest</p>
                <p>09/2016 - 07/2020, Romania</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCorporate1ModalOpen && (
        <div className="modal-overlay" onClick={handleCorporate1CloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCorporate1CloseModal}>×</button>
            <div className="modal-content corporate1">
              <h2>WORK EXPERIENCE</h2>
              <div className="job-item">
                <h3>Frontend Developer</h3>
                <p>Bitdefender</p>
                <p>10/2019 - 05/2021</p>
                <p>Bucharest, Romania</p>
                <p>Used TypeScript and Angular to convert specifications into maintainable, testable, and scalable code, focusing on consumer-facing features such as subscriptions, invoices, device management</p>
                <p>Developed reusable components using Angular, HTML and CSS, then seamlessly integrating them into the existing project architecture</p>
                <p>Wrote unit tests using the Jasmine testing framework to ensure robust and reliable code</p>
                <p>Managed HTTP requests, facilitated data sharing between components</p>
                <p>Implemented data caching using RxJS for efficient and reactive data handling</p>
                <p>Integrated external SDKs to enable key functionalities, including payment method management, billing information access, invoice handling and auto-renewal service control</p>
              </div>
              <div className="job-item">
                <h3>Junior Software Developer in Test</h3>
                <p>Bitdefender</p>
                <p>07/2019 - 10/2019</p>
                <p>Bucharest, Romania</p>
                <p>Developed automated tests in Java within Android Studio</p>
                <p>Created Python and bash scripts to schedule test executions at specified times</p>
                <p>Wrote Python scripts for sending test results to various endpoints like TestRail, Slack and generating detailed statistics</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCorporate2ModalOpen && (
        <div className="modal-overlay" onClick={handleCorporate2CloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCorporate2CloseModal}>×</button>
            <div className="modal-content corporate2">
              <h2>WORK EXPERIENCE</h2>
              <div className="job-item">
                <h3>Technical Team Leader</h3>
                <p>eMAG</p>
                <p>11/2021 - Present</p>
                <p>Bucharest, Romania</p>
                <p>Responsible for leading a team of 9 frontend developers in the development and deployment of e-commerce web applications</p>
                <p>Foster an environment focused on achievement while supporting professional development by setting clear team and individual objectives</p>
                <p>Give constructive feedback and identify growth opportunities for team members during performance reviews</p>
                <p>Ensure alignment and smooth workflow by actively participating in SCRUM ceremonies, such as sprint planning, sprint refinement, one-on-one meetings and daily stand-ups</p>
                <p>Contribute to the recruitment of frontend developers and QA analysts by conducting interviews, making sure they fit the team culture and technical requirements</p>
                <p>Enhance code quality and system reliability by addressing issues raised by SonarQube and Sentry</p>
                <p>Ensure intuitive and consistent user interfaces by collaborating with the UX/UI team, using Figma</p>
              </div>
              <div className="job-item">
                <h3>Frontend Developer</h3>
                <p>eMAG</p>
                <p>05/2021 - Present</p>
                <p>Bucharest, Romania</p>
                <p>Lead the implementation of micro-frontend projects using Angular, Angular Material, SCSS, RxJS, and Apollo Client, ensuring a modular and scalable architecture that enables sellers to efficiently manage campaigns, orders, products, ads and opportunities</p>
                <p>Developed reusable components for use across multiple micro-frontend interfaces</p>
                <p>Ensured consistency and improved efficiency throughout the application by integrating these components seamlessly</p>
                <p>Used Mirage JS to mock APIs, facilitating smooth development and testing without relying on real backend services</p>
                <p>Wrote and maintained automated tests using Cypress</p>
                <p>Wrote comprehensive unit tests using the Jasmine testing framework</p>
                <p>Took ownership of maintaining and enhancing an existing VueJS micro-frontend project</p>
                <p>Utilized the CI/CD pipeline to monitor builds, unit tests, and end-to-end tests, ensuring higher quality and reliability throughout the development process</p>
                <p>Collaborated closely with the support team to troubleshoot and resolve client-facing issues, providing technical expertise to ensure customer satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isYarnBallModalOpen && (
        <div className="modal-overlay" onClick={handleYarnBallCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleYarnBallCloseModal}>×</button>
            <div className="modal-content yarn-ball">
              <h2>MY CROCHET JOURNEY</h2>
              <div className="instagram-item">
                <img src={bearImage} alt="Bear" className="bear-image" />
                <h3>Follow my creative journey</h3>
                <p>Check out my crochet projects and other creative endeavors!</p>
                <button className="instagram-button" onClick={handleInstagramRedirect}>
                  Visit Instagram
                </button>
                <button className="instagram-button" onClick={handleWebsiteRedirect}>
                  Visit Website
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="audio-controls">
        <button 
          className={`audio-control ${isMusicMuted ? 'muted' : ''}`}
          onClick={toggleAudio}
        >
          {isMusicMuted ? 'MUSIC OFF' : 'MUSIC ON'}
        </button>
        <button 
          className={`audio-control sound-control ${isSoundMuted ? 'muted' : ''}`}
          onClick={toggleSoundEffects}
        >
          {isSoundMuted ? 'SOUND OFF' : 'SOUND ON'}
        </button>
      </div>

      <div className="game-title">
        A frontend developer's <br /> adventures in the wild
      </div>

      <div 
        className="game-container" 
        ref={gameContainerRef}
        style={{ transform: `translateX(-${position}px)` }}
      >
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
        onClick={handleEducationBuildingClick}
      ></div>

      <div
        className={`coin coin-education ${explodingCoins.has('education') ? 'exploding' : ''} ${explodedCoins.has('education') ? 'exploded' : ''}`}
        style={{ left: '285px' }}
      >
        {explodingCoins.has('education') && <div className="explosion"></div>}
      </div>

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
        className="corporate1-building"
        style={{ left: '600px' }}
        onClick={handleCorporate1BuildingClick}
      ></div>

      <div
        className={`coin coin-corporate1 ${explodingCoins.has('corporate1') ? 'exploding' : ''} ${explodedCoins.has('corporate1') ? 'exploded' : ''}`}
        style={{ left: '685px' }}
      >
        {explodingCoins.has('corporate1') && <div className="explosion"></div>}
      </div>

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
        className="corporate2-building"
        style={{ left: '1100px' }}
        onClick={handleCorporate2BuildingClick}
      ></div>

      <div
        className={`coin coin-corporate2 ${explodingCoins.has('corporate2') ? 'exploding' : ''} ${explodedCoins.has('corporate2') ? 'exploded' : ''}`}
        style={{ left: '1185px' }}
      >
        {explodingCoins.has('corporate2') && <div className="explosion"></div>}
      </div>

      <div
        className="crochet"
        style={{ left: '1350px' }}
        onClick={handleYarnBallClick}
      ></div>

      <div
        className={`coin coin-yarn ${explodingCoins.has('yarnBall') ? 'exploding' : ''} ${explodedCoins.has('yarnBall') ? 'exploded' : ''}`}
        style={{ left: '1385px' }}
      >
        {explodingCoins.has('yarnBall') && <div className="explosion"></div>}
      </div>

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

      <div className="ground"></div>
      </div>

      <div
        className={`character ${isJumping ? 'jump' : ''} ${direction === 'left' ? 'face-left' : ''}`}
        style={{ left: `${characterScreenPosition}%` }}
      >
      </div>

      {/* Particle effects */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`particle particle-${particle.type}`}
          style={{
            left: `${particle.x}px`,
            bottom: `${window.innerHeight - particle.y}px`,
            opacity: particle.life,
          }}
        />
      ))}

      {showPortalDialogue && (
        <div 
          className="dialogue-bubble portal-dialogue"
          style={{ 
            bottom: '200px',
            left: `${portalDialogueLeft}px`
          }}
        >
          <div className="dialogue-content">
            Who knows what the future might bring?
          </div>
        </div>
      )}

      <div className="control-buttons">
        <button className="control-button" onClick={handleLeftClick}>
          {isSmallScreen ? '←' : 'A'}
        </button>
        <button className="control-button" onClick={handleJumpClick}>
          {isSmallScreen ? '↑' : 'W'}
        </button>
        <button className="control-button" onClick={handleRightClick}>
          {isSmallScreen ? '→' : 'D'}
        </button>
      </div>
    </div>
  );
};

export default Game; 