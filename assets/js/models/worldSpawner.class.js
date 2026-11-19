/**
 * Generates level enemies, sine-wave coin arcs, and ground salsa bottles across frames.
 */
class WorldSpawner {
  /**
   * Creates a spawner bound to a World instance and canvas dimensions.
   * @param {World} world - Target World instance to populate.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   */
  constructor(world, canvas) {
    this.world = world;
    this.canvas = canvas;
  }

  /**
   * Populates both level frames with bottles, enemies, and coins.
   * @returns {void}
   */
  populateWorld() {
    this.spawnBottlesForFrame(0);
    this.spawnBottlesForFrame(1);
    this.spawnEnemies(8);
    this.spawnCoinsForFrame(0);
    this.spawnCoinsForFrame(1);
  }

  /**
   * Distributes regular chicken enemies evenly across level sectors.
   * @param {number} count - Total number of chickens to spawn.
   * @returns {void}
   */
  spawnEnemies(count) {
    const startOffset = 350;
    const totalEnd = this.canvas.width * 2 - 300;
    const sectorWidth = (totalEnd - startOffset) / count;
    for (let i = 0; i < count; i++) {
      const minX = startOffset + i * sectorWidth;
      const maxX = minX + sectorWidth;
      this.world.enemies.push(new Chicken(this.canvas, minX, maxX));
    }
  }

  /**
   * Generates a random integer between min and max inclusive.
   * @param {number} minVal - Lower inclusive bound.
   * @param {number} maxVal - Upper inclusive bound.
   * @returns {number} Random integer count.
   */
  getRandomRangeCount(minVal, maxVal) {
    return Math.floor(minVal + Math.random() * (maxVal - minVal + 1));
  }

  /**
   * Spawns a randomized sine-wave sequence of coins inside a frame.
   * @param {number} frameIndex - Frame index (0 or 1).
   * @returns {void}
   */
  spawnCoinsForFrame(frameIndex) {
    const coinCount = this.getRandomRangeCount(10, 16);
    const startX = frameIndex * this.canvas.width + 100;
    const endX = (frameIndex + 1) * this.canvas.width - this.canvas.width * 0.06 - 100;
    const stepX = (endX - startX) / (coinCount - 1);
    const yHigh = this.canvas.height * 0.35;
    const yLow = this.canvas.height * 0.52;
    this.createSineWaveCoins(coinCount, stepX, yHigh, yLow, startX);
  }

  /**
   * Places individual Coin instances along a smooth sine curve.
   * @param {number} count - Number of coins to place.
   * @param {number} stepX - Horizontal distance between coins.
   * @param {number} yHigh - Highest Y coordinate.
   * @param {number} yLow - Lowest Y coordinate.
   * @param {number} startX - Starting X coordinate.
   * @returns {void}
   */
  createSineWaveCoins(count, stepX, yHigh, yLow, startX) {
    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const x = startX + i * stepX;
      const normalizedSin = (1 - Math.sin(progress * 4 * Math.PI)) / 2;
      const y = yHigh + normalizedSin * (yLow - yHigh);
      this.world.coins.push(new Coin(this.canvas, x, y));
    }
  }

  /**
   * Spawns collectible ground bottles across evenly divided frame sectors.
   * @param {number} frameIndex - Frame index (0 or 1).
   * @returns {void}
   */
  spawnBottlesForFrame(frameIndex) {
    const bottleCount = this.getRandomRangeCount(4, 7);
    const startX = frameIndex * this.canvas.width + 300;
    const endX = (frameIndex + 1) * this.canvas.width - this.canvas.width * 0.05 - 300;
    const sectorWidth = (endX - startX) / bottleCount;
    this.createSectorBottles(bottleCount, startX, sectorWidth);
  }

  /**
   * Instantiates one Bottle object inside each calculated sector.
   * @param {number} count - Number of bottles.
   * @param {number} startX - Starting X coordinate.
   * @param {number} sectorWidth - Width of each sector.
   * @returns {void}
   */
  createSectorBottles(count, startX, sectorWidth) {
    for (let i = 0; i < count; i++) {
      const minX = startX + i * sectorWidth;
      const maxX = minX + sectorWidth;
      this.world.bottles.push(new Bottle(this.canvas, minX, maxX));
    }
  }
}