/**
 * N.B.:
 * I know that modifying built-in objects is bad form for a modern language standard. 
 * We've moved on from the days when people extended the array class with their own methods
 * 
 * In this case, the 'exportedObjects' array below is a repository of imported demo scenes, 
 * which can be accessed whenever there is a need to execute scene code.
 */
window.exportedObjects = [];


/**
 * When switching scenes, the old rendering threads remained alive; 
 * for cleanliness, it was decided to kill these rendering threads. 
 * In addition, due to the different scenes (static scenes, scenes with dynamic rendering), 
 * a mechanism was needed to stop previously running rendering threads. 
 * With an execution queue in place, it's possible to manage multiple canvases at the same time.
 */
window.runningAnimations = {
    queue: [],

    /**
     * Adding animation function (for exanple 'loop()', 'draw()' etc) 
     * to animations quque for more flexible management.
     * @param {Function} animationFunction 
     * @param {boolean} [clearAll=false]
     */
    add: function(animationFunction, clearAll = true) {
        if(clearAll == true) this.clearQueue();

        // wrapping the required function for convenience
        const wrappedFunction = (timestamp) => {
            animationFunction(timestamp);
            const id = requestAnimationFrame(wrappedFunction);
            
            // saving ID of requestAnimationFrame functions to canceling feature
            wrappedFunction.id = id;
        };

        // Invoking wrapped original function
        wrappedFunction();

        // adding wrapped animationg function to queue
        this.queue.push(wrappedFunction);
    },

    /**
     * Stop all previously launched animation functions 
     */
    clearQueue: function() {
        // stopping previously running functions
        this.queue.forEach(wrappedFunction => {
            window.cancelAnimationFrame(wrappedFunction.id);
        });

        // resetting queue
        this.queue = [];
    }
};

class Page {
    // some important attributes names
    static #linkDataAttribute = "data-link-to-demo";
    static #importedSceneAttribute = "data-improted-scene";
    
    // html id of root element for scenes
    static #rootElementID = '#root';
    static #displayContainerElementID = '#scene-info';
    static #controlsContainerElementID = '#controls';

    //location of demo scenes
    static #scenesLocation = './src/demo-scenes/';

    constructor(){
        this.displayName = 'Page';
        this.windowTitle = 'Canvas demo'

        // root for demo scene drawning
        this.root = Page.parseRoot();

        this.ui = new UI({
            display: Page.parseUIDisplay(),
            controls: Page.parseUIControls(),
        });

        // get all finded links
        this.links = Page.parseLinks();
    }


    /**
     * Parses document and returns links that marked with special attribute. 
     * @returns {HTMLAnchorElement[]} - array of HTML anchor elements
     */
    static parseLinks(){
        let links = document.querySelectorAll(`[${Page.#linkDataAttribute}]`);
        // By default links is collection of HTML Nodes, transform to pure Array
        let linksArray = Array.from(links);

        return linksArray;
    }


    /**
     * Parses document and returns root node for scenes.
     * @returns {HTMLDivElement} - single div element
     */
    static parseRoot(){
        let root = document.querySelector(`${Page.#rootElementID}`);

        return root;
    }


    /**
     * Parses document and return root node for 'Controls' html block
     * @returns {HTMLElement}
     */
    static parseUIControls(){
        let controls = document.querySelector(`${Page.#controlsContainerElementID}`);

        return controls;
    }


    /**
     * Parses document and return root node for 'Scene Info' html block
     * @returns {HTMLElement}
     */
    static parseUIDisplay(){
        let display = document.querySelector(`${Page.#displayContainerElementID}`);

        return display;
    }


