/**
 * Base health, collision hurt feedback, and death animation controller for the player character.
 */
class CharacterHealth extends MovableObject {
  health = 100;
  lastHit = 0;
  hurtTriggerTime = 0;
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
   * @param {HTMLCanvasElement|Object} canvas - The game canvas or design dimension object.
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
   * Starts the hurt sprite sequence immediately on every horizontal collision hit.
   * @returns {void}
   */
  triggerHurtAnimation() {
    if (this.health <= 0) {
      return;
    }
    this.hurtTriggerTime = performance.now();
    this.currentAnimation = null;
    this.resetAnimationFrame();
  }

  /**
   * Routes health-priority animations between death and active hurt states.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  selectUpperHealthAnimation(controller, scale = 1) {
    if (this.isDead()) {
      this.startDeathAnimation(scale);
    } else if (this.isHurtAnimationActive()) {
      this.applyHurtPriorityAnimation(scale);
    }
  }

  /**
   * Hook overridden by subclasses to cancel active action states on hurt or death.
   * @returns {void}
   */
  interruptActiveActions() {}

  /**
   * Interrupts active actions and plays the hurt sprite sequence.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  applyHurtPriorityAnimation(scale = 1) {
    this.interruptActiveActions();
    this.playAnimation(this.IMAGES_HURT, scale, 6);
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
      this.currentAnimation = null;
      this.resetAnimationFrame();
    }
    this.interruptActiveActions();
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
   * Applies standard enemy contact damage to the character and triggers hurt feedback.
   * @returns {void}
   */
  hit() {
    this.health = Math.max(0, this.health - 5);
    playHurtSound();
    if (this.health > 0) {
      this.lastHit = performance.now();
      this.triggerHurtAnimation();
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
   * Returns true while the hurt sprite feedback animation is running.
   * @returns {boolean} True if hurt animation is active.
   */
  isHurtAnimationActive() {
    const timePassed = performance.now() - this.hurtTriggerTime;
    return timePassed < 600 && this.health > 0;
  }

  /**
   * Returns true when character health has reached zero.
   * @returns {boolean} True if dead.
   */
  isDead() {
    return this.health <= 0;
  }
}
