/**
 * Endboss El Pollo Loco controlling dt-scaled arena entry, patrol movement, salvos, and animations.
 */
class Boss extends BossCombat {
  hasEnteredArena = false;
  readyToSpawnSpecial = false;
  isDoingSpecial = false;
  lastSpecialTime = 0;
  nextAttackTime = 0;
  salvoCount = 0;
  lastSalvoTime = 0;
  specialStartTime = 0;

  /**
   * Initializes boss sprites, physical bounds, and arena patrol limits.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   */
  constructor(canvas) {
    super(canvas);
    this.loadAllImages();
    this.setMainParameter();
    this.setPositionLimits();
  }

  /**
   * Builds and preloads a sequential sprite array for the Endboss.
   * @param {string} dir - Subfolder inside assets/img/4_enemie_boss_chicken.
   * @param {number} start - First G-sprite index.
   * @param {number} end - Last G-sprite index.
   * @returns {Array<string>} Preloaded sprite path list.
   */
  loadBossRange(dir, start, end) {
    const paths = [];
    const base = `assets/img/4_enemie_boss_chicken/${dir}/G`;
    for (let i = start; i <= end; i++) {
      paths.push(`${base}${i}.png`);
    }
    this.loadImages(paths);
    return paths;
  }

  /**
   * Preloads all boss sprite animations.
   * @returns {void}
   */
  loadAllImages() {
    this.IMAGES_WALK = this.loadBossRange("1_walk", 1, 4);
    this.IMAGES_ALERT = this.loadBossRange("2_alert", 5, 12);
    this.IMAGES_ATTACK = this.loadBossRange("3_attack", 13, 20);
    const atk = this.IMAGES_ATTACK;
    this.IMAGES_SPECIAL_ATTACK = [atk[5], atk[6], atk[5], atk[6], atk[7]];
    this.IMAGES_HURT = this.loadBossRange("4_hurt", 21, 23);
    this.IMAGES_DEAD = this.loadBossRange("5_dead", 24, 26);
  }

  /**
   * Configures initial boss dimensions, speed, spawn coordinate, and hitbox.
   * @returns {void}
   */
  setMainParameter() {
    this.img = this.imageCache[this.IMAGES_ALERT[0]];
    this.width = this.canvasWidth * 0.25;
    this.height = this.canvasHeight * 0.55;
    this.x = this.canvasWidth * 2;
    this.y = this.getGroundLine() + 10;
    this.speed = 3.5;
    this.offset = {
      top: this.height * 0.15,
      bottom: this.height * 0.08,
      left: this.width * 0.12,
      right: this.width * 0.12,
    };
  }

  /**
   * Calculates horizontal arena patrol boundaries and entry target.
   * @returns {void}
   */
  setPositionLimits() {
    this.pos1X = this.canvasWidth * 0.15;
    this.pos2X = this.canvasWidth * 2 - this.canvasWidth * 0.15 - this.width;
    this.entryTargetX = this.canvasWidth * 2 - this.width;
  }

  /**
   * Updates boss AI state and plays dt-scaled animations each frame.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  update(controller, scale = 1) {
    if (this.isDead) {
      this.playAnimation(this.IMAGES_DEAD, scale);
      return;
    }
    if (!this.isActivated) {
      this.playAnimation(this.IMAGES_ALERT, scale);
      return;
    }
    this.runActiveBossBehavior(scale);
  }

  /**
   * Runs arena walk-in or full combat patrol and attack logic.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  runActiveBossBehavior(scale = 1) {
    if (!this.hasEnteredArena) {
      this.moveIntoArena(scale);
    } else {
      this.updateCombatCycle();
      this.movePatrol(scale);
      this.updateCombatAnimation(scale);
    }
  }

  /**
   * Walks the boss into the arena before starting its first salvo.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  moveIntoArena(scale = 1) {
    this.x -= this.speed * scale;
    this.playAnimation(this.IMAGES_WALK, scale);
    if (this.x <= this.entryTargetX) {
      this.x = this.entryTargetX;
      this.hasEnteredArena = true;
      this.triggerSpecialAttack();
      this.setNextRandomAttack();
    }
  }

  /**
   * Starts a 3-wave bullet-hell bottle salvo sequence.
   * @returns {void}
   */
  triggerSpecialAttack() {
    const now = performance.now();
    this.isDoingSpecial = true;
    this.readyToSpawnSpecial = true;
    this.salvoCount = 1;
    this.lastSalvoTime = now;
    this.lastSpecialTime = now;
    this.specialStartTime = now;
    this.imageCounter = 0;
    this.frameTick = 0;
  }

