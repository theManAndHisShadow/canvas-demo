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
     * @param {object} param.settings - scene settings
     */
    execute({baseTabTitle, root, settings}){
        let callback = this.code;

        let titleElement = root.children[0];
        titleElement.textContent = this.title;
        
        document.title = baseTabTitle + ' - ' + this.title;

        // Some notes about 'settings' param:
        // - Executing scene code with settings (dynamically set values values from HTML Control elements).
        // - HTML Controls is result of UI class instance, that stored in Page.ui
        // - When page loads some scene, it parses scene instance.ui 'structure tree'
        // - ui structure tree presents as '...someSettingKey: {...value/state: value},...'
        // - after tree is loaded Page.ui renders ui tree to html elements and add events to update values
        // - updated values stored in Page.ui.states as simple pair 'someSettingKey: value/state'
        // - finnaly inside load scene method puts 'Page.uis.tates' object to 'execute' method as param
        // - and its available inside scene, just get settings.someKey
        // circuit: 
        //      sceneInstance.ui -> 
        //      loadedScene.ui -> 
        //      page.ui.render(loadedSceme.ui) -> 
        //      page.ui.states -> 
        //      [this method] sceneInstance.execute({...settings: Page.ui.states,...}) ->
        //      sceneInstance.code(...settings..>)
        callback(root, settings);
    }
}