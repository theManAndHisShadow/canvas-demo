/**
 * N.B.:
 * I know that modifying built-in objects is bad form for a modern language standard. 
 * We've moved on from the days when people extended the array class with their own methods
 * 
 * In this case, the 'exportedObjects' array below is a repository of imported containers, 
 * which can be accessed whenever there is a need to execute container code.
 */
window.exportedObjects = [];

class Page {
    // soma important attributes names
    static #linkDataAttribute = "data-link-to-demo";
    static #importedContainerAttribute = "data-improted-container";
    
    // html id of root element for containers
    static #rootElementID = '#root';

    //location of demo
    static #containerLocation = './src/demos/';

    constructor(){
        this.displayName = 'Page';
        this.windowTitle = 'Canvas demo'

        // root for container drawning
        this.root = Page.parseRoot();

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
     * Parses document and returns root node for containers.
     * @returns {HTMLDivElement} - single div element
     */
    static parseRoot(){
        let root = document.querySelector(`${Page.#rootElementID}`);

        return root;
    }

    static createSciptTag(scriptPath){
        let scriptElement = document.createElement('script'); 
        scriptElement.setAttribute('src', scriptPath);
        scriptElement.setAttribute("type", "text/javascript");
        scriptElement.setAttribute("async", "async");

        return scriptElement;
    }

    /**
     * Some important notes about Page.loadContainer() method:
     * 
     */
    
    /**
     * Asynchronously loads container using container file path string
     * @param {string} scriptPath - path to container file
     * @returns - resolve/reject
     */
    loadContainer(scriptPath) {
        return new Promise((resolve, reject) => {
            // Adding some comment for visual separation for block of imported scripts tags
            if(window.exportedObjects.length == 0){
                let commentElement = document.createComment('containers of various demo codes');
                document.body.appendChild(commentElement);
            }

            // (1) - Trying to find a script tag with same 'sciptPath'
            let scriptElement = document.querySelector(`script[src="${scriptPath}"]`);
            // (2a) - If we successfully found this element - switching to 'true' flow
            //       At this flow we know that this container has previously been loaded
            if (typeof scriptElement !== undefined) {
                // (3a) - Getting a script attribute indicating that this script is imported
                //        The attribute  value contains a numeric label that is exactly the same 
                //        as the numeric label of the previously loaded container.
                //        Because the timestamp is issued at loading time for both 
                //        the element and the container itself, that is, they refer to the time 
                //        of their creation as a unique identifier
                let scriptTimestampt = scriptElement.getAttribute(Page.#importedContainerAttribute);

                // (4a) - Find container inside array using their single timestamp
                let containerObject = window.exportedObjects.find(container => {
                    return container.timestamp == Number(scriptTimestampt);
                });

                // (5a) - return object asynchronously
                resolve(containerObject);                                               
                return;
            } else { 
            // (2b) - If we cant found this element - swtchiong to 'false' flow
                // (3b) - In this flow we know for sure that the container has not been loaded before
                //        Therefore, it creates an element on its own and adds it to part of the document
                scriptElement = Page.createSciptTag(scriptPath);                        
                document.body.appendChild(scriptElement);
                
                // (4b) - Only when the script is loaded, we can perform manipulations
                scriptElement.addEventListener("load", () => {
                    // (5b) - IMPORTANT! Create a timestamp only once - while loading the script!
                    //        And set this timestamp value for script element...
                    let timestamp = Date.now();
                    scriptElement.setAttribute(`${Page.#importedContainerAttribute}`, timestamp);
    
    
                    if (window.exportedObjects && window.exportedObjects.length > 0) {
                        let containerObject = getArrayLast(window.exportedObjects);
                        // (5b) ...and for loaded container object!
                        containerObject.timestamp = timestamp;
                        
                        // (6b) - return object asynchronously
                        resolve(containerObject);
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
                    // getting name of container
                    let targetContainerName = link.getAttribute(Page.#linkDataAttribute);
                    // preparing full relative path to container file
                    let containerPath = `${Page.#containerLocation}${targetContainerName}.js`;

                    // additionally set href as '#nameOfContainerFile'
                    link.setAttribute('href', `#${targetContainerName}`);
                    
                    // load container using class method
                    // it will return a container object if the container is loaded for the first time 
                    // or even if it has already been loaded before
                    this.loadContainer(containerPath).then(loadedContainer => {
                        // Container contains code of demo
                        // we can execute that code when user clicks at link
                        // Code will affect to html root node and windows tab title
                        loadedContainer.execute({
                            root: this.root,
                            baseWindowTitle: this.windowTitle,
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
        // and event hanlder which loads the container using the address of the clicked link 
        this.#addEventsToLinks();
    }
}