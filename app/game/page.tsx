"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
const MIA_URL = "https://kouman.net/wp-content/uploads/2025/08/Mia-1024x1024.webp";
const KOUROSH_URL = "https://kouman.net/wp-content/uploads/2025/08/kourosh-1024x1024.webp";
const IMAN_URL = "https://kouman.net/wp-content/uploads/2025/08/Iman-1024x1024.webp";

const DESKTOP_WIDTH = 800;
const DESKTOP_HEIGHT = 500;
const MOBILE_TARGET_WIDTH = 420;
const MOBILE_TARGET_HEIGHT = 650;
const BREAKPOINT = 768;

const CATCHER_SIZE = 80;
const ICON_SIZE = 45;
const INITIAL_FALL_SPEED = 2.0;
const MAX_ICONS = 6;
const SPAWN_DELAY_MS = 1000;
const INITIAL_LIVES = 3;
const DIFFICULTY_INCREASE_INTERVAL = 20000;
const SPEED_INCREMENT = 0.5;

const getRandom = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const getNextIconType = () => getRandom(0, 1) === 0 ? 'MIA' : 'KOUROSH';

type FallingIcon = { 
    id: number; 
    x: number; 
    y: number; 
    type: 'MIA' | 'KOUROSH'; 
};

interface IconProps {
    icon: FallingIcon;
    isMunching: boolean;
}

interface GameState {
    fallingIcons: FallingIcon[];
    totalCaught: number;
    lives: number;
    isStarted: boolean;
    isGameOver: boolean;
    currentSpeed: number;
}

