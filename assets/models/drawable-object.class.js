class DrawableObject {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  loadimage(path) {
    this.img = new Image();
    this.img.src = path;
  }
  drawFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "blue";
    ctx.rect(
      this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom,
    );
    ctx.stroke();
    ctx.stroke();
  }
}
