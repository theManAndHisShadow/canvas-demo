let cartesianPlane = new Scene({
    title: 'Cartesian plane demo', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Cartesian coordinate system in a plane is a coordinate system that specifies each point uniquely by a pair of real numbers called coordinates, which are the signed distances to the point from two fixed perpendicular oriented lines, called coordinate lines or coordinate axes.'
        },

        'centerViewAction': {
            type: 'button',
            text: 'reset',
            label: 'Center view',
        },

        'selectedPreset': {
            type: 'option-selector',
            label: 'Choose preset',
            optionNames: [
                'Single points',            // 0
                'Segments',                 // 1
                'Line',                     // 2
                'Quadratic parabola',       // 3
                'Cubic parabola',           // 4
                'Hyperbola',                // 5
                'Exponential curve',        // 6
            ],
            defaultValue: 0,
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

        const context = canvas.getContext('2d');

        const plane = new CartesianPlane({
            renderer: context,
            cx: width / 2,
            cy: height / 2,

            gridCellSize: 10,
            gridLineColor: 'rgba(35, 35, 35, 0.35)',
            gridLineThickness: 1,
            axisColor: 'white',
            fillColor: 'black',
        });

        plane.render();

        // very important scene var
        let mouseIsDown = false;

        /**
         * We use a separate variable to remember the place where the user pressed the left mouse button, 
         * this will be the starting position of the moving process. When user releases the mouse button we store 'mouseUp' pos
         * and recalculate delta of 'start' and 'stop' position.
         */
        let downPos = { x: 0, y: 0 };
        let deltaPos = { x: 0, y: 0 };
        
        // All redraw and move actions only at 'mouseIsDown' == true and when mouse is moving
        canvas.addEventListener('mousemove', (event) => {
            if (mouseIsDown) {
                let localPos = getMousePos(canvas, event);
        
                deltaPos = {
                    x: localPos.x - downPos.x,
                    y: localPos.y - downPos.y
                };
        
                downPos = localPos;
        
                // move using delta
                plane.move(deltaPos, 1);

                // redraw 
                plane.render();
            }
        });
        
        // Check is mouse clicked
        canvas.addEventListener('mousedown', (event) => {
            // set important value as true
            mouseIsDown = true;
        
            let localPos = getMousePos(canvas, event);
            
            // update scene-global var
            downPos = {
                x: localPos.x,
                y: localPos.y
            };
            
            // update cursor style
            canvas.style.cursor = 'grab';
            setTimeout(() => {
                canvas.style.cursor = 'grabbing';
            }, 120);
        });
        
        // if the user releases the mouse button
        canvas.addEventListener('mouseup', () => {
            // set important var as false
            mouseIsDown = false;
        
            // Update cursor style
            canvas.style.cursor = 'inherit';
        });

        // adding 'redraw' event listener to plane for updating visible area info
        let visibleAreaDisplayElement = ``;
        plane.addEventListener('redraw', () => {
            // format display item element
            visibleAreaDisplayElement = `
                <br/> 
                - x-axis - [${plane.visibleArea.x}], <br/> 
                - y-axis - [${plane.visibleArea.y[0] - 2}, ${plane.visibleArea.y[1]}].
            `;

            // if element already created and existing
            if(display.isExist('visibleArea')) display.updateValue('visibleArea', visibleAreaDisplayElement);
        });

        // renders colored dot label near tile
        const generateColorLabel = (color) => {
            return `
<span style="
    background: ${changeColorOpacity(color, 0.75)}; 
    border: 2px solid ${color}; 
    border-radius: 100%;
    right: 2px;
    width: 8px;
    display: block;
    position: relative;
    height: 8px;
"></span>`
        }

        settings.subscribe((propertyName, newValue, oldValue) => {
            if(propertyName == 'centerViewAction') {
                // reset pos
                plane.moveToOrigin();

                // redraw all
                plane.render();
            }

            if(propertyName == 'selectedPreset') {
                // reset pos
                plane.moveToOrigin();

                // remove all other elements
                plane.clearContent();

                // remove all display elements that generated dynamiclly
                display.removeDynamicllyRendered();

                if(newValue == 0) {
                    // some points set 1
                    let points1 = [
                        new Point('O', 0, 0, 'white' ),

                        new Point("A", 2, 2, getColor("orange"), getColor("red")),
                        new Point("B", -2, 2, getColor("lime"), getColor("green")),
                        new Point("C", -2, -2, getColor("purple"), getColor("deepPurple")),
                        new Point("D", 2, -2, getColor("blue"), getColor("indigo")),
                    ];

                    points1.forEach(point => {
                        plane.add(point);

                        display.dynamicRender(`point${point.label}`, {
                            type: 'display-item',
                            label: `- point <span style="font-weight: bold">${point.label}</span>`,
                            text: `<i style="font-size: 15px">(${point.planeX}, ${point.planeY})</i>`,
                        });
                    });
            
                } else if(newValue == 1) {
                    // some segments
                    const thickness = 1;
                    let array = [
                        new Point('O', 0, 0, 'white'),

                        new Segment(['A', -5.5, 2],  ['B', -1.5, 2], '#ff0000', thickness),
                        new Segment(['B', -1.5, 2],  ['C', 0, 6], '#ff7f00', thickness),
                        new Segment(['C', 0, 6],  ['D', 1.5, 2], '#ffff00', thickness),
                        new Segment(['D', 1.5, 2],  ['E', 5.5, 2], '#7fff00', thickness),
                        new Segment(['E', 5.5, 2],  ['F', 2, 0], 'cyan', thickness),
                        new Segment(['F', 2, 0],  ['G', 3.5, -4], '#007fff', thickness),
                        new Segment(['G', 3.5, -4],  ['H', 0, -2], 'blue', thickness),
                        new Segment(['H', 0, -2],  ['I', -3.5, -4], 'indigo', thickness),
                        new Segment(['I', -3.5, -4],  ['J', -2, 0], 'magenta', thickness),
                        new Segment(['J', -2, 0],  ['A', -5.5, 2], 'crimson', thickness),
                    ];

                    array.forEach(item => {
                        plane.add(item);

                        if(item.constructor.name == 'Point') {
                            display.dynamicRender(`point${item.label}`, {
                                type: 'display-item',
                                label: `- point <span style="font-weight: bold">${item.label}</span>`,
                                text: `<i style="font-size: 15px">(${item.planeX}, ${item.planeY})</i>`,
                            });
                        } else if(item.constructor.name == 'Segment'){
                            display.dynamicRender(`segment${item.startPoint.label + item.endPoint.label}`, {
                                type: 'display-item',
                                label: `- segment <span style="font-weight: bold; color: black; text-shadow: 0px 0px 3px  ${item.color}; border-radius: 3px;"> ${item.startPoint.label}${item.endPoint.label}</span>`,
                                text: `[ <i style="font-size: 15px">(${item.startPoint.planeX}, ${item.startPoint.planeY}), (${item.endPoint.planeX}, ${item.endPoint.planeY})</i> ]`,
                            });
                        } 
                    });
                } else if(newValue >= 2 && newValue <= 6) {
                    const index = newValue - 2;
                    const functions = [
                        [
                            // some test lienar graphs
                            new Graph('x', getColor('red')),
                            new Graph('-x', getColor('orange')),
                            new Graph('{1/3}x', getColor('green')),
                            new Graph('{-1/3}x', getColor('blue')),
                            new Graph('3x', getColor('indigo')),
                            new Graph('-3x', getColor('purple')),
                        ], 

                        [
                            // quadratic functions
                            new Graph('x^2', getColor('red')),
                            new Graph('-x^2', getColor('purple')),
                            new Graph('1/10x^2', getColor('green')),
                            new Graph('-1/10x^2', getColor('cyan')),
                            new Graph('0.25x^2-5', getColor('orange')),
                            new Graph('-0.25x^2+5', getColor('indigo')),
                        ],

                        [
                            // qubic functions
                            new Graph('1/100x^3', getColor('red')),
                            new Graph('-1/100x^3', getColor('blue')),
                            new Graph('x^3+3x^2-6', getColor('amber')),
                            new Graph('-x^3-3x^2+6', getColor('purple')),
                        ],

                        [
                            // hyperbolic
                            new Graph('1/x', getColor('red')),
                            new Graph('-1/x', getColor('purple')),
                            new Graph('2/x', getColor('amber')),
                            new Graph('-2/x', getColor('teal')),
                            new Graph('3/x', getColor('green')),
                            new Graph('-3/x', getColor('cyan')),
                        ],

                        // Exponential
                        [
                            new Graph('e^x', getColor('red')),
                            new Graph('e^{5/10x}', getColor('amber')),
                            new Graph('e^{3/10x}', getColor('lightAmber')),
                            new Graph('e^{2/10x}', getColor('lightBlue')),
                            new Graph('e^1/10x', getColor('blue')),

                            new Graph('-e^1/10x', getColor('deepPurple')),
                        ],
                    ];

                    console.log(functions[index]);

                    // updating info about current visible area of plane
                    display.dynamicRender('visibleArea', {
                        type: 'display-item',
                        label: 'Current visible area',
                        text: visibleAreaDisplayElement,
                    });

                    display.dynamicRender('spacer', {
                        type: 'display-spacer',
                    });

                    display.dynamicRender('function-list-title', {
                        type: 'display-item',
                        label: 'Function graphs drawn',
                        text: functions[index].length,
                    });

                    // make actions with each graph
                    functions[index].forEach((graph, i) => {
                        plane.add(graph);

                        // show function formula to display UI
                        display.dynamicRender('function-formula-' + i, {
                            type: 'display-float-tile',
                            hideColon: true,
                            label: generateColorLabel(graph.color),
                            text: `ƒ(x) = ${display.renderFormula(graph.formula)};`
                        });
                    });
                } 

                plane.render();
            }
        });


        // Some trick to set first (index 0) preset as default preset
        settings.setState('selectedPreset', 2);
    }
});