const HeartIcon = ({ className }: { className: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.85 0-3.52 1.09-4.5 2.72C10.52 4.09 8.85 3 7 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>);
const ZapIcon = ({ className }: { className: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const ChevronsUpIcon = ({ className }: { className: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>);
const RefreshCcwIcon = ({ className }: { className: string }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>);

const IconDisplay = ({ icon, isMunching }: IconProps) => {
  const iconSrc = icon.type === 'MIA' ? MIA_URL : KOUROSH_URL;
  const altText = icon.type === 'MIA' ? 'Mia Placeholder' : 'Kourosh Placeholder';
  
  const scaleClass = isMunching ? 'scale-125 rotate-6' : 'scale-100 rotate-0';

  return (
    <div
      className={`absolute transition-all duration-75 ease-out rounded-full shadow-lg overflow-hidden ${scaleClass}`}
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE,
        left: icon.x,
        top: icon.y,
        transitionProperty: 'none',
      }}
    >
      <img 
        src={iconSrc} 
        alt={altText} 
        width={ICON_SIZE} 
        height={ICON_SIZE} 
        className="rounded-full object-cover w-full h-full" 
      />
    </div>
  );
};

const Catcher = ({ catcherX, isMunching }: { catcherX: number; isMunching: boolean }) => {
  const munchClass = isMunching ? 'scale-110 border-green-300' : 'scale-100 border-yellow-500';

  return (
    <div
      className={`absolute z-10 rounded-full shadow-2xl border-4 overflow-hidden 
                  transition-transform duration-150 ease-out 
                  ${munchClass}`}
      style={{
        width: CATCHER_SIZE,
        height: CATCHER_SIZE,
        left: catcherX, 
        bottom: 0,
      }}
    >
      <img 
        src={IMAN_URL}
        alt="Iman Catcher Placeholder" 
        width={CATCHER_SIZE} 
        height={CATCHER_SIZE} 
        className="rounded-full object-cover w-full h-full"
      />
    </div>
  );
};

export default function CatchTheIconGame() {
  const [gameDimensions, setGameDimensions] = useState<{ width: number, height: number }>({
    width: DESKTOP_WIDTH,
    height: DESKTOP_HEIGHT,
  });
  
  const initialCatcherX = DESKTOP_WIDTH / 2 - CATCHER_SIZE / 2;
  const [catcherX, setCatcherX] = useState<number>(initialCatcherX);
  
  const targetCatcherXRef = useRef<number>(initialCatcherX);

  const [game, setGame] = useState<GameState>({
    fallingIcons: [],
    totalCaught: 0,
    lives: INITIAL_LIVES,
    isStarted: false,
    isGameOver: false,
    currentSpeed: INITIAL_FALL_SPEED,
  });
  
  const [isMunching, setIsMunching] = useState<boolean>(false);
  
  const animationFrameRef = useRef<number | null>(null);
  const lastIconId = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const adjustDimensions = useCallback(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth < BREAKPOINT;
    
    let newWidth: number, newHeight: number;

    if (isMobile) {
      newWidth = Math.min(window.innerWidth * 0.95, MOBILE_TARGET_WIDTH);
      const mobileRatio = MOBILE_TARGET_HEIGHT / MOBILE_TARGET_WIDTH;
      newHeight = newWidth * mobileRatio;

    } else {
      newWidth = DESKTOP_WIDTH;
      newHeight = DESKTOP_HEIGHT;
    }

    setGameDimensions(prevDims => {
      if (prevDims.width !== newWidth || prevDims.height !== newHeight) {
          
          const clampedX = Math.max(0, Math.min(newWidth - CATCHER_SIZE, catcherX));
          
          if (!game.isStarted || game.isGameOver) {
              const newX = newWidth / 2 - CATCHER_SIZE / 2;
              setCatcherX(newX);
              targetCatcherXRef.current = newX;
          } else {
              setCatcherX(clampedX);
              targetCatcherXRef.current = clampedX;
          }

          return { width: newWidth, height: newHeight };
      }
      return prevDims;
    });
  }, [game.isStarted, game.isGameOver, catcherX]);
  
  useEffect(() => {
    adjustDimensions();
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', adjustDimensions);
        return () => window.removeEventListener('resize', adjustDimensions);
    }
  }, [adjustDimensions]);

  const { width: currentW, height: currentH } = gameDimensions;

  const updateGameLogic = useCallback((currentTime: number) => {
    if (!game.isStarted || game.isGameOver) {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        return;
    }
    
    const newCatcherX = targetCatcherXRef.current;
    setCatcherX(newCatcherX);

    let iconsCaughtThisFrame = 0;
    const nextIcons: FallingIcon[] = [];
    let newLives = game.lives;

    const catcherLeft = newCatcherX;
    const catcherRight = newCatcherX + CATCHER_SIZE;
    const catcherTop = currentH - CATCHER_SIZE;
    const catcherBottom = currentH;

    for (const icon of game.fallingIcons) {
      const nextY = icon.y + game.currentSpeed;

      const isColliding = (
        icon.x < catcherRight &&
        icon.x + ICON_SIZE > catcherLeft &&
        nextY < catcherBottom &&
        nextY + ICON_SIZE > catcherTop
      );

      if (isColliding) {
        iconsCaughtThisFrame++;
      } 
      else if (nextY > currentH) {
        newLives = Math.max(0, newLives - 1); 
      } 
      else {
        icon.y = nextY;
        nextIcons.push(icon);
      }
    }

    if (nextIcons.length < MAX_ICONS && currentTime - lastSpawnTime.current > SPAWN_DELAY_MS) {
        lastIconId.current += 1;
        const newIcon: FallingIcon = {
            id: lastIconId.current,
            x: getRandom(0, currentW - ICON_SIZE),
            y: -ICON_SIZE,
            type: getNextIconType(),
        };
        nextIcons.push(newIcon);
        lastSpawnTime.current = currentTime;
    }

    if (iconsCaughtThisFrame > 0) {
      setIsMunching(true);
      setTimeout(() => setIsMunching(false), 150);
    }
    
    setGame(prevGame => ({
      ...prevGame,
      fallingIcons: nextIcons,
      totalCaught: prevGame.totalCaught + iconsCaughtThisFrame,
      lives: newLives,
      isGameOver: newLives === 0,
    }));
    
    if (newLives > 0) {
        animationFrameRef.current = requestAnimationFrame(updateGameLogic);
    }

  }, [game.isStarted, game.isGameOver, game.fallingIcons, game.lives, game.currentSpeed, currentW, currentH]);

  useEffect(() => {
    if (game.isStarted && !game.isGameOver) {
      animationFrameRef.current = requestAnimationFrame(updateGameLogic);
    }
    
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [game.isStarted, game.isGameOver, updateGameLogic]);
  
  useEffect(() => {
    let difficultyTimer: NodeJS.Timeout | undefined;
    if (game.isStarted && !game.isGameOver) {
      difficultyTimer = setInterval(() => {
        setGame(prevGame => ({
            ...prevGame,
            currentSpeed: prevGame.currentSpeed + SPEED_INCREMENT,
        }));
      }, DIFFICULTY_INCREASE_INTERVAL);
    }
    return () => { if (difficultyTimer) clearInterval(difficultyTimer); };
  }, [game.isStarted, game.isGameOver]);


  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!game.isStarted || game.isGameOver || !gameContainerRef.current) return;

    const isTouch = 'touches' in e;
    const clientX = isTouch ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const rect = gameContainerRef.current.getBoundingClientRect();
    
    let newCatcherX = clientX - rect.left - CATCHER_SIZE / 2;
    newCatcherX = Math.max(0, Math.min(currentW - CATCHER_SIZE, newCatcherX));

    targetCatcherXRef.current = newCatcherX;
  };

  const startGame = () => {
    const initialCatcherX = currentW / 2 - CATCHER_SIZE / 2;
    setCatcherX(initialCatcherX);
    targetCatcherXRef.current = initialCatcherX;

    lastIconId.current = 0;
    lastSpawnTime.current = 0;
    setGame({
      fallingIcons: [],
      totalCaught: 0,
      lives: INITIAL_LIVES,
      isStarted: true,
      isGameOver: false,
      currentSpeed: INITIAL_FALL_SPEED,
    });
  };

  const renderGameStatus = () => (
    <div className="mt-6 w-full max-w-lg flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-800 rounded-xl shadow-2xl space-y-3 sm:space-y-0">
      <div className="flex items-center text-red-400 font-bold text-xl sm:text-2xl">
        <HeartIcon className="w-6 h-6 ml-2 fill-red-400" />
        جان: <span className="mr-2 text-3xl">{game.lives}</span>
      </div>
      <div className="flex items-center text-yellow-400 font-bold text-xl sm:text-2xl">
        <ZapIcon className="w-6 h-6 ml-2" />
        گرفته شده: <span className="mr-2 text-3xl">{game.totalCaught}</span>
      </div>
      <div className="flex items-center text-blue-400 font-bold text-lg sm:text-xl">
        <ChevronsUpIcon className="w-5 h-5 ml-1" />
        سرعت: <span className="mr-1 text-2xl">{game.currentSpeed.toFixed(1)}</span>
      </div>
    </div>
  );

  const renderStartOverlay = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-20 p-4">
      <h2 className="text-4xl sm:text-6xl font-black mb-4 sm:mb-6 text-yellow-400 animate-pulse text-right" dir="rtl">
        {game.isGameOver ? 'بازی تمام شد!' : 'آماده برای تغذیه؟'}
      </h2>
      <p className="text-base sm:text-xl text-gray-200 mb-6 sm:mb-8 text-right">
        {game.isGameOver 
          ? `شما ${game.totalCaught} بار به ایمان غذا دادید!`
          : 'ایمان را حرکت دهید تا میا و کوروش را بخورد.'}
      </p>
      <button
        onClick={startGame}
        className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-full text-xl sm:text-2xl shadow-lg transform transition-all hover:scale-105"
      >
        {game.isGameOver ? 'شروع مجدد' : 'شروع جنون تغذیه'} 
        <RefreshCcwIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 font-sans text-right">
      <h1 className="text-4xl sm:text-6xl font-black mb-5 p-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-950 to-teal-950 drop-shadow-lg text-center">
        چالش سیر کردن ایمان
      </h1>

      <div
        ref={gameContainerRef}
        className="relative border-8 border-gray-700 rounded-2xl shadow-2xl overflow-hidden bg-gray-950 touch-none cursor-pointer"
        style={{ width: currentW, height: currentH }}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
      >
        {game.fallingIcons.map(icon => (
          <IconDisplay
            key={icon.id}
            icon={icon}
            isMunching={isMunching}
          />
        ))}

        <Catcher catcherX={catcherX} isMunching={isMunching} />

        {(!game.isStarted || game.isGameOver) && renderStartOverlay()}
      </div>

      {game.isStarted && renderGameStatus()}

      <p className="mt-8 text-gray-700 text-sm max-w-lg text-center">
        **توجه:** سرعت بازی هر {DIFFICULTY_INCREASE_INTERVAL / 1000} ثانیه افزایش می‌یابد. اگر یک آیکون را از دست بدهید، یک جان کم می‌شود!
      </p>
    </div>
  );
}
