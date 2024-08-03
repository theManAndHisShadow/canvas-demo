let simpleFunctionGraphs = new Scene({
    title: 'Simple funсion graphs', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Empty'
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
            gridCellSize: 10,
            gridLineColor: 'rgba(55, 55, 55, 0.35)',
            gridLineThickness: 1,
            axisColor: 'white',
            fillColor: 'black',
        });

        field.render();

        // clearing prev created animation threads
        window.runningAnimations.clearQueue();

        let mouseIsDown = false;
        let mouseIsUp = true;

        let downPos = false;
        let deltaPos = {x: 0, y: 0}

        canvas.addEventListener('mousemove', (event) => {
            if(mouseIsDown) {
                let localPos = getMousePos(canvas, event);

                deltaPos = {
                    x: (downPos.x - localPos.x) * -1,
                    y: (downPos.y - localPos.y) * -1,
                }
                field.move(deltaPos, 0.05);
                field.render();
            }
        })

        canvas.addEventListener('mousedown', (event) => {
            mouseIsUp = false;
            mouseIsDown = true;

            let localPos = getMousePos(canvas, event);

            downPos = {
                x: localPos.x,
                y: localPos.y,
            }

            // update cursor style
            canvas.style.cursor = 'move'
        });

        canvas.addEventListener('mouseup', (event) => {
            mouseIsDown = false;
            mouseIsUp = true;

            // update cursor style
            canvas.style.cursor = 'inherit';
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
        this.cx = this.cx + (offset.x * sensitivity);
        this.cy = this.cy + (offset.y * sensitivity);
    }


    /**
     * Draws a text at canvas. Just wrapper for default canvas methods.
     * @param {Number} param.x - text x pos
     * @param {Number} param.y - text y pos
     * @param {string} param.text - text
     * @param {string} param.fontFamily - text font family
     * @param {string} param.fontSize - text font size
     * @param {string} param.fontWeight - text font weight
     * @param {string} param.align - text align (left, center, right)
     * @param {string} param.baseline - text baseline
     */
    drawText({x, y, text, color ='white', fontFamily = 'Arial', fontSize = '12px', fontWeight = '', align = 'center', baseline = 'middle'}){
        this.renderer.fillStyle = color;
        this.renderer.font = `${fontWeight} ${fontSize} ${fontFamily}`; 
        this.renderer.textAlign = align;
        this.renderer.textBaseline = baseline;

        this.renderer.fillText(text, x, y);
    }


    /**
     * Draws scale elements on axes (numbers and little lines)
     */
    drawAxisPointMarks(){
        this.renderer.strokeStyle = 'red' || this.axisColor;
        this.renderer.lineWidth = 1;

        let markLineWidth = 4;

        // y-axis markers
        this.renderer.beginPath();
        for(let i = this.viewHeight - (this.gridCellSize*2), n = -1; i > 0; i -= this.gridCellSize * 4, n++) {
            let correctionY = this.cy - (this.viewHeight / 2);
            let y = correctionY + i - (this.subpixel + this.gridCellSize * 2) + 1;

            this.drawText({
                x: this.cx - (markLineWidth / 2) - 5,
                y: n - 3 == 0 ? y + 11 : y,
                text: n - 3,
                color: 'red',
            });

            this.renderer.moveTo(this.cx - (markLineWidth / 2), y);
            this.renderer.lineTo(this.cx + (markLineWidth / 2) + 2, y);
        }
        this.renderer.stroke();

        // x-axis markers
        this.renderer.strokeStyle = 'cyan' || this.axisColor;
        this.renderer.beginPath();
        for(let j = this.viewWidth - (this.gridCellSize * 2), n = -1; j > 0; j -= this.gridCellSize * 4, n++) {
            let correctionX = (this.cx - (this.viewWidth / 2));
            let x = correctionX + j + this.subpixel;

            this.drawText({
                x: x,
                y: this.cy + (markLineWidth / 2) + 10,
                text: n - 6 == 0 ? '' : (n - 6) * -1,
                color: 'cyan',
            });
            
            this.renderer.moveTo(x, this.cy - (markLineWidth / 2));
            this.renderer.lineTo(x, this.cy + (markLineWidth / 2));
        }
        this.renderer.stroke();

        this.renderer.closePath();

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
     * Draws a field grid
     */
    drawGrid() {
        const width = this.viewWidth;
        const height = this.viewHeight;
        this.renderer.strokeStyle = this.gridLineColor;
        this.renderer.lineWidth = this.gridLineThickness;


        /**
         * I did not use a custom helper function to avoid multiple calls to the context 
         * and not to worsen the already not excellent performance
         */
        this.renderer.beginPath();
    
        // Only draw lines that are within the visible area
        const startX = Math.floor((this.cx % this.gridCellSize) - this.gridCellSize);
        const startY = Math.floor((this.cy % this.gridCellSize) - this.gridCellSize);
    
        for (let x = startX; x < width; x += this.gridCellSize) {
            this.renderer.moveTo(x + this.subpixel, 0);
            this.renderer.lineTo(x + this.subpixel, height);
        }
    
        for (let y = startY; y < height; y += this.gridCellSize) {
            this.renderer.moveTo(0, y + this.subpixel);
            this.renderer.lineTo(width, y + this.subpixel);
        }
    
        this.renderer.closePath();
        this.renderer.stroke();
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
        this.drawAxisPointMarks();
    }
}