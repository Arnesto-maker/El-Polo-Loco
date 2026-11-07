class GameEngine {
  constructor(canvasElement, inputController, gameFrames, world) {
    this.world = world;
    this.ctx = canvasElement.getContext("2d");
    this.controller = inputController;
    this.frameObjects = gameFrames;
    this.statusBar = new StatusBar(canvasElement);
    this.renderLoop();
  }

  renderLoop() {
    const char = this.world.character;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.updateLogic(char);
    this.checkAllCollisions(char);
    this.drawWorldWithCamera(char);
    this.statusBar.draw(this.ctx);
    requestAnimationFrame(() => this.renderLoop());
  }

  drawWorldWithCamera(char) {
    this.ctx.translate(char.cameraX, 0);
    this.drawFrame();
    this.ctx.translate(-char.cameraX, 0);
  }

  updateLogic(char) {
    this.updateThrowWorkflow(char);
    for (let i = 0; i < this.frameObjects.length; i++) {
      if (this.frameObjects[i].update) {
        this.frameObjects[i].update(this.controller);
      }
    }
    this.removeDeadChicken();
    this.removeSplashedBottles();
  }

  updateThrowWorkflow(char) {
    if (this.controller.enter && this.statusBar.bottleCount > 0 
    ) {
      char.startThrowSequence();
    }
    if (char.readyToSpawnBottle) {
      this.initBottleThrow(char);
    }
    
    
  }

  initBottleThrow(char) {
    char.readyToSpawnBottle = false;
    this.statusBar.bottleCount -= 1;
    const startX = this.getBottleStartX(char);
    const startY = char.y + char.height * 0.25;
    const yMax = char.canvasHeight - char.canvasHeight * 0.1 - char.floor;
    this.spawnThrownBottle(startX, startY, char.otherDirection, yMax);
  }

  getBottleStartX(char) {
    if (char.otherDirection) {
      return char.x;
    } else {
      return char.x + char.width * 0.7;
    }
  }

  spawnThrownBottle(startX, startY, otherDirection, yMax) {
    const bottle = new ThrowableBottle(
      this.ctx.canvas,
      startX,
      startY,
      otherDirection,
      yMax,
    );
    this.world.throwableBottles.push(bottle);
    this.frameObjects = this.world.getFramePackages();
  }

  checkAllCollisions(char) {
    this.checkChickenCollision(char);
    this.checkCoinCollisions(char);
    this.checkBottleCollisions(char);
    this.checkThrownBottleCollisions();
  }

  checkThrownBottleCollisions() {
    const bottles = this.world.throwableBottles;
    for (let i = 0; i < bottles.length; i++) {
      if (!bottles[i].isSplashing) {
        this.checkBottleHitsEnemy(bottles[i]);
      }
    }
  }

  checkBottleHitsEnemy(bottle) {
    const enemies = this.world.enemies;
    for (let i = 0; i < enemies.length; i++) {
      if (!enemies[i].isDead && bottle.isColliding(enemies[i])) {
        bottle.startSplashSequenz();
        enemies[i].die();
        this.statusBar.score += 500;
      }
    }
  }

  removeSplashedBottles() {
    const prevLength = this.world.throwableBottles.length;
    this.world.throwableBottles = this.world.throwableBottles.filter(
      (bottle) => {
        return this.isBottleStillActive(bottle);
      },
    );
    if (this.world.throwableBottles.length !== prevLength) {
      this.frameObjects = this.world.getFramePackages();
    }
  }

  isBottleStillActive(bottle) {
    if (bottle.isSplashing) {
      const timeSplashing = performance.now() - bottle.splashTime;
      return timeSplashing < 400;
    }
    return true;
  }

  removeDeadChicken() {
    const prevLength = this.world.enemies.length;
    this.world.enemies = this.world.enemies.filter((obj) => {
      return this.isChickenStillActive(obj);
    });
    if (this.world.enemies.length !== prevLength) {
      this.frameObjects = this.world.getFramePackages();
    }
  }

  isChickenStillActive(obj) {
    if (obj.isDead) {
      const timeDead = performance.now() - obj.deadTime;
      return timeDead < 500;
    }
    return true;
  }

  drawFrame() {
    for (let i = 0; i < this.frameObjects.length; i++) {
      if (this.frameObjects[i].draw) {
        this.frameObjects[i].draw(this.ctx);
      }
    }
  }

  startCharStompingSequence(char, obj) {
    char.initGeneralJumpAction(char.y);
    this.statusBar.score += 500;
    char.startJumpingAnimation();
    obj.die();
  }

  startCharHitSequence(char) {
    char.hit();
    this.statusBar.health = char.health;
    this.statusBar.updateHealthImage();
  }

  updateChickenCollision(char, obj) {
    if (obj.isDead) {
      return;
    }
    if (char.isStomping(obj)) {
      this.startCharStompingSequence(char, obj);
    } else if (char.isColliding(obj)) {
      if (!char.isHurt()) {
        this.startCharHitSequence(char);
      }
    }
  }

  checkChickenCollision(char) {
    for (let i = 0; i < this.world.enemies.length; i++) {
      this.updateChickenCollision(char, this.world.enemies[i]);
    }
  }

  setCollectingCoinSequence(char, index) {
    const obj = this.world.coins[index];
    if (char.isColliding(obj)) {
      this.world.coins.splice(index, 1);
      this.statusBar.coinCount += 1;
      this.statusBar.score += 100;
      this.frameObjects = this.world.getFramePackages();
    }
  }

  checkCoinCollisions(char) {
    for (let i = this.world.coins.length - 1; i >= 0; i--) {
      this.setCollectingCoinSequence(char, i);
    }
  }

  setCollectingBottleSequence(char, index) {
    const obj = this.world.bottles[index];
    if (char.isColliding(obj)) {
      this.world.bottles.splice(index, 1);
      this.statusBar.bottleCount += 1;
      this.frameObjects = this.world.getFramePackages();
    }
  }

  checkBottleCollisions(char) {
    for (let i = this.world.bottles.length - 1; i >= 0; i--) {
      this.setCollectingBottleSequence(char, i);
    }
  }
}
