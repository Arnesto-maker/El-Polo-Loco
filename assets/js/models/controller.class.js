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
      this.setKeyState(event.code, true);
    });
    window.addEventListener("keyup", (event) => {
      this.setKeyState(event.code, false);
    });
  }

  setKeyState(code, state) {
    if (code === "ArrowRight" || code === "KeyD") {
      this.right = state;
    } else if (code === "ArrowLeft" || code === "KeyA") {
      this.left = state;
    } else if (code === "Space") {
      this.space = state;
    } else if (code === "Enter" || code === "NumpadEnter") {
      this.enter = state;
    }
  }
}