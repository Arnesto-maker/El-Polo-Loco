class BottleStatusBar extends DrawableObject {
  counter = 0;
  constructor(worldInstance) {
    super();
    this.world = worldInstance;
    this.x = 100;
    this.y = 60;
    this.width = 60;
    this.height = 60;
    this.loadimage("assets/img/7_statusbars/3_icons/icon_salsa_bottle.png");
  }
  setCounter(amount) {
    this.counter = amount;
  }
}
