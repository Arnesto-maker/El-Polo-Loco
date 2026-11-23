/**
 * Handles mobile touch slider dragging, touch HUD buttons, pointer capture, and touch visual resets.
 */
class TouchInput {
  /**
   * Initializes pointer tracking state and binds all touch slider and button listeners.
   * @param {Controller} controller - Parent unified Controller instance.
   */
  constructor(controller) {
    this.controller = controller;
    this.sliderPointerId = null;
    this.lastSliderDir = 0;
    this.buttonPointers = {};
    this.bindTouchSlider();
    this.bindTouchButtons();
  }

  /**
   * Clears all tracked touch pointers and resets slider and button glow visuals.
   * @returns {void}
   */
  resetVisualsAndPointers = () => {
    this.sliderPointerId = null;
    this.lastSliderDir = 0;
    this.buttonPointers = {};
    this.resetSliderVisuals();
    this.resetAllTouchButtonVisuals();
  };

  /**
   * Removes active glow styling from all four touch HUD buttons.
   * @returns {void}
   */
  resetAllTouchButtonVisuals = () => {
    const ids = ["touch-btn-tab", "touch-btn-b", "touch-btn-space", "touch-btn-enter"];
    for (let i = 0; i < ids.length; i++) {
      const btn = document.getElementById(ids[i]);
      if (btn) {
        btn.classList.remove("is-active");
      }
    }
  };

  /**
   * Prevents mobile browsers from scrolling or swiping when touching HUD controls.
   * @param {HTMLElement} element - Touch control container or button.
   * @returns {void}
   */
  blockBrowserTouchScroll = (element) => {
    element.addEventListener("touchstart", (e) => this.preventIfCancelable(e), { passive: false });
    element.addEventListener("touchmove", (e) => this.preventIfCancelable(e), { passive: false });
  };

  /**
   * Cancels a browser event only when the browser marks it as cancelable.
   * @param {Event} event - Touch event to guard.
   * @returns {void}
   */
  preventIfCancelable = (event) => {
    if (event.cancelable) {
      event.preventDefault();
    }
  };

  /**
   * Safely captures an active pointer ID on an interactive touch element.
   * @param {HTMLElement} element - Target DOM element.
   * @param {number} pointerId - Active pointer identifier.
   * @returns {void}
   */
  captureElementPointer = (element, pointerId) => {
    if (!element.setPointerCapture) {
      return;
    }
    try {
      element.setPointerCapture(pointerId);
    } catch (error) {
      return;
    }
  };

  /**
   * Binds multi-touch pointer events and blocks native browser panning on the slider.
   * @returns {void}
   */
  bindTouchSlider = () => {
    const slider = document.getElementById("touch-slider");
    if (!slider) {
      return;
    }
    this.blockBrowserTouchScroll(slider);
    slider.addEventListener("pointerdown", (e) => this.startSliderDrag(e, slider));
    slider.addEventListener("pointermove", (e) => this.moveSliderDrag(e, slider));
    slider.addEventListener("pointerup", (e) => this.endSliderDrag(e));
    slider.addEventListener("pointercancel", (e) => this.endSliderDrag(e));
    slider.addEventListener("lostpointercapture", (e) => this.endSliderDrag(e));
  };

  /**
   * Captures the active pointer when the player touches the movement slider.
   * @param {PointerEvent} event - Pointer down event.
   * @param {HTMLElement} slider - Slider container element.
   * @returns {void}
   */
  startSliderDrag = (event, slider) => {
    event.preventDefault();
    this.sliderPointerId = event.pointerId;
    this.captureElementPointer(slider, event.pointerId);
    this.updateSliderPosition(event.clientX, slider);
  };

  /**
   * Updates knob position while dragging the captured pointer.
   * @param {PointerEvent} event - Pointer move event.
   * @param {HTMLElement} slider - Slider container element.
   * @returns {void}
   */
  moveSliderDrag = (event, slider) => {
    if (event.pointerId !== this.sliderPointerId) {
      return;
    }
    event.preventDefault();
    this.updateSliderPosition(event.clientX, slider);
  };

  /**
   * Releases the slider pointer, clears movement flags, and centers the knob on touch end.
   * @param {PointerEvent} event - Pointer release event.
   * @returns {void}
   */
  endSliderDrag = (event) => {
    if (event.pointerId !== this.sliderPointerId) {
      return;
    }
    this.sliderPointerId = null;
    this.lastSliderDir = 0;
    this.controller.left = false;
    this.controller.right = false;
    this.resetSliderVisuals();
  };

