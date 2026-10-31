class Background extends MovableObject {
  constructor(canvas, path, x, y, width, height) {
    super(canvas);
    this.x = x
    this.y = y
    this.width = width;
    this.height = height;
    this.loadImage(path);
  }
}

