let simpleFunctionGraphs = new Scene({
    title: 'Simple funсion graphs', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Empty'
        },

        'originCenter': {
            type: 'display',
            label: 'Center position',
        },

        'centerViewAction': {
            type: 'button',
            text: 'reset',
            label: 'Center view',
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

        const field = new CartesianField({
            renderer: context,
            cx: width / 2,
            cy: height / 2,

            // check grid cell size bug when value is not 10
            gridCellSize: 10,
            gridLineColor: 'rgba(35, 35, 35, 0.35)',
            gridLineThickness: 1,
            axisColor: 'white',
            fillColor: 'black',
        });

        field.render();

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
                field.move(deltaPos, 1);

                // redraw 
                field.render();

                // show some info
                display.updateValue('originCenter', `{x: ${field.globalOffset.x}, y: ${field.globalOffset.y}}`);
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
                field.moveToOrigin();
                
                // update some info display
                display.updateValue('originCenter', `{x: ${field.globalOffset.x}, y: ${field.globalOffset.y}}`);

                // redraw all
                field.render();
            }
        });
    }
});


// Exproting scene
window.exportedObjects.push(simpleFunctionGraphs);

/**
* Scene file internal helper function defenitions
*/


class CartesianField {
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
     * Moves field using offset object
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
    }


    /**
     * Draws a text at canvas. Just wrapper for default canvas methods.
     * @param {Number} param.x - text x pos
     * @param {Number} param.y - text y pos
     * @param {string} param.text - text
     * @param {string} param.fontFamily - text font family
     * @param {number} param.fontSize - text font size
     * @param {string} param.fontWeight - text font weight
     * @param {string} param.align - text align (left, center, right)
     * @param {string} param.baseline - text baseline
     */
    drawText({x, y, text, color ='white', fontFamily = 'Arial', fontSize = 12, fontWeight = '', align = 'center', baseline = 'middle'}){
        this.renderer.fillStyle = color;
        this.renderer.font = `${fontWeight} ${fontSize}px ${fontFamily}`; 
        this.renderer.textAlign = align;
        this.renderer.textBaseline = baseline;

        this.renderer.fillText(text, x, y);
    }


    /**
     * Moving field to origin pos (centerX, centerY).
     */
    moveToOrigin(){
        this.cx = this.viewWidth / 2;
        this.cy = this.viewHeight / 2;

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
     * Draws a field grid.
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
            this.drawText({
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
            this.drawText({
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
     * Fill field bg with solid color
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
     * Renders field
     */
    render(){
        this.fill();
        this.drawGrid();
        this.drawAxis();
    }
}