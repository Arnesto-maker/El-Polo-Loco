class GameEngine {
  constructor(canvasElement, inputController, gameFrames, world) {
    this.world = world;
    this.ctx = canvasElement.getContext("2d");
    this.controller = inputController;
    this.frameObjects = gameFrames;
    this.statusBar = new StatusBar(canvasElement);
    this.lastBossTick = 0;
    this.isPaused = false;
    this.coinConverter = new CoinConverter(this.statusBar, this);
    this.bindConverterEvents();
    this.renderLoop();
  }

  bindConverterEvents() {
    window.addEventListener("keydown", (e) => {
      this.coinConverter.handleKeyDown(e.key);
    });
  }

  handleCanvasClick(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    this.coinConverter.handleClick(x, y);
  }

  renderLoop() {
    const char = this.world.character;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (!this.isPaused) {
      this.updateLogic(char);
      this.checkAllCollisions(char);
    }
    this.drawWorldWithCamera(char);
    this.statusBar.draw(this.ctx);
    this.coinConverter.draw(this.ctx);
    requestAnimationFrame(() => this.renderLoop());
  }

  drawWorldWithCamera(char) {
    this.ctx.translate(char.cameraX, 0);
    this.drawFrame();
    this.ctx.translate(-char.cameraX, 0);
  }

  updateLogic(char) {
    this.updateThrowWorkflow(char);
    this.updateBossFightState();
    for (let i = 0; i < this.frameObjects.length; i++) {
      if (this.frameObjects[i].update) {
        this.frameObjects[i].update(this.controller);
      }
    }
    this.cleanupObjects();
  }

  cleanupObjects() {
    this.removeDeadChicken();
    this.removeSplashedBottles();
    this.removeSplashedBossBottles();
    this.removeDeadBoss();
  }

  updateBossFightState() {
    const boss = this.world.boss;
    if (!boss || boss.isDead) {
      return;
    }
    if (!boss.isActivated && this.world.enemies.length === 0) {
      this.activateBossFight(boss);
    }
    if (boss.isActivated) {
      this.updateBossHudAndSpecial(boss);
    }
  }

  activateBossFight(boss) {
    boss.isActivated = true;
    this.statusBar.showBossHud = true;
    this.statusBar.bossBonus = 10000;
    this.lastBossTick = performance.now();
  }

  updateBossHudAndSpecial(boss) {
    this.updateBossTimerAndScore();
    this.statusBar.bossHealth = boss.health;
    this.statusBar.updateBossHealthImage();
    if (boss.readyToSpawnSpecial) {
      boss.readyToSpawnSpecial = false;
      this.spawnBossSpecialBottles(boss);
    }
  }

  updateBossTimerAndScore() {
    const now = performance.now();
    const dt = now - this.lastBossTick;
    this.lastBossTick = now;
    this.statusBar.bossTimeMs += dt;
    this.reduceBossScoreBonus(dt);
  }

  reduceBossScoreBonus(dt) {
    if (this.statusBar.bossBonus > 0) {
      const penalty = Math.floor(dt * 0.1);
      this.statusBar.bossBonus = Math.max(
        0,
        this.statusBar.bossBonus - penalty,
      );
    }
  }

  spawnBossSpecialBottles(boss) {
    const velocitiesX = [-14, -9.5, -5, 5, 9.5, 14];
    const startX = boss.x + boss.width * 0.4;
    const startY = boss.y + boss.height * 0.1;
    for (let i = 0; i < velocitiesX.length; i++) {
      const b = new BossBottle(
        this.ctx.canvas,
        startX,
        startY,
        velocitiesX[i],
        -21,
      );
      this.world.bossBottles.push(b);
    }
    this.frameObjects = this.world.getFramePackages();
  }

  updateThrowWorkflow(char) {
    if (this.controller.enter && this.statusBar.bottleCount > 0) {
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
    this.checkBossCollisions(char);
    this.checkBossBottleCollisions(char);
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
    this.checkBottleHitsBoss(bottle);
  }

  checkBottleHitsBoss(bottle) {
    const boss = this.world.boss;
    if (boss && !boss.isDead && bottle.isColliding(boss)) {
      bottle.startSplashSequenz();
      boss.applyZoneHit(bottle);
      this.statusBar.bossHealth = boss.health;
      this.statusBar.updateBossHealthImage();
    }
  }

  checkBossCollisions(char) {
    const boss = this.world.boss;
    if (!boss || !boss.isActivated || boss.isDead) {
      return;
    }
    if (char.isColliding(boss) && !char.isHurt()) {
      this.applyBossContactDamage(char, boss);
    }
  }

  applyBossContactDamage(char, boss) {
    if (boss.isAttacking) {
      char.health = Math.max(0, char.health - 10);
    } else {
      char.health = Math.max(0, char.health - 2);
    }
    char.lastHit = performance.now();
    this.statusBar.health = char.health;
    this.statusBar.updateHealthImage();
  }

  checkBossBottleCollisions(char) {
    const bottles = this.world.bossBottles;
    for (let i = 0; i < bottles.length; i++) {
      if (!bottles[i].isSplashing && char.isColliding(bottles[i])) {
        bottles[i].startSplashSequenz();
        if (!char.isHurt()) {
          this.startCharHitSequence(char);
        }
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

  removeSplashedBossBottles() {
    const prevLength = this.world.bossBottles.length;
    this.world.bossBottles = this.world.bossBottles.filter((bottle) => {
      return this.isBottleStillActive(bottle);
    });
    if (this.world.bossBottles.length !== prevLength) {
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

  removeDeadBoss() {
    const boss = this.world.boss;
    if (boss && boss.isDead && performance.now() - boss.deadTime >= 1000) {
      this.statusBar.score += this.statusBar.bossBonus;
      this.statusBar.bossBonus = 0;
      this.statusBar.showBossHud = false;
      this.world.boss = null;
      this.frameObjects = this.world.getFramePackages();
    }
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
