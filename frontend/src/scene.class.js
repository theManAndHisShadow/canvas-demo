class Scene {
    /**
     * @param {string} param.title - title name of scene
     * @param {Function} param.code - All manipulations that are performed with the root element are here. Function has access to scene HTML root element.
     */
    constructor({ title, code }){
        this.displayName = 'Scene';
        this.title = title;

        // JS code of scene.
        this.code = code;

        // timestamp will be settled at load Scene method
        this.timestamp = null;
    }


    /**
     * Executes code of separate scene
     * @param {string} param.baseTabTitle - base part of tab title
     * @param {HTMLDivElement} param.root - ref to scene html root element
     */
    execute({baseTabTitle, root}){
        let callback = this.code;

        let titleElement = root.children[0];
        titleElement.textContent = this.title;
        
        document.title = baseTabTitle + ' - ' + this.title;

        // execute scene code
        callback(root);
    }
}