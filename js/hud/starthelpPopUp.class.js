/**
 * Controls the unified Help frame shown at game start and from the pause menu.
 */
class StartHelpPopup {
  /**
   * Opens the unified Help overlay immediately upon game start.
   * @param {GameEngine} engine - Active GameEngine instance.
   */
  constructor(engine) {
    this.engine = engine;
    this.isOpen = true;
    this.engine.isPaused = true;
    this.overlayElement = document.getElementById("frame-help");
    this.showOverlay();
  }

  /**
   * Shows the unified Help overlay and sets the in-game close label.
   * @returns {void}
   */
  showOverlay() {
    if (this.overlayElement) {
      setHelpCloseLabel("OK / Continue (Enter)");
      this.overlayElement.classList.remove("d-none");
    }
  }

  /**
   * Hides the unified Help overlay element.
   * @returns {void}
   */
  hideOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.add("d-none");
    }
  }

  /**
   * Closes the help overlay when Enter or Tab is pressed.
   * @param {string} key - Logical key name.
   * @returns {void}
   */
  handleKeyDown(key) {
    if (this.isOpen && (key === "Enter" || key === "Tab")) {
      this.closePopup();
    }
  }

  /**
   * Resumes gameplay, resets dt timestamp, and hides the Help overlay.
   * @returns {void}
   */
  closePopup() {
    this.isOpen = false;
    this.engine.isPaused = false;
    this.engine.lastFrameTime = 0;
    this.engine.controller.enter = false;
    this.engine.lastBossTick = performance.now();
    this.hideOverlay();
    blurActiveElement();
  }

  /**
   * Re-opens the unified Help overlay and pauses the engine.
   * @returns {void}
   */
  openPopup() {
    this.isOpen = true;
    this.engine.isPaused = true;
    this.showOverlay();
  }
}

/**
 * Closes the unified Help frame for active gameplay or returns to Frame 2 in menu mode.
 * @returns {void}
 */
const closeHelpFrame = () => {
  if (window.gameEngine && window.gameEngine.startHelp && window.gameEngine.startHelp.isOpen) {
    window.gameEngine.startHelp.closePopup();
  } else {
    showFrame2();
  }
};