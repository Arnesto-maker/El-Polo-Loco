/**
 * Manages the in-game pause menu overlay, Sperrframe resume flow, and transitions to Settings, Help, or Menu.
 */
class PausePopup {
  /**
   * Initializes pause state and registers the active pause popup reference.
   * @param {GameEngine} engine - Active GameEngine instance.
   */
  constructor(engine) {
    this.engine = engine;
    this.isOpen = false;
    this.overlayElement = document.getElementById("pause-overlay");
    window.pausePopup = this;
  }

  /**
   * Makes the pause overlay visible.
   * @returns {void}
   */
  showOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.remove("d-none");
    }
  }

  /**
   * Hides the pause overlay.
   * @returns {void}
   */
  hideOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.add("d-none");
    }
  }

  /**
   * Toggles the pause menu when the Tab key is pressed.
   * @param {string} key - Logical key name.
   * @returns {void}
   */
  handleKeyDown(key) {
    if (key === "Tab") {
      this.togglePause();
    }
  }

  /**
   * Opens or closes the pause overlay unless another modal popup is open.
   * @returns {void}
   */
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

  /**
   * Opens the pause overlay after returning from portrait lock unless another popup is active.
   * @returns {void}
   */
  openPauseFromLandscapeLock() {
    if (this.isAnotherPopupOpen() || isSettingsOverlayOpen()) {
      return;
    }
    this.openPause();
  }

  /**
   * Checks whether Start Help, Boss Dossier, or Coin Converter is currently open.
   * @returns {boolean} True if another popup blocks pausing.
   */
  isAnotherPopupOpen() {
    const helpOpen = this.engine.startHelp && this.engine.startHelp.isOpen;
    const bossOpen = this.engine.bossDossier && this.engine.bossDossier.isOpen;
    const convOpen = this.engine.coinConverter && this.engine.coinConverter.isOpen;
    return Boolean(helpOpen || bossOpen || convOpen);
  }

  /**
   * Pauses the game loop and displays the pause menu.
   * @returns {void}
   */
  openPause() {
    this.isOpen = true;
    this.engine.isPaused = true;
    this.showOverlay();
  }

  /**
   * Resumes the game loop and closes the pause menu.
   * @returns {void}
   */
  resumeGame() {
    this.isOpen = false;
    this.engine.isPaused = false;
    this.engine.lastFrameTime = 0;
    this.engine.lastBossTick = performance.now();
    this.hideOverlay();
    blurActiveElement();
  }

  /**
   * Hides the pause menu temporarily and opens Settings (Konstruktion 2a).
   * @returns {void}
   */
  openSettings() {
    this.hideOverlay();
    openSettingsOverlay("pause");
  }

  /**
   * Closes the pause menu and opens the Start Help overlay.
   * @returns {void}
   */
  openHelp() {
    this.isOpen = false;
    this.hideOverlay();
    if (this.engine.startHelp) {
      this.engine.startHelp.openPopup();
    }
  }

  /**
   * Exits the active session and returns to the main menu.
   * @returns {void}
   */
  exitToMenu() {
    this.isOpen = false;
    this.engine.isPaused = true;
    this.hideOverlay();
    returnToFrame2FromGame();
  }
}

/**
 * Resumes gameplay from the pause overlay DOM button.
 * @returns {void}
 */
const resumeGameFromDom = () => {
  if (window.pausePopup) {
    window.pausePopup.resumeGame();
  }
};

/**
 * Opens the settings overlay from the pause menu DOM button.
 * @returns {void}
 */
const openSettingsFromPauseDom = () => {
  if (window.pausePopup) {
    window.pausePopup.openSettings();
  }
};

/**
 * Opens the help overlay from the pause menu DOM button.
 * @returns {void}
 */
const openHelpFromPauseDom = () => {
  if (window.pausePopup) {
    window.pausePopup.openHelp();
  }
};

/**
 * Exits back to main menu from the pause menu DOM button.
 * @returns {void}
 */
const exitToMenuFromPauseDom = () => {
  if (window.pausePopup) {
    window.pausePopup.exitToMenu();
  }
};