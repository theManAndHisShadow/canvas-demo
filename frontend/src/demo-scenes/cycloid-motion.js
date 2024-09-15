let cycloidMotionScene = new Scene({
    title: 'Cycloid motion', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'A cycloid is the curve traced by a point on the circumference of a circle as it rolls along a straight line. The key condition in this motion is that the circle rolls without slipping. A specific example of a cycloid is the epicycloid, where a circle rolls inside a larger circle. An example of an hypocycloid is demonstrated in the interactive scene.',
        },

        'cycloids_info': {
            type: 'display-item',
            label: 'Rendered curves',
        },

        'preset': {
            type: 'preset-dropdown-list',
            label: 'Preset',
            selectedByDefault: 0,
            options: [
                {name: 'Hypocycloid overview', allowedElements: ['speed']},
                {name: 'Flat roses curves overview', allowedElements: ['speed']},
                {name: 'Spiral', allowedElements: ['speed']},
                {name: 'Playground', allowedElements: ['*']}, 
            ],
        },

        'externalRadius': {
            type: 'input',
            label: 'Radius of external circle',
            defaultValue: 120, // 150
            minValue: 60,
            maxValue: 195,
        },

        'internalRadius': {
            type: 'input',
            label: 'Radius of inner circle',
            defaultValue: 30, // 50
            minValue: 10,
            maxValue: 100,
        },

        'radiusOfTracePoint': {
            type: 'input',
            label: 'Radius of trace point',
            minValue: 3,
            defaultValue: 30,
            maxValue: 100,
        },

        'traceLength': {
            type: 'input',
            label: 'Trace length',
            minValue: 200,
            defaultValue: 600,
            maxValue: 10000,
        },

        'speed': {
            type: 'input',
            label: 'Speed',
            minValue: 0,
            defaultValue: 3,
            maxValue: 20,
        },

        'invertRotationDirection': {
            type: 'checkbox',
            label: 'Invert circles rotation dirtection',
            state: true,
        },

        'drawCenterPoint': {
            type: 'checkbox',
            label: 'Draw center point',
            state: true,
        },

        'drawRadiusLine': {
            type: 'checkbox',
            label: 'Draw radius line',
            state: true,
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
        const centerX = width / 2;
        const centerY = height / 2;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d', { willReadFrequently: true });

        // declaring all constructor interactive param names
        const paramKeyNames = [
            'externalRadius',
            'internalRadius',
            'drawCenterPoint',
            'drawRadiusLine',
            'speed',
            'traceLength',
            'invertRotationDirection',
            'radiusOfTracePoint'
        ];

        // local helper function to fast updating states of params
        const getCycloidParams = () => {
            return paramKeyNames.reduce((acc, key) => {
                acc[key] = settings.getState(key);
                return acc;
            }, {})
        };

        // get initial param of cycloid
        let speed = settings.getState('speed');
        let traceLength = settings.getState('traceLength');

        // Using a mapping scheme of approximate visual perception of presets, instead of conditional constructions like "if"
        // If you don't need specific parameter adjustments, get the composed rest part of the parameters using '...getCycloidParams()'
        // All manual adjustments should be made after receiving the '...getCycloidParams()', for their subsequent rewriting default values
        let presets = {
            "0": [
                new Cycloid({
                    label: 'Deltoid',
                    renderer: context,
                    cx: centerX - (centerX * (7/10)),
                    cy: centerY - (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 16.66666666,      
                    radiusOfTracePoint: 10,
                    traceColor: getColor('brightRed'),  
                    traceThickness: 0.1,
                }),

                new Cycloid({
                    label: 'Deltoid',
                    renderer: context,
                    cx: centerX - (centerX * (7/10)),
                    cy: centerY,
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 16.66666666,      
                    radiusOfTracePoint: 16.66666666, 
                    traceColor: getColor('deepOrange'),
                    traceThickness: 0.1,
                }),

                new Cycloid({
                    label: 'Deltoid',
                    renderer: context,
                    cx: centerX - (centerX * (7/10)),
                    cy: centerY + (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 16.66666666,      
                    radiusOfTracePoint: 31, 
                    traceColor: getColor('amber'),
                    traceThickness: 0.1,
                }),

                new Cycloid({
                    label: 'Astroid',
                    renderer: context,
                    cx: centerX - (centerX * (2/10)) - 10,
                    cy: centerY - (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 12.5,      
                    radiusOfTracePoint: 5,
                    traceColor: getColor('green'),  
                    traceThickness: 0.1,
                }),

                new Cycloid({
                    label: 'Astroid',
                    renderer: context,
                    cx: centerX - (centerX * (2/10)) - 10,
                    cy: centerY,
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 12.5,      
                    radiusOfTracePoint: 12.5, 
                    traceColor: getColor('teal'),
                    traceThickness: 0.1,
                }),

                new Cycloid({
                    label: 'Astroid',
                    renderer: context,
                    cx: centerX - (centerX * (2/10)) - 10,
                    cy: centerY + (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 12.5,      
                    radiusOfTracePoint: 25, 
                    traceColor: getColor('blue'),
                    traceThickness: 0.1,
                }),

                new Cycloid({
                    label: 'Pentoid',
                    renderer: context,
                    cx: centerX + (centerX * (3/10)) - 20,
                    cy: centerY - (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 10,      
                    radiusOfTracePoint: 3,
                    traceColor: getColor('indigo'),  
                    traceThickness: 0.1,
                }),

                new Cycloid({
                    label: 'Pentoid',
                    renderer: context,
                    cx: centerX + (centerX * (3/10)) - 20,
                    cy: centerY,
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 10,      
                    radiusOfTracePoint: 10, 
                    traceColor: getColor('deepPurple'),
                    traceThickness: 0.1,
                }),

                new Cycloid({
                    label: 'Pentoid',
                    renderer: context,
                    cx: centerX + (centerX * (3/10))  - 20,
                    cy: centerY + (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 10,      
                    radiusOfTracePoint: 20, 
                    traceColor: getColor('fuchsia'),
                    traceThickness: 0.1,
                }),


                new Cycloid({
                    label: 'Exoid',
                    renderer: context,
                    cx: centerX + (centerX * (7/10)),
                    cy: centerY - (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 8.33333,      
                    radiusOfTracePoint: 3,
                    traceColor: getColor('mediumVioletRed'),  
                    traceThickness: 0.1,
                }),

                new Cycloid({
                    label: 'Exoid',
                    renderer: context,
                    cx: centerX + (centerX * (7/10)),
                    cy: centerY,
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 8.33333,      
                    radiusOfTracePoint: 8.33333, 
                    traceColor: getColor('crimson'),
                    traceThickness: 0.1,
                }),

                new Cycloid({
                    label: 'Exoid',
                    renderer: context,
                    cx: centerX + (centerX * (7/10)),
                    cy: centerY + (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 8.33333,      
                    radiusOfTracePoint: 18, 
                    traceColor: getColor('brightRed'),
                    traceThickness: 0.1,
                }),
            ],


            "1": [
                new Cycloid({
                    label: 'Circle',
                    renderer: context,
                    cx: centerX - (centerX * (7/10)),
                    cy: centerY - (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 25,      
                    radiusOfTracePoint: 25,
                    traceColor: getColor('brightRed'),  
                    traceThickness: 0.1,
                    invertRotationDirection: false,
                }),

                new Cycloid({
                    label: 'Cardioid',
                    renderer: context,
                    cx: centerX - (centerX * (7/10)),
                    cy: centerY,
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 16.6666666666,   
                    radiusOfTracePoint: 16.6666666666, 
                    traceColor: getColor('deepOrange'),
                    traceThickness: 0.1,
                    invertRotationDirection: false,
                }),

                new Cycloid({
                    label: 'Two leaf rose',
                    renderer: context,
                    cx: centerX - (centerX * (7/10)),
                    cy: centerY + (centerY * (3/5)),
                    ...getCycloidParams(),   
                    externalRadius: 50,     
                    internalRadius: 12.5,      
                    radiusOfTracePoint: 12.5, 
                    traceColor: getColor('amber'),
                    traceThickness: 0.1,
                    invertRotationDirection: false, 
                }),

                new Cycloid({
                    label: 'Three leaf rose',
                    renderer: context,
                    cx: centerX - (centerX * (2/10)) - 10,
                    cy: centerY - (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 9.99,      
                    radiusOfTracePoint: 6,
                    traceColor: getColor('green'),  
                    traceThickness: 0.1,
                    invertRotationDirection: false, 
                }),

                new Cycloid({
                    label: 'Three leaf rose',
                    renderer: context,
                    cx: centerX - (centerX * (2/10)) - 10,
                    cy: centerY,
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 9.99,      
                    radiusOfTracePoint: 9.99,
                    traceColor: getColor('teal'),
                    traceThickness: 0.1,
                    invertRotationDirection: false, 
                }),

                new Cycloid({
                    label: 'Three leaf rose',
                    renderer: context,
                    cx: centerX - (centerX * (2/10)) - 10,
                    cy: centerY + (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 9.99,      
                    radiusOfTracePoint: 20,
                    traceColor: getColor('blue'),
                    traceThickness: 0.1,
                    invertRotationDirection: false, 
                }),

                new Cycloid({
                    label: 'Four leaf rose',
                    renderer: context,
                    cx: centerX + (centerX * (3/10)) - 20,
                    cy: centerY - (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 8.33333,      
                    radiusOfTracePoint: 3,
                    traceColor: getColor('indigo'),  
                    traceThickness: 0.1,
                    invertRotationDirection: false, 
                }),

                new Cycloid({
                    label: 'Four leaf rose',
                    renderer: context,
                    cx: centerX + (centerX * (3/10)) - 20,
                    cy: centerY,
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 8.33333,      
                    radiusOfTracePoint: 8.33333, 
                    traceColor: getColor('deepPurple'),
                    traceThickness: 0.1,
                    invertRotationDirection: false, 
                }),

                new Cycloid({
                    label: 'Four leaf rose',
                    renderer: context,
                    cx: centerX + (centerX * (3/10))  - 20,
                    cy: centerY + (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 8.33333,      
                    radiusOfTracePoint: 18, 
                    traceColor: getColor('fuchsia'),
                    traceThickness: 0.1,
                    invertRotationDirection: false, 
                }),


                new Cycloid({
                    label: 'Five leaf rose',
                    renderer: context,
                    cx: centerX + (centerX * (7/10)),
                    cy: centerY - (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 7.1,      
                    radiusOfTracePoint: 3,
                    traceColor: getColor('mediumVioletRed'),  
                    traceThickness: 0.1,
                    invertRotationDirection: false, 
                }),

                new Cycloid({
                    label: 'Five leaf rose',
                    renderer: context,
                    cx: centerX + (centerX * (7/10)),
                    cy: centerY,
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 7.1,      
                    radiusOfTracePoint: 7.1, 
                    traceColor: getColor('crimson'),
                    traceThickness: 0.1,
                    invertRotationDirection: false, 
                }),

                new Cycloid({
                    label: 'Five leaf rose',
                    renderer: context,
                    cx: centerX + (centerX * (7/10)),
                    cy: centerY + (centerY * (3/5)),
                    ...getCycloidParams(),
                    externalRadius: 50,     
                    internalRadius: 7.1,      
                    radiusOfTracePoint: 18, 
                    traceColor: getColor('brightRed'),
                    traceThickness: 0.1,
                    invertRotationDirection: false, 
                }),
            ],

            '2': [
                new Cycloid({
                    label: 'Spiral curve',
                    renderer: context,
                    cx: centerX,
                    cy: centerY,
                    ...getCycloidParams(),
                    traceColor: getColor('indigo'),  
                    externalRadius: 190,     
                    internalRadius: 95,      
                    internalInitialAngle: -180,
                    internalRotationGain: 1.015,
                    radiusOfTracePoint: 95, 
                    traceLength: 10000,
                    traceThickness: 0.1,
                    invertRotationDirection: false, 
                }),
            ], 

            '3': [
                new Cycloid({
                    label: 'Custom curve',
                    renderer: context,
                    cx: centerX,
                    cy: centerY,
                    ...getCycloidParams(),
                    traceColor: getColor('red'),  
                }),
            ], 
        }
        
        // by default - 0
        let currentPresetIndex = 0;
        let preset = presets[currentPresetIndex] || [];
        let renderedCurvesTextInfo = ``;
        settings.subscribe((key, newValue, oldValue) => {
            // if current change is preset switching - update curr preset index and preset ref
            if(key == 'preset') {
                currentPresetIndex = newValue;
                preset = presets[currentPresetIndex];
                renderedCurvesTextInfo = ``;
            }

            

            // update sandbox cycloid's params using update function
            preset.forEach((cycloid, i) => {
                // 3 - index of sandbox preset
                if(currentPresetIndex == 3) {
                    // update params of sandbox cycloid from ui
                    let updatedParams = getCycloidParams();

                    for(let [key, value] of Object.entries(updatedParams)) {
                        // ignore some param changing from ui using 'continue' keyword for 'non-sandbox' presets
                        if (currentPresetIndex !== 3 && (key === 'externalRadius' || key === 'internalRadius' || key === 'radiusOfTracePoint')) {
                            continue;
                        }
    
                        // updating each param using 'key' and 'value'
                        cycloid.update(key, value);
                    }
                } else {
                    if(key == 'speed') {
                        speed = newValue;
                    }
                }

                // hotfix bug on 'sandbox' preset
                if(currentPresetIndex == 3) {
                    renderedCurvesTextInfo = `
                        <br>
                        <span class="small-font display-item__list-item">
                            <span 
                                class="small-font gray-word-bubble" 
                                style="color: ${cycloid.traceColor}; background: ${changeColorOpacity(cycloid.traceColor, 0.25)};"
                            >${cycloid.label} #${i +1}</span><span> - R/r = ${(cycloid.proportion.externalRadius/cycloid.proportion.internalRadius).toFixed(0)}/1, d ${cycloid.proportion.internalRadius == cycloid.proportion.radiusOfTracePoint ? '=' :  cycloid.proportion.radiusOfTracePoint > cycloid.proportion.internalRadius  ? '>' : '<'} r</span>
                        </span>
                    `;
                } else {
                    // renderedCurvesTextInfo += `
                    //     <br>
                    //     <span class="small-font display-item__list-item">
                    //         <span 
                    //             class="small-font gray-word-bubble" 
                    //             style="color: ${cycloid.traceColor}; background: ${changeColorOpacity(cycloid.traceColor, 0.25)};"
                    //         >${cycloid.label} #${i +1}</span><span> - R/r = ${(cycloid.proportion.externalRadius/cycloid.proportion.internalRadius).toFixed(0)}/1, d ${cycloid.proportion.internalRadius == cycloid.proportion.radiusOfTracePoint ? '=' :  cycloid.proportion.radiusOfTracePoint > cycloid.proportion.internalRadius  ? '>' : '<'} r</span>
                    //     </span>
                    // `;
                }
            });

            display.updateValue('cycloids_info', `${renderedCurvesTextInfo}`);
        });


        // Main function
        let loop = () => {
            context.clearRect(
                0, 0,
                width,
                height
            );

            drawRect(context, {
                x: 0,
                y: 0,
                width: width,
                height: height,
                fillColor: getColor('black', 0.98),
            });
            
            // process each precet cycloid
            preset.forEach(cycloid => {
                // animate cycloid
                cycloid.animate(speed);

                // draw cycloid each time when frame is updated
                cycloid.render();
            });
        }

        // animate
        window.runningAnimations.add(loop);
    }
});


// Exproting scene
window.exportedObjects.push(cycloidMotionScene);

/**
* Scene file internal helper function defenitions
*/


/**
 * A class that tracks the movement of a point along a trajectory and draws that trajectory
 */
class Tracer {
    #trace = [];
    constructor({color, length = 100, thickness = 1, parent}){

        this.length = length;
        this.color = color;
        this.thickness = thickness,

        this.parent = parent;
    }


    /**
     * Add point to trace array
     * @param {{x: number, y: number}} point 
     */
    push(point){
        // if point x and y is correct values
        if(typeof point.x == 'number' && typeof point.y == 'number'){
            // if overload - remove first elements
            if(this.#trace.length > this.length) {
                this.#trace.shift();
            }

            this.#trace.push(point);
        }
    }


    /**
     * Returns trace last point.
     * @returns {{x: number, y: number}} - last point of trace
     */
    getLastPoint(){
        return this.#trace.length > 0 ? getArrayLast(this.#trace) : false;
    }


    /**
     * Returns trace array length.
     * @returns {Number} - length of trace array
     */
    getLength() {
        return this.#trace.length;
    }


    /**
     * Resets Tracer points array.
     */
    clear(){
        this.#trace = [];
    }


    /**
     * Renders trace using efficient method.
     */
    render(){
        this.parent.renderer.beginPath();
        this.parent.renderer.strokeStyle = this.color;
        this.parent.renderer.lineWidth = 1;

        // checks if is first point
        let firstPoint = true;

        // draw trace fragmet by fragment using all current trace
        this.#trace.forEach(point => {
            if (firstPoint) {
                this.parent.renderer.moveTo(point.x, point.y);
                firstPoint = false;
            } else {
                this.parent.renderer.lineTo(point.x, point.y);
            }
        });

        // end trace
        this.parent.renderer.stroke();
    }
}


class BasicCircelBone {
    /**
     * 
     * @param {object} param.parent - parent object of class instance
     * @param {number} param.cx - x pos of circle center
     * @param {number} param.cy - y pos of circle center
     * @param {number} param.radius - radius of circle center
     * @param {string} param.fillColor - color if circle fill
     * @param {string} param.borderColor - color of circle border line
     * @param {number} param.borderThickness - thickness of circle border
     * @param {number} param.type - type of circle (internal or external)
     * @param {boolean} param.drawCenterPoint - draw or not center point of circle
     * @param {boolean} param.drawRadiusLine - draw or not radius line of circle3
     * @param {CanvasRenderingContext2D} param.renderer - where the circle will be drawn
     */
    constructor({
        id = null, 
        type, 
        parent, 
        renderer, 
        cx, cy, radius, 
        borderColor, borderThickness, fillColor, 
        drawCenterPoint = false, drawRadiusLine = false
    }) {
        this.id = id; 
        this.parent = parent; 
        this.cx = cx; 
        this.cy = cy; 
        this.radius = radius; 
        this.fillColor = fillColor; 
        this.borderColor = borderColor; 
        this.borderThickness = borderThickness; 
        this.type = type; 
        this.renderer = renderer; 
        this.drawCenterPoint = drawCenterPoint; 
        this.drawRadiusLine = drawRadiusLine;
    }

    /**
     * Renders circle bone
     */
    render(){    
        // circle line
        drawCircle(this.renderer, {
            cx: this.cx,
            cy: this.cy,
            r: this.radius, 
            borderThickness: this.borderThickness,
            borderColor: this.borderColor,
            fillColor: this.fillColor,
        });

        if(this.drawCenterPoint === true) {
            // circle's center
            drawCircle(this.renderer, {
                cx: this.cx,
                cy: this.cy,
                r: 1, 
                borderThickness: this.borderThickness,
                borderColor: this.borderColor,
                fillColor: this.borderColor, // not typo!
            });
        }
    }
}



class StaticCircleBone extends BasicCircelBone {
    /**
     * 
     * @param {object} param.parent - parent object of class instance
     * @param {number} param.cx - x pos of circle center
     * @param {number} param.cy - y pos of circle center
     * @param {number} param.radius - radius of circle center
     * @param {string} param.fillColor - color if circle fill
     * @param {string} param.borderColor - color of circle border line
     * @param {number} param.borderThickness - thickness of circle border
     * @param {number} param.type - type of circle (internal or external)
     * @param {boolean} param.drawCenterPoint - draw or not center point of circle
     * @param {boolean} param.drawRadiusLine - draw or not radius line of circle3
     * @param {CanvasRenderingContext2D} param.renderer - where the circle will be drawn
     */
    constructor({
        id = null, 
        type, 
        parent, 
        renderer, 
        cx, cy, radius, 
        borderColor, borderThickness, fillColor, 
        drawCenterPoint = false, drawRadiusLine = false
    }) {
        super(arguments[0]);
    }
}


class DynamicCircleBone extends BasicCircelBone {
    /**
     * super class params
     * @param {object} param.parent - parent object of class instance
     * @param {number} param.cx - x pos of circle center
     * @param {number} param.cy - y pos of circle center
     * @param {number} param.radius - radius of circle center
     * @param {string} param.fillColor - color if circle fill
     * @param {string} param.borderColor - color of circle border line
     * @param {number} param.borderThickness - thickness of circle border
     * @param {number} param.type - type of circle (internal or external)
     * @param {boolean} param.drawCenterPoint - draw or not center point of circle
     * @param {boolean} param.drawRadiusLine - draw or not radius line of circle3
     * @param {CanvasRenderingContext2D} param.renderer - where the circle will be drawn
     * 
     * new class params
     * @param {{x: number, y: number}} param.origin - center rotation (epicenter)
     * @param {number} param.offset - offset between instance and static circle
     * @param {number} param.angle - local angle of circle (nears it center)
     * @param {number} param.traceLength - length of trace
     * @param {string} param.traceColor - color of trace
     * @param {number} param.traceThickness - thickness of trace line
     * @param {number} param.radiusOfTracePoint - radius of trace point 
     * @param {boolean} param.invertRotationDirection - direction of rotation
     */
    constructor({
        id = null, 
        type, 
        parent, 
        renderer, 
        cx, cy, radius, 
        borderColor, borderThickness, fillColor, 
        drawCenterPoint = false, drawRadiusLine = false,
        
        origin, offset, angle = 0,
        traceLength = 1000, traceColor = getColor('red'), traceThickness, radiusOfTracePoint,
        invertRotationDirection = false, 
    }){
        super({id, type, parent, renderer, cx, cy, radius, borderColor, borderThickness, fillColor, drawCenterPoint, drawRadiusLine});
        
        // set positioning parameters (pivot point, angle, global angle, etc.)
        this.origin = origin || {x: this.parent.cx, y: this.parent.cy};
        this.offset = offset;
        this.angle = angle;
        this.globalAngle = 0;

        // se satic cx and cy for correct rotation
        this.staticCX = cx;
        this.staticCY = cy - offset;

        // set trace objet
        this.trace = new Tracer({
            color: traceColor,
            length: traceLength, // 200
            thickness: traceThickness,
            parent: this,
        });
         
        // misc aprams
        this.radiusOfTracePoint = radiusOfTracePoint;  
        this.invertRotationDirection = invertRotationDirection;
    }



    /**
     * Rotate circle around its center
     * @param {number} step - rotation step
     */
    rotate(step){
        this.angle += step;

        if(this.angle >= 360) this.angle = 0;
    }


   /**
     * Moves circle around origin point (epicenter)
     * @param {number} step 
     */
    moveAroundOrigin(step = 1) {
        this.globalAngle = (this.globalAngle + step) % 360;

        const rotatedCenter = rotatePoint(
            this.origin.x, 
            this.origin.y, 
            this.staticCX, 
            this.staticCY, 
            this.globalAngle
        );

        if (rotatedCenter && typeof rotatedCenter.x === 'number' && typeof rotatedCenter.y === 'number') {
            this.cy = rotatedCenter.y - this.offset;
            this.cx = rotatedCenter.x
        }
    }


    /**
     * Renders circle bone
     */
    render(){    
        let corrected_x = this.cx + 0; // no offset
        let corrected_y = this.cy + this.offset;

        // circle line
        drawCircle(this.renderer, {
            cx: corrected_x,
            cy: corrected_y,
            r: this.radius, 
            borderThickness: this.borderThickness,
            borderColor: this.borderColor,
            fillColor: this.fillColor,
        });

        if(this.drawCenterPoint === true) {
            // circle's center
            drawCircle(this.renderer, {
                cx: corrected_x,
                cy: corrected_y,
                r: 1, 
                borderThickness: this.borderThickness,
                borderColor: this.borderColor,
                fillColor: this.borderColor, // not typo!
            });
        }

        // loacal helper funcion
        // limits the discreteness of tracing 
        let discretLimiter = (newPoint, distanceLimit) => {
            if(this.trace.length > 0) {
                // get prev point
                let prevPoint = this.trace.getLastPoint();

                // get distanse between new point and prev point
                let distance = getDistanseBetweenTwoPoint(prevPoint.x, prevPoint.y, newPoint.x, newPoint.y);

                // if distance greater than limit - return true else - false
                return distance >= distanceLimit ? true : false;
            } else return false;
        }

        // new poin after rotations
        let rotatedPoint = rotatePoint(corrected_x, corrected_y, corrected_x, corrected_y + this.radiusOfTracePoint, this.angle);

        // add point if
        // - it first point of trace
        // - or the discreteness function allows for addition
        if(this.trace.getLength() == 0 || discretLimiter(rotatedPoint, 3)) {
            this.trace.push(rotatedPoint);
        }


        // radius line line from center to cicrlce line
        if(this.drawRadiusLine === true) {
            // radius line of circle
            drawLine(this.renderer, {
                x1: corrected_x,
                y1: corrected_y,
                x2: rotatedPoint.x,
                y2: rotatedPoint.y,
                thickness: this.borderThickness,
                color: this.borderColor,
            });

            // draw point on circle line
            drawCircle(this.renderer, {
                cx: rotatedPoint.x,
                cy: rotatedPoint.y,
                r: 1, 
                borderThickness: 1,
                borderColor: getColor('white'),
                fillColor: getColor('white'),
            });
        }
    }
}



/**
 * Main class
 */
class Cycloid {
    constructor({
        cx, cy, label = '', animationSpeed, externalRadius, internalRadius, drawCenterPoint, 
        traceColor = getColor('white'), traceThickness = 1, traceLength, drawRadiusLine, renderer, 
        invertRotationDirection, radiusOfTracePoint, internalRotationGain = 1, internalInitialAngle = 0
    }){
        this.renderer = renderer;

        this.cx = cx;
        this.cy = cy;

        this.label = label;

        this.animationSpeed = animationSpeed;

        // for spirals, by default = 1
        this.internalRotationGain = internalRotationGain;

        this.drawCenterPoint = drawCenterPoint;

        this.traceColor = traceColor;

        this.proportion = {
            externalRadius: externalRadius,
            internalRadius: internalRadius,
            radiusOfTracePoint: radiusOfTracePoint,
        }

        // some helper value
        let delta_radius = externalRadius - internalRadius;

        // create 2 bone - external and internal
        this.skeleton = [
            // external bone
            new StaticCircleBone({
                id: 0,
                type: 'external',
                cx: this.cx,
                cy: this.cy,
                parent: this,
                radius: externalRadius,
                fillColor: 'transparent',
                borderColor: getColor('white', 0.45),
                borderThickness: 1,
                renderer: this.renderer,
                drawCenterPoint: drawCenterPoint,
                drawRadiusLine: drawRadiusLine,
            }),

            // inner circle 1
            new DynamicCircleBone({
                id: 1,
                type: 'internal',
                cx: this.cx,
                cy: this.cy,
                angle: internalInitialAngle,
                offset: -delta_radius,
                radius: internalRadius,
                fillColor: 'transparent',
                borderColor: getColor('white', 0.45),
                traceLength: traceLength,
                traceThickness: traceThickness,
                traceColor: traceColor,
                borderThickness: 1,
                drawCenterPoint: drawCenterPoint,
                drawRadiusLine: drawRadiusLine,
                parent: this,
                renderer: this.renderer,
                invertRotationDirection: invertRotationDirection,
                radiusOfTracePoint: radiusOfTracePoint,
            })
        ];
    }


    /**
     * Updates the values of the cycloid and its bones (circles) parameters.
     * @param {string} keyName - The parameter key name to update.
     * @param {any} newValue - The new value to assign to the parameter.
     */
    update(keyName, newValue) {
        // Update parameters for the bones (external and internal circles)
        this.skeleton.forEach(bone => {
            if( keyName === 'drawCenterPoint') {
                bone.drawCenterPoint = newValue;
            }

            if(keyName === 'invertRotationDirection' || keyName === 'radiusOfTracePoint' || keyName == 'drawRadiusLine') {
                let internals = this.skeleton.filter(bone => bone.type === 'internal');
                internals.forEach(internalBone => { internalBone[keyName] = newValue });
            }

            if(keyName == 'traceLength') {
                let internals = this.skeleton.filter(bone => bone.type === 'internal');
                internals.forEach(bone => {
                    bone.trace.length = newValue;
                });
            }

            // If the external radius is being updated, adjust related values
            if (bone.type === 'external' && keyName === 'externalRadius') {
                let externalBone = bone;
                let internals = this.skeleton.filter(bone => bone.type === 'internal');
                
                // Update the external circle's radius
                externalBone.radius = newValue;

                internals.forEach(internalBone => {
                    // Determine the offset direction: one internal circle moves upwards (1), the other downwards (-1)
                    let direction = internalBone.offset >= 0 ? 1 : -1;

                    // Calculate the new offset based on the external and internal radii and direction (updatin delta radius)
                    internalBone.offset = direction * (newValue - internalBone.radius);

                    // Recalculate the internal circle's initial coordinates based on the new offset
                    internalBone.staticCX = externalBone.cx;

                    // Adjust the internal circle's y-coordinate considering the external circle's radius
                    internalBone.staticCY = externalBone.cy + (direction * (externalBone.radius - internalBone.radius));

                    // Clear the trace (history of points) to start a fresh trace with the new settings
                    internalBone.trace.clear();
                });
            }

            // If the internal radius is being updated, adjust related values
            if (bone.type === 'internal' && keyName === 'internalRadius') {
                let externalBone = this.skeleton.find(bone => bone.type === 'external');
                let internalBone = bone;

                // Update the internal circle's radius
                internalBone.radius = newValue;

                // Determine the offset direction again
                let direction = internalBone.offset >= 0 ? 1 : -1;

                // Recalculate the offset and initial coordinates based on the new internal radius
                internalBone.offset = direction * (externalBone.radius - internalBone.radius);
                internalBone.staticCX = externalBone.cx;

                // Adjust the internal circle's y-coordinate considering the external circle's radius
                internalBone.staticCY = externalBone.cy + direction * (externalBone.radius - internalBone.radius);

                // Clear the trace to restart it with the new settings
                internalBone.trace.clear();
            }
        });
    }



    /**
     * Animates cycloid
     */
    animate(speed = 1){
        speed = speed / 5;

        // get external circle
        let externalCircle = this.skeleton.find(bone => bone.type == 'external');
    
        // get all internal circles
        let allInternalCircles = this.skeleton.filter(bone => bone.type == 'internal');
        
        allInternalCircles.forEach(bone => {
            // Calculate the angle multiplier using the exact formula
            let m = (externalCircle.radius - bone.radius) / bone.radius;
            let rotationSpeed = (bone.invertRotationDirection === true ? -1 : 1) * speed;

            let rotationGain = bone.parent.internalRotationGain;
            
            // rotate particular bone using the calculated multiplier
            bone.rotate((rotationSpeed * m) * rotationGain);
    
            // move the bone around the origin
            bone.moveAroundOrigin(speed);
        });
    }


    /**
     * Renders cycloid bones.
     */
    render(){
        this.skeleton.forEach(bone => {
            // if bone has trace - render trace
            if(bone.trace && bone.trace.length > 0) {
                bone.trace.render();
            }

            // render single bone
            bone.render();
        });
    }
}