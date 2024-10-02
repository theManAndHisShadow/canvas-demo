import { StateManager } from "../states.class.js";
import SyntheticEventTarget from "../synthetic_event_target.class.js";
import UI_OutputPanel from "./ui_output_panel.class.js";
import UI_ControlPanel from "./ui_control_panel.class.js";

/**
 * Parent class that manages work of UIControls and UI_OutputPanel classes. Also stores StateManager of UI.
 */
export default class UI extends SyntheticEventTarget {
    constructor({outputPanel, controls, timestamp}){
        super();

        this.currentSceneTimestamp = timestamp;

        // storing some pure values for later use inside the SCENE code
        this.states = new StateManager();

        // where is ui root node is placed
        this.outputPanel = new UI_OutputPanel(outputPanel), 
        this.controls = new UI_ControlPanel(controls, this);
    }


    /**
     * Renders ui structure tree to ready html ui elements
     * @param {object} uiStructureTree 
     */
    render(uiStructureTree){
        if(uiStructureTree){
            // reset inner of #controls container of UI
            this.outputPanel.clearRoot();
            this.controls.clearRoot();

            // present key array as render queue
            let renderQueue = [...Object.keys(uiStructureTree)];

            // render each element using its key
            while(renderQueue.length > 0) {
                // get single elem
                let key = renderQueue.shift();
                let element = uiStructureTree[key];
    
                if(element.type == 'display-item') this.outputPanel.renderDisplayItem(key, element);
                if(element.type == 'display-float-tile') this.outputPanel.renderDisplayFloatTile(key, element);
                if(element.type == 'display-spacer') this.outputPanel.renderSpacer();
                if(element.type == 'display-infobox') this.outputPanel.renderInfoBox(key, element);

                if(element.type == 'range-slider') this.controls.renderRangeSlider(key, element);
                if(element.type == 'main-action-button') this.controls.renderMainActionButton(key, element);
                if(element.type == 'button') this.controls.renderButton(key, element);
                if(element.type == 'checkbox') this.controls.renderCheckbox(key, element);
                if(element.type == 'input') this.controls.renderInput(key, element);
                if(element.type == 'option-selector') this.controls.renderOptionSelector(key, element);

                /**
                 * The difference between 'UIControls.renderOptionDropdownList()' and 'UIControls.renderPresetDropdownList()' is that:
                 * -> 'UIControls.renderOptionDropdownList()' is simply a drop-down list with values ​​that define scene details, 
                 * -> while 'UIControls.renderPresetDropdownList()' in turn affects the scene controls elements globally.
                 * 
                 * 'UIControls.renderPresetDropdownList()' uses the code base of 'UIControls.renderOptionDropdownList()', extending its behavior.
                 */
                if(element.type == 'option-dropdown-list') this.controls.renderOptionDropdownList(key, element);
                if(element.type == 'preset-dropdown-list') this.controls.renderPresetDropdownList(key, element);

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