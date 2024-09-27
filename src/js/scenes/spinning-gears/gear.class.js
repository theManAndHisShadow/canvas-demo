
class SynteticEventTarget {
    constructor (){
        this.events = {};
    }

    addEventListener(eventType, callback) {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }
        
        this.events[eventType].push(callback);
    }

    dispatchEvent(eventType, data) {
        if (this.events[eventType]) {
            this.events[eventType].forEach(callback => callback(data));
        }
    }
}


export class Gear extends SynteticEventTarget {
    /**
    * @constructor 
    * @param {CanvasRenderingContext2D} renderer - 2d context of target canvas
    * @param {number} param.cx - gear center x pos
    * @param {number} param.cy - gear center y pos
    * @param {number} param.r - gear radius
    * @param {number} [param.angle=0.001] - angle of gear
    * @param {number} [param.role='slave'] - is gear driverr or drivern
    * @param {number|null} param.linkedTo - The id of the gear to which this gear is attached. If null, this gear is not attached to any other gear.
    * @param {number} param.numberOfTeeth - gear's number of teeth 
    * @param {number} param.tootheHeight - gear's single tooth height
    * @param {number} [param.borderLineWidth=2] - gear's border line width/thickness
    * @param {string} [param.borderColor='rgba(255, 255, 255, 1)'] - gears's border color
    * @param {string} param.alternativeBorderColor - border color for dev mode
    * @param {string} param.alternativeFillColor - fill color for dev mode
    * @param {string} param.fillColor - internal gear color. If color is not set manually - a semi-transparent version of the border color will be calculated
    * @param {boolean} [param.devMode=false] - special optional param to show dev helper elements
     */
    constructor({
        id = null, renderer, 
        cx, cy, r, angle = 0.001, direction = 1, linkedTo = null,
        toothing = 'external', numberOfTeeth, tootheHeight, role = 'slave',
        fillColor = 'rgba(255, 255, 255, 0.1)',  alternativeFillColor,
        borderColor = 'rgba(255, 255, 255, 1)', alternativeBorderColor, borderLineWidth = 2,
        devMode = false,
    }){ 
        // setting color based on gear role and gear type
        alternativeFillColor = (typeof alternativeFillColor === 'string') 
            ? alternativeFillColor 
            : getGearColor(toothing, role, 0.4);
        
        alternativeBorderColor = (typeof alternativeBorderColor === 'string') 
            ? alternativeBorderColor 
            :  getGearColor(toothing, role, 1)

        super();

        this.id = id;
        this.cx = cx;
        this.cy = cy;
        this.r = r;
        this.angle = angle;
        this.direction = direction,
        this.rotations = 0;

        this.role = role;
        this.linkedTo = role == 'driver' ? null : linkedTo;

        this.toothing = toothing;
        this.numberOfTeeth = numberOfTeeth;
        this.tootheHeight = tootheHeight;
        
        this.fillColor = fillColor;
        this.alternativeFillColor = alternativeFillColor;
        this.borderColor = borderColor;
        this.alternativeBorderColor = alternativeBorderColor;
        this.borderLineWidth = borderLineWidth;

        this.renderer = renderer;

        this.devMode = devMode
    }



    /**
     * Calculating ration between two linked gears and return speed of rotation.
     * @param {Gear[]} gears - array of all created gears
     * @returns {number}
     */
    getRotationSpeed(gears){
        // if linked gear === null - is driverr gear
        if (this.linkedTo === null) {
            return 1; 
        }

        // get the gear to which ours is connected 
        const linkedGear = gears.find(gear => gear.id === this.linkedTo);

        // calculate speed of linked gear
        const linkedGearSpeed = linkedGear.getRotationSpeed(gears) * linkedGear.direction

        // calculate ration between two linked gears
        const ratio = (linkedGear.numberOfTeeth / this.numberOfTeeth);

        // calculate speed ot this gear
        // To take into account the direction of rotation, 
        // multiply the ratio value by the direction eigenvalue (-1 or 1)
        const speed = ratio * this.direction;

        // this gear speed: linked gear speed x this gear speed
        return linkedGearSpeed * speed;
    }



    /**
     * Rotates gear using delta angle, mutates gear.
     * @param {number} angle - angle of rotaton
     */
    rotate(deltaAngle){
        this.angle += deltaAngle;

        // check is angle is bigger than 360
        if(Math.abs(this.angle) >= 360) {
            // normalize angle
            this.angle = this.angle % 360;

            // fire event 
            this.dispatchEvent('fullRotation');
        }
    }



    /**
     * Draws joint circle to gear (only with to gears with external toothing)
     */
    #renderJoint(){
        const fillColor = this.devMode ? this.alternativeFillColor : this.fillColor;
        const borderColor = this.devMode ? this.alternativeBorderColor : this.borderColor;

        drawCircle(this.renderer, {
            cx: this.cx,
            cy: this.cy,
            r: 10,
            fillColor: this.role == 'driver' ? borderColor : fillColor,
            borderColor: borderColor,
            borderThickness: this.borderLineWidth,
        });

        if(this.role == 'driver') {
            let r = this.r / 3;
            let w = 10;
            let h = 4;

            let fixatorPos = {x: this.cx, y: this.cy - r - h};
            let rotatedFixatorPos = rotatePoint(this.cx, this.cy, fixatorPos.x, fixatorPos.y, this.angle);

            drawCircle(this.renderer, {
                cx: this.cx,
                cy: this.cy,
                r: r,
                fillColor: fillColor,
                borderColor: borderColor,
                borderThickness: this.borderLineWidth,
            });

            drawLine(this.renderer, {
                x1: this.cx,
                y1: this.cy,
                x2: rotatedFixatorPos.x,
                y2: rotatedFixatorPos.y,
                thickness: w,
                fillColor: borderColor,
            });
        }


