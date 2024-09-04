let cycloidMotionScene = new Scene({
    title: 'Cycloid motion', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'A cycloid is the curve traced by a point on the circumference of a circle as it rolls along a straight line. The key condition in this motion is that the circle rolls without slipping. A specific example of a cycloid is the epicycloid, where a circle rolls inside a larger circle. An example of an hypocycloid is demonstrated in the interactive scene.',
        },

        'preset': {
            type: 'preset-dropdown-list',
            label: 'Preset',
            selectedByDefault: 2,
            options: [
                {name: 'Sandbox', allowedElements: ['*']}, 
                {name: 'Test 1', allowedElements: []},
                {name: 'Test 2', allowedElements: ['externalRadius', 'internalRadius']}
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

        'speed': {
            type: 'input',
            label: 'Speed',
            minValue: 0,
            defaultValue: 3,
            maxValue: 10,
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

        // get initial param of cycloid
        let externalRadius = settings.getState('externalRadius');
        let internalRadius = settings.getState('internalRadius');
        let drawCenterPoint = settings.getState('drawCenterPoint');
        let drawRadiusLine = settings.getState('drawRadiusLine');
        let speed = settings.getState('speed');
        let invertRotationDirection = settings.getState('invertRotationDirection');
        let radiusOfTracePoint = settings.getState('radiusOfTracePoint');
        

        // create a new cycloid
        let cycloid = new Cycloid({
            cx: centerX,
            cy: centerY,
            externalRadius: externalRadius,
            internalRadius: internalRadius,
            drawCenterPoint: drawCenterPoint,
            drawRadiusLine: drawRadiusLine,
            animationSpeed: speed,
            renderer: context,
            invertRotationDirection: invertRotationDirection,
            radiusOfTracePoint: radiusOfTracePoint,
        });

        // log
        console.log(cycloid);

        settings.subscribe((key, newValue, oldValue) => {
            // update params of cycloid from ui
            if(key == 'externalRadius') externalRadius = newValue;
            if(key == 'internalRadius') internalRadius = newValue;
            if(key == 'drawCenterPoint') drawCenterPoint = newValue;
            if(key == 'speed') speed = newValue;
            if(key == 'invertRotationDirection') invertRotationDirection = newValue;
            if(key == 'radiusOfTracePoint') radiusOfTracePoint = newValue;
            if(key == 'drawRadiusLine') drawRadiusLine = newValue;
            
            // update cycloid params
            cycloid.update('externalRadius', externalRadius);
            cycloid.update('internalRadius', internalRadius);
            cycloid.update('drawCenterPoint', drawCenterPoint);
            cycloid.update('drawRadiusLine', drawRadiusLine);
            cycloid.update('animationSpeed', speed);
            cycloid.update('invertRotationDirection', invertRotationDirection);
            cycloid.update('radiusOfTracePoint', radiusOfTracePoint);
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
            
            // amimate cycloid
            cycloid.animate(speed);

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
        type, renderer, drawCenterPoint = false, drawRadiusLine = false, offset = 0, invertRotationDirection = false, radiusOfTracePoint,
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
            length: 2000, // 200
            parent: this,
        });

        this.radiusOfTracePoint = radiusOfTracePoint,

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

        let rotatedPoint = rotatePoint(corrected_x, corrected_y, corrected_x, corrected_y + this.radiusOfTracePoint, this.angle);
        this.trace.push(rotatedPoint);
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
    constructor({cx, cy, animationSpeed, externalRadius, internalRadius, drawCenterPoint, drawRadiusLine, renderer, invertRotationDirection, radiusOfTracePoint}){
        this.renderer = renderer;

        this.cx = cx;
        this.cy = cy;

        this.animationSpeed = animationSpeed;

        this.drawCenterPoint = drawCenterPoint;

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
                borderColor: getColor('white', 0.45),
                borderThickness: 1,
                renderer: this.renderer,
                drawCenterPoint: drawCenterPoint,
                drawRadiusLine: drawRadiusLine,
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
                borderColor: getColor('white', 0.45),
                traceColor: getColor('blue'),
                borderThickness: 1,
                drawCenterPoint: drawCenterPoint,
                drawRadiusLine: drawRadiusLine,
                parent: this,
                renderer: this.renderer,
                invertRotationDirection: invertRotationDirection,
                radiusOfTracePoint: radiusOfTracePoint,
            }),

            // inner circle 2
            new CircleBone({
                type: 'internal',
                cx: this.cx,
                cy: this.cy,
                offset: delta_radius,
                radius: internalRadius,
                fillColor: 'transparent',
                borderColor: getColor('white', 0.45),
                traceColor: getColor('red'),
                borderThickness: 1,
                drawCenterPoint: drawCenterPoint,
                drawRadiusLine: true,
                parent: this,
                renderer: this.renderer,
                invertRotationDirection: invertRotationDirection,
                radiusOfTracePoint: radiusOfTracePoint,
            }),
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
            
            // rotate particular bone using the calculated multiplier
            bone.rotate(rotationSpeed * m);
    
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