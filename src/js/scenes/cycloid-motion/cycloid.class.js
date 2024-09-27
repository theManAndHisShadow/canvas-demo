import { StaticCircleBone } from './staticCircle.class.js';
import { DynamicCircleBone } from './dynamicCicle.class.js';

/**
 * Main class
 */
export class Cycloid {
    constructor({
        cx, cy, label = '', animationSpeed, externalRadius, internalRadius, drawCenterPoint, 
        externalBorderColor = getColor('white', 0.45), internalBorderColor = getColor('white', 0.45),
        traceColor = getColor('white'), traceThickness = 1, traceLength, drawRadiusLine, renderer, 
        invertRotationDirection, radiusOfTracePoint, internalRotationGain = 1, internalInitialAngle = 0
    }){
        this.renderer = renderer;

        this.cx = cx;
        this.cy = cy;

        this.label = label;

        this.animationSpeed = animationSpeed;

        // for spirals, by default = 1
        this.internalRotationGain = internalRotationGain;

        this.drawCenterPoint = drawCenterPoint;

        this.traceColor = traceColor;

        this.proportion = {
            externalRadius: externalRadius,
            internalRadius: internalRadius,
            radiusOfTracePoint: radiusOfTracePoint,
        }

        // some helper value
        let delta_radius = externalRadius - internalRadius;

        // create 2 bone - external and internal
        this.skeleton = [
            // external bone
            new StaticCircleBone({
                id: 0,
                type: 'external',
                cx: this.cx,
                cy: this.cy,
                parent: this,
                radius: externalRadius,
                fillColor: 'transparent',
                borderColor: externalBorderColor,
                borderThickness: 1,
                renderer: this.renderer,
                drawCenterPoint: drawCenterPoint,
                drawRadiusLine: drawRadiusLine,
            }),

            // inner circle 1
            new DynamicCircleBone({
                id: 1,
                type: 'internal',
                cx: this.cx,
                cy: this.cy,
                angle: internalInitialAngle,
                offset: -delta_radius,
                radius: internalRadius,
                fillColor: 'transparent',
                borderColor: internalBorderColor,
                traceLength: traceLength,
                traceThickness: traceThickness,
                traceColor: traceColor,
                borderThickness: 1,
                drawCenterPoint: drawCenterPoint,
                drawRadiusLine: drawRadiusLine,
                parent: this,
                renderer: this.renderer,
                invertRotationDirection: invertRotationDirection,
                radiusOfTracePoint: radiusOfTracePoint,
            })
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

                if(keyName === 'radiusOfTracePoint') {
                    this.proportion.radiusOfTracePoint = newValue;
                }
            }

            if(keyName == 'traceLength') {
                let internals = this.skeleton.filter(bone => bone.type === 'internal');
                internals.forEach(bone => {
                    bone.trace.length = newValue;
                });
            }

            // If the external radius is being updated, adjust related values
            if (bone.type === 'external' && keyName === 'externalRadius') {
                let externalBone = bone;
                let internals = this.skeleton.filter(bone => bone.type === 'internal');
                
                // Update the external circle's radius
                externalBone.radius = newValue;
                this.proportion.externalRadius = newValue;

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
                this.proportion.internalRadius = newValue;

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

            let rotationGain = bone.parent.internalRotationGain;
            
            // rotate particular bone using the calculated multiplier
            bone.rotate((rotationSpeed * m) * rotationGain);
    
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