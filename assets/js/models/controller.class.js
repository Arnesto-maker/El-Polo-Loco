/**
 * Unified input controller handling keyboard, touch slider, touch buttons, and key routing.
 */
class Controller {
  /**
   * Initializes control flags, slider state, and binds all input listeners once.
   */
  constructor() {
    this.right = false;
    this.left = false;
    this.space = false;
    this.enter = false;
    this.sliderPointerId = null;
    this.lastSliderDir = 0;
    this.bindKeyboardEvents();
    this.bindTouchSlider();
    this.bindTouchButtons();
  }

  /**
   * Resets all held movement and action states.
   * @returns {void}
   */
  resetStates() {
    this.right = false;
    this.left = false;
    this.space = false;
    this.enter = false;
    this.sliderPointerId = null;
    this.lastSliderDir = 0;
    this.resetSliderVisuals();
  }

  /**
   * Registers global keyboard keydown and keyup listeners.
   * @returns {void}
   */
  bindKeyboardEvents() {
    window.addEventListener("keydown", (event) => {
      this.handleKeyDown(event);
    });
    window.addEventListener("keyup", (event) => {
      this.setContinuousState(event.code, false);
    });
  }

  /**
   * Processes a keyboard press, blocks default Tab focus shift, and routes discrete actions.
   * @param {KeyboardEvent} event - The keyboard event.
   * @returns {void}
   */
  handleKeyDown(event) {
    if (event.code === "Tab" || event.key === "Tab") {
      event.preventDefault();
    }
    this.setContinuousState(event.code, true);
    if (!event.repeat) {
      this.routeDiscreteKey(event.key);
    }
  }

  /**
   * Updates held movement and action flags from keyboard codes.
   * @param {string} code - Physical key code.
   * @param {boolean} state - Active state of the key.
   * @returns {void}
   */
  setContinuousState(code, state) {
    if (code === "ArrowRight" || code === "KeyD") {
      this.right = state;
    } else if (code === "ArrowLeft" || code === "KeyA") {
      this.left = state;
    } else if (code === "Space") {
      this.space = state;
    } else if (code === "Enter" || code === "NumpadEnter") {
      this.enter = state;
    }
  }

  /**
   * Routes discrete control keys to active game popups or menu screens unless portrait-locked.
   * @param {string} key - Logical key name.
   * @returns {void}
   */
  routeDiscreteKey(key) {
    if (isLandscapeLocked()) {
      return;
    }
    if (isSettingsOverlayOpen() && key === "Tab") {
      closeSettingsOverlay();
      return;
    }
    if (window.gameEngine && window.gameEngine.isRunning) {
      window.gameEngine.routePopupKeyDown(key);
    } else {
      handleMenuControlKey(key);
    }
  }

  /**
   * Binds multi-touch pointer events and blocks native browser panning on the slider.
   * @returns {void}
   */
  bindTouchSlider() {
    const slider = document.getElementById("touch-slider");
    if (!slider) {
      return;
    }
    this.blockBrowserTouchScroll(slider);
    slider.addEventListener("pointerdown", (e) => this.startSliderDrag(e, slider));
    slider.addEventListener("pointermove", (e) => this.moveSliderDrag(e, slider));
    slider.addEventListener("pointerup", (e) => this.endSliderDrag(e));
    slider.addEventListener("pointercancel", (e) => this.endSliderDrag(e));
  }

/**
   * Prevents mobile browsers from scrolling or swiping when dragging a touch control.
   * @param {HTMLElement} element - Touch control container.
   * @returns {void}
   */
  blockBrowserTouchScroll(element) {
    element.addEventListener("touchstart", (e) => this.preventIfCancelable(e), { passive: false });
    element.addEventListener("touchmove", (e) => this.preventIfCancelable(e), { passive: false });
  }

  /**
   * Cancels a touch event only when the browser marks it as cancelable.
   * @param {TouchEvent} event - Touch event to guard.
   * @returns {void}
   */
  preventIfCancelable(event) {
    if (event.cancelable) {
      event.preventDefault();
    }
  }

  /**
   * Captures the active pointer when the player touches the movement slider.
   * @param {PointerEvent} event - Pointer down event.
   * @param {HTMLElement} slider - Slider container element.
   * @returns {void}
   */
  startSliderDrag(event, slider) {
    event.preventDefault();
    this.sliderPointerId = event.pointerId;
    slider.setPointerCapture(event.pointerId);
    this.updateSliderPosition(event.clientX, slider);
  }

  /**
   * Updates knob position while dragging the captured pointer.
   * @param {PointerEvent} event - Pointer move event.
   * @param {HTMLElement} slider - Slider container element.
   * @returns {void}
   */
  moveSliderDrag(event, slider) {
    if (event.pointerId !== this.sliderPointerId) {
      return;
    }
    event.preventDefault();
    this.updateSliderPosition(event.clientX, slider);
  }

