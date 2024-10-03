import UI_BlockPrototype from "./ui_block.prototype_class";

export default class UI_HUD extends UI_BlockPrototype{
    #elementCSS_SelectorPrefix = 'HUD__';

    constructor(htmlRootElementRef){
        super(htmlRootElementRef);

        // ...
    }


    /**
     * Draws an element item on UI_HUD.
     * @param {string} elementName - element name
     * @param {object} elementObject - element object
     */
    renderItem(elementName, elementObject) {
        let element = document.createElement('div');
        element.id = this.#elementCSS_SelectorPrefix + elementName;
        element.classList.add('display-item');

        let label = document.createElement('span');
        label.classList.add(
            this.#elementCSS_SelectorPrefix + 'display-label',
            this.#elementCSS_SelectorPrefix + 'item-label'
        );
        label.innerHTML = elementObject.hideColon === true ? elementObject.label : elementObject.label + ': ';

        let valueContainer = document.createElement('span');
        valueContainer.classList.add(
            this.#elementCSS_SelectorPrefix + 'display-value',
            this.#elementCSS_SelectorPrefix + 'item-value'
        );
        valueContainer.innerHTML = elementObject.text ? elementObject.text : '<i class="pale">no info</i>';


        element.appendChild(label);
        element.appendChild(valueContainer);

        this.html[elementName] = valueContainer;

        this.appendToHTML(elementName, { element, label, value: valueContainer });

        return element;
    }

    
    render(hudPanel_uiStructureTree){
        if(hudPanel_uiStructureTree && Object.keys(hudPanel_uiStructureTree).length > 0){
            this.unhideWholeBlock();

            // reset inner of root element
            this.clearRoot();

            // present key array as render queue
            let renderQueue = [...Object.keys(hudPanel_uiStructureTree)];

            // render each element using its key
            while(renderQueue.length > 0) {
                // get single elem
                let key = renderQueue.shift();
                let element = hudPanel_uiStructureTree[key];
    
                if(element.type == 'item') this.renderItem(key, element);

                /**
                 * For some actions, you need to understand when the rendering queue has reached the end
                 */
                if(renderQueue.length == 0) {
                    this.dispatchEvent('renderEnd');
                }
            }
        } else {
            this.hideWholeBlock();
        }
    }
}