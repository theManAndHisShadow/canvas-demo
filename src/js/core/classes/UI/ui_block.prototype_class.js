import SyntheticEventTarget from "../synthetic_event_target.class";

/**
 * Base class for various UI sections.
 */
export default class UI_BlockPrototype extends SyntheticEventTarget {
    constructor(htmlRootElementRef) {
        super();

        this.html = {
            root: htmlRootElementRef || null,
            container: htmlRootElementRef.parentNode,
        };
    }


    /**
     * Appends new ready HTML element to HTML root block
     * @param {string} elementName - target element name 
     * @param {{element: HTMLElement, label: HTMLElement, value: HTMLElement}} renderedElementObject - {element - ref to whole rendered element, label - ref to label, value - ref to value element}
     */
    appendToHTML(elementName, renderedElementObject) {
        let { element } = renderedElementObject;

        this.html[elementName] = renderedElementObject;
        this.html.root.appendChild(element);
    }


    /**
    * Updates value of target element of instance
    * @param {string} elementName - name of element (key of this.html object)
    * @param {number|string|boolean} newValue
    */
    updateValue(elementName, newValue) {
        this.html[elementName].value.innerHTML = newValue;
    }


    /**
    * Resets content of root element in HTML
    */
    clearRoot() {
        this.html.root.innerHTML = '';
    } 


    /**
     * Hides root element with its parent node
     */
    hideWholeBlock(){
        this.html.container.style.display = 'none';
    }

    
    /**
     * unhides root element with its parent node
     */
    unhideWholeBlock(){
        this.html.container.style.display = 'initial';
    }
}