  /**
   * Releases the slider pointer and centers the knob on touch end.
   * @param {PointerEvent} event - Pointer release event.
   * @returns {void}
   */
  endSliderDrag(event) {
    if (event.pointerId !== this.sliderPointerId) {
      return;
    }
    this.sliderPointerId = null;
    this.lastSliderDir = 0;
    this.left = false;
    this.right = false;
    this.resetSliderVisuals();
  }

  /**
   * Computes clamped knob offset and activates left or right movement.
   * @param {number} clientX - Pointer X coordinate.
   * @param {HTMLElement} slider - Slider container element.
   * @returns {void}
   */
  updateSliderPosition(clientX, slider) {
    const track = slider.querySelector(".slider-track");
    const rect = track.getBoundingClientRect();
    const maxOffset = rect.width * 0.34;
    const rawOffset = clientX - (rect.left + rect.width / 2);
    const clamped = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));
    this.applySliderVisuals(clamped, maxOffset * 0.25);
    this.applySliderDirection(clamped, maxOffset * 0.25);
  }

  /**
   * Moves the slider knob and toggles red glow on active arrows.
   * @param {number} offset - Horizontal knob offset in pixels.
   * @param {number} deadzone - Minimum offset before triggering direction.
   * @returns {void}
   */
  applySliderVisuals(offset, deadzone) {
    const knob = document.getElementById("slider-knob");
    const leftArrow = document.getElementById("slider-arrow-left");
    const rightArrow = document.getElementById("slider-arrow-right");
    knob.style.transform = `translateX(${offset}px)`;
    knob.classList.add("is-active");
    leftArrow.classList.toggle("is-active", offset < -deadzone);
    rightArrow.classList.toggle("is-active", offset > deadzone);
  }

  /**
   * Updates movement flags and triggers Coin Converter arrows on slider push.
   * @param {number} offset - Horizontal knob offset in pixels.
   * @param {number} deadzone - Minimum offset before triggering direction.
   * @returns {void}
   */
  applySliderDirection(offset, deadzone) {
    this.left = offset < -deadzone;
    this.right = offset > deadzone;
    if (this.left && this.lastSliderDir !== -1) {
      this.lastSliderDir = -1;
      this.routeDiscreteKey("ArrowLeft");
    } else if (this.right && this.lastSliderDir !== 1) {
      this.lastSliderDir = 1;
      this.routeDiscreteKey("ArrowRight");
    }
  }

  /**
   * Centers the slider knob and clears all active glow classes.
   * @returns {void}
   */
  resetSliderVisuals() {
    const knob = document.getElementById("slider-knob");
    const leftArrow = document.getElementById("slider-arrow-left");
    const rightArrow = document.getElementById("slider-arrow-right");
    if (knob) {
      knob.style.transform = "translateX(0px)";
      knob.classList.remove("is-active");
    }
    if (leftArrow) {
      leftArrow.classList.remove("is-active");
    }
    if (rightArrow) {
      rightArrow.classList.remove("is-active");
    }
  }

  /**
   * Binds pointer listeners for Tab, B, Space, and Enter touch HUD buttons.
   * @returns {void}
   */
  bindTouchButtons() {
    this.attachTouchButton("touch-btn-tab", "Tab", null);
    this.attachTouchButton("touch-btn-b", "b", null);
    this.attachTouchButton("touch-btn-space", null, "space");
    this.attachTouchButton("touch-btn-enter", "Enter", "enter");
  }

  /**
   * Wires press and release pointer events with red glow to a touch button.
   * @param {string} id - DOM element id.
   * @param {string|null} discreteKey - Discrete key to dispatch on press.
   * @param {string|null} flagName - Continuous controller flag name.
   * @returns {void}
   */
  attachTouchButton(id, discreteKey, flagName) {
    const btn = document.getElementById(id);
    if (!btn) {
      return;
    }
    btn.addEventListener("pointerdown", (e) => {
      this.handleButtonPress(e, btn, discreteKey, flagName);
    });
    btn.addEventListener("pointerup", () => this.handleButtonRelease(btn, flagName));
    btn.addEventListener("pointercancel", () => this.handleButtonRelease(btn, flagName));
    btn.addEventListener("pointerleave", () => this.handleButtonRelease(btn, flagName));
  }

  /**
   * Activates red glow, sets held flag, and dispatches discrete action on press.
   * @param {PointerEvent} event - Pointer down event.
   * @param {HTMLElement} btn - Pressed button element.
   * @param {string|null} discreteKey - Discrete key to dispatch.
   * @param {string|null} flagName - Held flag property name.
   * @returns {void}
   */
  handleButtonPress(event, btn, discreteKey, flagName) {
    event.preventDefault();
    btn.classList.add("is-active");
    if (flagName) {
      this[flagName] = true;
    }
    if (discreteKey) {
      this.routeDiscreteKey(discreteKey);
    }
  }

  /**
   * Clears red glow and resets held action flag on button release.
   * @param {HTMLElement} btn - Released button element.
   * @param {string|null} flagName - Held flag property name.
   * @returns {void}
   */
  handleButtonRelease(btn, flagName) {
    btn.classList.remove("is-active");
    if (flagName) {
      this[flagName] = false;
    }
  }
}