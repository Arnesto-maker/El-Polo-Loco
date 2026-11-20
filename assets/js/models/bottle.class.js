/**
 * Collectible ground salsa bottle spawned randomly within a level sector.
 */
class Bottle extends DrawableObject {
  IMAGES_GROUND = [
    "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Initializes a collectible salsa bottle placed within the given X sector.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {number} sectorMinX - Left sector boundary.
   * @param {number} sectorMaxX - Right sector boundary.
   */
  constructor(canvas, sectorMinX, sectorMaxX) {
    super(canvas);
    this.initBottleImage();
    this.setBottleParameter(sectorMaxX, sectorMinX);
    this.offset = this.setOffsetParameter();
  }

  /**
   * Randomly selects one of two ground salsa bottle sprite variants.
   * @returns {void}
   */
  initBottleImage() {
    let randomPath;
    if (Math.random() < 0.5) {
      randomPath = this.IMAGES_GROUND[0];
    } else {
      randomPath = this.IMAGES_GROUND[1];
    }
    this.loadImage(randomPath);
  }

  /**
   * Sets bottle size, ground alignment, and random X position inside the sector.
   * @param {number} sectorMaxX - Right sector boundary.
   * @param {number} sectorMinX - Left sector boundary.
   * @returns {void}
   */
  setBottleParameter(sectorMaxX, sectorMinX) {
    this.width = this.canvasWidth * 0.05;
    this.height = this.canvasHeight * 0.11;
    this.y = this.canvasHeight - this.height - this.floor;
    const availableWidth = sectorMaxX - sectorMinX - this.width;
    this.x = sectorMinX + Math.random() * availableWidth;
  }

  /**
   * Builds the collision offset box for the ground bottle.
   * @returns {{top: number, bottom: number, left: number, right: number}} Hitbox offsets.
   */
  setOffsetParameter() {
    return {
      top: this.height * 0.15,
      bottom: this.height * 0.05,
      left: this.width * 0.2,
      right: this.width * 0.2,
    };
  }
}