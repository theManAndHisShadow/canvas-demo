import { Point } from "./point.class";
import { Segment } from "./segment.class";
import { Graph } from "./graph.class";

import { drawRect, drawText } from "../../../misc/helpers";


/**
 * Helper class for managing custom events
 */
class SynteticEventTarget {
    constructor (){
        this.events = {};
    }

    
    /**
     * Adds event to target
     * @param {string} eventType - text name of custom event (move, rotate, create etc)
     * @param {Function} callback - handler if event is triggered
     */
    addEventListener(eventType, callback) {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }

        this.target = this;
        this.events[eventType].push(callback);
    }

    
    /**
     * Method that triggers event
     * @param {string} eventType - text name of custom event (move, rotate, create etc)
     * @param {object} data - some event data, passed into event handler scope
     */
    dispatchEvent(eventType, data) {
        if (this.events[eventType]) {
            this.events[eventType].forEach(callback => callback(data));
        }
    }
}



export class CartesianPlane extends SynteticEventTarget {
    #children = [];

    constructor({cx, cy, renderer, gridCellSize = 10, gridLineColor = 'black', gridLineThickness = 1, fillColor = 'white', axisColor = 'black'}){
        super();

        this.cx = cx;
        this.cy = cy;

        this.globalOffset = {
            x: 0,
            y: 0,
        };

        /**
         * n order not to draw the entire endless graph (yeah, like a computer could xD), 
         * we need to understand what part of the plane is visible at the moment
         */
        this.visibleArea = {
            x: [0, 0],
            y: [0, 0],
        }

        this.renderer = renderer;
        this.viewWidth = renderer.canvas.width;
        this.viewHeight = renderer.canvas.height;

        this.gridCellSize = gridCellSize;
        this.gridLineColor = gridLineColor;
        this.gridLineThickness = gridLineThickness;

        this.axisColor = axisColor;
        this.fillColor = fillColor;

        /**
         * We use subpixel shifting (e.g., translating by 0.5 pixels) to improve the rendering quality of thin lines 
         * and other graphical elements on canvas. This adjustment helps to align the graphics more precisely with 
         * the pixel grid, reducing blurriness and visual artifacts caused by anti-aliasing. 
         * Subpixel shifting can correct the display issues on high-resolution screens and ensure that lines 
         * and shapes appear sharper and more defined. 
         */
        this.subpixel = 0.5
    }


