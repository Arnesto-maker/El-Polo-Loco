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
  } else if (currentMenuFrame === 3 && event.key === "Escape") {
    showFrame2();
  }
}

function showFrame2() {
  currentMenuFrame = 2;
  setMenuVisibility(false, true, false);
}

function openAbout() {
  currentMenuFrame = 3;
  setMenuVisibility(false, false, true);
}


function startNewGame() {
  currentMenuFrame = 0;
  toggleElement("start-overlay", false);
  initGameEngine();
}

function initGameEngine() {
  const canvas = document.getElementById("gameCanvas");
  const world = new World(canvas);
  const controller = new Controller();
  const engine = new GameEngine(canvas,controller,world.getFramePackages(),world);
}

function openHighScore() {
  currentMenuFrame = 4;
}




function exitGame() {
  initMenu();
}
