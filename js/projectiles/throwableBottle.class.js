/**
 * Player-thrown salsa bottle projectile with dt-normalized flight arc and splash animation.
 */
class ThrowableBottle extends MovableObject {
  isSplashing = false;
  splashTime = 0;
  dir = 1;
  xWMax = 0;
  IMAGES_ROTATION = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGES_SPLASH = [
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Creates a thrown salsa bottle launched from Pepe's position.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {number} startX - Launch X coordinate.
   * @param {number} startY - Launch Y coordinate.
   * @param {boolean} otherDirection - True when thrown left.
   * @param {number} yMax - Ground splash Y limit.
   */
  constructor(canvas, startX, startY, otherDirection, yMax) {
    super(canvas);
    this.loadAllImages();
    this.setMainParameter(startX, startY, otherDirection, yMax);
    this.setDirectionParameter(otherDirection);
  }

  /**
   * Preloads bottle rotation and splash sprite frames.
   * @returns {void}
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
  }

  /**
   * Configures dimensions, velocity, gravity, and hitbox offsets.
   * @param {number} startX - Launch X coordinate.
   * @param {number} startY - Launch Y coordinate.
   * @param {boolean} otherDirection - True when thrown left.
   * @param {number} yMax - Ground splash Y limit.
   * @returns {void}
   */
  setMainParameter(startX, startY, otherDirection, yMax) {
    this.img = this.imageCache[this.IMAGES_ROTATION[0]];
    this.width = this.canvasWidth * 0.05;
    this.height = this.canvasHeight * 0.1;
    this.x = startX;
    this.y = startY;
    this.otherDirection = otherDirection;
    this.speed = 10;
    this.gravity = 0.6;
    this.yMax = yMax;
    this.offset = this.setOffsetParameter();
  }

  /**
   * Computes horizontal direction sign and straight-flight threshold before gravity applies.
   * @param {boolean} otherDirection - True when thrown left.
   * @returns {void}
   */
  setDirectionParameter(otherDirection) {
    if (otherDirection) {
      this.dir = -1;
    } else {
      this.dir = 1;
    }
    this.xWMax = this.x + this.dir * (this.canvasWidth * 0.15);
  }

  /**
   * Builds the collision offset box for the thrown bottle.
   * @returns {{top: number, bottom: number, left: number, right: number}} Hitbox offsets.
   */
  setOffsetParameter() {
    return {
      top: this.height * 0.15,
      bottom: this.height * 0.15,
      left: this.width * 0.15,
      right: this.width * 0.15,
    };
  }

  /**
   * Updates bottle flight physics or splash animation scaled to 60-FPS delta time.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  update(controller, scale = 1) {
    if (this.isSplashing) {
      this.playAnimation(this.IMAGES_SPLASH, scale);
      return;
    }
    this.setFlightSequenz(scale);
    this.playAnimation(this.IMAGES_ROTATION, scale);
    this.checkGroundHit();
  }

  /**
   * Advances horizontal travel and midpoint gravity drop once past xWMax.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  setFlightSequenz(scale = 1) {
    this.x += this.speed * this.dir * scale;
    if (this.hasPassedXWMax()) {
      const halfGravity = this.gravity * scale * 0.5;
      this.vg += halfGravity;
      this.y += this.vg * scale;
      this.vg += halfGravity;
    }
  }

  /**
   * Checks whether the bottle has traveled past its straight-flight apex distance.
   * @returns {boolean} True when gravity arc should begin.
   */
  hasPassedXWMax() {
    if (this.otherDirection) {
      return this.x <= this.xWMax;
    }
    return this.x >= this.xWMax;
  }

  /**
   * Triggers bottle splash upon reaching the desert floor.
   * @returns {void}
   */
  checkGroundHit() {
    if (this.y >= this.yMax) {
      this.y = this.yMax;
      this.startSplashSequenz();
    }
  }

  /**
   * Halts bottle motion, starts the shatter animation, and plays splash SFX.
   * @returns {void}
   */
  startSplashSequenz() {
    if (this.isSplashing) {
      return;
    }
    this.isSplashing = true;
    this.speed = 0;
    this.vg = 0;
    this.imageCounter = 0;
    this.frameTick = 0;
    this.splashTime = performance.now();
    playBottleSplashSound();
  }
}