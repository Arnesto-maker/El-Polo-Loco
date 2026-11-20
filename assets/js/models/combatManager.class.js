/**
 * Coordinates player bottle throws, boss fight activation, economy soft-lock checks, music, and boss salvos.
 */
class CombatManager {
  /**
   * Creates a combat manager connected to the active GameEngine.
   * @param {GameEngine} engine - Parent GameEngine instance.
   */
  constructor(engine) {
    this.engine = engine;
  }

  /**
   * Starts throw animation on Enter press and spawns the bottle projectile when ready.
   * @param {Character} char - Player character instance.
   * @returns {void}
   */
  updateThrowWorkflow(char) {
    if (this.engine.controller.enter && this.engine.statusBar.bottleCount > 0) {
      char.startThrowSequence();
    }
    if (char.readyToSpawnBottle) {
      this.initBottleThrow(char);
    }
  }

  /**
   * Deducts one bottle, plays throw SFX, and computes launch coordinates.
   * @param {Character} char - Player character instance.
   * @returns {void}
   */
  initBottleThrow(char) {
    char.readyToSpawnBottle = false;
    this.engine.statusBar.bottleCount -= 1;
    playThrowSound();
    const startX = this.getBottleStartX(char);
    const startY = char.y + char.height * 0.25;
    const yMax = char.canvasHeight - char.canvasHeight * 0.1 - char.floor;
    this.spawnThrownBottle(startX, startY, char.otherDirection, yMax);
  }

  /**
   * Calculates horizontal bottle launch offset based on facing direction.
   * @param {Character} char - Player character instance.
   * @returns {number} Launch X coordinate.
   */
  getBottleStartX(char) {
    if (char.otherDirection) {
      return char.x;
    }
    return char.x + char.width * 0.7;
  }

  /**
   * Adds a new ThrowableBottle projectile to the world and updates render frames.
   * @param {number} startX - Launch X coordinate.
   * @param {number} startY - Launch Y coordinate.
   * @param {boolean} otherDirection - True if thrown left.
   * @param {number} yMax - Ground splash Y coordinate.
   * @returns {void}
   */
  spawnThrownBottle(startX, startY, otherDirection, yMax) {
    const bottle = new ThrowableBottle(this.engine.ctx.canvas, startX, startY, otherDirection, yMax);
    this.engine.world.throwableBottles.push(bottle);
    this.engine.refreshFrameObjects();
  }

  /**
   * Activates the boss once all chickens are defeated, updates boss state, and checks economy soft-lock.
   * @param {number} dtMs - Elapsed active frame time in milliseconds.
   * @returns {void}
   */
  updateBossFightState(dtMs) {
    const boss = this.engine.world.boss;
    if (!boss || boss.isDead) {
      return;
    }
    if (!boss.isActivated && this.engine.world.enemies.length === 0) {
      this.activateBossFight(boss);
    }
    if (boss.isActivated) {
      this.updateBossHudAndSpecial(boss, dtMs);
    }
    this.checkEconomyGameOver();
  }

  /**
   * Triggers Game Over with Hint B whenever bottles are completely gone and coins are below 2.
   * @returns {void}
   */
  checkEconomyGameOver() {
    const char = this.engine.world.character;
    if (!char || char.isDead()) {
      return;
    }
    if (this.isEconomyDepleted()) {
      showGameOverFrame("hintB");
    }
  }

  /**
   * Evaluates whether no player bottles remain anywhere and current coins are below 2.
   * @returns {boolean} True when no bottle is available or collectible and coins are below 2.
   */
  isEconomyDepleted() {
    if (this.hasActivePlayerBottle()) {
      return false;
    }
    return this.engine.statusBar.coinCount < 2;
  }

  /**
   * Checks if Pepe holds, is throwing, has in flight, or can still collect any bottle.
   * @returns {boolean} True when at least one bottle remains available.
   */
  hasActivePlayerBottle() {
    const world = this.engine.world;
    const char = world.character;
    const hasInventory = this.engine.statusBar.bottleCount > 0;
    const hasWorldBottle = world.bottles.length > 0 || world.throwableBottles.length > 0;
    return hasInventory || hasWorldBottle || char.isThrowing || char.readyToSpawnBottle;
  }

  /**
   * Enables boss AI, switches to boss music, shows boss HUD, and opens the dossier.
   * @param {Boss} boss - Endboss instance.
   * @returns {void}
   */
  activateBossFight(boss) {
    boss.isActivated = true;
    this.engine.statusBar.showBossHud = true;
    this.engine.statusBar.bossBonus = 10000;
    this.engine.lastBossTick = performance.now();
    startBackgroundMusic("boss");
    this.engine.bossDossier.openPopup();
  }

  /**
   * Syncs boss stats to the HUD and fires bottle salvos when signaled.
   * @param {Boss} boss - Endboss instance.
   * @param {number} dtMs - Elapsed active frame time in milliseconds.
   * @returns {void}
   */
  updateBossHudAndSpecial(boss, dtMs) {
    this.updateBossTimerAndScore(dtMs);
    this.engine.statusBar.bossHealth = boss.health;
    this.engine.statusBar.bossArmour = boss.armour;
    this.engine.statusBar.updateBossHealthImage();
    if (boss.readyToSpawnSpecial) {
      boss.readyToSpawnSpecial = false;
      this.spawnBossSpecialBottles(boss);
    }
  }

  /**
   * Advances boss timer using clamped active dt and reduces the time-based boss score bonus.
   * @param {number} dtMs - Elapsed active frame time in milliseconds.
   * @returns {void}
   */
  updateBossTimerAndScore(dtMs) {
    this.engine.statusBar.bossTimeMs += dtMs;
    this.reduceBossScoreBonus(dtMs);
  }

  /**
   * Decays remaining boss bonus based on elapsed milliseconds.
   * @param {number} dtMs - Active frame delta in milliseconds.
   * @returns {void}
   */
  reduceBossScoreBonus(dtMs) {
    if (this.engine.statusBar.bossBonus > 0) {
      const penalty = Math.floor(dtMs * 0.1);
      this.engine.statusBar.bossBonus = Math.max(0, this.engine.statusBar.bossBonus - penalty);
    }
  }

  /**
   * Spawns a 6-bottle radial volley from the Endboss.
   * @param {Boss} boss - Endboss instance.
   * @returns {void}
   */
  spawnBossSpecialBottles(boss) {
    const velocitiesX = [-14, -9.5, -5, 5, 9.5, 14];
    const startX = boss.x + boss.width * 0.4;
    const startY = boss.y + boss.height * 0.1;
    for (let i = 0; i < velocitiesX.length; i++) {
      const bottle = new BossBottle(this.engine.ctx.canvas, startX, startY, velocitiesX[i], -21);
      this.engine.world.bossBottles.push(bottle);
    }
    this.engine.refreshFrameObjects();
  }

  /**
   * Finalizes boss bonus points and compiles the player's victory statistics.
   * @returns {{health: number, coins: number, bottles: number, score: number}} Final win stats.
   */
  collectWinStats() {
    const bar = this.engine.statusBar;
    bar.score += bar.bossBonus;
    bar.bossBonus = 0;
    bar.showBossHud = false;
    return {
      health: this.engine.world.character.health,
      coins: bar.coinCount,
      bottles: bar.bottleCount,
      score: bar.score,
    };
  }
}