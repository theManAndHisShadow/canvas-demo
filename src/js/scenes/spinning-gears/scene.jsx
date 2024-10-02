
import React from "react";
import SceneTemplate from "../../core/templates/scene.template.jsx";

import { Gear } from "./gear.class.js";
import { translateIndexToLetter, drawRect, drawGrid } from "../../misc/helpers.js";

 
function SpinningGearsScene({ setDescription, setTags }) {
    return (
        <SceneTemplate
            title="Spinning gears"

            description="A visual demonstration of the «gear ratio» principle helps you see with your own eyes how gears with different numbers of teeth interact with each other."
            tags={['gears', 'animation', 'mechanics']}

            uiTree={{
                'description': {
                    type: 'display-infobox',
                    label: 'Description',
                    text: 'A visual demonstration of the «gear ratio» principle helps you see with your own eyes how gears with different numbers of teeth interact with each other.',
                },

                'dev': {
                    type: 'checkbox',
                    label: 'Show dev visual',
                    state: false,
                },

                'rotationSpeed': {
                    type: 'input',
                    label: 'Rotation speed',
                    minValue: 0,
                    maxValue: 100,
                    defaultValue: 5,
                },

                'selectedPreset': {
                    type: 'preset-dropdown-list',
                    label: 'Preset',
                    selectedByDefault: 0,
                    options: [
                        { name: 'Big driver gear', allowedElements: ['*'] },
                        { name: 'Small driver gear', allowedElements: ['*'] },
                        { name: 'Chain of equal gears', allowedElements: ['*'] },
                        { name: 'Chain 1:2:4', allowedElements: ['*'] },
                        { name: 'Smooth increase', allowedElements: ['*'] },
                        { name: 'Planetary gearbox', allowedElements: ['*'] },
                    ],
                },

            }}

            code={code}
            setDescription={setDescription}
            setTags={setTags}
        />
    );
}

