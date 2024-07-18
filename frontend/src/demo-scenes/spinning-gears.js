let spinningGears = new Scene({
    title: 'Spinning gears', 

    ui: {
        'dev': {
            type: 'checkbox',
            label: 'Show dev visual',
            state: true,
        },

        'selectedPreset': {
            type: 'preset-picker',
            label: 'Choose preset',
            presetNames: ['small+big drive', 'big+small drive'],
            defaultValue: 0,
        },
    },

    code: (root, settings) => {
        // describing basic variables
        const canvas = root.querySelector('canvas');
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        const centerX = width / 2 + 1;
        const centerY = height / 2 + 0.5;

        const presets = [
            [
                new Gear({
                    role: 'drive',
                    cx: centerX + 60,
                    cy: centerY,
                    r: 150,
                    handleLength: 95,
                    numberOfTeeth: 25,
                    tootheHeight: 25,
                    renderer: context,
                }),
    
                new Gear({
                    cx: centerX - 134,
                    cy: centerY - 8,
                    r: 60,
                    numberOfTeeth: 8,
                    tootheHeight: 20,
                    renderer: context,
                })
            ],
            [
                new Gear({
                    cx: centerX + 125,
                    cy: centerY,
                    role: 'drive',
                    r: 60,
                    numberOfTeeth: 8,
                    tootheHeight: 20,
                    renderer: context,
                }),

                new Gear({
                    cx: centerX - 65,
                    cy: centerY + 11,
                    r: 150,
                    numberOfTeeth: 25,
                    tootheHeight: 25,
                    renderer: context,
                }),
            ],
        ]
    

        // some dynamic values (updates in 'mousemove' event)
        let mousePos = {x: false, y: false};
        let isMouseDown = false;
        let isMouseMoving = false;
        let angle = 0;

        // setting selected preset index
        let currentPresetIndex = settings.selectedPreset;

        // main function
        let loop = () => {
            // update selected preset index
            currentPresetIndex = settings.selectedPreset;

            context.clearRect(
                0, 0,
                width,
                height
            );

            // draw background in 'bluepring paper' style
            drawBlueprintBG(context, {
                canvasWidth: width,
                canvasHeight: height,
                devMode: settings.dev,
            });

            presets[currentPresetIndex].forEach((gear, i) => {
                // is first main gear - pev gear not existed
                let prevGear = false;

                if(i > 0) prevGear = presets[currentPresetIndex][i - 1];
                
                // render each gear
                gear.render(settings.dev);

                if(isMouseMoving === true && isMouseDown === true) {
                    // if is main drive gear - rotate in regular way
                    if(gear.role == 'drive'){
                        gear.rotate(angle);

                    // if is driven slave gear 
                    // rotate backwards usinn ratio coeff
                    } else if(gear.role == 'slave'){
                        let ratioCoefficient = prevGear.numberOfTeeth / gear.numberOfTeeth;
                        // rotate using ration coeff
                        if(prevGear) gear.rotate(prevGear.angle * -1 * ratioCoefficient);
                    }
                }
            });

            requestAnimationFrame(loop);
        }

        // animate
        requestAnimationFrame(loop);
        
        // updating mousedown state
        root.addEventListener('mousedown', event => {
            isMouseDown = true;
        });

        // updating mouseup state
        root.addEventListener('mouseup', event => {
            isMouseDown = false;
            isMouseMoving = false;
        });

        let masterGear = presets[currentPresetIndex].find(gear => gear.role == 'drive');

        masterGear.addEventListener('rotate', () => {

        });

        // main event handler
        root.addEventListener('mousemove', event => {
            // Updated values pnly when mouse left button is presse
            // Without pressed left button - gear will stay without rotating!
            if(isMouseDown === true) {
                if(masterGear == undefined) {
                    throw new Error('Drive gear not found!')
                } else {
                    // update global angle var and mousePos
                    angle = getAngleBetweenTwoPoints(masterGear.cx, masterGear.cy, mousePos.x, mousePos.y);
                    mousePos = getMousePos(canvas, event);
                    isMouseMoving = true;
                }

            }
        });
    }
});

window.exportedObjects.push(spinningGears);


/**
* Scene file internal classes and helper functions defenitions
*/

class SynteticEventTarget {
    constructor (){
        this.events = {};
    }

    addEventListener(eventType, callback) {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }
        
