class MovableObject {
  x = 120;
  y = 400;
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
  isColliding(object) {
    return (
      this.x + this.width >= object.x &&
      this.x <= object.x + object.width &&
      this.y + this.height >= object.y &&
      this.y <= object.y + object.height
    );
  }
  isJumpingOn(object) {
    return this.y + this.height < object.y + object.height / 2;
  }
}
