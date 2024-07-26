/**
 * Parent class that manages work of UIControls and UIDisplay classes. Also stores StateManager of UI.
 */
class UI {
    constructor({display, controls}){
        // storing some pure values for later use inside the SCENE code
        this.states = new StateManager();

        // where is ui root node is placed
        this.display = new UIDisplay(display), 
        this.controls = new UIControls(controls, this.states);

    }


    /**
     * Renders ui structure tree to ready html ui elements
     * @param {object} uiStructureTree 
     */
    render(uiStructureTree){
        if(uiStructureTree){
            // reset inner of #controls container of UI
            this.display.clearRoot();
            this.controls.clearRoot();

            let keys = Object.keys(uiStructureTree);
            for(let key of keys) {
                let element = uiStructureTree[key];

                if(element.type == 'display') this.display.render(key, element);
                if(element.type == 'display-infobox') this.display.renderInfoBox(key, element)
                if(element.type == 'button') this.controls.renderButton(key, element);
                if(element.type == 'checkbox') this.controls.renderCheckbox(key, element);
                if(element.type == 'input') this.controls.renderInput(key, element);
                if(element.type == 'option-selector') this.controls.renderOptionSelector(key, element);
            }
        }
    }
}


/**
 * Child class which controls the operation of user interface elements
 */
class UIControls {
    #html;

    constructor(html, states){
        this.#html = {
            root: html,
        }

        this.states = states;
    }

    /**
     * Resets content of root element of 'controls' HTML Block
     */
    clearRoot(){
        this.#html.root.innerHTML = '';
    }


    /**
     * Appends new ready HTML element to 'Controls' HTML block
     * @param {HTMLElement} child - ref to fullt ready html element
     */
    appendToRoot(child){
        this.#html.root.appendChild(child);
    }


    /**
     * Renders checkbox element and add 'change' event hanlder.
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, label e.t.c)
     */
    renderCheckbox(elementName, elementObject){
        let element = document.createElement('div');
            element.id = elementName;

        let label = document.createElement('span');
            label.innerText = elementObject.label + ': ';
            label.classList.add('controls__checkbox-label', 'controls__option-label');

        let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('controls__checkbox-checkbox');
            checkbox.checked = elementObject.state;

        this.states.setState(elementName, elementObject.state);

        checkbox.addEventListener('click', event => {
            this.states.setState(elementName, checkbox.checked);
        });

        element.appendChild(label);
        element.appendChild(checkbox);

        this.appendToRoot(element);
    }


    /**
     * Renders checkbox element and add 'change' event hanlder.
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, label e.t.c)
     */
    renderInput(elementName, elementObject){
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
            input.value = elementObject.defaultValue;

        // this.states[elementName] = elementObject.defaultValue;
        this.states.setState(elementName, elementObject.defaultValue);    

        input.addEventListener('change', event => {
            /**
             * Without these lines, it is allowed to enter into the input line values ​​that clearly exceed 
             * the maximum and minimum values ​​set in the elementObject - this behavior is strange and unacceptable.
             */
            if(Number(input.value) > elementObject.maxValue) input.value = elementObject.maxValue;
            if(Number(input.value) < elementObject.minValue) input.value = elementObject.minValue;

            this.states.setState(elementName, Number(input.value));
        });

        element.appendChild(label);
        element.appendChild(input);

        this.appendToRoot(element);
    }


    /**
     * Renders button, when clicked, returns the time the button was pressed
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, label e.t.c)
     */
    renderButton(elementName, elementObject){
        let element = document.createElement('div');
            element.id = elementName;

        let label = document.createElement('span');
            label.innerHTML = elementObject.label + ': ';

        let button = document.createElement('button');
            button.classList.add('controls__button');
            button.textContent = elementObject.text;

            button.addEventListener('click', () => {
                let timestamp = Date.now();
                this.states.setState(elementName, timestamp);
            });

        element.appendChild(label);
        element.appendChild(button);

        this.appendToRoot(element);
    }


    /**
     * Renders toggle-select list, click activates only one of presets.
     * @param {string} elementName 
     * @param {object} elementObject 
     */
    renderOptionSelector(elementName, elementObject){
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
                button.textContent = optionName;
                button.setAttribute('data-preset-num', i);

            // select by default
            if(i == 0) button.setAttribute('data-selected-option', true);

            button.addEventListener('click', () => {
                // deselecting prev selected buttons INSIDE of this control menu element (element.querySelector)
                let prevSelected = Array.from(element.querySelectorAll('[data-selected-option="true"]'));
                if(prevSelected.length > 0) prevSelected.forEach(button => button.removeAttribute('data-selected-option'));

                // console.log(prevSelected);
                button.setAttribute('data-selected-option', true);
                this.states.setState(elementName, Number(i));    
            });

            optionContainer.appendChild(button);
        });

        this.states.setState(elementName, elementObject.defaultValue);    

        element.appendChild(label);
        element.appendChild(optionContainer);

        this.appendToRoot(element);
    }
}



