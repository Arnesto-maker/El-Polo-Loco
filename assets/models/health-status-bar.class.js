class HealthStatusBar extends DrawableObject {
  world;
  constructor(worldInstance) {
    super();
    this.y = -30;
    this.width = 300;
    this.height = 100;
    this.world = worldInstance;
    this.loadimage(
      "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
    );
  }
}
