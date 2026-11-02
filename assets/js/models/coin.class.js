class Coin extends DrawableObject {
  IMAGES_COIN = [
    "assets/img/8_coin/coin_1.png",
    "assets/img/8_coin/coin_2.png",
  ];
  constructor(canvas, x, y) {
    super(canvas);
    this.loadImages(this.IMAGES_COIN);
    this.img = this.imageCache[this.IMAGES_COIN[0]];
    this.width = this.canvasWidth * 0.08;
    this.height = this.canvasHeight * 0.12;
    this.x = x;
    this.y = y;
  }
  update() {
    this.playAnimation(this.IMAGES_COIN);
  }
}
