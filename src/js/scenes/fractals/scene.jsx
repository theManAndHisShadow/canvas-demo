
import React from "react";
import SceneTemplate from "../../core/templates/scene.template.jsx";
import { drawRect, getColor } from '../../misc/helpers.js';
import drawSerpinskiFractal from "./collection/serpinski_triangle.fractal.js";

function FractalsScene({ setDescription, setTags }) {
    return (
        <SceneTemplate
            title="Fractals"
            description="Empty"
            tags={[]}
            uiTree={{
                HUD: {
                    'trianglesRendered': {
                        type: 'item',
                        label: 'Triangles rendered',
                    },

                    'renderStatus': {
                        type: 'item',
                        label: 'Render status',
                    },
                },
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
    let draw = () => {
        context.clearRect(
            0, 0,
            width,
            height
        );

        drawRect(context, {
            x: 0,
            y: 0,
            width: width,
            height: height,
            fillColor: 'rgba(0, 0, 0, 1)',
        });

        drawSerpinskiFractal(context, {
            cx: centerX, cy: centerY,
            h: 360,b: 450,
            depth: 8, delay: 250,
            borderThickness: 0.5,

            onRender: (count) => {
                HUD.updateValue('trianglesRendered', '<i>'+ count +'</i>');
                HUD.updateValue('renderStatus', '<i style="color: orange">in-process</i>');
            },

            onRenderEnd: () => { 
                HUD.updateValue('renderStatus', '<i style="color: green">done</i>');
            }
        });
    }

    draw();
}


export default FractalsScene;