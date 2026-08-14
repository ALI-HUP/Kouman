"use client";

import { useState, useEffect, useRef, useCallback, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  initAudio,
  loadMuted,
  setMuted,
  playCatch,
  playMiss,
  playTick,
  playStart,
  playGameOver,
} from "@/lib/sounds";

const MIA_URL = "/game/mia.png";
const KOUROSH_URL = "/game/kourosh.png";
const IMAN_URL = "/game/iman.png";

const DESKTOP_WIDTH = 800;
const DESKTOP_HEIGHT = 500;
const MOBILE_TARGET_WIDTH = 420;
const MOBILE_TARGET_HEIGHT = 650;
const BREAKPOINT = 768;

const CATCHER_SIZE = 80;
const ICON_SIZE = 45;
const INITIAL_FALL_SPEED = 2.0;
const MAX_SPEED = 8.5;
const MAX_ICONS = 6;
const SPAWN_DELAY_MS = 1000;
const MIN_SPAWN_DELAY = 500;
const INITIAL_LIVES = 3;
const DIFFICULTY_INCREASE_INTERVAL = 20000;
const SPEED_INCREMENT = 0.5;
const EFFECT_TTL = 1200;

const getRandom = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getNextIconType = () => (getRandom(0, 1) === 0 ? "MIA" : "KOUROSH");
const fa = (n: number) => n.toLocaleString("fa-IR");

type Phase = "idle" | "countdown" | "playing" | "paused" | "over";

type FallingIcon = { id: number; x: number; y: number; type: "MIA" | "KOUROSH" };

type EffectKind = "burst" | "popup" | "heart" | "flash";
type Particle = { dx: number; dy: number; emoji: string; delay: number };
type Effect = {
  id: number;
  kind: EffectKind;
  createdAt: number;
  x?: number;
  y?: number;
  text?: string;
  particles?: Particle[];
};

interface GameState {
  icons: FallingIcon[];
  lives: number;
  caught: number;
  speed: number;
  phase: Phase;
  countdown: number;
  munchUntil: number;
  lastSpawnAt: number;
  speedUpAt: number;
  countdownEndsAt: number;
}

interface ViewState {
  phase: Phase;
  icons: FallingIcon[];
  catcherX: number;
  lives: number;
  caught: number;
  speed: number;
  countdown: number;
  munching: boolean;
  effects: Effect[];
}

const CATCH_EMOJIS = ["✨", "🍕", "🍔", "🌟"];
const randomCatchEmoji = () => CATCH_EMOJIS[getRandom(0, CATCH_EMOJIS.length - 1)];

const initialGameState = (): GameState => ({
  icons: [],
  lives: INITIAL_LIVES,
  caught: 0,
  speed: INITIAL_FALL_SPEED,
  phase: "idle",
  countdown: 3,
  munchUntil: 0,
  lastSpawnAt: 0,
  speedUpAt: 0,
  countdownEndsAt: 0,
});

