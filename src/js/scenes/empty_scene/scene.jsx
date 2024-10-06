
import React from "react";
import SceneTemplate from "../../core/templates/scene.template.jsx";

function EmptyScene({ setDescription, setTags }) {
    return (
        <SceneTemplate
            title="Empty scene"
            description="Empty"
            tags={[]}
            uiTree={{
                HUD: {},
                outputDisplay: {},
                controlPanel: {},
            }}

            code={code}
            setDescription={setDescription}
            setTags={setTags}
        />
    );
}

function code(HUD, outputDisplay, settings) {
    const root = document.querySelector('#root');
    const canvas = root.querySelector('canvas');
    const context = canvas.getContext('2d');

    const width = 600;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;

    // main animating function
    let draw = (method, type) => {
        // ...
    }
}


export default EmptyScene;