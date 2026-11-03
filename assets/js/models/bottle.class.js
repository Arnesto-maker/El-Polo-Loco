class Bottle extends DrawableObject {
  IMAGES_GROUND = [
    "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];
  constructor(canvas, sectorMinX, sectorMaxX) {
    super(canvas);
    this.initBottleImage();
    this.setBottleParameter(sectorMaxX,sectorMinX);
  }

  initBottleImage() {
    let randomPath;
    if (Math.random() < 0.5) {
      randomPath = this.IMAGES_GROUND[0];
    } else {
      randomPath = this.IMAGES_GROUND[1];
    }
    this.loadImage(randomPath);
  }

  setBottleParameter(sectorMaxX, sectorMinX) {
    this.width = this.canvasWidth * 0.05;
    this.height = this.canvasHeight * 0.11;
    this.y = this.canvasHeight - this.height - this.floor;
    const availableWidth = sectorMaxX - sectorMinX - this.width;
    this.x = sectorMinX + Math.random() * availableWidth;
  }
}
