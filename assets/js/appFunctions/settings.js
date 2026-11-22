const SOUND_ICON_ON = "assets/img/sound_icons/sound-on-14606.svg";
const SOUND_ICON_OFF = "assets/img/sound_icons/sound-off-14613.svg";

const settingsState = {
  soundEnabled: true,
  fullscreenEnabled: false,
  isOpen: false,
  origin: "menu",
  isLandscapeLocked: false,
};

/**
 * Reads the persisted sound state from localStorage as the single source of truth.
 * @returns {boolean} True when sound is enabled, false when muted.
 */
const getStoredSoundSetting = () => {
  try {
    const saved = localStorage.getItem(SOUND_STORAGE_KEY);
    if (saved === "false") {
      return false;
    }
  } catch (err) {}
  return true;
};

/**
 * Loads the persisted sound preference from localStorage and syncs all sound controls.
 * @returns {void}
 */
const loadSoundSetting = () => {
  settingsState.soundEnabled = getStoredSoundSetting();
  saveSoundSetting(settingsState.soundEnabled);
  syncAllSoundControls();
};

/**
 * Saves the current sound preference to localStorage safely.
 * @param {boolean} isEnabled - Current sound enabled state.
 * @returns {void}
 */
const saveSoundSetting = (isEnabled) => {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, String(isEnabled));
  } catch (err) {}
};

/**
 * Synchronizes both the Settings button and the canvas sound icon with localStorage.
 * @returns {void}
 */
const syncAllSoundControls = () => {
  const isEnabled = getStoredSoundSetting();
  settingsState.soundEnabled = isEnabled;
  renderSettingsButtons(isEnabled, settingsState.fullscreenEnabled);
  renderCanvasSoundIcon(isEnabled);
};

/**
 * Updates the canvas sound overlay button if its DOM elements exist.
 * @param {boolean} isEnabled - Current persisted sound state.
 * @returns {void}
 */
const renderCanvasSoundIcon = (isEnabled) => {
  const btn = document.getElementById("canvas-sound-btn");
  const icon = document.getElementById("canvas-sound-icon");
  if (!btn || !icon) {
    return;
  }
  applyCanvasSoundAttributes(btn, icon, isEnabled);
};

/**
 * Applies SVG source, alt text, and ARIA attributes for the canvas sound toggle.
 * @param {HTMLElement} btn - Canvas sound toggle button element.
 * @param {HTMLImageElement} icon - Sound icon image element.
 * @param {boolean} isEnabled - Current persisted sound state.
 * @returns {void}
 */
const applyCanvasSoundAttributes = (btn, icon, isEnabled) => {
  if (isEnabled) {
    icon.setAttribute("src", SOUND_ICON_ON);
    icon.setAttribute("alt", "Sound on");
    btn.setAttribute("aria-label", "Mute sound");
    btn.setAttribute("aria-pressed", "true");
    return;
  }
  icon.setAttribute("src", SOUND_ICON_OFF);
  icon.setAttribute("alt", "Sound off");
  btn.setAttribute("aria-label", "Unmute sound");
  btn.setAttribute("aria-pressed", "false");
};

/**
 * Resumes a suspended Web Audio context after a direct user toggle gesture.
 * @returns {void}
 */
const resumeAudioIfSuspended = () => {
  if (typeof getActiveAudioContext !== "function") {
    return;
  }
  const ctx = getActiveAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume();
  }
};

/**
 * Removes keyboard focus from the currently active DOM element.
 * @returns {void}
 */
const blurActiveElement = () => {
  if (document.activeElement && document.activeElement.blur) {
    document.activeElement.blur();
  }
};

/**
 * Checks whether the Settings overlay is currently open.
 * @returns {boolean} True when Settings overlay is open.
 */
const isSettingsOverlayOpen = () => {
  return settingsState.isOpen;
};

/**
 * Checks whether the portrait landscape-lock overlay is currently active.
 * @returns {boolean} True when Sperrframe lock is active.
 */
const isLandscapeLocked = () => {
  return settingsState.isLandscapeLocked;
};

/**
 * Evaluates whether the current viewport is in portrait orientation.
 * @returns {boolean} True when viewport height exceeds width.
 */
const isPortraitViewport = () => {
  return window.innerHeight > window.innerWidth;
};

/**
 * Returns the currently active fullscreen element across standard and vendor APIs.
 * @returns {Element|null} Active fullscreen element or null.
 */
const getFullscreenElement = () => {
  return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || null;
};

/**
 * Syncs settingsState and Settings UI with the browser's actual fullscreen state.
 * @returns {void}
 */
const syncFullscreenState = () => {
  settingsState.fullscreenEnabled = Boolean(getFullscreenElement());
  renderSettingsButtons(settingsState.soundEnabled, settingsState.fullscreenEnabled);
};

/**
 * Handles orientation transitions between portrait lock and landscape pause workflow.
 * @returns {void}
 */
const handleOrientationCheck = () => {
  if (isPortraitViewport()) {
    applyLandscapeLock();
  } else if (settingsState.isLandscapeLocked) {
    releaseLandscapeLock();
  }
};

