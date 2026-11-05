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
    this.checkAllCollisions();
    this.ctx.translate(char.cameraX, 0);
    this.drawFrame();
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
    this.checkCoinCollisions(char);
    this.checkBottleCollisions(char);
  }

  drawFrame() {
    this.frameObjects.forEach((object) => {
      if (object.draw) {
        object.draw(this.ctx);
      }
    });
  }

  startCharStompingSequence(char, obj) {
    char.initGeneralJumpAction(char.y)
    this.statusBar.score += 500;
    char.startJumpingAnimation();
    obj.die();
  }
  startCharHitSequence(char) {
    char.hit();
    this.statusBar.health = char.health;
    this.statusBar.updateHealthImage();
    this.removeDeadChicken();
  }

  removeDeadChicken() {
    this.frameObjects = this.frameObjects.filter((obj) => {
      if (obj instanceof Chicken && obj.isDead) {
        const timeDead = performance.now() - obj.deadTime;
        return timeDead < 500;
      }
      return true;
    });
  }

  updateChickenCollision(char, obj) {
    if (char.isStomping(obj)) {
      this.startCharStompingSequence(char, obj);
    } else if (char.isColliding(obj)) {
      if (!char.isHurt()) {
        this.startCharHitSequence(char);
      }
    }
  }

  checkChickenCollision(char) {
    this.frameObjects.forEach((obj) => {
      if (obj instanceof Chicken) {
        this.updateChickenCollision(char, obj);
      }
    });
  }

  setCollectingCoinSequence(char, index) {
    const obj = this.frameObjects[index];
    if (obj instanceof Coin && char.isColliding(obj)) {
      this.frameObjects.splice(index, 1);
      this.statusBar.coinCount += 1;
      this.statusBar.score += 100;
    }
  }

  checkCoinCollisions(char) {
    for (let i = this.frameObjects.length - 1; i >= 0; i--) {
      this.setCollectingCoinSequence(char, i);
    }
  }

  setCollectingBottleSequence(char, index) {
    const obj = this.frameObjects[index];
    if (obj instanceof Bottle && char.isColliding(obj)) {
      this.frameObjects.splice(index, 1);
      this.statusBar.bottleCount += 1;
    }
  }
  checkBottleCollisions(char) {
    for (let i = this.frameObjects.length - 1; i >= 0; i--) {
      this.setCollectingBottleSequence(char,i)
    }
  }
}
