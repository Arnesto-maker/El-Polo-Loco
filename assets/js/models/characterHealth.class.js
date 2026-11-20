/**
 * Base health, hurt-threshold, and death animation controller for the player character.
 */
class CharacterHealth extends MovableObject {
  health = 100;
  lastHit = 0;
  hurtTriggerTime = 0;
  nextHurtThreshold = 80;
  deathAnimationStarted = false;
  deathFinishedTime = 0;
  deathHoldDuration = 1200;
  isReadyForGameOver = false;

  IMAGES_HURT = [
    "assets/img/2_character_pepe/4_hurt/H-41.png",
    "assets/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEATH = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
  ];

  /**
   * Creates the character health base layer on the given canvas.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   */
  constructor(canvas) {
    super(canvas);
  }

  /**
   * Preloads hurt and death sprite sequences.
   * @returns {void}
   */
  loadHealthImages() {
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEATH);
  }

  /**
   * Resets animation frame counters to the first sprite.
   * @returns {void}
   */
  resetAnimationFrame() {
    this.imageCounter = 0;
    this.frameTick = 0;
  }

  /**
   * Checks whether health dropped below the next hurt animation milestone.
   * @returns {void}
   */
  checkHurtThreshold() {
    if (this.health <= 0 || this.nextHurtThreshold <= 0) {
      return;
    }
    if (this.health < this.nextHurtThreshold) {
      this.hurtTriggerTime = performance.now();
      this.resetAnimationFrame();
      this.advanceHurtThreshold();
    }
  }

  /**
   * Lowers the next hurt animation threshold based on remaining health.
   * @returns {void}
   */
  advanceHurtThreshold() {
    if (this.health < 20) {
      this.nextHurtThreshold = 0;
    } else if (this.health < 40) {
      this.nextHurtThreshold = 20;
    } else if (this.health < 60) {
      this.nextHurtThreshold = 40;
    } else if (this.health < 80) {
      this.nextHurtThreshold = 60;
    }
  }

  /**
   * Selects upper health band hurt animations or delegates lower bands.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  selectUpperHealthAnimation(controller, scale = 1) {
    if (this.health < 80 && this.health >= 40) {
      this.applyHurtPriorityAnimation(scale);
    } else {
      this.selectLowerHealthAnimation(controller, scale);
    }
  }

  /**
   * Selects lower health band hurt animations or delegates to death sequence.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  selectLowerHealthAnimation(controller, scale = 1) {
    if (this.health < 40 && this.health > 0) {
      this.applyHurtPriorityAnimation(scale);
    } else {
      this.selectFallbackOrDeathAnimation(controller, scale);
    }
  }

  /**
   * Runs standard animation if alive or starts the death sequence at zero health.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  selectFallbackOrDeathAnimation(controller, scale = 1) {
    if (this.health > 0) {
      this.updateStandardAnimation(controller, scale);
    } else {
      this.startDeathAnimation(scale);
    }
  }

  /**
   * Interrupts active actions and plays the hurt sprite sequence.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  applyHurtPriorityAnimation(scale = 1) {
    this.isThrowing = false;
    this.idleTimer = 0;
    this.playAnimation(this.IMAGES_HURT, scale);
  }

  /**
   * Executes the death animation frames and holds the final pose before game over.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  startDeathAnimation(scale = 1) {
    this.initDeathSequence();
    const lastFrame = this.IMAGES_DEATH[this.IMAGES_DEATH.length - 1];
    if (this.deathFinishedTime === 0) {
      this.playDeathFrames(lastFrame, scale);
    } else {
      this.holdLastDeathFrame(lastFrame);
    }
  }

  /**
   * Initializes death sequence flags once when health reaches zero.
   * @returns {void}
   */
  initDeathSequence() {
    if (!this.deathAnimationStarted) {
      this.deathAnimationStarted = true;
      this.deathFinishedTime = 0;
      this.resetAnimationFrame();
    }
    this.isThrowing = false;
    this.idleTimer = 0;
  }

  /**
   * Plays through death sprites until the final frame is reached.
   * @param {string} lastFrame - Path to the last death sprite.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  playDeathFrames(lastFrame, scale = 1) {
    this.playAnimation(this.IMAGES_DEATH, scale);
    if (this.imageCounter >= this.IMAGES_DEATH.length - 1) {
      this.img = this.imageCache[lastFrame];
      this.deathFinishedTime = performance.now();
    }
  }

  /**
   * Keeps the final death sprite visible until the hold timer finishes.
   * @param {string} lastFrame - Path to the last death sprite.
   * @returns {void}
   */
  holdLastDeathFrame(lastFrame) {
    this.img = this.imageCache[lastFrame];
    if (performance.now() - this.deathFinishedTime >= this.deathHoldDuration) {
      this.isReadyForGameOver = true;
    }
  }

  /**
   * Applies standard enemy contact damage to the character and plays hurt SFX.
   * @returns {void}
   */
  hit() {
    this.health -= 5;
    playHurtSound();
    if (this.health <= 0) {
      this.health = 0;
    } else {
      this.lastHit = performance.now();
    }
  }

  /**
   * Returns true while invulnerability frames after a hit are active.
   * @returns {boolean} True if currently invulnerable.
   */
  isHurt() {
    const timePassed = performance.now() - this.lastHit;
    return timePassed < 750 && this.health > 0;
  }

  /**
   * Returns true while a threshold hurt animation locks player controls.
   * @returns {boolean} True if hurt animation is running.
   */
  isHurtAnimationActive() {
    const timePassed = performance.now() - this.hurtTriggerTime;
    return timePassed < 750 && this.health > 0;
  }

  /**
   * Returns true when character health has reached zero.
   * @returns {boolean} True if dead.
   */
  isDead() {
    return this.health <= 0;
  }
}