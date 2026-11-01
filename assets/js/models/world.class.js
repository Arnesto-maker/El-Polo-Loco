class World {
  constructor(canvas) {
    this.bgPackage = new BackgroundPackage(canvas).getBgPackage();
    this.enemies = [];
    this.character = new Character(canvas);
    this.spawnEnemies(8,canvas);
  }
  spawnEnemies(count,canvas) {
    const startOffset = canvas.width * 0.25;
    const totalEnd = canvas.width * 2 - canvas.width * 0.1;
    const sectorWidth = (totalEnd - startOffset) / count;
    for (let i = 0; i < count; i++) {
      const sectorMinX = startOffset + i * sectorWidth;
      const sectorMaxX = sectorMinX + sectorWidth;
      const enemy = new Chicken(canvas, sectorMinX, sectorMaxX);
      this.enemies.push(enemy);
    }
  }

  getFramePackages() {
    let componentsFrames = [];
    this.bgPackage.forEach((item) => {
      componentsFrames.push(item);
    });
    this.enemies.forEach((enemy) => {
      componentsFrames.push(enemy);
    });
    componentsFrames.push(this.character);
    return componentsFrames;
  }
}
