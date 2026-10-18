class MovableObject {
  x = 120;
  y = 400;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  img;
  availableImages = {};
  currentImageIndex = 0;
  loadimage(path) {
    this.img = new Image();
    this.img.src = path;
  }
  createImage(path) {
    let img = new Image();
    img.src = path;
    return img;
  }
  moveRight(speed) {
    this.x += speed;
  }
  moveLeft(speed) {
    this.x -= speed;
  }
  // fulle img containers
  setAvailableImages(array) {
    array.forEach((path) => {
      this.availableImages[path] = this.createImage(path);
    });
  }

  setAnimation(array) {
    this.setAvailableImages(array);
    let index = this.currentImageIndex % array.length;
    let path = array[index];
    this.img = this.availableImages[path];
    this.currentImageIndex++;
  }

  playAnimation(array) {
    setInterval(() => {
      this.setAnimation(array);
    }, 100);
  }

  playEnemyAnimation(array, enemy) {
    setInterval(() => {
      if (!enemy.isDead) {
        this.setAnimation(array);
      }
    }, 100);
  }

  jump() {
    this.y = 40;
  }
  gravity(speed) {
    if (this.y < this.floor) {
      this.y += speed;
    }
    if (this.y >= this.floor) {
      this.y = this.floor;
    }
  }
  applyGravity(speed) {
    setInterval(() => {
      this.gravity(speed);
    }, 1000 / 60);
  }
  isColliding(obj) {
    return (
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left &&
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top &&
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom
    );
  }
  isJumpingOn(object) {
    return (
      this.y + this.height - this.offset.bottom <
      object.y +
        object.offset.top +
        (object.height - object.offset.top - object.offset.bottom) / 2
    );
  }

  drawFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "blue";
    ctx.rect(
      this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom,
    );
    ctx.stroke();
    ctx.stroke();
  }
}