        this.events[eventType].push(callback);
    }

    dispatchEvent(eventType, data) {
        if (this.events[eventType]) {
            this.events[eventType].forEach(callback => callback(data));
        }
    }
}

class GearHandle extends SynteticEventTarget {
    /**
     * 
    * @param {CanvasRenderingContext2D} renderer - 2d context of target canvas
    * @param {number} param.cx - gear's handle center x pos
    * @param {number} param.cy - gear's handle center y pos
    * @param {object} param.connectedWith - which gear connected with this handle
    * @param {number} param.angle - angle of gear
    * @param {length} param.length - length of handle
    * @param {number} param.borderLineWidth - gear's border line width/thickness
    * @param {string} param.borderColor - gears's border color
    * @param {string} param.fillColor - gear's inner color
     */
    constructor({
        renderer, cx, cy, length, angle = 0, 
        connectedWith, fillColor = 'rgba(255, 255, 255, 0.1', 
        borderColor = 'white', borderLineWidth = 2
    }){
        super();

        length = typeof length == 'number' ? length : connectedWith.r + 35;

        this.cx = cx;
        this.cy = cy;
        this.length = length;

        this.connectedWith = connectedWith;

        // joint - circle that connects gear center and handle
        this.joint = {
            cx: this.connectedWith.cx,
            cy: this.connectedWith.cy,
            r: this.connectedWith.r / 4,
        }

        // circle at handle end (tail)
        this.tail = {
            cx: cx + length,
            cy: cy,
            r: this.connectedWith.r / 6,
            angle: angle,
        };

        // points of handle connection to joint
        // this.joint.connectingPoints = [
        //     {x: this.joint.cx, y: this.joint.cy + this.joint.r},
        //     {x: this.joint.cx, y: this.joint.cy - this.joint.r},
        // ];

        this.joint.connectingPoints = {
            head: [
                {x: this.joint.cx, y: this.joint.cy + this.joint.r},
                {x: this.joint.cx, y: this.joint.cy - this.joint.r},
            ],

            tail: [
                {x: this.tail.cx, y: this.tail.cy + this.tail.r},
                {x: this.tail.cx, y: this.tail.cy - this.tail.r},
            ],
        }

        console.log(this.joint.connectingPoints);

        // joint fixator element points
        this.joint.fixatorPoints = [
            {x: this.joint.cx, y: this.joint.cy - this.joint.r},
            {x: this.joint.cx, y: this.joint.cy - this.joint.r - 5},
        ];
        
        this.fillColor = fillColor;
        this.borderColor = borderColor;
        this.borderLineWidth = borderLineWidth;

        this.renderer = renderer;
    }



    /**
     * Updates angle of handle ant recalculate positions using delta angle
     * @param {number} angle - new angle value
     */
    rotate(angle){
        // delta of old angle and new angle
        let delta = this.tail.angle - angle;
        
        // recalculate position of tail
        let rotatedTailPos = rotatePoint(this.joint.cx, this.joint.cy, this.tail.cx, this.tail.cy, -delta);

        // recalculate position of handle connections
        let rotatedConnectionPoint_head = this.joint.connectingPoints.head.map(point => {
            return rotatePoint(this.joint.cx, this.joint.cy, point.x, point.y, -delta);
        });

        let rotatedConnectionPoint_tail = this.joint.connectingPoints.tail.map(point => {
            return rotatePoint(this.joint.cx, this.joint.cy, point.x, point.y, -delta);
        });

        let rotatedFixatorPoint = this.joint.fixatorPoints.map(point => {
            return rotatePoint(this.joint.cx, this.joint.cy, point.x, point.y, -delta);
        });

        
        // updatiing value
        this.tail.angle = angle;
        this.tail.cx = rotatedTailPos.x;
        this.tail.cy = rotatedTailPos.y;
        this.joint.connectingPoints = {head: rotatedConnectionPoint_head, tail: rotatedConnectionPoint_tail};
        this.joint.fixatorPoints = rotatedFixatorPoint;
    }



