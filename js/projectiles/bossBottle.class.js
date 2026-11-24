/**
 * Boss radial salvo bottle projectile with dt-normalized ballistic arc and splash SFX.
 */
class BossBottle extends MovableObject {
  isSplashing = false;
  splashTime = 0;
  vX = 0;
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
   * Creates a boss salvo bottle launched with initial velocity components.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {number} startX - Launch X coordinate.
   * @param {number} startY - Launch Y coordinate.
   * @param {number} vX - Horizontal velocity at 60 FPS.
   * @param {number} vY - Initial vertical velocity at 60 FPS.
   */
  constructor(canvas, startX, startY, vX, vY) {
    super(canvas);
    this.loadAllImages();
    this.setMainParameter(startX, startY, vX, vY);
  }

  /**
   * Preloads bottle rotation and splash sprite animations.
   * @returns {void}
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
  }

  /**
   * Sets dimensions, launch coordinates, velocities, gravity, and ground line.
   * @param {number} startX - Launch X coordinate.
   * @param {number} startY - Launch Y coordinate.
   * @param {number} vX - Horizontal velocity at 60 FPS.
   * @param {number} vY - Vertical velocity at 60 FPS.
   * @returns {void}
   */
  setMainParameter(startX, startY, vX, vY) {
    this.img = this.imageCache[this.IMAGES_ROTATION[0]];
    this.width = this.canvasWidth * 0.05;
    this.height = this.canvasHeight * 0.1;
    this.x = startX;
    this.y = startY;
    this.vX = vX;
    this.vg = vY;
    this.gravity = 0.5;
    this.yMax = this.getGroundLine();
  }

  /**
   * Updates ballistic flight or splash animation scaled to 60-FPS delta time.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  update(controller, scale = 1) {
    if (this.isSplashing) {
      this.playAnimation(this.IMAGES_SPLASH, scale);
      return;
    }
    this.advanceFlight(scale);
    this.playAnimation(this.IMAGES_ROTATION, scale);
    this.checkGroundHit();
  }

  /**
   * Moves the salvo bottle horizontally and integrates midpoint gravity.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  advanceFlight(scale = 1) {
    const halfGravity = this.gravity * scale * 0.5;
    this.x += this.vX * scale;
    this.vg += halfGravity;
    this.y += this.vg * scale;
    this.vg += halfGravity;
  }

  /**
   * Triggers splash animation upon hitting the ground floor.
   * @returns {void}
   */
  checkGroundHit() {
    if (this.y >= this.yMax) {
      this.y = this.yMax;
      this.startSplashSequenz();
    }
  }

  /**
   * Stops projectile velocity, plays splash SFX, and starts splash animation.
   * @returns {void}
   */
  startSplashSequenz() {
    if (this.isSplashing) {
      return;
    }
    this.isSplashing = true;
    this.vX = 0;
    this.vg = 0;
    this.resetAnimationFrame();
    this.splashTime = performance.now();
    playBottleSplashSound();
  }

  /**
   * Resets animation frame counters before splashing.
   * @returns {void}
   */
  resetAnimationFrame() {
    this.imageCounter = 0;
    this.frameTick = 0;
  }
}