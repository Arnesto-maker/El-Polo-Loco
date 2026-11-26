/**
 * Renders Scene 1 (Jump-Throw crit) and Scene 2 (Salvo attack & hurt) on the Boss Dossier canvas.
 */
class BossDossierScenes {
  /**
   * Connects the scene renderer to its parent BossDossierAnimator helper instance.
   * @param {BossDossierAnimator} animator - Parent animator owning canvas context and sprite cache.
   */
  constructor(animator) {
    this.animator = animator;
  }

  /**
   * Renders Scene 1: Pepe jump-throwing a salsa bottle onto the Boss head zone.
   * @param {number} t - Elapsed Scene 1 time in seconds.
   * @returns {void}
   */
  drawSceneOne(t) {
    const pepeY = this.getPepeJumpY(t);
    this.drawJumpGhosts(t, pepeY);
    this.drawSceneOnePepe(t, pepeY);
    this.drawSceneOneBoss(t);
    this.drawZoneOneBracket(505, 92);
    this.drawSceneOneBottle(t);
  }

  /**
   * Computes Pepe's parabolic vertical coordinate during the Scene 1 jump.
   * @param {number} t - Elapsed Scene 1 time in seconds.
   * @returns {number} Pepe top Y coordinate.
   */
  getPepeJumpY(t) {
    if (t < 0.4 || t > 1.45) {
      return 154;
    }
    const u = (t - 0.4) / 1.05;
    return 154 - 4 * u * (1 - u) * 118;
  }

  /**
   * Draws vertical motion trail guide marks while Pepe jumps upward.
   * @param {number} t - Elapsed Scene 1 time in seconds.
   * @param {number} pepeY - Current Pepe Y coordinate.
   * @returns {void}
   */
  drawJumpGhosts(t, pepeY) {
    if (t < 0.45 || t > 1.4) {
      return;
    }
    this.animator.ctx.save();
    this.animator.ctx.setLineDash([7, 7]);
    this.animator.ctx.strokeStyle = "rgba(0, 0, 0, 0.55)";
    this.animator.ctx.lineWidth = 3;
    this.animator.ctx.beginPath();
    this.animator.ctx.moveTo(163, 296);
    this.animator.ctx.lineTo(163, pepeY + 135);
    this.animator.ctx.stroke();
    this.animator.ctx.restore();
  }

  /**
   * Renders Pepe in idle, jump, or throw pose for Scene 1.
   * @param {number} t - Elapsed Scene 1 time in seconds.
   * @param {number} pepeY - Current Pepe Y coordinate.
   * @returns {void}
   */
  drawSceneOnePepe(t, pepeY) {
    let path = "assets/img/2_character_pepe/1_idle/idle/I-1.png";
    if (t >= 0.78 && t <= 1.15) {
      path = "assets/img/2_character_pepe/6_throw/T-2.png";
    } else if (t >= 0.4 && t <= 1.45) {
      path = "assets/img/2_character_pepe/3_jump/J-34.png";
    }
    this.animator.drawSprite(path, 115, pepeY, 96, 154);
  }

  /**
   * Draws the top 0-20% critical head target highlight box on the Boss.
   * @param {number} bossX - Boss left X coordinate.
   * @param {number} bossY - Boss top Y coordinate.
   * @returns {void}
   */
  drawZoneOneBracket(bossX, bossY) {
    const ctx = this.animator.ctx;
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = "#b71c1c";
    ctx.lineWidth = 3;
    ctx.strokeRect(bossX + 24, bossY + 6, 136, 44);
    ctx.restore();
  }

  /**
   * Renders the Boss alert or hurt-shaking sprite for Scene 1.
   * @param {number} t - Elapsed Scene 1 time in seconds.
   * @returns {void}
   */
  drawSceneOneBoss(t) {
    let path = "assets/img/4_enemie_boss_chicken/2_alert/G5.png";
    let shakeX = 0;
    if (t >= 1.75 && t < 2.55) {
      const idx = 21 + (Math.floor((t - 1.75) * 10) % 3);
      path = `assets/img/4_enemie_boss_chicken/4_hurt/G${idx}.png`;
      shakeX = Math.sin((t - 1.75) * 48) * 7;
    }
    this.animator.drawSprite(path, 505 + shakeX, 92, 188, 216);
  }

