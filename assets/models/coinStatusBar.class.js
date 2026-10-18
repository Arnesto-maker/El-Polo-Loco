class CoinStatusBar extends DrawableObject {
  counter = 0;
  constructor(worldInstance) {
    super();
    this.world = worldInstance;
    this.x = 20;
    this.y = 60;
    this.width = 60;
    this.height = 60;
    this.loadimage("assets/img/7_statusbars/3_icons/icon_coin.png");
  }
  setCounter(amount) {
    this.counter = amount;
  }
}
