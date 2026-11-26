/**
 * Player-thrown salsa bottle projectile with straight-flight apex and gravity arc.
 */
class ThrowableBottle extends Projectile {
  dir = 1;
  xWMax = 0;

  /**
   * Creates a thrown salsa bottle launched from Pepe's position.
   * @param {HTMLCanvasElement|Object} canvas - The game canvas or design dimension object.
   * @param {number} startX - Launch X coordinate.
   * @param {number} startY - Launch Y coordinate.
   * @param {boolean} otherDirection - True when thrown left.
   * @param {number} yMax - Ground splash Y limit.
   */
  constructor(canvas, startX, startY, otherDirection, yMax) {
    super(canvas);
    this.setMainParameter(startX, startY, otherDirection, yMax);
    this.setDirectionParameter(otherDirection);
  }

  /**
   * Configures launch bounds, velocity, gravity, and hitbox offsets.
   * @param {number} startX - Launch X coordinate.
   * @param {number} startY - Launch Y coordinate.
   * @param {boolean} otherDirection - True when thrown left.
   * @param {number} yMax - Ground splash Y limit.
   * @returns {void}
   */
  setMainParameter(startX, startY, otherDirection, yMax) {
    this.initBaseBounds(startX, startY);
    this.otherDirection = otherDirection;
    this.speed = 10;
    this.gravity = 0.6;
    this.yMax = yMax;
    this.offset = this.setOffsetParameter();
  }

  /**
   * Computes horizontal direction sign and straight-flight threshold before gravity applies.
   * @param {boolean} otherDirection - True when thrown left.
   * @returns {void}
   */
  setDirectionParameter(otherDirection) {
    if (otherDirection) {
      this.dir = -1;
    } else {
      this.dir = 1;
    }
    this.xWMax = this.x + this.dir * (this.canvasWidth * 0.15);
  }

  /**
   * Builds the collision offset box for the thrown bottle.
   * @returns {{top: number, bottom: number, left: number, right: number}} Hitbox offsets.
   */
  setOffsetParameter() {
    return {
      top: this.height * 0.15,
      bottom: this.height * 0.15,
      left: this.width * 0.15,
      right: this.width * 0.15,
    };
  }

  /**
   * Advances horizontal travel and applies gravity drop once past xWMax.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  updateFlight(scale = 1) {
    this.x += this.speed * this.dir * scale;
    if (this.hasPassedXWMax()) {
      this.integrateMidpointGravity(scale);
    }
  }

  /**
   * Checks whether the bottle has traveled past its straight-flight apex distance.
   * @returns {boolean} True when gravity arc should begin.
   */
  hasPassedXWMax() {
    if (this.otherDirection) {
      return this.x <= this.xWMax;
    }
    return this.x >= this.xWMax;
  }
}
