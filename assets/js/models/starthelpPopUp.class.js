class StartHelpPopup {
  constructor(engine) {
    this.engine = engine;
    this.isOpen = true;
    this.engine.isPaused = true;
    this.borderRadius = [10, 10, 10, 10];
    this.initTextLines();
    this.initLayout();
  }

  initTextLines() {
    this.lines = [
      "Wellcome to El Polo loco",
      "Hints :",
      "A/D or Arrow Left/ Arrow Right to move pepe",
      "space to jump",
      "enter to Throw bottle",
      "Combo :",
      "Space + Enter : jump throw",
      "B : Buy Bottle.",
    ];
  }

  initLayout() {
    const cw = this.engine.ctx.canvas.width;
    const ch = this.engine.ctx.canvas.height;
    const w = cw * 0.80;
    const h = ch * 0.64;
    this.box = { x: (cw - w) / 2, y: (ch - h) / 2, w: w, h: h };
    this.initInnerBox(ch);
  }

  initInnerBox(ch) {
    const b = this.box;
    this.innerBox = {
      x: b.x + b.w * 0.1,
      y: b.y + b.h * 0.08,
      w: b.w * 0.8,
      h: b.h * 0.74,
    };
    this.fontSize = Math.floor(ch * 0.030);
    this.lineStep = this.fontSize * 2;
  }

  handleKeyDown(key) {
    if (this.isOpen) {
      if (key === "Enter") {
        this.closePopup();
      }
    }
  }

  closePopup() {
    this.isOpen = false;
    this.engine.isPaused = false;
    this.engine.controller.enter = false;
    this.engine.lastBossTick = performance.now();
  }

  draw(ctx) {
    if (this.isOpen) {
      this.initLayout();
      this.drawOuterBox(ctx);
      this.drawTextLines(ctx);
      this.drawFooter(ctx);
    }
  }

  drawOuterBox(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(238, 138, 69, 0.96)";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(this.box.x, this.box.y, this.box.w, this.box.h, this.borderRadius);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawInnerBox(ctx) {
    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      this.innerBox.x,
      this.innerBox.y,
      this.innerBox.w,
      this.innerBox.h,
    );
    ctx.restore();
  }

  drawTextLines(ctx) {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.font = "bold " + this.fontSize + "px Arial";
    const startX = this.innerBox.x + this.innerBox.w * 0.08;
    const startY = this.innerBox.y + this.lineStep * 1.1;
    for (let i = 0; i < this.lines.length; i++) {
      ctx.fillText(this.lines[i], startX, startY + i * this.lineStep);
    }
    ctx.restore();
  }

  drawFooter(ctx) {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.font = "bold " + this.fontSize + "px Arial";
    const textX = this.box.x + this.box.w * 0.32;
    const textY = this.box.y + this.box.h * 0.92;
    ctx.fillText("enter = ok and exit", textX, textY);
    ctx.restore();
  }
}