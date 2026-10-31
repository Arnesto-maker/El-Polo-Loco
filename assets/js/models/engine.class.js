class GameEngine {
  constructor(canvasElement, inputController, gameFrames) {
    this.ctx = canvasElement.getContext("2d");
    this.controller = inputController;
    this.frameObjects = gameFrames;
    this.renderLoop();
  }
  renderLoop() {
    console.log("engine started");
    const char = this.frameObjects.find((object) => object.cameraX !== undefined);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.updateLogic();
    this.ctx.translate(char.cameraX, 0);
    this.drawFrame();
    this.ctx.translate(-char.cameraX, 0);
    requestAnimationFrame(() => this.renderLoop());
  }
  updateLogic() {
    this.frameObjects.forEach((object) => {
      if (object.update) {
        object.update(this.controller);
      }
    });
  }
  drawFrame() {
    this.frameObjects.forEach((object) => {
      if (object.draw) {
        object.draw(this.ctx);
      }
    });
  }
}
