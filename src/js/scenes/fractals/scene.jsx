
import React from "react";
import SceneTemplate from "../../core/templates/scene.template.jsx";
import { drawRect, getColor } from '../../misc/helpers.js';

import drawSerpinskiFractal from "./collection/serpinski_triangle.fractal.js";
import drawTreeFractal from "./collection/tree.fractal.js";

function FractalsScene({ setDescription, setTags }) {
    return (
        <SceneTemplate
            title="Fractals"
            description="A fractal is a complex geometric shape that can be split into parts, each of which is a reduced-scale copy of the whole, a property known as self-similarity. Fractals are often used to model natural phenomena that exhibit similar patterns at different scales, such as coastlines, snowflakes, and clouds."
            tags={['math', 'geometry', 'art', 'nature']}
            uiTree={{
                HUD: {
                    'itemsRendered': {
                        type: 'item',
                        label: 'Items rendered',
                    },

                    'renderStatus': {
                        type: 'item',
                        label: 'Render status',
                    },
                },

                outputDisplay: {},

                controlPanel: {
                    'preset': {
                        type: 'preset-dropdown-list',
                        label: 'Preset',
                        selectedByDefault: 0,
                        options: [
                            { name: 'Seprinski Triangle', allowedElements: ['depth', 'levelRenderDelay', 'regenerate'] },
                            { name: 'Tree', allowedElements: ['*'] },
                        ],
                    },

                    'levelRenderDelay': {
                        type: 'input',
                        label: 'Level render delay',
                        defaultValue: 300, 
                        minValue: 200,
                        maxValue: 600,
                    },

                    'depth': {
                        type: 'input',
                        label: 'Fractal depth level',
                        defaultValue: 5, 
                        minValue: 1,
                        maxValue: 9,
                    },

                    'angle': {
                        type: 'input',
                        label: 'Branch angle',
                        defaultValue: 15, 
                        minValue: 8,
                        maxValue: 90,
                    },

                    'height': {
                        type: 'input',
                        label: 'Tree height',
                        defaultValue: 80, 
                        minValue: 15,
                        maxValue: 120,
                    },


                    'regenerate': {
                        type: 'main-action-button',
                        text: 'Regenerate fractal',
                    },
                }
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

    let depth = 5;
    let delay = 300;
    let angle = 15;
    let treeHeight = 80;
    let renderIsFinished = false;

    settings.subscribe((key, nveValue, oldValue) => {
        if(key == 'regenerate' && renderIsFinished === true) {
            depth = settings.getState('depth');
            angle = settings.getState('angle');
            treeHeight = settings.getState('height');
            delay = settings.getState('levelRenderDelay');

            draw();
        }
    });

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

        if(settings.getState('preset') == 0) {
            drawSerpinskiFractal(context, {
                cx: centerX, cy: centerY,
                h: 360,b: 450,
                depth: depth, delay: delay,
                borderThickness: 0.5,
    
                onRender: (count) => {
                    renderIsFinished = false;
    
                    HUD.updateValue('itemsRendered', '<i>'+ count +' triangles</i>');
                    HUD.updateValue('renderStatus', '<i style="color: orange">in-process</i>');
                },
    
                onRenderEnd: () => { 
                    renderIsFinished = true;
                    HUD.updateValue('renderStatus', '<i style="color: green">done</i>');
                }
            });
        } else {
            drawTreeFractal(context, {
                startX: centerX,
                startY: centerY + 200, 
                length: 80,
                depth: depth,
                delay: delay,
                length: treeHeight,
                branchAngle: angle,

                onRender: (count) => {
                    renderIsFinished = false;
    
                    HUD.updateValue('itemsRendered', '<i>'+ count +' segments</i>');
                    HUD.updateValue('renderStatus', '<i style="color: orange">in-process</i>');
                },
    
                onRenderEnd: () => { 
                    renderIsFinished = true;
                    HUD.updateValue('renderStatus', '<i style="color: green">done</i>');
                }
            });
        }
    }

    draw();
}


export default FractalsScene;