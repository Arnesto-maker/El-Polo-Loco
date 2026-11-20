/**
 * Static desert parallax background layer sprite positioned across level frames.
 */
class Background extends MovableObject {
  /**
   * Creates a background layer sprite at the specified world coordinates.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {string} path - Background image asset path.
   * @param {number} x - Horizontal world position.
   * @param {number} y - Vertical world position.
   * @param {number} width - Rendered layer width.
   * @param {number} height - Rendered layer height.
   */
  constructor(canvas, path, x, y, width, height) {
    super(canvas);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.loadImage(path);
  }
}