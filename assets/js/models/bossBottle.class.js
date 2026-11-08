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

  constructor(canvas, startX, startY, vX, vY) {
    super(canvas);
    this.loadAllImages();
    this.setMainParameter(startX, startY, vX, vY);
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
  }

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

  update() {
    if (this.isSplashing) {
      this.playAnimation(this.IMAGES_SPLASH);
      return;
    }
    this.x += this.vX;
    this.y += this.vg;
    this.vg += this.gravity;
    this.playAnimation(this.IMAGES_ROTATION);
    this.checkGroundHit();
  }

  checkGroundHit() {
    if (this.y >= this.yMax) {
      this.y = this.yMax;
      this.startSplashSequenz();
    }
  }

  startSplashSequenz() {
    if (this.isSplashing) {
      return;
    }
    this.isSplashing = true;
    this.vX = 0;
    this.vg = 0;
    this.resetAnimationFrame();
    this.splashTime = performance.now();
  }

  resetAnimationFrame() {
    this.imageCounter = 0;
    this.frameTick = 0;
  }
}