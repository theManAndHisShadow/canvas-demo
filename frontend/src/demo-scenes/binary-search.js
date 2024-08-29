let binarySearch = new Scene({
    title: 'Binary search', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'This is a clear demonstration of the difference in search speed between brute-force and binary search methods. The brute-force method involves a complete traversal of the entire dataset, but it does not require the dataset to be sorted. In contrast, binary search quickly finds the target value, even in a enormnous dataset, but it requires the dataset to be sorted.'
        },

        'attemps': {
            type: 'display-item',
            label: 'Attempts',
        },

        'current-search-range': {
            type: 'display-item',
            label: 'Current search range',
        },

        'status': {
            type: 'display-item',
            label: 'Status'
        },

        'givenNumber': {
            type: 'input',
            label: 'Choose number',
            text: '',
            minValue: 1,
            defaultValue: getRandomNumber(1, 100),
            maxValue: 1000,
        },

        'range': {
            type: 'option-selector',
            label: 'Select range',
            optionNames: [
                '1-100',
                '1-1000',
            ],
            defaultValue: 0,
        },

        'searchMethod': {
            type: 'option-selector',
            label: 'Search method',
            optionNames: [
                'Binary seach',
                'Brute force',
            ],
            defaultValue: 0,
        },

        'find': {
            type: 'main-action-button',
            text: 'Find number',
            blockControlDuringExecution: true,
        },
    },

    code: (root, display, settings) => {
        // clearing prev created animation threads
        window.runningAnimations.clearQueue();

        // timestamp to current scene's canvas elem
        const timestamp = Date.now();
        
        // describing basic canvas variables
        // reset the element state to remove all previously applied event handlers
        let canvas = resetElement(root.querySelector('canvas'), `canvas-${timestamp}`);

        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        // describing main variables
        const context = canvas.getContext('2d');
        const centerX = width / 2 + 1;
        const centerY = height / 2 + 0.5;

        let grid = createNumberSquaresGrid(context, {
            cx: centerX,
            cy: centerY,
            size: 30,
        });

        // inistial scene status
        let currentStatus = 'not-started';
        settings.subscribe((propertyName, newValue, oldValue) => {
            // get random number
            let choosedNumber = settings.getState('givenNumber');

            // get current selected range
            let range = settings.getState('range');

            // get current selected method
            let method = settings.getState('searchMethod');

            // total attempts to get given number in range
            let attempts = 0;

            // local function to update the mesh after scene parameters have been changed by the user
            let updateGrid = () => {
                grid = createNumberSquaresGrid(context, {
                    cx: centerX,
                    cy: centerY,
                    size: range == 0 ? 30 : 10,
                    margin: range == 0 ? 3 : 1,
                    columns: range == 0 ? 10 : 40,
                    rows: range == 0 ? 10 : 25,
                    hideNumbers: range == 0 ? false : true,
                });
            };


            // update grid only if status not 'in-progress'
            if(propertyName == 'range') {
                if(currentStatus !== 'in-progress') {
                    updateGrid();
                }
            }


            if(propertyName == 'find') {
                    // update grid only if status not 'in-progress'
                    if(currentStatus !== 'in-progress') {
                        updateGrid();

                        // run main search function
                        search({
                            method: method == 1 ? 'bruteforce' : 'binary',
                            array: grid.items.map(item => item.number),
                            givenNumber: choosedNumber,

                            // delay between attempts
                            stepDelay: 1000,

                            // cb for each try
                            onTry: (min, max) => {
                                // update attempt counter
                                attempts += 1;
                                currentStatus = 'in-progress';

                                // update status, attempts and status on display
                                // set status 'in-progress' to temporarily block Control UI object
                                settings.setState('find__status', currentStatus);
                                display.updateValue('attemps', attempts);
                                display.updateValue('current-search-range', `[${min + 1}, ${max + 1}]`)
                                display.updateValue('status', '<span class="yellow-word-bubble">In progress...</span>');

                                // check all squares that out of range at current try
                                grid.items.forEach(square => {
                                    if (!(square.number >= min + 1) || !(square.number <= max + 1)) {
                                        // change visual to 'checked' pale sqaure
                                        square.check();
                                    } 
                                });
                            },

                            // cb for success result
                            onSuccess: (numberPos) => {
                                currentStatus = 'done';
                                
                                // update status, attempts and status on display
                                // set status 'done' to unblock Control UI object
                                settings.setState('find__status', currentStatus);
                                display.updateValue('attemps', attempts);
                                display.updateValue('status', '<span class="green-word-bubble">Success!</span>');
                                
                                // change visual to 'green' sqaure
                                let square = grid.items[numberPos];
                                square.paintItGreen();
                            },

                            // cb for fail result
                            onFail: () => {
                                currentStatus = 'failed';
                                
                                // update status, attempts and status on display
                                // set status 'failed' to unblock Control UI object
                                settings.setState('find__status', currentStatus);
                                display.updateValue('attemps', attempts);
                                display.updateValue('status', '<span class="red-word-bubble">Failed!</span>');
                            }
                        });
                } else {
                    console.log('cant start, already in-progress');
                }
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

            grid.items.forEach(item => {
                item.render();
            });

            // if range "1-1000" - draw scale
            if(settings.getState('range') == 1) {
                drawScale(context, {
                    gridObject: grid,
                    padding: 10,
                });
            }
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
    constructor({number, size, x, y, margin, fillColor = getColor('black'), hideNumbers, textColor = getColor('white'), renderer}){
        this.number = number;
        this.size = size;
        this.x = x;
        this.y = y;
        this.margin = margin;
        this.fillColor = fillColor;
        this.textColor = textColor;
        this.hideNumbers = hideNumbers;

        this.renderer = renderer;
        this.checked = false;
    }


    /**
     * Updates grid item visual style and set 'checked' state to true.
     */
    check(){
        const factor = 0.1;

        this.checked = true;
        this.fillColor = changeColorOpacity(this.fillColor, factor);
        this.textColor = changeColorOpacity(this.textColor, factor);
    } 


    /**
     *  Updates grid item visual style and set 'checked' state to false.
     */
    uncheck(){
        this.checked = false;
        this.fillColor = getColor('black', 1);
        this.textColor = getColor('white', 1);
    }


    /**
     * Paints cell to green color;
     */
    paintItGreen(){
        this.fillColor = getColor('green');
        this.textColor = getColor('white');
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

        // draw number or just dot depending on 'hideNumbers' param
        if(this.hideNumbers == false) {
            drawText(this.renderer, {
                x: this.x + (this.size / 2),
                y: this.y + (this.size / 2),
                fontSize: this.number >= 100 ? 11 : 13,
                text: this.number,
                color: this.textColor,
            });
        } else {
            // exception:
            // if 1 or 1000 - draw numbers
            if(this.hideNumbers == true && (this.number == 1 || this.number == 1000)) {
                drawText(this.renderer, {
                    x: this.x + (this.size / 2),
                    y: this.y + (this.size / 2) + 0.5,
                    fontSize: 8,
                    // for 1000 - 1k
                    text: this.number == 1 ? 1 : '1k',
                    color: this.textColor,
                });
            } else {
                // for other numbers draw just dots
                drawRect(this.renderer, {
                    x: this.x + (this.size / 2),
                    y: this.y + (this.size / 2),
                    width: 1,
                    height: 1,
                    fillColor: this.textColor,
                });
            }
        }

        
    }
}


/**
 * Draws a scale elements for grid
 * @param {CanvasRenderingContext2D} context - canvas context
 * @param {object} param.gridObject - grid object
 * @param {number} param.padding - padding from grid to scale
 */
function drawScale(context, {gridObject, padding = 10}){
    // some function important vars
    const subpixel = 0.5;
    const color = 'rgba(255, 255, 255, 1)';
    
    // drawning "axes"
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 1;

    // horizontal axis
    let horizontalY = gridObject.startY - padding + subpixel;
    context.moveTo(gridObject.startX - padding+ subpixel, horizontalY);
    context.lineTo(gridObject.startX + gridObject.width + subpixel, horizontalY); 

    // vertival axis
    let verticalX = gridObject.startX - padding + subpixel;
    context.moveTo(verticalX, horizontalY);
    context.lineTo(verticalX, gridObject.startY + gridObject.height + subpixel); 

    // finish axes drawning
    context.closePath();
    context.stroke();

    // drawning scale marks and numbers
    context.beginPath();

    // loop for horizontal axis
    for(let i = 1; i <= gridObject.columns; i++) {
        let x = gridObject.startX + ((i -1) * (gridObject.margin + gridObject.itemSize)) + (gridObject.itemSize / 2) + subpixel;

        // draw number each 5 
        if(i == 1 || i % 5 === 0) {
            drawText(context, {
                x: x,
                y: gridObject.startY - padding - 10,
                text: i,
                color: color,
                fontSize: 8,
            });
        }

        // draw scale line marks
        context.moveTo(x, horizontalY);
        context.lineTo(x, horizontalY - 3);
    }

    // loop for vertical axis
    for(let j = 1; j <= gridObject.rows; j++) {
        let y = gridObject.startY + ((j -1) * (gridObject.margin + gridObject.itemSize)) + (gridObject.itemSize / 2) + subpixel;

        // draw axis scale number
        if(j == 1 || j % 5 === 0) {
            drawText(context, {
                x: gridObject.startX - padding - 10,
                y: y,
                text: j,
                color: color,
                fontSize: 8,
            });
        }

        // draw axis scale line marks
        context.moveTo(verticalX, y);
        context.lineTo(verticalX - 3, y);
    }

    // finish axes drawning process
    context.closePath();
    context.stroke();
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
 * @returns {object}
 */
function createNumberSquaresGrid(context, {cx, cy, columns = 10, rows = 10, size = 20, margin = 3, hideNumbers = false} = {}){
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
                hideNumbers: hideNumbers,
            });

            // update counter
            id++;

            // add to result array
            items.push(square);
        }
    }

    // return grid object
    return {
        items: items,

        startX: startX,
        startY: startY,

        rows: rows,
        columns: columns,

        itemSize: size,
        margin: margin,

        width: (columns * (size + margin)),
        height: (rows * (size + margin)),
    };
}