  /**
   * Draws the Scene 1 jump-throw bottle flight arc, splash, and -20 CRIT badge.
   * @param {number} t - Elapsed Scene 1 time in seconds.
   * @returns {void}
   */
  drawSceneOneBottle(t) {
    if (t >= 0.85 && t < 1.75) {
      const p = (t - 0.85) / 0.9;
      this.animator.drawFlightBottle(195, 78, 565, 118, 58, p);
    } else if (t >= 1.75 && t < 2.55) {
      const sp = (t - 1.75) / 0.8;
      this.animator.drawSplashAt(540, 86, sp);
      this.animator.drawImpactLabel("-20 CRIT!", 595, 76 - sp * 22, "#ffeb3b", "#7f0000");
    }
  }

  /**
   * Renders Scene 2: Boss radial salvo attack hitting Pepe with hurt feedback.
   * @param {number} t - Elapsed Scene 2 time in seconds.
   * @returns {void}
   */
  drawSceneTwo(t) {
    this.drawSceneTwoBoss(t);
    this.drawSceneTwoPepe(t);
    this.drawSalvoVolley(t);
  }

  /**
   * Draws the Boss performing its salvo attack animation in Scene 2.
   * @param {number} t - Elapsed Scene 2 time in seconds.
   * @returns {void}
   */
  drawSceneTwoBoss(t) {
    let path = "assets/img/4_enemie_boss_chicken/2_alert/G5.png";
    if (t >= 0.2 && t < 1.9) {
      const idx = 18 + (Math.floor(t * 8) % 2);
      path = `assets/img/4_enemie_boss_chicken/3_attack/G${idx}.png`;
    }
    this.animator.drawSprite(path, 415, 92, 188, 216);
  }

  /**
   * Draws Pepe taking hurt damage animation and shake when hit by the salvo.
   * @param {number} t - Elapsed Scene 2 time in seconds.
   * @returns {void}
   */
  drawSceneTwoPepe(t) {
    let path = "assets/img/2_character_pepe/1_idle/idle/I-1.png";
    let shakeX = 0;
    if (t >= 1.65 && t < 2.75) {
      const idx = 41 + (Math.floor((t - 1.65) * 10) % 3);
      path = `assets/img/2_character_pepe/4_hurt/H-${idx}.png`;
      shakeX = Math.sin((t - 1.65) * 52) * 7;
    }
    this.animator.drawSprite(path, 115 + shakeX, 154, 96, 154);
    if (t >= 1.65 && t < 2.75) {
      this.animator.drawImpactLabel("HURT!", 165, 134 - (t - 1.65) * 18, "#ffffff", "#7f0000");
    }
  }

  /**
   * Draws the 4-arc radial salvo bottles flying left and right from the Boss.
   * @param {number} t - Elapsed Scene 2 time in seconds.
   * @returns {void}
   */
  drawSalvoVolley(t) {
    if (t < 0.45) {
      return;
    }
    const targets = [
      { ex: 148, ey: 195, lift: 108 },
      { ex: 265, ey: 256, lift: 92 },
      { ex: 665, ey: 256, lift: 92 },
      { ex: 748, ey: 256, lift: 108 },
    ];
    for (let i = 0; i < targets.length; i++) {
      this.drawSalvoBottle(targets[i], t);
    }
  }

  /**
   * Renders one radial salvo bottle arc and its impact splash.
   * @param {{ex: number, ey: number, lift: number}} spec - Target arc configuration.
   * @param {number} t - Elapsed Scene 2 time in seconds.
   * @returns {void}
   */
  drawSalvoBottle(spec, t) {
    if (t < 1.65) {
      const p = (t - 0.45) / 1.2;
      this.animator.drawFlightBottle(492, 102, spec.ex, spec.ey, spec.lift, p);
    } else if (t < 2.35) {
      const sp = (t - 1.65) / 0.7;
      this.animator.drawSplashAt(spec.ex - 12, spec.ey - 12, sp);
    }
  }
}
