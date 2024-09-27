import { BasicCircelBone } from "./basicCircle.class";
import { Tracer } from "./tracer.class";

export class DynamicCircleBone extends BasicCircelBone {
    /**
     * super class params
     * @param {object} param.parent - parent object of class instance
     * @param {number} param.cx - x pos of circle center
     * @param {number} param.cy - y pos of circle center
     * @param {number} param.radius - radius of circle center
     * @param {string} param.fillColor - color if circle fill
     * @param {string} param.borderColor - color of circle border line
     * @param {number} param.borderThickness - thickness of circle border
     * @param {number} param.type - type of circle (internal or external)
     * @param {boolean} param.drawCenterPoint - draw or not center point of circle
     * @param {boolean} param.drawRadiusLine - draw or not radius line of circle3
     * @param {CanvasRenderingContext2D} param.renderer - where the circle will be drawn
     * 
     * new class params
     * @param {{x: number, y: number}} param.origin - center rotation (epicenter)
     * @param {number} param.offset - offset between instance and static circle
     * @param {number} param.angle - local angle of circle (nears it center)
     * @param {number} param.traceLength - length of trace
     * @param {string} param.traceColor - color of trace
     * @param {number} param.traceThickness - thickness of trace line
     * @param {number} param.radiusOfTracePoint - radius of trace point 
     * @param {boolean} param.invertRotationDirection - direction of rotation
     */
    constructor({
        id = null, 
        type, 
        parent, 
        renderer, 
        cx, cy, radius, 
        borderColor, borderThickness, fillColor, 
        drawCenterPoint = false, drawRadiusLine = false,
        
        origin, offset, angle = 0,
        traceLength = 1000, traceColor = getColor('red'), traceThickness, radiusOfTracePoint,
        invertRotationDirection = false, 
    }){
        super({id, type, parent, renderer, cx, cy, radius, borderColor, borderThickness, fillColor, drawCenterPoint, drawRadiusLine});
        
        // set positioning parameters (pivot point, angle, global angle, etc.)
        this.origin = origin || {x: this.parent.cx, y: this.parent.cy};
        this.offset = offset;
        this.angle = angle;
        this.globalAngle = 0;

        // se satic cx and cy for correct rotation
        this.staticCX = cx;
        this.staticCY = cy - offset;

        // set trace objet
        this.trace = new Tracer({
            color: traceColor,
            length: traceLength, // 200
            thickness: traceThickness,
            parent: this,
        });
         
        // misc aprams
        this.radiusOfTracePoint = radiusOfTracePoint;  
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

        // loacal helper funcion
        // limits the discreteness of tracing 
        let discretLimiter = (newPoint, distanceLimit) => {
            if(this.trace.length > 0) {
                // get prev point
                let prevPoint = this.trace.getLastPoint();

                // get distanse between new point and prev point
                let distance = getDistanseBetweenTwoPoint(prevPoint.x, prevPoint.y, newPoint.x, newPoint.y);

                // if distance greater than limit - return true else - false
                return distance >= distanceLimit ? true : false;
            } else return false;
        }

        // new poin after rotations
        let rotatedPoint = rotatePoint(corrected_x, corrected_y, corrected_x, corrected_y + this.radiusOfTracePoint, this.angle);

        // add point if
        // - it first point of trace
        // - or the discreteness function allows for addition
        if(this.trace.getLength() == 0 || discretLimiter(rotatedPoint, 3)) {
            this.trace.push(rotatedPoint);
        }


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
