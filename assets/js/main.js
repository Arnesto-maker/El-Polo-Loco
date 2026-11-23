let appController = null;
let lastExoticHudKey = "";

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
 * Returns the fixed 16:10 design reference dimensions used by all gameplay entities.
 * @returns {{width: number, height: number}} Fixed logical design reference.
 */
const createDesignCanvasRef = () => {
  return { width: 2048, height: 1280 };
};

/**
 * Computes the distortion-free logical canvas width for the current CSS aspect ratio.
 * @param {HTMLCanvasElement} canvas - The game canvas element.
 * @returns {number} Target logical width at fixed 1280px height, or 0 if hidden.
 */
const getTargetCanvasWidth = (canvas) => {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return 0;
  }
  return Math.round(1280 * (rect.width / rect.height));
};

/**
 * Synchronizes the canvas logical width to its rendered CSS aspect ratio at fixed 1280px height.
 * @returns {void}
 */
const syncGameCanvasResolution = () => {
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) {
    return;
  }
  const targetWidth = getTargetCanvasWidth(canvas);
  if (targetWidth > 0 && canvas.width !== targetWidth) {
    canvas.width = targetWidth;
  }
  if (canvas.height !== 1280) {
    canvas.height = 1280;
  }
};

/**
 * Evaluates whether the current viewport matches exotic ultra-flat landscape screens such as 640x320.
 * @returns {boolean} True only when width <= 740, height <= 350, and orientation is landscape.
 */
const isExoticViewport = () => {
  const isFlatLandscape = window.innerWidth <= 740 && window.innerHeight <= 350;
  return isFlatLandscape && window.innerWidth > window.innerHeight;
};

/**
 * Evaluates whether the active viewport is a standard touch device outside the exotic 640x320 tier.
 * @returns {boolean} True for normal touch viewports (<= 1366px or coarse pointer) excluding exotic mode.
 */
