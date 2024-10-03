import UI_BlockPrototype from "./ui_block.prototype_class";

/**
 * Class which controls the operation of user interface elements
 */
export default class UI_ControlPanel extends UI_BlockPrototype{
    // attribute for all rendered controle elements (labels not marked with this attrib)
    #renderedControlElementAttribute = 'data-rendered-control-element';

    // attribute for main action button element
    #mainActionButtonAttribute = 'data-main-action-button';

    constructor(htmlRootElementRef, parent) {
        super(htmlRootElementRef);
        
        this.parent = parent;
    }


    /**
     * Renders checkbox element and add 'change' event hanlder.
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, label e.t.c)
     */
    renderCheckbox(elementName, elementObject) {
        let element = document.createElement('div');
        element.id = elementName;

        let label = document.createElement('span');
        label.innerText = elementObject.label + ': ';
        label.classList.add('controls__checkbox-label', 'controls__option-label');

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('controls__checkbox-checkbox');
        checkbox.checked = elementObject.state;
        checkbox.setAttribute(this.#renderedControlElementAttribute, this.currentSceneTimestamp);

        this.parent.states.setState(elementName, elementObject.state);

        checkbox.addEventListener('click', event => {
            this.parent.states.setState(elementName, checkbox.checked);
        });

        element.appendChild(label);
        element.appendChild(checkbox);

        this.appendToHTML(elementName, { element, label, value: checkbox });
    }


    /**
     * Renders checkbox element and add 'change' event hanlder.
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, label e.t.c)
     */
    renderInput(elementName, elementObject) {
        // fixing bug with values less than min value when minValue is undefined
        elementObject.minValue = typeof elementObject.minValue == 'number'
            ? elementObject.minValue : elementObject.defaultValue;

        let element = document.createElement('div');
        element.id = elementName;

        let label = document.createElement('span');
        label.classList.add('controls__input-label', 'controls__option-label');
        label.innerText = elementObject.label + ': ';

        let input = document.createElement('input');
        input.classList.add('controls__input-input');
        input.type = 'number';
        input.min = elementObject.minValue;
        input.max = elementObject.maxValue;
        input.placeholder = 'max ' + elementObject.maxValue;
        input.setAttribute(this.#renderedControlElementAttribute, this.currentSceneTimestamp);
        input.value = elementObject.defaultValue;

        this.parent.states.setState(elementName, elementObject.defaultValue);

        input.addEventListener('change', event => {
            /**
             * Without these lines, it is allowed to enter into the input line values ​​that clearly exceed
             * the maximum and minimum values ​​set in the elementObject - this behavior is strange and unacceptable.
             */
            if (Number(input.value) > elementObject.maxValue) input.value = elementObject.maxValue;
            if (Number(input.value) < elementObject.minValue) input.value = elementObject.minValue;

            this.parent.states.setState(elementName, Number(input.value));
        });

        element.appendChild(label);
        element.appendChild(input);

        this.appendToHTML(elementName, { element, label, value: input });
    }

    /**
     * Renders input range element and add 'change' event hanlder.
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, startLabel, endLabel e.t.c)
     */
    renderRangeSlider(elementName, elementObject) {
        let element = document.createElement('div');
        element.id = elementName;

        let startLabel = document.createElement('span');
        startLabel.innerText = elementObject.startLabel;
        startLabel.classList.add('controls__range-slider-start-label', 'controls__option-label');

        let range = document.createElement('input');
        range.type = 'range';
        range.min = elementObject.minValue;
        range.max = elementObject.maxValue;
        range.value = elementObject.defaultValue;
        range.classList.add('controls__range-slider');
        range.setAttribute(this.#renderedControlElementAttribute, this.currentSceneTimestamp);
        range.checked = elementObject.state;

        let endLabel = document.createElement('span');
        endLabel.innerText = elementObject.endLabel;
        endLabel.classList.add('controls__range-slider-end-label', 'controls__option-label');

        this.parent.states.setState(elementName, elementObject.defaultValue);

        range.addEventListener('mousemove', event => {
            range.title = range.value;
            this.parent.states.setState(elementName, range.value);
        });

        element.appendChild(startLabel);
        element.appendChild(range);
        element.appendChild(endLabel);

        this.appendToHTML(elementName, { element, label: [startLabel, endLabel], value: range });
    }


    /**
     * Renders button, when clicked, returns the time the button was pressed
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, label e.t.c)
     */
    renderButton(elementName, elementObject) {
        let element = document.createElement('div');
        element.id = elementName;

        let label = document.createElement('span');
        label.innerHTML = elementObject.label + ': ';

        let button = document.createElement('button');
        button.classList.add('controls__button');
        button.setAttribute(this.#renderedControlElementAttribute, this.currentSceneTimestamp);
        button.textContent = elementObject.text;

        button.addEventListener('click', () => {
            let timestamp = Date.now();
            this.parent.states.setState(elementName, timestamp);
        });

        element.appendChild(label);
        element.appendChild(button);

        this.appendToHTML(elementName, { element, label, value: button });
    }

    /**
     * Renders button, when clicked, returns the time the button was pressed
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, label e.t.c)
     */
    renderMainActionButton(elementName, elementObject) {
        let element = document.createElement('div');
        element.id = elementName;


        let button = document.createElement('button');
        button.classList.add('controls__main-action-button');
        button.setAttribute(this.#mainActionButtonAttribute, '');
        button.setAttribute(this.#renderedControlElementAttribute, this.currentSceneTimestamp);
        button.textContent = elementObject.text;

        button.addEventListener('click', () => {
            let timestamp = Date.now();
            this.parent.states.setState(elementName, timestamp);
        });

        element.appendChild(button);
        this.appendToHTML(elementName, { element, label: null, value: button });
    }


    /**
     * Renders toggle-select list, click activates only one of presets.
     * @param {string} elementName
     * @param {object} elementObject
     */
    renderOptionSelector(elementName, elementObject) {
        let element = document.createElement('div');
        element.id = elementName;

        let label = document.createElement('span');
        label.classList.add('controls__option-selector-label', 'controls__option-label');
        label.innerText = elementObject.label + ': ';

        let optionContainer = document.createElement('div');
        optionContainer.classList.add('controls__buttons-container');

        elementObject.optionNames.forEach((optionName, i) => {
            let button = document.createElement('button');
            button.classList.add('controls__option-selector-button');
            button.setAttribute(this.#renderedControlElementAttribute, this.currentSceneTimestamp);
            button.textContent = optionName;
            button.setAttribute('data-preset-num', i);

            // select by default
            if (i == 0) button.setAttribute('data-selected-option', true);

            button.addEventListener('click', () => {
                // deselecting prev selected buttons INSIDE of this control menu element (element.querySelector)
                let prevSelected = Array.from(element.querySelectorAll('[data-selected-option="true"]'));
                if (prevSelected.length > 0) prevSelected.forEach(button => button.removeAttribute('data-selected-option'));

                button.setAttribute('data-selected-option', true);
                this.parent.states.setState(elementName, Number(i));
            });

            optionContainer.appendChild(button);
        });

        this.parent.states.setState(elementName, elementObject.defaultValue);

        element.appendChild(label);
        element.appendChild(optionContainer);

        this.appendToHTML(elementName, { element, label, value: optionContainer });
    }


    /**
     * Renders dropdown list, click selects only one option.
     * @param {string} elementName
     * @param {object} elementObject
     */
    renderOptionDropdownList(elementName, elementObject) {
        let element = document.createElement('div');
        element.id = elementName;

        let label = document.createElement('span');
        label.classList.add('controls__option-dropdown-list-label', 'controls__option-dropdown-list-label');
        label.innerText = elementObject.label + ': ';

        let dropdownContainer = document.createElement('select');
        dropdownContainer.classList.add('controls__option-dropdown-list-container');

        // create for each option own html tag
        elementObject.options.forEach((option, i) => {
            let optionButton = document.createElement('option');
            optionButton.classList.add('controls__option-dropdown-list-button');
            optionButton.setAttribute(this.#renderedControlElementAttribute, this.currentSceneTimestamp);
            optionButton.textContent = option.name;
            optionButton.setAttribute('data-preset-num', i);

            // select by default
            if (elementObject.selectedByDefault === i) {
                optionButton.setAttribute('selected', '');
                this.parent.states.setState(elementName, Number(i));
            }

            // add to container
            dropdownContainer.appendChild(optionButton);
        });


        // update state value on select
        dropdownContainer.addEventListener('change', (event) => {
            let index = Number(dropdownContainer.selectedOptions[0].getAttribute("data-preset-num"));
            this.parent.states.setState(elementName, Number(index));
        });

        element.appendChild(label);
        element.appendChild(dropdownContainer);

        this.appendToHTML(elementName, { element, label, value: dropdownContainer });

        return element;
    }

    /**
     * Renders preset dropdown.
     * @param {string} elementName
     * @param {object} elementObject
     */
    renderPresetDropdownList(elementName, elementObject) {
        // Get the select element
        const selectElement = this.renderOptionDropdownList(elementName, elementObject).querySelector('select');

        const handleSelection = () => {
            // Get all element IDs
            const allElementIds = Object.keys(this.html);

            // Get selected preset index and corresponding object
            const selectedIndex = Number(selectElement.selectedOptions[0].getAttribute("data-preset-num"));
            const selectedPreset = elementObject.options[selectedIndex];

            // Get allowed elements array
            const allowedElements = selectedPreset.allowedElements;

            // Determine which elements should be hidden
            let elementsToHide;
            if (Array.isArray(allowedElements)) {
                if (allowedElements.length === 0) {
                    elementsToHide = allElementIds.filter(id => id !== elementName && id !== 'root');
                } else if (allowedElements.includes('*')) {
                    elementsToHide = [];
                } else {
                    elementsToHide = allElementIds.filter(id => id !== elementName && id !== 'root' && !allowedElements.includes(id));
                }
            } else {
                throw new Error('option.allowedElements type must be an array!');
            }

            // Toggle visibility of elements
            allElementIds.forEach(id => {
                if (id !== 'root') {
                    const element = this.html[id].element;

                    if (elementsToHide.includes(id)) {
                        if(element) element.classList.add('hidden');
                    } else {
                        if(element) element.classList.remove('hidden');
                    }
                }
            });
        };

        // Add event listener for option selection
        selectElement.addEventListener('change', handleSelection);
        this.addEventListener('renderEnd', handleSelection);
    }


    render(conrtolPanel_uiStructureTree){
        if(conrtolPanel_uiStructureTree){
            // reset inner of root element
            this.clearRoot();

            // present key array as render queue
            let renderQueue = [...Object.keys(conrtolPanel_uiStructureTree)];

            // render each element using its key
            while(renderQueue.length > 0) {
                // get single elem
                let key = renderQueue.shift();
                let element = conrtolPanel_uiStructureTree[key];

                if(element.type == 'range-slider') this.renderRangeSlider(key, element);
                if(element.type == 'main-action-button') this.renderMainActionButton(key, element);
                if(element.type == 'button') this.renderButton(key, element);
                if(element.type == 'checkbox') this.renderCheckbox(key, element);
                if(element.type == 'input') this.renderInput(key, element);
                if(element.type == 'option-selector') this.renderOptionSelector(key, element);

                /**
                 * The difference between 'UI_ControlPanel.renderOptionDropdownList()' and 'UI_ControlPanel.renderPresetDropdownList()' is that:
                 * -> 'UI_ControlPanel.renderOptionDropdownList()' is simply a drop-down list with values ​​that define scene details, 
                 * -> while 'UI_ControlPanel.renderPresetDropdownList()' in turn affects the scene controls elements globally.
                 * 
                 * 'UI_ControlPanel.renderPresetDropdownList()' uses the code base of 'UI_ControlPanel.renderOptionDropdownList()', extending its behavior.
                 */
                if(element.type == 'option-dropdown-list') this.renderOptionDropdownList(key, element);
                if(element.type == 'preset-dropdown-list') this.renderPresetDropdownList(key, element);

                /**
                 * For some actions, you need to understand when the rendering queue has reached the end
                 */
                if(renderQueue.length == 0) {
                    this.dispatchEvent('renderEnd');
                }
            }
        }
    }
}