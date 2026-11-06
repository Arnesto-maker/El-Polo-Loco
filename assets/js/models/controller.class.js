class Controller {
  constructor() {
    this.right = false;
    this.left = false;
    this.space = false;
    this.enter = false;
    this.bindKeyEvents();
  }
  bindKeyEvents() {
    window.addEventListener("keydown", (event) => {
      if (event.code === "ArrowRight" || event.code === "KeyD") {
        this.right = true;
      }
      if (event.code === "ArrowLeft" || event.code === "KeyA") {
        this.left = true;
      }
      if (event.code === "Space") {
        this.space = true;
      }
      if (event.code === "Enter") {
        this.enter = true;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.code === "ArrowRight" || event.code === "KeyD") {
        this.right = false;
      }
      if (event.code === "ArrowLeft" || event.code === "KeyA") {
        this.left = false;
      }
      if (event.code === "Space") {
        this.space = false;
      }
      if (event.code === "Enter") {
        this.enter = false;
      }
    });
  }
}
