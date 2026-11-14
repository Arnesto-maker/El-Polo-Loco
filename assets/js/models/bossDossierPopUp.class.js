
class BossDossierPopup {
  constructor(engine) {
    this.engine = engine;
    this.isOpen = false;
    this.hasShown = false;
    this.overlayElement = document.getElementById("boss-dossier-overlay");
  }

  openPopup() {
    if (!this.hasShown) {
      this.hasShown = true;
      this.isOpen = true;
      this.engine.isPaused = true;
      this.showOverlay();
    }
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
}

function closeBossDossierFromDom() {
  if (window.gameEngine && window.gameEngine.bossDossierPopup) {
    window.gameEngine.bossDossierPopup.closePopup();
  }
}