/**
 * @typedef {Object} SearchOptions
 * @property {number[]} array - The array to search in.
 * @property {number} givenNumber - The number to search for.
 * @property {Function} [onTry] - Callback function called on each attempt.
 * @property {Function} [onSuccess] - Callback function called when the number is found.
 * @property {Function} [onFail] - Callback function called when the number is not found.
 * @property {number} [stepDelay=500] - Delay in milliseconds between each search step.
 * @property {string} [method='binary'] - The search method to use ('binary' or 'brute').
 */

/**
 * Search for a number in an array using the specified method ('binary' or 'bruteforce').
 * 
 * Some notes about different search methods.
 * - Binary search (`method='binary'`): 
 *   - Time Complexity: O(log n)
 *   - Requires the array to be sorted.
 *   - Efficient for large datasets.
 * 
 * - Brute-force search (`method='brute'`): 
 *   - Time Complexity: O(n)
 *   - Does not require the array to be sorted.
 *   - Simpler but less efficient for large datasets.
 *
 * @param {SearchOptions} options - The options for the search.
 * @returns {Promise<number>} The index of the found number, or -1 if not found.
 * @throws {Error} If an unknown method is provided.
 */
async function search({array, givenNumber, onTry, onSuccess, onFail, stepDelay = 500, method = 'binary'}) {
    onTry = onTry || function () { };
    onSuccess = onSuccess || function () { };
    onFail = onFail || function () { };

    let start = 0;
    let end = array.length - 1;
    let step = 0;

    /**
     * Delay execution by a given number of milliseconds.
     * @param {number} ms - The delay in milliseconds.
     * @returns {Promise<void>}
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    if (method === 'bruteforce') {
        // Brute-force search
        // Time Complexity: O(n)
        while (start <= end) {
            // Delay before the next step
            // if it is first step - delay = 0
            await delay(step == 0 ? 0 : stepDelay);

            onTry(start, end);
            step += 1;

            if (array[start] === givenNumber) {
                onSuccess(start);
                return start; // Found the target
            } else {
                start += 1;
            }
        }
    } else if (method === 'binary') {
        // Binary search
        // Time Complexity: O(log n)
        while (start <= end) {
            // Delay before the next step
            // if it is first step - delay = 0
            await delay(step == 0 ? 0 : stepDelay);
            let middle = Math.floor((start + end) / 2);

            onTry(start, end);
            step += 1;

            if (array[middle] < givenNumber) {
                // Search the right half
                start = middle + 1;
            } else if (array[middle] > givenNumber) {
                // Search the left half
                end = middle - 1;
            } else if (array[middle] === givenNumber) {
                onSuccess(middle);
                return middle; // Found the target
            }
        }
    } else {
        throw new Error(`Unknown method: ${method}`);
    }

    onFail(); // Target not found
    return -1;
}
