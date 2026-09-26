class Chicken extends MovableObject {
  x;
  y = 355;
  height = 60;
  width = 60;
  speed = Math.random() * 0.8;
  other_direction = false;
  walking_images = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  isDead = false;
  constructor() {
    super();
    this.x = Math.random() * 500 + 180;
    this.loadimage(
      "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    );

    this.chickenMoving(this.speed);
    this.playEnemyAnimation(this.walking_images,this)
  }
  chickenMoving(speed) {
    setInterval(() => {
      if (!this.other_direction && !this.isDead) {
        this.moveLeft(speed);
      } else if (!this.isDead) {
        this.moveRight(speed);
      }
      if (this.x < 10) {
        this.other_direction = true;
      } else if (this.x > 500) {
        this.other_direction = false;
      }
    }, 1000 / 60);
  }
}