function code(outputPanel, settings) {
    // describing main variabless
    const root = document.querySelector('#root');
    const canvas = root.querySelector('canvas'); 
    const context = canvas.getContext('2d');

    const width = 600;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2 + 1;
    const centerY = height / 2 + 0.5;


    /**
     * Preset is a kind of sketch for the future instance of the Gear classresets is some sort of 'skeleton' 
     * This array contains several preset arrays, each nested array stores sketch info for Gear class.
     */
    const presets = [
        // small + big driverr gear
        [
            {
                id: 0,
                role: 'driver',
                cx: centerX + 60,
                cy: centerY,
                r: 170,
                numberOfTeeth: 30,
                tootheHeight: 25,
            },

            {
                id: 1,
                linkedTo: 0,
                cx: centerX - 132,
                cy: centerY - 26,
                r: 40,
                numberOfTeeth: 5,
                tootheHeight: 18,
            }
        ],

        // big + small driver gear
        [
            {
                id: 0,
                role: 'driver',
                cx: centerX - 132,
                cy: centerY - 26,
                r: 40,
                numberOfTeeth: 5,
                tootheHeight: 18,
            },

            {
                id: 1,
                linkedTo: 0,
                cx: centerX + 60,
                cy: centerY,
                r: 170,
                numberOfTeeth: 30,
                tootheHeight: 25,
            },
        ],

        // six same sized gears, one of them is driverr gear
        [
            {
                id: 0,
                role: 'driver',
                cx: centerX + 183,
                cy: centerY,
                r: 40,
                numberOfTeeth: 13,
                tootheHeight: 10,
            },

            {
                id: 1,
                linkedTo: 0,
                angle: -35,
                cx: centerX + 110,
                cy: centerY,
                r: 40,
                numberOfTeeth: 13,
                tootheHeight: 10,
            },

            {
                id: 2,
                linkedTo: 1,
                angle: -56,
                cx: centerX + 37,
                cy: centerY,
                r: 40,
                numberOfTeeth: 13,
                tootheHeight: 10,
            },

            {
                id: 3,
                linkedTo: 2,
                angle: -90,
                cx: centerX - 37,
                cy: centerY,
                r: 40,
                numberOfTeeth: 13,
                tootheHeight: 10,
            },

            {
                id: 4,
                linkedTo: 3,
                angle: -138,
                cx: centerX - 110,
                cy: centerY,
                r: 40,
                numberOfTeeth: 13,
                tootheHeight: 10,
            },


            {
                id: 5,
                linkedTo: 4,
                angle: -173,
                cx: centerX - 183,
                cy: centerY,
                r: 40,
                numberOfTeeth: 13,
                tootheHeight: 10,
            },
        ],

        // three gears 4:2:1

        [
            {
                id: 0,
                role: 'driver',
                cx: centerX + 230,
                cy: centerY,
                r: 40,
                numberOfTeeth: 13,
                tootheHeight: 10,
            },

            {
                id: 1,
                linkedTo: 0,
                angle: -16,
                cx: centerX + 117,
                cy: centerY,
                r: 80,
                numberOfTeeth: 26,
                tootheHeight: 14,
            },

            {
                id: 2,
                linkedTo: 1,
                angle: -32,
                cx: centerX - 112,
                cy: centerY,
                r: 160,
                numberOfTeeth: 52,
                tootheHeight: 14,
            },


        ],

        // test 2
        [
            {
                id: 0,
                role: 'driver',
                cx: centerX + 230,
                cy: centerY,
                r: 40,
                numberOfTeeth: 13,
                tootheHeight: 10,
            },

            {
                id: 1,
                linkedTo: 0,
                angle: 13,
                cx: centerX + 137,
                cy: centerY,
                r: 60,
                numberOfTeeth: 20,
                tootheHeight: 12,
            },

            {
                id: 2,
                linkedTo: 1,
                angle: 7,
                cx: centerX + 6,
                cy: centerY,
                r: 80,
                numberOfTeeth: 28,
                tootheHeight: 12,
            },

            {
                id: 3,
                linkedTo: 2,
                angle: 7,
                cx: centerX - 165,
                cy: centerY,
                r: 100,
                numberOfTeeth: 36,
                tootheHeight: 12,
            },


        ],

        // The planetary gearbox
        [
            {
                id: 0,
                role: 'driver',
                cx: centerX,
                cy: centerY,
                r: 80,
                numberOfTeeth: 28,
                tootheHeight: 13,
            },

            {
                id: 1,
                linkedTo: 0,
                cx: centerX - 98,
                cy: centerY + 73,
                r: 50,
                numberOfTeeth: 15,
                tootheHeight: 14,
            },

            {
                id: 2,
                linkedTo: 0,
                cx: centerX + 99,
                cy: centerY + 72,
                r: 50,
                numberOfTeeth: 15,
                tootheHeight: 14,
            },

            {
                id: 3,
                linkedTo: 0,
                cx: centerX,
                cy: centerY - 122,
                r: 50,
                numberOfTeeth: 15,
                tootheHeight: 14,
            },

            {
                id: 4,
                linkedTo: 0,
                cx: centerX,
                cy: centerY,
                r: 176,
                toothing: 'internal',
                numberOfTeeth: 55, // 55 ok!
                tootheHeight: 14,
            },
        ],
    ];

    // prepare a preset variable to make the active preset globally available...
    // ...in the body of the “code” in the future
    let activePreset = null;

    /**
     * N.B.:
     * I didn’t want to mix the logic of the scene itself with external control elements
     * so I added a little reactivity
     * here we figuratively “subscribe” to changes in the external data source
     * we don’t care what and how the settings object is modified in another part of the project
     * we will simply be notified about a change in the settings object (class UI StatesManager) 
     * and receive the data through callback arg of settings.subscribe().
     */
    settings.subscribe((key, newValue, oldValue) => {
        // Checking what exactly has changed in the settings object
        // if preset is changed
        if (key == 'selectedPreset') {
            // reset 'activePreset'
            activePreset = [];

            outputPanel.removeDynamicllyRendered();

            // going through the presetS array - preset = presets[selected preset's index]
            presets[newValue].forEach((gearObject, i) => {

                // setting gear direction of rotation
                let linkedGear = presets[newValue].find(item => item.id == gearObject.linkedTo);
                gearObject.direction = gearObject.role == 'driver' ? 1 : linkedGear.direction * -1;

                // linking context to gear's objects
                gearObject.renderer = context;

                gearObject.devMode = settings.getState('dev');

                // gearObject.borderColor = settings.getState('dev') === true ? color : gearObject.borderColor;

                /**
                 * Each time we create a new instance of the class, 
                 * this is necessary for isolation between preset changes, 
                 * otherwise some subsequent reactions will be duplicated several times, 
                 * which is unacceptable
                 */
                let gear = new Gear(gearObject);
                let gearLetter = translateIndexToLetter(i, true);
                let gearName = `gear_${gearLetter}`;

                if (presets[newValue].find(gear => gear.toothing == 'internal')) {
                    let localPrefix = gear.toothing == 'external' ?
                        gear.role == 'driver' ? 'sun' : 'planet' : 'ring';

                    outputPanel.dynamicRender(gearName, {
                        type: 'display-item',
                        label: `- ${localPrefix} gear ${gearLetter}${gear.numberOfTeeth}</span>`,
                    });
                } else {
                    outputPanel.dynamicRender(gearName, {
                        type: 'display-item',
                        label: `- ${gear.role} gear ${gearLetter}${gear.numberOfTeeth}</span>`,
                    });
                }

                /**
                 * adding custom event to each gear
                 * this will allow us to record the moment of each complete rotation of the gear
                 * for further output of some interesting statistical information 
                 */
                gear.addEventListener('fullRotation', () => {
                    gear.rotations += 1;

                    outputPanel.updateValue(gearName, `${gear.rotations} revs.`);
                });

                // updating 'activePreset' array
                // It stores already completely finished instances of Gear class.
                activePreset.push(gear);
            });
        }

        if (key == 'dev') {
            activePreset.forEach(gear => {
                return gear.devMode = newValue;
            });
        }
    });

    // Some trick to set first (index 0) preset as default preset
    settings.setState('selectedPreset', 0);
    settings.setState('dev', false);

    // Main function
    let redrawFrame = () => {
        context.clearRect(
            0, 0,
            width,
            height
        );

        // draw background in 'bluepring paper' style
        drawBlueprintBG(context, {
            canvasWidth: width,
            canvasHeight: height,
            devMode: settings.getState('dev'),
        });

        // Make some actions with each gear
        activePreset.forEach((gear, i) => {
            // render each gear
            gear.render();

            // getting delta angle of rotation
            let deltaAngle = settings.getState('rotationSpeed') / 10;

            // getting speed of rotation
            let speed = gear.getRotationSpeed(activePreset);

            gear.rotate(deltaAngle * speed);
        });


        /**
        * Scene file internal classes and helper functions defenitions
        */

        /**
         * Draws a background in 'blueprint' paper style (with grid).
         * @param {CanvasRenderingContext2D} context 
         * @param {number} param.canvasWidth
         * @param {number} param.canvasHeight
         * @param {boolean} param.devMode
         */
        function drawBlueprintBG(context, { canvasWidth, canvasHeight, devMode }) {
            const secodnaryGridCellSize = 25;
            const bluePrintColor = devMode === true ? '#212125' : '#5b55e1';
            const freeBorderSpace = secodnaryGridCellSize;

            // fill bg with color
            // color may change if debug 'devMode' option is enabled
            drawRect(context, {
                x: 0,
                y: 0,
                width: canvasWidth,
                height: canvasHeight,
                fillColor: bluePrintColor,
            });

            // draw secondary background grid
            drawGrid(context, {
                cellSize: secodnaryGridCellSize,
                lineThickness: 0.5,
                lineColor: 'rgba(255, 255, 255, 0.01)',
            });

            // draw primary background grid
            drawGrid(context, {
                cellSize: canvasHeight / 4,
                lineThickness: 1,
                lineColor: 'rgba(255, 255, 255, 0.04)',
            });

            //draw grid top padding
            drawRect(context, {
                x: 0,
                y: 0,
                width: canvasWidth,
                height: freeBorderSpace,
                fillColor: bluePrintColor,
            });

            //draw grid bottom padding
            drawRect(context, {
                x: 0,
                y: canvasHeight - freeBorderSpace + 1,
                width: canvasWidth,
                height: freeBorderSpace,
                fillColor: bluePrintColor,
            });

            //draw grid left padding
            drawRect(context, {
                x: 0,
                y: 0,
                width: freeBorderSpace,
                height: canvasHeight,
                fillColor: bluePrintColor,
            });

            //draw grid right padding
            drawRect(context, {
                x: canvasWidth - freeBorderSpace + 1,
                y: 0,
                width: freeBorderSpace,
                height: canvasHeight,
                fillColor: bluePrintColor,
            });
        }

        requestAnimationFrame(redrawFrame);
    }

    // animate 
    requestAnimationFrame(redrawFrame);
}


export default SpinningGearsScene;