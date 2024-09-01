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
        let externalRadius = settings.getState('externalRadius');
        let internalRadius = settings.getState('internalRadius');
        let drawCenterPoints = settings.getState('drawCenterPoints');
        let cycloid = new Cycloid({
            cx: centerX,
            cy: centerY,
            externalRadius: externalRadius,
            internalRadius: internalRadius,
            drawCenterPoints: drawCenterPoints,
            renderer: context,
        });

        settings.subscribe((key, newValue, oldValue) => {
            // update params of cycloid from ui
            if(key == 'externalRadius') externalRadius = newValue;
            if(key == 'internalRadius') internalRadius = newValue;
            if(key == 'drawCenterPoints') drawCenterPoints = newValue;

            cycloid.update('externalRadius', externalRadius);
            cycloid.update('internalRadius', internalRadius);
            cycloid.update('drawCenterPoints', drawCenterPoints);
        });

        // Main function
        let loop = () => {
            context.clearRect(
                0, 0,
                width,
                height
            );
            
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
 * Class of single figure (bone)
 */
class CircleBone {
    constructor({cx, cy, radius, fillColor, borderColor, borderThickness, type, renderer, drawCenterPoint = false, drawRadiusLine = false, offset = 0}){
        this.renderer = renderer;

        this.cx = cx;
        this.cy = cy;
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
     * Renders circle bone
     */
    render(){    
        // circle line
        drawCircle(this.renderer, {
            cx: this.cx,
            cy: this.cy - this.offset,
            r: this.radius, 
            borderThickness: this.borderThickness,
            borderColor: this.borderColor,
            fillColor: this.fillColor,
        });

        if(this.drawCenterPoint === true) {
            // circle's center
            drawCircle(this.renderer, {
                cx: this.cx,
                cy: this.cy - this.offset,
                r: 3, 
                borderThickness: this.borderThickness,
                borderColor: this.borderColor,
                fillColor: this.borderColor, // not typo!
            });
        }

        // radius line line from center to cicrlce line
        if(this.drawRadiusLine === true) {
            // radius line of circle
            drawLine(this.renderer, {
                x1: this.cx,
                y1: this.cy - this.offset,
                x2: this.cx,
                y2: this.cy + this.radius - this.offset,
                thickness: this.borderThickness,
                color: this.borderColor,
            });

            // draw point on circle line
            drawCircle(this.renderer, {
                cx: this.cx,
                cy: this.cy + this.radius - this.offset,
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
    constructor({cx, cy, externalRadius, internalRadius, drawCenterPoints, renderer}){
        this.renderer = renderer;

        // main feature - cycloid line
        this.line = null;

        this.cx = cx;
        this.cy = cy;

        this.drawCenterPoints= drawCenterPoints;

        // some helper value
        let delta_radius = externalRadius - internalRadius;

        // create 2 bone - external and internal
        this.skeleton = [
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
            }),

            new CircleBone({
                type: 'internal',
                cx: this.cx,
                cy: this.cy,
                offset: delta_radius,
                radius: internalRadius,
                fillColor: 'transparent',
                borderColor: getColor('black'),
                borderThickness: 2,
                renderer: this.renderer,
                drawCenterPoint: drawCenterPoints,
                drawRadiusLine: true,
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
        if(keyName == 'drawCenterPoints') this[keyName] = newValue;

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
     * Renders cycloid bones.
     */
    render(){
        this.skeleton.forEach(bone => {
            bone.render();
        })
    }
}