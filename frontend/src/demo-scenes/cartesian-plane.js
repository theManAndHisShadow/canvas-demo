let cartesianPlane = new Scene({
    title: 'Cartesian plane demo', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Empty'
        },

        'centerViewAction': {
            type: 'button',
            text: 'reset',
            label: 'Center view',
        },

        'selectedPreset': {
            type: 'option-selector',
            label: 'Choose preset',
            optionNames: [
                'Points 1', 
                'Points 2'
            ],
            defaultValue: 0,
        },
    },

    code: (root, display, settings) => {
        // reset the element state to remove all previously applied event handlers
        let canvas = resetElement(root.querySelector('canvas'));
        
        // basic canvas values
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        const plane = new CartesianPlane({
            renderer: context,
            cx: width / 2,
            cy: height / 2,

            gridCellSize: 10,
            gridLineColor: 'rgba(35, 35, 35, 0.35)',
            gridLineThickness: 1,
            axisColor: 'white',
            fillColor: 'black',
        });

        plane.render();

        // clearing prev created animation threads
        window.runningAnimations.clearQueue();

        // very important scene var
        let mouseIsDown = false;

        /**
         * We use a separate variable to remember the place where the user pressed the left mouse button, 
         * this will be the starting position of the moving process. When user releases the mouse button we store 'mouseUp' pos
         * and recalculate delta of 'start' and 'stop' position.
         */
        let downPos = { x: 0, y: 0 };
        let deltaPos = { x: 0, y: 0 };
        
        // All redraw and move actions only at 'mouseIsDown' == true and when mouse is moving
        canvas.addEventListener('mousemove', (event) => {
            if (mouseIsDown) {
                let localPos = getMousePos(canvas, event);
        
                deltaPos = {
                    x: localPos.x - downPos.x,
                    y: localPos.y - downPos.y
                };
        
                downPos = localPos;
        
                // move using delta
                plane.move(deltaPos, 1);

                // redraw 
                plane.render();
            }
        });
        
        // Check is mouse clicked
        canvas.addEventListener('mousedown', (event) => {
            // set important value as true
            mouseIsDown = true;
        
            let localPos = getMousePos(canvas, event);
            
            // update scene-global var
            downPos = {
                x: localPos.x,
                y: localPos.y
            };
            
            // update cursor style
            canvas.style.cursor = 'grab';
            setTimeout(() => {
                canvas.style.cursor = 'grabbing';
            }, 120);
        });
        
        // if the user releases the mouse button
        canvas.addEventListener('mouseup', () => {
            // set important var as false
            mouseIsDown = false;
        
            // Update cursor style
            canvas.style.cursor = 'inherit';
        });

        settings.subscribe((propertyName, newValue, oldValue) => {
            if(propertyName == 'centerViewAction') {
                // reset pos
                plane.moveToOrigin();

                // redraw all
                plane.render();
            }

            if(propertyName == 'selectedPreset') {
                // reset pos
                plane.moveToOrigin();

                // remove all other elements
                plane.clearContent();

                // remove all display elements that generated dynamiclly
                display.removeDynamicllyRendered();

                if(newValue == 0) {
                    // some points set 1
                    let points1 = [
                        new Point(0, 0, 'yellow', 'O'),
            
                        new Point(2, 2, 'crimson', 'A'),
                        new Point(2, -2, 'lime', 'B'),
                        new Point(-2, 2, 'cyan', 'C'),
                        new Point(-2, -2, 'magenta', 'D'),
                    ];

                    points1.forEach(point => {
                        plane.addPoint(point);

                        display.dynamicRender(`point${point.label}`, {
                            type: 'display',
                            label: `- point ${point.label}`,
                            text: `(${point.planeX}, ${point.planeY})`,
                        });
                    });
            
                } else if(newValue == 1) {
                    // some points set 2
                    let points2 = [
                        new Point(0, 0, 'yellow', 'O'),

                        new Point(1, 1, 'red', 'A'),
                        new Point(2, 2, 'lime', 'B'),
                        new Point(3, 3, 'cyan', 'C'),
                        new Point(4, 4, 'magenta', 'D'),
                    ];

                    points2.forEach(point => {
                        plane.addPoint(point);

                        display.dynamicRender(`point${point.label}`, {
                            type: 'display',
                            label: `- point ${point.label}`,
                            text: `(${point.planeX}, ${point.planeY})`,
                        });
                    });
                }

                plane.render();
            }
        });


        // Some trick to set first (index 0) preset as default preset
        settings.setState('selectedPreset', 0);
    }
});


// Exproting scene
window.exportedObjects.push(cartesianPlane);

/**
* Scene file internal helper function defenitions
*/



/**
 * Base class for rendering. Contains the basis for the structure of other classes.
 */
class PlanePrimitive {
    constructor(x, y, color, label){
        // position

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
    }
}



/**
 * Point element class.
 */
class Point extends PlanePrimitive{
    constructor(x, y, color, label){
        super(x, y, color, label);

        // N.B.: This property is null until it is manually configured during 'the add to context' step.
        this.renderer = null;
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



class CartesianPlane {
    #children = [];

    constructor({cx, cy, renderer, gridCellSize = 10, gridLineColor = 'black', gridLineThickness = 1, fillColor = 'white', axisColor = 'black'}){
        this.cx = cx;
        this.cy = cy;

        this.globalOffset = {
            x: 0,
            y: 0,
        };

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
           item.x = item.x + xOffset;
           item.y = item.y + yOffset;
        });
    }


    /**
     * Moving plane to origin pos (centerX, centerY).
     */
    moveToOrigin(){
        this.cx = this.viewWidth / 2;
        this.cy = this.viewHeight / 2;

        this.#children.forEach(item => {
            item.x = item.x - this.globalOffset.x;
            item.y = item.y - this.globalOffset.y;
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
        for (let i = -1 - columnsOffset; i < (width / majorStep) - columnsOffset; i++) {
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
        }
        
        let originY = this.cy - (height / 2);
        let rowsOffset = Math.trunc(this.globalOffset.y / majorStep);
        for (let j = -1 - rowsOffset; j < (height / majorStep) - rowsOffset + 1; j++) {
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
        }
    }


    /**
     * Adds point to plane
     * @param {object} pointObject - object with point params
     */
    addPoint(pointObject){
        pointObject.renderer = this.renderer;
        pointObject.planeX = pointObject.x;
        pointObject.planeY = pointObject.y;

        // recalc the scale and center the coordinates of the point relative to the origin of the plane coordinates
        let x = this.cx + (pointObject.x * (this.gridCellSize * 2)) + this.globalOffset.x + this.subpixel;
        let y = this.cy - (pointObject.y * (this.gridCellSize * 2)) + this.globalOffset.y + this.subpixel;

        pointObject.x = x;
        pointObject.y = y;

        this.#children.push(pointObject);
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
    }
}