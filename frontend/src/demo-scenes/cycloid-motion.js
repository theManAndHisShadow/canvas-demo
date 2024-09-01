let cycloidMotionScene = new Scene({
    title: 'Cycloid motion', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Empty',
        },

        'externalRadius': {
            type: 'input',
            label: 'Radius of external circle',
            defaultValue: 150,
            minValue: 100,
            maxValue: 195,
        },

        'internalRadius': {
            type: 'input',
            label: 'Radius of inner circle',
            defaultValue: 50,
            minValue: 30,
            maxValue: 75,
        },

        'drawCenterPoints': {
            type: 'checkbox',
            label: 'Draw center points',
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

        const context = canvas.getContext('2d');

        // get initial param of cycloid
        let radius_1 = settings.getState('externalRadius');
        let radius_2 = settings.getState('internalRadius');
        let drawCenterPoints = settings.getState('drawCenterPoints');

        settings.subscribe((key, newValue, oldValue) => {
            // update params of cycloid from ui
            if(key == 'externalRadius') radius_1 = newValue;
            if(key == 'internalRadius') radius_2 = newValue;
            if(key == 'drawCenterPoints') drawCenterPoints = newValue;
        });

        // Main function
        let loop = () => {
            context.clearRect(
                0, 0,
                width,
                height
            );

            // draw prototype function
            drawCycloid(context, {
                centerX: centerX,
                centerY: centerY,
                externalRadius: radius_1,
                internalRaius: radius_2,
                drawCenterPoints: drawCenterPoints,
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
 * Function prototype
 * @param {*} context 
 * @param {*} param.centerX
 * @param {*} param.centerY
 * @param {*} param.externalRadius
 * @param {*} param.internalRadius
 * @param {*} param.drawCenterPoints
 */
function drawCycloid(context, {centerX, centerY, externalRadius, internalRaius, drawCenterPoints = true}){
    let delta_radius = (externalRadius - internalRaius);

    // external circle
    drawCircle(context, {
        cx: centerX,
        cy: centerY,
        r: externalRadius, 
        borderThickness: 2,
        borderColor: getColor('black'),
        fillColor: 'transparent',
    });

    // internal circle
    drawCircle(context, {
        cx: centerX,
        cy: centerY - delta_radius,
        r: internalRaius, 
        borderThickness: 2,
        borderColor: getColor('black'),
        fillColor: 'transparent',
    });

    // radius line of internal circle
    drawLine(context, {
        x1: centerX,
        y1: centerY - delta_radius,
        x2: centerX,
        y2: centerY - delta_radius + internalRaius,
    });

     // radius end dot on  internal circle line
    drawCircle(context, {
        cx: centerX,
        cy: centerY - delta_radius + internalRaius,
        r: 3, 
        borderThickness: 2,
        borderColor: getColor('black'),
        fillColor: getColor('black'),
    });

    if(drawCenterPoints === true) {
        // external circle's center
        drawCircle(context, {
            cx: centerX,
            cy: centerY,
            r: 3, 
            borderThickness: 2,
            borderColor: getColor('black'),
            fillColor: getColor('black'),
        });


        // internal circle's center
        drawCircle(context, {
            cx: centerX,
            cy: centerY - delta_radius,
            r: 3, 
            borderThickness: 2,
            borderColor: getColor('black'),
            fillColor: getColor('black'),
        });
    }
}