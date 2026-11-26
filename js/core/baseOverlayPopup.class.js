/**
 * Base DOM overlay popup controller managing visibility and engine pause transitions.
 */
class BaseOverlayPopup {
  /**
   * Binds the engine reference and caches an optional target DOM overlay element.
   * @param {GameEngine} engine - Active GameEngine instance.
   * @param {string|null} [overlayId=null] - DOM element ID of the popup container or null for canvas popups.
   */
  constructor(engine, overlayId = null) {
    this.engine = engine;
    this.isOpen = false;
    this.overlayElement = null;
    if (overlayId) {
      this.overlayElement = document.getElementById(overlayId);
    }
  }

  /**
   * Makes the cached DOM overlay element visible.
   * @returns {void}
   */
  showOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.remove("d-none");
    }
  }

  /**
   * Hides the cached DOM overlay element.
   * @returns {void}
   */
  hideOverlay() {
    if (this.overlayElement) {
      this.overlayElement.classList.add("d-none");
    }
  }

  /**
   * Marks the popup open, pauses the engine, and displays the overlay.
   * @returns {void}
   */
  pauseAndShow() {
    this.isOpen = true;
    this.engine.isPaused = true;
    this.showOverlay();
  }

  /**
   * Marks the popup closed, resumes the engine with reset timers, and hides the overlay.
   * @returns {void}
   */
  resumeAndHide() {
    this.isOpen = false;
    this.engine.isPaused = false;
    this.engine.lastFrameTime = 0;
    this.engine.lastBossTick = performance.now();
    this.hideOverlay();
  }
}
