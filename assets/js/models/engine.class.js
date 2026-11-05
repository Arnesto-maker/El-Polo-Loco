class GameEngine {
  constructor(canvasElement, inputController, gameFrames) {
    this.ctx = canvasElement.getContext("2d");
    this.controller = inputController;
    this.frameObjects = gameFrames;
    this.statusBar = new StatusBar(canvasElement);
    this.renderLoop();
  }
  renderLoop() {
    console.log("engine started");
    const char = this.frameObjects.find(
      (object) => object.cameraX !== undefined,
    );
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.updateLogic();

    this.ctx.translate(char.cameraX, 0);
    this.drawFrame();
    this.checkAllCollisions();
    this.ctx.translate(-char.cameraX, 0);
    this.statusBar.draw(this.ctx);
    requestAnimationFrame(() => this.renderLoop());
  }
  updateLogic() {
    this.frameObjects.forEach((object) => {
      if (object.update) {
        object.update(this.controller);
      }
    });
  }

  checkAllCollisions() {
    const char = this.frameObjects.find((obj) => obj.cameraX !== undefined);
    this.checkChickenCollision(char);
    //this.checkCoinCollision(char);
    //this.checkBottleCollision(char);
  }

  drawFrame() {
    this.frameObjects.forEach((object) => {
      if (object.draw) {
        object.draw(this.ctx);
      }
    });
  }

  startCharStompingSequenz(char, obj) {
    char.vg = -12;
    this.statusBar.score += 500;
    char.startJumpingAnimation();
    obj.die();
  }
  startCharHitSequenz(char) {
    char.hit();
    this.statusBar.health = char.health;
    this.statusBar.updateHealthImage();
  }

  updateChickenCollision(char, obj, index) {
    if (char.isStomping(obj)) {
      this.startCharStompingSequenz(char,obj);
      setTimeout(() => {
        this.frameObjects.splice(index, 1);
      }, 200);
    } else if (char.isColliding(obj)) {
      this.startCharHitSequenz(char);
    }
  }

  checkChickenCollision(char) {
    this.frameObjects.forEach((obj, index) => {
      if (obj instanceof Chicken) {
        this.updateChickenCollision(char, obj, index);
      }
    });
  }
}
