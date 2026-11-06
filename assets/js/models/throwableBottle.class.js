class ThrowableBottle extends MovableObject {
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

  constructor(canvas, startX, startY, otherDirection, groundLineY) {
    super(canvas);
    this.loadAllImages();
    this.setStartingParameter(startX, startY, otherDirection);
    this.setThrowingparameter(groundLineY);
    this.setSplashingStatus();
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.img = this.imageCache[this.IMAGES_ROTATION[0]];
  }

  setStartingParameter(startX, startY, otherDirection) {
    this.width = this.canvasWidth * 0.04;
    this.height = this.canvasHeight * 0.08;
    this.x = startX;
    this.y = startY;
    this.otherDirection = otherDirection;
    if (otherDirection) {
      this.dir = -1;
    } else {
      this.dir = 1;
    }
  }

  setThrowingparameter(groundLineY) {
    this.wSpeed = 10;
    this.xWMax = this.x + this.dir * (this.canvasWidth * 0.15);
    this.vg = 0;
    this.gravity = 0.6;
    this.yMax = groundLineY - this.height;
  }

  setSplashingStatus() {
    this.isSplashing = false;
    this.splashTime = 0;
  }

  checkMaximumThrowingRange() {
    const passedXWMaxRight = !this.otherDirection && this.x >= this.xWMax;
    const passedXWMaxLeft = this.otherDirection && this.x <= this.xWMax;
    if (passedXWMaxRight || passedXWMaxLeft) {
      this.vg += this.gravity;
      this.y += this.vg;
    }
  }

  handleBottleContactWithGround() {
    if (this.y >= this.yMax) {
      this.y = this.yMax;
      this.triggerSplash();
    }
  }

  update() {
    if (this.isSplashing) {
      this.playAnimation(this.IMAGES_SPLASH);
      return;
    }
    this.x += this.wSpeed * this.dir;
    this.checkMaximumThrowingRange();
    this.playAnimation(this.IMAGES_ROTATION);
    this.handleBottleContactWithGround();
  }

  resetFrameCounter() {
    this.imageCounter = 0;
    this.frameTick = 0;
  }

  triggerSplash() {
    if (this.isSplashing) return;
    this.isSplashing = true;
    this.wSpeed = 0;
    this.vg = 0;
    this.resetFrameCounter();
    this.splashTime = performance.now();
  }
}
