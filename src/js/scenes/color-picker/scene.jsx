
import React from "react";
import SceneTemplate from "../../core/templates/scene.template.jsx";
import { 
    getMousePos, getDistanseBetweenTwoPoint, rotatePoint, getNormalizedAngle, getBezierCurveValue, 
    getColorDominantComponent, changeColorOpacity, rgba2hex, 
    drawLine 
} from '../../misc/helpers.js';

function ColorPickerScene({ setDescription, setTags }) {
    return (
        <SceneTemplate
            title="Color picker demo scene"

            description="Color picker based on multicolor radial gradient and mouse events. Move range slider to adjust color. Click on the desired location on the circle to get color data."
            tags={['color', 'mouse-interaction']}
            uiTree={{
                HUD: {},
                outputDisplay: {
                    'currentColor': {
                        type: 'display-item',
                        label: 'Picker',
                    },
                },
                controlPanel: {
                    'use-hex': {
                        type: 'checkbox',
                        label: 'Use HEX colors',
                    },
            
                    'adjustment-slider': {
                        type: 'range-slider',
                        startLabel: 'Darker',
                        endLabel: 'Lighter',
                        minValue: 0,
                        maxValue: 100,
                        defaultValue: 50,
                    },
                }
            }}

            code={code}
            setDescription={setDescription}
            setTags={setTags}
        />
    );
}

function code(HUD, outputDisplay, settings) {
    const root = document.querySelector('#root');
    const canvas = root.querySelector('canvas'); 
    const context = canvas.getContext('2d');

    const width  = canvas.width;
    const height = canvas.height;

    // scene values
    // raduis of "spectrum" circle
    const radius = 150;

    // color picker feature values
    let mouseOnCircle = false;
    let mousePos = false;
    let pickerPos = false;
    let mouseDown = false;

    /**
     * Main function of this scene. 
     * Draws spectrum circle and some color name labels.
     * @param {number} opacity - from 1 to 100
     */
    const draw = (brightness) => {
        brightness = brightness / 100;

        context.clearRect(
            0, 0,
            width,
            height
        );

        // Drawing spectrum circle (using built-in methods)
        drawSpectrum(context, {
            radius: radius,
            brightness: brightness,
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
                {name: 'YELLOW',      offset: 30}, 
                {name: 'GREEN',       offset: 35}, 
                {name: 'CYAN',        offset: 25}, 
                {name: 'BLUE',        offset: 30}, 
                {name: 'MAGENTA',     offset: 30},
            ],

            brightness: brightness,
        });
    }

    // setting default values
    let defaultValue = 50;
    // settings.setState('adjustment-slider', defaultValue);
    draw(defaultValue);

    // subscribing to settings changes
    settings.subscribe((key, newValue, oldValue) => {
        if(key == 'adjustment-slider') {
            // redraw spectrum
            draw(newValue);

            pickColor();
        }

        if(key == 'use-hex') {
            pickColor();
        }
    });

    /**
     * Select correct color for some special cases
     * @param {string} color - color in rgba format
     * @param {number} brightness - brightness of spectrum (from 0 to 100)
     * @returns {string} - rgba color
     */
    let correctColor = (color, brightness) => {
        // all cases where brightness less 50 - use color from picker
        return brightness < 49
            ? color :
            // all cases where brightness more than 80
            brightness >= 80
                // use blck color
                ? 'rgba(0, 0, 0, 1)'
                // for range from 49 to 80 - use color dominant component
                : getColorDominantComponent(color);
    };

    /**
     * Select color under mouse and updates info at html outputDisplay.
     */
    let pickColor = () => {
        // check is pickerPos is not false
        if(pickerPos) {
            // get pixel data
            let rawData = context.getImageData(pickerPos.x, pickerPos.y, 1, 1).data;
            let r = rawData[0];
            let g = rawData[1];
            let b = rawData[2];

            // re-collect to rgba color string
            let color = `rgba(${r}, ${g}, ${b}, 1)`;

            // color text name
            let colorText = settings.getState('use-hex') === true ? rgba2hex(r, g, b, 1) : `rgba (${r}, ${g}, ${b}, 1)`;

            // color for css 'color' prop of html element with color code
            let cssTextColor = correctColor(color, settings.getState('adjustment-slider'));

            // color for css 'background' prop of html element with color code
            let cssBackgroundColor = changeColorOpacity(color, 0.35);

            // update value of 'Current color' display option
            outputDisplay.updateValue('currentColor',
                // some DARK CSS MAGIC xD
                    // if true - draw round colored element with color string text
                    `<span style="
                            background: ${color}; 
                            width: 9px;
                            height: 9px;
                            position: relative;
                            display: inline-block;
                            border-radius: 100%;
                            border: 2px solid rgba(0, 0, 0, 0.25);
                            padding: 1px;
                            left: 3px;
                            top: 3px;
                        "></span>
                        <span class="gray-word-bubble" style="
                            position: relative;
                            left: 5px;
                            top: 1px;
                            font-size: 13px;
                            background: ${cssBackgroundColor};
                            color: ${cssTextColor}
                        ">
                            ${colorText}
                        </span>`
            );
        }
    }


    // updating values on mouse move
    canvas.addEventListener('mousemove', (event) => {
        // upadtin current mouse pos using event object
        mousePos = getMousePos(canvas, event);

        // if distance - radius less than 0 - mouse cursor is under a spectrum circle
        let d = getDistanseBetweenTwoPoint(mousePos.x, mousePos.y, canvas.width / 2, canvas.height / 2);
        mouseOnCircle = d - radius < 0 ? true : false;            

        // update mouse cursor when its on spectrum circle
        canvas.style.cursor = mouseOnCircle ? 'crosshair' : 'inherit';

        // check if mouse is under spectrum circle and mouse is pressed right now
        if (mouseOnCircle === true && mouseDown === true) {
            // update pos of picker
            pickerPos = mousePos;

            // redraw ONLY picker pointer element
            drawPickerPointer(context, {
                radius: 7,
                x: pickerPos.x,
                y: pickerPos.y,
                forElement: canvas.id
            });

            // update picked color (update html display item)
            pickColor();
        }
    });


    // updating color on click at canvas
    canvas.parentNode.addEventListener('mousedown', (event) => {
        // update mouse down state
        mouseDown = true;

        // update pos of mouse
        mousePos = getMousePos(canvas, event);

        // set pos of picker
        pickerPos = mousePos;
    });


    canvas.parentNode.addEventListener('mouseup', (event) => {
        // update mouse down state
        mouseDown = false;

        // update pos of mouse
        mousePos = getMousePos(canvas, event);
        
        // set pos of picker
        pickerPos = mousePos;

        if(mouseOnCircle === true) {
            // redraw only picker pointer element
            drawPickerPointer(context, {
                radius: 7,
                x: pickerPos.x,
                y: pickerPos.y,
            });
        }
    });
}