// Exproting scene
window.exportedObjects.push(cartesianPlane);

/**
* Scene file internal helper function defenitions
*/



/**
 * Helper class for managing custom events
 */
class SynteticEventTarget2 {
    constructor (){
        this.events = {};
    }

    
    /**
     * Adds event to target
     * @param {string} eventType - text name of custom event (move, rotate, create etc)
     * @param {Function} callback - handler if event is triggered
     */
    addEventListener(eventType, callback) {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }

        this.target = this;
        this.events[eventType].push(callback);
    }

    
    /**
     * Method that triggers event
     * @param {string} eventType - text name of custom event (move, rotate, create etc)
     * @param {object} data - some event data, passed into event handler scope
     */
    dispatchEvent(eventType, data) {
        if (this.events[eventType]) {
            this.events[eventType].forEach(callback => callback(data));
        }
    }
}



/**
 * Base class for rendering. Contains the basis for the structure of other classes.
 */
class PlanePrimitive {
    constructor(renderer){
        // N.B.: This property is null until it is manually configured during 'the add to context' step.
        this.renderer = renderer || null;

        this.parent = null;
    }
}



/**
 * Point element class.
 */
class Point extends PlanePrimitive {
    /**
     * 
     * @param {string} label - label of point
     * @param {number} x - x pos of point
     * @param {number} y - y pos of point
     * @param {string} color - color of point
     * @param {string} labelColor - color of text label
     */
    constructor(label, x, y, color, labelColor = 'white'){
        super();

        // The difference between property a and property b is that this property contains 
        // the initially transmitted coordinates that correspond to the graphic grid.
        // x -> processing some calculations: 
        //       -> x (mutated x)
        //       -> planeX (original x)
        this.x = x;
        this.y = y;
        this.planeX = null;
        this.planeY = null;

        // styles
        this.color = color;
        this.label = label;
        this.labelColor = labelColor;
    }


