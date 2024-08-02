let simpleFunctionGraphs = new Scene({
    title: 'Simple funсion graphs', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Empty'
        },
    },

    code: (root, display, settings) => {
        // reset the element state to remove all previously applied event handlers
        let canvas = resetElement(root.querySelector('canvas'));
        
        // basic canvas values
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        // scene values
        // raduis of "spectrum" circle
        const radius = 150;

        // clearing prev created animation threads
        window.runningAnimations.clearQueue();
    }
});


/**
 * TODO: check bug with scene switching 'static-gradients' <---> 'color-picker'
 */

// Exproting scene
window.exportedObjects.push(simpleFunctionGraphs);

/**
* Scene file internal helper function defenitions
*/