/**
 * Draws a color spectrum circle
 * @param {CanvasRenderingContext2D} context 
 * @param {Number} param.radius - radius of spectrum circle  
 * @param {Object[]} param.colorOrder - order of color objects, where color object = {name: 'name, offset: 10}
 * @param {number} param.brightness - brightness of colors
 */
function drawColorLabels(context, {radius, colorOrder, brightness}){
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

            // offset of color label from line
            let offset = colorOrder.length > 0 ? colorOrder[j].offset : length;

            // calc text pos
            let textPosition = rotatePoint(centerX, centerY, origin.x, origin.y - offset, angle);

            let colorText = colorOrder[j].name;

            // some special names for extreme values
            if(brightness < 0.05) colorText = 'BLACK';
            if(brightness > 0.99) colorText = 'WHITE';

            // update current color label angle
            currentMainAngle += mainAngleStep;

            // draw color label
            context.fillText(colorText, textPosition.x, textPosition.y);
        }

        angle += step;
    }
}


/**
 * Draws a spectrum circle
 * @param {CanvasRenderingContext2D} context 
 * @param {Number} param.radius - radius of spectrum circle
 * @param {Number} param.brightness - opacity of spectrum color (from 0 to 1)
 */
function drawSpectrum(context, {radius = 120, brightness = 1} = {}){
    const width = context.canvas.width;
    const height = context.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2

    // Create an ImageData object
    const imageData = context.createImageData(width, height);
    
    // init result color array
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
            let factor = getDistanseBetweenTwoPoint(centerX, centerY, x, y);

            let rotated = rotatePoint(centerX, centerY, x, y, 90);
            let angle = getNormalizedAngle(centerX, centerY, rotated.x, rotated.y);

            if (factor <= radius - 2) {
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
                
                let adjustedBrightness = getBezierCurveValue(brightness);
                
                // Get the value from which the calculation is made 
                let base = adjustedBrightness >= 0.5 ? 255 : 0;

                // color gain for dark and light sides
                let gain = adjustedBrightness >= 0.5 ? (adjustedBrightness - 0.5) * 2 : 1 - (adjustedBrightness * 2);
                
                // calc delta for each channel
                let rDelta = (base - resultColor[0]) * gain;
                let gDelta = (base - resultColor[1]) * gain;
                let bDelta = (base - resultColor[2]) * gain;
                
                // update channel value
                resultColor[0] += rDelta; // Red
                resultColor[1] += gDelta; // Green
                resultColor[2] += bDelta; // Blue
            } else {
                resultColor[0] = 255;
                resultColor[1] = 255;
                resultColor[2] = 255;
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
}


/**
 * Draws a color picker pointer HTML element.
 * If element already created - updates its position
 * @param {CanvasRenderingContext2D} context - canvas 2d context
 * @param {number} param.radius - radius of picker element
 * @param {number} param.x - x pos of picker element
 * @param {number} param.y - y pos of picker element
 */
function drawPickerPointer(context, {radius = 10, x, y, forElement}){
    let pickerRound = document.querySelector('#color-picker');
    let parent = context.canvas.parentNode;
    
    if(!pickerRound){
            pickerRound = document.createElement('span');
            pickerRound.id = 'color-picker';
            pickerRound.style = `
                width: ${radius}px;
                height: ${radius}px;
                left: ${x}px;
                top: ${y}px;
                position: absolute;
                background: #ffffff;
                border-radius: 100%;
                border: 1px solid black;
                cursor: crosshair;
            `;

        if(forElement && forElement.length > 0) {
            pickerRound.setAttribute('data-element-for', forElement);
        }

        parent.appendChild(pickerRound);
    } else {
        pickerRound.style.left = x + 216 + 'px';
        pickerRound.style.top = y + 52 + 'px';
    }
}

export default ColorPickerScene;