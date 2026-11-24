/**
 * Displays the one-time tactical dossier popup when the Endboss awakens.
 */
class BossDossierPopup {
  /**
   * Initializes dossier visibility state and caches the DOM overlay.
   * @param {GameEngine} engine - Active GameEngine instance.
   */
  constructor(engine) {
    this.engine = engine;
    this.isOpen = false;
    this.hasShown = false;
    this.overlayElement = document.getElementById("boss-dossier-overlay");
  }

  /**
   * Opens the dossier once per match and pauses gameplay.
   * @returns {void}
   */
  openPopup() {
    if (!this.hasShown) {
      this.hasShown = true;
      this.isOpen = true;
      this.engine.isPaused = true;
      this.showOverlay();
    }
  }

  /**
   * Shows the boss dossier DOM overlay.
   * @returns {void}
   */
  showOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.remove("d-none");
    }
  }

  /**
   * Hides the boss dossier DOM overlay.
   * @returns {void}
   */
  hideOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.add("d-none");
    }
  }

  /**
   * Closes the dossier when Enter is pressed.
   * @param {string} key - Logical key name.
   * @returns {void}
   */
  handleKeyDown(key) {
    if (this.isOpen && key === "Enter") {
      this.closePopup();
    }
  }

  /**
   * Resumes the boss encounter and hides the dossier overlay.
   * @returns {void}
   */
  closePopup() {
    this.isOpen = false;
    this.engine.isPaused = false;
    this.engine.controller.enter = false;
    this.engine.lastBossTick = performance.now();
    this.hideOverlay();
  }
}

/**
 * Closes the boss dossier from its DOM footer click handler.
 * @returns {void}
 */
const closeBossDossierFromDom = () => {
  if (window.gameEngine && window.gameEngine.bossDossier) {
    window.gameEngine.bossDossier.closePopup();
  }
};