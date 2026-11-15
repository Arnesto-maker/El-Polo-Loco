let currentMenuFrame = 1;

function setMenuVisibility(showF1, showF2, showAbout, showGameOver) {
  toggleElement("frame-1", showF1);
  toggleElement("frame-2", showF2);
  toggleElement("gameCanvas", showF2);
  toggleElement("frame-about", showAbout);
  toggleElement("game-over-frame", Boolean(showGameOver));
}

function toggleElement(id, show) {
  const el = document.getElementById(id);
  if (!el) {
    return;
  }
  if (show) {
    el.classList.remove("d-none");
  } else {
    el.classList.add("d-none");
  }
}

function initMenu() {
  currentMenuFrame = 1;
  toggleElement("start-overlay", true);
  setMenuVisibility(true, false, false, false);
}

function handleMenuKeyDown(event) {
  if (currentMenuFrame === 1 && event.key === "Enter") {
    showFrame2();
  } else if (currentMenuFrame === 2 && event.key === "Escape") {
    initMenu();
  } else if (currentMenuFrame === 3 && event.key === "Escape") {
    showFrame2();
  } else if (currentMenuFrame === 5 && event.key === "Enter") {
    returnToFrame2FromGame();
  }
}

function handleGameOverTouchOrClick(event) {
  if (event.type === "touchstart") {
    event.preventDefault();
  }
  if (currentMenuFrame === 5) {
    returnToFrame2FromGame();
  }
}

function showFrame2() {
  currentMenuFrame = 2;
  setMenuVisibility(false, true, false, false);
}

function showGameOverFrame() {
  resetAllGamePopups();
  currentMenuFrame = 5;
  setMenuVisibility(false, false, false, true);
}

function resetAllGamePopups() {
  if (window.activePopupKeyHandler) {
    window.removeEventListener("keydown", window.activePopupKeyHandler);
    window.activePopupKeyHandler = null;
  }
  toggleElement("pause-overlay", false);
  toggleElement("start-help-overlay", false);
  toggleElement("boss-dossier-overlay", false);
  stopRunningGameEngine();
}

function stopRunningGameEngine() {
  if (window.gameEngine) {
    window.gameEngine.isRunning = false;
    window.gameEngine.isPaused = true;
    if (window.gameEngine.animationFrameId !== null) {
      cancelAnimationFrame(window.gameEngine.animationFrameId);
      window.gameEngine.animationFrameId = null;
    }
    window.gameEngine = null;
  }
  const canvas = document.getElementById("gameCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function openAbout() {
  currentMenuFrame = 3;
  setMenuVisibility(false, false, true, false);
}

function startNewGame() {
  resetAllGamePopups();
  currentMenuFrame = 0;
  toggleElement("start-overlay", false);
  setMenuVisibility(false, true, false, false);
  initGameEngine();
}

function initGameEngine() {
  const canvas = document.getElementById("gameCanvas");
  const world = new World(canvas);
  const controller = new Controller();
  window.gameEngine = new GameEngine(canvas, controller, world.getFramePackages(), world);
}

function returnToFrame2FromGame() {
  resetAllGamePopups();
  currentMenuFrame = 2;
  toggleElement("start-overlay", true);
  setMenuVisibility(false, true, false, false);
}

function openHighScore() {
  currentMenuFrame = 4;
}

function initDebug() {
  startNewGame();
}

function exitGame() {
  resetAllGamePopups();
  initMenu();
}
