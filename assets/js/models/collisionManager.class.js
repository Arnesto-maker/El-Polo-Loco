/**
 * Handles all gameplay hit detection, sound triggers, and expired entity cleanup.
 */
class CollisionManager {
  /**
   * Creates a collision manager connected to the active GameEngine.
   * @param {GameEngine} engine - Parent GameEngine instance.
   */
  constructor(engine) {
    this.engine = engine;
  }

  /**
   * Runs all collision checks for the player and projectiles on the current frame.
   * @param {Character} char - Player character instance.
   * @returns {void}
   */
  checkAllCollisions(char) {
    if (char.isDead()) {
      return;
    }
    this.checkChickenCollision(char);
    this.checkCoinCollisions(char);
    this.checkBottleCollisions(char);
    this.checkThrownBottleCollisions();
    this.checkBossCollisions(char);
    this.checkBossBottleCollisions(char);
  }

  /**
   * Removes finished dead enemies, splashed bottles, and transitions on boss defeat.
   * @returns {void}
   */
  cleanupObjects() {
    this.removeExpiredBottles("throwableBottles");
    this.removeExpiredBottles("bossBottles");
    this.removeDeadChickens();
    this.removeDeadBoss();
  }

  /**
   * Checks all active player-thrown bottles against enemies and the boss.
   * @returns {void}
   */
  checkThrownBottleCollisions() {
    const bottles = this.engine.world.throwableBottles;
    for (let i = 0; i < bottles.length; i++) {
      if (!bottles[i].isSplashing) {
        this.checkBottleHitsEnemy(bottles[i]);
      }
    }
  }

  /**
   * Tests a single thrown bottle against regular enemies and the boss.
   * @param {ThrowableBottle} bottle - Active thrown bottle.
   * @returns {void}
   */
  checkBottleHitsEnemy(bottle) {
    const enemies = this.engine.world.enemies;
    for (let i = 0; i < enemies.length; i++) {
      if (!enemies[i].isDead && bottle.isColliding(enemies[i])) {
        bottle.startSplashSequenz();
        enemies[i].die();
        this.engine.statusBar.score += 500;
      }
    }
    this.checkBottleHitsBoss(bottle);
  }

  /**
   * Applies vertical hit-zone damage when a player bottle hits the Endboss.
   * @param {ThrowableBottle} bottle - Active thrown bottle.
   * @returns {void}
   */
  checkBottleHitsBoss(bottle) {
    const boss = this.engine.world.boss;
    if (boss && !boss.isDead && bottle.isColliding(boss)) {
      bottle.startSplashSequenz();
      boss.applyZoneHit(bottle);
      this.engine.statusBar.bossHealth = boss.health;
      this.engine.statusBar.bossArmour = boss.armour;
      this.engine.statusBar.updateBossHealthImage();
    }
  }

  /**
   * Checks contact damage between Pepe and the active boss.
   * @param {Character} char - Player character instance.
   * @returns {void}
   */
  checkBossCollisions(char) {
    const boss = this.engine.world.boss;
    if (!boss || !boss.isActivated || boss.isDead) {
      return;
    }
    if (char.isColliding(boss) && !char.isHurt()) {
      this.applyBossContactDamage(char, boss);
    }
  }

  /**
   * Deducts higher melee attack damage or light contact damage from Pepe and plays hurt SFX.
   * @param {Character} char - Player character instance.
   * @param {Boss} boss - Active Endboss instance.
   * @returns {void}
   */
  applyBossContactDamage(char, boss) {
    if (boss.isAttacking) {
      char.health = Math.max(0, char.health - 10);
    } else {
      char.health = Math.max(0, char.health - 2);
    }
    playHurtSound();
    char.lastHit = performance.now();
    this.engine.statusBar.health = char.health;
    this.engine.statusBar.updateHealthImage();
  }

  /**
   * Checks collisions between Pepe and incoming boss salvo bottles.
   * @param {Character} char - Player character instance.
   * @returns {void}
   */
  checkBossBottleCollisions(char) {
    const bottles = this.engine.world.bossBottles;
    for (let i = 0; i < bottles.length; i++) {
      if (!bottles[i].isSplashing && char.isColliding(bottles[i])) {
        bottles[i].startSplashSequenz();
        if (!char.isHurt()) {
          this.startCharHitSequence(char);
        }
      }
    }
  }

