/**
 * A class that tracks the movement of a point along a trajectory and draws that trajectory
 */
export class Tracer {
    #trace = [];
    constructor({color, length = 100, thickness = 1, parent}){

        this.length = length;
        this.color = color;
        this.thickness = thickness,

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
     * Returns trace last point.
     * @returns {{x: number, y: number}} - last point of trace
     */
    getLastPoint(){
        return this.#trace.length > 0 ? getArrayLast(this.#trace) : false;
    }


    /**
     * Returns trace array length.
     * @returns {Number} - length of trace array
     */
    getLength() {
        return this.#trace.length;
    }


    /**
     * Resets Tracer points array.
     */
    clear(){
        this.#trace = [];
    }


    /**
     * Renders trace using efficient method.
     */
    render(){
        this.parent.renderer.beginPath();
        this.parent.renderer.strokeStyle = this.color;
        this.parent.renderer.lineWidth = 1;

        // checks if is first point
        let firstPoint = true;

        // draw trace fragmet by fragment using all current trace
        this.#trace.forEach(point => {
            if (firstPoint) {
                this.parent.renderer.moveTo(point.x, point.y);
                firstPoint = false;
            } else {
                this.parent.renderer.lineTo(point.x, point.y);
            }
        });

        // end trace
        this.parent.renderer.stroke();
    }
}