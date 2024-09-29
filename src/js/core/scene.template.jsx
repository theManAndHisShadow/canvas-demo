import React, { useEffect } from "react";
import UI from "./ui.class.js";

const SceneTemplate = ({ title, desciption, uiTree, code }) => {
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
                    <div class="wide-block rounded-block block">
                        <h1>{title}</h1>
                        <canvas width={600} height={400}></canvas>
                    </div>
                </div>
            </div>

            <div class="section-block right-section-block">
                <div class="section-block__inner">
                    <div class="medium-block rounded-block block">
                        <h3>Scene info</h3>
                        <div id="scene-info">
                            <div class="display-infobox">
                                <span class="scene-info__display-infobox-label scene-info__item-label">⇢ Description</span>
                                <div>{desciption}</div>
                            </div>
                        </div>
                    </div>
                    <div class="medium-block rounded-block block">
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