let appController = null;

/**
 * Ensures the single unified Controller instance exists.
 * @returns {Controller} Active unified Controller instance.
 */
const ensureAppController = () => {
  if (!appController) {
    appController = new Controller();
  }
  return appController;
};

/**
 * Initializes the application on body load, restoring sound settings, menu, music, and orientation lock.
 * @returns {void}
 */
const initMenu = () => {
  ensureAppController();
  loadSoundSetting();
  bindAudioUnlockListeners();
  currentMenuFrame = 1;
  toggleElement("touch-controls", false);
  toggleElement("canvas-sound-btn", false);
  toggleElement("start-overlay", true);
  setMenuVisibility(true, false, false, false);
  initPendingSyncOnLoad();
  startBackgroundMusic("menu");
  handleOrientationCheck();
};

/**
 * Starts a fresh game session, displays touch HUD and sound icon, and starts level music.
 * @returns {void}
 */
const startNewGame = () => {
  blurActiveElement();
  resetAllGamePopups();
  currentMenuFrame = 0;
  toggleElement("start-overlay", false);
  setMenuVisibility(false, true, false, false);
  toggleElement("touch-controls", true);
  toggleElement("canvas-sound-btn", true);
  syncAllSoundControls();
  initGameEngine();
  startBackgroundMusic("level");
  handleOrientationCheck();
};

/**
 * Creates World and GameEngine using the single unified Controller instance.
 * @returns {void}
 */
const initGameEngine = () => {
  const canvas = document.getElementById("gameCanvas");
  const world = new World(canvas);
  const controller = ensureAppController();
  window.gameEngine = new GameEngine(canvas, controller, world.getFramePackages(), world);
};

/**
 * Closes all in-game overlays, stops music, resets controller flags, and halts the game loop.
 * @returns {void}
 */
const resetAllGamePopups = () => {
  stopBackgroundMusic();
  resetSettingsOverlay();
  toggleElement("pause-overlay", false);
  toggleElement("frame-help", false);
  toggleElement("boss-dossier-overlay", false);
  toggleElement("canvas-sound-btn", false);
  if (appController) {
    appController.resetStates();
  }
  stopRunningGameEngine();
};

/**
 * Stops the active GameEngine loop and clears the canvas.
 * @returns {void}
 */
const stopRunningGameEngine = () => {
  if (window.gameEngine) {
    window.gameEngine.isRunning = false;
    window.gameEngine.isPaused = true;
    cancelEngineFrame();
    window.gameEngine = null;
  }
  clearGameCanvas();
};

/**
 * Cancels any pending animation frame scheduled by GameEngine.
 * @returns {void}
 */
const cancelEngineFrame = () => {
  if (window.gameEngine.animationFrameId !== null) {
    cancelAnimationFrame(window.gameEngine.animationFrameId);
    window.gameEngine.animationFrameId = null;
  }
};

/**
 * Clears all drawn pixels from the game canvas.
 * @returns {void}
 */
const clearGameCanvas = () => {
  const canvas = document.getElementById("gameCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

/**
 * Stops gameplay, returns to the Frame 2 main menu, and resumes menu music.
 * @returns {void}
 */
const returnToFrame2FromGame = () => {
  resetAllGamePopups();
  currentMenuFrame = 2;
  toggleElement("touch-controls", false);
  toggleElement("start-overlay", true);
  setMenuVisibility(false, true, false, false);
  startBackgroundMusic("menu");
};

/**
 * Optional debug entrypoint launching straight into gameplay.
 * @returns {void}
 */
const initDebug = () => {
  ensureAppController();
  startNewGame();
};

/**
 * Resets gameplay and returns to Start Frame 1.
 * @returns {void}
 */
const exitGame = () => {
  resetAllGamePopups();
  initMenu();
};