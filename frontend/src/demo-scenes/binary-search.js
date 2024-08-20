let binarySearch = new Scene({
    title: 'Binary search', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Empty'
        },

        'givenNumber': {
            type: 'input',
            label: 'Choose number',
            text: '',
            minValue: 1,
            defaultValue: 5,
            maxValue: 100,
        },

        'range': {
            type: 'input',
            label: 'Search from 1 to',
            minValue: 1,
            defaultValue: 100,
            maxValue: 200,
        },

        'searchMethod': {
            type: 'option-selector',
            label: 'Search method',
            optionNames: [
                'Brute force',
                'Binary seach',
            ],
            defaultValue: 0,
        },

        'find': {
            type: 'main-action-button',
            text: 'Find number',
        },
    },

    code: (root, display, settings) => {
        // describing basic canvas variables
        // reset the element state to remove all previously applied event handlers
        const canvas = resetElement(root.querySelector('canvas'));

        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        // describing main variables
        const context = canvas.getContext('2d');
        const centerX = width / 2 + 1;
        const centerY = height / 2 + 0.5;

        const grid = createNumberSquaresGrid(context, {
            cx: centerX,
            cy: centerY,
            size: 23,
        });

        settings.subscribe((propertyName, newValue, oldValue) => {
            if(propertyName == 'find') {
                console.log('main action triggered');
            }
        });

        // Main function
        let loop = () => {
            context.clearRect(
                0, 0,
                width,
                height
            );

            drawRect(context, {
                x: 0,
                y: 0,
                width: width,
                height: height,
                fillColor: getColor('black', 0.85),
            });

            grid.forEach(item => {
                item.render();
            });

        }

        // animate
        window.runningAnimations.add(loop);
    }
});

window.exportedObjects.push(binarySearch);


/**
* Scene file internal classes and helper functions defenitions
*/

class GridItem{
    constructor({number, size, x, y, margin, fillColor = getColor('black'), textColor = getColor('white'), renderer}){
        this.number = number;
        this.size = size;
        this.x = x;
        this.y = y;
        this.margin = margin;
        this.fillColor = fillColor;
        this.textColor = textColor;

        this.renderer = renderer;
        this.checked = false;
    }


    /**
     * Updates grid item visual style and set 'checked' state to true;
     */
    markAsChecked(){
        const factor = 0.1;

        this.checked = true;
        this.fillColor = changeColorOpacity(this.fillColor, factor);
        this.textColor = changeColorOpacity(this.textColor, factor);
    }


    /**
     * Renders grid item
     */
    render(){
        drawRect(this.renderer, {
            x: this.x,
            y: this.y,
            width: this.size,
            height: this.size,
            fillColor: this.fillColor,
        });

        drawText(this.renderer, {
            x: this.x + (this.size / 2),
            y: this.y + (this.size / 2),
            fontSize: this.number >= 100 ? 9 : 11,
            text: this.number,
            color: this.textColor,
        });
    }
}



/**
 * Creates grid of blocks with numbers.
 * @param {CanvasRenderingContext2D} context - canvas 2d context
 * @param {number} param.cx - grid center x
 * @param {number} param.cy - grid center y
 * @param {number} param.columns - number of columns
 * @param {number} param.rows - number of rows
 * @param {number} param.size - size of grid item
 * @param {number} param.margin - margin between grid items
 * @returns {GridItem[]}
 */
function createNumberSquaresGrid(context, {cx, cy, columns = 10, rows = 10, size = 20, margin = 3} = {}){
    const computedWidth = margin + size;

    const startX = cx - ((computedWidth * columns) / 2);
    const startY = cy - ((computedWidth * rows) / 2);

    const items = [];
    let id = 1;

    for(let j = 0; j < rows; j++) {
    for(let i = 0; i < columns; i ++) {
            // calc current square x, y
            let x = startX + (i * computedWidth);
            let y = startY + (j * computedWidth);

            // create new square
            let square = new GridItem({
                renderer: context,
                size: size,
                margin: margin,
                number: id,
                x: x,
                y: y,
            });

            // update counter
            id++;

            // add to result array
            items.push(square);
        }
    }

    // return result
    return items;
}