    /**
     * Draws a point to target renderer context.
     */
    draw(){
        if(this.label && this.label.length > 0) {
            // draw text label
            drawText(this.renderer, {
                x: this.x + 7,
                y: this.y -  7,
                text: this.label,
                color: this.labelColor,
            });
        }

        // draw point
        drawCircle(this.renderer, {
            cx: this.x,
            cy: this.y,
            fillColor: this.color,
            borderColor: this.color,
            r: 2,
        });
    }
}



/**
 * Segment element class.
 */
class Segment extends PlanePrimitive {
    /**
     * 
     * @param {array} startPoint - ['label', x, y]
     * @param {array} endPoint - ['label', x, y]
     * @param {string} color - color of segment line
     * @param {number} thickness - thickness of segment line
     */
    constructor(startPoint, endPoint, color, thickness = 2){
        super();
        
        this.startPoint = new Point(startPoint[0], startPoint[1], startPoint[2], color);
        this.endPoint = new Point(endPoint[0], endPoint[1], endPoint[2], color);

        this.color = color;
        this.thickness = thickness;
        this.length = getDistanseBetweenTwoPoint(startPoint[1], startPoint[2], endPoint[1], endPoint[2]);
    }


    /**
     * Draws a segment to context.
     */
    draw(){
        drawLine(this.renderer, {
            x1: this.startPoint.x,
            y1: this.startPoint.y,

            x2: this.endPoint.x,
            y2: this.endPoint.y,

            thickness: this.thickness,
            color: this.startPoint.color,
        });

        this.startPoint.draw();
        this.endPoint.draw();
        
    }
}

/**
 * An auxiliary class that determines the type of a function and extracts the coefficients of its monomials
 */
class TinyMath {
    constructor(){
        /**
         * The Cake is LIE
         */
    }


    /**
     * Detects of function type.
     * @param {string} formula - function formula
     * @returns {string} - type of functon (linear, quadratic, etc)
     */
    detect(formula){
        // if function type is not detected - set false value
        let type = 'unknown';

        /**
         * Using regular expressions to determine type of function
         */
        if(/x\^3/g.test(formula)){
            type = "cubic";
        } else if(/x\^2/g.test(formula)){
            type = "quadratic";
        } else if(/e\^\{?\-?(\d+\/?\d+|0\.\d{1,})?x\}?/g.test(formula)) {
            type = 'exponential';
        } else if(/\/\d?x/g.test(formula)) {
            type = 'hyperbolic'
        } else {
            type = "linear";
        }

        return type;
    }