    /**
     * Moves plane using offset object
     * @param {object} offset - offset object {x, y}
     * @param {number} sensitivity - sensitivity of mouse movements
     */
    move(offset, sensitivity = 1){
        let xOffset = Math.round(offset.x * sensitivity);
        let yOffset = Math.round(offset.y * sensitivity);

        this.cx = this.cx + xOffset;
        this.cy = this.cy + yOffset;

        this.globalOffset.x = this.globalOffset.x + xOffset;
        this.globalOffset.y = this.globalOffset.y + yOffset;

        this.#children.forEach(item => {
            if(item instanceof Point) {
                item.x = item.x + xOffset;
                item.y = item.y + yOffset;
            } else if(item instanceof Segment){
                item.startPoint.x = item.startPoint.x + xOffset;
                item.startPoint.y = item.startPoint.y + yOffset;

                item.endPoint.x = item.endPoint.x + xOffset;
                item.endPoint.y = item.endPoint.y + yOffset;
            } else if(item instanceof Graph) {

            }
        });
    }


    /**
     * Moving plane to origin pos (centerX, centerY).
     */
    moveToOrigin(){
        this.cx = this.viewWidth / 2;
        this.cy = this.viewHeight / 2;

        this.#children.forEach(item => {
            if(item instanceof Point) {
                item.x = item.x - this.globalOffset.x;
                item.y = item.y - this.globalOffset.y;
            } else if(item instanceof Segment) {
                item.startPoint.x = item.startPoint.x - this.globalOffset.x;
                item.startPoint.y = item.startPoint.y - this.globalOffset.y;
                item.endPoint.x = item.endPoint.x - this.globalOffset.x;
                item.endPoint.y = item.endPoint.y - this.globalOffset.y;
            } else if(item instanceof Graph) {

            }
        });

         this.globalOffset = {
            x: 0, y: 0,
        };
    }


    /**
     * Draws a two axes
     */
    drawAxis(){
        this.renderer.strokeStyle = this.axisColor;
        this.renderer.lineWidth = 1;

        // X
        this.renderer.beginPath();
        this.renderer.moveTo(0, this.cy + this.subpixel);
        this.renderer.lineTo(this.viewWidth, this.cy + this.subpixel);
        this.renderer.stroke();

        // Y
        this.renderer.beginPath();
        this.renderer.moveTo(this.cx + this.subpixel, 0);
        this.renderer.lineTo(this.cx + this.subpixel, this.viewHeight);
        this.renderer.stroke();

        this.renderer.closePath();
    }
    

    /**
     * Draws a plane grid.
     */
    drawGrid(){
        // function basic values
        const width = this.viewWidth;
        const height = this.viewHeight;
        
        
        // color selected by user from class costructor
        const minorGridLineColor = this.gridLineColor;

        // rgba -> array
        const parsed = minorGridLineColor.split(', ')
                                         .map(item => {
                                             return Number(
                                                 item.replace(/(\(|\)|rgba|rgb)/gm, '')
                                             );
                                          });
        
        // increasing the color value of the major line                           
        const gain = 0.45;                              
        const modifined = parsed.map((item, i) => {
            return i == 3 && item <= 1 ? parsed[i] + gain : item;
        });

        // ready RGBA string
        const majorGridLineColor = 'rgba(' + modifined + ')';
        
        // thickness of grid line 
        this.renderer.lineWidth = this.gridLineThickness;

       // local helper function
       const drawPart = (start, type) => { 
            /**
             * N.B.: 
             * I did not use a custom helper function to avoid multiple calls to the context 
             * and not to worsen the already not excellent performance
            */

            // draw a major line
            this.renderer.beginPath();
            this.renderer.strokeStyle = majorGridLineColor;
        
            // vertical major line
            if (type === 'column') {
                let x = start + (this.gridCellSize * 2) + this.subpixel;
                this.renderer.moveTo(x, 0);
                this.renderer.lineTo(x, height);

            // horizontal line
            } else if (type === 'row') {
                let y = start + this.subpixel;
                this.renderer.moveTo(0, y);
                this.renderer.lineTo(width, y);
            }
        
            this.renderer.stroke();
            this.renderer.closePath();
        
            // draw a minor three lines 
            this.renderer.beginPath();
            this.renderer.strokeStyle = minorGridLineColor;
        
            for (let i = 3; i <= 5; i++) {
                if (type === 'column') {
                    let x = start + (this.gridCellSize * i) + this.subpixel;
                    this.renderer.moveTo(x, 0);
                    this.renderer.lineTo(x, height);
                } else if (type === 'row') {
                    let y = start + (this.gridCellSize * (i - 2)) + this.subpixel;
                    this.renderer.moveTo(0, y);
                    this.renderer.lineTo(width, y);
                }
            }
        
            this.renderer.stroke();
            this.renderer.closePath();
        };
        
        // axis scale number label font size
        const fontSize = 11;

        // minor step = this.gridCellSize
        // but each part contain 1 major laine + space + three minor lines
        const majorStep = this.gridCellSize * 4;
        
        /**
         * Every time the screen shifts by more than the width of a column or the height of a row (major step), 
         * the renderer takes into account the displacement and draws an additional section in advance, 
         * which is why we need to know what indentation is in the columns/rows now.
         */

        let originX = this.cx - (width / 2);
        let columnsOffset = Math.trunc(this.globalOffset.x / majorStep);

        // min and max x values
        let xMin = -1 - columnsOffset;
        let xMax = (width / majorStep) - columnsOffset;

        for (let i = xMin; i < xMax; i++) {
            // column start x pos
            let x = originX + (i * majorStep);
            let number = (i - 7) * 2;

            // draw a group of vertical lines - column
            // each column contains one major line ant three minor
            drawPart(x, 'column');

            // draw a text with number of axis scale
            drawText(this.renderer, {
                x: x + (majorStep / 2),
                y: this.cy -10,
                // hide '0' pos number label to x-axis
                // beacuse we already using '0' pos label from y-axis
                text: number == 0 ? '' : number,
                fontSize: fontSize,
            });

            // updating visibleArea value
            if(i == -1 - columnsOffset) this.visibleArea.x[0] = number + 2;
            if(i == xMax - 1) this.visibleArea.x[1] = number;
        }
        
        let originY = this.cy - (height / 2);
        let rowsOffset = Math.trunc(this.globalOffset.y / majorStep);

        // min and max y values
        let yMin = -1 - rowsOffset;
        let yMax = (height / majorStep) - rowsOffset + 1;

        for (let j = yMin; j < yMax; j++) {
            // row start y pos
            let y = originY + (j * majorStep);
            let number = (j - 5) * 2 * -1;

            // draw a group of horizontal lines - row
            // each row contains one major line ant three minor
            drawPart(y, 'row');

            // draw a text with number of axis scale
            drawText(this.renderer, {
                x: this.cx - 7,
                // different spacing to '0' pos number label and other numbers
                y: number == 0 ? y + 12 : y + 1,
                text: number,
                fontSize: fontSize,
                align: 'right',
            });

            // updating visibleArea value
            if(j == yMin) this.visibleArea.y[0] = number - 2;
            if(j == yMax - 1) this.visibleArea.y[1] = number;
        }
    }


    /**
     * Adds point to plane
     * @param {object} object - object with point params
     */
    add(newItemObject){
        newItemObject.renderer = this.renderer;

        // local helper function
        // Perhaps it makes sense to transfer it to base class methods?
        const transform = (object) => {
            object.planeX = object.x;
            object.planeY = object.y;
    
            // recalc the scale and center the coordinates of the point relative to the origin of the plane coordinates
            let x = this.cx + (object.x * (this.gridCellSize * 2)) + this.globalOffset.x + this.subpixel;
            let y = this.cy - (object.y * (this.gridCellSize * 2)) + this.globalOffset.y + this.subpixel;
    
            object.x = x;
            object.y = y;
        }

        if(newItemObject instanceof Point) {
            transform(newItemObject);
        } else if(newItemObject instanceof Segment) {
            newItemObject.startPoint.renderer = this.renderer;
            transform(newItemObject.startPoint);
            
            newItemObject.endPoint.renderer = this.renderer;
            transform(newItemObject.endPoint);

            newItemObject.parent = this;
        } else if(newItemObject instanceof Graph) {
            newItemObject.parent = this;
        }

        this.#children.push(newItemObject);
    }


    /**
     * Clear all plane content (except grid and axes).
     */
    clearContent(){
        this.#children = [];
        this.render();
    }


    /**
     * Fill plane bg with solid color
     */
    fill(){
        // fill bg
        drawRect(this.renderer, {
            x: 0,
            y: 0,
            width: this.viewWidth, 
            height: this.viewHeight,
            fillColor: this.fillColor,
        });
    }


    /**
     * Renders plane
     */
    render(){
        this.fill();
        this.drawGrid();
        this.drawAxis();

        if(this.#children.length > 0) {
            this.#children.forEach(item => {
                item.draw(); 
            });
        }

        this.dispatchEvent('redraw');
    }
}