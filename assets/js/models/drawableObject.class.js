class DrawableObject {
  x = 0;
  y = 0;
  width = 100;
  height = 100;
  floor = 0;
  img = new Image();
  imageCache = {};
  imageCounter = 0;
  frameTick = 0;
  constructor(canvas) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.floor = this.canvasHeight * 0.13;
  }

  loadImage(path) {
    this.img.src = path;
  }

  loadImages(pathsArray) {
    pathsArray.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(pathsArray) {
    if (this.frameTick % 8 === 0) {
      let i = this.imageCounter % pathsArray.length;
      let path = pathsArray[i];
      this.img = this.imageCache[path];
      this.imageCounter++;
    }
    this.frameTick++;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
