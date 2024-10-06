/**
 * Helper functions that are accessible globally from any part of the project
 */



/**
 * Returns random integer from range (min, max)
 * @param {number} min - range start value
 * @param {number} max - range end value (including max value)
 * @returns {number} - random number
 */
export function getRandomNumber(min, max) {
    let randomNUmber = min + Math.random() * (max + 1 - min);
  
    return Math.floor(randomNUmber);
}



/**
 * Converts decimal number to fraction a/b
 * @param {number} decimal - original decimal value
 * @returns - fraction from decimal
 */
export function decimalToFraction(decimal) {
    let numerator = decimal;
    let denominator = 1;

    while (Math.floor(numerator) !== numerator) {
        numerator *= 10;
        denominator *= 10;
    }

    // Greatest common divisor
    const gcd = (a, b) => {
        return b ? gcd(b, a % b) : a;
    };

    const gcdValue = gcd(numerator, denominator);

    return {
        numerator: numerator / gcdValue,
        denominator: denominator / gcdValue
    };
}



/**
 * Truncates last zero numbers of flaot num.
 * @param {Number} flotNum - float number to truncate
 * @param {Number} fixedTo 
 * @returns {String} - string which contains truncated float num
 */
export function truncateFloatNum(flotNum, fixedTo = 3) {
    return flotNum.toFixed(fixedTo).replace(/\.?0+$/, '');
}



/**
 * 
 * @param {string} fraction  - fraction to transform
 * @returns {number} - converted fraction
 */
export function fractionToDecimal(fraction) {
    // deviding string by /
    const parts = fraction.split('/');
    
    // Transforming string to num
    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);

    // return result of devision
    return numerator / denominator;
}



/**
 * Checks is n is falot number
 * @param {number} n - number for check
 * @returns {boolean} - true or false
 */
export function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}



/**
 * Returns last item of array
 * @param {array} array - target array
 * @returns {any} - last item
 */
export function getArrayLast(array){
    return array[array.length - 1];
}



/**
*   Converts an index to its corresponding letter.
*   @param {number} i - The target index.
*   @param {boolean} [upperCase=false] - Indicates whether the letter should be in upper case.
*   @returns {string} - The letter corresponding to the given index.
*/
export function translateIndexToLetter(i, upperCase = false) {
    let letter = String.fromCharCode(97 + i);

    if(upperCase == true) letter = letter.toUpperCase();

    return letter;
}


/**
 * Returns object full deep clone
 * @param {object} targetObject - target object
 * @returns {object} - clone of target object
 */
export function deepClone(targetObject){
    /**
     * N.B.: In some cases, the cloning process may be interrupted due to a “circular reference error”
     */
    return JSON.parse(JSON.stringify(targetObject));
}



/**
 * Rotates point around epicenter
 * @param {number} cx - epicenter point x pos
 * @param {number} cy - epicenter point y pos
 * @param {number} pointX - target point x pos 
 * @param {number} pointY - target point y pos
 * @param {number} angleInDegrees - angle of rotation
 * @returns 
 */
export function rotatePoint(cx, cy, pointX, pointY, angleInDegrees) {
    let angleInRadians = angleInDegrees * Math.PI / 180;
    let cosTheta = Math.cos(angleInRadians);
    let sinTheta = Math.sin(angleInRadians);
    
    let rotatedX = cx + (pointX - cx) * cosTheta - (pointY - cy) * sinTheta;
    let rotatedY = cy + (pointX - cx) * sinTheta + (pointY - cy) * cosTheta;
    
    return { x: rotatedX, y: rotatedY };
}



/**
 * Returns real mouse position (above canvas, for example)
 * @param {HTMLCanvasElement} canvas - referance to target canvas
 * @param {MouseEvent} event - mousemove or mouseover event objects
 * @returns {{x: number, y: number}} - object of mouse position
 */
export function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}


/**
 * Returns RGBA color from string of color name
 * @param {string} colorName - name of color
 * @param {number} opacity - float number of color opacity
 * @returns {string}
 */ 
