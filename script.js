// variable context wandert in die world.class.js

// let canvas
// let ctx

// protokoll 12.09.2026 --> character und Enemies werden zur klasse world um gezogen
// let character = new Character()
// let enemies = [
//     new Chicken(),
//     new Chicken(),
//     new Chicken()
// ]
// protokoll 12.09.2026 --> character und Enemies werden zur klasse world um gezogen
let world;
const initWorld = () => {
  canvas = document.getElementById("gameCanvas");
  // ctx = canvas.getContext("2d")
  world = new World(canvas);
  console.log("my character = ", world.character);
  console.log("my Enemy = ", world.enemies);
};


