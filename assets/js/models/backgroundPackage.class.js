class BackgroundPackage {
  constructor(canvas) {
    const patrolDistance = canvas.width - 1400;
    const frame2 = canvas.width;
    this.clouds = [
      new Cloud(canvas, -200, -200, 900, 1.5),
      new Cloud(canvas, 450, -450 - patrolDistance, 450, -1.5),
      new Cloud(canvas, 900, 900, 900 + patrolDistance, 1.5),
      new Cloud(
        canvas,
        frame2 - 200,
        frame2 - 200,
        frame2 - 200 + patrolDistance,
        1.5,
      ),
      new Cloud(
        canvas,
        frame2 + 450,
        frame2 + 450 - patrolDistance,
        frame2 + 450,
        -1.5,
      ),
      new Cloud(
        canvas,
        frame2 + 900,
        frame2 + 900,
        frame2 + 900 + patrolDistance,
        1.5,
      ),
    ];
    this.backgroundObjects = [
      new Background(
        canvas,
        "assets/img/5_background/layers/air.png",
        0,
        0,
        canvas.width,
        canvas.height,
      ),
      new Background(
        canvas,
        "assets/img/5_background/layers/3_third_layer/1.png",
        0,
        0,
        canvas.width,
        canvas.height,
      ),
      new Background(
        canvas,
        "assets/img/5_background/layers/2_second_layer/1.png",
        0,
        0,
        canvas.width,
        canvas.height,
      ),
      new Background(
        canvas,
        "assets/img/5_background/layers/1_first_layer/1.png",
        0,
        0,
        canvas.width,
        canvas.height,
      ),
      new Background(
        canvas,
        "assets/img/5_background/layers/air.png",
        canvas.width,
        0,
        canvas.width,
        canvas.height,
      ),
      new Background(
        canvas,
        "assets/img/5_background/layers/3_third_layer/2.png",
        canvas.width,
        0,
        canvas.width,
        canvas.height,
      ),
      new Background(
        canvas,
        "assets/img/5_background/layers/2_second_layer/2.png",
        canvas.width,
        0,
        canvas.width,
        canvas.height,
      ),
      new Background(
        canvas,
        "assets/img/5_background/layers/1_first_layer/2.png",
        canvas.width,
        0,
        canvas.width,
        canvas.height,
      ),
    ];
  }
  getBgPackage() {
    let bgComponentsFrames = [];
    this.backgroundObjects.forEach((bg) => {
      bgComponentsFrames.push(bg);
    });
    this.clouds.forEach((cloud) => {
      bgComponentsFrames.push(cloud);
    });
    return bgComponentsFrames;
  }
}
