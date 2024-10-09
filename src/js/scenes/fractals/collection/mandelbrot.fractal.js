/**
 * Draws the Mandelbrot fractal on a given canvas context.
 * 
 * @param {CanvasRenderingContext2D} context - The 2D rendering context for drawing on the canvas.
 * @param {Object} params - The parameters for the Mandelbrot rendering.
 * @param {number} params.xmin - The minimum x-coordinate (real part) in the complex plane.
 * @param {number} params.xmax - The maximum x-coordinate (real part) in the complex plane.
 * @param {number} params.ymin - The minimum y-coordinate (imaginary part) in the complex plane.
 * @param {number} params.ymax - The maximum y-coordinate (imaginary part) in the complex plane.
 * @param {number} [params.max_iterations=100] - The maximum number of iterations to determine divergence.
 * @param {Function} params.onRender - Callback function invoked during the rendering process. Receives `darkPoints` count as an argument.
 * @param {Function} params.onRenderEnd - Callback function invoked after the fractal has finished rendering.
 */
export default function drawMandelbrotFractal(context, { xmin, xmax, ymin, ymax, max_iterations = 100, onRender, onRenderEnd }) {
    const width = context.canvas.width;
    const height = context.canvas.height;
    let darkPoints = 0;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let x_real = xmin + (xmax - xmin) * x / width;
            let y_imag = ymin + (ymax - ymin) * y / height;

            // For each X and Y coordinate, their corresponding values ​​in the complex plane are calculated. 
            // This is done based on the range of values ​​along the xmin, xmax, ymin and ymax axes.
            let iterations = __calculateDivergenceIterations(x_real, y_imag, max_iterations);

            // If the point does not diverge, it is inside the Mandelbrot set (colored black).
            if (iterations === max_iterations) {
                darkPoints++;
                context.fillStyle = `rgb(0, 0, 0)`; // Black fractal for points inside the set
            } else {
                // Gradient from orange to white as an "outer crown" of the fractal
                let gradientFactor = (iterations / max_iterations) * 4;
                let red = Math.floor(255 * (gradientFactor * 0.75));       
                let green = Math.floor(100 * gradientFactor);              
                let blue = Math.floor(255 * (1 - (gradientFactor * 1.5))); 

                context.fillStyle = `rgb(${red},${green},${blue})`;
            }

            // Call the `onRender` callback with the count of dark points
            onRender(darkPoints);

            // Draw a pixel at (x, y)
            context.fillRect(x, y, 1, 1);

            // Call the `onRenderEnd` callback after rendering the last pixel
            if(y === height - 1 && x === width - 1) {
                onRenderEnd(darkPoints);
            }
        }
    }
}



/**
 * Calculates the number of iterations it takes for a point in the complex plane 
 * to "escape" or diverge when applying the Mandelbrot set function.
 *
 * @param {number} z_real - The real part of the complex number (initial x-coordinate).
 * @param {number} z_imag - The imaginary part of the complex number (initial y-coordinate).
 * @param {number} max_iterations - The maximum number of iterations to check for divergence.
 * @returns {number} The number of iterations it takes for the point to diverge. 
 *                   If the point does not diverge within max_iterations, returns max_iterations.
 */
function __calculateDivergenceIterations(z_real, z_imag, max_iterations) {
    let zr = z_real;
    let zi = z_imag;
    let n = 0;

    // Iterate while the point is within the threshold and the iteration limit is not reached
    while (n < max_iterations && zr * zr + zi * zi < 4) {
        let new_zr = zr * zr - zi * zi + z_real;
        let new_zi = 2 * zr * zi + z_imag;
        zr = new_zr;
        zi = new_zi;
        n++;
    }

    // Return the number of iterations it took for the point to diverge
    return n;
}