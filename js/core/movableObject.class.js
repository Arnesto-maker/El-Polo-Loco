/**
 * Base physics-enabled entity providing dt-normalized gravity, collisions, mirroring, and animations.
 */
class MovableObject {
  x = 0;
  y = 0;
  speed = 0;
  width = 100;
  height = 100;
  vg = 0;
  gravity = 0.8;
  yMax = 0;
  floor = 0;
  img = new Image();
  otherDirection = false;
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
   * Initializes canvas metrics and floor baseline for the movable entity.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   */
  constructor(canvas) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.floor = this.canvasHeight * 0.13;
  }

  /**
   * Returns the Y coordinate where this entity rests on the desert floor.
   * @returns {number} Ground line Y coordinate.
   */
  getGroundLine() {
    return this.canvasHeight - this.height - this.floor;
  }

  /**
   * Checks whether the entity is currently airborne above the ground line.
   * @returns {boolean} True if above ground.
   */
  isAboveGround() {
    return this.y < this.getGroundLine();
  }

  /**
   * Applies gravity when airborne or snaps the entity cleanly to the floor.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  setGravitation(scale = 1) {
    const groundLine = this.getGroundLine();
    if (this.isAboveGround() || this.vg < 0) {
      this.applyVerticalMovement(scale);
    } else {
      this.y = groundLine;
      this.vg = 0;
    }
  }

  /**
   * Integrates vertical velocity and position using frame-rate-independent midpoint gravity.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  applyVerticalMovement(scale = 1) {
    const halfGravity = this.gravity * scale * 0.5;
    this.vg += halfGravity;
    this.y += this.vg * scale;
    this.vg += halfGravity;
    if (this.y <= this.yMax) {
      this.y = this.yMax;
      this.vg = this.gravity;
    }
  }

  /**
   * Tests whether this entity's right hitbox edge overlaps another entity's left edge.
   * @param {Object} obj - Target collidable entity.
   * @returns {boolean} True when overlapping horizontally from left.
   */
  checkRightEdgeHitsLeft(obj) {
    return this.x + this.width - this.offset.right >= obj.x + obj.offset.left;
  }

  /**
   * Tests whether this entity's left hitbox edge overlaps another entity's right edge.
   * @param {Object} obj - Target collidable entity.
   * @returns {boolean} True when overlapping horizontally from right.
   */
  checkLeftEdgeHitsRight(obj) {
    return this.x + this.offset.left <= obj.x + obj.width - obj.offset.right;
  }

  /**
   * Tests whether this entity's bottom hitbox edge overlaps another entity's top edge.
   * @param {Object} obj - Target collidable entity.
   * @returns {boolean} True when overlapping vertically from above.
   */
  checkBottomEdgeHitsTop(obj) {
    return this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top;
  }

  /**
   * Tests whether this entity's top hitbox edge overlaps another entity's bottom edge.
   * @param {Object} obj - Target collidable entity.
   * @returns {boolean} True when overlapping vertically from below.
   */
  checkTopEdgeHitsBottom(obj) {
    return this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom;
  }

  /**
   * Evaluates full AABB hitbox intersection against another entity.
   * @param {Object} obj - Target collidable entity.
   * @returns {boolean} True when hitboxes intersect.
   */
  isColliding(obj) {
    if (
      this.checkRightEdgeHitsLeft(obj) &&
      this.checkLeftEdgeHitsRight(obj) &&
      this.checkBottomEdgeHitsTop(obj) &&
      this.checkTopEdgeHitsBottom(obj)
    ) {
      return true;
    }
    return false;
  }

  /**
   * Loads a single image asset onto this entity.
   * @param {string} path - Image asset path.
   * @returns {void}
   */
  loadImage(path) {
    this.img.src = path;
  }

  /**
   * Preloads an array of sprite asset paths into the image cache.
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
    this.imageCounter = 0;
    this.frameTick = 0;
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
   * Renders the entity sprite, mirroring horizontally when facing left.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  draw(ctx) {
    if (!this.isImageLoaded()) {
      return;
    }
    if (this.otherDirection) {
      this.setMirrorEffect(ctx);
    } else {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Draws the entity sprite flipped along the horizontal axis.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  setMirrorEffect(ctx) {
    ctx.save();
    ctx.translate(this.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(this.img, -this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  /**
   * Configures stroke styling for debug hitbox visualization.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  setHitBoxParameter(ctx) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
  }

  /**
   * Draws the offset-adjusted collision rectangle for debugging.
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