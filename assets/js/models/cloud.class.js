/**
 * Ambient drifting desert cloud patrolling between horizontal bounds.
 */
class Cloud extends MovableObject {
  /**
   * Initializes cloud sprite, patrol corridor, and drift velocity.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {number} startX - Initial X coordinate.
   * @param {number} minX - Left patrol boundary.
   * @param {number} maxX - Right patrol boundary.
   * @param {number} v - Horizontal drift velocity at 60 FPS.
   */
  constructor(canvas, startX, minX, maxX, v) {
    super(canvas);
    this.loadImage("assets/img/5_background/layers/4_clouds/1.png");
    this.width = this.canvasWidth;
    this.height = 0.6 * this.canvasHeight;
    this.x = startX;
    this.y = canvas.width * 0.1;
    this.minX = minX;
    this.maxX = maxX;
    this.v = v;
  }

  /**
   * Advances horizontal cloud drift scaled to 60-FPS delta time.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  update(controller, scale = 1) {
    this.x += this.v * scale;
    if (this.x >= this.maxX || this.x <= this.minX) {
      this.v = -this.v;
    }
  }
}