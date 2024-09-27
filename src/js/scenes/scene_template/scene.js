import { Scene } from "../../core/scene.class";

let someScene = new Scene({
    title: 'Scene template', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Empty',
        },
    },

    code: (root, display, settings) => {
        // clearing prev created animation threads
        window.runningAnimations.clearQueue();

        // timestamp to current scene's canvas elem
        const timestamp = Date.now();

        // reset the element state to remove all previously applied event handlers
        let canvas = resetElement(root.querySelector('canvas'), `canvas-${timestamp}`);
        
        // basic canvas values
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
    }
});


// Exproting scene
window.exportedObjects.push(someScene);

/**
* Scene file internal helper function defenitions
*/