class World {
  constructor(canvas) {
    this.bgPackage = new BackgroundPackage(canvas).getBgPackage();
    this.enemies = [new Chicken(canvas), new Chicken(canvas), new Chicken(canvas)];
    this.character = new Character(canvas);
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
