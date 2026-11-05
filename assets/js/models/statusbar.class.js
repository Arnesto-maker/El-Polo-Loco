class StatusBar extends DrawableObject {
  IMAGES_HEALTH = [
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  ICON_BOTTLE = "assets/img/7_statusbars/3_icons/icon_salsa_bottle.png";
  ICON_COIN = "assets/img/7_statusbars/3_icons/icon_coin.png";

  constructor(canvas) {
    super(canvas);
    this.initLoadImages();
    this.setMainParameter();
    this.loadInitialValue();
    this.updateHealthImage();
  }

  initLoadImages() {
    this.loadImages(this.IMAGES_HEALTH);
    this.loadImages([this.ICON_BOTTLE, this.ICON_COIN]);
  }

  loadInitialValue() {
    this.health = 100;
    this.bottleCount = 0;
    this.coinCount = 0;
    this.score = 0;
  }

  setMainParameter() {
    this.x = this.canvasWidth * 0.01;
    this.y = this.canvasHeight * 0.11;
    this.width = this.canvasWidth * 0.2;
    this.height = this.canvasHeight * 0.1;
  }

  updateHealthImage() {
    let index = this.setHealthIndex(this.health);
    const path = this.IMAGES_HEALTH[index];
    this.img = this.imageCache[path];
  }

  setHealthIndex(health) {
    if (health >= 100) {
      return 5;
    } else if (health >= 80) {
      return 4;
    } else if (health >= 60) {
      return 3;
    } else if (health >= 40) {
      return 2;
    } else if (health >= 20) {
      return 1;
    } else {
      return 0;
    }
  }

  formatCount(value) {
    if (value < 10) {
      return "0" + value;
    }
    return String(value);
  }

  drawHealthBar(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  setFontStyling(ctx) {
    const fontSize = Math.floor(this.canvasHeight * 0.031);
    ctx.font = ` ${fontSize}px PolloFont`;
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.textBaseline = "middle";
  }

  drawBottleGroup(ctx) {
    const row2Y = this.y + this.height + this.canvasHeight * 0.01;
    const iconSize = this.height * 0.85;
    const textCenterY = row2Y + iconSize / 2;
    const bottleIcon = this.imageCache[this.ICON_BOTTLE];
    ctx.drawImage(bottleIcon, this.x, row2Y, iconSize, iconSize);
    const bottleText = this.formatCount(this.bottleCount);
    const bottleTextX = this.x + iconSize + 6;
    ctx.strokeText(bottleText, bottleTextX, textCenterY);
    ctx.fillText(bottleText, bottleTextX, textCenterY);
  }

  drawCoinGroup(ctx) {
    const row2Y = this.y + this.height + this.canvasHeight * 0.01;
    const iconSize = this.height * 0.85;
    const textCenterY = row2Y + iconSize / 2;
    const coinGroupX = this.x + this.width * 0.55;
    const coinIcon = this.imageCache[this.ICON_COIN];
    ctx.drawImage(coinIcon, coinGroupX, row2Y, iconSize, iconSize);
    const coinText = this.formatCount(this.coinCount);
    const coinTextX = coinGroupX + iconSize + 6;
    ctx.strokeText(coinText, coinTextX, textCenterY);
    ctx.fillText(coinText, coinTextX, textCenterY);
  }

  drawScoringGroup(ctx) {
    const row2Y = this.y + this.height + this.canvasHeight * 0.01;
    const iconSize = this.height * 0.85;
    const row3Y = row2Y + iconSize + this.canvasHeight * 0.028;
    const scoreText = "Score: " + this.score;
    ctx.strokeText(scoreText, this.x + 50, row3Y);
    ctx.fillText(scoreText, this.x + 50, row3Y);
  }

  draw(ctx) {
    ctx.save();
    this.drawHealthBar(ctx)
    this.setFontStyling(ctx);
    this.drawBottleGroup(ctx);
    this.drawCoinGroup(ctx);
    this.drawScoringGroup(ctx);
    ctx.restore();
  }
}
