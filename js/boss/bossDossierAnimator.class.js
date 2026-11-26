/**
 * Drives the deterministic 2-scene 60-FPS preview loop and shared canvas helpers for Boss Dossier.
 */
class BossDossierAnimator {
  /**
   * Initializes sprite caches, scene delegate, and bound animation loop state.
   * @param {GameEngine} engine - Active GameEngine instance.
   * @param {Function} onSceneChange - Callback invoked when switching between Scene 1 and Scene 2.
   */
  constructor(engine, onSceneChange) {
    this.engine = engine;
    this.onSceneChange = onSceneChange;
    this.sprites = {};
    this.scenes = new BossDossierScenes(this);
    this.boundLoop = this.loop.bind(this);
    this.initLoopState();
    this.preloadSprites();
  }

  /**
   * Initializes runtime canvas references, loop flags, and timeline counters.
   * @returns {void}
   */
  initLoopState() {
    this.canvas = null;
    this.ctx = null;
    this.isRunning = false;
    this.animationFrameId = null;
    this.lastTime = 0;
    this.sceneIndex = 0;
    this.sceneTime = 0;
  }

  /**
   * Returns Pepe sprite paths used across Scene 1 and Scene 2.
   * @returns {Array<string>} Pepe sprite asset paths.
   */
  getPepePaths() {
    return [
      "assets/img/2_character_pepe/1_idle/idle/I-1.png",
      "assets/img/2_character_pepe/3_jump/J-34.png",
      "assets/img/2_character_pepe/6_throw/T-2.png",
      "assets/img/2_character_pepe/4_hurt/H-41.png",
      "assets/img/2_character_pepe/4_hurt/H-42.png",
      "assets/img/2_character_pepe/4_hurt/H-43.png",
    ];
  }

  /**
   * Returns Boss sprite paths used across Scene 1 and Scene 2.
   * @returns {Array<string>} Boss sprite asset paths.
   */
  getBossPaths() {
    return [
      "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
      "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
      "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
      "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
      "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
      "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
    ];
  }

