import React, { useEffect } from "react";
import UI from "../classes/ui.class.js";

const SceneTemplate = ({ title, description, tags, uiTree, code }) => {
    useEffect(() => {
        // N.B.: A temporary solution is to integrate the old class with the new react component.
        const sceneUI = new UI({
            timestamp: Date.now(),
            display: document.querySelector('#scene-info'),
            controls: document.querySelector('#controls'),
        });

        // render UI using uiTree from component param
        sceneUI.render(uiTree);

        // give access to 'display ui' and 'contrls ui' from code
        code(sceneUI.display, sceneUI.states);
    }, [code]);

    return (
        <div>
            <div class="section-block center-section-block">
                <div class="section-block__inner">
                    <div class="wide-block block">
                        <h2>{title}</h2>
                        <canvas width={600} height={400}></canvas>
                    </div>
                </div>
            </div>

            <div class="section-block right-section-block">
                <div class="section-block__inner">
                <div class="medium-block block separated-block text-block">
                        <h3>Description</h3>
                        <div>{description}</div>
                        <ul class="concepions-tags">
                            {tags.map((tag, index) => (
                                <li key={index}>{tag}</li>
                            ))}
                        </ul>
                    </div>

                    <div class="medium-block block separated-block" style={{display: 'none'}}>
                        <h3>Scene info</h3>
                        <div id="scene-info">
                            <div class="display-infobox">
                                <h4>Description</h4>
                                <div>{description}</div>
                            </div>
                        </div>
                    </div>

                    <div class="medium-block block separated-block">
                        <h3>Controls</h3>
                        <div id="controls">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SceneTemplate;