    /**
     * Parses functioяn monomial coefficients
     * @param {string} formula - function formula
     * @param {string} type - function type
     * @returns {object} - parsed coefficients object {a, b, c...}
     */
    parse(formula, type){
        let result = {};

        // devides formula into groups based on math operators
        const delimeter = new RegExp(`(?<!\{)([+-])+`, 'gm');
        let splitted = formula.split(delimeter);

        // internal helper function 
        // if monomial uses / symbol - wrap as fraction elem
        const normalizeNumber = (num) => {
            // remove helper brakets
            num = /(\{|\})/gm.test(num) ? num.replace(/(\{|\})/gm, '') : num;

            // normalize and return
            return /\//g.test(num) ? Number(fractionToDecimal(num).toFixed(5)) : num;
        }

        // It seems to me that this code needs refactoring
        if(type == 'linear') {
            let a = 0, b = 0;

            splitted.forEach((item, i) => {
                if (item.trim().length > 0 && !delimeter.test(item)) {
                    // detect sign of 'monomial'
                    let sign = i > 0 && splitted[i - 1] === '-' ? -1 : 1;

                    if (/x/.test(item)) {
                        // set minor monomial
                        a = (item.split('x')[0] || 1);
                        a = normalizeNumber(a) * sign; 
                    } else {
                        // set radical
                        b = normalizeNumber(item) * sign;
                    }
                }
            });

            result = {a, b}; 
        } else if(type == 'hyperbolic') {
            let a = 0, b = 0, c = 0;

            splitted.forEach((item, i) => {
                if (item.trim().length > 0 && !/[+-]/.test(item)) {
                    // detect sign of 'monomial'
                    let sign = i > 0 && splitted[i - 1] === '-' ? -1 : 1;

                    if (/\/\d{0,}x/.test(item)) {
                        // set major monomial numerator
                        a = Number((item.split('/')[0] || 1));

                        // set major monomial denumerator
                        b = (item.split('/')[1] || 1).replace('x', '')
                        b = (b == '' ? 1 : Number(b)) * sign;
                    } else {
                        // set radical
                        c = normalizeNumber(item) * sign;
                    }
                }
            });
            
            result = {a, b, c};
        } else if(type == 'quadratic') {
            let a = 0, b = 0, c = 0;

            splitted.forEach((item, i) => {
                // only for non-operator symbols and non-empty strings
                if (item.trim().length > 0 && !/[+-]/.test(item)) {
                    // detect sign of 'monomial'
                    let sign = i > 0 && splitted[i - 1] === '-' ? -1 : 1;

                    if (/x\^2/.test(item)) {
                        // set major monomial
                        a = (item.split('x')[0] || 1);
                        a = normalizeNumber(a) * sign;
                    } else if (/x/.test(item)) {
                        // set minor monomial
                        b = (item.split('x')[0] || 1);
                        b = normalizeNumber(b) * sign;
                    } else {
                        // set radical
                        c = normalizeNumber(item) * sign;
                    }
                }
            });

            result = {a, b, c};
        } else if(type == 'cubic') {
            let a = 0, b = 0, c = 0, d = 0;

            splitted.forEach((item, i) => {
                // only for non-operator symbols and non-empty strings
                if (item.trim().length > 0 && !/[+-]/.test(item)) {
                    // detect sign of 'monomial'
                    let sign = i > 0 && splitted[i - 1] === '-' ? -1 : 1;

                    if (/x\^3/.test(item)) {
                        // set major monomial
                        a = (item.split('x')[0] || 1);
                        a = normalizeNumber(a) * sign;
                    } else if (/x\^2/.test(item)) {
                        // set sub-major monomial
                        b = (item.split('x')[0] || 1);
                        b = normalizeNumber(b) * sign;
                    } else if (/x/.test(item)) {
                        // set minor monomial
                        c = (item.split('x')[0] || 1);
                        c = normalizeNumber(c) * sign;
                    } else {
                        // set radical
                        d = normalizeNumber(item) * sign;
                    }
                }
            });

            result = {a, b, c, d};
        } else if(type == 'exponential') {
            let a = 0, b = 0, c = 0;

            splitted.forEach((item, i) => {
                // only for non-operator symbols and non-empty strings
                if (item.trim().length > 0 && !delimeter.test(item)) {

                    // major monomial
                    if(/e\^\{?/g.test(item)){
                        // get a coeff sign
                        let sign_a = i > 0 && splitted[i - 1] === '-' ? -1 : 1;
                        a = (item.split('e')[0] || 1);
                        a = normalizeNumber(a) * sign_a;

                        // preparations
                        let raw_b = (item.split('e^')[1].split('x')[0].replace(/\{?/g, '') || 1);

                        // get b coeff sign
                        let sign_b = /\-/g.test(raw_b) === true ? -1 : 1;
                        b = typeof raw_b == 'string' ? raw_b.replace(/\-?/, '') : raw_b;
                        b = (normalizeNumber(b) || 1) * sign_b;

                    // radical
                    } else {
                        let sign = i > 0 && splitted[i - 1] === '-' ? -1 : 1;
                        c = normalizeNumber(item) * sign;
                    }
                }
            });

            result = {a, b, c}
        }

        return result;
    }
    

    /**
     * 
     * @param {string} type - type of function
     * @param {object} coeffs - coeffs object of function
     * @returns {object[]} - roots of functions, array may be empty
     */
    findRoots(type, coeffs){
        let roots = [];

        // linear function: ax + b = 0
        if(type == 'linear') {
            let y = 0;
            let x = (coeffs.b * -1) / coeffs.a;
            roots.push({x, y});

        // quadratic function: ax^2 + bx + c = 0
        } else if(type == 'quadratic') {
            const a = coeffs.a;
            const b = coeffs.b;
            const c = coeffs.c;

            // discriminant
            const discriminant = b**2 - 4 * a * c;

            if (discriminant > 0) {
                // Two real roots
                let x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                let x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                roots.push({x: x1, y: 0});
                roots.push({x: x2, y: 0});
            } else if (discriminant === 0) {
                // One real root
                let x = -b / (2 * a);
                roots.push({x, y: 0});
            } else {
                // Two complex roots
                let realPart = -b / (2 * a);
                let imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
                roots.push({x: realPart, y: imaginaryPart}); // root of the form x + iy
                roots.push({x: realPart, y: -imaginaryPart}); // root of the form x - iy
            }

        // Cubic function: ax^3 + bx^2 + cx + d = 0
        } else if(type == 'cubic') {
            const a = coeffs.a;
            const b = coeffs.b;
            const c = coeffs.c;
            const d = coeffs.d;

            // Reduction to canonical form: t^3 + pt + q = 0
            const p = (3 * a * c - b ** 2) / (3 * a ** 2);
            const q = (2 * b ** 3 - 9 * a * b * c + 27 * a ** 2 * d) / (27 * a ** 3);

            const discriminant = (q ** 2) / 4 + (p ** 3) / 27;

            if (discriminant > 0) {
                // One real root and two complex roots
                const u = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
                const v = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
                const x1 = u + v - b / (3 * a);
                roots.push({x: x1, y: 0});
            } else if (discriminant === 0) {
                // All roots are real and at least two of them are equal
                const u = Math.cbrt(-q / 2);
                const x1 = 2 * u - b / (3 * a);
                const x2 = -u - b / (3 * a);
                roots.push({x: x1, y: 0});
                roots.push({x: x2, y: 0});
            } else {
                // All three roots are real
                const r = Math.sqrt((p *-1) ** 3 / 27);
                const phi = Math.acos(-q / (2 * r));
                const x1 = 2 * Math.cbrt(r) * Math.cos(phi / 3) - b / (3 * a);
                const x2 = 2 * Math.cbrt(r) * Math.cos((phi + 2 * Math.PI) / 3) - b / (3 * a);
                const x3 = 2 * Math.cbrt(r) * Math.cos((phi + 4 * Math.PI) / 3) - b / (3 * a);
                roots.push({x: x1, y: 0});
                roots.push({x: x2, y: 0});
                roots.push({x: x3, y: 0});
            }

        // hyperbolic function: k/x = 0
        } else if(type == 'hyperbolic') {
            // no roots for hyperblic function :)
        } else if(type == 'exponential') {
            const {a, b, c} = coeffs;

            // Check if the exponential equation can have real solutions
            if (a !== 0 && -c / a > 0) {
                // Calculate the root using the natural logarithm
                let x = Math.log(-c / a) / b;
                roots.push({x: x, y: 0});
            } else {
                // No real roots possible
            }
        }

        return roots;
    }
}


class Graph extends PlanePrimitive {
    constructor(formula = null, color = 'red'){
        super();

        this.processor = new TinyMath();
        this.parent = null;

        this.formula = formula;
        this.type = this.processor.detect(this.formula);
        this.parsed = this.processor.parse(this.formula, this.type);
        this.roots = this.processor.findRoots(this.type, this.parsed);
        
        this.color = color;
    }


    /**
     * Draws a linear functon's graph to context.
     * @param {number} step - Smoothness (resolution) of the graph - what step between points to set when drawing a graph of a function
     */
    #drawLinear(step = 1){
        this.renderer.beginPath();
        this.renderer.strokeStyle = this.color;
        this.renderer.lineWidth = 1;


        let firstPoint = true;
        let prevX, prevY;

        // Using info about visible area of plane draw only part of graph
        for(let i = this.parent.visibleArea.x[0] - 3; i < this.parent.visibleArea.x[1] + 3; i += step){
            let rawX = i;
            let rawY = (this.parsed.a * rawX) + this.parsed.b;

            let x = rawX * (this.parent.gridCellSize*2) + this.parent.subpixel;
            let y = rawY * (this.parent.gridCellSize*2) + this.parent.subpixel;
            
            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };
    
            if (firstPoint) {
                this.renderer.moveTo(transformed.x, transformed.y);
                firstPoint = false;
            } else {
                this.renderer.lineTo(transformed.x, transformed.y);
            }
    
            // save current pos as prev pos for next itteration
            prevX = transformed.x;
            prevY = transformed.y; 
        }

        this.renderer.closePath();
        this.renderer.stroke();
    }


