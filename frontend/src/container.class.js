class Container {
    /**
     * @param {string} param.title - title name of container
     * @param {Function} param.code - All manipulations that are performed with the root element are here. Function has access to container HTML root element.
     */
    constructor({ title, code }){
        this.displayName = 'Container';
        this.title = title;

        // JS code of container.
        this.code = code;

        // timestamp will be settled at load Container method
        this.timestamp = null;
    }


    /**
     * Executes code of separate container
     * @param {string} param.baseTabTitle - base part of tab title
     * @param {HTMLDivElement} param.root - ref to container html root element
     */
    execute({baseTabTitle, root}){
        let callback = this.code;

        let titleElement = root.children[0];
        titleElement.textContent = this.title;
        
        document.title = baseTabTitle + ' - ' + this.title;

        // execute container code
        callback(root);
    }
}