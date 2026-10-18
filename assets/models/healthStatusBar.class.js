class HealthStatusBar extends DrawableObject {
  IMAGES = [
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];
  imagesArray = [];
  percentage = 100;
  constructor(worldInstance) {
    super();
    this.y = -30;
    this.width = 300;
    this.height = 100;
    this.world = worldInstance;
    this.setImagesArray(this.IMAGES);
    this.setHealthPrecentage(this.world.character.health)
  }
  setImagesArray(paths) {
    paths.forEach((path) => {
      this.imagesArray.push(this.createImage(path));
    });
  }
  setHealthPrecentage(percentage) {
      if (percentage > 80) {
        this.img = this.imagesArray[5];
      } else if (percentage > 60) {
        this.img = this.imagesArray[4];
      } else if (percentage > 40) {
        this.img = this.imagesArray[3];
      } else if (percentage > 20) {
        this.img = this.imagesArray[2];
      } else if (percentage > 0) {
        this.img = this.imagesArray[1];
      } else{
        this.img = this.imagesArray[0];
      }
  }
}
