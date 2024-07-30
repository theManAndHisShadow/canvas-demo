let staticGadients = new Scene({
    title: 'Static gradients', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Using built-in methods for drawing gradients obviously shows itself much better, compared to custom functions for rendering pixel by pixel.'
        },

        'executeTime': {
            type: 'display',
            label: 'Gradient rendered in',
        },

        'gradientRenderingMethod': {
            type: 'option-selector',
            label: 'Gradient rendering method',
            optionNames: [
                'pixel-by-pixel', 
                'built-in', 
            ],
            defaultValue: 0,
        },

        'gradientTypeSelector': {
            type: 'option-selector',
            label: 'Gradient type',
            optionNames: [
                'linear',
                'conical',
                'radial',
                'multicolor'
            ],

            defaultValue: 1,
        },

        'regenerate': {
            type: 'button',
            label: 'Action',
            text: 'Generate',
        },
    },

    code: (root, display, settings) => {
        const canvas = root.querySelector('canvas');
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        const centerX = width / 2;
        const centerY = height / 2;


        // main animating function
        let draw = (method, type) => {
            // clearing prev created animatuon threads
            window.runningAnimations.clearQueue();

            // clearif prev canvas content
            context.clearRect(
                0, 0,
                width,
                height
            );
            
            // call the functions for drawing gradients and get the rendering time
            let time = measurePerformance(
                /**
                 * Depending on the selected rendering method, calls the necessary function to demonstrate 
                 * different speeds of drawing gradients
                 */
                drawGradient, 
                context, 
                {
                    type: type,
                    method: method,
                    width: width, 
                    height: height, 
                    color1: [getRandomNumber(0, 255), getRandomNumber(0, 255), getRandomNumber(0, 255)],
                    color2: [getRandomNumber(0, 255), getRandomNumber(0, 255), getRandomNumber(0, 255)],
                    // some debug options
                    // width: 50, 
                    // height: 50, 
                    // color1: [255, 0, 0],
                    // color2: [0, 0, 0]
                }
            );

            // send some data to UI Display
            let className = time < 1 ? 'green-word-bubble' : 'yellow-word-bubble';
            display.updateValue('executeTime', `<i class='${className}'>${time.toFixed(1)} ms.</i>`);
        }

        // default rendering method
        const defaultMethod = 0;
        const defaultType = 0;
        
        // manually explicitly specify standard settings
        settings.setState('gradientRenderingMethod', defaultMethod);
        settings.setState('gradientTypeSelector', defaultType);

        // first draw step (when scene is loaded)
        draw(settings.getState('gradientRenderingMethod'), settings.getState('gradientTypeSelector'));
        
        // adding handler to UI Controls
        settings.subscribe((key, newValue, oldValue) => {
            if(key == 'regenerate') {
                draw(settings.getState('gradientRenderingMethod'), settings.getState('gradientTypeSelector'));
            }
        });

    }
});

// Exproting scene
window.exportedObjects.push(staticGadients);


/**
* Scene file internal helper function defenitions
*/


/**
 * Сounts the number of milliseconds spent on executing the measured function and return time
 * @param {Function} tatrgetFunc - target function the execution speed of which needs to be calculated
 * @param  {...any} targetFuncArgs - arguments of target function
 * @returns {Number} - function execution time in milliseconds
 */
function measurePerformance(tatrgetFunc, ...targetFuncArgs) {
    const start = performance.now();
    tatrgetFunc(...targetFuncArgs);
    const end = performance.now();

    return end - start;
}


/**
 * Draws a gradient on the canvas.
 * 
 * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
 * @param {Object} param - The parameters for drawing the gradient.
 * @param {number} param.width - The width of the canvas.
 * @param {number} param.height - The height of the canvas.
 * @param {number[]} param.color1 - The starting color of the gradient in RGBA format.
 * @param {number[]} param.color2 - The ending color of the gradient in RGBA format.
 * @param {number} param.type - Type of gradient - linear/conic
 * @param {number} [param.method=1] - Methods of rendering - pixel-by-pixel or built-in
 */
