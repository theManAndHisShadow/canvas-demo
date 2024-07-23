class Scene {
    /**
     * @param {string} param.title - title name of scene
     * @param {Function} param.code - All manipulations that are performed with the root element are here. Function has access to scene HTML root element.
     */
    constructor({ title, ui, code }){
        this.displayName = 'Scene';
        this.title = title;

        // ui strucutre tree with some settings
        // check note inside 'execute' method for detailed info
        this.ui = ui;

        // JS code of scene, code invokes inside 'execute' method as callback
        this.code = code;

        // timestamp will be settled at load Scene method
        this.timestamp = null;
    }


    /**
     * Executes code of separate scene
     * @param {string} param.baseTabTitle - base part of tab title
     * @param {HTMLDivElement} param.root - ref to scene html root element
     * @param {UIDisplay} param.display - ref to UIDisplay instance to control scene ui info display
     * @param {object} param.settings - scene settings
     */
    execute({baseTabTitle, root, display, settings}){
        let callback = this.code;

        let titleElement = root.children[0];
        titleElement.textContent = this.title;
        
        document.title = baseTabTitle + ' - ' + this.title;

        callback(
            // ref to root element of canvas
            root, 

            /**
             * Some notes about 'display' param:
             * I decided to isolate the scene from accessing other parts of the HTML, 
             * so I am providing limited access to the UIDisplay object. 
             * Through its methods, you can additionally influence the state of 
             * the "Scene Display" HTML block when necessary. Inside the scene, 
             * you can update the data either automatically (by passing 'ui' as part of the parameter) 
             * or manually (by calling 'ui.display.render()', 'ui.display.updateValue()' yourself).
             */
            display, 

            /**
             * Some notes about 'settings' param:
             * - Updated from last changes:
             * Access to the settings data is also provided by passing a reference to an instance of 
             * the StateManager class, which is stored as a parameter in the UI and passed into 'loadedScene.execute({})' 
             * when the scene is loaded within the Page class. Inside the scene, you can subscribe to setting changes using 
             * the '.subscribe()' method or request data using '.getState()'. This way, a certain reactivity is achieved, 
             * allowing the scene to know if someone has affected its settings (through the "Controls" HTML block) at any given moment.
             */
            settings
        );
    }
}