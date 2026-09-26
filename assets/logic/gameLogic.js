let canvas;
let world;
let keyboard = new Keyboard();

const init = () => {
  canvas = document.getElementById("mainCanvas");
  world = new Environment(canvas, keyboard);
};

window.addEventListener("keydown", (event) => {
  if (event.key == "ArrowRight") {
    keyboard.right = true;
  }
  if (event.key == "ArrowLeft") {
    keyboard.left = true;
  }
  if (event.code == "Space") {
    keyboard.up = true;
  }
  if (event.key == "ArrowDown") {
    keyboard.down = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key == "ArrowRight") {
    keyboard.right = false;
  }
  if (event.key == "ArrowLeft") {
    keyboard.left = false;
  }
  if (event.code == "Space") {
    keyboard.up = false;
  }
  if (event.key == "ArrowDown") {
    keyboard.down = false;
  }
});

const spawnChicken = () => {
  let array = [];
  for (let index = 0; index < 5; index++) {
    array.push(new Chicken())
  }
  return array
};

const level1 = new Level(
  spawnChicken(),
  [new Cloud()],
  [
    new Background("asset/img/5_background/layers/air.png", -720),
    new Background("asset/img/5_background/layers/3_third_layer/2.png", -720),
    new Background("asset/img/5_background/layers/2_second_layer/2.png", -720),
    new Background("asset/img/5_background/layers/1_first_layer/2.png", -720),

    new Background("asset/img/5_background/layers/air.png", 0),
    new Background("asset/img/5_background/layers/3_third_layer/1.png", 0),
    new Background("asset/img/5_background/layers/2_second_layer/1.png", 0),
    new Background("asset/img/5_background/layers/1_first_layer/1.png", 0),

    new Background("asset/img/5_background/layers/air.png", 720),
    new Background("asset/img/5_background/layers/3_third_layer/2.png", 720),
    new Background("asset/img/5_background/layers/2_second_layer/2.png", 720),
    new Background("asset/img/5_background/layers/1_first_layer/2.png", 720),

    new Background("asset/img/5_background/layers/air.png", 720 * 2),
    new Background(
      "asset/img/5_background/layers/3_third_layer/1.png",
      720 * 2,
    ),
    new Background(
      "asset/img/5_background/layers/2_second_layer/1.png",
      720 * 2,
    ),
    new Background(
      "asset/img/5_background/layers/1_first_layer/1.png",
      720 * 2,
    ),

    new Background("asset/img/5_background/layers/air.png", 720 * 3),
    new Background(
      "asset/img/5_background/layers/3_third_layer/2.png",
      720 * 3,
    ),
    new Background(
      "asset/img/5_background/layers/2_second_layer/2.png",
      720 * 3,
    ),
    new Background(
      "asset/img/5_background/layers/1_first_layer/2.png",
      720 * 3,
    ),
  ],
);