const HeartIcon = ({ className }: { className: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.85 0-3.52 1.09-4.5 2.72C10.52 4.09 8.85 3 7 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);
const ZapIcon = ({ className }: { className: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const ChevronsUpIcon = ({ className }: { className: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
);
const RefreshCcwIcon = ({ className }: { className: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);
const PlayIcon = ({ className }: { className: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
);

const IconDisplay = ({ icon }: { icon: FallingIcon }) => {
  const iconSrc = icon.type === "MIA" ? MIA_URL : KOUROSH_URL;
  const altText = icon.type === "MIA" ? "Mia" : "Kourosh";

  return (
    <div
      className="absolute z-10 rounded-full shadow-lg overflow-hidden"
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE,
        left: icon.x,
        top: icon.y,
      }}
    >
      <img
        src={iconSrc}
        alt={altText}
        width={ICON_SIZE}
        height={ICON_SIZE}
        className="rounded-full object-cover w-full h-full pointer-events-none"
      />
    </div>
  );
};

const Catcher = ({ catcherX, isMunching }: { catcherX: number; isMunching: boolean }) => {
  const munchClass = isMunching ? "scale-110 border-green-300" : "scale-100 border-yellow-500";

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
        alt="Iman Catcher"
        width={CATCHER_SIZE}
        height={CATCHER_SIZE}
        className="rounded-full object-cover w-full h-full pointer-events-none"
      />
    </div>
  );
};

const EffectNode = ({ effect }: { effect: Effect }) => {
  if (effect.kind === "flash") {
    return <span className="animate-red-flash absolute inset-0 z-20 pointer-events-none" />;
  }

  if (effect.kind === "burst") {
    return (
      <div className="absolute" style={{ left: effect.x, top: effect.y }}>
        {effect.particles?.map((particle, i) => (
          <span
            key={i}
            className="animate-particle absolute text-lg"
            style={
              {
                "--dx": `${particle.dx}px`,
                "--dy": `${particle.dy}px`,
                animationDelay: `${particle.delay}s`,
              } as CSSProperties
            }
          >
            {particle.emoji}
          </span>
        ))}
      </div>
    );
  }

  return (
    <span
      className={`absolute text-xl font-black animate-score-popup ${
        effect.kind === "heart" ? "text-red-500" : "text-yellow-300"
      }`}
      style={{ left: effect.x, top: effect.y }}
    >
      {effect.text}
    </span>
  );
};

export default function CatchTheIconGame() {
  const [dimensions, setDimensions] = useState({ width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT });
  const [muted, setMutedState] = useState(false);
  const shakeControls = useAnimation();

  const [view, setView] = useState<ViewState>(() => ({
    phase: "idle",
    icons: [],
    catcherX: DESKTOP_WIDTH / 2 - CATCHER_SIZE / 2,
    lives: INITIAL_LIVES,
    caught: 0,
    speed: INITIAL_FALL_SPEED,
    countdown: 3,
    munching: false,
    effects: [],
  }));

  // Loop-owned mutable state — never appears in effect dependency arrays.
  const stateRef = useRef<GameState>(initialGameState());
  const catcherXRef = useRef(DESKTOP_WIDTH / 2 - CATCHER_SIZE / 2);
  const targetCatcherXRef = useRef(DESKTOP_WIDTH / 2 - CATCHER_SIZE / 2);
  const lastFrameTimeRef = useRef(0);
  const lastIconIdRef = useRef(0);
  const effectIdRef = useRef(0);
  const effectsRef = useRef<Effect[]>([]);
  const dimensionsRef = useRef({ w: DESKTOP_WIDTH, h: DESKTOP_HEIGHT });
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // ---- The game loop: one stable rAF chain, reads/writes refs only ----
  const tick = useCallback(
    (now: number) => {
      const s = stateRef.current;
      const { w, h } = dimensionsRef.current;

      if (s.phase === "countdown") {
        const value = Math.max(1, Math.ceil((s.countdownEndsAt - now) / 1000));
        if (value !== s.countdown) {
          s.countdown = value;
          playTick();
        }
        if (now >= s.countdownEndsAt) {
          s.phase = "playing";
          s.lastSpawnAt = now;
          s.speedUpAt = now + DIFFICULTY_INCREASE_INTERVAL;
          lastFrameTimeRef.current = now;
          playStart();
        }
        setView({
          phase: s.phase,
          icons: s.icons,
          catcherX: catcherXRef.current,
          lives: s.lives,
          caught: s.caught,
          speed: s.speed,
          countdown: s.countdown,
          munching: false,
          effects: [],
        });
        return;
      }

      if (s.phase !== "playing") return;

      const dt = Math.min(Math.max((now - lastFrameTimeRef.current) / 16.67, 0), 2);
      lastFrameTimeRef.current = now;

      // Catcher smoothly follows the pointer target (frame-rate independent).
      catcherXRef.current +=
        (targetCatcherXRef.current - catcherXRef.current) * (1 - Math.pow(0.45, dt));

      // Difficulty ramps up every interval but never passes the cap.
      if (now >= s.speedUpAt && s.speed < MAX_SPEED) {
        s.speed = Math.min(MAX_SPEED, s.speed + SPEED_INCREMENT);
        s.speedUpAt = now + DIFFICULTY_INCREASE_INTERVAL;
      }
      const spawnDelay = Math.max(
        MIN_SPAWN_DELAY,
        SPAWN_DELAY_MS - (s.speed - INITIAL_FALL_SPEED) * 100
      );

      const catcherLeft = catcherXRef.current;
      const catcherRight = catcherXRef.current + CATCHER_SIZE;
      const catcherTop = h - CATCHER_SIZE;
      const catcherBottom = h;

      const nextIcons: FallingIcon[] = [];
      for (const icon of s.icons) {
        const y = icon.y + s.speed * dt;

        const isColliding =
          icon.x < catcherRight &&
          icon.x + ICON_SIZE > catcherLeft &&
          y < catcherBottom &&
          y + ICON_SIZE > catcherTop;

        if (isColliding) {
          s.caught += 1;
          s.munchUntil = now + 150;

          effectsRef.current.push({
            id: ++effectIdRef.current,
            kind: "burst",
            createdAt: now,
            x: catcherXRef.current + CATCHER_SIZE / 2,
            y: catcherTop,
            particles: Array.from({ length: 10 }, () => ({
              dx: getRandom(-70, 70),
              dy: getRandom(-90, -10),
              emoji: randomCatchEmoji(),
              delay: getRandom(0, 60) / 1000,
            })),
          });
          effectsRef.current.push({
            id: ++effectIdRef.current,
            kind: "popup",
            createdAt: now,
            x: icon.x + ICON_SIZE / 2,
            y: y - 10,
            text: "+۱",
          });
          playCatch();
        } else if (y > h) {
          s.lives = Math.max(0, s.lives - 1);
          effectsRef.current.push({
            id: ++effectIdRef.current,
            kind: "flash",
            createdAt: now,
          });
          effectsRef.current.push({
            id: ++effectIdRef.current,
            kind: "heart",
            createdAt: now,
            x: catcherXRef.current + CATCHER_SIZE / 2,
            y: catcherTop - 30,
            text: "💔",
          });
          shakeControls.start({
            x: [0, -12, 12, -8, 8, 0],
            y: [0, 6, -6, 4, -4, 0],
            transition: { duration: 0.4 },
          });
          playMiss();
          if (s.lives === 0) {
            s.phase = "over";
            playGameOver();
          }
        } else {
          nextIcons.push({ ...icon, y });
        }
      }
      s.icons = nextIcons;

      if (s.phase === "playing" && s.icons.length < MAX_ICONS && now - s.lastSpawnAt > spawnDelay) {
        s.icons.push({
          id: ++lastIconIdRef.current,
          x: getRandom(0, w - ICON_SIZE),
          y: -ICON_SIZE,
          type: getNextIconType(),
        });
        s.lastSpawnAt = now;
      }

      effectsRef.current = effectsRef.current.filter((e) => now - e.createdAt < EFFECT_TTL);

      setView({
        phase: s.phase,
        icons: s.icons,
        catcherX: catcherXRef.current,
        lives: s.lives,
        caught: s.caught,
        speed: s.speed,
        countdown: s.countdown,
        munching: now < s.munchUntil,
        effects: [...effectsRef.current],
      });
    },
    [shakeControls]
  );

  // Single rAF chain per phase — restarts only on phase transitions.
  useEffect(() => {
    if (view.phase !== "countdown" && view.phase !== "playing") return;
    let raf = 0;
    const loop = (t: number) => {
      tick(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [view.phase, tick]);

  // Stable resize listener — reads refs only.
  useEffect(() => {
    const adjust = () => {
      if (typeof window === "undefined") return;

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

      dimensionsRef.current = { w: newWidth, h: newHeight };
      setDimensions({ width: newWidth, height: newHeight });

      const clampX = (x: number) => Math.max(0, Math.min(newWidth - CATCHER_SIZE, x));
      const s = stateRef.current;
      if (s.phase === "idle" || s.phase === "over") {
        const centered = newWidth / 2 - CATCHER_SIZE / 2;
        catcherXRef.current = centered;
        targetCatcherXRef.current = centered;
      } else {
        catcherXRef.current = clampX(catcherXRef.current);
        targetCatcherXRef.current = clampX(targetCatcherXRef.current);
      }
      setView((prev) => ({ ...prev, catcherX: catcherXRef.current }));
    };

    adjust();
    window.addEventListener("resize", adjust);
    return () => window.removeEventListener("resize", adjust);
  }, []);

  const pause = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "playing") return;
    s.phase = "paused";
    setView((prev) => ({ ...prev, phase: "paused" }));
  }, []);

  const resume = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "paused") return;
    s.phase = "playing";
    lastFrameTimeRef.current = performance.now();
    setView((prev) => ({ ...prev, phase: "playing" }));
  }, []);

  // Auto-pause when the tab is hidden or the window loses focus.
  useEffect(() => {
    if (view.phase !== "playing") return;
    const onHide = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("blur", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("blur", onHide);
    };
  }, [view.phase, pause]);

  useEffect(() => {
    setMutedState(loadMuted());
  }, []);

  const toggleMute = () => {
    setMutedState((prev) => {
      setMuted(!prev);
      return !prev;
    });
  };

  const startGame = () => {
    initAudio();
    const { w } = dimensionsRef.current;
    const centered = w / 2 - CATCHER_SIZE / 2;
    catcherXRef.current = centered;
    targetCatcherXRef.current = centered;
    lastFrameTimeRef.current = 0;
    lastIconIdRef.current = 0;
    effectIdRef.current = 0;
    effectsRef.current = [];
    stateRef.current = {
      icons: [],
      lives: INITIAL_LIVES,
      caught: 0,
      speed: INITIAL_FALL_SPEED,
      phase: "countdown",
      countdown: 3,
      munchUntil: 0,
      lastSpawnAt: 0,
      speedUpAt: 0,
      countdownEndsAt: performance.now() + 3000,
    };
    setView({
      phase: "countdown",
      icons: [],
      catcherX: centered,
      lives: INITIAL_LIVES,
      caught: 0,
      speed: INITIAL_FALL_SPEED,
      countdown: 3,
      munching: false,
      effects: [],
    });
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = stateRef.current;
    if (!gameContainerRef.current) return;
    if (s.phase !== "playing" && s.phase !== "countdown") return;

    const { w } = dimensionsRef.current;
    const rect = gameContainerRef.current.getBoundingClientRect();
    let newCatcherX = e.clientX - rect.left - CATCHER_SIZE / 2;
    newCatcherX = Math.max(0, Math.min(w - CATCHER_SIZE, newCatcherX));

    targetCatcherXRef.current = newCatcherX;
  };

  const hudVisible =
    view.phase === "countdown" || view.phase === "playing" || view.phase === "paused";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 font-sans text-right">
      <h1 className="text-4xl sm:text-6xl font-black mb-5 p-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-950 to-teal-950 drop-shadow-lg text-center">
        چالش سیر کردن ایمان
      </h1>

      <motion.div
        ref={gameContainerRef}
        animate={shakeControls}
        className="relative border-8 border-gray-700 rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-emerald-950 touch-none cursor-pointer"
        style={{ width: dimensions.width, height: dimensions.height, touchAction: "none" }}
        onPointerMove={handlePointerMove}
      >
        {/* drifting decorative background */}
        <img
          src={KOUROSH_URL}
          alt=""
          aria-hidden
          className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-10 blur-sm animate-floatBalanced pointer-events-none"
          style={{ animationDuration: "9s" }}
        />
        <img
          src={MIA_URL}
          alt=""
          aria-hidden
          className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full opacity-10 blur-sm animate-floatBalanced pointer-events-none"
          style={{ animationDuration: "11s", animationDelay: "2s" }}
        />

        {view.icons.map((icon) => (
          <IconDisplay key={icon.id} icon={icon} />
        ))}

        <Catcher catcherX={view.catcherX} isMunching={view.munching} />

        {/* effects layer */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {view.effects.map((effect) => (
            <EffectNode key={effect.id} effect={effect} />
          ))}
        </div>

        {/* HUD */}
        {hudVisible && (
          <div className="absolute top-0 inset-x-0 z-30 bg-black/50 backdrop-blur rounded-b-2xl flex items-center justify-between gap-2 px-3 sm:px-4 py-2">
            <motion.div
              key={view.lives}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1"
              aria-label={`${fa(view.lives)} جان باقی مانده`}
            >
              {Array.from({ length: INITIAL_LIVES }, (_, i) => (
                <HeartIcon
                  key={i}
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    i < view.lives
                      ? "text-red-400 fill-red-400"
                      : "text-gray-600 fill-gray-600"
                  }`}
                />
              ))}
            </motion.div>

            <div className="flex items-center gap-3 sm:gap-5 text-sm sm:text-base font-bold">
              <span className="flex items-center text-yellow-400 gap-1">
                <ZapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{fa(view.caught)}</span>
              </span>
              <span className="flex items-center text-blue-400 gap-1">
                <ChevronsUpIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{fa(view.speed)}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={view.phase === "paused" ? resume : pause}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full text-sm sm:text-base transition-colors"
                aria-label={view.phase === "paused" ? "ادامه بازی" : "توقف بازی"}
              >
                {view.phase === "paused" ? "▶" : "⏸"}
              </button>
              <button
                onClick={toggleMute}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full text-sm sm:text-base transition-colors"
                aria-label={muted ? "وصل کردن صدا" : "قطع صدا"}
              >
                {muted ? "🔇" : "🔊"}
              </button>
            </div>
          </div>
        )}

        {/* countdown overlay */}
        {view.phase === "countdown" && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <span
              key={view.countdown}
              className="animate-countdown-pop text-8xl sm:text-9xl font-black text-yellow-400 drop-shadow-2xl"
            >
              {fa(view.countdown)}
            </span>
          </div>
        )}

        {/* pause overlay */}
        {view.phase === "paused" && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-70 p-4">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 text-yellow-400 text-right">
              بازی متوقف شد
            </h2>
            <p className="text-sm sm:text-lg text-gray-200 mb-6 text-right">
              آماده‌ای ادامه بدی؟
            </p>
            <button
              onClick={resume}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg sm:text-xl shadow-lg transform transition-all hover:scale-105"
            >
              ادامه بازی
              <PlayIcon className="w-5 h-5 mr-2" />
            </button>
          </div>
        )}

        {/* start / game-over overlay */}
        {(view.phase === "idle" || view.phase === "over") && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-70 p-4">
            <h2 className="text-4xl sm:text-6xl font-black mb-4 sm:mb-6 text-yellow-400 animate-pulse text-right" dir="rtl">
              {view.phase === "over" ? "بازی تمام شد!" : "آماده برای تغذیه؟"}
            </h2>
            <p className="text-base sm:text-xl text-gray-200 mb-6 sm:mb-8 text-right">
              {view.phase === "over"
                ? `شما ${fa(view.caught)} بار به ایمان غذا دادید!`
                : "ایمان را حرکت دهید تا میا و کوروش را بخورد."}
            </p>
            <button
              onClick={startGame}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-full text-xl sm:text-2xl shadow-lg transform transition-all hover:scale-105"
            >
              {view.phase === "over" ? "شروع مجدد" : "شروع جنون تغذیه"}
              <RefreshCcwIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
            </button>
          </div>
        )}
      </motion.div>

      <p className="mt-8 text-gray-700 text-sm max-w-lg text-center">
        **توجه:** سرعت بازی هر {fa(DIFFICULTY_INCREASE_INTERVAL / 1000)} ثانیه بیشتر می‌شه
        و تا سقف {fa(MAX_SPEED)} بالا می‌ره. با دکمه توقف هم می‌تونی نفس تازه کنی!
      </p>
    </div>
  );
}
