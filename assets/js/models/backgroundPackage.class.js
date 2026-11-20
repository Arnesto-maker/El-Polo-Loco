/**
 * Assembles multi-layer desert backgrounds and patrolling clouds across both level frames.
 */
class BackgroundPackage {
  /**
   * Instantiates all sky, desert layers, and cloud entities for the level.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   */
  constructor(canvas) {
    const patrolDistance = canvas.width - 1400;
    const frame2 = canvas.width;
    this.clouds = this.createClouds(canvas, patrolDistance, frame2);
    this.backgroundObjects = this.createBackgroundLayers(canvas);
  }

  /**
   * Creates the patrolling cloud entities across frames 1 and 2.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {number} patrolDistance - Horizontal patrol distance.
   * @param {number} frame2 - Starting X coordinate of frame 2.
   * @returns {Array<Cloud>} Instantiated Cloud array.
   */
  createClouds(canvas, patrolDistance, frame2) {
    return [
      new Cloud(canvas, -200, -200, 900, 1.5),
      new Cloud(canvas, 450, -450 - patrolDistance, 450, -1.5),
      new Cloud(canvas, 900, 900, 900 + patrolDistance, 1.5),
      new Cloud(canvas, frame2 - 200, frame2 - 200, frame2 - 200 + patrolDistance, 1.5),
      new Cloud(canvas, frame2 + 450, frame2 + 450 - patrolDistance, frame2 + 450, -1.5),
      new Cloud(canvas, frame2 + 900, frame2 + 900, frame2 + 900 + patrolDistance, 1.5),
    ];
  }

  /**
   * Creates the stacked sky and desert landscape background layers.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @returns {Array<Background>} Instantiated Background array.
   */
  createBackgroundLayers(canvas) {
    return [
      new Background(canvas, "assets/img/5_background/layers/air.png", 0, 0, canvas.width, canvas.height),
      new Background(canvas, "assets/img/5_background/layers/3_third_layer/1.png", 0, 0, canvas.width, canvas.height),
      new Background(canvas, "assets/img/5_background/layers/2_second_layer/1.png", 0, 0, canvas.width, canvas.height),
      new Background(canvas, "assets/img/5_background/layers/1_first_layer/1.png", 0, 0, canvas.width, canvas.height),
      new Background(canvas, "assets/img/5_background/layers/air.png", canvas.width, 0, canvas.width, canvas.height),
      new Background(canvas, "assets/img/5_background/layers/3_third_layer/2.png", canvas.width, 0, canvas.width, canvas.height),
      new Background(canvas, "assets/img/5_background/layers/2_second_layer/2.png", canvas.width, 0, canvas.width, canvas.height),
      new Background(canvas, "assets/img/5_background/layers/1_first_layer/2.png", canvas.width, 0, canvas.width, canvas.height),
    ];
  }

  /**
   * Combines background layers and clouds into a single Z-ordered render array.
   * @returns {Array<MovableObject>} Combined background render package.
   */
  getBgPackage() {
    const bgComponentsFrames = [];
    for (let i = 0; i < this.backgroundObjects.length; i++) {
      bgComponentsFrames.push(this.backgroundObjects[i]);
    }
    for (let i = 0; i < this.clouds.length; i++) {
      bgComponentsFrames.push(this.clouds[i]);
    }
    return bgComponentsFrames;
  }
}