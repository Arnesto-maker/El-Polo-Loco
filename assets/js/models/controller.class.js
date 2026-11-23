/**
 * Unified input controller handling keyboard events, touch-only contextmenu blocking, focus resets, and touch delegation.
 */
class Controller {
  /**
   * Initializes control flags, global browser guards, keyboard listeners, and touch input delegation.
   */
  constructor() {
    this.right = false;
    this.left = false;
    this.space = false;
    this.enter = false;
    this.lastPointerType = "mouse";
    this.bindGlobalGuards();
    this.bindKeyboardEvents();
    this.touchInput = new TouchInput(this);
  }

  /**
   * Resets all held movement and action flags along with touch HUD pointers and glow visuals.
   * @returns {void}
   */
  resetStates = () => {
    this.right = false;
    this.left = false;
    this.space = false;
    this.enter = false;
    this.touchInput.resetVisualsAndPointers();
  };

  /**
   * Registers pointer-type tracking, touch-only contextmenu suppression, and focus-loss resets.
   * @returns {void}
   */
  bindGlobalGuards = () => {
    window.addEventListener("pointerdown", (e) => {
      this.lastPointerType = e.pointerType || "mouse";
    }, true);
    window.addEventListener("contextmenu", (e) => this.blockNativeContextMenu(e));
    window.addEventListener("blur", () => this.resetStates());
    this.bindVisibilityReset();
  };

  /**
   * Resets held input flags whenever the browser tab becomes hidden.
   * @returns {void}
   */
  bindVisibilityReset = () => {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.resetStates();
      }
    });
  };

  /**
   * Determines whether a contextmenu event originated from touch or pen input instead of a mouse right-click.
   * @param {MouseEvent|PointerEvent} event - The native contextmenu event.
   * @returns {boolean} True when triggered by touch or pen input.
   */
  isTouchContextMenu = (event) => {
    if (event.pointerType) {
      return event.pointerType !== "mouse";
    }
    return this.lastPointerType !== "mouse";
  };

  /**
   * Suppresses touch long-press context menus outside text inputs while keeping desktop right-click inspect intact.
   * @param {MouseEvent|PointerEvent} event - The native contextmenu event.
   * @returns {void}
   */
  blockNativeContextMenu = (event) => {
    if (event.target && event.target.tagName === "INPUT") {
      return;
    }
    if (this.isTouchContextMenu(event)) {
      event.preventDefault();
    }
  };

  /**
   * Registers global keyboard keydown and keyup listeners.
   * @returns {void}
   */
  bindKeyboardEvents = () => {
    window.addEventListener("keydown", (event) => {
      this.handleKeyDown(event);
    });
    window.addEventListener("keyup", (event) => {
      this.setContinuousState(event.code, false);
    });
  };

  /**
   * Processes a keyboard press, blocks default Tab focus shift, and routes discrete actions.
   * @param {KeyboardEvent} event - The keyboard event.
   * @returns {void}
   */
  handleKeyDown = (event) => {
    if (event.code === "Tab" || event.key === "Tab") {
      event.preventDefault();
    }
    this.setContinuousState(event.code, true);
    if (!event.repeat) {
      this.routeDiscreteKey(event.key);
    }
  };

  /**
   * Updates held movement and action flags from keyboard codes.
   * @param {string} code - Physical key code.
   * @param {boolean} state - Active state of the key.
   * @returns {void}
   */
  setContinuousState = (code, state) => {
    if (code === "ArrowRight" || code === "KeyD") {
      this.right = state;
    } else if (code === "ArrowLeft" || code === "KeyA") {
      this.left = state;
    } else if (code === "Space") {
      this.space = state;
    } else if (code === "Enter" || code === "NumpadEnter") {
      this.enter = state;
    }
  };

  /**
   * Routes discrete control keys to settings, active game popups, or menu screens unless portrait-locked.
   * @param {string} key - Logical key name.
   * @returns {void}
   */
  routeDiscreteKey = (key) => {
    if (isLandscapeLocked()) {
      return;
    }
    if (isSettingsOverlayOpen() && key === "Tab") {
      closeSettingsOverlay();
      return;
    }
    this.dispatchActiveScreenKey(key);
  };

  /**
   * Sends a discrete key to either the running game engine or menu navigation handler.
   * @param {string} key - Logical key name.
   * @returns {void}
   */
  dispatchActiveScreenKey = (key) => {
    if (window.gameEngine && window.gameEngine.isRunning) {
      window.gameEngine.routePopupKeyDown(key);
    } else {
      handleMenuControlKey(key);
    }
  };
}