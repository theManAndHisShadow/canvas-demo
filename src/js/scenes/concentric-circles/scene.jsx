
import React from "react";
import SceneTemplate from "../../core/scene.template.jsx";
import { getMousePos, drawGrid, drawCircle, drawLine, getDistanseBetweenTwoPoint} from '../../misc/helpers.js';

function ConcentricCirclesScene() {
    return (
        <SceneTemplate
            title="Concentric circles"
            desciption="A simple scene, training with rotating shapes and interacting with mouse events"
            code={code}
        />
    );
}

function code(){
    const root = document.querySelector('#root');
    const canvas = root.querySelector('canvas'); 
    const context = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    // circles preferences
    const borderThickness = 2;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = 150;
    const gainFactor = 0.0002;

    // some dynamic values (updates in 'mousemove' event)
    let mousePos = {x: false, y: false};
    let distance = null;

    const amount = 10;
    let loop = () => {
        // const amount = settings.getState("circlesAmount");

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

    root.addEventListener('mousemove', event => {
        loop();
        
        // updating some values when mouse moves
        mousePos = getMousePos(canvas, event);
        distance = Math.round(getDistanseBetweenTwoPoint(mousePos.x, mousePos.y, centerX, centerY));

        // add some additional info
        // display.updateValue('distance', distance + ' px.');
        // display.updateValue('angle', Math.round(getAngleBetweenTwoPoints(centerX, centerY, mousePos.x, mousePos.y)) + ' °');
    });
}


/**
* Calculates persent of movement based of max distanse value
* @param {number} distance - how much distance has been covered (current progress in px)
* @param {number} maxDistance - max distance
* @returns {number} - how mush disnatce has been covered in %
*/
function getPersentOfDistance(distance, maxDistance) {
    return distance >= maxDistance ? 100 : Math.round((distance * 100) / maxDistance);
}

export default ConcentricCirclesScene;