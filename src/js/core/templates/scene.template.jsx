import React, { useEffect } from "react";
import UI from "../classes/ui.class.js";

import RightSidebarComponent from "../../components/ritght_sidebar.component.jsx";

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

            <RightSidebarComponent
                description={description}
                tags={tags}
            />
        </div>
    );
}

export default SceneTemplate;