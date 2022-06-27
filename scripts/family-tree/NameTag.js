import { Bit } from './Bit.js';

class NameTag {
    /**
     * 
     * @param {ctx} ctx the ctx
     * @param {string} name 
     * @param {number} width box width
     * @param {number} height box height
     * @param {object} Canvas_Details 
     */
    constructor(ctx, name = "null", width = 120, height = 120, Canvas_Details, positionX = 300, positionY = 300) {

        this.width = width;
        this.height = height;

        this.canvasHeight = Canvas_Details.height;
        this.canvasWidth = Canvas_Details.width;

        this.ctx = ctx;

        this.name = name;

        this.xpos = positionX;
        this.ypos = positionY;

        this.bit = new Bit(ctx);
        this.bit.setPositions(this.xpos, this.ypos);

        this.draw(this.height, this.width);
    }

    draw(height = 80, width = 50) {

        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle= 'red';
        this.ctx.stroke();

        //draws
        this.ctx.fillRect(
            this.xpos,
            this.ypos,
            this.width,
            this.height
        );

        this.drawName();

        //update current position

        //update bit position
        this.drawBit(this.xpos + this.width/2, this.ypos + this.height)
    }

    //updates and draws bit
    drawBit(x, y) {
        console.log(this.bit);
        this.bit.setPositions(x, y);
        this.bit.draw();
    }

    bitPositionX(){
        return this.bit.yPos();
    }
    bitPositionY(){
        return this.bit.xPos();
    }

    drawName() {
        this.ctx.font = "30px arial";
        this.ctx.textAlign = 'start';
        // this.ctx.fillColor = 'white';
        this.ctx.fillText(
            this.name,
            this.xpos,
            this.ypos - 10
        );
    }

    //draws current NameTag Stats
    drawStats() {
        const txt =
            `
        ${this.width}: Width
        ${this.height}: Height
        `;
        this.ctx.fillText(
            txt,
            90,
            90
        )
    }

    xPos(){
        return this.xpos;
    }
    yPos(){
        return this.ypos;
    }
}

export { NameTag };