  /**
   * Computes clamped knob offset and activates left or right movement.
   * @param {number} clientX - Pointer X coordinate.
   * @param {HTMLElement} slider - Slider container element.
   * @returns {void}
   */
  updateSliderPosition = (clientX, slider) => {
    const track = slider.querySelector(".slider-track");
    const rect = track.getBoundingClientRect();
    const maxOffset = rect.width * 0.34;
    const rawOffset = clientX - (rect.left + rect.width / 2);
    const clamped = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));
    this.applySliderVisuals(clamped, maxOffset * 0.25);
    this.applySliderDirection(clamped, maxOffset * 0.25);
  };

  /**
   * Moves the slider knob and toggles red glow on active arrows.
   * @param {number} offset - Horizontal knob offset in pixels.
   * @param {number} deadzone - Minimum offset before triggering direction.
   * @returns {void}
   */
  applySliderVisuals = (offset, deadzone) => {
    const knob = document.getElementById("slider-knob");
    const leftArrow = document.getElementById("slider-arrow-left");
    const rightArrow = document.getElementById("slider-arrow-right");
    knob.style.transform = `translateX(${offset}px)`;
    knob.classList.add("is-active");
    leftArrow.classList.toggle("is-active", offset < -deadzone);
    rightArrow.classList.toggle("is-active", offset > deadzone);
  };

  /**
   * Updates movement flags on the parent Controller and triggers Coin Converter arrows on push.
   * @param {number} offset - Horizontal knob offset in pixels.
   * @param {number} deadzone - Minimum offset before triggering direction.
   * @returns {void}
   */
  applySliderDirection = (offset, deadzone) => {
    this.controller.left = offset < -deadzone;
    this.controller.right = offset > deadzone;
    if (this.controller.left && this.lastSliderDir !== -1) {
      this.lastSliderDir = -1;
      this.controller.routeDiscreteKey("ArrowLeft");
    } else if (this.controller.right && this.lastSliderDir !== 1) {
      this.lastSliderDir = 1;
      this.controller.routeDiscreteKey("ArrowRight");
    }
  };

  /**
   * Centers the slider knob and clears all active glow classes.
   * @returns {void}
   */
  resetSliderVisuals = () => {
    const knob = document.getElementById("slider-knob");
    const leftArrow = document.getElementById("slider-arrow-left");
    const rightArrow = document.getElementById("slider-arrow-right");
    if (knob) {
      knob.style.transform = "translateX(0px)";
      knob.classList.remove("is-active");
    }
    this.clearArrowGlow(leftArrow, rightArrow);
  };

  /**
   * Clears active glow styling from both directional slider arrows.
   * @param {HTMLElement|null} leftArrow - Left slider arrow element.
   * @param {HTMLElement|null} rightArrow - Right slider arrow element.
   * @returns {void}
   */
  clearArrowGlow = (leftArrow, rightArrow) => {
    if (leftArrow) {
      leftArrow.classList.remove("is-active");
    }
    if (rightArrow) {
      rightArrow.classList.remove("is-active");
    }
  };

  /**
   * Binds pointer listeners for Tab, B, Space, and Enter touch HUD buttons.
   * @returns {void}
   */
  bindTouchButtons = () => {
    this.attachTouchButton("touch-btn-tab", "Tab", null);
    this.attachTouchButton("touch-btn-b", "b", null);
    this.attachTouchButton("touch-btn-space", null, "space");
    this.attachTouchButton("touch-btn-enter", "Enter", "enter");
  };

  /**
   * Wires touch-scroll guard, pointer capture, and release listeners to a touch button.
   * @param {string} id - DOM element id.
   * @param {string|null} discreteKey - Discrete key to dispatch on press.
   * @param {string|null} flagName - Continuous controller flag name.
   * @returns {void}
   */
  attachTouchButton = (id, discreteKey, flagName) => {
    const btn = document.getElementById(id);
    if (!btn) {
      return;
    }
    this.blockBrowserTouchScroll(btn);
    btn.addEventListener("pointerdown", (e) => {
      this.handleButtonPress(e, btn, discreteKey, flagName);
    });
    this.bindButtonReleaseEvents(btn, flagName);
  };

  /**
   * Registers release, cancel, and lost-capture listeners for a touch HUD button.
   * @param {HTMLElement} btn - Touch button element.
   * @param {string|null} flagName - Held controller flag name.
   * @returns {void}
   */
  bindButtonReleaseEvents = (btn, flagName) => {
    btn.addEventListener("pointerup", (e) => this.handleButtonRelease(e, btn, flagName));
    btn.addEventListener("pointercancel", (e) => this.handleButtonRelease(e, btn, flagName));
    btn.addEventListener("lostpointercapture", (e) => this.handleButtonRelease(e, btn, flagName));
  };

  /**
   * Captures the pointer, activates red glow, sets held flag, and dispatches discrete action.
   * @param {PointerEvent} event - Pointer down event.
   * @param {HTMLElement} btn - Pressed button element.
   * @param {string|null} discreteKey - Discrete key to dispatch.
   * @param {string|null} flagName - Held flag property name.
   * @returns {void}
   */
  handleButtonPress = (event, btn, discreteKey, flagName) => {
    event.preventDefault();
    this.buttonPointers[btn.id] = event.pointerId;
    this.captureElementPointer(btn, event.pointerId);
    btn.classList.add("is-active");
    if (flagName) {
      this.controller[flagName] = true;
    }
    if (discreteKey) {
      this.controller.routeDiscreteKey(discreteKey);
    }
  };

  /**
   * Releases the tracked button pointer, clears red glow, and resets the held action flag.
   * @param {PointerEvent} event - Pointer release or cancel event.
   * @param {HTMLElement} btn - Released button element.
   * @param {string|null} flagName - Held flag property name.
   * @returns {void}
   */
  handleButtonRelease = (event, btn, flagName) => {
    const activeId = this.buttonPointers[btn.id];
    if (activeId !== undefined && event.pointerId !== activeId) {
      return;
    }
    delete this.buttonPointers[btn.id];
    btn.classList.remove("is-active");
    if (flagName) {
      this.controller[flagName] = false;
    }
  };
}