class UI {
    constructor({html}){
        // where is ui root node is placed
        this.html = html;

        // storing some pure values for later use inside the SCENE code
        this.states = new StateManager();
    }


    /**
     * Renders checkbox element and add 'change' event hanlder.
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, label e.t.c)
     * @returns {HTMLDivElement} - ready for appending UI element
     */
    #renderCheckbox(elementName, elementObject){
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

        return element;
    }



    /**
     * Renders checkbox element and add 'change' event hanlder.
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, label e.t.c)
     * @returns {HTMLDivElement} - ready for appending UI element
     */
    #renderInput(elementName, elementObject){
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
            this.states.setState(elementName, Number(input.value));
        });

        element.appendChild(label);
        element.appendChild(input);

        return element;
    }


    /**
     * Renders toggle-select list, click activates only one of presets.
     * @param {*} elementName 
     * @param {*} elementObject 
     * @returns 
     */
    #renderPresetPicker(elementName, elementObject){
        let element = document.createElement('div');
            element.id = elementName;

        let label = document.createElement('span');
            label.classList.add('controls__preset-picker-label', 'controls__option-label');
            label.innerText = elementObject.label + ': ';

        let presetsContainer = document.createElement('div');
            presetsContainer.classList.add('controls__buttons-container');

        elementObject.presetNames.forEach((presetName, i) => {
            let button = document.createElement('button');
                button.classList.add('controls__preset-picker-button');
                button.textContent = presetName;
                button.setAttribute('data-preset-num', i);

            // select by default
            if(i == 0) button.setAttribute('data-selected-preset', true)

            button.addEventListener('click', () => {
                // deselecting prev selected buttons
                let prevSelected = Array.from(document.querySelectorAll('[data-selected-preset="true"]'));
                if(prevSelected.length > 0) prevSelected.forEach(button => button.removeAttribute('data-selected-preset'));

                // console.log(prevSelected);
                button.setAttribute('data-selected-preset', true);
                this.states.setState(elementName, Number(i));    
            });

            presetsContainer.appendChild(button);
        });

        this.states.setState(elementName, elementObject.defaultValue);    

        element.appendChild(label);
        element.appendChild(presetsContainer);

        return element;
    }


    /**
     * Renders ui structure tree to ready html ui elements
     * @param {object} uiStructureTree 
     */
    render(uiStructureTree){
        if(uiStructureTree){
            // reset inner of #controls container of UI
            this.html.innerHTML = '';

            let keys = Object.keys(uiStructureTree);
            for(let key of keys) {
                let element = uiStructureTree[key];

                if(element.type == 'checkbox') element = this.#renderCheckbox(key, element);
                if(element.type == 'input') element = this.#renderInput(key, element);
                if(element.type == 'preset-picker') element = this.#renderPresetPicker(key, element);

                if(element.constructor.name.match('HTML')) {
                    // add new element to ui root element
                    this.html.appendChild(element);
                }
            }
        }
    }
}