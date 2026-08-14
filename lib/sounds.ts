// Synthesized game sounds via WebAudio — no audio files needed.
// The AudioContext is only ever created from a user gesture (start button),
// which keeps the browser autoplay policy happy.

let ctx: AudioContext | null = null;
let muted = false;

export function initAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
}

export function loadMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    muted = localStorage.getItem("kouman-muted") === "1";
  } catch {
    muted = false;
  }
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("kouman-muted", value ? "1" : "0");
  } catch {
    // localStorage unavailable — ignore
  }
}

function tone(
  f0: number,
  f1: number,
  duration: number,
  type: OscillatorType,
  gain: number
) {
  if (!ctx || muted || ctx.state !== "running") return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    Math.max(f1, 1),
    ctx.currentTime + duration
  );
  amp.gain.setValueAtTime(gain, ctx.currentTime);
  amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
  osc.onended = () => {
    osc.disconnect();
    amp.disconnect();
  };
}

export const playCatch = () => tone(500, 900, 0.09, "triangle", 0.12);
export const playMiss = () => tone(220, 70, 0.28, "sawtooth", 0.1);
export const playTick = () => tone(650, 650, 0.06, "square", 0.07);
export const playStart = () => tone(300, 700, 0.2, "triangle", 0.12);
export const playGameOver = () => {
  tone(330, 165, 0.35, "sawtooth", 0.1);
  setTimeout(() => tone(165, 82, 0.5, "sawtooth", 0.1), 300);
};
