/**
 * Playable hero Pepe handling dt-scaled movement, edge-triggered jumping, throwing, dynamic camera follow, and idle sprites.
 */
class Character extends CharacterHealth {
  vXChar = 7;
  isJumping = false;
  isMoving = false;
  isThrowing = false;
  readyToSpawnBottle = false;
  spaceWasHeld = false;
  idleTimer = 0;
  idleStage = 0;
  cameraX = 0;
  viewWidth = 2048;
  lastThrowTime = 0;
  throwCooldown = 500;
  throwDuration = 400;

  /**
   * Initializes Pepe's sprites, dimensions, and spawn position.
   * @param {Object} canvas - Reference canvas dimensions.
   */
  constructor(canvas) {
    super(canvas);
    this.loadAllImages();
    this.setMainParameter();
  }

  /**
   * Builds and preloads a sequential sprite path array for Pepe.
   * @param {string} dir - Subfolder inside assets/img/2_character_pepe.
   * @param {string} prefix - Filename prefix before the frame number.
   * @param {number} start - First frame index.
   * @param {number} end - Last frame index.
   * @returns {Array<string>} Preloaded sprite path list.
   */
  loadSpriteRange = (dir, prefix, start, end) => {
    const paths = [];
    const base = `assets/img/2_character_pepe/${dir}/${prefix}`;
    for (let i = start; i <= end; i++) {
      paths.push(`${base}${i}.png`);
    }
    this.loadImages(paths);
    return paths;
  };

  /**
   * Initializes and preloads all movement, action, and health animation sequences.
   * @returns {void}
   */
  loadAllImages = () => {
    const w21 = "assets/img/2_character_pepe/2_walk/W-21.png";
    this.IMAGE_0 = "assets/img/2_character_pepe/1_idle/idle/I-1.png";
    this.IMAGES_IDLE = this.loadSpriteRange("1_idle/idle", "I-", 1, 10);
    this.IMAGES_LONG_IDLE = this.loadSpriteRange("1_idle/long_idle", "I-", 11, 20);
    this.IMAGES_JUMP = this.loadSpriteRange("3_jump", "J-", 31, 39);
    this.IMAGES_MOVING = this.loadSpriteRange("2_walk", "W-", 22, 26);
    this.IMAGES_MOVING.push(w21);
    this.loadImages([this.IMAGE_0, w21]);
    this.IMAGES_THROWING = this.loadSpriteRange("6_throw", "T-", 1, 4);
    this.loadHealthImages();
  };

  /**
   * Computes proportional hitbox padding offsets for Pepe's sprite.
   * @returns {{top: number, bottom: number, left: number, right: number}} Hitbox offsets.
   */
  createHitboxOffset = () => {
    return {
      top: this.height * 0.38,
      bottom: this.height * 0.06,
      left: this.width * 0.22,
      right: this.width * 0.22,
    };
  };

  /**
   * Sets initial size, spawn coordinates, jump limit, and hitbox offsets.
   * @returns {void}
   */
  setMainParameter = () => {
    this.img = this.imageCache[this.IMAGE_0];
    this.viewWidth = this.canvasWidth;
    this.width = this.canvasWidth * 0.14;
    this.height = this.canvasHeight * 0.36;
    this.x = this.canvasWidth * 0.05;
    this.y = this.canvasHeight - this.height - this.floor;
    this.yMax = this.y - this.canvasHeight * 0.5;
    this.offset = this.createHitboxOffset();
  };

  /**
   * Updates horizontal camera offset clamped to world edges for any dynamic viewport width.
   * @param {number} [viewWidth=this.viewWidth] - Live logical canvas width.
   * @returns {void}
   */
  updateCameraControl = (viewWidth = this.viewWidth) => {
    this.viewWidth = viewWidth;
    const worldWidth = this.canvasWidth * 2;
    if (viewWidth >= worldWidth) {
      this.cameraX = (viewWidth - worldWidth) / 2;
      return;
    }
    const minCamX = -(worldWidth - viewWidth);
    const targetCamX = -(this.x - viewWidth / 2);
    this.cameraX = Math.max(minCamX, Math.min(0, targetCamX));
  };

  /**
   * Draws Pepe with a slight vertical adjustment during bottle throws.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
   * @returns {void}
   */
  draw = (ctx) => {
    const savedY = this.y;
    if (this.isThrowing) {
      this.y += this.height * 0.04;
    }
    super.draw(ctx);
    this.y = savedY;
  };

