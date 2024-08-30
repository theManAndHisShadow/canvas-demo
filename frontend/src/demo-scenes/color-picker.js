let colorPicker = new Scene({
    title: 'Color picker demo scene', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Color picker based on multicolor radial gradient and mouse events. Move range slider to adjust color. Click on the desired location on the circle to get color data.'
        },

        'currentColor': {
            type: 'display-item',
            label: 'Picker',
        },

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
    },

    code: (root, display, settings) => {
        // clearing prev created animation threads
        window.runningAnimations.clearQueue();

        // timestamp to current scene's canvas elem
        const timestamp = Date.now();

        // reset the element state to remove all previously applied event handlers
        let canvas = resetElement(root.querySelector('canvas'), `canvas-${timestamp}`);
        
        // basic canvas values
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d', { willReadFrequently: true });

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
        const draw = (opacity) => {
            opacity = opacity / 100;

            context.clearRect(
                0, 0,
                width,
                height
            );

            // Drawing shading behind a circle
            drawShadow(context, {
                radius: radius * 2,
                opacity: opacity,
            });

            // drawning special layer under spectrum circle
            // layer color depends on 'darkerk-lighter' slider range at UI Controls panel
            drawCircle(context, {
                cx: canvas.width / 2,
                cy: canvas.height / 2,
                r: radius - 0.6,
                fillColor: opacity > 0.5 ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
                borderColor: opacity > 0.5 ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
            });

            // Drawing spectrum circle (using built-in methods)
            drawSpectrum(context, {
                radius: radius,
                opacity: opacity,
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

                opacity: opacity,
            });
        }

        // setting default values
        let defaultValue = 50;
        settings.setState('adjustment-slider', defaultValue);
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
         * Select color under mouse and updates info at html display.
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
                let colorText = settings.getState('use-hex') === true ? rgba2hex(r, g, b, 1) : `rgba(${r}, ${g}, ${b}, 1)`;

                // color for css 'color' prop of html element with color code
                let cssTextColor = correctColor(color, settings.getState('adjustment-slider'));

                // color for css 'background' prop of html element with color code
                let cssBackgroundColor = changeColorOpacity(color, 0.35);

                // update value of 'Current color' display option
                display.updateValue('currentColor',
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
 * @param {Object[]} param.colorOrder - order of color objects, where color object = {name: 'name, offset: 10}
 * @param {opacity} param.opacity - opacity of colors
 */
function drawColorLabels(context, {radius, colorOrder, opacity}){
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
            if(opacity < 0.05) colorText = 'BLACK';
            if(opacity > 0.99) colorText = 'WHITE';

            // update current color label angle
            currentMainAngle += mainAngleStep;

            // draw color label
            context.fillText(colorText, textPosition.x, textPosition.y);
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
 * @param {Number} param.opacity - opacity of spectrum color (from 0 to 1)
 */
function drawSpectrum(context, {radius = 120, opacity = 1} = {}){
    const width = context.canvas.width;
    const height = context.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2
    
    // Range left side | Middle | Range right side 
    // 0$................100%.....................0%
    // <------------------()----------------------->
    opacity = opacity > 0.5 ? 1 - opacity : opacity;
    opacity = opacity * 2;
   
    /**
     * we adjust the colors manually, for seamlessness we duplicate the color of the beginning and end, 
     * however, this causes a slight asymmetry in the arrangement of colors
     */
    const gradient = context.createConicGradient(-20, width/2, height/2);
    const colors = [ 
        `rgba(255, 0, 0, ${opacity})`, // pure red

        `rgba(255, 255, 0, ${opacity})`, // mix

        `rgba(0, 255, 0, ${opacity})`, // pure green

        `rgba(0, 255, 255, ${opacity})`, // mix

        `rgba(0, 0, 255, ${opacity})`, // pure blue

        `rgba(155, 0, 255, ${opacity})`, // mix

        `rgba(255, 0, 0, ${opacity})`, // pure red
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
        pickerRound.style.left = x + 23 + 'px';
        pickerRound.style.top = y + 51 + 'px';
    }
}