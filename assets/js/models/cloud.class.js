class Cloud extends MovableObject {
  constructor(canvas, startX,minX,maxX,v) {
    super(canvas);
    this.loadImage("assets/img/5_background/layers/4_clouds/1.png");
    this.width = this.canvasWidth;
    this.height = 0.6*this.canvasHeight;
    this.x = startX;
    this.y = canvas.width * 0.1;
    this.minX = minX;
    this.maxX = maxX;
    this.v = v;
  }
  update() {
    this.x += this.v;
    if (this.x >= this.maxX || this.x <= this.minX) {
      this.v = -this.v;
    }
  }
}
