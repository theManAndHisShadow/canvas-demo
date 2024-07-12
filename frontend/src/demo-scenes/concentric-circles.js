let concentricCircles = new Scene({
        title: 'Concentric circles', 

        code: root => {
            const canvas = root.querySelector('canvas');
            const width = 600;
            const height = 400;
            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext('2d');
            const borderThickness = 2;
            const centerX = width / 2;
            const centerY = height / 2;
            const outerRadius = 150;
            const amount = 10;

            // draw background grid
            drawGrid(context, {
                cellSize: 10,
                lineThickness: 1,
                lineColor: 'rgba(0, 0, 0, 0.0032)',
            });
            
            for(let i = 0; i <= amount; i++) {
                // calc radius of each circle
                let radius = outerRadius - (outerRadius /  amount) * i;
                
                // draw each circle
                drawCircle(context, {
                    cx: centerX,
                    cy: centerY,
                    r: radius, 
                    borderThickness: borderThickness,
                    borderColor: '#4A235A',
                    fillColor: '#7D3C98',
                });
            }

            // draw point at center
            drawCircle(context, {
                cx: centerX,
                cy: centerY,
                r: 5, 
                borderThickness: borderThickness,
                borderColor: '#4A235A',
                fillColor: '#4A235A',
            });
        }
    });

window.exportedObjects.push(concentricCircles);