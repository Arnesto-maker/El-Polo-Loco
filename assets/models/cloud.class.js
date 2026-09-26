class Cloud extends MovableObject {
  speed = 0.5;
  other_direction = false;
  height = 400;
  width = 500;
  constructor(screenFactor) {
    super();
    this.x = Math.random() * 500 * screenFactor + 200;
    this.y = 0;
    if (this.isOnFirstScreen(screenFactor)) {
      this.loadimage("assets/img/5_background/layers/4_clouds/1.png");
    }
    if (this.isOnSecondScreen(screenFactor)) {
      this.loadimage("assets/img/5_background/layers/4_clouds/2.png");
    }
    this.cloudMoving(this.speed, screenFactor);
  }

  // screen Position
  isOnFirstScreen(screenFactor) {
    if (screenFactor === 1) {
      return true;
    }
  }
  isOnSecondScreen(screenFactor) {
    if (screenFactor === 2) {
      return true;
    }
  }

  cloudMoving(speed, screenFactor) {
    setInterval(() => {
      this.patrolFirstScreen(speed, screenFactor);
      this.patrolSecondScreen(speed, screenFactor);
    }, 1000 / 60);
  }

  patrolFirstScreen(speed, screenFactor) {
    if (this.isOnFirstScreen(screenFactor)) {
      if (!this.other_direction) {
        this.moveLeft(speed);
      } else {
        this.moveRight(speed);
      }
      this.swicthDirectionFirstScreen();
    }
  }

  patrolSecondScreen(speed, screenFactor) {
    if (this.isOnSecondScreen(screenFactor)) {
      if (!this.other_direction) {
        this.moveLeft(speed);
      } else {
        this.moveRight(speed);
      }
      this.swicthDirectionSecondScreen();
    }
  }

  swicthDirectionFirstScreen() {
    if (this.x < -100) {
      this.other_direction = true;
    } else if (this.x > 500) {
      this.other_direction = false;
    }
  }
  
  swicthDirectionSecondScreen() {
    if (this.x < 500) {
      this.other_direction = true;
    } else if (this.x > 1200) {
      this.other_direction = false;
    }
  }
}