    /**
     * Draws a quadratic functon's graph to context.
     * @param {number} step - Smoothness (resolution) of the graph - what step between points to set when drawing a graph of a function
     */
    #drawQuadratic(step = 1) {
        this.renderer.beginPath();
        this.renderer.strokeStyle = this.color;
        this.renderer.lineWidth = 1;

        let segmentStarted = false;
    
        for(let i = this.parent.visibleArea.x[0] - 3 ; i < this.parent.visibleArea.x[1] + 3; i += step){
            let rawX = i;
            let rawY = (this.parsed.a * (rawX ** 2)) + (this.parsed.b * rawX) + this.parsed.c;
    
            let x = rawX * (this.parent.gridCellSize*2) + this.parent.subpixel;
            let y = rawY * (this.parent.gridCellSize*2) + this.parent.subpixel;
            
            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };
            
            if (transformed.x < 0 || transformed.x > this.parent.viewWidth) {
                // If the current point of the parabola's tail is outside the visible screen area,
                // we need to end the current segment to avoid drawing a line connecting
                // visible and non-visible points.
                
                if (segmentStarted) {
                    // If a segment was in progress, finalize it by stroking and closing the path.
                    this.renderer.stroke();
                    this.renderer.closePath();
                    segmentStarted = false; // Mark the segment as not started.
                }
                
                continue; // Skip to the next iteration since this point is out of bounds.
            }
            
