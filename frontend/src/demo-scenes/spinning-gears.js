let spinningGears = new Scene({
    title: 'Spinning gears', 

    ui: {
        'dev': {
            type: 'checkbox',
            label: 'Show dev visual',
            state: true,
        },

        'rotationSpeed': {
            type: 'input',
            label: 'Rotation speed',
            minValue: 0,
            maxValue: 20,
            defaultValue: 0,
        },

        'selectedPreset': {
            type: 'preset-picker',
            label: 'Choose preset',
            presetNames: ['small+big drive', 'big+small drive', 'two equal', 'triple'],
            defaultValue: 0,
        },
    },

    code: (root, settings) => {
        // describing basic canvas variables
        const canvas = root.querySelector('canvas');
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        // describing main variables
        const context = canvas.getContext('2d');
        const centerX = width / 2 + 1;
        const centerY = height / 2 + 0.5;


        /**
         * Preset is a kind of sketch for the future instance of the Gear classresets is some sort of 'skeleton' 
         * This array contains several preset arrays, each nested array stores sketch info for Gear class.
         */
        const presets = [
            [
                {
                    role: 'drive',
                    cx: centerX + 60,
                    cy: centerY,
                    r: 170,
                    numberOfTeeth: 30,
                    tootheHeight: 25,
                },
    
                {
                    cx: centerX - 132,
                    cy: centerY - 26,
                    r: 40,
                    numberOfTeeth: 5,
                    tootheHeight: 18,
                }
            ],
            [
                {
                    role: 'drive',
                    cx: centerX + 168,
                    cy: centerY + 46,
                    r: 40,
                    numberOfTeeth: 5,
                    tootheHeight: 18,
                },

                {
                    cx: centerX,
                    cy: centerY,
                    r: 150,
                    numberOfTeeth: 25,
                    tootheHeight: 25,
                },
            ],

            [
                {
                    role: 'drive',
                    cx: centerX + 92,
                    cy: centerY - 12,
                    r: 100,
                    numberOfTeeth: 19,
                    tootheHeight: 18,
                },

                {
                    cx: centerX - 92,
                    cy: centerY + 12,
                    r: 100,
                    numberOfTeeth: 19,
                    tootheHeight: 18,
                },
            ],

            [
                {
                    role: 'drive',
                    cx: centerX + 183,
                    cy: centerY + 109,
                    r: 40,
                    numberOfTeeth: 13,
                    tootheHeight: 10,
                },

                {
                    cx: centerX + 105,
                    cy: centerY + 61,
                    r: 60,
                    numberOfTeeth: 24,
                    tootheHeight: 13,
                }, 

                {
                    cx: centerX - 75,
                    cy: centerY - 14,
                    r: 140,
                    numberOfTeeth: 50,
                    tootheHeight: 16,
                },
            ],
        ];

        // prepare a preset variable to make the active preset globally available...
        // ...in the body of the “code” in the future
        let activePreset = null;

        /**
         * N.B.:
         * I didn’t want to mix the logic of the scene itself with external control elements
         * so I added a little reactivity
         * here we figuratively “subscribe” to changes in the external data source
         * we don’t care what and how the settings object is modified in another part of the project
         * we will simply be notified about a change in the settings object (class UI StatesManager) 
         * and receive the data through callback arg of settings.subscribe().
         */
        settings.subscribe((key, newValue, oldValue) => {
            // Checking what exactly has changed in the settings object
            // if preset is changed
            if(key == 'selectedPreset'){
                // reset 'activePreset'
                activePreset = [];

                // going through the presetS array - preset = presets[selected preset's index]
                presets[newValue].forEach(gearObject => {
                    // linking context to gear's objects
                    gearObject.renderer = context;

                    /**
                     * Each time we create a new instance of the class, 
                     * this is necessary for isolation between preset changes, 
                     * otherwise some subsequent reactions will be duplicated several times, 
                     * which is unacceptable
                     */
                    let gear = new Gear(gearObject);

                    /**
                     * adding custom event to each gear
                     * this will allow us to record the moment of each complete rotation of the gear
                     * for further output of some interesting statistical information 
                     */
                    gear.addEventListener('fullRotation', () => {
                        gear.rotations += 1;
                    });

                    // updating 'activePreset' array
                    // It stores already completely finished instances of Gear class.
                    activePreset.push(gear);
                });
            }
        });

        // Some trick to set first (index 0) preset as default preset
        settings.setState('selectedPreset', 0);

        // Main function
        let loop = () => {
            context.clearRect(
                0, 0,
                width,
                height
            );

            // draw background in 'bluepring paper' style
            drawBlueprintBG(context, {
                canvasWidth: width,
                canvasHeight: height,
                devMode: settings.getState('dev'),
            });

            // Make some actions with each gear
            activePreset.forEach((gear, i) => {
                // render each gear
                gear.render(settings.getState('dev'));

                let angle = settings.getState('rotationSpeed');
                // if is main drive gear - rotate in regular way
                if(gear.role == 'drive'){
                    gear.rotate(angle);

                // if is driven slave gear 
                // rotate backwards usinп ratio coeff
                } else if(gear.role == 'slave'){
                    let ratioCoefficient = activePreset[0].numberOfTeeth / gear.numberOfTeeth;
                    let direction = (i % 2 === 0) ? 1 : -1;
                    // rotate using ration coeff
                    gear.rotate(angle * direction * ratioCoefficient);
                }
            });

            requestAnimationFrame(loop);
        }

        // animate
        requestAnimationFrame(loop);
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


class Gear extends SynteticEventTarget {
    /**
    * @constructor 
    * @param {CanvasRenderingContext2D} renderer - 2d context of target canvas
    * @param {number} param.cx - gear center x pos
    * @param {number} param.cy - gear center y pos
    * @param {number} param.r - gear radius
    * @param {number} [param.angle=1] - angle of gear
    * @param {number} [param.role='slave'] - is gear driver or driven
    * @param {number} param.numberOfTeeth - gear's number of teeth 
    * @param {number} param.tootheHeight - gear's single tooth height
    * @param {number} [param.borderLineWidth=2] - gear's border line width/thickness
    * @param {string} [param.borderColor='white'] - gears's border color
    * @param {string} [param.fillColor='rgba(255, 255, 255, 0.1'] - gear's inner color
     */
    constructor({
        renderer, cx, cy, r, angle = 1, 
        numberOfTeeth, tootheHeight, role = 'slave',
        fillColor = 'rgba(255, 255, 255, 0.1', 
        borderColor = 'white', borderLineWidth = 2,
    }){
        super();
        this.cx = cx;
        this.cy = cy;
        this.r = r;
        this.angle = angle;
        this.rotations = 0;

        this.numberOfTeeth = numberOfTeeth;
        this.tootheHeight = tootheHeight;
        
        this.fillColor = fillColor;
        this.borderColor = borderColor;
        this.borderLineWidth = borderLineWidth;

        this.renderer = renderer;

        this.role = role;
    }



    /**
     * 
     * @param {*} angle 
     */
    rotate(deltaAngle){
        this.angle += deltaAngle;

        if(Math.abs(this.angle) >= 360) {
            this.angle = this.angle % 360;
            this.dispatchEvent('fullRotation');
        }
    }



    /**
     * 
     */
    #renderJoint(devState){
        drawCircle(this.renderer, {
            cx: this.cx,
            cy: this.cy,
            r: 10,
            fillColor: this.role == 'drive' ? 'white' : this.fillColor,
            borderColor: this.borderColor,
            borderThickness: this.borderLineWidth,
        });

        if(this.role == 'drive') {
            let r = this.r / 3;
            let w = 10;
            let h = 4;

            let fixatorPos = {x: this.cx, y: this.cy - r - h};
            let rotatedFixatorPos = rotatePoint(this.cx, this.cy, fixatorPos.x, fixatorPos.y, this.angle);

            drawCircle(this.renderer, {
                cx: this.cx,
                cy: this.cy,
                r: r,
                fillColor: this.fillColor,
                borderColor: this.borderColor,
                borderThickness: this.borderLineWidth,
            });

            drawLine(this.renderer, {
                x1: this.cx,
                y1: this.cy,
                x2: rotatedFixatorPos.x,
                y2: rotatedFixatorPos.y,
                thickness: w,
                fillColor: this.borderColor,
            });
        }


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