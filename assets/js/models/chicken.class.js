class Chicken extends MovableObject {
  IMAGE_0 = "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png";
  IMAGES_WALK = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];
  V = 0;
  diection = 1;
  constructor(canvas, minX, maxX) {
    super(canvas);
    this.loadAllImages();
    this.setMainparameter(minX, maxX);
    this.setPatrolRange();
  }

  setMainparameter(minX, maxX) {
    this.img = this.imageCache[this.IMAGE_0];
    this.width = this.canvasWidth * 0.06;
    this.height = this.canvasHeight * 0.11;
    this.x = minX + Math.random() * (maxX - minX);
    this.y = this.canvasHeight - this.height - this.floor - 10;
    this.v = 1.5 + Math.random() * 1.5;
    if (Math.random() < 0.5) {
      this.direction = -1;
    } else {
      this.direction = 1;
    }
  }

  setPatrolRange() {
    this.xMax = 0.25 * this.canvasWidth;
    this.minPatrolX = this.x - this.xMax;
    this.maxPatrolX = this.x + this.xMax;
  }

  loadAllImages() {
    this.loadImages([this.IMAGE_0]);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_DEAD);
  }

  updateMovement() {
    this.x += this.v * this.direction;
    if (this.x >= this.maxPatrolX) {
      this.x = this.maxPatrolX;
      this.direction = -1;
    } else if (this.x <= this.minPatrolX) {
      this.x = this.minPatrolX;
      this.direction = 1;
    }
    this.registerDirectionChange()
  }

  registerDirectionChange() {
    if (this.direction === 1) {
      this.otherDirection = true;
    } else {
      this.otherDirection = false;
    }
  }
  
  update() {
    this.updateMovement();
    this.playAnimation(this.IMAGES_WALK);
  }
}