const isNormalTouchViewport = () => {
  if (isExoticViewport()) {
    return false;
  }
  const isCoarse = Boolean(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  return window.innerWidth <= 1366 || isCoarse;
};

/**
 * Resets exotic gameplay layout classes and hides the exotic CSS HUD overlay.
 * @returns {void}
 */
const resetExoticGameHud = () => {
  lastExoticHudKey = "";
  toggleElement("exotic-hud", false);
  const container = document.getElementById("game-container");
  if (container) {
    container.classList.remove("exotic-gameplay");
    container.classList.remove("exotic-boss-mode");
  }
};

/**
 * Clears exotic HUD classes only when leaving the exotic viewport tier.
 * @returns {void}
 */
const resetExoticIfNeeded = () => {
  if (lastExoticHudKey !== "") {
    resetExoticGameHud();
  }
};

/**
 * Synchronizes the exotic CSS HUD and Frame 1 / Frame 2 container modes with live StatusBar state.
 * @param {StatusBar} bar - Active gameplay StatusBar instance.
 * @returns {void}
 */
const syncExoticGameHud = (bar) => {
  if (!isExoticViewport()) {
    resetExoticIfNeeded();
    return;
  }
  const key = buildExoticHudKey(bar);
  if (key === lastExoticHudKey) {
    return;
  }
  lastExoticHudKey = key;
  applyExoticHudState(bar);
};

/**
 * Applies container mode classes and renders both standard and boss exotic HUD readouts.
 * @param {StatusBar} bar - Active gameplay StatusBar instance.
 * @returns {void}
 */
const applyExoticHudState = (bar) => {
  syncExoticContainerClasses(bar.showBossHud);
  renderExoticStandardHud(bar);
  renderExoticBossHud(bar);
};

/**
 * Builds a deterministic state signature to prevent redundant DOM writes on unchanged frames.
 * @param {StatusBar} bar - Active gameplay StatusBar instance.
 * @returns {string} Serialized HUD state key.
 */
const buildExoticHudKey = (bar) => {
  const timeStr = bar.bossHud.formatBossTime();
  return [
    bar.health, bar.bottleCount, bar.coinCount, bar.score,
    bar.showBossHud, bar.bossHealth, bar.bossArmour, bar.bossBonus, timeStr,
  ].join("|");
};

/**
 * Applies Frame 1 (earth-dock) or Frame 2 (full-canvas boss) layout classes on the game container.
 * @param {boolean} isBoss - True when Endboss fight is active.
 * @returns {void}
 */
const syncExoticContainerClasses = (isBoss) => {
  toggleElement("exotic-hud", true);
  const container = document.getElementById("game-container");
  if (!container) {
    return;
  }
  container.classList.add("exotic-gameplay");
  container.classList.toggle("exotic-boss-mode", Boolean(isBoss));
};

/**
 * Updates player health sprite, inventory counts, score, and coin-buy badge in the exotic HUD.
 * @param {StatusBar} bar - Active gameplay StatusBar instance.
 * @returns {void}
 */
const renderExoticStandardHud = (bar) => {
  const healthSrc = bar.IMAGES_HEALTH[bar.setHealthIndex(bar.health)];
  setExoticImageSrc("exotic-health-img", healthSrc);
  setExoticText("exotic-bottle-count", bar.formatCount(bar.bottleCount));
  setExoticText("exotic-coin-count", bar.formatCount(bar.coinCount));
  setExoticText("exotic-score", "Score: " + bar.score);
  toggleElement("exotic-buy-hint", bar.coinCount >= 2);
};

/**
 * Toggles boss-specific exotic HUD groups and refreshes boss values during boss fights.
 * @param {StatusBar} bar - Active gameplay StatusBar instance.
 * @returns {void}
 */
const renderExoticBossHud = (bar) => {
  toggleElement("exotic-boss-top", bar.showBossHud);
  toggleElement("exotic-boss-sub", bar.showBossHud);
  if (bar.showBossHud) {
    updateExoticBossDetails(bar);
  }
};

/**
 * Updates boss health sprite, timer, decaying bonus, armor count, and warning text in the exotic HUD.
 * @param {StatusBar} bar - Active gameplay StatusBar instance.
 * @returns {void}
 */
const updateExoticBossDetails = (bar) => {
  const bossSrc = bar.IMAGES_BOSS_HEALTH[bar.setHealthIndex(bar.bossHealth)];
  const hasArmour = bar.bossArmour > 0;
  setExoticImageSrc("exotic-boss-health-img", bossSrc);
  setExoticText("exotic-boss-time", bar.bossHud.formatBossTime());
  setExoticText("exotic-boss-bonus", "+ " + bar.bossBonus);
  setExoticText("exotic-boss-armour", "+" + bar.bossArmour + " Armour");
  toggleElement("exotic-boss-armour", hasArmour);
  toggleElement("exotic-boss-armour-warn", hasArmour);
};

/**
 * Safely writes plain text to an exotic HUD DOM element by id.
 * @param {string} id - Target element id.
 * @param {string} text - Plain text value.
 * @returns {void}
 */
const setExoticText = (id, text) => {
  const el = document.getElementById(id);
  if (el) {
    el.innerText = text;
  }
};

/**
 * Safely updates the image source attribute of an exotic HUD sprite element.
 * @param {string} id - Target image element id.
 * @param {string} src - Asset path string.
 * @returns {void}
 */
const setExoticImageSrc = (id, src) => {
  const el = document.getElementById(id);
  if (el) {
    el.setAttribute("src", src);
  }
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
 * Creates World with fixed design dimensions and starts GameEngine synced to the live viewport aspect ratio.
 * @returns {void}
 */
const initGameEngine = () => {
  const canvas = document.getElementById("gameCanvas");
  syncGameCanvasResolution();
  const world = new World(createDesignCanvasRef());
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
  resetExoticGameHud();
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