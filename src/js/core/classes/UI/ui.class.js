import { StateManager } from "../states.class.js";

import UI_HUD from "./ui_hud.class.js";
import UI_OutputDisplay from "./ui_output_display.class.js";
import UI_ControlPanel from "./ui_control_panel.class.js";

/**
 * Parent class that manages work of UI_ControlPanel and UI_OutputPanel classes. Also stores StateManager of UI.
 */
export default class UI  {
    constructor({HUD, outputDisplay, controlPanel, timestamp}){
        this.currentSceneTimestamp = timestamp;

        // storing some pure values for later use inside the SCENE code
        this.states = new StateManager();

        // where is ui root node is placed
        this.HUD = new UI_HUD(HUD);
        this.outputDisplay = new UI_OutputDisplay(outputDisplay), 
        this.controlPanel = new UI_ControlPanel(controlPanel, this);
    }


    /**
     * Renders ui structure tree to ready html ui elements.
     * UI structure tree example:
     * {
     *    HUD: {...}
     *    outputDisplay: {...}
     *    conrtolPanel: {...}
     * }
     * @param {object} uiStructureTree 
     */
    render(uiStructureTree){
        const blocks = ['HUD', 'outputDisplay', 'controlPanel'];

        for(let uiBlock of blocks) {
            this[uiBlock].render(uiStructureTree[uiBlock]);
        }
    }
}