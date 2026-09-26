class Bottle extends MovableObject {
    width;
    height;
    constructor(x) {
        super()
        this.width = 60
        this.height = 60
        this.x = x
        this.y = 360
        let randomNumber = Math.round(Math.random()) + 1;
        this.loadimage(`assets/img/6_salsa_bottle/${randomNumber}_salsa_bottle_on_ground.png`)
    }
}