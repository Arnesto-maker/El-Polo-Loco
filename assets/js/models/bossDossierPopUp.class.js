class BossDossierPopup {
  constructor(engine) {
    this.engine = engine;
    this.isOpen = false;
    this.hasShown = false;
    this.borderRadius = [10, 10, 10, 10];
    this.initImage();
    this.initTextData();
    this.initLayout();
  }

  initImage() {
    this.bossImg = new Image();
    this.bossImg.src = "assets/img/4_enemie_boss_chicken/2_alert/G5.png";
  }

  initTextData() {
    this.topLines = ["Boss fight started !!", "Hints:"];
    this.bottomLines = [
      "upper body : -20",
      "middle Body : -10",
      "lower body : -5",
      "tipp:",
      "use jump throw to deal more damage and avoid",
      "salvo attack.",
    ];
  }

  initLayout() {
    const cw = this.engine.ctx.canvas.width;
    const ch = this.engine.ctx.canvas.height;
    const w = cw * 0.80;
    const h = ch * 0.64;
    this.box = { x: (cw - w) / 2, y: (ch - h) / 2, w: w, h: h };
    this.initImageAndFontLayout(ch);
  }

  initImageAndFontLayout(ch) {
    const b = this.box;
    const imgSize = b.h * 0.25;
    this.imgBox = {
      x: b.x + (b.w - imgSize) / 2,
      y: b.y + b.h * 0.18,
      w: imgSize,
      h: imgSize,
    };
    this.fontSize = Math.floor(ch * 0.028);
    this.lineStep = this.fontSize * 1.5;
  }

  openPopup() {
    if (!this.hasShown) {
      this.initLayout();
      this.isOpen = true;
      this.hasShown = true;
      this.engine.isPaused = true;
    }
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
      this.drawTopLines(ctx);
      this.drawBossImage(ctx);
      this.drawBottomLines(ctx);
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

  drawTopLines(ctx) {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.font = "bold " + this.fontSize + "px Arial";
    const startX = this.box.x + this.box.w * 0.22;
    const startY = this.box.y + this.box.h * 0.09;
    for (let i = 0; i < this.topLines.length; i++) {
      ctx.fillText(this.topLines[i], startX, startY + i * this.lineStep);
    }
    ctx.restore();
  }

  drawBossImage(ctx) {
    ctx.save();
    ctx.strokeStyle = "#d32f2f";
    ctx.lineWidth = 2;
    ctx.drawImage(this.bossImg, this.imgBox.x, this.imgBox.y, this.imgBox.w, this.imgBox.h);
    ctx.restore();
  }

  drawBottomLines(ctx) {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.font = "bold " + this.fontSize + "px Arial";
    const startX = this.box.x + this.box.w * 0.22;
    const startY = this.imgBox.y + this.imgBox.h + this.lineStep * 1.1;
    for (let i = 0; i < this.bottomLines.length; i++) {
      ctx.fillText(this.bottomLines[i], startX, startY + i * this.lineStep);
    }
    ctx.restore();
  }

  drawFooter(ctx) {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.font = "bold " + this.fontSize + "px Arial";
    const textX = this.box.x + this.box.w * 0.28;
    const textY = this.box.y + this.box.h * 0.94;
    ctx.fillText("Enter : ok and exit", textX, textY);
    ctx.restore();
  }
}