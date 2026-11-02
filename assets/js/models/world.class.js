class World {
  constructor(canvas) {
    this.bgPackage = new BackgroundPackage(canvas).getBgPackage();
    this.enemies = [];
    this.coins = [];
    this.character = new Character(canvas);
    this.spawnEnemies(8, canvas);
    this.spawnCoinsForFrame(0, canvas);
    this.spawnCoinsForFrame(1, canvas);
  }
  spawnEnemies(count, canvas) {
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

  setCoinCount(minCoins, maxCoins) {
    return Math.floor(minCoins + Math.random() * (maxCoins - minCoins + 1));
  }

  initCoinSpawning(coinCount, stepX, yHigh, yLow, startX) {
    for (let i = 0; i < coinCount; i++) {
      const progress = i / (coinCount - 1);
      const x = startX + i * stepX;
      const angle = progress * 2* 2 * Math.PI;
      const normalizedSin = (1 - Math.sin(angle)) / 2;
      const y = yHigh + normalizedSin * (yLow - yHigh);
      this.coins.push(new Coin(canvas, x, y));
    }
  }

  spawnCoinsForFrame(frameIndex, canvas) {
    const coinCount = this.setCoinCount(10, 16);
    let startX = frameIndex * canvas.width + 100;
    let endX = (frameIndex + 1) * canvas.width - canvas.width * 0.06 - 100;
    const stepX = (endX - startX) / (coinCount - 1);
    const yHigh = canvas.height * 0.35;
    const yLow = canvas.height * 0.52;
    this.initCoinSpawning(coinCount, stepX, yHigh, yLow, startX);
  }

  getFramePackages() {
    let componentsFrames = [];
    this.bgPackage.forEach((item) => {
      componentsFrames.push(item);
    });
    this.coins.forEach((item) => {
      componentsFrames.push(item);
    });
    this.enemies.forEach((enemy) => {
      componentsFrames.push(enemy);
    });
    componentsFrames.push(this.character);
    return componentsFrames;
  }
}
