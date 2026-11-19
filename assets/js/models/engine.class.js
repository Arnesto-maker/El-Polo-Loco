/**
 * Central 60 FPS game loop coordinating rendering, popups, combat, and collisions.
 */
class GameEngine {
  /**
   * Initializes canvas context, managers, HUD, popups, and starts the loop.
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
    this.lastBossTick = 0;
    this.isPaused = false;
    this.isRunning = true;
    this.animationFrameId = null;
    this.initPopups();
    this.renderLoop();
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
   * Executes one frame of game logic, collision handling, camera draw, and HUD draw.
   * @returns {void}
   */
  renderLoop() {
    if (!this.isRunning || !this.world) {
      return;
    }
    const char = this.world.character;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (!this.isPaused) {
      this.updateLogic(char);
      if (!this.isRunning) {
        return;
      }
      this.collisionManager.checkAllCollisions(char);
    }
    this.drawScene(char);
    this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
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
   * Translates canvas context by camera offset, draws all entities, and restores offset.
   * @param {Character} char - Player character holding cameraX.
   * @returns {void}
   */
  drawWorldWithCamera(char) {
    this.ctx.translate(char.cameraX, 0);
    this.drawFrame();
    this.ctx.translate(-char.cameraX, 0);
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
      this.combatManager.updateBossFightState();
    }
    this.updateAllFrameObjects();
    this.collisionManager.cleanupObjects();
    if (char.isReadyForGameOver) {
      this.triggerGameOverFlow();
    }
  }

  /**
   * Invokes the update method on every active frame object.
   * @returns {void}
   */
  updateAllFrameObjects() {
    for (let i = 0; i < this.frameObjects.length; i++) {
      if (this.frameObjects[i].update) {
        this.frameObjects[i].update(this.controller);
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