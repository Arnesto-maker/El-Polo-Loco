let currentMenuFrame = 1;

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
 * Toggles fullscreen mode for the main game container.
 * @returns {void}
 */
const toggleFullscreen = () => {
  blurActiveElement();
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    exitFullscreen();
    return;
  }
  enterFullscreen();
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

const setMenuVisibility = (showF1, showF2, showAbout, showGameOver) => {
  hideAllWinOverlays();
  toggleElement("frame-1", showF1);
  toggleElement("frame-2", showF2);
  toggleElement("gameCanvas", showF2);
  toggleElement("frame-about", showAbout);
  toggleElement("game-over-frame", Boolean(showGameOver));
};

const hideAllWinOverlays = () => {
  toggleElement("you-won-frame", false);
  toggleElement("summary-frame", false);
  toggleElement("save-score-frame", false);
  toggleElement("spinner-frame", false);
  toggleElement("save-status-frame", false);
  toggleElement("local-save-error-frame", false);
  toggleElement("highscore-frame", false);
};

const showOnlyOverlayFrame = (activeId) => {
  setMenuVisibility(false, false, false, false);
  toggleElement(activeId, true);
};

const toggleElement = (id, show) => {
  const el = document.getElementById(id);
  if (!el) {
    return;
  }
  if (show) {
    el.classList.remove("d-none");
  } else {
    el.classList.add("d-none");
  }
};

const initMenu = () => {
  currentMenuFrame = 1;
  toggleElement("start-overlay", true);
  setMenuVisibility(true, false, false, false);
  initPendingSyncOnLoad();
};

const handleMenuKeyDown = (event) => {
  if (currentMenuFrame === 1 && event.key === "Enter") {
    showFrame2();
  } else if (currentMenuFrame === 2 && event.key === "Escape") {
    initMenu();
  } else if (currentMenuFrame === 3 && event.key === "Escape") {
    showFrame2();
  } else if (currentMenuFrame === 5 && event.key === "Enter") {
    returnToFrame2FromGame();
  } else {
    handleWinFlowKeyDown(event);
  }
};

const handleWinFlowKeyDown = (event) => {
  if (currentMenuFrame === 6 && event.key === "Enter") {
    openSummaryFrame();
  } else if (currentMenuFrame === 7) {
    handleSummaryKeyDown(event.key);
  } else if (currentMenuFrame === 8 && event.key === "Enter") {
    handleSaveScoreSubmit();
  } else {
    handleSaveFlowKeyDown(event.key);
  }
};

const handleSummaryKeyDown = (key) => {
  if (key === "Escape") {
    executeNode3a();
  } else if (key === "Enter") {
    openSaveScoreFrame();
  }
};

const handleSaveFlowKeyDown = (key) => {
  if (currentMenuFrame === 4 && key === "Escape") {
    showFrame2();
  } else if (currentMenuFrame === 10 && key === "Enter") {
    executeNode3a();
  } else if (currentMenuFrame === 11 && key === "Enter") {
    handleLocalSaveConfirm();
  } else if (currentMenuFrame === 11 && key === "Escape") {
    executeNode3a();
  }
};

const handleGameOverTouchOrClick = (event) => {
  if (event.type === "touchstart") {
    event.preventDefault();
  }
  if (currentMenuFrame === 5) {
    returnToFrame2FromGame();
  }
};

const showFrame2 = () => {
  enterFullscreen();
  currentMenuFrame = 2;
  setMenuVisibility(false, true, false, false);
};

const showGameOverFrame = () => {
  resetAllGamePopups();
  currentMenuFrame = 5;
  setMenuVisibility(false, false, false, true);
};

const resetAllGamePopups = () => {
  if (window.activePopupKeyHandler) {
    window.removeEventListener("keydown", window.activePopupKeyHandler);
    window.activePopupKeyHandler = null;
  }
  toggleElement("pause-overlay", false);
  toggleElement("start-help-overlay", false);
  toggleElement("boss-dossier-overlay", false);
  stopRunningGameEngine();
};

const stopRunningGameEngine = () => {
  if (window.gameEngine) {
    window.gameEngine.isRunning = false;
    window.gameEngine.isPaused = true;
    cancelEngineFrame();
    window.gameEngine = null;
  }
  clearGameCanvas();
};

const cancelEngineFrame = () => {
  if (window.gameEngine.animationFrameId !== null) {
    cancelAnimationFrame(window.gameEngine.animationFrameId);
    window.gameEngine.animationFrameId = null;
  }
};

const clearGameCanvas = () => {
  const canvas = document.getElementById("gameCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

const openAbout = () => {
  currentMenuFrame = 3;
  setMenuVisibility(false, false, true, false);
};

const startNewGame = () => {
  blurActiveElement();
  enterFullscreen();
  resetAllGamePopups();
  currentMenuFrame = 0;
  toggleElement("start-overlay", false);
  setMenuVisibility(false, true, false, false);
  initGameEngine();
};

const initGameEngine = () => {
  const canvas = document.getElementById("gameCanvas");
  const world = new World(canvas);
  const controller = new Controller();
  window.gameEngine = new GameEngine(canvas, controller, world.getFramePackages(), world);
};

const returnToFrame2FromGame = () => {
  resetAllGamePopups();
  currentMenuFrame = 2;
  toggleElement("start-overlay", true);
  setMenuVisibility(false, true, false, false);
};

const openHighScore = () => {
  loadAndShowHighscores();
};

const initDebug = () => {
  startNewGame();
};

const exitGame = () => {
  resetAllGamePopups();
  initMenu();
};