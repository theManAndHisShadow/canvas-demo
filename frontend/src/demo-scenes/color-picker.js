let colorPicker = new Scene({
    title: 'Color picker demo scene', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'empty'
        },
    },

    code: (root, display, settings) => {
        // basic canvas values
        const canvas = root.querySelector('canvas');
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        // scene values
        // raduis of "spectrum" circle
        const radius = 150;

        // Drawing shading behind a circle
        drawShadow(context, {
            radius: radius * 2,
        });

        // Drawing spectrum circle (using built-in methods)
        drawSpectrum(context, {
            radius: radius,
        });

        // Drawing color labels and angle labels
        drawColorLabels(context, {
            radius: radius,
            /**
             * N.B.:
             * Due to the fact that the main step is 2 degrees, there may be a coincidence between the degrees of colors 
             * and the degrees of angles. When adding colors, a bug may occur when all the color name labels disappear, 
             * you just need to add colors further until everything gets better 
             * (the result of dividing 360 by the number of colors will not be a multiple of 2 degrees)
             */
            colorOrder: [
                {name: 'RED',         offset: 20}, 
                {name: 'ORANGE',      offset: 30}, 
                {name: 'GREEN',       offset: 35}, 
                {name: 'CYAN',        offset: 25}, 
                {name: 'INDIGO',      offset: 30}, 
                {name: 'VIOLET',      offset: 30},
            ],
        });

    }
});

// Exproting scene
window.exportedObjects.push(colorPicker);

/**
* Scene file internal helper function defenitions
*/


/**
 * Draws a color spectrum circle
 * @param {CanvasRenderingContext2D} context 
 * @param {Number} param.radius - radius of spectrum circle  
 */
function drawColorLabels(context, {radius, colorOrder}){
    // center of canvas
    const centerX = context.canvas.width / 2;
    const centerY = context.canvas.height / 2;

    // margin between circle and labels
    const margin = 10;

    // lenggth of label line
    const length = 10;

    // amount of angle lines 
    const totalAmount = 180;

    // amount of color labels
    const mainAnglesAmount = Array.isArray(colorOrder) > 0 ? colorOrder.length : 6;

    // setting text style
    context.font = 'bold 12px Arial'; 
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    let angle = 0;
    let step = 360 / totalAmount;

    let currentMainAngle = 0;
    let mainAngleStep = 360 / mainAnglesAmount;

    // We walk in a circle with a step equal to - 360 divided by the number of angle marks
    // j - value of current color index
    for(let i = 0, j = -1; i < totalAmount; i++) {
        let origin = {x: centerX, y: centerY - radius - margin};
        
        // start point of line (color label or angle line)
        let start = rotatePoint(centerX, centerY, origin.x, origin.y, angle)

        // end point of line (color label or angle line)
        let end = rotatePoint(centerX, centerY, origin.x, origin.y - length, angle);
    
        // drawn a line near color label or just angle line
        drawLine(context, {
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y,
            // if current angle is amgle of color label - use black line color or diff thickness
            thickness: angle == currentMainAngle ? 1 :  0.5,
            color: angle == currentMainAngle ? 'black' : 'rgba(0, 0, 0, 0.3)',
        });

        // actions only for color labels
        if(angle == currentMainAngle) {
            // next color
            j++;
            console.log('j updated', j, angle, currentMainAngle, colorOrder[j]);

            // offset of color label from line
            let offset = colorOrder.length > 0 ? colorOrder[j].offset : length;

            // calc text pos
            let textPosition = rotatePoint(centerX, centerY, origin.x, origin.y - offset, angle);

            // update current color label angle
            currentMainAngle += mainAngleStep;

            // draw color label
            context.fillText(colorOrder[j].name, textPosition.x, textPosition.y);
        }

        angle += step;
    }
}

/**
 * Draws a point shadow with a wide spread field
 * @param {CanvasRenderingContext2D} context 
 * @param {Number} param.radius - radius of shadow circle
 */
function drawShadow(context, {radius}){
    const width = context.canvas.width;
    const height = context.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
   
    /**
     * Here we simulate a shadow using a radial gradient
     */
    const gradient = context.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, height / 2);

    gradient.addColorStop(0, 'black');
    gradient.addColorStop(1, 'white');
    
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    
    context.fillStyle = gradient;
    context.fill();
    context.closePath();
}


/**
 * Draws a spectrum circle
 * @param {CanvasRenderingContext2D} context 
 * @param {Number} param.radius - radius of spectrum circle
 */
function drawSpectrum(context, {radius = 120} = {}){
    const width = context.canvas.width;
    const height = context.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
   
    /**
     * we adjust the colors manually, for seamlessness we duplicate the color of the beginning and end, 
     * however, this causes a slight asymmetry in the arrangement of colors
     */
    const gradient = context.createConicGradient(-20, width/2, height/2);
    const colors = [ 
        "rgb(255, 0, 0)", // pure red

        "rgb(255, 255, 0)", // mix

        "rgb(0, 255, 0)", // pure green

        "rgb(0, 255, 255)", // mix

        "rgb(0, 0, 255)", // pure blue

        "rgb(155, 0, 255)", // mix

        "rgba(255, 0, 0)", // pure red
    ];

    // adding each color
    colors.forEach((color, i) => {
        let pos = (1 / colors.length) * i;

        gradient.addColorStop(pos, color);
    });
    
    // render spectrum circle
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    
    context.fillStyle = gradient;
    context.fill();
    context.closePath();
}
