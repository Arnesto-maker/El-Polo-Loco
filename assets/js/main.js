let currentMenuFrame = 1;

function setMenuVisibility(showF1, showF2, showAbout) {
  toggleElement("frame-1", showF1);
  toggleElement("frame-2", showF2);
  toggleElement("frame-about", showAbout);
}

function toggleElement(id, show) {
  const el = document.getElementById(id);
  if (show) {
    el.classList.remove("d-none");
  } else {
    el.classList.add("d-none");
  }
}

function initMenu() {
  currentMenuFrame = 1;
  toggleElement("start-overlay", true);
  setMenuVisibility(true, false, false);
}

function handleMenuKeyDown(event) {
  if (currentMenuFrame === 1 && event.key === "Enter") {
    showFrame2();
  } else if (currentMenuFrame === 2 && event.key === "Escape") {
    initMenu();
  } else if (currentMenuFrame === 3 && event.key === "Escape") {
    showFrame2();
  }
}

function showFrame2() {
  currentMenuFrame = 2;
  setMenuVisibility(false, true, false);
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
    window.gameEngine.isPaused = true;
    window.gameEngine = null;
  }
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function openAbout() {
  currentMenuFrame = 3;
  setMenuVisibility(false, false, true);
}

function startNewGame() {
  resetAllGamePopups();
  currentMenuFrame = 0;
  toggleElement("start-overlay", false);
  initGameEngine();
}

function initGameEngine() {
  const canvas = document.getElementById("gameCanvas");
  const world = new World(canvas);
  const controller = new Controller();
  const engine = new GameEngine(canvas, controller, world.getFramePackages(), world);
}

function returnToFrame2FromGame() {
  resetAllGamePopups();
  currentMenuFrame = 2;
  toggleElement("start-overlay", true);
  setMenuVisibility(false, true, false);
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
