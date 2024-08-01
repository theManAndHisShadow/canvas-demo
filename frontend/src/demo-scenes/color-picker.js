let colorPicker = new Scene({
    title: 'Color picker demo scene', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'empty'
        },
    },

    code: (root, display, settings) => {
        const canvas = root.querySelector('canvas');
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        const centerX = width / 2;
        const centerY = height / 2;

    }
});

// Exproting scene
window.exportedObjects.push(colorPicker);


/**
* Scene file internal helper function defenitions
*/
