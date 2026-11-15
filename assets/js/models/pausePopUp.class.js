class PausePopup {
  constructor(engine) {
    this.engine = engine;
    this.isOpen = false;
    this.overlayElement = document.getElementById("pause-overlay");
    window.pausePopup = this;
  }


  showOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.remove("d-none");
    }
  }


  hideOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.add("d-none");
    }
  }


  handleKeyDown(key) {
    if (key === "Escape") {
      this.togglePause();
    }
  }

  togglePause() {
    if (this.isAnotherPopupOpen()) {
      return;
    }
    if (this.isOpen) {
      this.resumeGame();
    } else {
      this.openPause();
    }
  }

  isAnotherPopupOpen() {
    const helpOpen = this.engine.startHelp && this.engine.startHelp.isOpen;
    const bossOpen = this.engine.bossDossier && this.engine.bossDossier.isOpen;
    return Boolean(helpOpen || bossOpen);
  }

  openPause() {
    this.isOpen = true;
    this.engine.isPaused = true;
    this.showOverlay();
  }

  resumeGame() {
    this.isOpen = false;
    this.engine.isPaused = false;
    this.engine.lastBossTick = performance.now();
    this.hideOverlay();
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }

  openHelp() {
    this.isOpen = false;
    this.hideOverlay();
    if (this.engine.startHelp) {
      this.engine.startHelp.openPopup();
    }
  }

  exitToMenu() {
    this.isOpen = false;
    this.engine.isPaused = true;
    this.hideOverlay();
    returnToFrame2FromGame();
  }
}

function resumeGameFromDom() {
  if (window.pausePopup) {
    window.pausePopup.resumeGame();
  }
}

function openHelpFromPauseDom() {
  if (window.pausePopup) {
    window.pausePopup.openHelp();
  }
}

function exitToMenuFromPauseDom() {
  if (window.pausePopup) {
    window.pausePopup.exitToMenu();
  }
}
