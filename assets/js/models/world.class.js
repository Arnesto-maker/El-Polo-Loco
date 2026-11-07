class World {
  constructor(canvas) {
    this.bgPackage = new BackgroundPackage(canvas).getBgPackage();
    this.enemies = [];
    this.coins = [];
    this.bottles = [];
    this.throwableBottles = [];
    this.character = new Character(canvas);
    this.initWorldSpawning(canvas);
  }

  initWorldSpawning(canvas) {
    this.spawnBottlesForFrame(0, canvas);
    this.spawnBottlesForFrame(1, canvas);
    this.spawnEnemies(8, canvas);
    this.spawnCoinsForFrame(0, canvas);
    this.spawnCoinsForFrame(1, canvas);
  }

  spawnEnemies(count, canvas) {
    const startOffset = 350;
    const totalEnd = canvas.width * 2 - 300;
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

  initCoinSpawning(coinCount, stepX, yHigh, yLow, startX, canvas) {
    for (let i = 0; i < coinCount; i++) {
      const progress = i / (coinCount - 1);
      const x = startX + i * stepX;
      const angle = progress * 2 * 2 * Math.PI;
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
    this.initCoinSpawning(coinCount, stepX, yHigh, yLow, startX, canvas);
  }

  setBottleCount(minBottles, maxBottles) {
    return Math.floor(
      minBottles + Math.random() * (maxBottles - minBottles + 1),
    );
  }

  spawnBottlesForFrame(frameIndex, canvas) {
    const bottleCount = this.setBottleCount(4, 7);
    let startX = frameIndex * canvas.width + 300;
    let endX = (frameIndex + 1) * canvas.width - canvas.width * 0.05 - 300;
    const sectorWidth = (endX - startX) / bottleCount;
    this.initBottleSpawning(bottleCount, startX, sectorWidth, canvas);
  }

  initBottleSpawning(bottleCount, startX, sectorWidth, canvas) {
    for (let i = 0; i < bottleCount; i++) {
      const sectorMinX = startX + i * sectorWidth;
      const sectorMaxX = sectorMinX + sectorWidth;
      this.bottles.push(new Bottle(canvas, sectorMinX, sectorMaxX));
    }
  }

  addArrayToFrame(sourceArray, targetArray) {
    for (let i = 0; i < sourceArray.length; i++) {
      targetArray.push(sourceArray[i]);
    }
  }

  getFramePackages() {
    let componentsFrames = [];
    this.addArrayToFrame(this.bgPackage, componentsFrames);
    this.addArrayToFrame(this.coins, componentsFrames);
    this.addArrayToFrame(this.bottles, componentsFrames);
    this.addArrayToFrame(this.enemies, componentsFrames);
    this.addArrayToFrame(this.throwableBottles, componentsFrames);
    componentsFrames.push(this.character);
    return componentsFrames;
  }
}
