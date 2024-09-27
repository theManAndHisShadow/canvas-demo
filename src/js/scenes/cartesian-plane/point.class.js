import { PlanePrimitive } from "./primitive.class.js";

/**
 * Point element class.
 */
export class Point extends PlanePrimitive {
    /**
     * 
     * @param {string} label - label of point
     * @param {number} x - x pos of point
     * @param {number} y - y pos of point
     * @param {string} color - color of point
     * @param {string} labelColor - color of text label
     */
    constructor(label, x, y, color, labelColor = 'white'){
        super();

        // The difference between property a and property b is that this property contains 
        // the initially transmitted coordinates that correspond to the graphic grid.
        // x -> processing some calculations: 
        //       -> x (mutated x)
        //       -> planeX (original x)
        this.x = x;
        this.y = y;
        this.planeX = null;
        this.planeY = null;

        // styles
        this.color = color;
        this.label = label;
        this.labelColor = labelColor;
    }


    /**
     * Draws a point to target renderer context.
     */
    draw(){
        if(this.label && this.label.length > 0) {
            // draw text label
            drawText(this.renderer, {
                x: this.x + 7,
                y: this.y -  7,
                text: this.label,
                color: this.labelColor,
            });
        }

        // draw point
        drawCircle(this.renderer, {
            cx: this.x,
            cy: this.y,
            fillColor: this.color,
            borderColor: this.color,
            r: 2,
        });
    }
}