    /**
     * Draws joint of handle
     */
    #renderJoint(devState){
        drawCircle(this.renderer, {
            cx: this.connectedWith.cx,
            cy: this.connectedWith.cy,
            r: this.connectedWith.r / 4,

            fillColor: this.fillColor,
            borderColor: this.borderColor,
            borderThickness: this.borderLineWidth,
        });
    }



    /**
     * Renders handle joint fixator element
     */
    #renderJointFixator() {
        drawLine(this.renderer, {
            x1: this.joint.fixatorPoints[0].x,
            y1: this.joint.fixatorPoints[0].y,
            x2: this.joint.fixatorPoints[1].x,
            y2: this.joint.fixatorPoints[1].y,
            thickness: 8,
            color: this.borderColor,
        })
    }



    /**
     * Draws lines from the junction to the end of the handle 
     */
    #renderConnections(){
        for(let i in this.joint.connectingPoints.head) {
            let headPoints = this.joint.connectingPoints.head[i];
            let tailPoints = this.joint.connectingPoints.tail[i];

            drawLine(this.renderer, {
                x1: headPoints.x,
                y1: headPoints.y,
                x2: tailPoints.x,
                y2: tailPoints.y,
                thickness: this.borderLineWidth,
                color: this.borderColor,
            });  
        }
    }



    /**
     * Renders of tail circle of handle
     */
    #renderTail(){
        drawCircle(this.renderer, {
            cx: this.tail.cx,
            cy: this.tail.cy,
            r: this.tail.r,

            fillColor: this.fillColor,
            borderColor: this.borderColor,
            borderThickness: this.borderLineWidth,
        });
    }



    /**
     * Renders handle.
     */
    render(devState){
        // draw a main joint circle
        this.#renderJoint(devState);


        // draw a handler's fixator
        this.#renderJointFixator();

        // draw a handler sides (lines from joint to tail)
        this.#renderConnections();

        // draw a circle at handle tail
        this.#renderTail();

        // dev option
        if(devState === true) {
            drawLine(this.renderer, {
                x1: this.joint.cx,
                y1: this.joint.cy,
                x2: this.tail.cx,
                y2: this.tail.cy,
                thickness: 2,
                color: 'black',
            });
        }
    }
}



class Gear extends SynteticEventTarget {
    /**
    * @constructor 
    * @param {CanvasRenderingContext2D} renderer - 2d context of target canvas
    * @param {number} param.cx - gear center x pos
    * @param {number} param.cy - gear center y pos
    * @param {number} param.r - gear radius
    * @param {number} [param.angle=0] - angle of gear
    * @param {number} [param.role='slave'] - is gear driver or driven
    * @param {number} param.handleLength - length of gear handle
    * @param {number} param.numberOfTeeth - gear's number of teeth 
    * @param {number} param.tootheHeight - gear's single tooth height
    * @param {number} [param.borderLineWidth=2] - gear's border line width/thickness
    * @param {string} [param.borderColor='white'] - gears's border color
    * @param {string} [param.fillColor='rgba(255, 255, 255, 0.1'] - gear's inner color
     */
    constructor({
        renderer, cx, cy, r, angle = 0, 
        numberOfTeeth, tootheHeight, role = 'slave', handleLength,
        fillColor = 'rgba(255, 255, 255, 0.1', 
        borderColor = 'white', borderLineWidth = 2,
    }){
        super();
        this.cx = cx;
        this.cy = cy;
        this.r = r;
        this.angle = angle;

        this.numberOfTeeth = numberOfTeeth;
        this.tootheHeight = tootheHeight;
        
        this.fillColor = fillColor;
        this.borderColor = borderColor;
        this.borderLineWidth = borderLineWidth;

        this.renderer = renderer;

        this.role = role;
        this.handle = role == 'drive' ? new GearHandle({
            renderer: this.renderer, connectedWith: this, length: handleLength,
            cx, cy, angle, fillColor, borderColor, borderLineWidth
        }) : null;
    }



    /**
     * 
     * @param {*} angle 
     */
    rotate(angle){
        this.angle = angle;

        if(this.role == 'drive') {
            // TODO
            // now integrate
            // rotation calc at render functions
            this.handle.rotate(angle);
        }

        this.dispatchEvent('rotate');
    }



    /**
     * 
     */
    #renderJoint(devState){
        drawCircle(this.renderer, {
            cx: this.cx,
            cy: this.cy,
            r: 10,
            fillColor: this.fillColor,
            borderColor: this.borderColor,
            borderThickness: this.borderLineWidth,
        });


