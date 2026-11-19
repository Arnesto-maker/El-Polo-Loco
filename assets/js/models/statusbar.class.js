/**
 * Main HUD displaying player health, bottles, coins, score, hints, and delegating boss HUD.
 */
class StatusBar extends DrawableObject {
  IMAGES_HEALTH = [
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  IMAGES_BOSS_HEALTH = [
    "assets/img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "assets/img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "assets/img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "assets/img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "assets/img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "assets/img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  ICON_BOTTLE = "assets/img/7_statusbars/3_icons/icon_salsa_bottle.png";
  ICON_COIN = "assets/img/7_statusbars/3_icons/icon_coin.png";

  /**
   * Initializes HUD sprites, counters, layout coordinates, and boss HUD delegate.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   */
  constructor(canvas) {
    super(canvas);
    this.bossHud = new BossHud(this);
    this.initLoadImages();
    this.setMainParameter();
    this.loadInitialValue();
    this.updateHealthImage();
    this.updateBossHealthImage();
  }

  /**
   * Preloads player health, boss health, bottle, and coin icons.
   * @returns {void}
   */
  initLoadImages() {
    this.loadImages(this.IMAGES_HEALTH);
    this.loadImages(this.IMAGES_BOSS_HEALTH);
    this.loadImages([this.ICON_BOTTLE, this.ICON_COIN]);
  }

  /**
   * Resets all gameplay HUD counters to starting values.
   * @returns {void}
   */
  loadInitialValue() {
    this.health = 100;
    this.bossHealth = 100;
    this.bossArmour = 100;
    this.bottleCount = 0;
    this.coinCount = 0;
    this.score = 0;
    this.bossBonus = 0;
    this.bossTimeMs = 0;
    this.showBossHud = false;
  }

  /**
   * Sets position and size of the top-left health bar.
   * @returns {void}
   */
  setMainParameter() {
    this.x = this.canvasWidth * 0.01;
    this.y = this.canvasHeight * 0.11;
    this.width = this.canvasWidth * 0.2;
    this.height = this.canvasHeight * 0.1;
  }

  /**
   * Updates the displayed player health sprite for the current health value.
   * @returns {void}
   */
  updateHealthImage() {
    const index = this.setHealthIndex(this.health);
    this.img = this.imageCache[this.IMAGES_HEALTH[index]];
  }

  /**
   * Updates the displayed boss health sprite for the current boss health value.
   * @returns {void}
   */
  updateBossHealthImage() {
    const index = this.setHealthIndex(this.bossHealth);
    this.bossImg = this.imageCache[this.IMAGES_BOSS_HEALTH[index]];
  }

  /**
   * Maps a 0-100 health percentage to a 0-5 sprite index.
   * @param {number} health - Health value from 0 to 100.
   * @returns {number} Sprite index between 0 and 5.
   */
  setHealthIndex(health) {
    if (health >= 100) return 5;
    if (health >= 80) return 4;
    if (health >= 60) return 3;
    if (health >= 40) return 2;
    if (health >= 20) return 1;
    return 0;
  }

  /**
   * Formats single-digit integers with a leading zero.
   * @param {number} value - Numeric counter value.
   * @returns {string} Zero-padded string.
   */
  formatCount(value) {
    if (value < 10) {
      return "0" + value;
    }
    return String(value);
  }

  /**
   * Applies shared font styling for HUD text readouts.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  setFontStyling(ctx) {
    const fontSize = Math.floor(this.canvasHeight * 0.031);
    ctx.font = `${fontSize}px PolloFont`;
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.textBaseline = "middle";
  }

  /**
   * Draws the salsa bottle icon and inventory count.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawBottleGroup(ctx) {
    const row2Y = this.y + this.height + this.canvasHeight * 0.01;
    const iconSize = this.height * 0.85;
    const textCenterY = row2Y + iconSize / 2;
    ctx.drawImage(this.imageCache[this.ICON_BOTTLE], this.x, row2Y, iconSize, iconSize);
    const bottleText = this.formatCount(this.bottleCount);
    ctx.strokeText(bottleText, this.x + iconSize + 6, textCenterY);
    ctx.fillText(bottleText, this.x + iconSize + 6, textCenterY);
  }

  /**
   * Draws the coin icon and collected coin count.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawCoinGroup(ctx) {
    const row2Y = this.y + this.height + this.canvasHeight * 0.01;
    const iconSize = this.height * 0.85;
    const textCenterY = row2Y + iconSize / 2;
    const coinGroupX = this.x + this.width * 0.55;
    ctx.drawImage(this.imageCache[this.ICON_COIN], coinGroupX, row2Y, iconSize, iconSize);
    const coinText = this.formatCount(this.coinCount);
    ctx.strokeText(coinText, coinGroupX + iconSize + 6, textCenterY);
    ctx.fillText(coinText, coinGroupX + iconSize + 6, textCenterY);
  }

  /**
   * Draws current score, boss bonus, pause hint, and coin-buy prompt.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawScoringGroup(ctx) {
    const row2Y = this.y + this.height + this.canvasHeight * 0.01;
    const row3Y = row2Y + this.height * 0.85 + this.canvasHeight * 0.028;
    const scoreText = "Score: " + this.score;
    ctx.strokeText(scoreText, this.x + 50, row3Y);
    ctx.fillText(scoreText, this.x + 50, row3Y);
    this.bossHud.drawBossBonusText(ctx, row3Y);
    this.drawPauseHintText(ctx, row3Y);
    this.drawBuyHintGroup(ctx, row3Y);
  }

  /**
   * Draws the pause instruction referencing the Tab key.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @param {number} row3Y - Baseline Y coordinate of the score row.
   * @returns {void}
   */
  drawPauseHintText(ctx, row3Y) {
    const row4Y = row3Y + this.canvasHeight * 0.042;
    const fontSize = Math.floor(this.canvasHeight * 0.024);
    ctx.save();
    ctx.font = `${fontSize}px PolloFont`;
    ctx.strokeText("Press Tab to pause", this.x + 50, row4Y);
    ctx.fillText("Press Tab to pause", this.x + 50, row4Y);
    ctx.restore();
  }

  /**
   * Draws a pulsing buy-bottle prompt whenever the player has at least two coins.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @param {number} row3Y - Baseline Y coordinate of the score row.
   * @returns {void}
   */
  drawBuyHintGroup(ctx, row3Y) {
    if (this.coinCount < 2) {
      return;
    }
    const row5Y = row3Y + this.canvasHeight * 0.085;
    const pulse = 1 + Math.sin(performance.now() * 0.008) * 0.08;
    ctx.save();
    ctx.font = `${Math.floor(this.canvasHeight * 0.024 * pulse)}px PolloFont`;
    this.renderBuyHintElements(ctx, row5Y, pulse);
    ctx.restore();
  }

  /**
   * Renders the text and bottle icon for the pulsing buy hint.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @param {number} row5Y - Vertical center coordinate.
   * @param {number} pulse - Current animation scale factor.
   * @returns {void}
   */
  renderBuyHintElements(ctx, row5Y, pulse) {
    const hintText = "Press B to buy";
    const textX = this.x + 50;
    ctx.strokeText(hintText, textX, row5Y);
    ctx.fillText(hintText, textX, row5Y);
    const iconSize = this.height * 0.5 * pulse;
    const iconX = textX + ctx.measureText(hintText).width + 4;
    ctx.drawImage(this.imageCache[this.ICON_BOTTLE], iconX, row5Y - iconSize / 2, iconSize, iconSize);
  }

  /**
   * Renders the complete HUD overlay on top of the canvas.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  draw(ctx) {
    ctx.save();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    this.setFontStyling(ctx);
    this.drawBottleGroup(ctx);
    this.drawCoinGroup(ctx);
    this.drawScoringGroup(ctx);
    this.bossHud.draw(ctx);
    ctx.restore();
  }
}