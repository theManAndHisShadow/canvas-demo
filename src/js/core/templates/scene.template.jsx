import React, { useEffect } from "react";
import UI from "../classes/UI/ui.class.js";

const SceneTemplate = ({ title, description, tags, uiTree, setDescription, setTags, code }) => {
    useEffect(() => {
        setDescription(description);
        setTags(tags);

        // N.B.: A temporary solution is to integrate the old class with the new react component.
        const sceneUI = new UI({
            timestamp: Date.now(),
            HUD: document.querySelector('#HUD div'),
            outputDisplay: document.querySelector('#scene-info'),
            controlPanel: document.querySelector('#controls'),
        });

        // render UI using uiTree from component param
        sceneUI.render(uiTree);

        // give access to 'display ui' and 'contrls ui' from code
        code(sceneUI.HUD, sceneUI.outputDisplay, sceneUI.states);
    }, [setDescription, setTags, code]);

    return (
        <div className="wide-block block">
            <h2>{title}</h2>
            <div id="HUD">
                <h4>[HUD]</h4>
                <div></div>
            </div>
            <canvas width={600} height={400}></canvas>
        </div>
    );
}

export default SceneTemplate;