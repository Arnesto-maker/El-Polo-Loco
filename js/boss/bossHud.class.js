/**
 * Renders the Endboss health bar, graphical armor bar, tactical hints, timer, and decaying bonus score.
 */
class BossHud {
  /**
   * Creates the boss HUD renderer and its graphical armor bar attached to a parent StatusBar.
   * @param {StatusBar} statusBar - Parent HUD status bar instance.
   */
  constructor(statusBar) {
    this.bar = statusBar;
    this.armourBar = new BossArmourBar(this);
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
    this.armourBar.draw(ctx);
    this.drawBossJumpThrowHint(ctx);
    this.drawBossArmourHint(ctx);
    this.drawBossTimerGroup(ctx);
  }

  /**
   * Computes the right-anchored X coordinate of the boss health bar for any dynamic canvas width.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {number} Logical X coordinate for the boss health bar.
   */
  getBossBarX(ctx) {
    return ctx.canvas.width - this.bar.width - this.bar.x * 2;
  }

  /**
   * Draws the boss health bar graphic in the upper-right area.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawBossHealthBar(ctx) {
    const bossBarX = this.getBossBarX(ctx);
    ctx.drawImage(this.bar.bossImg, bossBarX, this.bar.y + 20, this.bar.width, this.bar.height);
  }

  /**
   * Returns the Jump-Throw hint text adapted to compact mobile landscape or desktop.
   * @returns {string} Jump-Throw tactical hint string.
   */
  getJumpThrowHintText() {
    if (this.bar.isCompactMobileLandscape()) {
      return "Jump Throw = Crit!";
    }
    return "Use Jump Throw to deal more damage";
  }

  /**
   * Returns the boss armor hint text adapted to compact mobile landscape or desktop.
   * @returns {string} Armor warning hint string.
   */
  getArmourHintText() {
    if (this.bar.isCompactMobileLandscape()) {
      return "Break Armour first!";
    }
    return "Armour activated! Break armour to reduce health";
  }

  /**
   * Boosts boss hint font ratio on compact mobile landscape viewports for readability.
   * @param {number} baseRatio - Base canvas-height font ratio.
   * @returns {number} Effective font ratio.
   */
  getBossHintFontRatio(baseRatio) {
    if (this.bar.isCompactMobileLandscape()) {
      return baseRatio + 0.006;
    }
    return baseRatio;
  }

  /**
   * Draws pulsing Hint A advising Jump-Throw attacks beneath the boss armor bar.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawBossJumpThrowHint(ctx) {
    const pulse = 1 + Math.sin(performance.now() * 0.008) * 0.07;
    const fontSize = this.bar.getScaledFontSize(this.getBossHintFontRatio(0.019), pulse);
    const hintX = ctx.canvas.width - this.bar.x * 2;
    const hintY = this.bar.y + this.bar.height * 2 + this.bar.canvasHeight * 0.032;
    const text = this.getJumpThrowHintText();
    ctx.save();
    ctx.font = `${fontSize}px PolloFont`;
    ctx.textAlign = "right";
    ctx.strokeText(text, hintX, hintY);
    ctx.fillText(text, hintX, hintY);
    ctx.restore();
  }

  /**
   * Applies red warning font alignment and color styling for the boss armor notice.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @param {number} fontSize - Calculated logical pixel size.
   * @returns {void}
   */
  applyWarningHintStyle(ctx, fontSize) {
    ctx.font = `${fontSize}px PolloFont`;
    ctx.textAlign = "right";
    ctx.fillStyle = "#b71c1c";
    ctx.strokeStyle = "#b71c1c";
  }

  /**
   * Draws Hint B in warning red while the boss armor shield is still above zero.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawBossArmourHint(ctx) {
    if (this.bar.bossArmour <= 0) {
      return;
    }
    const fontSize = this.bar.getScaledFontSize(this.getBossHintFontRatio(0.018));
    const hintX = ctx.canvas.width - this.bar.x * 2;
    const hintY = this.bar.y + this.bar.height * 2 + this.bar.canvasHeight * 0.068;
    const text = this.getArmourHintText();
    ctx.save();
    this.applyWarningHintStyle(ctx, fontSize);
    ctx.strokeText(text, hintX, hintY);
    ctx.fillText(text, hintX, hintY);
    ctx.restore();
  }

  /**
   * Formats elapsed boss encounter duration as Time: SS:CS.
   * @returns {string} Formatted boss timer string.
   */
  formatBossTime() {
    const sec = this.bar.formatCount(Math.floor(this.bar.bossTimeMs / 1000));
    const ms = this.bar.formatCount(Math.floor((this.bar.bossTimeMs % 1000) / 10));
    return "Time: " + sec + ":" + ms;
  }

  /**
   * Draws the elapsed boss fight timer centered near the top of the live viewport.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  drawBossTimerGroup(ctx) {
    const timeText = this.formatBossTime();
    const timeX = ctx.canvas.width / 2;
    const timeY = this.bar.y + this.bar.height * 0.55;
    ctx.save();
    ctx.textAlign = "center";
    ctx.strokeText(timeText, timeX, timeY);
    ctx.fillText(timeText, timeX, timeY);
    ctx.restore();
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
