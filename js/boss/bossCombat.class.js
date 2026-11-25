/**
 * Combat, armor shield, vertical hit-zone, and counter-AI base class for the Endboss.
 */
class BossCombat extends MovableObject {
  health = 100;
  armour = 100;
  isActivated = false;
  isDead = false;
  isAttacking = false;
  deadTime = 0;
  lastHit = 0;
  attackStartTime = 0;
  backHitCount = 0;

  /**
   * Creates the boss combat base layer on the given canvas.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   */
  constructor(canvas) {
    super(canvas);
  }

  /**
   * Returns true while the boss hurt feedback window is active.
   * @returns {boolean} True if recently hit.
   */
  isHurt() {
    return performance.now() - this.lastHit < 600;
  }

  /**
   * Applies vertical hit-zone damage, plays impact or shatter SFX, and tracks back-hits.
   * @param {ThrowableBottle} bottle - Impacting salsa bottle.
   * @returns {void}
   */
  applyZoneHit(bottle) {
    if (!this.isActivated || this.isDead) {
      return;
    }
    const hadArmour = this.armour > 0;
    const damage = this.calculateZoneDamage(bottle);
    this.takeDamage(damage);
    this.playHitImpactAudio(hadArmour);
    this.checkBackHitReaction(bottle);
  }

  /**
   * Plays the armor shatter SFX on shield break or the regular boss hit SFX otherwise.
   * @param {boolean} hadArmour - True if the boss still had armor before this hit.
   * @returns {void}
   */
  playHitImpactAudio(hadArmour) {
    if (hadArmour && this.armour <= 0) {
      playArmourBreakSound();
    } else {
      playBossHitSound();
    }
  }

  /**
   * Counts back-hits and triggers an instant turnaround counter after three hits.
   * @param {ThrowableBottle} bottle - Impacting salsa bottle.
   * @returns {void}
   */
  checkBackHitReaction(bottle) {
    if (this.isHitFromBehind(bottle)) {
      this.backHitCount += 1;
      if (this.backHitCount >= 3) {
        this.executeTurnAroundCombo();
      }
    }
  }

  /**
   * Evaluates whether a bottle hit the boss from behind its facing direction.
   * @param {ThrowableBottle} bottle - Impacting salsa bottle.
   * @returns {boolean} True if hit from behind.
   */
  isHitFromBehind(bottle) {
    const bottleCenter = bottle.x + bottle.width * 0.5;
    const bossCenter = this.x + this.width * 0.5;
    if (this.otherDirection) {
      return bottleCenter < bossCenter;
    }
    return bottleCenter > bossCenter;
  }

  /**
   * Turns the boss around immediately and launches a counter salvo.
   * @returns {void}
   */
  executeTurnAroundCombo() {
    this.backHitCount = 0;
    this.otherDirection = !this.otherDirection;
    this.isAttacking = true;
    this.attackStartTime = performance.now();
    this.triggerSpecialAttack();
  }

  /**
   * Calculates critical or standard damage based on vertical impact height.
   * @param {ThrowableBottle} bottle - Impacting salsa bottle.
   * @returns {number} Computed damage points.
   */
  calculateZoneDamage(bottle) {
    const hitY = bottle.y + bottle.height * 0.5 - this.y;
    const relY = hitY / this.height;
    if (relY <= 0.2) {
      return 20;
    } else if (relY <= 0.5) {
      return 10;
    } else if (relY <= 0.8) {
      return 5;
    }
    return 2;
  }

  /**
   * Deducts armor first, then health, and marks the boss dead at zero health.
   * @param {number} damage - Incoming damage amount.
   * @returns {void}
   */
  takeDamage(damage) {
    const leftover = this.absorbArmourDamage(damage);
    this.health -= leftover;
    this.lastHit = performance.now();
    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      this.deadTime = performance.now();
    }
  }

  /**
   * Absorbs incoming damage with the armor shield and returns overflow damage.
   * @param {number} damage - Incoming damage amount.
   * @returns {number} Remaining damage after armor absorption.
   */
  absorbArmourDamage(damage) {
    if (this.armour <= 0) {
      return damage;
    }
    if (this.armour >= damage) {
      this.armour -= damage;
      return 0;
    }
    const rest = damage - this.armour;
    this.armour = 0;
    return rest;
  }
}