export function getColor(colorName, opacity = 1) {
    opacity = Math.max(0, Math.min(opacity, 1));

    // Color palette based on Material Design standards
    const colors = {
        // Reds
        red: [244, 67, 54],
        lightRed: [255, 205, 210],
        darkRed: [200, 50, 40],
        paleRed: [255, 182, 193],
        softRed: [255, 105, 97],
        brightRed: [255, 0, 0],
        crimson: [220, 20, 60],
    
        // Pinks
        magenta: [255, 0, 255],
        deepMagenta: [211, 0, 211],
        brightMagenta: [255, 51, 255],
        fuchsia: [255, 0, 255],
        hotPink: [255, 105, 180],
        deepPink: [255, 20, 147],
        orchid: [218, 112, 214],
        mediumVioletRed: [199, 21, 133],
        paleVioletRed: [219, 112, 147],
        pink: [255, 192, 203],
        lightPink: [255, 182, 193],
        thistle: [216, 191, 216],
        plum: [221, 160, 221],
        violet: [238, 130, 238],
        lavenderBlush: [255, 240, 245],
        lightMagenta: [255, 153, 255],
        darkMagenta: [139, 0, 139],
    
        // Violets
        purple: [156, 39, 176],
        lightPurple: [225, 190, 231],
        darkPurple: [130, 30, 150],
        palePurple: [221, 160, 221],
        softPurple: [219, 112, 219],
        brightPurple: [186, 85, 211],
    
        // Deep Violets
        deepPurple: [103, 58, 183],
        lightDeepPurple: [209, 196, 233],
        darkDeepPurple: [80, 45, 150],
    
        // Blues
        indigo: [63, 81, 181],
        lightIndigo: [197, 202, 233],
        darkIndigo: [55, 70, 170],
    
        blue: [33, 150, 243],
        lightBlue: [187, 222, 251],
        darkBlue: [25, 130, 200],
        paleBlue: [173, 216, 230],
        softBlue: [135, 206, 235],
        brightBlue: [0, 191, 255],
    
        // Cyans
        cyan: [0, 188, 212],
        lightCyan: [178, 235, 242],
        darkCyan: [0, 150, 180],
        paleCyan: [224, 255, 255],
        softCyan: [0, 255, 255],
        brightCyan: [0, 255, 255],
    
        // Teal
        teal: [0, 150, 136],
        lightTeal: [178, 223, 219],
        darkTeal: [0, 120, 110],
        paleTeal: [175, 238, 238],
        softTeal: [64, 224, 208],
        brightTeal: [0, 128, 128],
    
        // Greens
        green: [76, 175, 80],
        lightGreen: [220, 237, 200],
        darkGreen: [60, 150, 70],
        paleGreen: [152, 251, 152],
        softGreen: [144, 238, 144],
        neonGreen: [57, 255, 20],
        brightGreen: [0, 255, 0],
    
        // Limes
        lime: [205, 220, 57],
        darkLime: [170, 180, 45],
    
        // Yellows
        yellow: [255, 235, 59],
        lightYellow: [255, 249, 196],
        darkYellow: [210, 195, 45],
        paleYellow: [255, 255, 224],
        softYellow: [255, 255, 102],
        brightYellow: [255, 255, 0],
    
        // Ambers
        amber: [255, 193, 7],
        lightAmber: [255, 224, 178],
        darkAmber: [210, 160, 5],
        paleAmber: [255, 228, 181],
        softAmber: [255, 223, 0],
        brightAmber: [255, 191, 0],
    
        // Oranges
        orange: [255, 152, 0],
        lightOrange: [255, 224, 178],
        darkOrange: [210, 130, 0],
        paleOrange: [255, 239, 213],
        softOrange: [255, 165, 0],
        neonOrange: [255, 165, 0],
    
        // Deep Oranges
        deepOrange: [255, 87, 34],
        lightDeepOrange: [255, 204, 188],
        darkDeepOrange: [210, 60, 30],
    
        // Browns
        brown: [121, 85, 72],
        lightBrown: [215, 204, 200],
        darkBrown: [100, 70, 60],
    
        // Grays
        grey: [158, 158, 158],
        lightGrey: [245, 245, 245],
        darkGrey: [130, 130, 130],
    
        // Blue Grey
        blueGrey: [96, 125, 139],
        lightBlueGrey: [207, 216, 220],
        darkBlueGrey: [80, 105, 120],
    
        // Black and white
        black: [0, 0, 0],
        white: [255, 255, 255],
    };

    // Default to black if the color name is not found
    const [r, g, b] = colors[colorName] || colors['black'];

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}



