/**
 * Collectible desert gold coin with dt-normalized spinning animation.
 */
class Coin extends DrawableObject {
  IMAGES_COIN = ["assets/img/8_coin/coin_1.png", "assets/img/8_coin/coin_2.png"];

  /**
   * Initializes coin sprite, dimensions, coordinates, and collision offsets.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {number} x - Horizontal world position.
   * @param {number} y - Vertical world position.
   */
  constructor(canvas, x, y) {
    super(canvas);
    this.loadImages(this.IMAGES_COIN);
    this.img = this.imageCache[this.IMAGES_COIN[0]];
    this.width = this.canvasWidth * 0.08;
    this.height = this.canvasHeight * 0.12;
    this.x = x;
    this.y = y;
    this.offset = this.setOffsetParameter();
  }

  /**
   * Builds the collision offset box for the coin.
   * @returns {{top: number, bottom: number, left: number, right: number}} Hitbox offsets.
   */
  setOffsetParameter() {
    return {
      top: this.height * 0.3,
      bottom: this.height * 0.3,
      left: this.width * 0.3,
      right: this.width * 0.3,
    };
  }

  /**
   * Updates the coin shimmer animation scaled by delta time.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  update(controller, scale = 1) {
    this.playAnimation(this.IMAGES_COIN, scale);
  }
}