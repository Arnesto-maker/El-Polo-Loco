/**
 * Endboss El Pollo Loco controlling arena entry, patrol movement, salvos, and animations.
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

  IMAGES_WALK = [
    "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "assets/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_ALERT = [
    "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  IMAGES_ATTACK = [
    "assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  IMAGES_SPECIAL_ATTACK = [
    "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  IMAGES_HURT = ["assets/img/4_enemie_boss_chicken/4_hurt/G21.png", "assets/img/4_enemie_boss_chicken/4_hurt/G22.png", "assets/img/4_enemie_boss_chicken/4_hurt/G23.png"];
  IMAGES_DEAD = ["assets/img/4_enemie_boss_chicken/5_dead/G24.png", "assets/img/4_enemie_boss_chicken/5_dead/G25.png", "assets/img/4_enemie_boss_chicken/5_dead/G26.png"];
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
   * Preloads all boss sprite animations.
   * @returns {void}
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_SPECIAL_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
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
    this.offset = this.setOffsetParameter();
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
   * Builds the collision offset box for the boss.
   * @returns {{top: number, bottom: number, left: number, right: number}} Hitbox offsets.
   */
  setOffsetParameter() {
    return {
      top: this.height * 0.15,
      bottom: this.height * 0.08,
      left: this.width * 0.12,
      right: this.width * 0.12,
    };
  }

  /**
   * Updates boss AI state and plays the appropriate animation each frame.
   * @returns {void}
   */
  update() {
    if (this.isDead) {
      this.playAnimation(this.IMAGES_DEAD);
      return;
    }
    if (!this.isActivated) {
      this.playAnimation(this.IMAGES_ALERT);
      return;
    }
    this.runActiveBossBehavior();
  }

  /**
   * Runs arena walk-in or full combat patrol and attack logic.
   * @returns {void}
   */
  runActiveBossBehavior() {
    if (!this.hasEnteredArena) {
      this.moveIntoArena();
    } else {
      this.updateCombatCycle();
      this.movePatrol();
      this.updateCombatAnimation();
    }
  }

  /**
   * Walks the boss into the arena before starting its first salvo.
   * @returns {void}
   */
  moveIntoArena() {
    this.x -= this.speed;
    this.playAnimation(this.IMAGES_WALK);
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
   * Moves the boss horizontally across its patrol corridor.
   * @returns {void}
   */
  movePatrol() {
    if (this.otherDirection) {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
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
   * Plays hurt, special, attack, or walk animation based on priority.
   * @returns {void}
   */
  updateCombatAnimation() {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isDoingSpecial) {
      this.playAnimation(this.IMAGES_SPECIAL_ATTACK);
    } else if (this.isAttacking) {
      this.playAnimation(this.IMAGES_ATTACK);
    } else {
      this.playAnimation(this.IMAGES_WALK);
    }
  }
}