  /**
   * Checks collisions and stomps against all regular chickens.
   * @param {Character} char - Player character instance.
   * @returns {void}
   */
  checkChickenCollision(char) {
    const enemies = this.engine.world.enemies;
    for (let i = 0; i < enemies.length; i++) {
      this.updateChickenCollision(char, enemies[i]);
    }
  }

  /**
   * Resolves a stomp kill or contact damage against one chicken enemy.
   * @param {Character} char - Player character instance.
   * @param {Chicken} enemy - Target chicken enemy.
   * @returns {void}
   */
  updateChickenCollision(char, enemy) {
    if (enemy.isDead) {
      return;
    }
    if (char.isStomping(enemy)) {
      this.startCharStompingSequence(char, enemy);
    } else if (char.isColliding(enemy) && !char.isHurt()) {
      this.startCharHitSequence(char);
    }
  }

  /**
   * Bounces Pepe, awards points, plays stomp SFX, and kills the stomped chicken.
   * @param {Character} char - Player character instance.
   * @param {Chicken} enemy - Stomped chicken enemy.
   * @returns {void}
   */
  startCharStompingSequence(char, enemy) {
    char.initGeneralJumpAction();
    this.engine.statusBar.score += 500;
    char.startJumpingAnimation();
    enemy.die();
    playStompSound();
  }

  /**
   * Damages Pepe and refreshes the HUD health bar.
   * @param {Character} char - Player character instance.
   * @returns {void}
   */
  startCharHitSequence(char) {
    char.hit();
    this.engine.statusBar.health = char.health;
    this.engine.statusBar.updateHealthImage();
  }

  /**
   * Collects coins overlapping Pepe's hitbox and plays coin SFX.
   * @param {Character} char - Player character instance.
   * @returns {void}
   */
  checkCoinCollisions(char) {
    const coins = this.engine.world.coins;
    for (let i = coins.length - 1; i >= 0; i--) {
      if (char.isColliding(coins[i])) {
        coins.splice(i, 1);
        this.engine.statusBar.coinCount += 1;
        this.engine.statusBar.score += 100;
        playCoinSound();
        this.engine.refreshFrameObjects();
      }
    }
  }

  /**
   * Collects ground salsa bottles overlapping Pepe's hitbox and plays pickup SFX.
   * @param {Character} char - Player character instance.
   * @returns {void}
   */
  checkBottleCollisions(char) {
    const bottles = this.engine.world.bottles;
    for (let i = bottles.length - 1; i >= 0; i--) {
      if (char.isColliding(bottles[i])) {
        bottles.splice(i, 1);
        this.engine.statusBar.bottleCount += 1;
        playBottlePickupSound();
        this.engine.refreshFrameObjects();
      }
    }
  }

  /**
   * Removes splashed bottles older than 400ms from a world collection.
   * @param {string} listKey - World property key for the bottle array.
   * @returns {void}
   */
  removeExpiredBottles(listKey) {
    const source = this.engine.world[listKey];
    const active = [];
    for (let i = 0; i < source.length; i++) {
      if (!source[i].isSplashing || performance.now() - source[i].splashTime < 400) {
        active.push(source[i]);
      }
    }
    if (active.length !== source.length) {
      this.engine.world[listKey] = active;
      this.engine.refreshFrameObjects();
    }
  }

  /**
   * Removes defeated chickens older than 500ms from the world.
   * @returns {void}
   */
  removeDeadChickens() {
    const enemies = this.engine.world.enemies;
    const active = [];
    for (let i = 0; i < enemies.length; i++) {
      if (!enemies[i].isDead || performance.now() - enemies[i].deadTime < 500) {
        active.push(enemies[i]);
      }
    }
    if (active.length !== enemies.length) {
      this.engine.world.enemies = active;
      this.engine.refreshFrameObjects();
    }
  }

  /**
   * Triggers the victory sequence 1 second after the boss is defeated.
   * @returns {void}
   */
  removeDeadBoss() {
    const boss = this.engine.world.boss;
    if (boss && boss.isDead && performance.now() - boss.deadTime >= 1000) {
      const winStats = this.engine.combatManager.collectWinStats();
      this.engine.world.boss = null;
      startYouWonFlow(winStats);
    }
  }
}