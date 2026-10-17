class Character extends MovableObject {
  height;
  width;
  x = 20;
  y = 220;
  height = 200;
  width = 100;
  health = 100;
  isDead = false;
  speed = 4;
  camera_speed = 6;
  speedY = 5;
  floor;
  world;
  idle_images = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  long_idle_images = [
    "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];
  walking_images = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];
  jumping_images = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
  ];
  other_direction = false;
  constructor(worldInstance) {
    super();
    this.world = worldInstance;
    this.floor = 220;
    this.loadimage(this.idle_images[0]);
    this.initCharacterPhysics();
    // animation functions
    this.playAnimation(this.idle_images);
    this.initWalkingAnimation(this.walking_images);
    this.initJumpingAnimation(this.jumping_images);

    this.offset = {
      top: 80,
      bottom: 10,
      left: 20,
      right: 30,
    };
  }
  //states
  hit() {
    this.health -= 5;
    if (this.health < 0) {
      this.health = 0;
    }
  }
  isdead() {
    setInterval(() => {
      if (this.health == 0) {
        this.isDead = true;
      }
    }, 100);
  }
  initCharacterPhysics() {
    this.checkKeyboardWalkingState();
    this.checkKeyboardJumpingState();
    this.applyGravity(this.speedY);
  }
  levelEndPosition() {
    if (this.x <= 1.7 * this.world.canvas.width) {
      return true;
    }
  }
  hasReachedScreenMiddle() {
    if (this.x >= 0.5 * this.world.canvas.width) {
      return true;
    }
  }
  inMiddleOfSecondScreen() {
    if (this.x <= 1.5 * this.world.canvas.width) {
      return true;
    }
  }
  initWalkingAnimation(array) {
    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.setAnimation(array);
      }
    }, 100);
  }

  initJumpingAnimation(array) {
    setInterval(() => {
      if (this.y < this.floor) {
        this.setAnimation(array);
      }
    }, 100);
  }

  checkKeyboardWalkingState() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.levelEndPosition()) {
        this.characterMovingRight();
      } else if (this.world.keyboard.LEFT && this.x >= 20) {
        this.characterMovingLeft();
      }
    }, 1000 / 60);
  }
  checkKeyboardJumpingState() {
    setInterval(() => {
      if (this.world.keyboard.SPACE && this.y >= this.floor) {
        this.jump();
      }
    }, 100);
  }

  // camera control
  followCharacterRight() {
    if (this.hasReachedScreenMiddle()) {
      this.world.camera_x -= this.camera_speed;
      let level_width = this.world.canvas.width * 2;
      let max_scroll = -(level_width - this.world.canvas.width);
      if (this.world.camera_x < max_scroll) {
        this.world.camera_x = max_scroll;
      }
    }
  }

  followCharacterleft() {
    if (this.inMiddleOfSecondScreen()) {
      this.world.camera_x += this.camera_speed;
      if (this.world.camera_x > 0) {
        this.resetCameraPosition();
      }
    }
  }

  cameraLeftBoundary() {
    if (this.world.camera_x >= 10) {
      return true;
    }
  }

  resetCameraPosition() {
    this.world.camera_x = 0;
  }

  // charcter movements
  characterMovingRight() {
    this.moveRight(this.speed, this.walking_images);
    this.followCharacterRight();
    this.other_direction = false;
  }
  characterMovingLeft() {
    this.moveLeft(this.speed);
    this.followCharacterleft();
    this.other_direction = true;
  }
}

// note :
