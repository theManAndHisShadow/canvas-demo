let binarySearch = new Scene({
    title: 'Binary search', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Empty'
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


        // Main function
        let loop = () => {
            context.clearRect(
                0, 0,
                width,
                height
            );

        }

        // animate
        window.runningAnimations.add(loop);
    }
});

window.exportedObjects.push(binarySearch);


/**
* Scene file internal classes and helper functions defenitions
*/