/**
 * Updates opacity of RGBA color
 * @param {string} rgba - rgba string
 * @param {number} newOpacity - float number
 * @returns {string}
 */
export function changeColorOpacity(rgba, newOpacity){
    newOpacity = Math.max(0, Math.min(newOpacity, 1));

    // split to components and change alpha component, then compose and return
    return rgba.split(', ').map((c, i) => { if(i == 3) c = newOpacity + ')'; return c;}).join(', ');
}


/**
 * Converts an RGBA color value to a HEX color value.
 * 
 * @param {number} r - The red component of the color (0-255).
 * @param {number} g - The green component of the color (0-255).
 * @param {number} b - The blue component of the color (0-255).
 * @param {number} a - The alpha component of the color (0-1), where 0 is fully transparent and 1 is fully opaque.
 * 
 * @returns {string} The HEX color value including the alpha channel in the format `#RRGGBBAA`.
 */
export function rgba2hex(r, g, b, a) {
    // Validate input
    if (
        typeof r !== 'number' || r < 0 || r > 255 ||
        typeof g !== 'number' || g < 0 || g > 255 ||
        typeof b !== 'number' || b < 0 || b > 255 ||
        typeof a !== 'number' || a < 0 || a > 1
    ) {
        throw new Error('Invalid input: Ensure that r, g, b are between 0 and 255, and a is between 0 and 1.');
    }

    // Convert alpha to a value between 0 and 255
    const alpha = Math.round(a * 255);

    // Convert RGB and alpha to hexadecimal strings
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');
    const aHex = alpha.toString(16).padStart(2, '0');

    // Return the HEX color value with alpha channel
    return `#${rHex}${gHex}${bHex}${aHex}`;
}


/**
 * Function to make a color more vibrant by maximizing the dominant color component.
 * @param {string} rgbaColor - A string in the format 'rgba(r, g, b, a)'.
 * @returns {string} - A new color string in 'rgba' format, with increased vibrancy.
 */
