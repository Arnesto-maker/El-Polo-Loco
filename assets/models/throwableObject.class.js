class ThrowableObject extends MovableObject {
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

  hasHit = false;
  height = 60;
  width = 50;
  speedX = 10;
  speedY = 30;
  constructor(x, y) {
    super();
    this.loadimage(
      "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.x = x;
    this.y = y;
    this.applyGravity(this.speedY);
    this.throw()
    this.animate()
  }
  setImageCache(array, object) {
    array.forEach((path) => {
      object[path] = this.createImage(path);
    });
  }

  throw() {
    setInterval(() => {
      if (!this.hasHit) {
        this.x += this.speedX;
      }
    }, 25);
  }

  animate() {
        setInterval(() => {
            if (!this.hasHit && this.isAboveGround()) {
                this.playAnimation(this.IMAGES_ROTATION);
            } 
            else if (this.hasHit) {
                this.playAnimation(this.IMAGES_SPLASH);
            }
        }, 50);
    }

    isAboveGround() {
        return this.y < this.floor;
    }
  
}
