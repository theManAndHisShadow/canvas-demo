let concentricCircles = new Scene({
        title: 'Concentric circles', 

        code: root => {
            const canvas = root.querySelector('canvas');
            const width = 600;
            const height = 400;
            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext('2d');
            const borderThickness = 2;
            const centerX = width / 2;
            const centerY = height / 2;
            const outerRadius = 150;
            const amount = 10;

            let mousePos = {x: false, y: false};
            let currentActiveQuarter = 0;

            let loop = () => {
                context.clearRect(
                    0, 0,
                    width,
                    height
                );

                // draw background grid
                drawGrid(context, {
                    cellSize: 10,
                    lineThickness: 1,
                    lineColor: 'rgba(0, 0, 0, 0.0032)',
                });

                // show active quarter area of canvas
                paintTheQuarters(context, {width, height, currentActiveQuarter});

                for(let i = 0; i <= amount; i++) {
                    // calc radius of each circle
                    let radius = outerRadius - (outerRadius /  amount) * i;
                    
                    // draw each circle
                    drawCircle(context, {
                        cx: centerX,
                        cy: centerY,
                        r: radius, 
                        borderThickness: borderThickness,
                        borderColor: '#4A235A',
                        fillColor: '#7D3C98',
                    });
                }

                // draw point at center
                drawCircle(context, {
                    cx: centerX,
                    cy: centerY,
                    r: 5, 
                    borderThickness: borderThickness,
                    borderColor: '#4A235A',
                    fillColor: '#4A235A',
                });

                // draw line from circle center to mouse
                if(mousePos.x && mousePos.y) {
                    drawLine(context, {
                        x1: centerX,
                        y1: centerY,
                        x2: mousePos.x,
                        y2: mousePos.y,
                        color: 'rgba(0, 0, 0, 0.5)',
                        thickness: 1,
                    });
                }

                requestAnimationFrame(loop);
            }

            // animate
            requestAnimationFrame(loop);

            root.addEventListener('mousemove', event => {
                // updating some values when mouse moves
                mousePos = getMousePos(canvas, event);
                currentActiveQuarter = getQuarterWithMouse({x: centerX, y: centerY}, mousePos);
                
                // debug
                console.log(currentActiveQuarter);
            });
        }
    });

window.exportedObjects.push(concentricCircles);


/**
 * Scene file internal helper function defenitions
*/

/**
 * Fill each quaerter area of canvas with semi-trasnparent color
 * @param {CanvasRenderingContext2D} context - 2d context of canvas
 * @param {number} param.width - width of canvas
 * @param {number} param.height - height of canvas
 * @param {number} param.currentActiveQuarter - number of active quarter to gain its color
 */
function paintTheQuarters(context, {width, height, currentActiveQuarter}) {
    let opacity = 0.3;
    let gain = 0.3;

    // drawning quarter zones
    // if mouse currently at this zone - set to 'fillColor' gained color using inline comparations:
    // ->  if true, then add 'gain' value to 'opacity' value
    // ->  else - set regular 'opacity' value

    // drawn first quarter zone
    drawRect(context, {
        x: 0,
        y: 0,
        width: width / 2,
        height: height / 2,
        fillColor: `rgba(255, 0, 0, ${currentActiveQuarter == 1 ? opacity + gain : opacity})`,
    });

    // drawn second quarter zone
    drawRect(context, {
        x: width / 2,
        y: 0,
        width: width,
        height: height / 2,
        fillColor: `rgba(255, 255, 0, ${currentActiveQuarter == 2 ? opacity + gain : opacity})`,
    });

    // drawn fourth quarter zone
    drawRect(context, {
        x: 0,
        y: height / 2,
        width: width / 2,
        height: height / 2,
        fillColor: `rgba(0, 255, 0, ${currentActiveQuarter == 4 ? opacity + gain : opacity})`,
    });

    // drawn third quarter zone
    drawRect(context, {
        x: width / 2,
        y: height / 2,
        width: width,
        height: height / 2,
        fillColor: `rgba(0, 255, 255, ${currentActiveQuarter == 3 ? opacity + gain : opacity})`,
    });
}



/**
 * Returns the number of the quarter of the canvas area in which the mouse is currently located.
 * @param {object} centerPos - object of circle center position
 * @param {object} mousePos - object of mouse center position
 * @returns {number} - number of quarter
 */
function getQuarterWithMouse(centerPos, mousePos) {
    let centerX = centerPos.x;
    let centerY = centerPos.y;
    let angle = angleBetweenTwoPoints(centerX, centerY, mousePos.x, mousePos.y);
    let numeric = null;

    if(angle < 0) {
                                            // up
        if(Math.abs(angle) >= 90) {
            numeric = 1;                    // up-left
        } else {
            numeric = 2;                    // up-right
        }
    } else {
                                            // down
        if(Math.abs(angle) >= 90) {
            numeric = 4;                    // down-right
        } else {
            numeric = 3;                    // down-left
        }
    }

    return numeric;
}