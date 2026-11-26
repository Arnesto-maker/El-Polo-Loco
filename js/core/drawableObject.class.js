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
  currentAnimation = null;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Initializes canvas dimensions and ground floor offset.
   * @param {HTMLCanvasElement|Object} canvas - The game canvas or design dimension object.
   */
  constructor(canvas) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.floor = this.canvasHeight * 0.13;
  }

  /**
   * Returns the Y coordinate where this sprite rests on the desert floor.
   * @returns {number} Ground line Y coordinate.
   */
  getGroundLine() {
    return this.canvasHeight - this.height - this.floor;
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
   * Builds and preloads a sequential numbered sprite array into the image cache.
   * @param {string} basePath - Full path prefix before the frame index.
   * @param {number} start - First frame index inclusive.
   * @param {number} end - Last frame index inclusive.
   * @returns {Array<string>} Preloaded sprite path list.
   */
  loadSpriteRange(basePath, start, end) {
    const paths = [];
    for (let i = start; i <= end; i++) {
      paths.push(`${basePath}${i}.png`);
    }
    this.loadImages(paths);
    return paths;
  }

  /**
   * Advances sprite animation frames immediately on state switch and normalized to dt scale.
   * @param {Array<string>} pathsArray - Ordered animation image paths.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @param {number} [frameDelay=8] - Tick threshold between animation frames.
   * @returns {void}
   */
  playAnimation(pathsArray, scale = 1, frameDelay = 8) {
    if (this.currentAnimation !== pathsArray) {
      this.startNewAnimation(pathsArray);
      return;
    }
    this.frameTick += scale;
    if (this.frameTick >= frameDelay) {
      this.frameTick = 0;
      this.applyAnimationFrame(pathsArray);
    }
  }

  /**
   * Switches immediately to frame 0 of a newly triggered animation sequence.
   * @param {Array<string>} pathsArray - Ordered animation image paths.
   * @returns {void}
   */
  startNewAnimation(pathsArray) {
    this.currentAnimation = pathsArray;
    this.resetAnimationFrame();
    this.applyAnimationFrame(pathsArray);
  }

  /**
   * Assigns the active sprite frame from cache and increments the frame counter.
   * @param {Array<string>} pathsArray - Ordered animation image paths.
   * @returns {void}
   */
  applyAnimationFrame(pathsArray) {
    const index = this.imageCounter % pathsArray.length;
    const path = pathsArray[index];
    this.img = this.imageCache[path];
    this.imageCounter += 1;
  }

  /**
   * Resets animation frame counters to the start of a sequence.
   * @returns {void}
   */
  resetAnimationFrame() {
    this.imageCounter = 0;
    this.frameTick = 0;
  }

  /**
   * Verifies that the active sprite image has finished loading with valid dimensions.
   * @returns {boolean} True when image is ready to draw.
   */
  isImageLoaded() {
    if (this.img && this.img.complete && this.img.naturalWidth > 0) {
      return true;
    }
    return false;
  }

  /**
   * Draws the current sprite image onto the canvas context when loaded.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  draw(ctx) {
    if (!this.isImageLoaded()) {
      return;
    }
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