function drawGradient(context, {color1, color2, width, height, type, method = 1}){
    // 
    if(method == 0) {
        const imageData = context.createImageData(width, height);

        // Calculate the color difference between color1 and color2
        const rDelta = color2[0] - color1[0];
        const gDelta = color2[1] - color1[1];
        const bDelta = color2[2] - color1[2];

        // Create an ImageData object
        let resultColor = [0, 0, 0];

        
        // Loop through each pixel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Calculate the index in the imageData array for the pixel at coordinates (x, y)
                // Detailed explanation:
                // - y * width: Determines the row offset by multiplying the y-coordinate by the width of the image.
                //   This gives the total number of pixels in all rows before the current row.
                // - y * width + x: Adds the x-coordinate to the row offset to get the exact pixel position within the image.
                // - (y * width + x) * 4: Multiplies the pixel position by 4 because each pixel is represented by 4 consecutive values
                // - red, green, blue and alpha channels
                const index = (y * width + x) * 4;

                //A factor that influences how the color will be interpolated
                let factor;
                
                if(type == 0) {        
                    // Calculate the interpolation factor
                    factor = x / width;
                } else if(type == 1){
                    // get normalized (from 0 to 1) angle between current point and canvas center
                    factor = getNormalizedAngle(width / 2, height / 2, x, y);
                } else if(type == 2){
                    // the farther the point of the second color is from the center, the dimmer it is
                    let distance = getDistanseBetweenTwoPoint(width / 2, height / 2, x, y);
                    factor = (distance * (height / 2)) / 100 / 100;
                }

                // if this is type 4 gradient - direct impact on the resulting color without intermediate fatcores
                if(type == 3) {
                    let angle = getNormalizedAngle(width/2, height/2, x, y);

                    if (angle < 1 / 6) {
                        // Interpolate from red to yellow
                        resultColor[0] = 255;
                        resultColor[1] = Math.round(angle * 6 * 255); // Green increases from 0 to 255
                        resultColor[2] = 0;
                    } else if (angle < 2 / 6) {
                        // Interpolate from yellow to green
                        resultColor[0] = Math.round(255 - (angle - 1 / 6) * 6 * 255); // Red decreases from 255 to 0
                        resultColor[1] = 255;
                        resultColor[2] = 0;
                    } else if (angle < 3 / 6) {
                        // Interpolate from green to cyan
                        resultColor[0] = 0;
                        resultColor[1] = 255;
                        resultColor[2] = Math.round((angle - 2 / 6) * 6 * 255); // Blue increases from 0 to 255
                    } else if (angle < 4 / 6) {
                        // Interpolate from cyan to blue
                        resultColor[0] = 0;
                        resultColor[1] = Math.round(255 - (angle - 3 / 6) * 6 * 255); // Green decreases from 255 to 0
                        resultColor[2] = 255;
                    } else if (angle < 5 / 6) {
                        // Interpolate from blue to violet
                        resultColor[0] = Math.round((angle - 4 / 6) * 6 * 255); // Red increases from 0 to 255
                        resultColor[1] = 0;
                        resultColor[2] = 255;
                    } else {
                        // Interpolate from violet to red
                        resultColor[0] = 255;
                        resultColor[1] = 0;
                        resultColor[2] = Math.round(255 - (angle - 5 / 6) * 6 * 255); // Blue decreases from 255 to 0
                    } 
                    
                // if it is any of the first 3 types - the impact on the resulting color will be influenced by indirect factors
                } else {
                    // Interpolate colors
                    resultColor[0] = color1[0] + (rDelta * factor); // Red
                    resultColor[1] = color1[1] + (gDelta * factor); // Green
                    resultColor[2] = color1[2] + (bDelta * factor); // Blue
                }

                // update colors using index and ofsset for diff channels
                imageData.data[index    ] = resultColor[0]; // Red
                imageData.data[index + 1] = resultColor[1]; // Green
                imageData.data[index + 2] = resultColor[2]; // Blue
                imageData.data[index + 3] = 255;            // Alpha (fully opaque)
            }
        }

        // Put the ImageData object onto the canvas
        context.putImageData(imageData, 0, 0);
    } else {
        let gradient;

        if(type == 0) {
            gradient = context.createLinearGradient(0, 0, width, 0);
        } else if(type == 1){
            gradient = context.createConicGradient(0, width/2, height/2);
        } else if(type == 2) {
            gradient = context.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, height / 2);
        }

        if(type == 3) {
            // generated based on a pre-prepared array of colors
            gradient = context.createConicGradient(300, width/2, height/2);
            let colors = [ 
                "red", 
                "rgb(251, 0, 84)", 
                "rgb(211, 0, 255)", 
                "rgb(160, 0, 255)", 
                "blue", 
                "rgb(17, 130, 255)",
                "rgb(34, 255, 10)", 
                "yellow", 
                "orange", 
                "red"
            ];

            colors.forEach((color, i) => {
                let pos = (1 / colors.length) * i;

                gradient.addColorStop(pos, color);
            })
        } else {
            gradient.addColorStop(0, `rgba(${color1}, 1)`);
            gradient.addColorStop(1, `rgba(${color2}, 1)`);
        }
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
    }
}