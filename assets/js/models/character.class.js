/**
 * Playable hero Pepe handling movement, jumping, throwing, camera follow, and idle sprites.
 */
class Character extends CharacterHealth {
  vXChar = 7;
  isJumping = false;
  isMoving = false;
  isThrowing = false;
  readyToSpawnBottle = false;
  idleTimer = 0;
  cameraX = 0;
  lastThrowTime = 0;
  throwCooldown = 500;
  throwDuration = 400;

  IMAGE_0 = "assets/img/2_character_pepe/1_idle/idle/I-1.png";
  IMAGES_LONG_IDLE = [
    "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];
  IMAGES_IDLE = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_JUMP = [
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_MOVING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_THROWING = [
    "assets/img/2_character_pepe/6_throw/T-1.png",
    "assets/img/2_character_pepe/6_throw/T-2.png",
    "assets/img/2_character_pepe/6_throw/T-3.png",
    "assets/img/2_character_pepe/6_throw/T-4.png",
  ];

  /**
   * Initializes Pepe's sprites, dimensions, and spawn position.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   */
  constructor(canvas) {
    super(canvas);
    this.loadAllImages();
    this.setMainParameter();
  }

  /**
   * Sets initial size, spawn coordinates, jump limit, and hitbox offsets.
   * @returns {void}
   */
  setMainParameter() {
    this.img = this.imageCache[this.IMAGE_0];
    this.width = this.canvasWidth * 0.14;
    this.height = this.canvasHeight * 0.36;
    this.x = this.canvasWidth * 0.05;
    this.y = this.canvasHeight - this.height - this.floor;
    this.yMax = this.y - this.canvasHeight * 0.5;
    this.offset = this.setOffsetParameter();
  }

  /**
   * Builds the collision offset box for Pepe.
   * @returns {{top: number, bottom: number, left: number, right: number}} Hitbox offsets.
   */
  setOffsetParameter() {
    return {
      top: this.height * 0.38,
      bottom: this.height * 0.06,
      left: this.width * 0.22,
      right: this.width * 0.22,
    };
  }

  /**
   * Preloads all movement, action, and health animation sequences.
   * @returns {void}
   */
  loadAllImages() {
    this.loadImages([this.IMAGE_0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_JUMP);
    this.loadImages(this.IMAGES_MOVING);
    this.loadImages(this.IMAGES_THROWING);
    this.loadHealthImages();
  }

  /**
   * Updates horizontal camera offset clamped between frame 1 and frame 2 boundaries.
   * @returns {void}
   */
  updateCameraControl() {
    const startFollowX = this.canvasWidth / 2;
    const stopFollowX = this.canvasWidth / 2 + this.canvasWidth;
    if (this.x <= startFollowX) {
      this.cameraX = 0;
    } else if (this.x > startFollowX && this.x < stopFollowX) {
      this.cameraX = -(this.x - startFollowX);
    } else {
      this.cameraX = -this.canvasWidth;
    }
  }

  /**
   * Draws Pepe with a slight vertical adjustment during bottle throws.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  draw(ctx) {
    const savedY = this.y;
    if (this.isThrowing) {
      this.y += this.height * 0.04;
    }
    super.draw(ctx);
    this.y = savedY;
  }

  /**
   * Runs per-frame movement, gravity, camera, and animation updates.
   * @param {Controller} controller - Active input controller.
   * @returns {void}
   */
  update(controller) {
    this.checkHurtThreshold();
    const isLocked = this.isDead() || this.isHurtAnimationActive();
    if (!isLocked && !this.isThrowing) {
      this.moveRight(controller);
      this.moveLeft(controller);
    }
    this.updateJumpOrGravity(controller, isLocked);
    this.updateCameraControl();
    this.updateAnimation(controller);
  }

  /**
   * Processes jump input or applies gravity when movement is locked.
   * @param {Controller} controller - Active input controller.
   * @param {boolean} isLocked - Whether controls are temporarily locked.
   * @returns {void}
   */
  updateJumpOrGravity(controller, isLocked) {
    if (!isLocked) {
      this.jump(controller);
    } else if (this.isJumping || this.isAboveGround()) {
      this.setJumpingSequence();
    }
  }

  /**
   * Routes animation selection between hurt/death and standard actions.
   * @param {Controller} controller - Active input controller.
   * @returns {void}
   */
  updateAnimation(controller) {
    if (this.isDead() || this.isHurtAnimationActive()) {
      this.selectUpperHealthAnimation(controller);
      return;
    }
    this.updateStandardAnimation(controller);
  }

  /**
   * Selects throwing, jumping, walking, or idle animation.
   * @param {Controller} controller - Active input controller.
   * @returns {void}
   */
  updateStandardAnimation(controller) {
    const isMoving = controller.right || controller.left;
    if (this.isThrowing) {
      this.idleTimer = 0;
      this.handleThrowAnimation();
    } else if (this.isJumping) {
      this.idleTimer = 0;
      this.playAnimation(this.IMAGES_JUMP);
    } else if (isMoving) {
      this.idleTimer = 0;
      this.playAnimation(this.IMAGES_MOVING);
    } else {
      this.idleTimer++;
      this.startIdleSequence();
    }
  }

  /**
   * Advances between static pose, short idle, and sleeping idle based on timer.
   * @returns {void}
   */
  startIdleSequence() {
    if (this.idleTimer < 120) {
      this.img = this.imageCache[this.IMAGE_0];
      this.resetAnimationFrame();
    } else if (this.idleTimer < 360) {
      this.startIdleAnimation();
    } else {
      this.startLongIdleAnimation();
    }
  }

  /**
   * Plays the standard standing idle sprite cycle.
   * @returns {void}
   */
  startIdleAnimation() {
    if (this.idleTimer === 120) {
      this.resetAnimationFrame();
    }
    this.playAnimation(this.IMAGES_IDLE);
  }

  /**
   * Plays the sleeping long-idle sprite cycle.
   * @returns {void}
   */
  startLongIdleAnimation() {
    if (this.idleTimer === 360) {
      this.resetAnimationFrame();
    }
    this.playAnimation(this.IMAGES_LONG_IDLE);
  }

  /**
   * Resets frames and starts playing the jump animation.
   * @returns {void}
   */
  startJumpingAnimation() {
    this.resetAnimationFrame();
    this.playAnimation(this.IMAGES_JUMP);
  }

  /**
   * Moves Pepe right within the world boundary.
   * @param {Controller} controller - Active input controller.
   * @returns {void}
   */
  moveRight(controller) {
    const maxWorldX = this.canvasWidth * 2 - this.width;
    if (controller.right && this.x < maxWorldX) {
      this.x += this.vXChar;
      this.otherDirection = false;
    }
  }

  /**
   * Moves Pepe left within the world boundary.
   * @param {Controller} controller - Active input controller.
   * @returns {void}
   */
  moveLeft(controller) {
    if (controller.left && this.x > 0) {
      this.x -= this.vXChar;
      this.otherDirection = true;
    }
  }

  /**
   * Initiates a jump when Space is pressed and updates airborne motion.
   * @param {Controller} controller - Active input controller.
   * @returns {void}
   */
  jump(controller) {
    if (controller.space && !this.isJumping) {
      this.isJumping = true;
      this.vg = -25;
      this.imageCounter = 0;
    }
    if (this.isJumping) {
      this.setJumpingSequence();
    }
  }

  /**
   * Triggers a bounce jump after stomping an enemy.
   * @returns {void}
   */
  initGeneralJumpAction() {
    this.isJumping = true;
    this.vg = -20;
    this.imageCounter = 0;
    if (this.isJumping) {
      this.setJumpingSequence();
    }
  }

  /**
   * Applies gravity during a jump and lands Pepe on the ground line.
   * @returns {void}
   */
  setJumpingSequence() {
    this.setGravitation();
    const groundLine = this.getGroundLine();
    if (this.y >= groundLine) {
      this.isJumping = false;
      this.y = groundLine;
    }
  }

  /**
   * Determines whether Pepe is falling onto an enemy from above.
   * @param {MovableObject} enemy - Target enemy object.
   * @returns {boolean} True when a valid stomp collision occurs.
   */
  isStomping(enemy) {
    if (!this.isColliding(enemy) || enemy.isDead) {
      return false;
    }
    const isFallingDown = this.isAboveGround() && this.vg > 0;
    const charBottom = this.y + this.height - this.offset.bottom;
    const enemyCenterY = enemy.y + enemy.height * 0.8;
    return isFallingDown && charBottom <= enemyCenterY;
  }

  /**
   * Begins the bottle-throwing animation if cooldown allows.
   * @returns {void}
   */
  startThrowSequence() {
    if (this.isHurtAnimationActive() || this.isDead()) {
      return;
    }
    const currentTime = performance.now();
    if (this.isThrowing || currentTime - this.lastThrowTime < this.throwCooldown) {
      return;
    }
    this.isThrowing = true;
    this.lastThrowTime = currentTime;
    this.resetAnimationFrame();
  }

  /**
   * Plays throwing sprites and flags bottle spawn once duration completes.
   * @returns {void}
   */
  handleThrowAnimation() {
    const timeThrowing = performance.now() - this.lastThrowTime;
    this.playAnimation(this.IMAGES_THROWING);
    if (timeThrowing >= this.throwDuration) {
      this.resetThrowParameter();
    }
  }

  /**
   * Ends throwing state and requests projectile instantiation.
   * @returns {void}
   */
  resetThrowParameter() {
    this.isThrowing = false;
    this.readyToSpawnBottle = true;
  }
}