    /**
     * Creates and injects html 'script' element
     * @param {*} scriptPath 
     * @returns 
     */
    static createSciptTag(scriptPath){
        let scriptElement = document.createElement('script'); 
        scriptElement.setAttribute('src', scriptPath);
        scriptElement.setAttribute("type", "text/javascript");
        scriptElement.setAttribute("async", "async");

        return scriptElement;
    }

    
    /**
     * Asynchronously loads scene using scene file path string
     * @param {string} scriptPath - path to scene file
     * @returns - resolve/reject
     */
    loadScene(scriptPath) {
        return new Promise((resolve, reject) => {
            // Adding some comment for visual separation for block of imported scripts tags
            if(window.exportedObjects.length == 0){
                let commentElement = document.createComment('imported scenes');
                document.body.appendChild(commentElement);
            }

            // (1) - Trying to find a script tag with same 'sciptPath'
            let scriptElement = document.querySelector(`script[src="${scriptPath}"]`);
            // (2a) - If we successfully found this element - switching to 'true' flow
            //       At this flow we know that this demo scene has previously been loaded
            if (scriptElement && scriptElement.constructor.name == 'HTMLScriptElement') {
                // (3a) - Getting a script attribute indicating that this script is imported
                //        The attribute  value contains a numeric label that is exactly the same 
                //        as the numeric label of the previously loaded scene.
                //        Because the timestamp is issued at loading time for both 
                //        the element and the scene itself, that is, they refer to the time 
                //        of their creation as a unique identifier
                let scriptTimestampt = scriptElement.getAttribute(Page.#importedSceneAttribute);

                // (4a) - Find scene inside array using their single timestamp
                let sceneObject = window.exportedObjects.find(scene => {
                    return scene.timestamp == Number(scriptTimestampt);
                });

                // (5a) - return object asynchronously
                resolve(sceneObject);                                               
                return;
            } else { 
            // (2b) - If we cant found this element - swtchiong to 'false' flow
                // (3b) - In this flow we know for sure that the scene has not been loaded before
                //        Therefore, it creates an element on its own and adds it to part of the document
                scriptElement = Page.createSciptTag(scriptPath);                        
                document.body.appendChild(scriptElement);
                
                // (4b) - Only when the script is loaded, we can perform manipulations
                scriptElement.addEventListener("load", () => {
                    // (5b) - IMPORTANT! Create a timestamp only once - while loading the script!
                    //        And set this timestamp value for script element...
                    let timestamp = Date.now();
                    scriptElement.setAttribute(`${Page.#importedSceneAttribute}`, timestamp);
    
    
                    if (window.exportedObjects && window.exportedObjects.length > 0) {
                        let sceneObject = getArrayLast(window.exportedObjects);
                        // (5b) ...and for loaded scene object!
                        sceneObject.timestamp = timestamp;
                        
                        // (6b) - return object asynchronously
                        resolve(sceneObject);
                    } else {
                        reject(new Error("Object not found after script load"));
                    }
                });
            }
    
            scriptElement.addEventListener("error", (event) => {
                reject(new Error("Error on loading file: " + event.message));
            });
        });
    }    



    /**
     * Adding 'click' events and event hanlders for previously parsed links.
     */
    #addEventsToLinks(){
        // If this.links contains array
        if(Array.isArray(this.links)) {
            // adding event for each link from array
            this.links.forEach(link => {
                link.addEventListener('click', (event) => {
                    // getting name of scene
                    let targetSceneName = link.getAttribute(Page.#linkDataAttribute);
                    // preparing full relative path to scene file
                    let scenePath = `${Page.#scenesLocation}${targetSceneName}.js`;

                    // additionally set href as name of scene to display scene changing at browser's url input
                    link.setAttribute('href', `#${targetSceneName}`);
                    
                    // load demo scene using class method
                    // it will return a scene object if the scene is loaded for the first time 
                    // or even if it has already been loaded before
                    this.loadScene(scenePath).then(loadedScene => {
                        // getting scene ui structure tree with settings and controls
                        let uiTree = loadedScene.ui;
                        // render it (and add event handlers, that updated values)
                        this.ui.render(uiTree);

                        // Scene contains code of demo
                        // we can execute that code when user clicks at link
                        // Code will affect to html root node and windows tab title
                        loadedScene.execute({
                            root: this.root,
                            baseTabTitle: this.windowTitle,

                            // adding access to UIDisplay instance inside scene
                            // more information here - 'scene.class.js'
                            display: this.ui.display,

                            // put updated values to settings params
                            // it makes updated values available inside scene code
                            settings: this.ui.states,
                        });
                    }).catch(error => {
                        console.log(error);
                    }); 
                });
            });
        }
    }

    /**
     * Main class instance method
     * initializes a class instance
     */
    init() {
        // Modify all marked links by adding event listener 
        // and event hanlder which loads the demo scene using the address of the clicked link 
        this.#addEventsToLinks();

        // load first scene by default
        let firstLink = document.querySelectorAll('[data-link-to-demo]')[0];
        firstLink.click();
    }
}