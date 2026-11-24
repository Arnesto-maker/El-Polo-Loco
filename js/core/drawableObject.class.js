/**
 * Base renderable sprite entity supporting image caching, dt-scaled animations, and hitboxes.
 */
class DrawableObject {
  x = 0;
  y = 0;
  width = 100;
  height = 100;
  floor = 0;
  img = new Image();
  imageCache = {};
  imageCounter = 0;
  frameTick = 0;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Initializes canvas dimensions and ground floor offset.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   */
  constructor(canvas) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.floor = this.canvasHeight * 0.13;
  }

  /**
   * Loads a single image directly onto this sprite.
   * @param {string} path - Image asset path.
   * @returns {void}
   */
  loadImage(path) {
    this.img.src = path;
  }

  /**
   * Preloads an array of sprite image paths into the internal cache.
   * @param {Array<string>} pathsArray - List of sprite asset paths.
   * @returns {void}
   */
  loadImages(pathsArray) {
    for (let i = 0; i < pathsArray.length; i++) {
      const path = pathsArray[i];
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    }
  }

  /**
   * Advances sprite animation frames normalized to a 60-FPS delta scale.
   * @param {Array<string>} pathsArray - Ordered animation image paths.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  playAnimation(pathsArray, scale = 1) {
    this.frameTick += scale;
    if (this.frameTick >= 8) {
      this.frameTick = 0;
      const index = this.imageCounter % pathsArray.length;
      const path = pathsArray[index];
      this.img = this.imageCache[path];
      this.imageCounter += 1;
    }
  }

  /**
   * Draws the current sprite image onto the canvas context.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Configures stroke styling for debug hitbox visualization.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  setHitBoxParameter(ctx) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
  }

  /**
   * Renders the offset-adjusted collision rectangle for debugging.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawHitbox(ctx) {
    ctx.save();
    ctx.beginPath();
    this.setHitBoxParameter(ctx);
    ctx.rect(
      this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom
    );
    ctx.stroke();
    ctx.restore();
  }
}