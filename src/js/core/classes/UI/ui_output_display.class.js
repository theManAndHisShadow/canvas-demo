import UI_BlockPrototype from "./ui_block.prototype_class";

/**
 * Class which controls the output of additional data
 */
export default class UI_OutputPanel extends UI_BlockPrototype {
    #elementCSS_SelectorPrefix = 'scene-info__';
    #dynamicllyRenderedAttribute = 'data-dynamiclly-rendered';

    constructor(htmlRootElementRef) {
        super(htmlRootElementRef);
    }


    /**
     * Renders an infobox element at HTML info block with given param (elementObject).
     * @param {string} elementName
     * @param {object} elementObject
     */
    renderInfoBox(elementName, elementObject) {
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
        this.appendToHTML(elementName, { element, label, value: text });
    }


    /**
     * Renders string formulas at display as correctly written mathematical formulas.
     * @param {string} formula - formula string form
     * @returns {string} - rendered formula container outer HTML
     */
    renderFormula(formula) {
        /**
         * Iternal helper function.
         * @param {number} base - fraction base form (2/3 or 0.6)
         * @returns {string} - html elements string tree (outer html)
         */
        const formatFraction = (inlineFormat, degreeFormat = false, addX = false) => {
            let a = 1, b = 1, sign = '';

            // manual writed fraction
            if (/\//g.test(inlineFormat)) {
                const splitted = inlineFormat.split('/');

                // clear values with {}
                const clear = (stringNum) => {
                    return /(\{|\})/.test(stringNum) ? Math.abs(Number(stringNum.replace(/(\{|\})/gm, ''))) : stringNum;
                };

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
                <span class="math-fraction__x-symbol">${addX == true ? 'x' : ''}</span>
            `;
        };

        // Split by math operators and loop through array of groups
        let groups = formula.split(/(?<![\{])([+-])/gm).map(group => {
            // work with only number + monomial
            if (!/(?<![\{])([+-])/gm.test(group)) {
                // for group with x-monomials
                if (/x/gm.test(group)) {
                    // for group with n-power
                    if (/\^/gm.test(group)) {
                        // split to left side and right side
                        let splitted = group.split(/(\^)/);

                        // temp buffer var
                        let buffer = splitted.map((symbol, i) => {
                            if (symbol == '^') {
                                // left side of n^k
                                let base = splitted[i - 1].replace('x', '');
                                let baseNum = base == '-' ? 1 : base == '' ? 1 : base;

                                // right side of n^k
                                let degree = splitted[i + 1];

                                // render left side as fraction if is uses '/' symbol
                                if (/\//g.test(baseNum)) {
                                    base = formatFraction(baseNum);
                                }

                                if (/\//g.test(degree)) {
                                    degree = formatFraction(degree.replace('x', ''), true, true);
                                }

                                // compose
                                return `<span>${base}${base == 'e' ? '' : 'x'}<sup>${degree}</sup></span>`;
                            }
                        });

                        // return as joined string
                        return buffer.join('');

                        // for those groups with just 'x' without power operation
                    } else if (/\/\d{0,}x/g.test(group)) {
                        let fractionWithX = formatFraction(group);

                        return fractionWithX;
                    } else {
                        let num = group.replace('x', '');
                        if (/\//g.test(num)) {
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

        this.appendToHTML('spacer', { element: spacerContainer, label: spacerContainer, value: null });

        return spacerContainer;
    }


    /**
     * Checks is element with given name is exist at display
     * @param {string} elementName
     * @returns {boolean}
     */
    isExist(elementName) {
        return this.html[elementName] !== undefined ? true : false;
    }


    /**
     * Draws an element item on UI_OutputPanel.
     * Can be called inside '.dynamicRender()'.
     * @param {string} elementName - element name
     * @param {object} elementObject - element object
     */
    renderDisplayItem(elementName, elementObject) {
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



    /**
     * Draws an float-left element on the UI_OutputPanel.
     * Can be called inside '.dynamicRender()'.
     * @param {string} elementName - element name
     * @param {object} elementObject - element object
     */
    renderDisplayFloatTile(elementName, elementObject) {
        let element = this.renderDisplayItem(elementName, elementObject);
        element.classList.remove('display-item');
        element.classList.add('display-float-tile');

        return element;
    }


    /**
     * Dynamiclly draws an element on UI_OutputPanel, marking it with a special attribute.
     * @param {string} elementName - element name
     * @param {object} elementObject - element object
     */
    dynamicRender(elementName, elementObject) {
        let dynamicllyRendered;

        if (elementObject.type == 'display-item') dynamicllyRendered = this.renderDisplayItem(elementName, elementObject);
        if (elementObject.type == 'display-float-tile') dynamicllyRendered = this.renderDisplayFloatTile(elementName, elementObject);
        if (elementObject.type == 'display-spacer') dynamicllyRendered = this.renderSpacer();

        if (dynamicllyRendered) dynamicllyRendered.setAttribute(this.#dynamicllyRenderedAttribute, true);
    }


    /**
     * Removes all elements that has been rendered by '.dynamicRender()' method.
     */
    removeDynamicllyRendered() {
        let targets = Array.from(document.querySelectorAll(`[${this.#dynamicllyRenderedAttribute}]`));

        targets.forEach(element => {
            element.remove();
        });
    }

    render(outputDisplay_uiStructureTree){
        if(outputDisplay_uiStructureTree && Object.keys(outputDisplay_uiStructureTree).length > 0){
            this.unhideWholeBlock();

            // reset inner of root element
            this.clearRoot();

            // present key array as render queue
            let renderQueue = [...Object.keys(outputDisplay_uiStructureTree)];

            // render each element using its key
            while(renderQueue.length > 0) {
                // get single elem
                let key = renderQueue.shift();
                let element = outputDisplay_uiStructureTree[key];
    
                if(element.type == 'display-item') this.renderDisplayItem(key, element);
                if(element.type == 'display-float-tile') this.renderDisplayFloatTile(key, element);
                if(element.type == 'display-spacer') this.renderSpacer();
                if(element.type == 'display-infobox') this.renderInfoBox(key, element);

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
