let currentMenuFrame = 1;

function initMenu() {
  currentMenuFrame = 1;
  const overlay = document.getElementById("start-overlay");
  const frame1 = document.getElementById("frame-1");
  const frame2 = document.getElementById("frame-2");
  overlay.classList.remove("d-none");
  frame1.classList.remove("d-none");
  frame2.classList.add("d-none");
}

function handleMenuKeyDown(event) {
  if (currentMenuFrame === 1) {
    if (event.key === "Enter") {
      showFrame2();
    }
  }
}

function showFrame2() {
  currentMenuFrame = 2;
  const frame1 = document.getElementById("frame-1");
  const frame2 = document.getElementById("frame-2");
  frame1.classList.add("d-none");
  frame2.classList.remove("d-none");
}


function startNewGame() {
  currentMenuFrame = 0;
  const overlay = document.getElementById("start-overlay");
  overlay.classList.add("d-none");
  initGameEngine();
}

function initGameEngine() {
  const canvas = document.getElementById("gameCanvas");
  const world = new World(canvas);
  const controller = new Controller();
  const engine = new GameEngine(canvas,controller,world.getFramePackages(),world);
}

function openHighScore() {
  // Wird mit der Highscore-Skizze verknüpft
}

/**
 * Platzhalter-Methode für das About-Menü.
 */
function openAbout() {
  // Wird mit der About-Skizze verknüpft
}


function exitGame() {
  initMenu();
}
