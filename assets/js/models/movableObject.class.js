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
  draw(ctx) {
    if (this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}
