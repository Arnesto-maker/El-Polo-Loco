class World {
  constructor(canvas) {
    this.bgPackage = new BackgroundPackage(canvas).getBgPackage();
    //this.enemies = [new Enemy(), new Enemy(), new Enemy()];
    this.character = new Character(canvas);
  }

  getFramePackages() {
    let componentsFrames = [];
    this.bgPackage.forEach((item) => {
      componentsFrames .push(item);
    });
    //this.enemies.forEach(enemy => {
    //package.push(enemy);
    //});
    componentsFrames.push(this.character);
    return componentsFrames;
  }
}
