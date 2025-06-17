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

  // Modals
  const [isAbilitiesModalOpen, setIsAbilitiesModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isLanguagesModalOpen, setIsLanguagesModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isCorporate1ModalOpen, setIsCorporate1ModalOpen] = useState(false);
  const [isCorporate2ModalOpen, setIsCorporate2ModalOpen] = useState(false);

  const gameContainerRef = useRef(null);
  const audioRef = useRef(null);

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
      if (event.key === 'd' || event.key === 'D') {
        setPosition(prev => {
          const newPosition = prev + 20;
          const characterOffset = newPosition;
          const visibleScreenWidth = window.innerWidth;
          const scrollThreshold = visibleScreenWidth / 2;

          if (characterOffset >= scrollThreshold) {
            window.scrollBy(20, 0);
          }

          // Check if character reaches upb
          if (newPosition >= 200 && newPosition < 220) {
            setIsEducationModalOpen(true);
          }

          // Check if character reaches corporate1
          if (newPosition >= 620 && newPosition < 640) {
            setIsCorporate1ModalOpen(true);
          }

          // Check if character reaches corporate2
          if (newPosition >= 1100 && newPosition < 1120) {
            setIsCorporate2ModalOpen(true);
          }

          return newPosition;
        });
        setDirection('right');
      }

      if (event.key === 'a' || event.key === 'A') {
        setPosition(prev => {
          const newPosition = prev - 20;
          const characterOffset = newPosition;
          const visibleScreenWidth = window.innerWidth;
          const scrollThreshold = visibleScreenWidth / 2;

          if (characterOffset >= scrollThreshold) {
            window.scrollBy(-20, 0);
          }

          // Check if character reaches upb
          if (newPosition >= 200 && newPosition < 220) {
            setIsEducationModalOpen(true);
          }

          // Check if character reaches corporate1
          if (newPosition >= 620 && newPosition < 640) {
            setIsCorporate1ModalOpen(true);
          }

          // Check if character reaches corporate2
          if (newPosition >= 1100 && newPosition < 1120) {
            setIsCorporate2ModalOpen(true);
          }

          return newPosition;
        });
        setDirection('left');
      }
      
      if ((event.key === 'w' || event.key === 'W') && !isJumping) {
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJumping]);

  const handleLeftClick = () => {
    setPosition(prev => {
      const newPosition = prev - 20;
      
      // Check if character reaches upb
      if (newPosition >= 200 && newPosition < 220) {
        setIsEducationModalOpen(true);
      }
      
      // Check if character reaches corporate1
      if (newPosition >= 620 && newPosition < 640) {
        setIsCorporate1ModalOpen(true);
      }
      
      // Check if character reaches corporate2
      if (newPosition >= 1100 && newPosition < 1120) {
        setIsCorporate2ModalOpen(true);
      }
      
      return newPosition;
    });
    setDirection('left');
  };

  const handleRightClick = () => {
    setPosition(prev => {
      const newPosition = prev + 20;
      
      // Check if character reaches upb
      if (newPosition >= 200 && newPosition < 220) {
        setIsEducationModalOpen(true);
      }
      
      // Check if character reaches corporate1
      if (newPosition >= 620 && newPosition < 640) {
        setIsCorporate1ModalOpen(true);
      }
      
      // Check if character reaches corporate2
      if (newPosition >= 1100 && newPosition < 1120) {
        setIsCorporate2ModalOpen(true);
      }
      
      return newPosition;
    });
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

  const handleEducationCloseModal = () => {
    setIsEducationModalOpen(false);
  };

  const handleCorporate1CloseModal = () => {
    setIsCorporate1ModalOpen(false);
  };

  const handleCorporate2CloseModal = () => {
    setIsCorporate2ModalOpen(false);
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
        className="corporate1-building"
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
        className="corporate2-building"
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
          A
        </button>
        <button className="control-button" onClick={handleJumpClick}>
          W
        </button>
        <button className="control-button" onClick={handleRightClick}>
          D
        </button>
      </div>
    </div>
  );
};

export default Game; 