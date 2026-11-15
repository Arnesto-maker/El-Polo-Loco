class Character extends MovableObject {
  vXChar = 7;
  isJumping = false;
  isMoving = false;
  isThrowing = false;
  readyToSpawnBottle = false;
  idleTimer = 0;
  cameraX = 0;
  health = 100;
  lastHit = 0;
  hurtTriggerTime = 0;
  nextHurtThreshold = 80;
  lastThrowTime = 0;
  throwCooldown = 500;
  throwDuration = 400;
  deathAnimationStarted = false;
  deathFinishedTime = 0;
  deathHoldDuration = 1200;
  isReadyForGameOver = false;

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
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
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

  constructor(canvas) {
    super(canvas);
    this.loadAllImages();
    this.setMainParameter();
  }

  setMainParameter() {
    this.img = this.imageCache[this.IMAGE_0];
    this.width = this.canvasWidth * 0.14;
    this.height = this.canvasHeight * 0.36;
    this.x = this.canvasWidth * 0.05;
    this.y = this.canvasHeight - this.height - this.floor;
    this.yMax = this.y - this.canvasHeight * 0.5;
    this.offset = this.setOffsetParameter();
  }

  setOffsetParameter() {
    return {
      top: this.height * 0.38,
      bottom: this.height * 0.06,
      left: this.width * 0.22,
      right: this.width * 0.22,
    };
  }

  loadAllImages() {
    this.loadImages([this.IMAGE_0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_JUMP);
    this.loadImages(this.IMAGES_MOVING);
    this.loadImages(this.IMAGES_THROWING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEATH);
  }

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

  draw(ctx) {
    const savedY = this.y;
    if (this.isThrowing) {
      this.y += this.height * 0.04;
    }
    super.draw(ctx);
    this.y = savedY;
  }

  update(controller) {
    this.checkHurtThreshold();
    const isLocked = this.isDead() || this.isHurtAnimationActive();
    if (!isLocked && !this.isThrowing) {
      this.moveRight(controller);
      this.moveleft(controller);
    }
    this.updateJumpOrGravity(controller, isLocked);
    this.updateCameraControl();
    this.updateAnimation(controller);
  }

  updateJumpOrGravity(controller, isLocked) {
    if (!isLocked) {
      this.jump(controller);
    } else if (this.isJumping || this.isAboveGround()) {
      this.setJumpingSequenz();
    }
  }

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

  updateAnimation(controller) {
    if (this.isDead() || this.isHurtAnimationActive()) {
      this.evaluateNodeS(controller);
      return;
    }
    this.updateStandardAnimation(controller);
  }

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
      this.startIdleSequenz();
    }
  }

  evaluateNodeS(controller) {
    if (this.health < 80 && this.health >= 60) {
      this.startHurtAnimation();
      this.executeNodeX(controller);
    } else if (this.health < 60 && this.health >= 40) {
      this.startHurtAnimation();
      this.executeNodeX(controller);
    } else {
      this.evaluateNode2a(controller);
    }
  }

  evaluateNode2a(controller) {
    if (this.health < 40 && this.health >= 20) {
      this.startHurtAnimation();
      this.executeNodeX(controller);
    } else if (this.health < 20 && this.health > 0) {
      this.startHurtAnimation();
      this.executeNodeX(controller);
    } else {
      this.evaluateNode2b(controller);
    }
  }

  evaluateNode2b(controller) {
    if (this.health > 0) {
      this.updateStandardAnimation(controller);
    } else {
      this.startDeathAnimation();
    }
  }

  executeNodeX(controller) {
    const otherAnimRunning = this.isOtherAnimationRunning(controller);
    if (otherAnimRunning) {
      this.startHurtAnimationAsPriority();
    } else {
      this.startHurtAnimationAsPriority();
    }
  }

  isOtherAnimationRunning(controller) {
    const isMoving = controller.right || controller.left;
    return this.isThrowing || this.isJumping || isMoving || this.idleTimer > 0;
  }

  startHurtAnimation() {
    this.idleTimer = 0;
  }

  startHurtAnimationAsPriority() {
    this.isThrowing = false;
    this.idleTimer = 0;
    this.playAnimation(this.IMAGES_HURT);
  }

  startDeathAnimation() {
    this.initDeathSequence();
    const lastFrame = this.IMAGES_DEATH[this.IMAGES_DEATH.length - 1];
    if (this.deathFinishedTime === 0) {
      this.playDeathFrames(lastFrame);
    } else {
      this.holdLastDeathFrame(lastFrame);
    }
  }

  initDeathSequence() {
    if (!this.deathAnimationStarted) {
      this.deathAnimationStarted = true;
      this.deathFinishedTime = 0;
      this.resetAnimationFrame();
    }
    this.isThrowing = false;
    this.idleTimer = 0;
  }

  playDeathFrames(lastFrame) {
    this.playAnimation(this.IMAGES_DEATH);
    if (this.imageCounter >= this.IMAGES_DEATH.length - 1) {
      this.img = this.imageCache[lastFrame];
      this.deathFinishedTime = performance.now();
    }
  }

  holdLastDeathFrame(lastFrame) {
    this.img = this.imageCache[lastFrame];
    if (performance.now() - this.deathFinishedTime >= this.deathHoldDuration) {
      this.isReadyForGameOver = true;
    }
  }

  startIdleSequenz() {
    if (this.idleTimer < 120) {
      this.img = this.imageCache[this.IMAGE_0];
      this.resetAnimationFrame();
    } else if (this.idleTimer < 360) {
      this.startIdleAnimation();
    } else {
      this.startLongidleAnimation();
    }
  }

  startIdleAnimation() {
    if (this.idleTimer === 120) {
      this.resetAnimationFrame();
    }
    this.playAnimation(this.IMAGES_IDLE);
  }

  startLongidleAnimation() {
    if (this.idleTimer === 360) {
      this.resetAnimationFrame();
    }
    this.playAnimation(this.IMAGES_LONG_IDLE);
  }

  startJumpingAnimation() {
    this.resetAnimationFrame();
    this.playAnimation(this.IMAGES_JUMP);
  }

  resetAnimationFrame() {
    this.imageCounter = 0;
    this.frameTick = 0;
  }

  moveRight(controller) {
    const maxWorldX = this.canvasWidth * 2 - this.width;
    if (controller.right && this.x < maxWorldX) {
      this.x += this.vXChar;
      this.otherDirection = false;
    }
  }

  moveleft(controller) {
    if (controller.left && this.x > 0) {
      this.x -= this.vXChar;
      this.otherDirection = true;
    }
  }

  jump(controller) {
    if (controller.space && !this.isJumping) {
      this.isJumping = true;
      this.vg = -25;
      this.imageCounter = 0;
    }
    if (this.isJumping) {
      this.setJumpingSequenz();
    }
  }

  initGeneralJumpAction() {
    this.isJumping = true;
    this.vg = -20;
    this.imageCounter = 0;
    if (this.isJumping) {
      this.setJumpingSequenz();
    }
  }

  setJumpingSequenz() {
    this.setGravitation();
    const groundLine = this.getGroundLine();
    if (this.y >= groundLine) {
      this.isJumping = false;
      this.y = groundLine;
    }
  }

  isStomping(enemy) {
    if (!this.isColliding(enemy) || enemy.isDead) {
      return false;
    }
    const isFallingDown = this.isAboveGround() && this.vg > 0;
    const charBottom = this.y + this.height - this.offset.bottom;
    const enemyCenterY = enemy.y + enemy.height * 0.8;
    if (isFallingDown && charBottom <= enemyCenterY && !enemy.isDead) {
      return true;
    } else {
      return false;
    }
  }

  hit() {
    this.health -= 5;
    if (this.health <= 0) {
      this.health = 0;
    } else {
      this.lastHit = performance.now();
    }
  }

  isHurt() {
    const timePassed = performance.now() - this.lastHit;
    return timePassed < 750 && this.health > 0;
  }

  isHurtAnimationActive() {
    const timePassed = performance.now() - this.hurtTriggerTime;
    return timePassed < 750 && this.health > 0;
  }

  isDead() {
    return this.health <= 0;
  }

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

  handleThrowAnimation() {
    const timeThrowing = performance.now() - this.lastThrowTime;
    this.playAnimation(this.IMAGES_THROWING);
    if (timeThrowing >= this.throwDuration) {
      this.resetThrowParameter();
    }
  }

  resetThrowParameter() {
    this.isThrowing = false;
    this.readyToSpawnBottle = true;
  }
}