        if(devState === true) {
            let helperLineconnectionPoint = {x: this.cx, y: this.cy - this.r + this.tootheHeight};
            let rotated = rotatePoint(this.cx, this.cy, helperLineconnectionPoint.x, helperLineconnectionPoint.y, this.angle);

            drawLine(this.renderer, {
                x1: this.cx,
                y1: this.cy,
                x2: rotated.x,
                y2: rotated.y,
                thickness: this.borderLineWidth,
                color: 'black',
            });
        }
    }



    /**
     * Draws a gear with given teeth and radius from instance.
     */
    #renderGear() {
        let radiusMinusTeeth = this.r - this.tootheHeight;

        // Array representing the radii for vertices
        let distancesOfVerticesFromCenter = [
            this.r, // Outer vertex (tooth tip)
            this.r, // Outer vertex (tooth tip)
            radiusMinusTeeth, // Inner vertex (root of tooth)
            radiusMinusTeeth, // Inner vertex (root of tooth)
        ];

        // Total number of vertices
        let verticesPerTooth = distancesOfVerticesFromCenter.length;
        let numberOfVertices = this.numberOfTeeth * verticesPerTooth;

        this.renderer.beginPath();

        for (let v = 0; v < numberOfVertices; v++) {
            let angleInRadians = Math.PI * 2 * v / numberOfVertices;
            let vModded = v % verticesPerTooth;
            let distanceOfVertexFromCenter = distancesOfVerticesFromCenter[vModded];
            let drawPosX = this.cx + distanceOfVertexFromCenter * Math.cos(angleInRadians);
            let drawPosY = this.cy + distanceOfVertexFromCenter * Math.sin(angleInRadians);

            let rotatedPos = rotatePoint(this.cx, this.cy, drawPosX, drawPosY, this.angle)

            // Move to the first vertex, then line to the rest
            if (v == 0) {
                this.renderer.moveTo(rotatedPos.x, rotatedPos.y);
            } else {
                this.renderer.lineTo(rotatedPos.x, rotatedPos.y);
            }
        }

        // Set fill color and stroke properties
        this.renderer.fillStyle = this.fillColor;
        this.renderer.lineWidth = this.borderLineWidth;
        this.renderer.strokeStyle = this.borderColor;

        this.renderer.closePath();
        this.renderer.fill();
        this.renderer.stroke();

    }



    /**
     * 
     */
    render(devState = false) {
        this.#renderJoint(devState);
        this.#renderGear();

        if(this.role == 'drive') {
            this.handle.render(devState);
        }
    }
}

/**
 * Draws a background in 'blueprint' paper style (with grid).
 * @param {CanvasRenderingContext2D} context 
 * @param {number} param.canvasWidth
 * @param {number} param.canvasHeight
 * @param {boolean} param.devMode
 */
function drawBlueprintBG(context, {canvasWidth, canvasHeight, devMode}){
    const secodnaryGridCellSize = 25;
    const bluePrintColor = devMode === true ? '#5b55e1' : 'rgba(26, 134, 199, 1)';
    const freeBorderSpace = secodnaryGridCellSize;

    // fill bg with color
    // color may change if debug 'devMode' option is enabled
    drawRect(context, {
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
        fillColor: bluePrintColor,
    });

    // draw secondary background grid
    drawGrid(context, {
        cellSize: secodnaryGridCellSize,
        lineThickness: 0.5,
        lineColor: 'rgba(255, 255, 255, 0.01)',
    });

    // draw primary background grid
    drawGrid(context, {
        cellSize: canvasHeight / 4,
        lineThickness: 1,
        lineColor: 'rgba(255, 255, 255, 0.04)',
    });

    //draw grid top padding
    drawRect(context, {
        x: 0,
        y: 0,
        width: canvasWidth,
        height: freeBorderSpace,
        fillColor: bluePrintColor,
    });

    //draw grid bottom padding
    drawRect(context, {
        x: 0,
        y: canvasHeight - freeBorderSpace + 1,
        width: canvasWidth,
        height: freeBorderSpace,
        fillColor: bluePrintColor,
    });

    //draw grid left padding
    drawRect(context, {
        x: 0,
        y: 0,
        width: freeBorderSpace,
        height: canvasHeight,
        fillColor: bluePrintColor,
    });

    //draw grid right padding
    drawRect(context, {
        x: canvasWidth - freeBorderSpace + 1,
        y: 0,
        width: freeBorderSpace,
        height: canvasHeight,
        fillColor: bluePrintColor,
    });
}