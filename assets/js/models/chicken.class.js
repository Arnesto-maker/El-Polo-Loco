class Chicken extends MovableObject {
  IMAGE_0 = "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png";
  IMAGES_WALK = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];
  constructor(canvas) {
    super(canvas);
    this.loadAllImages();
    this.img = this.imageCache[this.IMAGE_0];
    this.width = this.canvasWidth * 0.05;
    this.height = this.canvasHeight * 0.1;
    this.x = 500;
    this.y = this.canvasHeight - this.height - this.floor - 10;
  }
  loadAllImages() {
    this.loadImages([this.IMAGE_0]);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_DEAD);
  }
}
