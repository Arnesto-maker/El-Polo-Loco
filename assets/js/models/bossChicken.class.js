class Boss extends MovableObject {
  health = 100;
  isActivated = false;
  hasEnteredArena = false;
  isDead = false;
  isAttacking = false;
  readyToSpawnSpecial = false;
  deadTime = 0;
  lastHit = 0;
  lastSpecialTime = 0;
  nextAttackTime = 0;
  attackStartTime = 0;

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

  IMAGES_HURT = [
    "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  IMAGES_DEAD = [
    "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor(canvas) {
    super(canvas);
    this.loadAllImages();
    this.setMainParameter();
    this.setPositionLimits();
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_SPECIAL_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  setMainParameter() {
    this.img = this.imageCache[this.IMAGES_ALERT[0]];
    this.width = this.canvasWidth * 0.25;
    this.height = this.canvasHeight * 0.48;
    this.x = this.canvasWidth * 2;
    this.y = this.getGroundLine();
    this.speed = 3.5;
    this.offset = this.setOffsetParameter();
  }

  setPositionLimits() {
    this.pos1X =  this.canvasWidth * 0.15;
    this.pos2X = this.canvasWidth * 2 - this.canvasWidth * 0.15 - this.width;
    this.entryTargetX = this.canvasWidth * 2 - this.width;
  }

  setOffsetParameter() {
    return {
      top: this.height * 0.15,
      bottom: this.height * 0.08,
      left: this.width * 0.12,
      right: this.width * 0.12,
    };
  }

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

  runActiveBossBehavior() {
    if (!this.hasEnteredArena) {
      this.moveIntoArena();
    } else {
      this.updateCombatCycle();
      this.movePatrol();
      this.updateCombatAnimation();
    }
  }

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

  triggerSpecialAttack() {
    this.isDoingSpecial = true;
    this.readyToSpawnSpecial = true;
    this.lastSpecialTime = performance.now();
    this.specialStartTime = performance.now();
    this.imageCounter = 0;
    this.frameTick = 0;
  }

  updateCombatCycle() {
    const now = performance.now();
    if (now - this.lastSpecialTime >= 15000) {
      this.triggerSpecialAttack();
    }
    if (
      !this.isAttacking &&
      !this.isDoingSpecial &&
      now >= this.nextAttackTime
    ) {
      this.isAttacking = true;
      this.attackStartTime = now;
    }
    this.checkAttackEnd(now);
    this.checkSpecialEnd(now);
  }

  checkAttackEnd(now) {
    if (this.isAttacking && now - this.attackStartTime >= 800) {
      this.isAttacking = false;
      this.setNextRandomAttack();
    }
  }

  checkSpecialEnd(now) {
    if (this.isDoingSpecial && now - this.specialStartTime >= 1000) {
      this.isDoingSpecial = false;
    }
  }

  setNextRandomAttack() {
    const randomDelay = 2000 + Math.random() * 3000;
    this.nextAttackTime = performance.now() + randomDelay;
  }

  movePatrol() {
    if (this.otherDirection) {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }
    this.checkPatrolBoundaries();
  }

  checkPatrolBoundaries() {
    if (this.x <= this.pos1X) {
      this.otherDirection = true;
    } else if (this.x >= this.pos2X) {
      this.otherDirection = false;
    }
  }

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

  isHurt() {
    return performance.now() - this.lastHit < 600;
  }

  applyZoneHit(bottle) {
    if (!this.isActivated || this.isDead) {
      return;
    }
    const damage = this.calculateZoneDamage(bottle);
    this.takeDamage(damage);
  }

  calculateZoneDamage(bottle) {
    const hitY = bottle.y + bottle.height * 0.5 - this.y;
    const relY = hitY / this.height;
    if (relY <= 0.2) {
      return 20;
    } else if (relY <= 0.5) {
      return 15;
    } else if (relY <= 0.8) {
      return 5;
    }
    return 2;
  }

  takeDamage(damage) {
    this.health -= damage;
    this.lastHit = performance.now();
    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      this.deadTime = performance.now();
    }
  }
}
