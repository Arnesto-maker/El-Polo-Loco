class MovableObject {
  x = 0;
  y = 0;
  speed = 0;
  width = 100;
  height = 100;
  vg = 0;
  gravity = 0.8;
  yMax = 0;
  floor = 0;
  groundY = 0;
  img = new Image();
  otherDirection = false;
  imageCache = {};
  imageCounter = 0;
  frameTick = 0;
  constructor(canvas) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.floor = this.canvasHeight * 0.13;
  }

  getGroundLine() {
    return this.canvasHeight - this.height - this.floor;
  }

  isAboveGround() {
    return this.y < this.getGroundLine();
  }

  setGravitation() {
    const groundLine = this.canvasHeight - this.height - this.floor;
    if (this.isAboveGround() || this.vg < 0) {
      this.y += this.vg;
      this.vg += this.gravity;
      if (this.y <= this.yMax) {
        this.y = this.yMax;
        this.vg = this.gravity;
      }
    } else {
      this.y = groundLine;
      this.vg = 0;
    }
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
    if (this.img.complete && this.otherDirection) {
      this.setMirrorEffect(ctx);
    } else {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  setMirrorEffect(ctx) {
    ctx.save();
    ctx.translate(this.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(this.img, -this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
