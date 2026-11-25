/**
 * Standard patrolling chicken enemy supporting stomp kills, collision reversal, and dt-scaled movement.
 */
class Chicken extends MovableObject {
  IMAGE_0 = "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png";
  IMAGES_WALK = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGE_DEAD = ["assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];
  isDead = false;
  deadTime = 0;
  v = 0;
  direction = 1;

  /**
   * Initializes chicken sprites, randomized speed, patrol bounds, and hitbox.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {number} minX - Left spawn sector limit.
   * @param {number} maxX - Right spawn sector limit.
   */
  constructor(canvas, minX, maxX) {
    super(canvas);
    this.loadAllImages();
    this.setMainParameter(minX, maxX);
    this.setPatrolRange();
    this.offset = this.setOffsetParameter();
  }

  /**
   * Configures dimensions, random spawn position, velocity, and initial heading.
   * @param {number} minX - Left spawn sector limit.
   * @param {number} maxX - Right spawn sector limit.
   * @returns {void}
   */
  setMainParameter(minX, maxX) {
    this.img = this.imageCache[this.IMAGE_0];
    this.width = this.canvasWidth * 0.06;
    this.height = this.canvasHeight * 0.11;
    this.x = minX + Math.random() * (maxX - minX);
    this.y = this.canvasHeight - this.height - this.floor - 10;
    this.v = 1.5 + Math.random() * 1.5;
    if (Math.random() < 0.5) {
      this.direction = -1;
    } else {
      this.direction = 1;
    }
  }

  /**
   * Builds the collision offset box for the chicken enemy.
   * @returns {{top: number, bottom: number, left: number, right: number}} Hitbox offsets.
   */
  setOffsetParameter() {
    return {
      top: this.height * 0.1,
      bottom: this.height * 0.1,
      left: this.width * 0.1,
      right: this.width * 0.1,
    };
  }

  /**
   * Computes clamped horizontal patrol limits around the spawn point.
   * @returns {void}
   */
  setPatrolRange() {
    this.xMax = 0.25 * this.canvasWidth;
    const levelMinX = 300;
    const levelMaxX = 2 * this.canvasWidth - 300;
    this.minPatrolX = Math.max(levelMinX, this.x - this.xMax);
    this.maxPatrolX = Math.min(levelMaxX, this.x + this.xMax);
  }

  /**
   * Preloads walking and defeated chicken sprites.
   * @returns {void}
   */
  loadAllImages() {
    this.loadImages([this.IMAGE_0]);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGE_DEAD);
  }

  /**
   * Advances horizontal patrol movement scaled to 60-FPS delta time.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  updateMovement(scale = 1) {
    this.x += this.v * this.direction * scale;
    if (this.x >= this.maxPatrolX) {
      this.x = this.maxPatrolX;
      this.direction = -1;
    } else if (this.x <= this.minPatrolX) {
      this.x = this.minPatrolX;
      this.direction = 1;
    }
    this.registerDirectionChange();
  }

  /**
   * Reverses horizontal walking direction immediately on player collision.
   * @returns {void}
   */
  reverseDirection() {
    if (this.isDead) {
      return;
    }
    this.direction = -this.direction;
    this.registerDirectionChange();
  }

  /**
   * Synchronizes sprite mirroring flag with current walking direction.
   * @returns {void}
   */
  registerDirectionChange() {
    if (this.direction === 1) {
      this.otherDirection = true;
    } else {
      this.otherDirection = false;
    }
  }

  /**
   * Marks the chicken defeated, stops movement, and displays the dead sprite.
   * @returns {void}
   */
  die() {
    this.isDead = true;
    this.v = 0;
    this.img = this.imageCache[this.IMAGE_DEAD[0]];
    this.deadTime = performance.now();
  }

  /**
   * Updates movement and walking animation while alive.
   * @param {Controller} controller - Active input controller.
   * @param {number} [scale=1] - Normalized 60-FPS delta scale factor.
   * @returns {void}
   */
  update(controller, scale = 1) {
    if (!this.isDead) {
      this.updateMovement(scale);
      this.playAnimation(this.IMAGES_WALK, scale);
    }
  }
}