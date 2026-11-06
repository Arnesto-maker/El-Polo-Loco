const canvas = document.getElementById("gameCanvas");
const world = new World(canvas);
const controller = new Controller();
const engine = new GameEngine(canvas, controller, world.getFramePackages(),world);
