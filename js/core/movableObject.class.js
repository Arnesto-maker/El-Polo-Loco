/**
 * Physics-enabled entity extending DrawableObject with gravity, collisions, and sprite mirroring.
 */
class MovableObject extends DrawableObject {
  speed = 0;
  vg = 0;
  gravity = 0.8;
  yMax = 0;
  otherDirection = false;

  /**
   * Initializes canvas metrics and floor baseline via DrawableObject.
   * @param {HTMLCanvasElement|Object} canvas - The game canvas or design dimension object.
   */
  constructor(canvas) {
    super(canvas);
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
  integrateMidpointGravity(scale = 1) {
    const halfGravity = this.gravity * scale * 0.5;
    this.vg += halfGravity;
    this.y += this.vg * scale;
    this.vg += halfGravity;
  }

  /**
   * Applies midpoint gravity and clamps upward jump velocity at yMax.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  applyVerticalMovement(scale = 1) {
    this.integrateMidpointGravity(scale);
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
   * Renders the entity sprite, mirroring horizontally when facing the opposite direction.
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
      super.draw(ctx);
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
   * Configures blue stroke styling for movable debug hitbox visualization.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  setHitBoxParameter(ctx) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
  }
}
