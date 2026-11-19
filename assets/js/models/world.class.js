/**
 * Holds all level entities and assembles the ordered draw/update frame package.
 */
class World {
  /**
   * Initializes world collections, background, boss, character, and spawns collectibles.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   */
  constructor(canvas) {
    this.bgPackage = new BackgroundPackage(canvas).getBgPackage();
    this.enemies = [];
    this.coins = [];
    this.bottles = [];
    this.throwableBottles = [];
    this.bossBottles = [];
    this.boss = new Boss(canvas);
    this.character = new Character(canvas);
    const spawner = new WorldSpawner(this, canvas);
    spawner.populateWorld();
  }

  /**
   * Appends all elements of a source array to the target render list.
   * @param {Array<Object>} sourceArray - Collection of drawable entities.
   * @param {Array<Object>} targetArray - Master frame list.
   * @returns {void}
   */
  addArrayToFrame(sourceArray, targetArray) {
    for (let i = 0; i < sourceArray.length; i++) {
      targetArray.push(sourceArray[i]);
    }
  }

  /**
   * Builds the Z-ordered flat array of all active objects for the render loop.
   * @returns {Array<Object>} Flat array of game objects.
   */
  getFramePackages() {
    const components = [];
    this.addArrayToFrame(this.bgPackage, components);
    this.addArrayToFrame(this.coins, components);
    this.addArrayToFrame(this.bottles, components);
    this.addArrayToFrame(this.enemies, components);
    this.addArrayToFrame(this.throwableBottles, components);
    this.addArrayToFrame(this.bossBottles, components);
    if (this.boss) {
      components.push(this.boss);
    }
    components.push(this.character);
    return components;
  }
}