        if(this.devMode === true) {
            let helperLineconnectionPoint = {x: this.cx, y: this.cy - this.r + this.tootheHeight + 5};
            let rotated = rotatePoint(this.cx, this.cy, helperLineconnectionPoint.x, helperLineconnectionPoint.y, this.angle);

            drawLine(this.renderer, {
                x1: this.cx,
                y1: this.cy,
                x2: rotated.x,
                y2: rotated.y,
                thickness: 3,
                color: this.role == 'driver' ? 'red' : 'white',
            });
        }
    }



    /**
     * N.B:
     * I separated old renderExtenralGear to two functions - 'drawGearContour' and 'renderExtenralGear'.
     * At this way I improve code modularity and maintainability.
     * By doing this, we isolated the logic responsible for drawing the specific contour shape of the gear teeth.
     * This approach allows us to reuse the gear contour drawing logic in different contexts, 
     * such as rendering internal and external gears.
     */

    /**
     * Separated the function that draw gear contour ONLY. 
     * @param {boolean} closePath - do u need to close the path contour? it need to draw external/internal gear
     */
    #drawGearContour(closePath = true) {
        let radiusMinusTeeth = this.r - this.tootheHeight;

        // Array representing the radii for vertices
        let distancesOfVerticesFromCenter = [
            this.r, // Outer vertex (tooth tip)
            this.r, // Outer vertex (tooth tip)
            radiusMinusTeeth, // Inner vertex (root of tooth)
            radiusMinusTeeth, // Inner vertex (root of tooth)
        ];

        // Total number of vertices
        let verticesPerTooth = distancesOfVerticesFromCenter.length;
        let numberOfVertices = this.numberOfTeeth * verticesPerTooth;

        for (let v = 0; v < numberOfVertices; v++) {
            let angleInRadians = Math.PI * 2 * v / numberOfVertices;
            let vModded = v % verticesPerTooth;
            let distanceOfVertexFromCenter = distancesOfVerticesFromCenter[vModded];
            let drawPosX = this.cx + distanceOfVertexFromCenter * Math.cos(angleInRadians);
            let drawPosY = this.cy + distanceOfVertexFromCenter * Math.sin(angleInRadians);

            let rotatedPos = rotatePoint(this.cx, this.cy, drawPosX, drawPosY, this.angle);

            // Move to the first vertex, then line to the rest
            if (v == 0) {
                this.renderer.moveTo(rotatedPos.x, rotatedPos.y);
            } else {
                this.renderer.lineTo(rotatedPos.x, rotatedPos.y);
            }
        }

        if(closePath === true) {
            this.renderer.closePath();
        }
    }

    

    /**
     * Draws a gear with external toothing.
     */
    #renderExternalGear() {
        const borderColor = this.devMode ? this.alternativeBorderColor : this.borderColor;
        const fillColor = this.devMode ? this.alternativeFillColor : this.fillColor;

        this.renderer.beginPath();
        // Draw gear contour
        this.#drawGearContour();
    
        // Set fill color and stroke properties
        this.renderer.fillStyle = fillColor;
        this.renderer.strokeStyle = borderColor;
        this.renderer.lineWidth = this.borderLineWidth;
    
        this.renderer.fill();
        this.renderer.stroke();
        this.renderer.closePath();
    }
    


    /**
     * Draws a gear with internal toothing.
     */
    #renderInternalGear() {
        const borderColor = this.devMode ? this.alternativeBorderColor: this.borderColor;
        const fillColor = this.devMode ? this.alternativeFillColor : this.fillColor;

        this.renderer.beginPath();

        // Draw outer circle
        this.renderer.arc(this.cx, this.cy, this.r + 8, 0, Math.PI * 2);
    
        // Draw inner gear contour (teeth)
        this.#drawGearContour();
    
        // Use 'evenodd' fill rule to create a hollow center
        this.renderer.closePath();
        this.renderer.fillStyle = fillColor;
        this.renderer.fill('evenodd');
    
        // Draw the border of the gear
        this.renderer.lineWidth = this.borderLineWidth;
        this.renderer.strokeStyle = borderColor;
        this.renderer.stroke();

        if(this.devMode) {
            let helperLineConnectiongPoint = {x: this.cx, y: this.cy + this.r};
            let rotated = rotatePoint(this.cx, this.cy, helperLineConnectiongPoint.x, helperLineConnectiongPoint.y, this.angle);

            drawLine(this.renderer, {
                x1: this.cx, 
                y1: this.cy,
                x2: rotated.x,
                y2: rotated.y,
                thickness: 3,
                color: 'white',
            });
        }
    }



    /**
     * 
     */
    render() {
        if(this.toothing == 'external') {
            this.#renderJoint();
            this.#renderExternalGear();
        } else if(this.toothing == 'internal') {
            this.#renderInternalGear();
        }
    }
}



/**
 * Returns color to gear based on role, toothing
 * @param {string} toothing - toothyng type, external or internal toothing
 * @param {string} role - gear role, driver or slave
 * @param {number} opacity - optional param to change result color opacity from 0 to 1
 * @returns {string} - result color
 */
function getGearColor(toothing, role, opacity = 1) {
    if (toothing === 'external') {
        if (role === 'driver') {
            return `rgba(255, 152, 0, ${opacity})`;
        } else {
            return `rgba(51, 127, 255, ${opacity})`;
        }
    } else {
        return `rgba(158, 25, 45, ${opacity})`;
    }
}