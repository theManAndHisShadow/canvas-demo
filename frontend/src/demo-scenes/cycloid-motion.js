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
            defaultValue: 100, // 150
            minValue: 100,
            maxValue: 195,
        },

        'internalRadius': {
            type: 'input',
            label: 'Radius of inner circle',
            defaultValue: 10, // 50
            minValue: 10,
            maxValue: 100,
        },

        'speed': {
            type: 'input',
            label: 'Speed',
            minValue: 1,
            defaultValue: 1,
            maxValue: 10,
        },

        'drawCenterPoints': {
            type: 'checkbox',
            label: 'Draw center points',
            state: true,
        },

        'invertRotationDirection': {
            type: 'checkbox',
            label: 'Invert circles rotation dirtection',
            state: false,
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

        // get initial param of cycloid
        let externalRadius = settings.getState('externalRadius');
        let internalRadius = settings.getState('internalRadius');
        let drawCenterPoints = settings.getState('drawCenterPoints');
        let speed = settings.getState('speed');
        let invertRotationDirection = settings.getState('invertLocalRotation');

        // create a new cycloid
        let cycloid = new Cycloid({
            cx: centerX,
            cy: centerY,
            externalRadius: externalRadius,
            internalRadius: internalRadius,
            drawCenterPoints: drawCenterPoints,
            animationSpeed: speed,
            renderer: context,
            invertRotationDirection: invertRotationDirection,
        });

        // log
        console.log(cycloid);

        settings.subscribe((key, newValue, oldValue) => {
            // update params of cycloid from ui
            if(key == 'externalRadius') externalRadius = newValue;
            if(key == 'internalRadius') internalRadius = newValue;
            if(key == 'drawCenterPoints') drawCenterPoints = newValue;
            if(key == 'speed') speed = newValue;
            if(key == 'invertRotationDirection') invertRotationDirection = newValue;

            // update cycloid params
            cycloid.update('externalRadius', externalRadius);
            cycloid.update('internalRadius', internalRadius);
            cycloid.update('drawCenterPoints', drawCenterPoints);
            cycloid.update('animationSpeed', speed);
            cycloid.update('invertRotationDirection', invertRotationDirection);
        });

        // Main function
        let loop = () => {
            context.clearRect(
                0, 0,
                width,
                height
            );
            
            // amimate cycloid
            cycloid.animate(cycloid.animationSpeed);

            // draw cycloid each time when frame is updated
            cycloid.render();
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
    #trace = []
    constructor({color, length = 100, parent}){

        this.length = length;
        this.color = color;

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
     * Resets Tracer points array.
     */
    clear(){
        this.#trace = [];
    }


    /**
     * Render trace.
     */
    render(){
        this.#trace.forEach(point => {
            // draw each point
            drawCircle(this.parent.renderer, {
                cx: point.x,
                cy: point.y,
                r: 1, 
                borderThickness: 1,
                borderColor: this.color,
                fillColor: this.color,
            });
        });
    }
}



/**
 * Class of single figure (bone)
 */
class CircleBone {
    /**
     * 
     * @param {object} param.parent - parent object of class instance
     * @param {number} param.cx - x pos of circle center
     * @param {number} param.cy - y pos of circle center
     * @param {number} param.radius - radius of circle center
     * @param {number} param.angle - angle of circle
     * @param {{x: number, y: number}} param.origin - rotation origin of circle
     * @param {string} param.fillColor - color if circle fill
     * @param {string} param.traceColor - color of circle point trace line
     * @param {string} param.borderColor - color of circle border line
     * @param {number} param.borderThickness - thickness of circle border
     * @param {number} param.type - type of circle (internal or external)
     * @param {boolean} param.drawCenterPoint - draw or not center point of circle
     * @param {boolean} param.drawRadiusLine - draw or not radius line of circle
     * @param {number} param.offset - offset between external circle center and internal center
     * @param {CanvasRenderingContext2D} param.renderer - where the circle will be drawn
     * @param {boolean} param.invertRotationDirection - select direction of rotatioin
     */
    constructor({
        parent, cx, cy, radius, angle = 0, origin, fillColor, traceColor = getColor('red'), borderColor, borderThickness, 
        type, renderer, drawCenterPoint = false, drawRadiusLine = false, offset = 0, invertRotationDirection = false
    }){
        this.renderer = renderer;
        this.parent = parent;

        this.cx = cx;
        this.cy = cy;
        this.staticCX = cx;
        this.staticCY = cy - offset;
        this.angle = angle;
        this.globalAngle = 0;
        this.origin = origin || {x: (this.renderer.canvas.width / 2), y: (this.renderer.canvas.height / 2)};

        this.trace = new Tracer({
            color: traceColor,
            length: 10000,
            parent: this,
        });

        this.radius = radius;
        this.fillColor = fillColor;
        this.borderColor = borderColor;
        this.borderThickness = borderThickness;
        this.offset = offset;
        
        this.drawCenterPoint = drawCenterPoint;
        this.drawRadiusLine = drawRadiusLine;
        this.type = type;
        this.invertRotationDirection = invertRotationDirection;
    }


