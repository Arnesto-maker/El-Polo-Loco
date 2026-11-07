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

  constructor(canvas, startX, startY, otherDirection, yMax) {
    super(canvas);
    this.loadAllImages();
    this.setMainParameter(startX, startY, otherDirection, yMax);
    this.setDirectionParameter(otherDirection);
    
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
  }

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

  setDirectionParameter(otherDirection) {
    if (otherDirection) {
      this.dir = -1;
    } else {
      this.dir = 1;
    }
    this.xWMax = this.x + this.dir * (this.canvasWidth * 0.15);
  }

  setOffsetParameter() {
    return {
      top: this.height * 0.15,
      bottom: this.height * 0.15,
      left: this.width * 0.15,
      right: this.width * 0.15,
    };
  }

  update() {
    if (this.isSplashing) {
      this.playAnimation(this.IMAGES_SPLASH);
      return;
    }
    this.setFlightSequenz();
    this.playAnimation(this.IMAGES_ROTATION);
    this.checkGroundHit();
  }

  setFlightSequenz() {
    this.x += this.speed * this.dir;
    if (this.hasPassedXWMax()) {
      this.vg += this.gravity;
      this.y += this.vg;
    }
  }

  hasPassedXWMax() {
    if (this.otherDirection) {
      return this.x <= this.xWMax;
    } else {
      return this.x >= this.xWMax;
    }
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
    this.speed = 0;
    this.vg = 0;
    this.imageCounter = 0;
    this.frameTick = 0;
    this.splashTime = performance.now();
  }

}