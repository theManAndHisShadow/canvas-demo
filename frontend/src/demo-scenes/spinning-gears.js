let spinningGears = new Scene({
    title: 'Spinning gears', 

    ui: {
        'dev': {
            type: 'checkbox',
            label: 'Show dev visual',
            state: true,
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
        
        // describing scene's gears
        const gears = [
            // {
            //     cx: centerX + 125,
            //     cy: centerY - 50,
            //     r: 35,
            //     numberOfTeeth: 5,
            //     tootheHeight: 10,
            //     hasHandle: false,
            // },

            {
                cx: centerX,
                cy: centerY,
                r: 90,
                numberOfTeeth: 15,
                tootheHeight: 10,
                hasHandle: true,
            },

            // {
            //     cx: centerX - 140,
            //     cy: centerY + 50,
            //     r: 50,
            //     numberOfTeeth: 7,
            //     tootheHeight: 10,
            //     hasHandle: false,
            // },
            
        ];

        // some dynamic values (updates in 'mousemove' event)
        let mousePos = {x: false, y: false};
        let angle = 0;
        let handleTailPos = false;
        let tailRotatedPos = false;

        // main function
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
                devMode: settings.dev,
            });

            // some settings of gears
            let lineWidth = 2;
            let fillColor = 'rgba(255, 255, 255, 0.1)';
            let borderColor = 'white';
            for(let gear of gears) {
                // center gear joint
                drawCircle(context, {
                    cx: gear.cx,
                    cy: gear.cy,
                    r: 10,
                    fillColor: fillColor,
                    borderColor: borderColor,
                    borderThickness: lineWidth,
                });

                // draw gear
                drawGear(context, {
                    cx: gear.cx,
                    cy: gear.cy,
                    r: gear.r,
                    angle: angle,
                    numberOfTeeth: gear.numberOfTeeth,
                    tootheHeight: gear.tootheHeight,
                    
                    borderColor: borderColor,
                    borderLineWidth: lineWidth,
                    fillColor: fillColor,
                });

                // draw the gear handle if it has one
                if(gear.hasHandle === true) {    
                    let tailDefaultPos = {
                        x: gear.cx + (gear.r * 1.5),
                        y: gear.cy,
                    };

                    handleTailPos = tailDefaultPos;

                    if(settings.dev === true) {
                        // draw line from primary gear's center to handle tail
                        drawLine(context, {
                            x1: gear.cx,
                            y1: gear.cy,
                            x2: tailRotatedPos.x,
                            y2: tailRotatedPos.y,
                            thickness: 2,
                            color: 'black',
                        });

                        let rotatedBpoint = rotatePoint(
                            gear.cx, gear.cy, gear.cx, 
                            gear.cy - gear.r - gear.tootheHeight, 
                            angle
                        );

                        // draw another line
                        drawLine(context, {
                            x1: gear.cx,
                            y1: gear.cy,
                            x2: rotatedBpoint.x,
                            y2: rotatedBpoint.y,
                            thickness: 2,
                            color: 'black',
                        });
                    }

                    drawHandle(context, {
                        jointCX: gear.cx,
                        jointCY: gear.cy,
                        tailCX: tailRotatedPos.x,
                        tailCY: tailRotatedPos.y,
                        angle: angle,
                        r: gear.r / 3,
                        fillColor: fillColor,
                        borderLineWidth: lineWidth,
                        borderColor: borderColor,
                    });
                }
            }

            requestAnimationFrame(loop);
        }

        // animate
        requestAnimationFrame(loop);

        root.addEventListener('mousemove', event => {
            mousePos = getMousePos(canvas, event);
            angle = getAngleBetweenTwoPoints(gears[0].cx, gears[0].cy, mousePos.x, mousePos.y);

            if(handleTailPos){
                tailRotatedPos = rotatePoint(gears[0].cx, gears[0].cy, handleTailPos.x, handleTailPos.y, angle);
            }

            // console.log(angle, tailRotatedPos)
        });
    }
});

window.exportedObjects.push(spinningGears);


/**
* Scene file internal helper function defenitions
*/

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



/**
 * Draws a gear with given teeth and radius.
 * @param {CanvasRenderingContext2D} context - 2d context of target canvas
 * @param {number} param.cx - gear center x poos
 * @param {number} param.cy - gear center y poos
 * @param {number} param.r - gear radius
 * @param {number} param.angle - angle of gear
 * @param {number} param.numberOfTeeth - gear's number of teeth 
 * @param {number} param.tootheHeight - gear's single tooth height
 * @param {number} param.borderLineWidth - gear's border line width/thickness
 * @param {string} param.borderColor - gears's border color
 * @param {string} param.fillColor - gear's inner color
 */
