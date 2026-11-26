/**
 * Displays the one-time animated tactical dossier popup when the Endboss awakens.
 */
class BossDossierPopup extends BaseOverlayPopup {
  /**
   * Initializes dossier visibility state, animator, and cached DOM elements.
   * @param {GameEngine} engine - Active GameEngine instance.
   */
  constructor(engine) {
    super(engine, "boss-dossier-overlay");
    this.hasShown = false;
    this.hintElement = document.getElementById("dossier-scene-hint");
    this.canvasElement = document.getElementById("boss-dossier-canvas");
    this.animator = new BossDossierAnimator(engine, this.updateSceneHint.bind(this));
  }

  /**
   * Updates the accessible scene hint label via innerText when scenes switch.
   * @param {number} sceneIndex - Active animation scene index (0 or 1).
   * @returns {void}
   */
  updateSceneHint(sceneIndex) {
    if (!this.hintElement) {
      return;
    }
    if (sceneIndex === 0) {
      this.hintElement.innerText = "Use jump throw to deal critical damage.";
    } else {
      this.hintElement.innerText = "Avoid salvo attack at all cost.!!!";
    }
  }

  /**
   * Opens the dossier once per match, pauses gameplay, and starts the scene loop.
   * @returns {void}
   */
  openPopup() {
    if (!this.hasShown) {
      this.hasShown = true;
      this.pauseAndShow();
      this.animator.start(this.canvasElement);
    }
  }

  /**
   * Closes the dossier immediately whenever Enter is pressed during the loop.
   * @param {string} key - Logical key name.
   * @returns {void}
   */
  handleKeyDown(key) {
    if (this.isOpen && key === "Enter") {
      this.closePopup();
    }
  }

  /**
   * Stops the dossier animation loop, clears Enter state, and resumes the boss fight.
   * @returns {void}
   */
  closePopup() {
    this.animator.stop();
    this.engine.controller.enter = false;
    this.resumeAndHide();
  }
}

/**
 * Closes the boss dossier from its DOM continue button click handler.
 * @returns {void}
 */
function closeBossDossierFromDom() {
  if (window.gameEngine && window.gameEngine.bossDossier) {
    window.gameEngine.bossDossier.closePopup();
  }
}
