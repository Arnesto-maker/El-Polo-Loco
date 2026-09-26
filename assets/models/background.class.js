class Background extends MovableObject {
  x;
  y = 0;
  width;
  height;
  world;
  constructor(worldInstance, path, factor,x) {
    super();
    this.world = worldInstance;
    this.loadimage(path);
    this.height = this.world.canvas.height;
    this.width = factor * this.world.canvas.width;
    this.x = x
  }
}
