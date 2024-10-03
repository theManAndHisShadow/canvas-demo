import { StateManager } from "../states.class.js";

import UI_HUD from "./ui_hud.class.js";
import UI_OutputPanel from "./ui_output_panel.class.js";
import UI_ControlPanel from "./ui_control_panel.class.js";

/**
 * Parent class that manages work of UI_ControlPanel and UI_OutputPanel classes. Also stores StateManager of UI.
 */
export default class UI  {
    constructor({HUD, outputPanel, controlPanel, timestamp}){
        this.currentSceneTimestamp = timestamp;

        // storing some pure values for later use inside the SCENE code
        this.states = new StateManager();

        // where is ui root node is placed
        this.HUD = new UI_HUD(HUD);
        this.outputPanel = new UI_OutputPanel(outputPanel), 
        this.controlPanel = new UI_ControlPanel(controlPanel, this);
    }


    /**
     * Renders ui structure tree to ready html ui elements.
     * UI structure tree example:
     * {
     *    HUD: {...}
     *    outputPanel: {...}
     *    conrtolPanel: {...}
     * }
     * @param {object} uiStructureTree 
     */
    render(uiStructureTree){
        const blocks = ['HUD', 'outputPanel', 'controlPanel'];

        for(let uiBlock of blocks) {
            this[uiBlock].render(uiStructureTree[uiBlock]);
        }
    }
}