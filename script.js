
let world;
const initWorld = () => {
  canvas = document.getElementById("gameCanvas");
  world = new World(canvas);
  console.log("my character = ", world.character);
  console.log("my Enemy = ", world.enemies);
};


