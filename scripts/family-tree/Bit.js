class Bit {
    constructor(ctx) {
        this.ctx = ctx;

        this.x = 0;
        this.y = 0;

        this.radius = 8;
    }

    setPositions(x, y) {
        this.x = x;
        this.y = y;
    }

    xPos() {
        return this.x;
    }
    yPos() {
        return this.y;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}

export { Bit };