  /**
   * Returns rotation and splash bottle sprite paths used in both scenes.
   * @returns {Array<string>} Bottle sprite asset paths.
   */
  getBottlePaths() {
    return [
      "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
      "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
      "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
      "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
      "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
      "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
      "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
      "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
      "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
      "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ];
  }

  /**
   * Preloads all dossier preview sprites into the local image cache.
   * @returns {void}
   */
  preloadSprites() {
    this.cachePathList(this.getPepePaths());
    this.cachePathList(this.getBossPaths());
    this.cachePathList(this.getBottlePaths());
  }

  /**
   * Loads every image path from an array into this.sprites.
   * @param {Array<string>} paths - Asset path list.
   * @returns {void}
   */
  cachePathList(paths) {
    for (let i = 0; i < paths.length; i++) {
      const img = new Image();
      img.src = paths[i];
      this.sprites[paths[i]] = img;
    }
  }

  /**
   * Starts the looping 2-scene animation on the target dossier canvas.
   * @param {HTMLCanvasElement|null} canvas - Dossier preview canvas element.
   * @returns {void}
   */
  start(canvas) {
    if (!canvas) {
      return;
    }
    this.stop();
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sceneIndex = 0;
    this.sceneTime = 0;
    this.lastTime = 0;
    this.isRunning = true;
    this.notifySceneChange();
    this.animationFrameId = requestAnimationFrame(this.boundLoop);
  }

  /**
   * Halts the preview animation loop and clears any pending animation frame.
   * @returns {void}
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.lastTime = 0;
  }

  /**
   * Notifies the popup controller whenever the active scene changes.
   * @returns {void}
   */
  notifySceneChange() {
    if (typeof this.onSceneChange === "function") {
      this.onSceneChange(this.sceneIndex);
    }
  }

  /**
   * Runs one clamped seconds-based dt frame of the scene loop.
   * @param {number} timestamp - High-resolution rAF timestamp in milliseconds.
   * @returns {void}
   */
  loop(timestamp) {
    if (!this.isRunning || !this.engine.isRunning) {
      this.stop();
      return;
    }
    const dtSec = this.computeDeltaSeconds(timestamp || performance.now());
    this.advanceTimeline(dtSec);
    this.renderFrame();
    this.animationFrameId = requestAnimationFrame(this.boundLoop);
  }

  /**
   * Computes frame delta in seconds clamped to 0.05s against tab-switch jumps.
   * @param {number} now - Current timestamp in milliseconds.
   * @returns {number} Clamped delta seconds.
   */
  computeDeltaSeconds(now) {
    if (this.lastTime === 0) {
      this.lastTime = now;
    }
    const raw = (now - this.lastTime) / 1000;
    this.lastTime = now;
    return Math.max(0, Math.min(raw, 0.05));
  }

  /**
   * Advances scene time and cycles endlessly between Scene 1 and Scene 2.
   * @param {number} dtSec - Clamped elapsed frame time in seconds.
   * @returns {void}
   */
  advanceTimeline(dtSec) {
    this.sceneTime += dtSec;
    const limit = this.getCurrentSceneDuration();
    if (this.sceneTime >= limit) {
      this.sceneTime = 0;
      this.sceneIndex = (this.sceneIndex + 1) % 2;
      this.notifySceneChange();
    }
  }

  /**
   * Returns duration in seconds for the currently active scene.
   * @returns {number} Active scene length in seconds.
   */
  getCurrentSceneDuration() {
    if (this.sceneIndex === 0) {
      return 3.2;
    }
    return 3.4;
  }

  /**
   * Draws the desert backdrop and dispatches rendering to Scene 1 or Scene 2.
   * @returns {void}
   */
  renderFrame() {
    if (!this.ctx) {
      return;
    }
    this.drawBackdrop(this.ctx);
    if (this.sceneIndex === 0) {
      this.scenes.drawSceneOne(this.sceneTime);
    } else {
      this.scenes.drawSceneTwo(this.sceneTime);
    }
  }

  /**
   * Draws the desert sky gradient, sand floor, and horizon line.
   * @param {CanvasRenderingContext2D} ctx - Mini-canvas 2D context.
   * @returns {void}
   */
  drawBackdrop(ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 308);
    grad.addColorStop(0, "#29b6f6");
    grad.addColorStop(0.68, "#ffe0b2");
    grad.addColorStop(1, "#ee9f3e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 308);
    ctx.fillStyle = "#b05d1c";
    ctx.fillRect(0, 308, 800, 52);
    ctx.fillStyle = "#7a3b10";
    ctx.fillRect(0, 308, 800, 5);
  }

  /**
   * Draws a preloaded sprite when fully available in cache.
   * @param {string} path - Sprite asset path.
   * @param {number} x - Destination X coordinate.
   * @param {number} y - Destination Y coordinate.
   * @param {number} w - Destination width.
   * @param {number} h - Destination height.
   * @returns {void}
   */
  drawSprite(path, x, y, w, h) {
    const img = this.sprites[path];
    if (img && img.complete && img.naturalWidth > 0) {
      this.ctx.drawImage(img, x, y, w, h);
    }
  }

  /**
   * Draws a dashed parabolic trajectory and rotating bottle at progress p.
   * @param {number} sx - Start X coordinate.
   * @param {number} sy - Start Y coordinate.
   * @param {number} ex - End X coordinate.
   * @param {number} ey - End Y coordinate.
   * @param {number} lift - Parabolic upward arch height in pixels.
   * @param {number} p - Normalized flight progress from 0 to 1.
   * @returns {void}
   */
  drawFlightBottle(sx, sy, ex, ey, lift, p) {
    this.drawArcTrail(sx + 20, sy + 24, ex + 20, ey + 24, lift, p);
    const x = sx + (ex - sx) * p;
    const y = sy + (ey - sy) * p - 4 * p * (1 - p) * lift;
    const frame = 1 + (Math.floor(p * 14) % 4);
    const path = `assets/img/6_salsa_bottle/bottle_rotation/${frame}_bottle_rotation.png`;
    this.drawSprite(path, x, y, 40, 56);
  }

  /**
   * Draws a dashed parabolic flight trail between start and end coordinates.
   * @param {number} sx - Start center X.
   * @param {number} sy - Start center Y.
   * @param {number} ex - End center X.
   * @param {number} ey - End center Y.
   * @param {number} lift - Arch lift height.
   * @param {number} progress - Fraction of arc to draw (0 to 1).
   * @returns {void}
   */
  drawArcTrail(sx, sy, ex, ey, lift, progress) {
    this.ctx.save();
    this.ctx.setLineDash([6, 6]);
    this.ctx.strokeStyle = "rgba(127, 0, 0, 0.78)";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.plotArcPoints(sx, sy, ex, ey, lift, progress);
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Plots segmented parabolic curve points onto the active canvas path.
   * @param {number} sx - Start center X.
   * @param {number} sy - Start center Y.
   * @param {number} ex - End center X.
   * @param {number} ey - End center Y.
   * @param {number} lift - Arch lift height.
   * @param {number} progress - Fraction of arc to draw (0 to 1).
   * @returns {void}
   */
  plotArcPoints(sx, sy, ex, ey, lift, progress) {
    for (let i = 0; i <= 14; i++) {
      const u = (i / 14) * progress;
      const px = sx + (ex - sx) * u;
      const py = sy + (ey - sy) * u - 4 * u * (1 - u) * lift;
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
  }

  /**
   * Draws a splash animation frame at the impact position.
   * @param {number} x - Splash left X coordinate.
   * @param {number} y - Splash top Y coordinate.
   * @param {number} progress - Normalized splash progress (0 to 1).
   * @returns {void}
   */
  drawSplashAt(x, y, progress) {
    const idx = Math.min(6, 1 + Math.floor(progress * 6));
    const path = `assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/${idx}_bottle_splash.png`;
    this.drawSprite(path, x, y, 64, 64);
  }

  /**
   * Draws a high-contrast floating damage badge on the mini-canvas.
   * @param {string} text - Badge label text.
   * @param {number} x - Horizontal center coordinate.
   * @param {number} y - Vertical baseline coordinate.
   * @param {string} fill - Text fill color.
   * @param {string} stroke - Outline stroke color.
   * @returns {void}
   */
  drawImpactLabel(text, x, y, fill, stroke) {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = "bold 28px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 5;
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}