export function getColorDominantComponent(rgbaColor) {
    // Extract the RGBA components from the string
    const rgba = rgbaColor
        .replace(/^rgba?\(|\s+|\)$/g, '') // Remove 'rgba(', 'rgb(', ')', and spaces
        .split(',')                       // Split by comma
        .map(Number);                     // Convert strings to numbers

    let [r, g, b, a] = rgba;

    // Find the dominant color component (r, g, or b)
    const maxComponent = Math.max(r, g, b);
    const minComponent = Math.min(r, g, b);

    // Increase the intensity of the dominant component
    if (r === maxComponent) {
        r = 255;
        g = Math.max(0, g - minComponent);
        b = Math.max(0, b - minComponent);
    } else if (g === maxComponent) {
        g = 255;
        r = Math.max(0, r - minComponent);
        b = Math.max(0, b - minComponent);
    } else {
        b = 255;
        r = Math.max(0, r - minComponent);
        g = Math.max(0, g - minComponent);
    }

    return `rgba(${r}, ${g}, ${b}, ${a})`;
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
export function drawLine (context, {x1, y1, x2, y2, thickness, color} = {}){
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
export function drawRect (context, {x, y, width, height, fillColor}){
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
export function getAngleBetweenTwoPoints(ax, ay, bx, by) {
    let dy = by - ay;
    let dx = bx - ax;
    let theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;

    return theta;
}


/**
 * Calculates the normalized angle between two points.
 * The angle is normalized to the range [0, 1], where 0 represents 0 degrees
 * and 1 represents 360 degrees.
 * 
 * @param {number} x1 - x coordinate of the first point
 * @param {number} y1 - y coordinate of the first point
 * @param {number} x2 - x coordinate of the second point
 * @param {number} y2 - y coordinate of the second point
 * @returns {number} - The normalized angle between the two points
 */
export function getNormalizedAngle(x1, y1, x2, y2) {
    // Calculate the angle in radians between the two points
    const angleInRadians = Math.atan2(y2 - y1, x2 - x1);

    // Normalize the angle to the range [0, 2 * Math.PI]
    const normalizedAngleInRadians = (angleInRadians + 2 * Math.PI) % (2 * Math.PI);

    // Convert the normalized angle to the range [0, 1]
    const normalizedAngle = normalizedAngleInRadians / (2 * Math.PI);

    return normalizedAngle;
}



/**
 * Returns a distance value between two points
 * @param {number} ax - first point x pos
 * @param {number} ay - first point y pos
 * @param {number} bx - second point x pos
 * @param {number} by - second point y pos
 * @returns {number} - distance value
 */
export function getDistanseBetweenTwoPoint(ax, ay, bx, by){
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
export function drawCircle(context, {cx, cy, r, fillColor, borderThickness, borderColor}){
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
export function drawGrid(context, {cellSize, lineThickness, lineColor}){
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



/**
 * 
 * @param {CanvasRenderingContext2D} context - 2d context of canvas 
 * @param {number} param.cx - triangle center point pos at x axis
 * @param {number} param.cy - triangle center point pos at y axis
 * @param {number} param.h - triangle height
 * @param {number} param.b - triangle base length
 * @param {number} param.fillColor - triangle fill color
 * @param {number} param.borderThickness - triangle border thickness
 * @param {number} param.borderColor - triangle border color
 */
export function drawTriangle(context, {cx, cy, h, b, fillColor = 'transparent', borderThickness, borderColor }) {
    context.beginPath();

    const topVertex =   {x: cx,         y: cy - h / 2};
    const leftVertex =  {x: cx - b / 2, y: cy + h / 2};
    const rightVertex = {x: cx + b / 2, y: cy + h / 2};

    context.moveTo(topVertex.x, topVertex.y);
    context.lineTo(leftVertex.x, leftVertex.y);
    context.lineTo(rightVertex.x, rightVertex.y);

    context.fillStyle = fillColor;
    context.fill();
    context.lineWidth = borderThickness;
    context.strokeStyle = borderColor
    context.closePath();
    context.stroke();
}



/**
 * Draws a text at canvas.
 * @param {Number} param.x - text x pos
 * @param {Number} param.y - text y pos
 * @param {string} param.text - text
 * @param {string} param.fontFamily - text font family
 * @param {number} param.fontSize - text font size
 * @param {string} param.fontWeight - text font weight
 * @param {string} param.align - text align (left, center, right)
 * @param {string} param.baseline - text baseline
 */
export function drawText(context, {x, y, text, color ='white', fontFamily = 'Arial', fontSize = 12, fontWeight = '', align = 'center', baseline = 'middle'}){
    context.fillStyle = color;
    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`; 
    context.textAlign = align;
    context.textBaseline = baseline;

    context.fillText(text, x, y);
}


/**
 * Calculates the value on the Bezier curve depending on the parameter t.
 * This value can be used for smooth animations or to smooth transitions.
 *
 * @param {number} t - Curve parameter, where 0 <= t <= 1. Defines the position on the curve.
 * @returns {number} - The value on the Bezier curve corresponding to the parameter t.
 */
export function getBezierCurveValue(t) {
    return t * t * (3 - 2 * t);
}


/**
 * Сounts the number of milliseconds spent on executing the measured function and return time
 * @param {Function} tatrgetFunc - target function the execution speed of which needs to be calculated
 * @param  {...any} targetFuncArgs - arguments of target function
 * @returns {Number} - function execution time in milliseconds
 */
export function measurePerformance(tatrgetFunc, ...targetFuncArgs) {
    const start = performance.now();
    tatrgetFunc(...targetFuncArgs);
    const end = performance.now();

    return end - start;
}

/**
 * Replace element with clone to reset all event listeners
 * @param {HTMLElement} target - target to reset
 * @param {string} id - dynamic id
 * @returns {HTMLElement}
 */
export function resetElement(target, id){
    let clone = target.cloneNode(true);
    
    if(id && id.length > 0) {
        clone.id = id;
    }

    target.parentNode.insertBefore(clone, target);
    target.remove();

    // deleting helper elements (reset uses on scene switching, new scene - new helper elements)
    let helperElements = document.querySelectorAll(`[data-element-for]`);
    if(helperElements.length > 0) {
        Array.from(helperElements).forEach(element => {
            // if detected elements with other id
            if(element.getAttribute('data-element-for') !== id) element.remove();
        });
    };

    return clone;
}