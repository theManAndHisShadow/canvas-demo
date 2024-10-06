import { getColor } from "../../../misc/helpers";

export default function drawTreeFractal(context, { startX, startY, length, delay = 100, angle = 0, depth, onRender, onRenderEnd }) {
    __drawTreeFractalRecursivly(context, { startX, startY, length, delay, angle, depth, currentDepth: 0, onRender, onRenderEnd });
}

function __totalSegments(depth) {
    return Math.pow(2, depth + 1) - 1;
}

function __drawTreeFractalRecursivly(context, { startX, startY, length, delay = 100, angle = 0, depth, currentDepth, onRender, onRenderEnd }) {
    setTimeout(() => {
        // Draw the branch
        context.strokeStyle = getColor('green');
        context.beginPath();
        context.moveTo(startX, startY);
        const endX = startX + Math.sin(angle * Math.PI / 180) * length;
        const endY = startY - Math.cos(angle * Math.PI / 180) * length; // Invert Y for canvas
        context.lineTo(endX, endY);
        context.stroke();

        if (currentDepth >= depth || length < 10) {
            if (onRenderEnd) onRenderEnd(); // Call the onComplete callback if provided
            return; // Stop recursion when the max depth is reached or length is too small
        }

        onRender(__totalSegments(currentDepth + 1)); // Call onRender with the current depth
        
        // Recursive calls for left and right branches with delay
        __drawTreeFractalRecursivly(context, { startX: endX, startY: endY, length: length * 0.8, angle: angle - 15, delay, depth, currentDepth: currentDepth + 1, onRender, onRenderEnd }); // Left branch
        __drawTreeFractalRecursivly(context, { startX: endX, startY: endY, length: length * 0.8, angle: angle + 15, delay, depth, currentDepth: currentDepth + 1, onRender, onRenderEnd }); // Right branch
    }, delay); // Set delay before executing the drawing logic
}
