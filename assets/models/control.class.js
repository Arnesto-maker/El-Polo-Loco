class Keyboard {
  LEFT = false;
  RIGHT = false;
  SPACE = false;
  constructor() {
    this.initKeyboardControl();
  }
  initKeyboardControl() {
    this.keyboardControlKeyDown();
    this.keyboardControlKeyUp();
  }
  keyboardControlKeyUp() {
    window.addEventListener("keyup", (event) => {
      if (event.code == "ArrowRight") {
        world.keyboard.RIGHT = false;
      }
      if (event.code == "ArrowLeft") {
        world.keyboard.LEFT = false;
      }
      if (event.code == "Space") {
        world.keyboard.SPACE = false;
      }
    });
  }
  keyboardControlKeyDown() {
    window.addEventListener("keydown", (event) => {
      if (event.code == "ArrowRight") {
        world.keyboard.RIGHT = true;
      }
      if (event.code == "ArrowLeft") {
        world.keyboard.LEFT = true;
      }
      if (event.code == "Space") {
        world.keyboard.SPACE = true;
      }
    });
  }
}
