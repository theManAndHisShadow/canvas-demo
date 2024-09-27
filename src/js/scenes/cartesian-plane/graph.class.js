import { PlanePrimitive } from "./primitive.class.js";
import { TinyMath } from "./tinyMath.class.js";

export class Graph extends PlanePrimitive {
    constructor(formula = null, color = 'red'){
        super();

        this.processor = new TinyMath();
        this.parent = null;

        this.formula = formula;
        this.type = this.processor.detect(this.formula);
        this.parsed = this.processor.parse(this.formula, this.type);
        this.roots = this.processor.findRoots(this.type, this.parsed);
        
        this.color = color;
    }


    /**
     * Draws a linear functon's graph to context.
     * @param {number} step - Smoothness (resolution) of the graph - what step between points to set when drawing a graph of a function
     */
    #drawLinear(step = 1){
        this.renderer.beginPath();
        this.renderer.strokeStyle = this.color;
        this.renderer.lineWidth = 1;


        let firstPoint = true;
        let prevX, prevY;

        // Using info about visible area of plane draw only part of graph
        for(let i = this.parent.visibleArea.x[0] - 3; i < this.parent.visibleArea.x[1] + 3; i += step){
            let rawX = i;
            let rawY = (this.parsed.a * rawX) + this.parsed.b;

            let x = rawX * (this.parent.gridCellSize*2) + this.parent.subpixel;
            let y = rawY * (this.parent.gridCellSize*2) + this.parent.subpixel;
            
            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };
    
            if (firstPoint) {
                this.renderer.moveTo(transformed.x, transformed.y);
                firstPoint = false;
            } else {
                this.renderer.lineTo(transformed.x, transformed.y);
            }
    
