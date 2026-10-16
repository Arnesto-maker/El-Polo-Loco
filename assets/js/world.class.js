class World {
  clouds;
  backgroundAir;
  backgroundThirdLayer;
  backgroundSecondLayer;
  backgroundFirstLayer;
  character;
  enemies;
  coins;
  bottles;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = new Keyboard();
    this.clouds = [
      new Cloud(1),
      new Cloud(1),
      new Cloud(1),
      new Cloud(2),
      new Cloud(2),
      new Cloud(2),
    ];
    this.backgroundAir = new Background(
      this,
      "assets/img/5_background/layers/air.png",
      2,
      0,
    );

    this.backgroundThirdLayer = new Background(
      this,
      "assets/img/5_background/layers/3_third_layer/1.png",
      1,
      0,
    );

    this.backgroundThirdLayerSecondScreen = new Background(
      this,
      "assets/img/5_background/layers/3_third_layer/2.png",
      1,
      this.canvas.width,
    );

    this.backgroundSecondLayer = new Background(
      this,
      "assets/img/5_background/layers/2_second_layer/1.png",
      1,
      0,
    );

    this.backgroundSecondLayerSecondScreen = new Background(
      this,
      "assets/img/5_background/layers/2_second_layer/2.png",
      1,
      this.canvas.width,
    );

    this.backgroundFirstLayer = new Background(
      this,
      "assets/img/5_background/layers/1_first_layer/1.png",
      1,
      0,
    );

    this.backgroundFirstLayerSecondScreen = new Background(
      this,
      "assets/img/5_background/layers/1_first_layer/2.png",
      1,
      this.canvas.width,
    );

    this.coins = [
      new Coin(200, 200),
      new Coin(300, 150),
      new Coin(400, 120),
      new Coin(500, 150),

      new Coin(750, 200),
      new Coin(900, 150),
      new Coin(1050, 120),
      new Coin(1200, 150),
    ];

    this.bottles = [
      new Bottle(150),
      new Bottle(300),

      new Bottle(450),
      new Bottle(500),

      new Bottle(700),

      new Bottle(900),
      new Bottle(950),

      new Bottle(1150),
    ];

    this.character = new Character(this);
    this.enemies = [
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
    ];
    this.runColissionCheck();
    this.draw();
  }

  // draw image wird am anfang mit dem Bild von character befüllt
  //this.ctx.drawImage(image, x-koor., y-koor, width, height);
  // 1. problem mehrfach aktivierung von draw notwendig !!!

  draw() {
    // löschen bevor render
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //character anzeigen
    this.ctx.translate(this.camera_x, 0);

    this.ctx.drawImage(
      this.backgroundAir.img,
      this.backgroundAir.x,
      this.backgroundAir.y,
      this.backgroundAir.width,
      this.backgroundAir.height,
    );

    this.ctx.drawImage(
      this.backgroundThirdLayer.img,
      this.backgroundThirdLayer.x,
      this.backgroundThirdLayer.y,
      this.backgroundThirdLayer.width,
      this.backgroundThirdLayer.height,
    );

    this.ctx.drawImage(
      this.backgroundThirdLayerSecondScreen.img,
      this.backgroundThirdLayerSecondScreen.x,
      this.backgroundThirdLayerSecondScreen.y,
      this.backgroundThirdLayerSecondScreen.width,
      this.backgroundThirdLayerSecondScreen.height,
    );

    this.ctx.drawImage(
      this.backgroundSecondLayer.img,
      this.backgroundSecondLayer.x,
      this.backgroundSecondLayer.y,
      this.backgroundSecondLayer.width,
      this.backgroundSecondLayer.height,
    );

    this.ctx.drawImage(
      this.backgroundSecondLayerSecondScreen.img,
      this.backgroundSecondLayerSecondScreen.x,
      this.backgroundSecondLayerSecondScreen.y,
      this.backgroundSecondLayerSecondScreen.width,
      this.backgroundSecondLayerSecondScreen.height,
    );

    this.ctx.drawImage(
      this.backgroundFirstLayer.img,
      this.backgroundFirstLayer.x,
      this.backgroundFirstLayer.y,
      this.backgroundFirstLayer.width,
      this.backgroundFirstLayer.height,
    );

    this.ctx.drawImage(
      this.backgroundFirstLayerSecondScreen.img,
      this.backgroundFirstLayerSecondScreen.x,
      this.backgroundFirstLayerSecondScreen.y,
      this.backgroundFirstLayerSecondScreen.width,
      this.backgroundFirstLayerSecondScreen.height,
    );

    this.clouds.forEach((cloud) => {
      this.ctx.drawImage(
        cloud.img,
        cloud.x,
        cloud.y,
        cloud.width,
        cloud.height,
      );
    });

    this.coins.forEach((coin) => {
      this.ctx.drawImage(coin.img, coin.x, coin.y, coin.width, coin.height);
    });

    this.bottles.forEach((bottle) => {
      this.ctx.drawImage(
        bottle.img,
        bottle.x,
        bottle.y,
        bottle.width,
        bottle.height,
      );
    });

    // character images
    if (this.character.other_direction) {
      this.ctx.save();
      this.ctx.translate(this.character.width, 0);
      this.ctx.scale(-1, 1);
      this.character.x = this.character.x * -1;
    }

    this.ctx.drawImage(
      this.character.img,
      this.character.x,
      this.character.y,
      this.character.width,
      this.character.height,
    ); 

    if (this.character.other_direction) {
      this.character.x = this.character.x * -1;
      this.ctx.restore();
    }

    // character images

    // enemies mit schleife anzeigen :
    this.enemies.forEach((enemy) => {
      if (enemy.other_direction) {
        this.ctx.save();
        this.ctx.translate(enemy.width, 0);
        this.ctx.scale(-1, 1);
        enemy.x = enemy.x * -1;
      }

      this.ctx.drawImage(
        enemy.img,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height,
      );

      if (enemy.other_direction) {
        enemy.x = enemy.x * -1;
        this.ctx.restore();
      }
    });

    // enamies

    this.ctx.translate(-this.camera_x, 0);

    // render maschine einrichten :
    requestAnimationFrame(() => {
      this.draw();
    });
  }
  runColissionCheck() {
    setInterval(() => {
      this.checkColission();
    }, 100);
  }

  checkColission() {
    this.enemies.forEach((enemy) => {
      if (enemy.isDead) {
        return;
      }
      if (this.character.isColliding(enemy)) {
        if (this.character.isJumpingOn(enemy)) {
          enemy.isDead = true;
          enemy.loadimage(
            "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
          );
          this.character.jump();
          setTimeout(() => {
            this.enemies.splice(this.enemies.indexOf(enemy), 1);
          }, 1000);
        } else {
          console.log("damaged");
        }
      }
    });

    this.coins.forEach((coin) => {
      if (this.character.isColliding(coin)) {
        console.log("coin colected");
        this.coins.splice(this.coins.indexOf(coin), 1);
      }
    });
 
    this.bottles.forEach((bottle) => {
      if (this.character.isColliding(bottle)) {
        console.log("bottle colected");
        this.bottles.splice(this.bottles.indexOf(bottle), 1);
      }
    });
  }
}
