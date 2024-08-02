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

        // clearing prev created animation threads
        window.runningAnimations.clearQueue();

        const loop = () => {
            context.clearRect(
                0, 0,
                width,
                height
            );

            /**
             * TODO: add more flexibility to grid generation with diff cel sizes
             */
            drawCartesianGrid(context, {
                fillColor: 'black',
                axisColor: 'white',
                gridLinesColor: 'rgba(165, 165, 165, 0.002)',
            });
        }

        // animate
        window.runningAnimations.add(loop);
    }
});


// Exproting scene
window.exportedObjects.push(simpleFunctionGraphs);

/**
* Scene file internal helper function defenitions
*/

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {Number} param.cellSize - cies of gred cell
 * @param {string} param.fillColor - color of background
 * @param {string} param.axisColor - color of x and y axis
 * @param {string} param.gridLinesColor - color of grid lines
 */
function drawCartesianGrid(context, {cellSize = 12, fillColor = 'white', axisColor = 'black', gridLinesColor = 'rgba(0, 0, 0, 0.009)'}){
    // canvas width and height
    const width = context.canvas.width;
    const height = context.canvas.height;

    // center of canvas
    const centerX = width / 2;
    const centerY = height / 2;

    // offset of y axis
    const yOffset = 136;

    /**
     * We use subpixel shifting (e.g., translating by 0.5 pixels) to improve the rendering quality of thin lines 
     * and other graphical elements on canvas. This adjustment helps to align the graphics more precisely with 
     * the pixel grid, reducing blurriness and visual artifacts caused by anti-aliasing. 
     * Subpixel shifting can correct the display issues on high-resolution screens and ensure that lines 
     * and shapes appear sharper and more defined. 
     */
    const subpixel = 0.5;

    // fill bg
    drawRect(context, {
        x: 0, y: 0,
        width: width, height: height,
        fillColor: fillColor,
    });

    // draw basic grid
    drawGrid(context, {
        cellSize: cellSize,
        lineThickness:1,
        lineColor: gridLinesColor,
    });

    // draw y axis
    drawLine(context, {
        x1: 0,
        y1: centerY + yOffset + subpixel,
        x2: width,
        y2: centerY + yOffset + subpixel,
        thickness: 1,
        color: axisColor,
    });

    // draw x axis
    drawLine(context, {
        x1: centerX + subpixel,
        y1: 0,
        x2: centerX + subpixel,
        y2: height,
        thickness: 1,
        axisColor: 'black',
    });

    // width of axis point marker (a line near number)
    let axisMarksWidth = 4;

    // some setting of text
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '11px Arial';

    // draw y axis markers and number labels for points
    for(let y = 0, i = cellSize + 2; y < height; y += (cellSize * 4), i -= 2){
        drawLine(context, {
            x1: centerX - (axisMarksWidth / 2), 
            y1: y + subpixel,
            x2: centerX + (axisMarksWidth / 2) + 1, 
            y2: y + subpixel,
            color: axisColor,
            thickness: 1,
        });

        context.fillText(i, centerX - 12, i == 0 ? y + 12 : y + 1);
    }

    // draw x axis markers and number labels for points
    for(let x = 0, i = cellSize; x < width; x += (cellSize * 4), i -= 2){
        drawLine(context, {
            x1: x + cellSize + subpixel, 
            y1: centerY + yOffset - (axisMarksWidth / 2),
            x2: x + cellSize + subpixel, 
            y2: centerY + yOffset + (axisMarksWidth / 2) + 1,
            color: axisColor,
            thickness: 1,
        });

        // ignoring zero point label, beacuse we already use y axis zero point label
        if(i !== 0) context.fillText(i, x + cellSize, centerY + yOffset + 12);
    }
}