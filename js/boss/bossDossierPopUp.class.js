/**
 * Displays the one-time tactical dossier popup when the Endboss awakens.
 */
class BossDossierPopup extends BaseOverlayPopup {
  /**
   * Initializes dossier visibility state and caches the boss dossier overlay.
   * @param {GameEngine} engine - Active GameEngine instance.
   */
  constructor(engine) {
    super(engine, "boss-dossier-overlay");
    this.hasShown = false;
  }

  /**
   * Opens the dossier once per match and pauses gameplay.
   * @returns {void}
   */
  openPopup() {
    if (!this.hasShown) {
      this.hasShown = true;
      this.pauseAndShow();
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
   * Resumes the boss encounter, clears Enter state, and hides the dossier overlay.
   * @returns {void}
   */
  closePopup() {
    this.engine.controller.enter = false;
    this.resumeAndHide();
  }
}

/**
 * Closes the boss dossier from its DOM footer click handler.
 * @returns {void}
 */
function closeBossDossierFromDom() {
  if (window.gameEngine && window.gameEngine.bossDossier) {
    window.gameEngine.bossDossier.closePopup();
  }
}
