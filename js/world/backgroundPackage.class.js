/**
 * Assembles multi-layer desert backgrounds and patrolling clouds with seamless ultrawide margins.
 */
class BackgroundPackage {
  /**
   * Instantiates all sky, desert layers, and cloud entities for the level.
   * @param {Object} canvas - Reference canvas dimensions.
   */
  constructor(canvas) {
    const patrolDistance = canvas.width - 1400;
    const frame2 = canvas.width;
    this.clouds = this.createClouds(canvas, patrolDistance, frame2);
    this.backgroundObjects = this.createBackgroundLayers(canvas);
  }

  /**
   * Creates the patrolling cloud entities across frames 1 and 2.
   * @param {Object} canvas - Reference canvas dimensions.
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
   * Builds a 4-frame seamless sky strip covering frames -1 through +2.
   * @param {Object} canvas - Reference canvas dimensions.
   * @returns {Array<Background>} Four tiled sky Background instances.
   */
  buildAirStrip(canvas) {
    const tiles = [];
    const path = "assets/img/5_background/layers/air.png";
    for (let i = -1; i <= 2; i++) {
      const x = i * canvas.width;
      tiles.push(new Background(canvas, path, x, 0, canvas.width + 2, canvas.height));
    }
    return tiles;
  }

  /**
   * Builds a 4-frame seamless desert strip covering frames -1 through +2.
   * @param {Object} canvas - Reference canvas dimensions.
   * @param {string} folder - Layer subfolder name under assets/img/5_background/layers.
   * @returns {Array<Background>} Four tiled Background instances.
   */
  buildPairedLayerStrip(canvas, folder) {
    const tiles = [];
    const suffixes = ["2.png", "1.png", "2.png", "1.png"];
    for (let i = 0; i < suffixes.length; i++) {
      const x = (i - 1) * canvas.width;
      const path = `assets/img/5_background/layers/${folder}/${suffixes[i]}`;
      tiles.push(new Background(canvas, path, x, 0, canvas.width + 2, canvas.height));
    }
    return tiles;
  }

  /**
   * Appends all tiles from a strip array into the master background array.
   * @param {Array<Background>} target - Master background array.
   * @param {Array<Background>} source - Layer strip array.
   * @returns {void}
   */
  appendLayerTiles(target, source) {
    for (let i = 0; i < source.length; i++) {
      target.push(source[i]);
    }
  }

  /**
   * Creates stacked sky and desert background layers with 2px seam overlap across frames -1 to +2.
   * @param {Object} canvas - Reference canvas dimensions.
   * @returns {Array<Background>} Instantiated Background array.
   */
  createBackgroundLayers(canvas) {
    const layers = [];
    this.appendLayerTiles(layers, this.buildAirStrip(canvas));
    this.appendLayerTiles(layers, this.buildPairedLayerStrip(canvas, "3_third_layer"));
    this.appendLayerTiles(layers, this.buildPairedLayerStrip(canvas, "2_second_layer"));
    this.appendLayerTiles(layers, this.buildPairedLayerStrip(canvas, "1_first_layer"));
    return layers;
  }

  /**
   * Combines background layers and clouds into a single Z-ordered render array.
   * @returns {Array<DrawableObject>} Combined background render package.
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
