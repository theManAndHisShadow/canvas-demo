let staticGadients = new Scene({
    title: 'Static gradients', 

    ui: {
        'colorsNumber': {
            type: 'display',
            label: 'Linear gradient',
        },

        'executeTime': {
            type: 'display',
            label: ' - rendered by',
        },

        'usedMethod': {
            type: 'display',
            label: ' - method used'
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

        'gradientType': {
            type: 'option-selector',
            label: 'Gradient type',
            optionNames: [
                'linear',
                'radial',
            ],

            defaultValue: 0,
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
        let draw = (method) => {
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
                method == 0 ? drawGradientPixelByPixel : drawGradientUsingBuiltIn, 
                context, 
                {
                    width: width, 
                    height: height, 
                    color1: [getRandomNumber(0, 255), getRandomNumber(0, 255), getRandomNumber(0, 255)],
                    color2: [getRandomNumber(0, 255), getRandomNumber(0, 255), getRandomNumber(0, 255)]
                    // some debug options
                    // width: 50, 
                    // height: 50, 
                    // color1: [255, 0, 0],
                    // color2: [0, 0, 0]
                }
            );

            // send some data to UI Display
            display.updateValue('colorsNumber', '2 colors');
            display.updateValue('usedMethod', method == 0 ? 'pixel-by-pixel' : 'built-in');
            display.updateValue('executeTime', time.toFixed(1) + ' ms.');
        }

        // default rendering method
        const defaultMethod = 0;
        settings.setState('gradientRenderingMethod', defaultMethod);
        settings.setState('gradientType', 1);

        // first draw step (when scene is loaded)
        draw(settings.getState('gradientRenderingMethod'));
        
        // adding handler to UI Controls
        settings.subscribe((key, newValue, oldValue) => {
            if(key == 'regenerate') {
                draw(settings.getState('gradientRenderingMethod'));
            }
        });

    }
});

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
 * Draws a gradient pixel by pixel on the canvas.
 * 
 * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
 * @param {Object} param - The parameters for drawing the gradient.
 * @param {number} param.width - The width of the canvas.
 * @param {number} param.height - The height of the canvas.
 * @param {number[]} param.color1 - The starting color of the gradient in RGBA format.
 * @param {number[]} param.color2 - The ending color of the gradient in RGBA format.
 */
function drawGradientPixelByPixel(context, {width, height, color1, color2}){
    // Create an ImageData object
    const imageData = context.createImageData(width, height);

    // Calculate the color difference between color1 and color2
    const rDelta = color2[0] - color1[0];
    const gDelta = color2[1] - color1[1];
    const bDelta = color2[2] - color1[2];

    // Loop through each pixel
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            
            // Calculate the interpolation factor
            const factor = x / width;

            // Interpolate colors
            imageData.data[index    ] = color1[0] + rDelta * factor; // Red
            imageData.data[index + 1] = color1[1] + gDelta * factor; // Green
            imageData.data[index + 2] = color1[2] + bDelta * factor; // Blue
            imageData.data[index + 3] = 255;                         // Alpha (fully opaque)
        }
    }

    // Put the ImageData object onto the canvas
    context.putImageData(imageData, 0, 0);
}


/**
 * Draws a gradient using built in mathods on the canvas.
 * 
 * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
 * @param {Object} param - The parameters for drawing the gradient.
 * @param {number} param.width - The width of the canvas.
 * @param {number} param.height - The height of the canvas.
 * @param {number[]} param.color1 - The starting color of the gradient in RGBA format.
 * @param {number[]} param.color2 - The ending color of the gradient in RGBA format.
 */
function drawGradientUsingBuiltIn(context, {width, height, color1, color2}){    
    const gradient = context.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(${color1}, 1)`);
        gradient.addColorStop(1, `rgba(${color2}, 1)`);

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
}