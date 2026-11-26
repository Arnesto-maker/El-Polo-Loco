/**
 * Base salsa bottle projectile providing shared rotation sprites, splash sequence, and ground detection.
 */
class Projectile extends MovableObject {
  isSplashing = false;
  splashTime = 0;
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
   * Initializes base movable properties and preloads bottle sprite animations.
   * @param {HTMLCanvasElement|Object} canvas - The game canvas or design dimension object.
   */
  constructor(canvas) {
    super(canvas);
    this.loadAllImages();
  }

  /**
   * Preloads bottle rotation and splash sprite frames into the image cache.
   * @returns {void}
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
  }

  /**
   * Sets shared bottle sprite dimensions and initial launch coordinates.
   * @param {number} startX - Launch X coordinate.
   * @param {number} startY - Launch Y coordinate.
   * @returns {void}
   */
  initBaseBounds(startX, startY) {
    this.img = this.imageCache[this.IMAGES_ROTATION[0]];
    this.width = this.canvasWidth * 0.05;
    this.height = this.canvasHeight * 0.1;
    this.x = startX;
    this.y = startY;
  }

  /**
   * Updates projectile flight or splash animation scaled to 60-FPS delta time.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  update(controller, scale = 1) {
    if (this.isSplashing) {
      this.playAnimation(this.IMAGES_SPLASH, scale);
      return;
    }
    this.updateFlight(scale);
    this.playAnimation(this.IMAGES_ROTATION, scale);
    this.checkGroundHit();
  }

  /**
   * Advances flight trajectory for one normalized frame; overridden by subclasses.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  updateFlight(scale = 1) {
    this.integrateMidpointGravity(scale);
  }

  /**
   * Triggers splash animation upon hitting the desert floor line.
   * @returns {void}
   */
  checkGroundHit() {
    if (this.y >= this.yMax) {
      this.y = this.yMax;
      this.startSplashSequenz();
    }
  }

  /**
   * Zeroes projectile velocities upon impact; extended by subclasses with custom velocity fields.
   * @returns {void}
   */
  stopMotion() {
    this.speed = 0;
    this.vg = 0;
  }

  /**
   * Halts motion, plays splash SFX, and starts the splash animation once.
   * @returns {void}
   */
  startSplashSequenz() {
    if (this.isSplashing) {
      return;
    }
    this.isSplashing = true;
    this.stopMotion();
    this.currentAnimation = null;
    this.resetAnimationFrame();
    this.splashTime = performance.now();
    playBottleSplashSound();
  }
}