/**
 * Shows the portrait Sperrframe overlay and pauses an active GameEngine.
 * @returns {void}
 */
const applyLandscapeLock = () => {
  settingsState.isLandscapeLocked = true;
  toggleElement("landscape-lock-overlay", true);
  if (window.gameEngine && window.gameEngine.isRunning) {
    window.gameEngine.pauseForLandscapeLock();
  }
};

/**
 * Hides the Sperrframe overlay and opens the Pause Popup when returning to landscape.
 * @returns {void}
 */
const releaseLandscapeLock = () => {
  settingsState.isLandscapeLocked = false;
  toggleElement("landscape-lock-overlay", false);
  if (window.gameEngine && window.gameEngine.isRunning) {
    window.gameEngine.resumeAfterLandscapeLock();
  }
};

/**
 * Closes the Settings overlay silently when resetting game popups.
 * @returns {void}
 */
const resetSettingsOverlay = () => {
  settingsState.isOpen = false;
  toggleElement("settings-overlay", false);
};

/**
 * Opens the Settings overlay from either the main menu or pause menu.
 * @param {string} origin - Caller origin ("menu" or "pause").
 * @returns {void}
 */
const openSettingsOverlay = (origin) => {
  blurActiveElement();
  settingsState.origin = origin;
  settingsState.isOpen = true;
  syncFullscreenState();
  syncAllSoundControls();
  toggleElement("settings-overlay", true);
};

/**
 * Closes the Settings overlay and restores the originating menu.
 * @returns {void}
 */
const closeSettingsOverlay = () => {
  blurActiveElement();
  settingsState.isOpen = false;
  toggleElement("settings-overlay", false);
  if (settingsState.origin === "pause" && window.pausePopup) {
    window.pausePopup.showOverlay();
  }
};

/**
 * Toggles global sound in localStorage, updates both UI controls, and syncs engine audio.
 * @returns {void}
 */
const toggleSoundSetting = () => {
  blurActiveElement();
  const nextState = !getStoredSoundSetting();
  saveSoundSetting(nextState);
  settingsState.soundEnabled = nextState;
  resumeAudioIfSuspended();
  syncAllSoundControls();
  syncMusicWithSoundSetting();
};

/**
 * Handles clicks on the canvas sound overlay icon without triggering parent handlers.
 * @param {Event} event - Click event from the canvas sound button.
 * @returns {void}
 */
const toggleCanvasSoundIcon = (event) => {
  if (event) {
    event.stopPropagation();
  }
  toggleSoundSetting();
};

/**
 * Toggles fullscreen mode between on and off directly from Settings.
 * @returns {void}
 */
const toggleFullscreenSetting = () => {
  blurActiveElement();
  if (getFullscreenElement()) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
};

/**
 * Requests fullscreen on the game container or document root.
 * @returns {void}
 */
const enterFullscreen = () => {
  const target = document.getElementById("game-container") || document.documentElement;
  if (!target || getFullscreenElement()) {
    return;
  }
  if (target.requestFullscreen) {
    requestStandardFullscreen(target);
    return;
  }
  requestVendorFullscreen(target);
};

/**
 * Invokes standard requestFullscreen and handles promise resolution safely.
 * @param {Element} target - Element to display in fullscreen.
 * @returns {void}
 */
const requestStandardFullscreen = (target) => {
  const request = target.requestFullscreen();
  if (request && request.then) {
    request.then(onFullscreenEntered).catch(onFullscreenError);
  } else {
    onFullscreenEntered();
  }
};

/**
 * Invokes vendor-prefixed fullscreen APIs for Safari and legacy browsers.
 * @param {Element} target - Element to display in fullscreen.
 * @returns {void}
 */
const requestVendorFullscreen = (target) => {
  if (target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen();
  } else if (target.mozRequestFullScreen) {
    target.mozRequestFullScreen();
  }
  syncFullscreenState();
};

/**
 * Syncs UI after entering fullscreen and locks landscape only on coarse touch devices.
 * @returns {void}
 */
const onFullscreenEntered = () => {
  syncFullscreenState();
  if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
    lockLandscape();
  }
};

/**
 * Logs fullscreen rejection reasons and keeps the Settings toggle accurate.
 * @param {Error} err - Rejection error from the Fullscreen API.
 * @returns {void}
 */
const onFullscreenError = (err) => {
  console.warn("Fullscreen request failed:", err);
  syncFullscreenState();
};

/**
 * Exits the currently active fullscreen mode across standard and vendor APIs.
 * @returns {void}
 */
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen().then(syncFullscreenState).catch(onFullscreenError);
    return;
  }
  if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  syncFullscreenState();
};

/**
 * Locks screen orientation to landscape on supported mobile browsers.
 * @returns {void}
 */
const lockLandscape = () => {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("landscape").catch(() => {});
  }
};

document.onfullscreenchange = syncFullscreenState;
document.onwebkitfullscreenchange = syncFullscreenState;