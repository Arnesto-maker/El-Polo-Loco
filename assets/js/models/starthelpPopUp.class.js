/**
 * Controls the Start Help modal shown at game start and from the pause menu.
 */
class StartHelpPopup {
  /**
   * Opens the Start Help overlay immediately upon game start.
   * @param {GameEngine} engine - Active GameEngine instance.
   */
  constructor(engine) {
    this.engine = engine;
    this.isOpen = true;
    this.engine.isPaused = true;
    this.overlayElement = document.getElementById("start-help-overlay");
    this.showOverlay();
  }

  /**
   * Shows the Start Help overlay element.
   * @returns {void}
   */
  showOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.remove("d-none");
    }
  }

  /**
   * Hides the Start Help overlay element.
   * @returns {void}
   */
  hideOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.add("d-none");
    }
  }

  /**
   * Closes the help overlay when Enter is pressed.
   * @param {string} key - Logical key name.
   * @returns {void}
   */
  handleKeyDown(key) {
    if (this.isOpen && key === "Enter") {
      this.closePopup();
    }
  }

  /**
   * Resumes gameplay and hides the Start Help overlay.
   * @returns {void}
   */
  closePopup() {
    this.isOpen = false;
    this.engine.isPaused = false;
    this.engine.controller.enter = false;
    this.engine.lastBossTick = performance.now();
    this.hideOverlay();
  }

  /**
   * Re-opens the Start Help overlay and pauses the engine.
   * @returns {void}
   */
  openPopup() {
    this.isOpen = true;
    this.engine.isPaused = true;
    this.showOverlay();
  }
}

/**
 * Closes the Start Help popup from its DOM footer click handler.
 * @returns {void}
 */
const closeStartHelpFromDom = () => {
  if (window.gameEngine && window.gameEngine.startHelp) {
    window.gameEngine.startHelp.closePopup();
  }
};