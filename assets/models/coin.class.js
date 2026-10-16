class Coin extends MovableObject {
  width;
  height;
  constructor(x, y) {
    super();
    this.width = 100;
    this.height = 100;
    this.x = x;
    this.y = y;
    this.loadimage("assets/img/8_coin/coin_2.png");
    this.offset = {
      top: 40, 
      bottom: 40, 
      left: 40, 
      right: 40,
    };
  }
}