            // save current pos as prev pos for next itteration
            prevX = transformed.x;
            prevY = transformed.y; 
        }

        this.renderer.closePath();
        this.renderer.stroke();
    }


    /**
     * Draws a quadratic functon's graph to context.
     * @param {number} step - Smoothness (resolution) of the graph - what step between points to set when drawing a graph of a function
     */
    #drawQuadratic(step = 1) {
        this.renderer.beginPath();
        this.renderer.strokeStyle = this.color;
        this.renderer.lineWidth = 1;

        let segmentStarted = false;
    
        for(let i = this.parent.visibleArea.x[0] - 3 ; i < this.parent.visibleArea.x[1] + 3; i += step){
            let rawX = i;
            let rawY = (this.parsed.a * (rawX ** 2)) + (this.parsed.b * rawX) + this.parsed.c;
    
            let x = rawX * (this.parent.gridCellSize*2) + this.parent.subpixel;
            let y = rawY * (this.parent.gridCellSize*2) + this.parent.subpixel;
            
            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };
            
            if (transformed.x < 0 || transformed.x > this.parent.viewWidth) {
                // If the current point of the parabola's tail is outside the visible screen area,
                // we need to end the current segment to avoid drawing a line connecting
                // visible and non-visible points.
                
                if (segmentStarted) {
                    // If a segment was in progress, finalize it by stroking and closing the path.
                    this.renderer.stroke();
                    this.renderer.closePath();
                    segmentStarted = false; // Mark the segment as not started.
                }
                
                continue; // Skip to the next iteration since this point is out of bounds.
            }
            
            if (!segmentStarted) {
                // If no segment is in progress, begin a new path for the visible segment.
                this.renderer.beginPath();
                this.renderer.moveTo(transformed.x, transformed.y);
                segmentStarted = true; // Mark that a new segment has started.
            } else {
                // If a segment is already in progress, continue drawing the line to the current point.
                this.renderer.lineTo(transformed.x, transformed.y);
            }
        }
    
        if (segmentStarted) {
            this.renderer.stroke();
            this.renderer.closePath();
        }
    }

    /**
     * Draws a cubic functon's graph to context.
     * @param {number} step - Smoothness (resolution) of the graph - what step between points to set when drawing a graph of a function
     */
    #drawCubic(step = 1) {
        this.renderer.beginPath();
        this.renderer.strokeStyle = this.color;
        this.renderer.lineWidth = 1;

        let segmentStarted = false;
    
        for(let i = this.parent.visibleArea.x[0] - 3 ; i < this.parent.visibleArea.x[1] + 3; i += step){
            let rawX = i;
            let rawY = (this.parsed.a * (rawX ** 3)) + (this.parsed.b * (rawX ** 2)) + (this.parsed.c * rawX) + this.parsed.d;
    
            let x = rawX * (this.parent.gridCellSize*2) + this.parent.subpixel;
            let y = rawY * (this.parent.gridCellSize*2) + this.parent.subpixel;
            
            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };
            
            if (transformed.x < 0 || transformed.x > this.parent.viewWidth) {
                // If the current point of the cubic parabola's tail is outside the visible screen area,
                // we need to end the current segment to avoid drawing a line connecting
                // visible and non-visible points.
                
                if (segmentStarted) {
                    // If a segment was in progress, finalize it by stroking and closing the path.
                    this.renderer.stroke();
                    this.renderer.closePath();
                    segmentStarted = false; // Mark the segment as not started.
                }
                
                continue; // Skip to the next iteration since this point is out of bounds.
            }
            
            if (!segmentStarted) {
                // If no segment is in progress, begin a new path for the visible segment.
                this.renderer.beginPath();
                this.renderer.moveTo(transformed.x, transformed.y);
                segmentStarted = true; // Mark that a new segment has started.
            } else {
                // If a segment is already in progress, continue drawing the line to the current point.
                this.renderer.lineTo(transformed.x, transformed.y);
            }
        }
    
        if (segmentStarted) {
            this.renderer.stroke();
            this.renderer.closePath();
        }
    }


    /**
     * Draws a hyperbolic functon's graph to context.
     * @param {number} step - Smoothness (resolution) of the graph - what step between points to set when drawing a graph of a function
     */
    #drawHyperbolic(step = 1){
        /**
         * Some notes about STEP:
         * with values ​​below 0.001 the graph suddenly ends, but leaving 0.001 is also ineffective due 
         * to the load on the processor. Maybe use adaptive change of this value?
         */

        this.renderer.beginPath();
        this.renderer.strokeStyle = this.color;
        this.renderer.lineWidth = 1;
    
        let segmentStarted = false;

        /** 
        * N.B:
        *  We are separating the hyperbola into two branches (for x < 0 and x > 0)
        * because a hyperbola consists of two distinct curves, one on either side of 
        * the vertical asymptote (x = 0). If we were to draw the entire curve 
        * without splitting the branches, the result would be a single connected curve
        * that improperly crosses the y-axis, merging both branches into one continuous 
        * line. This would visually distort the hyperbolic shape.
        *
        * By splitting the graph into two loops, we ensure that each branch is drawn 
        * independently, stopping the rendering when x approaches zero to avoid 
        * connecting points across the asymptote.
        **/ 

        // Drawing the left branch (x < 0)
        for (let i = this.parent.visibleArea.x[0] - 3; i < this.parent.visibleArea.x[1] + 3; i += step) {
            let rawX = i;
        
            // Skip points too close to the asymptote (x = 0)
            if (Math.abs(rawX) < 0.001) {
                continue;
            }
        
            let rawY = (this.parsed.a / (this.parsed.b * rawX)) + this.parsed.c;
            let x = rawX * (this.parent.gridCellSize * 2) + this.parent.subpixel;
            let y = rawY * (this.parent.gridCellSize * 2) + this.parent.subpixel;
        
            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };
        
            if (transformed.x < 0 || transformed.x > this.parent.viewWidth) {
                if (segmentStarted) {
                    this.renderer.stroke();
                    this.renderer.closePath();
                    segmentStarted = false;
                }
                continue;
            }
        
            if (!segmentStarted) {
                this.renderer.beginPath();
                this.renderer.moveTo(transformed.x, transformed.y);
                segmentStarted = true;
            } else {
                this.renderer.lineTo(transformed.x, transformed.y);
            }
        }
        
        if (segmentStarted) {
            this.renderer.stroke();
            this.renderer.closePath();
        }
    
        segmentStarted = false;
    
        // Drawing the right branch (x > 0)
        for(let i = step; i < this.parent.visibleArea.x[1] + 3; i += step){
            let rawX = i;
            let rawY = (this.parsed.a / (this.parsed.b * rawX)) + this.parsed.c;
    
            let x = rawX * (this.parent.gridCellSize * 2) + this.parent.subpixel;
            let y = rawY * (this.parent.gridCellSize * 2) + this.parent.subpixel;
    
            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };
    
            if (transformed.x < 0 || transformed.x > this.parent.viewWidth) {
                if (segmentStarted) {
                    this.renderer.stroke();
                    this.renderer.closePath();
                    segmentStarted = false;
                }
                continue;
            }
    
            if (!segmentStarted) {
                this.renderer.beginPath();
                this.renderer.moveTo(transformed.x, transformed.y);
                segmentStarted = true;
            } else {
                this.renderer.lineTo(transformed.x, transformed.y);
            }
        }
    
        if (segmentStarted) {
            this.renderer.stroke();
            this.renderer.closePath();
        }
    }

    
    /**
     * Draws a exponential functon's graph to context.
     * @param {number} step - Smoothness (resolution) of the graph - what step between points to set when drawing a graph of a function
     */
    #drawExponential(step = 1){
        this.renderer.beginPath();
        this.renderer.strokeStyle = this.color;
        this.renderer.lineWidth = 1;

        let segmentStarted = false;
    
        for(let i = this.parent.visibleArea.x[0] - 4 ; i < this.parent.visibleArea.x[1] + 4; i += step){
            let rawX = i;
            let rawY = (this.parsed.a * Math.exp(this.parsed.b * rawX)) + this.parsed.c
            
            let y = rawY * (this.parent.gridCellSize*2) + this.parent.subpixel;
            let x = rawX * (this.parent.gridCellSize*2) + this.parent.subpixel;

            let transformed = {
                x: this.parent.cx + x,
                y: this.parent.cy - y
            };

            let y_threshold = this.parent.gridCellSize * 5;

            if (
                transformed.x < 0 || 
                transformed.x > this.parent.viewWidth || 
                transformed.y < 0 - y_threshold|| 
                transformed.y > this.parent.viewHeight + y_threshold
            ) {
                // If the current point of the exponenta line is outside the visible screen area,
                // we need to end the current segment to avoid drawing a line connecting
                // visible and non-visible points.
                
                if (segmentStarted) {
                    // If a segment was in progress, finalize it by stroking and closing the path.
                    this.renderer.stroke();
                    this.renderer.closePath();
                    segmentStarted = false; // Mark the segment as not started.
                }
                
                continue; // Skip to the next iteration since this point is out of bounds.
            }
            
            if (!segmentStarted) {
                // If no segment is in progress, begin a new path for the visible segment.
                this.renderer.beginPath();
                this.renderer.moveTo(transformed.x, transformed.y);
                segmentStarted = true; // Mark that a new segment has started.
            } else {
                // If a segment is already in progress, continue drawing the line to the current point.
                this.renderer.lineTo(transformed.x, transformed.y);
            }
        }
    
        if (segmentStarted) {
            this.renderer.stroke();
            this.renderer.closePath();
        }
    }


    draw(){
        let defaultResolution = 0.1;

        if(this.type == 'linear') this.#drawLinear(defaultResolution);
        if(this.type == 'quadratic') this.#drawQuadratic(defaultResolution);
        if(this.type == 'cubic') this.#drawCubic(defaultResolution);

        // this method uses other default resolution value
        // for more details check comment note inside method
        if(this.type == 'hyperbolic') this.#drawHyperbolic(0.001);

        if(this.type == 'exponential') this.#drawExponential(0.075);
    }
}