            if (!segmentStarted) {
                // If no segment is in progress, begin a new path for the visible segment.
                this.renderer.beginPath();
                this.renderer.moveTo(transformed.x, transformed.y);
                segmentStarted = true; // Mark that a new segment has started.
            } else {
                // If a segment is already in progress, continue drawing the line to the current point.
                this.renderer.lineTo(transformed.x, transformed.y);
            }
        }
    
        if (segmentStarted) {
            this.renderer.stroke();
            this.renderer.closePath();
        }
    }

    /**
     * Draws a cubic functon's graph to context.
     * @param {number} step - Smoothness (resolution) of the graph - what step between points to set when drawing a graph of a function
     */
    #drawCubic(step = 1) {
        this.renderer.beginPath();
        this.renderer.strokeStyle = this.color;
        this.renderer.lineWidth = 1;

        let segmentStarted = false;
    
        for(let i = this.parent.visibleArea.x[0] - 3 ; i < this.parent.visibleArea.x[1] + 3; i += step){
            let rawX = i;
            let rawY = (this.parsed.a * (rawX ** 3)) + (this.parsed.b * (rawX ** 2)) + (this.parsed.c * rawX) + this.parsed.d;
    
            let x = rawX * (this.parent.gridCellSize*2) + this.parent.subpixel;
            let y = rawY * (this.parent.gridCellSize*2) + this.parent.subpixel;
            
            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };
            
            if (transformed.x < 0 || transformed.x > this.parent.viewWidth) {
                // If the current point of the cubic parabola's tail is outside the visible screen area,
                // we need to end the current segment to avoid drawing a line connecting
                // visible and non-visible points.
                
                if (segmentStarted) {
                    // If a segment was in progress, finalize it by stroking and closing the path.
                    this.renderer.stroke();
                    this.renderer.closePath();
                    segmentStarted = false; // Mark the segment as not started.
                }
                
                continue; // Skip to the next iteration since this point is out of bounds.
            }
            
            if (!segmentStarted) {
                // If no segment is in progress, begin a new path for the visible segment.
                this.renderer.beginPath();
                this.renderer.moveTo(transformed.x, transformed.y);
                segmentStarted = true; // Mark that a new segment has started.
            } else {
                // If a segment is already in progress, continue drawing the line to the current point.
                this.renderer.lineTo(transformed.x, transformed.y);
            }
        }
    
        if (segmentStarted) {
            this.renderer.stroke();
            this.renderer.closePath();
        }
    }


    /**
     * Draws a hyperbolic functon's graph to context.
     * @param {number} step - Smoothness (resolution) of the graph - what step between points to set when drawing a graph of a function
     */
    #drawHyperbolic(step = 1){
        /**
         * Some notes about STEP:
         * with values ​​below 0.001 the graph suddenly ends, but leaving 0.001 is also ineffective due 
         * to the load on the processor. Maybe use adaptive change of this value?
         */

        this.renderer.beginPath();
        this.renderer.strokeStyle = this.color;
        this.renderer.lineWidth = 1;
    
        let segmentStarted = false;

        /** 
        * N.B:
        *  We are separating the hyperbola into two branches (for x < 0 and x > 0)
        * because a hyperbola consists of two distinct curves, one on either side of 
        * the vertical asymptote (x = 0). If we were to draw the entire curve 
        * without splitting the branches, the result would be a single connected curve
        * that improperly crosses the y-axis, merging both branches into one continuous 
        * line. This would visually distort the hyperbolic shape.
        *
        * By splitting the graph into two loops, we ensure that each branch is drawn 
        * independently, stopping the rendering when x approaches zero to avoid 
        * connecting points across the asymptote.
        **/ 

        // Drawing the left branch (x < 0)
        for (let i = this.parent.visibleArea.x[0] - 3; i < this.parent.visibleArea.x[1] + 3; i += step) {
            let rawX = i;
        
            // Skip points too close to the asymptote (x = 0)
            if (Math.abs(rawX) < 0.001) {
                continue;
            }
        
            let rawY = (this.parsed.a / (this.parsed.b * rawX)) + this.parsed.c;
            let x = rawX * (this.parent.gridCellSize * 2) + this.parent.subpixel;
            let y = rawY * (this.parent.gridCellSize * 2) + this.parent.subpixel;
        
            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };
        
            if (transformed.x < 0 || transformed.x > this.parent.viewWidth) {
                if (segmentStarted) {
                    this.renderer.stroke();
                    this.renderer.closePath();
                    segmentStarted = false;
                }
                continue;
            }
        
            if (!segmentStarted) {
                this.renderer.beginPath();
                this.renderer.moveTo(transformed.x, transformed.y);
                segmentStarted = true;
            } else {
                this.renderer.lineTo(transformed.x, transformed.y);
            }
        }
        
        if (segmentStarted) {
            this.renderer.stroke();
            this.renderer.closePath();
        }
    
        segmentStarted = false;
    
        // Drawing the right branch (x > 0)
        for(let i = step; i < this.parent.visibleArea.x[1] + 3; i += step){
            let rawX = i;
            let rawY = (this.parsed.a / (this.parsed.b * rawX)) + this.parsed.c;
    
            let x = rawX * (this.parent.gridCellSize * 2) + this.parent.subpixel;
            let y = rawY * (this.parent.gridCellSize * 2) + this.parent.subpixel;
    
            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };
    
            if (transformed.x < 0 || transformed.x > this.parent.viewWidth) {
                if (segmentStarted) {
                    this.renderer.stroke();
                    this.renderer.closePath();
                    segmentStarted = false;
                }
                continue;
            }
    
            if (!segmentStarted) {
                this.renderer.beginPath();
                this.renderer.moveTo(transformed.x, transformed.y);
                segmentStarted = true;
            } else {
                this.renderer.lineTo(transformed.x, transformed.y);
            }
        }
    
        if (segmentStarted) {
            this.renderer.stroke();
            this.renderer.closePath();
        }
    }

    
    /**
     * Draws a exponential functon's graph to context.
     * @param {number} step - Smoothness (resolution) of the graph - what step between points to set when drawing a graph of a function
     */
    #drawExponential(step = 1){
        this.renderer.beginPath();
        this.renderer.strokeStyle = this.color;
        this.renderer.lineWidth = 1;

        let segmentStarted = false;
    
        for(let i = this.parent.visibleArea.x[0] - 4 ; i < this.parent.visibleArea.x[1] + 4; i += step){
            let rawX = i;
            let rawY = (this.parsed.a * Math.exp(this.parsed.b * rawX)) + this.parsed.c
            
            let y = rawY * (this.parent.gridCellSize*2) + this.parent.subpixel;
            let x = rawX * (this.parent.gridCellSize*2) + this.parent.subpixel;
            // console.log(i, x);

            
            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };
            
            // console.log(transformed.x, transformed.y); 

            let y_threshold = this.parent.gridCellSize * 5;

            if (
                transformed.x < 0 || 
                transformed.x > this.parent.viewWidth || 
                transformed.y < 0 - y_threshold|| 
                transformed.y > this.parent.viewHeight + y_threshold
            ) {
                // If the current point of the exponenta line is outside the visible screen area,
                // we need to end the current segment to avoid drawing a line connecting
                // visible and non-visible points.
                
                if (segmentStarted) {
                    // If a segment was in progress, finalize it by stroking and closing the path.
                    this.renderer.stroke();
                    this.renderer.closePath();
                    segmentStarted = false; // Mark the segment as not started.
                }
                
                continue; // Skip to the next iteration since this point is out of bounds.
            }
            
            if (!segmentStarted) {
                // If no segment is in progress, begin a new path for the visible segment.
                this.renderer.beginPath();
                this.renderer.moveTo(transformed.x, transformed.y);
                segmentStarted = true; // Mark that a new segment has started.
            } else {
                // If a segment is already in progress, continue drawing the line to the current point.
                this.renderer.lineTo(transformed.x, transformed.y);
            }
        }
    
        if (segmentStarted) {
            this.renderer.stroke();
            this.renderer.closePath();
        }
    }


    draw(){
        let defaultResolution = 0.1;

        if(this.type == 'linear') this.#drawLinear(defaultResolution);
        if(this.type == 'quadratic') this.#drawQuadratic(defaultResolution);
        if(this.type == 'cubic') this.#drawCubic(defaultResolution);

        // this method uses other default resolution value
        // for more details check comment note inside method
        if(this.type == 'hyperbolic') this.#drawHyperbolic(0.001);

        if(this.type == 'exponential') this.#drawExponential(0.075);
    }
}




