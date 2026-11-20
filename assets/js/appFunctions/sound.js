let audioCtx = null;

/**
 * Checks whether global sound output is currently enabled in Settings.
 * @returns {boolean} True when sound is enabled.
 */
const isSoundEnabled = () => {
  if (typeof settingsState !== "undefined" && !settingsState.soundEnabled) {
    return false;
  }
  return true;
};

/**
 * Resumes a suspended AudioContext after user interaction.
 * @returns {void}
 */
const resumeAudioContext = () => {
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
};

/**
 * Returns an active AudioContext if sound is enabled in Settings.
 * @returns {AudioContext|null} Ready AudioContext or null when muted.
 */
const getActiveAudioContext = () => {
  if (!isSoundEnabled()) {
    return null;
  }
  const AudioClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioClass) {
    return null;
  }
  if (!audioCtx) {
    audioCtx = new AudioClass();
  }
  resumeAudioContext();
  return audioCtx;
};

/**
 * Connects a gain node to output and starts/stops the audio source.
 * @param {AudioScheduledSourceNode} sourceNode - Oscillator or buffer source.
 * @param {GainNode} gain - Volume envelope node.
 * @param {AudioContext} ctx - Active AudioContext.
 * @param {number} now - Start timestamp in seconds.
 * @param {number} duration - Playback duration in seconds.
 * @returns {void}
 */
const connectGainAndRun = (sourceNode, gain, ctx, now, duration) => {
  gain.connect(ctx.destination);
  sourceNode.start(now);
  sourceNode.stop(now + duration);
};

/**
 * Creates a gain node with an exponential fade-out envelope.
 * @param {AudioContext} ctx - Active AudioContext.
 * @param {number} volume - Peak gain value (0.01 to 1.0).
 * @param {number} now - Start timestamp in seconds.
 * @param {number} duration - Fade duration in seconds.
 * @returns {GainNode} Configured gain node.
 */
const createGainEnvelope = (ctx, volume, now, duration) => {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  return gain;
};

/**
 * Plays a synthesized pitch-gliding tone with exponential fade-out.
 * @param {number} startHz - Initial frequency in Hz.
 * @param {number} endHz - Target frequency in Hz.
 * @param {number} duration - Tone duration in seconds.
 * @param {string} type - Oscillator waveform (sine, square, triangle, sawtooth).
 * @param {number} volume - Peak gain value (0.01 to 1.0).
 * @param {number} [delay=0] - Optional start delay in seconds.
 * @returns {void}
 */
const playTone = (startHz, endHz, duration, type, volume, delay = 0) => {
  const ctx = getActiveAudioContext();
  if (!ctx) {
    return;
  }
  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = createGainEnvelope(ctx, volume, now, duration);
  osc.type = type;
  osc.frequency.setValueAtTime(startHz, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(endHz, 20), now + duration);
  osc.connect(gain);
  connectGainAndRun(osc, gain, ctx, now, duration);
};

/**
 * Generates a mono white-noise audio buffer for percussive effects.
 * @param {AudioContext} ctx - Active AudioContext.
 * @param {number} duration - Buffer duration in seconds.
 * @returns {AudioBuffer} Filled white-noise buffer.
 */
const createNoiseBuffer = (ctx, duration) => {
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

/**
 * Creates a bandpass filter tuned to a target center frequency.
 * @param {AudioContext} ctx - Active AudioContext.
 * @param {number} filterHz - Center frequency in Hz.
 * @param {number} now - Current AudioContext time.
 * @returns {BiquadFilterNode} Configured bandpass filter.
 */
const createBandpassFilter = (ctx, filterHz, now) => {
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(filterHz, now);
  return filter;
};

/**
 * Plays a short filtered noise burst (e.g. bottle splash or whoosh).
 * @param {number} duration - Burst duration in seconds.
 * @param {number} volume - Peak gain value.
 * @param {number} filterHz - Bandpass center frequency in Hz.
 * @returns {void}
 */
const playNoiseBurst = (duration, volume, filterHz) => {
  const ctx = getActiveAudioContext();
  if (!ctx) {
    return;
  }
  const now = ctx.currentTime;
  const src = ctx.createBufferSource();
  const filter = createBandpassFilter(ctx, filterHz, now);
  const gain = createGainEnvelope(ctx, volume, now, duration);
  src.buffer = createNoiseBuffer(ctx, duration);
  src.connect(filter);
  filter.connect(gain);
  connectGainAndRun(src, gain, ctx, now, duration);
};

/**
 * Plays an upward jump sound for Pepe.
 * @returns {void}
 */
const playJumpSound = () => {
  playTone(220, 560, 0.14, "triangle", 0.2);
};

/**
 * Plays a quick whoosh sound when throwing a salsa bottle.
 * @returns {void}
 */
const playThrowSound = () => {
  playNoiseBurst(0.11, 0.18, 1200);
  playTone(420, 180, 0.1, "sine", 0.12);
};

/**
 * Plays a classic two-note arcade coin pickup chime.
 * @returns {void}
 */
const playCoinSound = () => {
  playTone(987, 987, 0.08, "square", 0.12, 0);
  playTone(1318, 1318, 0.18, "square", 0.12, 0.07);
};

/**
 * Plays a crisp clink sound when picking up a bottle.
 * @returns {void}
 */
const playBottlePickupSound = () => {
  playTone(620, 920, 0.09, "sine", 0.18);
};

/**
 * Plays a punchy stomp sound when jumping on a chicken.
 * @returns {void}
 */
const playStompSound = () => {
  playTone(190, 55, 0.13, "triangle", 0.28);
  playNoiseBurst(0.07, 0.15, 650);
};

/**
 * Plays a glass-shatter burst when a bottle hits or breaks.
 * @returns {void}
 */
const playBottleSplashSound = () => {
  playNoiseBurst(0.18, 0.25, 2400);
  playTone(950, 260, 0.12, "sawtooth", 0.1);
};

/**
 * Plays a harsh damage buzz when Pepe gets hit.
 * @returns {void}
 */
const playHurtSound = () => {
  playTone(240, 90, 0.2, "sawtooth", 0.2);
};

/**
 * Plays a heavy low-end impact when the Boss takes damage.
 * @returns {void}
 */
const playBossHitSound = () => {
  playTone(140, 42, 0.22, "sawtooth", 0.28);
  playNoiseBurst(0.14, 0.2, 500);
};

/**
 * Plays a short ascending victory fanfare.
 * @returns {void}
 */
const playWinSound = () => {
  playTone(523, 523, 0.12, "triangle", 0.18, 0);
  playTone(659, 659, 0.12, "triangle", 0.18, 0.11);
  playTone(784, 784, 0.12, "triangle", 0.18, 0.22);
  playTone(1046, 1046, 0.32, "triangle", 0.2, 0.33);
};

/**
 * Plays a descending game-over melody.
 * @returns {void}
 */
const playGameOverSound = () => {
  playTone(392, 370, 0.2, "sawtooth", 0.15, 0);
  playTone(349, 330, 0.2, "sawtooth", 0.15, 0.2);
  playTone(293, 180, 0.42, "sawtooth", 0.16, 0.4);
};