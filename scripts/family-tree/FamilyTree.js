import { NameTag } from './NameTag.js';
import { Generation } from './Generation.js';

var c = document.getElementById("family_tree_canvas");
var ctx = c.getContext("2d");


const canvas_height = 50;
const canvas_width = 700;
const vmid = canvas_height / 2;
const hmid = canvas_width / 2;


class FamilyTree {

    constructor() {
        this.generations = []; //Generation list
        this.gen = new Generation();
        this.Canvas_Details = {
            'height': 800,
            'width': 700
        }
    }

    draw() {
        /**
         * ctx, name, width, height, canvasdetails, positionx, positiony
         */
        const a = new NameTag(ctx, `1-miteydrill`, 150, 150, this.Canvas_Details, 700/1.48, 280);
        const b = new NameTag(ctx, `2-miteydrill`, 150, 150, this.Canvas_Details, 700/2 - 75, 150/2);

        this.connectBits(a, b);
    }

    /**
     * Connects 2 bits
     * 
     * @param {NameTag} bit1 
     * @param {NameTag} bit2 
     */
    connectBits(tag1, tag2){
        console.log(tag1);
        console.log(tag2);
        ctx.beginPath();
        ctx.moveTo(tag1.bitPositionY(), tag1.bitPositionX());
        ctx.lineTo(tag2.bitPositionY(), tag2.bitPositionX());
        ctx.stroke();
    }
}

var tree = new FamilyTree();

tree.draw();

console.log('Family Tree Loaded');