    /**
     * Rotate circle around its center
     * @param {number} step - rotation step
     */
    rotate(step){
        this.angle += (this.invertRotationDirection === true ? step * -1 : step);

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
                r: 3, 
                borderThickness: this.borderThickness,
                borderColor: this.borderColor,
                fillColor: this.borderColor, // not typo!
            });
        }

        // radius line line from center to cicrlce line
        if(this.drawRadiusLine === true) {
            let rotatedPoint = rotatePoint(corrected_x, corrected_y, corrected_x, corrected_y + this.radius, this.angle);
            this.trace.push(rotatedPoint);
            
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
                r: 3, 
                borderThickness: 2,
                borderColor: this.borderColor,
                fillColor: getColor('black'),
            });
        }
    }
}



/**
 * Main class
 */
class Cycloid {
    constructor({cx, cy, animationSpeed, externalRadius, internalRadius, drawCenterPoints, renderer, invertRotationDirection}){
        this.renderer = renderer;

        this.cx = cx;
        this.cy = cy;

        this.animationSpeed = animationSpeed;

        this.drawCenterPoints= drawCenterPoints;

        // some helper value
        let delta_radius = externalRadius - internalRadius;

        // create 2 bone - external and internal
        this.skeleton = [
            // external bone
            new CircleBone({
                type: 'external',
                cx: this.cx,
                cy: this.cy,
                radius: externalRadius,
                fillColor: 'transparent',
                borderColor: getColor('black'),
                borderThickness: 2,
                renderer: this.renderer,
                drawCenterPoint: drawCenterPoints,
                drawRadiusLine: false,
                parent: this,
            }),

            // inner circle 1
            new CircleBone({
                type: 'internal',
                cx: this.cx,
                cy: this.cy,
                offset: -delta_radius,
                radius: internalRadius,
                fillColor: 'transparent',
                borderColor: getColor('black'),
                traceColor: getColor('blue'),
                borderThickness: 2,
                drawCenterPoint: drawCenterPoints,
                drawRadiusLine: true,
                parent: this,
                renderer: this.renderer,
                invertRotationDirection: invertRotationDirection,
            }),

             // inner circle 1
            new CircleBone({
                type: 'internal',
                cx: this.cx,
                cy: this.cy,
                offset: delta_radius,
                radius: internalRadius,
                fillColor: 'transparent',
                borderColor: getColor('black'),
                traceColor: getColor('red'),
                borderThickness: 2,
                drawCenterPoint: drawCenterPoints,
                drawRadiusLine: true,
                parent: this,
                renderer: this.renderer,
                invertRotationDirection: invertRotationDirection,
            }),
        ];
    }


    /**
     * Updates the values of the cycloid and its bones (circles) parameters.
     * @param {string} keyName - The parameter key name to update.
     * @param {any} newValue - The new value to assign to the parameter.
     */
    update(keyName, newValue) {
        // Update the value for the cycloid itself if the key is either 'drawCenterPoints' or 'animationSpeed'
        if (keyName === 'drawCenterPoints' || keyName === 'animationSpeed') {
            this[keyName] = newValue;
        }

        // Update parameters for the bones (external and internal circles)
        this.skeleton.forEach(bone => {
            if(keyName === 'invertRotationDirection') {
                let internals = this.skeleton.filter(bone => bone.type === 'internal');
                internals.forEach(internalBone => { internalBone.invertRotationDirection = newValue });
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
        // get external circle
        let externalCircle = this.skeleton.find(bone => bone.type == 'external')

        // get all internal circles
        let allInternalCircles = this.skeleton.filter(bone => bone.type == 'internal');
        
        // rotate all internal bones (circles)
        allInternalCircles.forEach(bone => {
            // rotate particular bone
            bone.rotate(speed);

            // and at same time move bone aroud orign (epicenter)
            bone.moveAroundOrigin((speed * -1) * (bone.radius / externalCircle.radius));
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