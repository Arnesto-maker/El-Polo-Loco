/**
 * Central seconds-based dt game loop coordinating rendering, popups, combat, collisions, and portrait lock.
 */
class GameEngine {
  /**
   * Initializes canvas context, managers, HUD, popups, and starts the dt loop.
   * @param {HTMLCanvasElement} canvasElement - The game canvas.
   * @param {Controller} inputController - Unified input controller instance.
   * @param {Array<Object>} gameFrames - Initial Z-ordered render objects.
   * @param {World} world - Active level World instance.
   */
  constructor(canvasElement, inputController, gameFrames, world) {
    this.world = world;
    this.ctx = canvasElement.getContext("2d");
    this.controller = inputController;
    this.frameObjects = gameFrames;
    this.statusBar = new StatusBar(canvasElement);
    this.combatManager = new CombatManager(this);
    this.collisionManager = new CollisionManager(this);
    this.initLoopState();
    this.initPopups();
    this.animationFrameId = requestAnimationFrame((ts) => this.renderLoop(ts));
  }

  /**
   * Initializes loop flags and seconds-based delta timing state.
   * @returns {void}
   */
  initLoopState() {
    this.lastBossTick = 0;
    this.isPaused = false;
    this.isRunning = true;
    this.animationFrameId = null;
    this.lastFrameTime = 0;
    this.dtSec = 1 / 60;
    this.frameScale = 1;
  }

  /**
   * Instantiates all in-game popup controllers.
   * @returns {void}
   */
  initPopups() {
    this.startHelp = new StartHelpPopup(this);
    this.bossDossier = new BossDossierPopup(this);
    this.coinConverter = new CoinConverter(this.statusBar, this);
    this.pausePopup = new PausePopup(this);
  }

  /**
   * Rebuilds the cached render list from the World instance.
   * @returns {void}
   */
  refreshFrameObjects() {
    this.frameObjects = this.world.getFramePackages();
  }

  /**
   * Pauses simulation and clears held input flags when portrait Sperrframe activates.
   * @returns {void}
   */
  pauseForLandscapeLock() {
    this.isPaused = true;
    this.lastFrameTime = 0;
    this.controller.resetStates();
  }

  /**
   * Keeps simulation paused and triggers the Pause Popup when returning to landscape.
   * @returns {void}
   */
  resumeAfterLandscapeLock() {
    this.isPaused = true;
    this.lastFrameTime = 0;
    if (this.pausePopup) {
      this.pausePopup.openPauseFromLandscapeLock();
    }
  }

  /**
   * Routes discrete control keys from Controller to the highest-priority open popup.
   * @param {string} key - Logical key name (Tab, Enter, b, ArrowLeft, ArrowRight).
   * @returns {void}
   */
  routePopupKeyDown(key) {
    if (!this.isRunning) {
      return;
    }
    if (this.startHelp.isOpen) {
      this.startHelp.handleKeyDown(key);
    } else if (this.bossDossier.isOpen) {
      this.bossDossier.handleKeyDown(key);
    } else if (key === "Tab" || this.pausePopup.isOpen) {
      this.pausePopup.handleKeyDown(key);
    } else {
      this.coinConverter.handleKeyDown(key);
    }
  }

  /**
   * Executes one display frame with clamped seconds-based dt scaling.
   * @param {number} timestamp - High-resolution timestamp from requestAnimationFrame.
   * @returns {void}
   */
  renderLoop(timestamp) {
    if (!this.isRunning || !this.world) {
      return;
    }
    this.updateDeltaSeconds(timestamp || performance.now());
    const char = this.world.character;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (!this.isPaused && !isLandscapeLocked()) {
      this.stepSimulation(char);
      if (!this.isRunning) {
        return;
      }
    }
    this.drawScene(char);
    this.animationFrameId = requestAnimationFrame((ts) => this.renderLoop(ts));
  }

  /**
   * Calculates frame delta in seconds (clamped to 0.05s) and normalizes to a 60-FPS scale.
   * @param {number} now - Current timestamp in milliseconds.
   * @returns {void}
   */
  updateDeltaSeconds(now) {
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = now;
    }
    const rawSec = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;
    this.dtSec = Math.max(0, Math.min(rawSec, 0.05));
    this.frameScale = this.dtSec * 60;
  }

  /**
   * Advances one normalized simulation frame for logic, entities, and collisions.
   * @param {Character} char - Player character instance.
   * @returns {void}
   */
  stepSimulation(char) {
    this.updateLogic(char);
    if (this.isRunning) {
      this.collisionManager.checkAllCollisions(char);
    }
  }

  /**
   * Renders world sprites, HUD overlay, and canvas popups.
   * @param {Character} char - Player character for camera translation.
   * @returns {void}
   */
  drawScene(char) {
    this.drawWorldWithCamera(char);
    this.statusBar.draw(this.ctx);
    this.coinConverter.draw(this.ctx);
  }

/**
   * Translates canvas context by integer-rounded camera offset, draws all entities, and restores offset.
   * @param {Character} char - Player character holding cameraX.
   * @returns {void}
   */
  drawWorldWithCamera(char) {
    const camX = Math.round(char.cameraX);
    this.ctx.translate(camX, 0);
    this.drawFrame();
    this.ctx.translate(-camX, 0);
  }

  /**
   * Advances combat, entity updates, object cleanup, and checks game-over condition.
   * @param {Character} char - Player character instance.
   * @returns {void}
   */
  updateLogic(char) {
    if (!char.isDead() && !char.isHurtAnimationActive()) {
      this.combatManager.updateThrowWorkflow(char);
    }
    if (!char.isDead()) {
      this.combatManager.updateBossFightState(this.dtSec * 1000);
    }
    this.updateAllFrameObjects();
    this.collisionManager.cleanupObjects();
    if (char.isReadyForGameOver) {
      this.triggerGameOverFlow();
    }
  }

  /**
   * Invokes the dt-scaled update method on every active frame object.
   * @returns {void}
   */
  updateAllFrameObjects() {
    for (let i = 0; i < this.frameObjects.length; i++) {
      if (this.frameObjects[i].update) {
        this.frameObjects[i].update(this.controller, this.frameScale);
      }
    }
  }

  /**
   * Draws every entity in the current Z-ordered frame array.
   * @returns {void}
   */
  drawFrame() {
    for (let i = 0; i < this.frameObjects.length; i++) {
      if (this.frameObjects[i].draw) {
        this.frameObjects[i].draw(this.ctx);
      }
    }
  }

  /**
   * Transitions the application into the Game Over screen.
   * @returns {void}
   */
  triggerGameOverFlow() {
    showGameOverFrame();
  }
}