const settingsState = {
  soundEnabled: true,
  fullscreenEnabled: false,
  isOpen: false,
  origin: "menu",
  isLandscapeLocked: false,
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
  settingsState.fullscreenEnabled = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  renderSettingsButtons(settingsState.soundEnabled, settingsState.fullscreenEnabled);
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
 * Toggles global sound setting between on and off immediately.
 * @returns {void}
 */
const toggleSoundSetting = () => {
  blurActiveElement();
  settingsState.soundEnabled = !settingsState.soundEnabled;
  renderSettingsButtons(settingsState.soundEnabled, settingsState.fullscreenEnabled);
  syncMusicWithSoundSetting();
};

/**
 * Toggles fullscreen mode between on and off directly from Settings.
 * @returns {void}
 */
const toggleFullscreenSetting = () => {
  blurActiveElement();
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    exitFullscreen();
    settingsState.fullscreenEnabled = false;
  } else {
    enterFullscreen();
    settingsState.fullscreenEnabled = true;
  }
  renderSettingsButtons(settingsState.soundEnabled, settingsState.fullscreenEnabled);
};

/**
 * Requests fullscreen on the game container and locks landscape orientation.
 * @returns {void}
 */
const enterFullscreen = () => {
  const container = document.getElementById("game-container");
  if (!container || document.fullscreenElement) {
    return;
  }
  if (container.requestFullscreen) {
    container.requestFullscreen({ navigationUI: "hide" }).then(lockLandscape).catch(() => {});
    return;
  }
  if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
};

/**
 * Exits the currently active fullscreen mode.
 * @returns {void}
 */
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
    return;
  }
  if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
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