/**
* Since the code outside the scene is available everywhere, need to follow up:
* - or move it inside the scene code
* - or move this class into a separate helper class
*
* In this case, the SynteticEventTarget class is already present in another file, 
* which causes a class declaration error. Temporarily I will leave it as SynteticEventTarget2
*/
class CartesianPlane extends SynteticEventTarget2 {
    #children = [];

    constructor({cx, cy, renderer, gridCellSize = 10, gridLineColor = 'black', gridLineThickness = 1, fillColor = 'white', axisColor = 'black'}){
        super();

        this.cx = cx;
        this.cy = cy;

        this.globalOffset = {
            x: 0,
            y: 0,
        };

        /**
         * n order not to draw the entire endless graph (yeah, like a computer could xD), 
         * we need to understand what part of the plane is visible at the moment
         */
        this.visibleArea = {
            x: [0, 0],
            y: [0, 0],
        }

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
     * Moves plane using offset object
     * @param {object} offset - offset object {x, y}
     * @param {number} sensitivity - sensitivity of mouse movements
     */
    move(offset, sensitivity = 1){
        let xOffset = Math.round(offset.x * sensitivity);
        let yOffset = Math.round(offset.y * sensitivity);

        this.cx = this.cx + xOffset;
        this.cy = this.cy + yOffset;

        this.globalOffset.x = this.globalOffset.x + xOffset;
        this.globalOffset.y = this.globalOffset.y + yOffset;

        this.#children.forEach(item => {
            if(item.constructor.name == 'Point') {
                item.x = item.x + xOffset;
                item.y = item.y + yOffset;
            } else if(item.constructor.name == 'Segment'){
                item.startPoint.x = item.startPoint.x + xOffset;
                item.startPoint.y = item.startPoint.y + yOffset;

                item.endPoint.x = item.endPoint.x + xOffset;
                item.endPoint.y = item.endPoint.y + yOffset;
            } else if(item.constructor.name == 'Graph') {

            }
        });
    }


    /**
     * Moving plane to origin pos (centerX, centerY).
     */
    moveToOrigin(){
        this.cx = this.viewWidth / 2;
        this.cy = this.viewHeight / 2;

        this.#children.forEach(item => {
            if(item.constructor.name == 'Point') {
                item.x = item.x - this.globalOffset.x;
                item.y = item.y - this.globalOffset.y;
            } else if(item.constructor.name == 'Segment') {
                item.startPoint.x = item.startPoint.x - this.globalOffset.x;
                item.startPoint.y = item.startPoint.y - this.globalOffset.y;
                item.endPoint.x = item.endPoint.x - this.globalOffset.x;
                item.endPoint.y = item.endPoint.y - this.globalOffset.y;
            } else if(item.constructor.name == 'Graph') {

            }
        });

         this.globalOffset = {
            x: 0, y: 0,
        };
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
     * Draws a plane grid.
     */
    drawGrid(){
        // function basic values
        const width = this.viewWidth;
        const height = this.viewHeight;
        
        
        // color selected by user from class costructor
        const minorGridLineColor = this.gridLineColor;

        // rgba -> array
        const parsed = minorGridLineColor.split(', ')
                                         .map(item => {
                                             return Number(
                                                 item.replace(/(\(|\)|rgba|rgb)/gm, '')
                                             );
                                          });
        
        // increasing the color value of the major line                           
        const gain = 0.45;                              
        const modifined = parsed.map((item, i) => {
            return i == 3 && item <= 1 ? parsed[i] + gain : item;
        });

        // ready RGBA string
        const majorGridLineColor = 'rgba(' + modifined + ')';
        
        // thickness of grid line 
        this.renderer.lineWidth = this.gridLineThickness;

       // local helper function
       const drawPart = (start, type) => { 
            /**
             * N.B.: 
             * I did not use a custom helper function to avoid multiple calls to the context 
             * and not to worsen the already not excellent performance
            */

            // draw a major line
            this.renderer.beginPath();
            this.renderer.strokeStyle = majorGridLineColor;
        
            // vertical major line
            if (type === 'column') {
                let x = start + (this.gridCellSize * 2) + this.subpixel;
                this.renderer.moveTo(x, 0);
                this.renderer.lineTo(x, height);

            // horizontal line
            } else if (type === 'row') {
                let y = start + this.subpixel;
                this.renderer.moveTo(0, y);
                this.renderer.lineTo(width, y);
            }
        
            this.renderer.stroke();
            this.renderer.closePath();
        
            // draw a minor three lines 
            this.renderer.beginPath();
            this.renderer.strokeStyle = minorGridLineColor;
        
            for (let i = 3; i <= 5; i++) {
                if (type === 'column') {
                    let x = start + (this.gridCellSize * i) + this.subpixel;
                    this.renderer.moveTo(x, 0);
                    this.renderer.lineTo(x, height);
                } else if (type === 'row') {
                    let y = start + (this.gridCellSize * (i - 2)) + this.subpixel;
                    this.renderer.moveTo(0, y);
                    this.renderer.lineTo(width, y);
                }
            }
        
            this.renderer.stroke();
            this.renderer.closePath();
        };
        
        // axis scale number label font size
        const fontSize = 11;

        // minor step = this.gridCellSize
        // but each part contain 1 major laine + space + three minor lines
        const majorStep = this.gridCellSize * 4;
        
        /**
         * Every time the screen shifts by more than the width of a column or the height of a row (major step), 
         * the renderer takes into account the displacement and draws an additional section in advance, 
         * which is why we need to know what indentation is in the columns/rows now.
         */

        let originX = this.cx - (width / 2);
        let columnsOffset = Math.trunc(this.globalOffset.x / majorStep);

        // min and max x values
        let xMin = -1 - columnsOffset;
        let xMax = (width / majorStep) - columnsOffset;

        for (let i = xMin; i < xMax; i++) {
            // column start x pos
            let x = originX + (i * majorStep);
            let number = (i - 7) * 2;

            // draw a group of vertical lines - column
            // each column contains one major line ant three minor
            drawPart(x, 'column');

            // draw a text with number of axis scale
            drawText(this.renderer, {
                x: x + (majorStep / 2),
                y: this.cy -10,
                // hide '0' pos number label to x-axis
                // beacuse we already using '0' pos label from y-axis
                text: number == 0 ? '' : number,
                fontSize: fontSize,
            });

            // updating visibleArea value
            if(i == -1 - columnsOffset) this.visibleArea.x[0] = number + 2;
            if(i == xMax - 1) this.visibleArea.x[1] = number;
        }
        
        let originY = this.cy - (height / 2);
        let rowsOffset = Math.trunc(this.globalOffset.y / majorStep);

        // min and max y values
        let yMin = -1 - rowsOffset;
        let yMax = (height / majorStep) - rowsOffset + 1;

        for (let j = yMin; j < yMax; j++) {
            // row start y pos
            let y = originY + (j * majorStep);
            let number = (j - 5) * 2 * -1;

            // draw a group of horizontal lines - row
            // each row contains one major line ant three minor
            drawPart(y, 'row');

            // draw a text with number of axis scale
            drawText(this.renderer, {
                x: this.cx - 7,
                // different spacing to '0' pos number label and other numbers
                y: number == 0 ? y + 12 : y + 1,
                text: number,
                fontSize: fontSize,
                align: 'right',
            });

            // updating visibleArea value
            if(j == yMin) this.visibleArea.y[0] = number - 2;
            if(j == yMax - 1) this.visibleArea.y[1] = number;
        }
    }


    /**
     * Adds point to plane
     * @param {object} object - object with point params
     */
    add(newItemObject){
        newItemObject.renderer = this.renderer;

        // local helper function
        // Perhaps it makes sense to transfer it to base class methods?
        const transform = (object) => {
            object.planeX = object.x;
            object.planeY = object.y;
    
            // recalc the scale and center the coordinates of the point relative to the origin of the plane coordinates
            let x = this.cx + (object.x * (this.gridCellSize * 2)) + this.globalOffset.x + this.subpixel;
            let y = this.cy - (object.y * (this.gridCellSize * 2)) + this.globalOffset.y + this.subpixel;
    
            object.x = x;
            object.y = y;
        }

        if(newItemObject.constructor.name == 'Point') {
            transform(newItemObject);
        } else if(newItemObject.constructor.name == 'Segment') {
            newItemObject.startPoint.renderer = this.renderer;
            transform(newItemObject.startPoint);
            
            newItemObject.endPoint.renderer = this.renderer;
            transform(newItemObject.endPoint);

            newItemObject.parent = this;
        } else if(newItemObject.constructor.name == 'Graph') {
            newItemObject.parent = this;
        }

        this.#children.push(newItemObject);
    }


    /**
     * Clear all plane content (except grid and axes).
     */
    clearContent(){
        this.#children = [];
        this.render();
    }


    /**
     * Fill plane bg with solid color
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
     * Renders plane
     */
    render(){
        this.fill();
        this.drawGrid();
        this.drawAxis();

        if(this.#children.length > 0) {
            this.#children.forEach(item => {
                item.draw(); 
            });
        }

        this.dispatchEvent('redraw');
    }
}