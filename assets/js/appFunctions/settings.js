const SOUND_STORAGE_KEY = "el_pollo_loco_sound_enabled";

const settingsState = {
  soundEnabled: true,
  fullscreenEnabled: false,
  isOpen: false,
  origin: "menu",
  isLandscapeLocked: false,
};

/**
 * Loads the persisted sound preference from localStorage and syncs the Settings UI.
 * @returns {void}
 */
const loadSoundSetting = () => {
  try {
    const saved = localStorage.getItem(SOUND_STORAGE_KEY);
    if (saved === "false") {
      settingsState.soundEnabled = false;
    } else if (saved === "true") {
      settingsState.soundEnabled = true;
    }
  } catch (err) {}
  renderSettingsButtons(settingsState.soundEnabled, settingsState.fullscreenEnabled);
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
 * Toggles global sound setting between on and off and persists it locally.
 * @returns {void}
 */
const toggleSoundSetting = () => {
  blurActiveElement();
  settingsState.soundEnabled = !settingsState.soundEnabled;
  saveSoundSetting(settingsState.soundEnabled);
  renderSettingsButtons(settingsState.soundEnabled, settingsState.fullscreenEnabled);
  syncMusicWithSoundSetting();
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

document.addEventListener("fullscreenchange", syncFullscreenState);
document.addEventListener("webkitfullscreenchange", syncFullscreenState);