  /**
   * Runs per-frame dt-scaled movement, gravity, camera, and animation updates.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  update = (controller, scale = 1) => {
    const isLocked = this.isDead() || this.isHurtAnimationActive();
    this.isMoving = Boolean(controller.right) !== Boolean(controller.left);
    if (!isLocked && !this.isThrowing && this.isMoving) {
      this.moveHorizontal(controller, scale);
    }
    this.jump(controller, isLocked, scale);
    this.updateCameraControl(this.viewWidth);
    this.updateAnimation(controller, scale);
  };

  /**
   * Routes animation selection between health, active actions, and idle sequences.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  updateAnimation = (controller, scale = 1) => {
    if (this.isDead() || this.isHurtAnimationActive()) {
      this.selectUpperHealthAnimation(controller, scale);
    } else if (this.isThrowing || this.isJumping || this.isMoving) {
      this.idleTimer = 0;
      this.idleStage = 0;
      this.playActiveAnimation(scale);
    } else {
      this.idleTimer += scale;
      this.startIdleSequence(scale);
    }
  };

  /**
   * Plays throwing, jumping, or walking animation with immediate state sync.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  playActiveAnimation = (scale = 1) => {
    if (this.isThrowing) {
      this.handleThrowAnimation(scale);
    } else if (this.isJumping) {
      this.playAnimation(this.IMAGES_JUMP, scale, 7);
    } else if (this.isMoving) {
      this.playAnimation(this.IMAGES_MOVING, scale, 5);
    }
  };

  /**
   * Restores Pepe's standing default idle frame and resets animation counters.
   * @returns {void}
   */
  resetToStaticIdle = () => {
    this.idleStage = 0;
    this.currentAnimation = null;
    this.img = this.imageCache[this.IMAGE_0];
    this.resetAnimationFrame();
  };

  /**
   * Advances between static pose, short idle, and sleeping idle based on dt timer.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  startIdleSequence = (scale = 1) => {
    if (this.idleTimer < 120) {
      this.resetToStaticIdle();
    } else if (this.idleTimer < 360) {
      this.idleStage = 1;
      this.playAnimation(this.IMAGES_IDLE, scale);
    } else {
      this.idleStage = 2;
      this.playAnimation(this.IMAGES_LONG_IDLE, scale);
    }
  };

  /**
   * Moves Pepe left or right within world boundaries scaled to 60-FPS delta time.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  moveHorizontal = (controller, scale = 1) => {
    const maxWorldX = this.canvasWidth * 2 - this.width;
    if (controller.right && this.x < maxWorldX) {
      this.x += this.vXChar * scale;
      this.otherDirection = false;
    } else if (controller.left && this.x > 0) {
      this.x -= this.vXChar * scale;
      this.otherDirection = true;
    }
  };

  /**
   * Initiates a single edge-triggered jump on fresh Space press and applies airborne gravity.
   * @param {Controller} controller - Active input controller.
   * @param {boolean} isLocked - Whether controls are temporarily locked.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  jump = (controller, isLocked, scale = 1) => {
    const isFreshSpace = controller.space && !this.spaceWasHeld;
    if (!isLocked && isFreshSpace && !this.isJumping) {
      this.initGeneralJumpAction(-25);
      playJumpSound();
    }
    this.spaceWasHeld = Boolean(controller.space);
    if (this.isJumping || (isLocked && this.isAboveGround())) {
      this.setJumpingSequence(scale);
    }
  };

  /**
   * Triggers an upward jump impulse (default -20 for enemy stomp bounce).
   * @param {number} [velocity=-20] - Initial vertical launch velocity.
   * @returns {void}
   */
  initGeneralJumpAction = (velocity = -20) => {
    this.isJumping = true;
    this.vg = velocity;
    this.currentAnimation = null;
    this.imageCounter = 0;
  };

  /**
   * Applies dt-scaled gravity during a jump and lands Pepe on the ground line.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  setJumpingSequence = (scale = 1) => {
    this.setGravitation(scale);
    const groundLine = this.getGroundLine();
    if (this.y >= groundLine) {
      this.isJumping = false;
      this.y = groundLine;
    }
  };

  /**
   * Determines whether Pepe is falling onto an enemy from above.
   * @param {MovableObject} enemy - Target enemy object.
   * @returns {boolean} True when a valid stomp collision occurs.
   */
  isStomping = (enemy) => {
    if (!this.isColliding(enemy) || enemy.isDead) {
      return false;
    }
    const isFallingDown = this.isAboveGround() && this.vg > 0;
    const charBottom = this.y + this.height - this.offset.bottom;
    const enemyCenterY = enemy.y + enemy.height * 0.8;
    return isFallingDown && charBottom <= enemyCenterY;
  };

  /**
   * Begins the bottle-throwing animation if cooldown allows.
   * @returns {void}
   */
  startThrowSequence = () => {
    if (this.isHurtAnimationActive() || this.isDead()) {
      return;
    }
    const now = performance.now();
    if (this.isThrowing || now - this.lastThrowTime < this.throwCooldown) {
      return;
    }
    this.isThrowing = true;
    this.lastThrowTime = now;
    this.currentAnimation = null;
    this.resetAnimationFrame();
  };

  /**
   * Plays throwing sprites and flags bottle spawn once duration completes.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  handleThrowAnimation = (scale = 1) => {
    const elapsed = performance.now() - this.lastThrowTime;
    this.playAnimation(this.IMAGES_THROWING, scale, 6);
    if (elapsed >= this.throwDuration) {
      this.isThrowing = false;
      this.readyToSpawnBottle = true;
    }
  };
}