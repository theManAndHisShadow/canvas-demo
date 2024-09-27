import { PlanePrimitive } from "./primitive.class.js";
import { Point } from "./point.class.js";

/**
 * Segment element class.
 */
export class Segment extends PlanePrimitive {
    /**
     * 
     * @param {array} startPoint - ['label', x, y]
     * @param {array} endPoint - ['label', x, y]
     * @param {string} color - color of segment line
     * @param {number} thickness - thickness of segment line
     */
    constructor(startPoint, endPoint, color, thickness = 2){
        super();
        
        this.startPoint = new Point(startPoint[0], startPoint[1], startPoint[2], color);
        this.endPoint = new Point(endPoint[0], endPoint[1], endPoint[2], color);

        this.color = color;
        this.thickness = thickness;
        this.length = getDistanseBetweenTwoPoint(startPoint[1], startPoint[2], endPoint[1], endPoint[2]);
    }


    /**
     * Draws a segment to context.
     */
    draw(){
        drawLine(this.renderer, {
            x1: this.startPoint.x,
            y1: this.startPoint.y,

            x2: this.endPoint.x,
            y2: this.endPoint.y,

            thickness: this.thickness,
            color: this.startPoint.color,
        });

        this.startPoint.draw();
        this.endPoint.draw();
        
    }
}
