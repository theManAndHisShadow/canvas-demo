import { StateManager } from "../states.class.js";
import SyntheticEventTarget from "../synthetic_event_target.class.js";
import UI_HUD from "./ui_hud.class.js";
import UI_OutputPanel from "./ui_output_panel.class.js";
import UI_ControlPanel from "./ui_control_panel.class.js";

/**
 * Parent class that manages work of UI_ControlPanel and UI_OutputPanel classes. Also stores StateManager of UI.
 */
export default class UI extends SyntheticEventTarget {
    constructor({HUD, outputPanel, controlPanel, timestamp}){
        super();

        this.currentSceneTimestamp = timestamp;

        // storing some pure values for later use inside the SCENE code
        this.states = new StateManager();

        // where is ui root node is placed
        this.HUD = new UI_HUD(HUD);
        this.outputPanel = new UI_OutputPanel(outputPanel), 
        this.controlPanel = new UI_ControlPanel(controlPanel, this);
    }


    /**
     * Renders ui structure tree to ready html ui elements
     * @param {object} uiStructureTree 
     */
    render(uiStructureTree){
        if(uiStructureTree){
            // reset inner of root element
            this.outputPanel.clearRoot();
            this.controlPanel.clearRoot();

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

                if(element.type == 'range-slider') this.controlPanel.renderRangeSlider(key, element);
                if(element.type == 'main-action-button') this.controlPanel.renderMainActionButton(key, element);
                if(element.type == 'button') this.controlPanel.renderButton(key, element);
                if(element.type == 'checkbox') this.controlPanel.renderCheckbox(key, element);
                if(element.type == 'input') this.controlPanel.renderInput(key, element);
                if(element.type == 'option-selector') this.controlPanel.renderOptionSelector(key, element);

                /**
                 * The difference between 'UI_ControlPanel.renderOptionDropdownList()' and 'UI_ControlPanel.renderPresetDropdownList()' is that:
                 * -> 'UI_ControlPanel.renderOptionDropdownList()' is simply a drop-down list with values ​​that define scene details, 
                 * -> while 'UI_ControlPanel.renderPresetDropdownList()' in turn affects the scene controls elements globally.
                 * 
                 * 'UI_ControlPanel.renderPresetDropdownList()' uses the code base of 'UI_ControlPanel.renderOptionDropdownList()', extending its behavior.
                 */
                if(element.type == 'option-dropdown-list') this.controlPanel.renderOptionDropdownList(key, element);
                if(element.type == 'preset-dropdown-list') this.controlPanel.renderPresetDropdownList(key, element);

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