/**
 * Child class which controls the output of additional data
 */
class UIDisplay{
    #html;
    #elementCSS_SelectorPrefix= 'scene-info__';

    constructor(html){
        this.#html = {
            root: html,
        };

    }


    /**
     * Updates value of target element of display
     * @param {string} elementName - name of element (key of object at UI.display.html)
     * @param {number|string|boolean} newValue 
     */
    updateValue(elementName, newValue){
        this.#html[elementName].innerHTML = newValue;
    }


    /**
     * Resets content of root element of 'controls' HTML Block
     */
    clearRoot(){
        this.#html.root.innerHTML = '';
    }


    /**
     * Appends new ready HTML element to 'Controls' HTML block
     * @param {HTMLElement} child - ref to fullt ready html element
     */
    appendToRoot(child){
        this.#html.root.appendChild(child);
    }


    /**
     * Hides entire HTML block with info
     */
    hide(){
        this.#html.root.parentNode.classList.add('hidden-block');
    }


    /**
     * Unhide entire HTML block with info
     */
    show(){
        this.#html.root.parentNode.classList.remove('hidden-block');
    }

    /**
     * renders an infobox element at HTML info block with given param (elementObject). 
     * @param {string} elementName 
     * @param {object} elementObject 
     */
    renderInfoBox(elementName, elementObject){
        let element = document.createElement('div');
            element.id = this.#elementCSS_SelectorPrefix + elementName;
            // specific class name to css highlighting
            element.classList.add('display-infobox');

        let label = document.createElement('span');
            label.classList.add(
                this.#elementCSS_SelectorPrefix + 'display-infobox-label', 
                this.#elementCSS_SelectorPrefix + 'item-label'
            );
            label.innerHTML = '⇢ ' + elementObject.label;

        let text = document.createElement('div');
            text.innerText = elementObject.text;

        element.appendChild(label);
        element.appendChild(text);

        this.appendToRoot(element);
    }


    /**
     * renders an element at HTML info block with given param (elementObject). 
     * By default, parent UI class uses this method inside its automatic rendering method.
     * @param {string} elementName 
     * @param {object} elementObject 
     */
    render(elementName, elementObject){
        let element = document.createElement('div');
            element.id = this.#elementCSS_SelectorPrefix + elementName;

        let label = document.createElement('span');
            label.classList.add(
                this.#elementCSS_SelectorPrefix + 'display-label', 
                this.#elementCSS_SelectorPrefix + 'item-label'
            );
            label.innerHTML = elementObject.label + ': ';

        let valueContainer = document.createElement('span');
            valueContainer.classList.add(
                this.#elementCSS_SelectorPrefix + 'display-value', 
                this.#elementCSS_SelectorPrefix + 'item-value'
            );
            valueContainer.innerHTML = '<i class="pale">no info</i>';


        element.appendChild(label);
        element.appendChild(valueContainer);

        this.#html[elementName] = valueContainer;

        this.appendToRoot(element);
    }
}