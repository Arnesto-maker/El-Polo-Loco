/**
 * Renders the Endboss graphical armor bar with hit-shake feedback and a one-shot shatter animation.
 */
class BossArmourBar {
  /**
   * Initializes armor bar caches, shake parameters, and animation state.
   * @param {BossHud} bossHud - Parent BossHud renderer instance.
   */
  constructor(bossHud) {
    this.hud = bossHud;
    this.cache = {};
    this.frameDurationMs = 65;
    this.shakeDurationMs = 260;
    this.shakeIntensity = 12;
    this.initState();
    this.ARMOUR_IMAGES = this.buildArmourPaths();
    this.BREAK_IMAGES = this.buildBreakPaths();
    this.preloadImages(this.ARMOUR_IMAGES);
    this.preloadImages(this.BREAK_IMAGES);
  }

  /**
   * Initializes runtime state flags for armor tracking, hit shake, and shatter playback.
   * @returns {void}
   */
  initState = () => {
    this.wasActive = false;
    this.isBreaking = false;
    this.isBroken = false;
    this.breakStartTime = 0;
    this.lastArmour = 100;
    this.shakeStartTime = 0;
  };

  /**
   * Builds the 14 ordered armor bar image paths from 100% down to 0% in 8% steps.
   * @returns {Array<string>} Ordered armor sprite path list.
   */
  buildArmourPaths = () => {
    const steps = [100, 92, 84, 76, 68, 60, 52, 44, 36, 28, 20, 12, 4, 0];
    const paths = [];
    const base = "assets/img/7_statusbars/4_statusbar_armour/armour_";
    for (let i = 0; i < steps.length; i++) {
      paths.push(`${base}${steps[i]}.png`);
    }
    return paths;
  };

  /**
   * Builds the 14 sequential shatter animation image paths.
   * @returns {Array<string>} Ordered armor break frame paths.
   */
  buildBreakPaths = () => {
    const paths = [];
    const base = "assets/img/7_statusbars/4_statusbar_armour/break/break_";
    for (let i = 1; i <= 14; i++) {
      paths.push(`${base}${i}.png`);
    }
    return paths;
  };

  /**
   * Preloads all sprite images from a path array into the local cache.
   * @param {Array<string>} paths - Image asset paths to preload.
   * @returns {void}
   */
  preloadImages = (paths) => {
    for (let i = 0; i < paths.length; i++) {
      const img = new Image();
      img.src = paths[i];
      this.cache[paths[i]] = img;
    }
  };

  /**
   * Maps current boss armor points (0 to 100) to the matching 8% sprite index.
   * @param {number} armour - Current boss armor value.
   * @returns {number} Index in ARMOUR_IMAGES (0 to 13).
   */
  getArmourIndex = (armour) => {
    if (armour <= 0) {
      return 13;
    }
    const index = Math.floor((100 - armour) / 8);
    if (index < 0) {
      return 0;
    }
    if (index > 12) {
      return 12;
    }
    return index;
  };

  /**
   * Restores active armor state whenever armor is above zero.
   * @returns {void}
   */
  resetActiveState = () => {
    this.wasActive = true;
    this.isBreaking = false;
    this.isBroken = false;
  };

  /**
   * Triggers the shake timer whenever armor decreases from a boss hit.
   * @param {number} armour - Current boss armor value.
   * @returns {void}
   */
  detectArmourHit = (armour) => {
    if (armour < this.lastArmour) {
      this.shakeStartTime = performance.now();
    }
    this.lastArmour = armour;
  };

  /**
   * Detects hits and the transition from active armor to zero to start the break animation once.
   * @param {number} armour - Current boss armor value.
   * @returns {void}
   */
  checkBreakTrigger = (armour) => {
    this.detectArmourHit(armour);
    if (armour > 0) {
      this.resetActiveState();
      return;
    }
    if (this.wasActive && !this.isBreaking && !this.isBroken) {
      this.isBreaking = true;
      this.breakStartTime = performance.now();
    }
  };

  /**
   * Calculates the damped horizontal and vertical pixel offset during an active hit shake.
   * @returns {{x: number, y: number}} Current shake offset in logical canvas pixels.
   */
  getShakeOffset = () => {
    const elapsed = performance.now() - this.shakeStartTime;
    if (this.shakeStartTime === 0 || elapsed >= this.shakeDurationMs) {
      return { x: 0, y: 0 };
    }
    const amp = this.shakeIntensity * (1 - elapsed / this.shakeDurationMs);
    return {
      x: Math.sin(elapsed * 0.09) * amp,
      y: Math.cos(elapsed * 0.13) * amp * 0.5,
    };
  };

  /**
   * Returns the active shatter frame or finalizes removal once all frames have played.
   * @returns {HTMLImageElement|null} Current shatter frame image or null when finished.
   */
  getBreakFrameImage = () => {
    const elapsed = performance.now() - this.breakStartTime;
    const frameIndex = Math.floor(elapsed / this.frameDurationMs);
    if (frameIndex >= this.BREAK_IMAGES.length) {
      this.isBreaking = false;
      this.isBroken = true;
      return null;
    }
    return this.cache[this.BREAK_IMAGES[frameIndex]];
  };

  /**
   * Resolves which sprite image should be drawn for the current armor state.
   * @param {number} armour - Current boss armor value.
   * @returns {HTMLImageElement|null} Sprite to draw, or null if hidden.
   */
  getCurrentImage = (armour) => {
    this.checkBreakTrigger(armour);
    if (this.isBroken) {
      return null;
    }
    if (this.isBreaking) {
      return this.getBreakFrameImage();
    }
    return this.cache[this.ARMOUR_IMAGES[this.getArmourIndex(armour)]];
  };

  /**
   * Draws the armor bar or break sequence with hit-shake offset beneath the boss health bar.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  draw = (ctx) => {
    const img = this.getCurrentImage(this.hud.bar.bossArmour);
    if (!img || !img.complete) {
      return;
    }
    const shake = this.getShakeOffset();
    const x = this.hud.getBossBarX(ctx) + shake.x;
    const y = this.hud.bar.y + this.hud.bar.height + 16 + shake.y;
    ctx.drawImage(img, x, y, this.hud.bar.width, this.hud.bar.height * 0.85);
  };
}