  /**
   * Fires remaining waves of an active salvo every 450ms.
   * @param {number} now - Current high-resolution timestamp.
   * @returns {void}
   */
  updateSpecialSalvos(now) {
    if (!this.isDoingSpecial || this.salvoCount >= 3) {
      return;
    }
    if (now - this.lastSalvoTime >= 450) {
      this.readyToSpawnSpecial = true;
      this.salvoCount += 1;
      this.lastSalvoTime = now;
    }
  }

  /**
   * Evaluates timers for special salvos and random melee attacks.
   * @returns {void}
   */
  updateCombatCycle() {
    const now = performance.now();
    const cooldown = this.getSalvoCooldown();
    if (now - this.lastSpecialTime >= cooldown) {
      this.triggerSpecialAttack();
    }
    this.updateSpecialSalvos(now);
    this.checkAttackStart(now);
    this.checkAttackEnd(now);
    this.checkSpecialEnd(now);
  }

  /**
   * Returns 8s salvo cooldown in rage mode (0 armor) or 15s otherwise.
   * @returns {number} Cooldown in milliseconds.
   */
  getSalvoCooldown() {
    if (this.armour <= 0) {
      return 8000;
    }
    return 15000;
  }

  /**
   * Starts a melee attack state when the random timer elapses.
   * @param {number} now - Current timestamp.
   * @returns {void}
   */
  checkAttackStart(now) {
    if (!this.isAttacking && !this.isDoingSpecial && now >= this.nextAttackTime) {
      this.isAttacking = true;
      this.attackStartTime = now;
    }
  }

  /**
   * Ends melee attack state after 800ms and schedules the next one.
   * @param {number} now - Current timestamp.
   * @returns {void}
   */
  checkAttackEnd(now) {
    if (this.isAttacking && now - this.attackStartTime >= 800) {
      this.isAttacking = false;
      this.setNextRandomAttack();
    }
  }

  /**
   * Ends the special attack visual state after 1500ms.
   * @param {number} now - Current timestamp.
   * @returns {void}
   */
  checkSpecialEnd(now) {
    if (this.isDoingSpecial && now - this.specialStartTime >= 1500) {
      this.isDoingSpecial = false;
    }
  }

  /**
   * Schedules the next melee attack between 2 and 5 seconds ahead.
   * @returns {void}
   */
  setNextRandomAttack() {
    const randomDelay = 2000 + Math.random() * 3000;
    this.nextAttackTime = performance.now() + randomDelay;
  }

  /**
   * Moves the boss horizontally across its patrol corridor using dt scale.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  movePatrol(scale = 1) {
    if (this.otherDirection) {
      this.x += this.speed * scale;
    } else {
      this.x -= this.speed * scale;
    }
    this.checkPatrolBoundaries();
  }

  /**
   * Reverses boss direction at left and right patrol bounds.
   * @returns {void}
   */
  checkPatrolBoundaries() {
    if (this.x <= this.pos1X) {
      this.otherDirection = true;
    } else if (this.x >= this.pos2X) {
      this.otherDirection = false;
    }
  }

  /**
   * Reverses horizontal patrol direction immediately on player collision.
   * @returns {void}
   */
  reverseDirection() {
    if (!this.hasEnteredArena || this.isDead) {
      return;
    }
    this.otherDirection = !this.otherDirection;
  }

  /**
   * Plays hurt, special, attack, or walk animation based on priority.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  updateCombatAnimation(scale = 1) {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT, scale);
    } else if (this.isDoingSpecial) {
      this.playAnimation(this.IMAGES_SPECIAL_ATTACK, scale);
    } else if (this.isAttacking) {
      this.playAnimation(this.IMAGES_ATTACK, scale);
    } else {
      this.playAnimation(this.IMAGES_WALK, scale);
    }
  }
}