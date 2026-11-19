/**
 * Renders the Endboss health bar, armor readout, timer, and decaying bonus score.
 */
class BossHud {
  /**
   * Creates the boss HUD renderer attached to a parent StatusBar.
   * @param {StatusBar} statusBar - Parent HUD status bar instance.
   */
  constructor(statusBar) {
    this.bar = statusBar;
  }

  /**
   * Draws all boss HUD elements when a boss encounter is active.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  draw(ctx) {
    if (!this.bar.showBossHud) {
      return;
    }
    this.drawBossHealthBar(ctx);
    this.drawBossArmourText(ctx);
    this.drawBossTimerGroup(ctx);
  }

  /**
   * Draws the boss health bar graphic in the upper-right area.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawBossHealthBar(ctx) {
    const bossBarX = this.bar.canvasWidth * 0.78;
    ctx.drawImage(this.bar.bossImg, bossBarX, this.bar.y + 20, this.bar.width, this.bar.height);
  }

  /**
   * Draws remaining boss armor points beneath the boss health bar.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawBossArmourText(ctx) {
    if (this.bar.bossArmour <= 0) {
      return;
    }
    const armourText = "+" + this.bar.bossArmour + " Armour";
    const armourX = this.bar.canvasWidth * 0.78;
    const armourY = this.bar.y + this.bar.height + this.bar.canvasHeight * 0.035;
    ctx.strokeText(armourText, armourX, armourY);
    ctx.fillText(armourText, armourX, armourY);
  }

  /**
   * Draws the elapsed boss fight timer centered near the top.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawBossTimerGroup(ctx) {
    const sec = this.bar.formatCount(Math.floor(this.bar.bossTimeMs / 1000));
    const ms = this.bar.formatCount(Math.floor((this.bar.bossTimeMs % 1000) / 10));
    const timeText = "Time: " + sec + ":" + ms;
    const timeX = this.bar.canvasWidth * 0.45;
    const timeY = this.bar.y + this.bar.height * 0.55;
    ctx.strokeText(timeText, timeX, timeY);
    ctx.fillText(timeText, timeX, timeY);
  }

  /**
   * Draws the live decaying boss bonus next to the player score.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @param {number} row3Y - Baseline Y coordinate of the score row.
   * @returns {void}
   */
  drawBossBonusText(ctx, row3Y) {
    if (!this.bar.showBossHud) {
      return;
    }
    const bonusText = "+ " + this.bar.bossBonus;
    const bonusX = this.bar.x + this.bar.width * 0.85;
    ctx.strokeText(bonusText, bonusX, row3Y);
    ctx.fillText(bonusText, bonusX, row3Y);
  }
}