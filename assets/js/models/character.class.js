class Character extends MovableObject {
  vXChar = 7;
  isJumping = false;
  cameraX = 0;
  constructor(canvas) {
    super(canvas);
    this.loadImage("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.width = this.canvasWidth * 0.14;
    this.height = this.canvasHeight * 0.37;
    this.x = this.canvasWidth * 0.08;
    this.y = this.canvasHeight - this.height - this.floor;
    this.yMax = this.y - this.canvasHeight * 0.5;
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
  update(controller) {
    this.moveRight(controller);
    this.moveleft(controller);
    this.jump(controller);
    this.updateCameraControl();
  }

  moveRight(controller) {
    const maxWorldX = this.canvasWidth * 2 - this.width;
    if (controller.right && this.x < maxWorldX) {
      this.x += this.vXChar;
    }
  }

  moveleft(controller) {
    if (controller.left && this.x > 0) {
      this.x -= this.vXChar;
    }
  }

  jump(controller) {
    if (controller.space && !this.isJumping) {
      this.isJumping = true;
      this.vg = -20;
    }
    if (this.isJumping) {
      this.setJumpingSequenz();
    }
  }

  setJumpingSequenz() {
    this.setGravitation();
    const groundLine = this.canvasHeight - this.height - this.floor;
    if (this.y >= groundLine) {
      this.isJumping = false;
    }
  }
}
