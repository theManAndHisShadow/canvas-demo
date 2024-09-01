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
            defaultValue: 120, // 150
            minValue: 100,
            maxValue: 195,
        },

        'internalRadius': {
            type: 'input',
            label: 'Radius of inner circle',
            defaultValue: 40, // 50
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
        let externalRadius = settings.getState('externalRadius');
        let internalRadius = settings.getState('internalRadius');
        let drawCenterPoints = settings.getState('drawCenterPoints');
        let speed = settings.getState('speed');

        // create a new cycloid
        let cycloid = new Cycloid({
            cx: centerX,
            cy: centerY,
            externalRadius: externalRadius,
            internalRadius: internalRadius,
            drawCenterPoints: drawCenterPoints,
            animationSpeed: speed,
            renderer: context,
        });

        // log
        console.log(cycloid);

        settings.subscribe((key, newValue, oldValue) => {
            // update params of cycloid from ui
            if(key == 'externalRadius') externalRadius = newValue;
            if(key == 'internalRadius') internalRadius = newValue;
            if(key == 'drawCenterPoints') drawCenterPoints = newValue;
            if(key == 'speed') speed = newValue;

            // update cycloid params
            cycloid.update('externalRadius', externalRadius);
            cycloid.update('internalRadius', internalRadius);
            cycloid.update('drawCenterPoints', drawCenterPoints);
            cycloid.update('animationSpeed', speed);
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
    constructor({color, length = 100, parent}){
        this.trace = [];

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
            if(this.trace.length > this.length) {
                this.trace.shift();
            }

            this.trace.push(point);
        }
    }


    /**
     * Render trace.
     */
    render(){
        this.trace.forEach(point => {
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
     */
    constructor({
        parent, cx, cy, radius, angle = 0, origin, fillColor, traceColor = getColor('red'), borderColor, borderThickness, 
        type, renderer, drawCenterPoint = false, drawRadiusLine = false, offset = 0
    }){
        this.renderer = renderer;
        this.parent = parent;

        this.cx = cx;
        this.cy = cy;
        this.angle = angle;
        this.origin = origin || {x: (this.renderer.canvas.width / 2), y: (this.renderer.canvas.height / 2)};

        this.trace = new Tracer({
            color: traceColor,
            length: 325,
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
    moveAroundOirigin(step = 1){
        let rotatedCenter = rotatePoint(this.origin.x, this.origin.y, this.cx, this.cy, step * 3);

        if(rotatedCenter && rotatedCenter.x && rotatedCenter.y) {
            this.cx = rotatedCenter.x;
            this.cy = rotatedCenter.y;
        }
    }


    /**
     * Renders circle bone
     */
    render(){    
        // circle line
        drawCircle(this.renderer, {
            cx: this.cx,
            cy: this.cy,
            r: this.radius, 
            borderThickness: this.borderThickness,
            borderColor: this.borderColor,
            fillColor: this.fillColor,
        });

        if(this.drawCenterPoint === true) {
            // circle's center
            drawCircle(this.renderer, {
                cx: this.cx,
                cy: this.cy,
                r: 3, 
                borderThickness: this.borderThickness,
                borderColor: this.borderColor,
                fillColor: this.borderColor, // not typo!
            });
        }

        // radius line line from center to cicrlce line
        if(this.drawRadiusLine === true) {
            let rotatedPoint = rotatePoint(this.cx, this.cy, this.cx, this.cy + this.radius, this.angle);
            this.trace.push(rotatedPoint);
            
            // radius line of circle
            drawLine(this.renderer, {
                x1: this.cx,
                y1: this.cy,
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
    constructor({cx, cy, animationSpeed, externalRadius, internalRadius, drawCenterPoints, renderer}){
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
                cy: this.cy - delta_radius,
                offset: delta_radius,
                radius: internalRadius,
                fillColor: 'transparent',
                borderColor: getColor('black'),
                traceColor: getColor('blue'),
                borderThickness: 2,
                drawCenterPoint: drawCenterPoints,
                drawRadiusLine: true,
                parent: this,
                renderer: this.renderer,
            }),

            // inner circle 2
            new CircleBone({
                type: 'internal',
                cx: this.cx,
                cy: this.cy + delta_radius,
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
            }),
        ];
    }


    /**
     * Updates value of cycloid and it bone params
     * @param {string} keyName - cycloid param key name
     * @param {any} newValue - new value
     */
    update(keyName, newValue){
        // update value for cycloid itself
        if(keyName == 'drawCenterPoints' || keyName == 'animationSpeed') this[keyName] = newValue;

        // update params for bones
        this.skeleton.forEach(bone => {
            // when user change external circles radius - update value of offset for all internal circles
            if(bone.type == 'external' && keyName == 'externalRadius') {
                let internal = this.skeleton.find(bone => bone.type == 'internal');
                
                bone.radius = newValue;
                internal.offset = newValue - internal.radius;
            }

            // when user change internal circles radius - update value of offset for all internal circles
            if(bone.type == 'internal' && keyName == 'internalRadius') {
                let external = this.skeleton.find(bone => bone.type == 'external');

                bone.radius = newValue;
                bone.offset = external.radius - newValue;
            }

            if(keyName == 'drawCenterPoints') {
                bone.drawCenterPoint = newValue;
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
            bone.moveAroundOirigin((speed * -1) * (bone.radius / externalCircle.radius));
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