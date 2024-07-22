let concentricCircles = new Scene({
    title: 'Concentric circles', 

    ui: {
        'dev': {
            type: 'checkbox',
            label: 'Show dev visual',
            state: false,
        },

        'circlesAmount': {
            type: 'input',
            label: 'Circles',
            maxValue: 55,
            defaultValue: 5,
        },
    },

    code: (root, display, settings) => {
        const canvas = root.querySelector('canvas');
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        // circles preferences
        const borderThickness = 2;
        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = 150;
        const gainFactor = 0.0002;

        // some dynamic values (updates in 'mousemove' event)
        let mousePos = {x: false, y: false};
        let currentActiveQuarter = 0;
        let distance = null;

        let loop = () => {
            const amount = settings.getState("circlesAmount");

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

            if(settings.getState("dev") === true) {
                // show active quarter area of canvas
                paintTheQuarters(context, {width, height, currentActiveQuarter});
            }

            // draw concetric circles
            for(let i = 0; i <= amount; i++) {
                // Calculate the radius of each circle
                let radius = outerRadius - ((outerRadius / amount) * i);

                // Calculate the distance from the center to the mouse position
                let dx = centerX - mousePos.x;
                let dy = centerY - mousePos.y;

                // Calculate stepsize between circles
                let p = (outerRadius / amount);

                // calculate gain - еhe further the mouse pointer is from the center, the stronger the offset gain
                let gain = getPersentOfDistance(distance, canvas.height / 2) * gainFactor;

                // Calculate the offset for each circle
                let offset = p * (i / amount);
                let offsetX = dx * offset * gain;
                let offsetY = dy * offset * gain;

                // Calculate the new center coordinates for the current circle
                let nx = centerX - offsetX;
                let ny = centerY - offsetY;

                // Draw each circle
                drawCircle(context, {
                    cx: nx,
                    cy: ny,
                    r: radius,
                    borderThickness: borderThickness,
                    borderColor: '#4A235A',
                    fillColor: '#7D3C98',
                });

                if (i === amount - 1) {
                    drawCircle(context, {
                        cx: nx,
                        cy: ny,
                        r: 5,
                        borderThickness: borderThickness,
                        borderColor: '#4A235A',
                        fillColor: '#4A235A',
                    });
                }

                if(settings.getState("dev") === true) {
                     // Draw a point at the center of the innermost circle
                    if (i === amount - 1) {
                        if (mousePos.x && mousePos.y) {
                            drawLine(context, {
                                x1: nx,
                                y1: ny,
                                x2: mousePos.x,
                                y2: mousePos.y,
                                color: 'rgba(0, 0, 0, 0.5)',
                                thickness: 1,
                            });

                            drawLine(context, {
                                x1: width / 2 - outerRadius,
                                y1: height/ 2,
                                x2: mousePos.x,
                                y2: mousePos.y,
                                color: 'rgba(0, 0, 0, 0.5)',
                                thickness: 1,
                            });

                            drawLine(context, {
                                x1: width / 2 + outerRadius,
                                y1: height/ 2,
                                x2: mousePos.x,
                                y2: mousePos.y,
                                color: 'rgba(0, 0, 0, 0.5)',
                                thickness: 1,
                            });

                            drawLine(context, {
                                x1: width / 2,
                                y1: height / 2 + outerRadius,
                                x2: mousePos.x,
                                y2: mousePos.y,
                                color: 'rgba(0, 0, 0, 0.5)',
                                thickness: 1,
                            });

                            drawLine(context, {
                                x1: width / 2,
                                y1: height / 2 - outerRadius,
                                x2: mousePos.x,
                                y2: mousePos.y,
                                color: 'rgba(0, 0, 0, 0.5)',
                                thickness: 1,
                            });
                        }
                    }
                }
            }

            requestAnimationFrame(loop);
        }

        // animate
        requestAnimationFrame(loop);

        root.addEventListener('mousemove', event => {
            // updating some values when mouse moves
            mousePos = getMousePos(canvas, event);
            distance = Math.round(getDistanseBetweenTwoPoint(mousePos.x, mousePos.y, centerX, centerY));
            currentActiveQuarter = getQuarterWithMouse({x: centerX, y: centerY}, mousePos);
        });
    }
});

window.exportedObjects.push(concentricCircles);


/**
* Scene file internal helper function defenitions
*/

/**
* Calculates persent of movement based of max distanse value
* @param {number} distance - how much distance has been covered (current progress in px)
* @param {number} maxDistance - max distance
* @returns {number} - how mush disnatce has been covered in %
*/
function getPersentOfDistance(distance, maxDistance) {
    return distance >= maxDistance ? 100 : Math.round((distance * 100) / maxDistance);
}

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
    let angle = getAngleBetweenTwoPoints(centerX, centerY, mousePos.x, mousePos.y);
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
        if(Mat1h.abs(angle) >= 90) {
            numeric = 4;                    // down-right
        } else {
            numeric = 3;                    // down-left
        }
    }

    return numeric;
}