const bgmState = {
  timerId: null,
  stepIndex: 0,
  mode: "menu",
};

const MENU_MELODY = [
  330, 0, 349, 415, 440, 0, 415, 349,
  330, 0, 0, 330, 415, 440, 494, 0,
  523, 0, 494, 440, 415, 0, 349, 330,
  349, 0, 415, 349, 330, 0, 0, 0,
];

const MENU_BASS = [
  110, 0, 165, 0, 110, 0, 165, 0,
  82, 0, 123, 0, 82, 0, 123, 0,
  110, 0, 165, 0, 87, 0, 131, 0,
  82, 0, 123, 0, 82, 0, 0, 0,
];

const LEVEL_MELODY = [
  330, 0, 392, 440, 494, 0, 440, 392,
  330, 0, 294, 330, 392, 0, 0, 0,
  440, 0, 494, 523, 587, 0, 523, 494,
  440, 392, 330, 294, 330, 0, 0, 0,
];

const LEVEL_BASS = [
  110, 0, 165, 0, 110, 0, 165, 0,
  147, 0, 110, 0, 165, 0, 147, 0,
  110, 0, 165, 0, 147, 0, 110, 0,
  165, 0, 147, 0, 110, 0, 0, 0,
];

const BOSS_MELODY = [
  220, 233, 262, 220, 330, 0, 311, 294,
  262, 233, 220, 196, 220, 0, 330, 0,
];

const BOSS_BASS = [
  110, 110, 131, 110, 147, 147, 131, 117,
  110, 110, 98, 98, 110, 131, 147, 165,
];

/**
 * Returns the sequencer step interval in milliseconds for the given mode.
 * @param {string} mode - Music mode ("menu", "level", or "boss").
 * @returns {number} Step interval in milliseconds.
 */
const getMusicStepMs = (mode) => {
  if (mode === "boss") {
    return 135;
  }
  if (mode === "menu") {
    return 220;
  }
  return 185;
};

/**
 * Returns the active melody note array for the current music mode.
 * @returns {Array<number>} Melody frequency array.
 */
const getActiveMelody = () => {
  if (bgmState.mode === "boss") {
    return BOSS_MELODY;
  }
  if (bgmState.mode === "menu") {
    return MENU_MELODY;
  }
  return LEVEL_MELODY;
};

/**
 * Returns the active bass note array for the current music mode.
 * @returns {Array<number>} Bass frequency array.
 */
const getActiveBass = () => {
  if (bgmState.mode === "boss") {
    return BOSS_BASS;
  }
  if (bgmState.mode === "menu") {
    return MENU_BASS;
  }
  return LEVEL_BASS;
};

/**
 * Returns the oscillator waveform for the current music mode.
 * @returns {string} Oscillator type name.
 */
const getMusicWaveform = () => {
  if (bgmState.mode === "boss") {
    return "sawtooth";
  }
  return "triangle";
};

/**
 * Returns the note duration in seconds for the current music mode.
 * @returns {number} Note duration in seconds.
 */
const getMusicNoteDuration = () => {
  if (bgmState.mode === "boss") {
    return 0.12;
  }
  if (bgmState.mode === "menu") {
    return 0.19;
  }
  return 0.16;
};

/**
 * Starts or switches the synthesized background music loop.
 * @param {string} [mode="level"] - Music mode ("menu", "level", or "boss").
 * @returns {void}
 */
const startBackgroundMusic = (mode = "level") => {
  stopBackgroundMusic();
  bgmState.mode = mode;
  bgmState.stepIndex = 0;
  if (!isSoundEnabled()) {
    return;
  }
  const stepMs = getMusicStepMs(mode);
  bgmState.timerId = setInterval(playMusicStep, stepMs);
};

/**
 * Stops the currently playing background music loop.
 * @returns {void}
 */
const stopBackgroundMusic = () => {
  if (bgmState.timerId !== null) {
    clearInterval(bgmState.timerId);
    bgmState.timerId = null;
  }
};

/**
 * Checks whether the browser AudioContext is unlocked and actively running.
 * @returns {boolean} True when audio output is ready without queueing.
 */
const isAudioReadyForMusic = () => {
  const ctx = getActiveAudioContext();
  if (!ctx || ctx.state !== "running") {
    return false;
  }
  return true;
};

/**
 * Checks whether background music should skip playback due to mute, lock, pause, or autoplay.
 * @returns {boolean} True when muted, portrait-locked, paused, or awaiting unlock.
 */
const isMusicPausedOrMuted = () => {
  if (!isSoundEnabled() || isLandscapeLocked()) {
    return true;
  }
  if (window.gameEngine && window.gameEngine.isPaused) {
    return true;
  }
  return !isAudioReadyForMusic();
};

/**
 * Plays one rhythmic step of melody and bass according to the active mode.
 * @returns {void}
 */
const playMusicStep = () => {
  if (isMusicPausedOrMuted()) {
    return;
  }
  const melody = getActiveMelody();
  const bass = getActiveBass();
  const idx = bgmState.stepIndex % melody.length;
  playMusicNote(melody[idx], bass[idx]);
  bgmState.stepIndex += 1;
};

/**
 * Triggers the melody and bass notes for the current sequencer step.
 * @param {number} melodyHz - Melody frequency in Hz (0 for rest).
 * @param {number} bassHz - Bass frequency in Hz (0 for rest).
 * @returns {void}
 */
const playMusicNote = (melodyHz, bassHz) => {
  const wave = getMusicWaveform();
  const dur = getMusicNoteDuration();
  if (melodyHz > 0) {
    playTone(melodyHz, melodyHz, dur, wave, 0.22);
  }
  if (bassHz > 0) {
    playTone(bassHz, bassHz, dur, "sine", 0.26);
  }
};

/**
 * Checks whether music should resume when Sound is toggled back on in Settings.
 * @returns {boolean} True when in an active menu or running gameplay session.
 */
const shouldRestartMusicOnUnmute = () => {
  if (bgmState.timerId !== null) {
    return false;
  }
  if (window.gameEngine && window.gameEngine.isRunning) {
    return true;
  }
  return bgmState.mode === "menu" && currentMenuFrame >= 1 && currentMenuFrame <= 4;
};

/**
 * Synchronizes background music playback when the global sound toggle changes.
 * @returns {void}
 */
const syncMusicWithSoundSetting = () => {
  if (typeof settingsState === "undefined") {
    return;
  }
  if (!settingsState.soundEnabled) {
    stopBackgroundMusic();
    return;
  }
  if (shouldRestartMusicOnUnmute()) {
    startBackgroundMusic(bgmState.mode);
  }
};