function drawGear(context, {cx, cy, r, angle, numberOfTeeth, tootheHeight, fillColor, borderColor, borderLineWidth}) {
    // Set fill color and stroke properties
    context.fillStyle = fillColor;
    context.lineWidth = borderLineWidth;
    context.strokeStyle = borderColor;

    let radiusMinusTeeth = r - tootheHeight;

    // Array representing the radii for vertices
    let distancesOfVerticesFromCenter = [
        r, // Outer vertex (tooth tip)
        r, // Outer vertex (tooth tip)
        radiusMinusTeeth, // Inner vertex (root of tooth)
        radiusMinusTeeth, // Inner vertex (root of tooth)
    ];

    // Total number of vertices
    let verticesPerTooth = distancesOfVerticesFromCenter.length;
    let numberOfVertices = numberOfTeeth * verticesPerTooth;

    context.beginPath();

    for (let v = 0; v < numberOfVertices; v++) {
        let angleInRadians = Math.PI * 2 * v / numberOfVertices;
        let vModded = v % verticesPerTooth;
        let distanceOfVertexFromCenter = distancesOfVerticesFromCenter[vModded];
        let drawPosX = cx + distanceOfVertexFromCenter * Math.cos(angleInRadians);
        let drawPosY = cy + distanceOfVertexFromCenter * Math.sin(angleInRadians);

        let rotatedPos = rotatePoint(cx, cy, drawPosX, drawPosY, angle)
        
        // Move to the first vertex, then line to the rest
        if (v == 0) {
            context.moveTo(rotatedPos.x, rotatedPos.y);
        } else {
            context.lineTo(rotatedPos.x, rotatedPos.y);
        }
    }
    
    context.closePath();
    context.fill();
    context.stroke();
}



/**
 * Draws a handle.
 * @param {CanvasRenderingContext2D} context - 2d context of target canvas
 * @param {number} param.jointCX - handle main joint center x pos
 * @param {number} param.jointCY - handle main joint center y pos  
 * @param {number} param.tailCX - handle tail center x pos
 * @param {number} param.tailCY - handle tail center y pos  
 * @param {number} param.angle - angle of gear's handler
 * @param {number} param.r - handle main joint radius
 * @param {number} param.borderLineWidth - handle border line with
 * @param {string} param.borderColor - handle border line color
 * @param {string} param.fillColor - handle inner filler color
 */
function drawHandle(context, {jointCX, jointCY, tailCX, tailCY, angle, r, fillColor, borderColor, borderLineWidth}){

    // draw a main joint circle
    drawCircle(context, {
        cx: jointCX,
        cy: jointCY,
        r: r,

        fillColor: fillColor,
        borderColor: borderColor,
        borderThickness: borderLineWidth,
    });

    let tailRadius = r / 2;

    // draw fixator
    let fixatorPos = {
        start: {x: jointCX, y: jointCY - r}, 
        end: {x: jointCX, y: jointCY - r - 10}
    };
    

    let fixatorRotatedPos = {
        start: rotatePoint(jointCX, jointCY, fixatorPos.start.x, fixatorPos.start.y, angle),
        end: rotatePoint(jointCX, jointCY, fixatorPos.end.x, fixatorPos.end.y, angle),
    };

    let handleConnectPoints = {
        top: {x: jointCX, y: jointCY - r},
        bottom: {x: jointCX, y: jointCY + r},
    }

    let handlerRotatedConnectPoint = {
        top: rotatePoint(jointCX, jointCY, handleConnectPoints.top.x, handleConnectPoints.top.y, angle),
        bottom: rotatePoint(jointCX, jointCY, handleConnectPoints.bottom.x, handleConnectPoints.bottom.y, angle),
    }

    // drawning a fixator
    drawLine(context, {
        x1: fixatorRotatedPos.start.x,
        y1: fixatorRotatedPos.start.y,
        x2: fixatorRotatedPos.end.x,
        y2: fixatorRotatedPos.end.y,
        thickness: 2,
        color: borderColor,
    })

    // draw a handle top side
    drawLine(context, {
        x1: handlerRotatedConnectPoint.top.x,
        y1: handlerRotatedConnectPoint.top.y,
        x2: tailCX,
        y2: tailCY,
        thickness: borderLineWidth,
        color: borderColor,
    });

    // draw a bottom handle side
    drawLine(context, {
        x1: handlerRotatedConnectPoint.bottom.x,
        y1: handlerRotatedConnectPoint.bottom.y,
        x2: tailCX,
        y2: tailCY,
        thickness: borderColor,
        color: borderColor,
    });

    // draw a circle at handle tail
    drawCircle(context, {
        cx: tailCX,
        cy: tailCY,
        r: tailRadius,

        fillColor: fillColor,
        borderColor: borderColor,
        borderThickness: borderLineWidth,
    });
}