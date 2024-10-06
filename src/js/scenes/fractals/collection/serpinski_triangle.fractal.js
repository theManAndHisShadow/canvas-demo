import { drawTriangle, getColor } from "../../../misc/helpers";

const colors = ['red', 'orange', 'yellow', 'brightGreen', 'cyan', 'indigo', 'purple', 'deepPurple', 'magenta'];



/**
 * 
 * @param {CanvasRenderingContext2D} context - place to render
 * @param {number} param.cx - fractal center point x coord
 * @param {number} param.cy - fractal center point y coord
 * @param {number} param.h - fractal outer triangle height
 * @param {number} param.b - fractal outer triangle base length (side width)
 * @param {number} param.borderThickness - border thnickness of triangle
 * @param {number} param.depth - fractal max depth level size
 * @param {number} param.delay - delay before next level render
 * @param {Function} param.onRender - action when fractal is fully rendered 
 * @param {Function} param.onRenderEnd - action when fractal is fully rendered 
 */
export default function drawSerpinskiFractal(context, {cx, cy, h, b, borderThickness, depth, delay = 100, onRender, onRenderEnd}){
    onRenderEnd = onRenderEnd || function() {};

    // call local function
    __drawSerpinski(context, {cx, cy, h, b, borderThickness, depth, delay, onRender, onRenderEnd});
}



// local function
function __drawSerpinski(context, { cx, cy, h, b, borderThickness, depth, delay, onRender, onRenderEnd}) {
    let triangles = [{ cx, cy, h, b, currentDepth: 0 }];
    
    function drawNextLevel() {
        let levelSize = triangles.length;
        
        for (let i = 0; i < levelSize; i++) {
            const { cx, cy, h, b, currentDepth } = triangles.shift();
            
            // Draw a triangle
            drawTriangle(context, { cx, cy, h, b, borderColor: getColor(colors[currentDepth]), borderThickness });
            
            if (currentDepth < depth) {
                let aCenter = { x: cx, y: cy - h / 4 };  
                let bCenter = { x: cx - b / 4, y: cy + h / 4 }; 
                let cCenter = { x: cx + b / 4, y: cy + h / 4 };
                
                // Add new triangles for the next level
                triangles.push(
                    { cx: aCenter.x, cy: aCenter.y, h: h / 2, b: b / 2, currentDepth: currentDepth + 1 },
                    { cx: bCenter.x, cy: bCenter.y, h: h / 2, b: b / 2, currentDepth: currentDepth + 1 },
                    { cx: cCenter.x, cy: cCenter.y, h: h / 2, b: b / 2, currentDepth: currentDepth + 1 }
                );

                onRender(triangles.length);
            }
        }
        
        // If there are still triangles to draw, call the next level via delay
        if (triangles.length > 0) {
            setTimeout(drawNextLevel, delay);
        } else {
            console.log('Render end!');
            onRenderEnd(levelSize);
        }
    }
    
    // Start drawing the first level
    drawNextLevel();
}