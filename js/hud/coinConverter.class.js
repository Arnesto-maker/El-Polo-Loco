/**
 * In-game canvas popup enabling live coin-to-bottle conversion at a 2:1 exchange rate.
 */
class CoinConverter {
  /**
   * Initializes converter state, sprite icons, and centered layout bounds.
   * @param {StatusBar} statusBar - HUD status bar holding coin and bottle counts.
   * @param {GameEngine} engine - Active GameEngine instance.
   */
  constructor(statusBar, engine) {
    this.statusBar = statusBar;
    this.engine = engine;
    this.isOpen = false;
    this.initialCoins = 0;
    this.rate = 2;
    this.borderRadius = [20, 20, 20, 20];
    this.initImages();
    this.initPopupLayout();
  }

  /**
   * Loads coin and salsa bottle icons for the converter dialog.
   * @returns {void}
   */
  initImages() {
    this.coinImg = new Image();
    this.coinImg.src = "assets/img/7_statusbars/3_icons/icon_coin.png";
    this.bottleImg = new Image();
    this.bottleImg.src = "assets/img/7_statusbars/3_icons/icon_salsa_bottle.png";
  }

  /**
   * Centers the converter dialog box inside the current canvas dimensions.
   * @returns {void}
   */
  initPopupLayout() {
    const cw = this.engine.ctx.canvas.width;
    const ch = this.engine.ctx.canvas.height;
    this.box = { x: (cw - 520) / 2, y: (ch - 340) / 2, w: 520, h: 340 };
  }

  /**
   * Opens the converter popup and pauses the game unless Start Help is open.
   * @returns {void}
   */
  openPopup() {
    if (this.engine.startHelp && this.engine.startHelp.isOpen) {
      return;
    }
    if (!this.isOpen) {
      this.initPopupLayout();
      this.isOpen = true;
      this.engine.isPaused = true;
      this.initialCoins = this.statusBar.coinCount;
      this.rate = 2;
    }
  }

  /**
   * Closes the converter popup and resumes gameplay.
   * @returns {void}
   */
  closePopup() {
    if (this.isOpen) {
      this.isOpen = false;
      this.engine.isPaused = false;
      this.engine.controller.enter = false;
      this.engine.lastBossTick = performance.now();
    }
  }

  /**
   * Opens converter on B press or delegates navigation keys while open.
   * @param {string} key - Logical key name.
   * @returns {void}
   */
  handleKeyDown(key) {
    if (key === "b" || key === "B") {
      this.openPopup();
    } else if (this.isOpen) {
      this.processPopupKeys(key);
    }
  }

  /**
   * Processes left/right conversion steps and Enter confirmation.
   * @param {string} key - Logical key name.
   * @returns {void}
   */
  processPopupKeys(key) {
    if (key === "ArrowRight") {
      this.convertCoinToBottle();
    } else if (key === "ArrowLeft") {
      this.revertBottleToCoin();
    } else if (key === "Enter") {
      this.closePopup();
    }
  }

  /**
   * Exchanges two coins for one salsa bottle if enough coins are available.
   * @returns {void}
   */
  convertCoinToBottle() {
    if (this.statusBar.coinCount < this.rate) {
      return;
    }
    this.statusBar.coinCount -= this.rate;
    this.statusBar.bottleCount += 1;
  }

  /**
   * Reverts a newly bought bottle back into two coins within the current trade session.
   * @returns {void}
   */
  revertBottleToCoin() {
    if (this.statusBar.coinCount >= this.initialCoins || this.statusBar.bottleCount <= 0) {
      return;
    }
    this.statusBar.coinCount += this.rate;
    this.statusBar.bottleCount -= 1;
  }

  /**
   * Renders the complete Coin Converter popup when active.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  draw(ctx) {
    if (this.isOpen) {
      this.initPopupLayout();
      this.drawPopupBox(ctx);
      this.drawPopupImages(ctx);
      this.drawPopupNumbers(ctx);
      this.drawPopupControls(ctx);
    }
  }

  /**
   * Draws the rounded background card and border.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawPopupBox(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(238, 138, 69, 0.96)";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(this.box.x, this.box.y, this.box.w, this.box.h, this.borderRadius);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draws coin and bottle icons with the TO divider label.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawPopupImages(ctx) {
    ctx.save();
    ctx.drawImage(this.coinImg, this.box.x + 110, this.box.y + 35, 95, 95);
    ctx.drawImage(this.bottleImg, this.box.x + 325, this.box.y + 35, 95, 95);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 32px Arial";
    ctx.fillText("TO", this.box.x + 240, this.box.y + 95);
    ctx.restore();
  }

  /**
   * Draws current coin and bottle counts inside the dialog.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawPopupNumbers(ctx) {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 36px Arial";
    ctx.fillText(this.statusBar.coinCount, this.box.x + 145, this.box.y + 195);
    ctx.fillText(this.statusBar.bottleCount, this.box.x + 365, this.box.y + 195);
    ctx.restore();
  }

  /**
   * Draws trade symbols and the Enter confirmation hint.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
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