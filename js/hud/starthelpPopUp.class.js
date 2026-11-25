/**
 * Controls the unified Help frame shown at game start and from the pause menu.
 */
class StartHelpPopup extends BaseOverlayPopup {
  /**
   * Opens the unified Help overlay immediately upon game start.
   * @param {GameEngine} engine - Active GameEngine instance.
   */
  constructor(engine) {
    super(engine, "frame-help");
    this.pauseAndShow();
  }

  /**
   * Sets the in-game close label and displays the unified Help overlay.
   * @returns {void}
   */
  showOverlay() {
    if (this.overlayElement) {
      setHelpCloseLabel("OK / Continue (Enter)");
    }
    super.showOverlay();
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
   * Resumes gameplay, clears held Enter state, and hides the Help overlay.
   * @returns {void}
   */
  closePopup() {
    this.engine.controller.enter = false;
    this.resumeAndHide();
    blurActiveElement();
  }

  /**
   * Re-opens the unified Help overlay and pauses the engine.
   * @returns {void}
   */
  openPopup() {
    this.pauseAndShow();
  }
}

/**
 * Closes the unified Help frame for active gameplay or returns to Frame 2 in menu mode.
 * @returns {void}
 */
function closeHelpFrame() {
  if (window.gameEngine && window.gameEngine.startHelp && window.gameEngine.startHelp.isOpen) {
    window.gameEngine.startHelp.closePopup();
  } else {
    showFrame2();
  }
}
