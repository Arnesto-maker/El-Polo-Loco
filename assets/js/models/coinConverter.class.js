class CoinConverter {
  constructor(statusBar, engine) {
    this.statusBar = statusBar;
    this.engine = engine;
    this.isOpen = false;
    this.initialCoins = 0;
    this.rate = 2;
    this.initImages();
    this.initPopupLayout();
  }

  initImages() {
    this.coinImg = new Image();
    this.coinImg.src = "assets/img/7_statusbars/3_icons/icon_coin.png";
    this.bottleImg = new Image();
    this.bottleImg.src = "assets/img/7_statusbars/3_icons/icon_salsa_bottle.png";
  }

  initPopupLayout() {
    const cw = this.engine.ctx.canvas.width;
    const ch = this.engine.ctx.canvas.height;
    this.box = { x: (cw - 520) / 2, y: (ch - 340) / 2, w: 520, h: 340 };
  }

  openPopup() {
    if (!this.isOpen) {
      this.initPopupLayout();
      this.isOpen = true;
      this.engine.isPaused = true;
      this.initialCoins = this.statusBar.coinCount;
      this.rate = 2;
    }
  }

  closePopup() {
    if (this.isOpen) {
      this.isOpen = false;
      this.engine.isPaused = false;
      this.engine.controller.enter = false;
      this.engine.lastBossTick = performance.now();
    }
  }

  handleKeyDown(key) {
    if (key === "b" || key === "B") {
      this.openPopup();
    } else if (this.isOpen) {
      this.processPopupKeys(key);
    }
  }

  processPopupKeys(key) {
    if (key === "ArrowRight") {
      this.convertCoinToBottle();
    } else if (key === "ArrowLeft") {
      this.revertBottleToCoin();
    } else if (key === "Enter") {
      this.closePopup();
    }
  }

  convertCoinToBottle() {
    if (this.statusBar.coinCount < this.rate) {
      return;
    }
    this.statusBar.coinCount = this.statusBar.coinCount - this.rate;
    this.statusBar.bottleCount = this.statusBar.bottleCount + 1;
  }

  revertBottleToCoin() {
    if (this.statusBar.coinCount >= this.initialCoins) {
      return;
    }
    if (this.statusBar.bottleCount <= 0) {
      return;
    }
    this.statusBar.coinCount = this.statusBar.coinCount + this.rate;
    this.statusBar.bottleCount = this.statusBar.bottleCount - 1;
  }

  draw(ctx) {
    if (this.isOpen) {
      this.initPopupLayout();
      this.drawPopupBox(ctx);
      this.drawPopupImages(ctx);
      this.drawPopupNumbers(ctx);
      this.drawPopupControls(ctx);
    }
  }

  drawPopupBox(ctx) {
    ctx.save();
ctx.fillStyle = "rgba(238, 138, 69, 0.96)";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 5;
    ctx.fillRect(this.box.x, this.box.y, this.box.w, this.box.h);
    ctx.strokeRect(this.box.x, this.box.y, this.box.w, this.box.h);
    ctx.restore();
  }

  drawPopupImages(ctx) {
    ctx.save();
    ctx.drawImage(this.coinImg, this.box.x + 110, this.box.y + 35, 95, 95);
    ctx.drawImage(this.bottleImg, this.box.x + 325, this.box.y + 35, 95, 95);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 32px Arial";
    ctx.fillText("TO", this.box.x + 240, this.box.y + 95);
    ctx.restore();
  }

  drawPopupNumbers(ctx) {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 36px Arial";
    ctx.fillText(this.statusBar.coinCount, this.box.x + 145, this.box.y + 195);
    ctx.fillText(this.statusBar.bottleCount, this.box.x + 365, this.box.y + 195);
    ctx.restore();
  }

  drawPopupControls(ctx) {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 36px Arial";
    ctx.fillText("-", this.box.x + 100, this.box.y + 195);
    ctx.fillText("+", this.box.x + 200, this.box.y + 195);
    ctx.font = "bold 24px Arial";
    ctx.fillText("[Enter] = OK", this.box.x + 185, this.box.y + 295);
    ctx.restore();
  }
}