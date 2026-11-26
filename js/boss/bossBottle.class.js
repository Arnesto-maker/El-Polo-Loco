/**
 * Boss radial salvo bottle projectile with immediate ballistic arc.
 */
class BossBottle extends Projectile {
  /**
   * Creates a boss salvo bottle launched with initial velocity components.
   * @param {HTMLCanvasElement|Object} canvas - The game canvas or design dimension object.
   * @param {number} startX - Launch X coordinate.
   * @param {number} startY - Launch Y coordinate.
   * @param {number} vX - Horizontal velocity at 60 FPS.
   * @param {number} vY - Initial vertical velocity at 60 FPS.
   */
  constructor(canvas, startX, startY, vX, vY) {
    super(canvas);
    this.setMainParameter(startX, startY, vX, vY);
  }

  /**
   * Sets launch bounds, velocities, gravity, and ground splash limit.
   * @param {number} startX - Launch X coordinate.
   * @param {number} startY - Launch Y coordinate.
   * @param {number} vX - Horizontal velocity at 60 FPS.
   * @param {number} vY - Vertical velocity at 60 FPS.
   * @returns {void}
   */
  setMainParameter(startX, startY, vX, vY) {
    this.initBaseBounds(startX, startY);
    this.speed = vX;
    this.vg = vY;
    this.gravity = 0.5;
    this.yMax = this.getGroundLine();
  }

  /**
   * Moves the salvo bottle horizontally and integrates midpoint gravity.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  updateFlight(scale = 1) {
    this.x += this.speed * scale;
    this.integrateMidpointGravity(scale);
  }
}
