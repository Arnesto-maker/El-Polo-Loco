
class StartHelpPopup {
  constructor(engine) {
    this.engine = engine;
    this.isOpen = true;
    this.engine.isPaused = true;
    this.overlayElement = document.getElementById("start-help-overlay");
    this.showOverlay();
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
    if (this.isOpen) {
      if (key === "Enter") {
        this.closePopup();
      }
    }
  }

  closePopup() {
    this.isOpen = false;
    this.engine.isPaused = false;
    this.engine.controller.enter = false;
    this.engine.lastBossTick = performance.now();
    this.hideOverlay();
  }

  openPopup() {
    this.isOpen = true;
    this.engine.isPaused = true;
    this.showOverlay();
  }
}

function closeStartHelpFromDom() {
  if (window.gameEngine && window.gameEngine.startHelpPopup) {
    window.gameEngine.startHelpPopup.closePopup();
  }
}