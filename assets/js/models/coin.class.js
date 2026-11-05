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
    this.offset = this.setOffsetParameter()
  }

  setOffsetParameter() {
    return {
      top: this.height * 0.3,
      bottom: this.height * 0.3,
      left: this.width * 0.3,
      right: this.width * 0.3,
    };
  }

  update() {
    this.playAnimation(this.IMAGES_COIN);
  }
}
