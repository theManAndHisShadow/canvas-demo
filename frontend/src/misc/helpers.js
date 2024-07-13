/**
 * Helper functions that are accessible globally from any part of the project
 */


/**
 * Returns last item of array
 * @param {array} array - target array
 * @returns {any} - last item
 */
function getArrayLast(array){
    return array[array.length - 1];
}


/**
 * Returns object full deep clone
 * @param {object} targetObject - target object
 * @returns {object} - clone of target object
 */
function deepClone(targetObject){
    /**
     * N.B.: In some cases, the cloning process may be interrupted due to a “circular reference error”
     */
    return JSON.parse(JSON.stringify(targetObject));
}



/**
 * Returns real mouse position (above canvas, for example)
 * @param {HTMLCanvasElement} canvas - referance to target canvas
 * @param {MouseEvent} event - mousemove or mouseover event objects
 * @returns {{x: number, y: number}} - object of mouse position
 */
function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}



/**
 * Draws a line from point A (x1, y1) to point B (x2, y2)
 * @param {Object} param
 * @param {number} param.x1 - position at x axis of start point (A)
 * @param {number} param.y1 - position at y axis of start point (A)
 * @param {number} param.x2 - position at x axis of start point (B)
 * @param {number} param.y2 - position at y axis of start point (B)
 * @param {number} param.thickness  - thickness of line
 * @param {string} param.color  - color of line
 */
function drawLine (context, {x1, y1, x2, y2, thickness, color} = {}){
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = thickness;

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();

    context.stroke();
    context.fill();
}



/**
 * Draws a rectangle
 * @param {Object} param
 * @param {number} param.x - position at x axis
 * @param {number} param.y - position at y axis
 * @param {number} param.width - width of rect
 * @param {number} param.height - height of rect
 * @param {string} param.fillColor - color of rect
 */
function drawRect (context, {x, y, width, height, fillColor}){
    context.fillStyle = fillColor;
    context.fillRect(x, y, width, height);
}



/**
 * Returns angle between two points
 * @param {number} ax - first point x pos
 * @param {number} ay - first point y pos
 * @param {number} bx - second point x pos
 * @param {number} by - second point y pos
 * @returns {number} - angle between two points
 */
function getAngleBetweenTwoPoints(ax, ay, bx, by) {
    let dy = by - ay;
    let dx = bx - ax;
    let theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;

    return theta;
}


/**
 * Returns a distance value between two points
 * @param {number} ax - first point x pos
 * @param {number} ay - first point y pos
 * @param {number} bx - second point x pos
 * @param {number} by - second point y pos
 * @returns {number} - distance value
 */
function getDistanseBetweenTwoPoint(ax, ay, bx, by){
    // first short side of triangle
    let a = ax - bx;

    // second short side of triangle
    let b = ay - by;
    
    // if we know the two sides of a triangle, we can also calculate the long side - the hypotenuse
    let hypotenuse = Math.sqrt((a * a) + (b * b));

    return hypotenuse;
}



/**
 * Draws a circle 
 * @param {CanvasRenderingContext2D} context - canvas 2d context
 * @param {number} param.cx - circle center point pos at x axis
 * @param {number} param.cy - circle center point pos at y axis
 * @param {number} param.r - circle radius
 * @param {number} param.borderThickness - circle border line thickness
 * @param {string} param.borderColor - circle border line color
 * @param {string} param.fillColor - circle inner fill color
 */
function drawCircle(context, {cx, cy, r, fillColor, borderThickness, borderColor}){
    context.lineWidth = borderThickness;

    context.beginPath();
    context.arc(cx, cy, r, 0, 2 * Math.PI, false);
    context.fillStyle = fillColor;
    context.fill();
    context.lineWidth = borderThickness;
    context.strokeStyle = borderColor
    context.closePath();
    context.stroke();
}



/**
 * Draws a mesh based on user-specified conditions.
 * @param {CanvasRenderingContext2D} context - 2d context of canvas
 * @param {number} param.cellSize - size of grid cell
 * @param {number} param.lineThickness - thickness of grid line
 * @param {string} param.lineColor - color of grid line
 */
function drawGrid(context, {cellSize, lineThickness, lineColor}){
    const width = context.canvas.width;
    const height = context.canvas.height;
    const columns = width / cellSize;
    const rows = height / cellSize;
    const offset = 0.5;

    context.lineWidth = lineThickness;
    context.lineColor = lineColor;
    

    // Drawning grid using two loops 
    // - one for vertical lines
    // - one for horizontal
    for(let i = 0; i <= rows; i++) {
        for(let j = 0; j <= columns; j++) {
            let x = offset + (j * cellSize);

            // if last line - move to left for 1 pixel
            // because without this correction last line will be drawn behind the visible part of the canvas
            if(j == columns) x = x - 1;

            // drawning veritcal lines
            drawLine(context, {
                x1: x,
                y1: 0,
                x2: x,
                y2: height,
                thickness: lineThickness,
                color: lineColor,
            });

            // calc y pos
            let y = offset + (i * cellSize);

            // if last line - move to up for 1 pixel
            // because without this correction last line will be drawn behind the visible part of the canvas
            if(i == rows) y = y - 1;
            
            // drawnin horizontal lines
            drawLine(context, {
                x1: 0,
                y1: y,
                x2: width,
                y2: y,
                thickness: lineThickness,
                color: lineColor,
            })
        }
    }
}