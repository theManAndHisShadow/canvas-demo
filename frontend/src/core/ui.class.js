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

                if(element.type == 'display-item') this.display.renderDisplayItem(key, element);
                if(element.type == 'display-float-tile') this.display.renderDisplayFloatTile(key, element);
                if(element.type == 'display-spacer') this.display.renderSpacer();
                if(element.type == 'display-infobox') this.display.renderInfoBox(key, element);

                if(element.type == 'range-slider') this.controls.renderRangeSlider(key, element);
                if(element.type == 'main-action-button') this.controls.renderMainActionButton(key, element);
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

    // attribute for all rendered controle elements (labels not marked with this attrib)
    #renderedControlElementAttribute = 'data-rendered-control-element';

    // attribute for main action button element
    #mainActionButtonAttribute = 'data-main-action-button';

    constructor(html, states){
        this.#html = {
            root: html,
        }

        this.states = states;

        /**
         * The ability to lock the state of an object allows you to ignore clicks on elements 
         * if you need to freeze the input while some function is running. 
         * 
         * All important click/change event handlers access this property 
         * and are triggered only if the property contains "true".
         */
        this.blocked = false;
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
     * Blocks controls actions triggers and set rendered elements as 'disabled'
     */
    #block() {
        this.blocked = true;
        
        // update visual style of all rendered control elements
        let elements = Array.from(this.#html.root.querySelectorAll(`[${this.#renderedControlElementAttribute}]`));
            elements.forEach(element => {
                if(element.tagName == 'INPUT') {
                    element.setAttribute('disabled', '');
                } else {
                    element.classList.add('disabled');
                }
            });
    }


    /**
     * Unlocks controls actions triggers and set rendered elements as 'disabled'
     */
    #unblock() {
        this.blocked = false;
        
        // update visual style of all rendered control elements
        let elements = Array.from(this.#html.root.querySelectorAll(`[${this.#renderedControlElementAttribute}]`));
            elements.forEach(element => {
                if(element.tagName == 'INPUT') {
                    element.removeAttribute('disabled');
                } else {
                    element.classList.remove('disabled');
                }
            });
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
            checkbox.setAttribute(this.#renderedControlElementAttribute, '');

        this.states.setState(elementName, elementObject.state);

        checkbox.addEventListener('click', event => {
            // update state only when Control UI is not blocked
            if(this.blocked == false) this.states.setState(elementName, checkbox.checked);
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
            input.setAttribute(this.#renderedControlElementAttribute, '');
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

            // update state only when Control UI is not blocked
            if(this.blocked == false) this.states.setState(elementName, Number(input.value));
        });

        element.appendChild(label);
        element.appendChild(input);

        this.appendToRoot(element);
    }

    /**
     * Renders input range element and add 'change' event hanlder.
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, startLabel, endLabel e.t.c)
     */
    renderRangeSlider(elementName, elementObject){
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
            range.setAttribute(this.#renderedControlElementAttribute, '');
            range.checked = elementObject.state;

        let endLabel = document.createElement('span');
            endLabel.innerText = elementObject.endLabel;
            endLabel.classList.add('controls__range-slider-end-label', 'controls__option-label');

        this.states.setState(elementName, elementObject.defaultValue);

        range.addEventListener('mousemove', event => {
            // update state only when Control UI is not blocked
            if(this.blocked == false) {
                range.title = range.value;
                this.states.setState(elementName, range.value);
            }
        });

        element.appendChild(startLabel);
        element.appendChild(range);
        element.appendChild(endLabel);

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
            button.setAttribute(this.#renderedControlElementAttribute, '');
            button.textContent = elementObject.text;

            button.addEventListener('click', () => {
                // update state only when Control UI is not blocked
                if(this.blocked == false) {
                    let timestamp = Date.now();
                    this.states.setState(elementName, timestamp);
                }
            });

        element.appendChild(label);
        element.appendChild(button);

        this.appendToRoot(element);
    }

        /**
     * Renders button, when clicked, returns the time the button was pressed
     * @param {string} elementName - element id
     * @param {object} elementObject - objects with element data (defaultValue, maxValue, state, label e.t.c)
     */
        renderMainActionButton(elementName, elementObject){
            let element = document.createElement('div');
                element.id = elementName;

            let separator = document.createElement('div');
                separator.classList.add('hr-line-separator');
    
            let button = document.createElement('button');
                button.classList.add('controls__main-action-button');
                button.setAttribute(this.#mainActionButtonAttribute, '');
                button.setAttribute(this.#renderedControlElementAttribute, '');
                button.textContent = elementObject.text;
    
                button.addEventListener('click', () => {
                    // update state only when Control UI is not blocked
                    if(this.blocked == false) {
                        let timestamp = Date.now();
                        this.states.setState(elementName, timestamp);
                    }
                });
    
            element.appendChild(separator);
            element.appendChild(button);

            /**
             * Some important notes abot this part of code:
             * It was very important for me not to give direct access to this part of the logic from another part of the code. 
             * Therefore, when it became necessary to block interaction with the scene parameter controls (for example, during the execution of some function), 
             * I solved the problem by creating an auxiliary property "propertyName__status" in the state object.
             * 
             * If the user specifies the need to block the UI control object, then only then is the auxiliary property of the state object created. 
             * It is immediately assigned the status "not-started", after which there is a signature to the changes of the state object...
             */
            if(elementObject.blockControlDuringExecution === true) {
                let mainActionStatusStateName = elementName + '__status';
                this.states.setState(mainActionStatusStateName, 'not-started');

                this.states.subscribe((propertyName, newValue, oldValue) => {
                    if(propertyName == mainActionStatusStateName) {
                        /**
                         *  ...If in another part someone transfers a new state and it is equal to "in-progress", 
                         * then the object will be blocked with all the consequences for processing the clicks and other events.... 
                         */
                        if(newValue == 'in-progress') {
                            this.#block();
                        } else {
                            /**
                             * ...Since we listen to changes through the 'StateManager.subscribe()' on changes, 
                             * then the next state change of status to "successful", "error" and something else 
                             * will cause the unlocking of the entire object and the resumption of work with changes in the scene parameters.
                             */
                            this.#unblock();
                        }
                    }
                });
            }
    
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
                button.setAttribute(this.#renderedControlElementAttribute, '');
                button.textContent = optionName;
                button.setAttribute('data-preset-num', i);

            // select by default
            if(i == 0) button.setAttribute('data-selected-option', true);

            button.addEventListener('click', () => {
                // update state only when Control UI is not blocked
                if(this.blocked == false) {
                    // deselecting prev selected buttons INSIDE of this control menu element (element.querySelector)
                    let prevSelected = Array.from(element.querySelectorAll('[data-selected-option="true"]'));
                    if(prevSelected.length > 0) prevSelected.forEach(button => button.removeAttribute('data-selected-option'));

                    button.setAttribute('data-selected-option', true);
                    this.states.setState(elementName, Number(i));   
                } 
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
    #dynamicllyRenderedAttribute = 'data-dynamiclly-rendered'

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
     * Renders an infobox element at HTML info block with given param (elementObject). 
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
     * Renders string formulas at display as correctly written mathematical formulas.
     * @param {string} formula - formula string form
     * @returns {string} - rendered formula container outer HTML
     */
    renderFormula(formula){
        /**
         * Iternal helper function.
         * @param {number} base - fraction base form (2/3 or 0.6)
         * @returns {string} - html elements string tree (outer html)
         */
        const formatFraction = (inlineFormat, degreeFormat = false, addX = false) => {
            let a = 1, b = 1, sign = '';

            // manual writed fraction
            if(/\//g.test(inlineFormat)) {
                const splitted = inlineFormat.split('/');

                // clear values with {}
                const clear = (stringNum) => {
                    return /(\{|\})/.test(stringNum) ? Math.abs(Number(stringNum.replace(/(\{|\})/gm, ''))) : stringNum;
                }

                sign = /\-/gm.test(splitted[0]) == true ? '-' : '';
                a = clear(splitted[0]);
                b = clear(splitted[1]);
            } else {
                // converted from decimal
                const fraction = decimalToFraction(inlineFormat);
                sign = fraction.denominator < 0 ? '-' : '';
                a = fraction.numerator;
                b = Math.abs(fraction.denominator);
            }
        
            return `
                ${sign ? '<span>' + sign + '</span>' : ''}
                <div class="math-fraction ${degreeFormat == true ? 'math-fraction--degree-format' : ''}">
                    <div class="math-fraction__numerator">${a}</div>
                    <div class="math-fraction__denominator">${b}</div>
                </div>
                <span class="math-fraction__x-symbol">${addX  == true? 'x' : ''}</span>
            `;
        }

        // Split by math operators and loop through array of groups
        let groups = formula.split(/(?<![\{])([+-])/gm).map(group => { 
                // work with only number + monomial
                if(!/(?<![\{])([+-])/gm.test(group)) {
                    // for group with x-monomials
                    if(/x/gm.test(group)) {
                        // for group with n-power
                        if(/\^/gm.test(group)) {
                            // split to left side and right side
                            let splitted = group.split(/(\^)/);

                            // temp buffer var
                            let buffer = splitted.map((symbol, i) => {
                                if(symbol == '^') {
                                    // left side of n^k
                                    let base = splitted[i - 1].replace('x', '');
                                    let baseNum = base == '-' ? 1 : base == '' ? 1 : base;
                                    
                                    // right side of n^k
                                    let degree = splitted[i + 1];
            
                                    // render left side as fraction if is uses '/' symbol
                                    if(/\//g.test(baseNum)) {
                                       base = formatFraction(baseNum);
                                    }

                                    if(/\//g.test(degree)) {
                                        degree = formatFraction(degree.replace('x', ''), true, true);
                                    }
                                    
                                    // compose
                                    return `<span>${base}${base == 'e' ? '' : 'x'}<sup>${degree}</sup></span>`;
                                }
                            });
        
                            // return as joined string
                            return buffer.join('');

                        // for those groups with just 'x' without power operation
                        } else if(/\/\d{0,}x/g.test(group)) {
                            let fractionWithX = formatFraction(group);

                            return fractionWithX;
                        } else {
                            let num = group.replace('x', '');
                            if(/\//g.test(num)) {
                                num = formatFraction(num);
                            }

                            // if ax = 1x - show only x
                            return num == 1 ? 'x' : num + 'x';
                        }

                    // for those groups with just num symbol
                    } else {
                        return /\//g.test(group) 
                            ? formatFraction(group) 
                            : group == '' ? '' : Number(group);
                    }
                }
                // return MUTATED group
                return group;
            });

        // compose formula back
        formula = groups.join('');

        let formulaContainer = document.createElement('span');
            formulaContainer.innerHTML = formula;
            formulaContainer.classList.add('math-formula');

        return formulaContainer.outerHTML;
    }


    /**
     * Renders a space (empty line).
     * Can be called inside '.dynamicRender()'.
     * @returns {HTMLDivElement}
     */
    renderSpacer() {
        let spacerContainer = document.createElement('div');
        spacerContainer.classList.add('display-spacer');

        this.appendToRoot(spacerContainer);

        return spacerContainer;
    }


    /**
     * Checks is element with given name is exist at display
     * @param {string} elementName 
     * @returns {boolean}
     */
    isExist(elementName) {
        return this.#html[elementName] !== undefined ? true : false;
    }


    /**
     * Draws an element on the user interface display.
     * Can be called inside '.dynamicRender()'.
     * @param {string} elementName - element name
     * @param {object} elementObject - element object
     */
    renderDisplayItem(elementName, elementObject){
        let element = document.createElement('div');
            element.id = this.#elementCSS_SelectorPrefix + elementName;
            element.classList.add('display-item');

        let label = document.createElement('span');
            label.classList.add(
                this.#elementCSS_SelectorPrefix + 'display-label', 
                this.#elementCSS_SelectorPrefix + 'item-label'
            );
            label.innerHTML = elementObject.hideColon  === true ? elementObject.label : elementObject.label + ': ';

        let valueContainer = document.createElement('span');
            valueContainer.classList.add(
                this.#elementCSS_SelectorPrefix + 'display-value', 
                this.#elementCSS_SelectorPrefix + 'item-value'
            );
            valueContainer.innerHTML = elementObject.text ? elementObject.text : '<i class="pale">no info</i>';


        element.appendChild(label);
        element.appendChild(valueContainer);

        this.#html[elementName] = valueContainer;

        this.appendToRoot(element);

        return element;
    }



    /**
     * Draws an float-left element on the user interface display.
     * Can be called inside '.dynamicRender()'.
     * @param {string} elementName - element name
     * @param {object} elementObject - element object
     */
    renderDisplayFloatTile(elementName, elementObject){
        let element = this.renderDisplayItem(elementName, elementObject);
            element.classList.remove('display-item');
            element.classList.add('display-float-tile');

        return element;
    }


    /**
     * Dynamiclly draws an element on UI display, marking it with a special attribute.
     * @param {string} elementName - element name
     * @param {object} elementObject - element object
     */
    dynamicRender(elementName, elementObject){
        let dynamicllyRendered;

        if(elementObject.type == 'display-item') dynamicllyRendered = this.renderDisplayItem(elementName, elementObject);
        if(elementObject.type == 'display-float-tile') dynamicllyRendered = this.renderDisplayFloatTile(elementName, elementObject);
        if(elementObject.type == 'display-spacer') dynamicllyRendered = this.renderSpacer();

        if(dynamicllyRendered) dynamicllyRendered.setAttribute(this.#dynamicllyRenderedAttribute, true);
    }


    /**
     * Removes all elements that has been rendered by '.dynamicRender()' method.
     */
    removeDynamicllyRendered(){
        let targets = Array.from(document.querySelectorAll(`[${this.#dynamicllyRenderedAttribute}]`));

        targets.forEach(element => {
            element.remove();
        });
    }
}