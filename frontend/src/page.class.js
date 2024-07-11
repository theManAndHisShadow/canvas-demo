window.exportedObjects = [];

// [TODO]:
// - add comments
// - add methods annotations
// - refactor some parts of code

class Page {
    static #linkDataAttribute = "data-link-to-demo";
    static #importedContainerAttribute = "data-improted-container";
    static #rootElementID = '#root';
    static #containerLocation = './src/demos/';

    constructor(){
        this.displayName = 'Page';
        this.windowTitle = 'Canvas demo'

        this.root = Page.parseRoot();

        // parse links to demos
        this.links = Page.parseLinks();
    }

    static parseLinks(){
        let links = document.querySelectorAll(`[${Page.#linkDataAttribute}]`);
        let linksArray = Array.from(links);

        return linksArray;
    }

    static parseRoot(){
        let root = document.querySelector(`${Page.#rootElementID}`);

        return root;
    }

    loadContainer(scriptPath) {
        return new Promise((resolve, reject) => {
    

            if (document.querySelector(`script[src="${scriptPath}"]`)) {
                let exitesScript = document.querySelector(`script[src="${scriptPath}"]`);
                let scriptTimestampt = exitesScript.getAttribute(Page.#importedContainerAttribute);

                let containerObject = window.exportedObjects.find(container => {
                    return container.timestamp == Number(scriptTimestampt);
                });

                resolve(containerObject);
                return;
            } 

            if(window.exportedObjects.length == 0){
                let commentElement = document.createComment('containers of various demo codes');
                document.body.appendChild(commentElement);
            }
    
            let scriptElement = document.createElement('script');
            scriptElement.setAttribute('src', scriptPath);
            scriptElement.setAttribute("type", "text/javascript");
            scriptElement.setAttribute("async", "async");
    
            document.body.appendChild(scriptElement);
    
            scriptElement.addEventListener("load", () => {
                let timestamp = Date.now();
                scriptElement.setAttribute(`${Page.#importedContainerAttribute}`, timestamp);

                // Ожидание объекта из глобального контекста
                if (window.exportedObjects && window.exportedObjects.length > 0) {
                    let scriptTimestampt = scriptElement.getAttribute(Page.#importedContainerAttribute);
                    let containerObject = getArrayLast(window.exportedObjects);
                    containerObject.timestamp = timestamp;
                    
                    resolve(containerObject);
                } else {
                    reject(new Error("Object not found after script load"));
                }
            });
    
            scriptElement.addEventListener("error", (event) => {
                reject(new Error("Error on loading file: " + event.message));
            });
        });
    }    

    #addEventsToLinks(){
        if(Array.isArray(this.links)) {
            this.links.forEach(link => {
                link.addEventListener('click', (event) => {
                    let targetContainerName = link.getAttribute(Page.#linkDataAttribute);
                    let containerPath = `${Page.#containerLocation}${targetContainerName}.js`;

                    link.setAttribute('href', `#${targetContainerName}`);
                    
                    this.loadContainer(containerPath).then(loadedContainer => {
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

    init() {
        this.#addEventsToLinks();
    }
}