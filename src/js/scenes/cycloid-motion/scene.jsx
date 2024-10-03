
import React from "react";
import SceneTemplate from "../../core/templates/scene.template.jsx";

import Cycloid from './classes/cycloid.class.js';

import { getColor, changeColorOpacity, truncateFloatNum, drawRect} from "../../misc/helpers.js";

function CycloidMotionScene({ setDescription, setTags }) {
    return (
        <SceneTemplate
            title="Cycloid motion"
            description="A cycloid is the curve traced by a point on the circumference of a circle as it rolls along a straight line. The key condition in this motion is that the circle rolls without slipping. A specific example of a cycloid is the epicycloid, where a circle rolls inside a larger circle. An example of an hypocycloid is demonstrated in this interactive scene."
            tags={['geometry', 'math', 'animation']}
            uiTree={{
                HUD: {},
                outputPanel: {
                    'cycloids_info': {
                        type: 'display-item',
                        label: 'Rendered curves',
                    },
                },
                controlPanel: {
                    'preset': {
                        type: 'preset-dropdown-list',
                        label: 'Preset',
                        selectedByDefault: 1,
                        options: [
                            { name: 'Playground', allowedElements: ['*'] },
                            { name: 'Hypocycloid overview', allowedElements: ['speed'] },
                            { name: 'Flat roses curves overview', allowedElements: ['speed'] },
                            { name: 'Spiral', allowedElements: ['speed'] },
                            { name: 'Stars', allowedElements: ['speed'] },
                            { name: 'Astroids', allowedElements: ['speed'] },
                        ],
                    },

                    'externalRadius': {
                        type: 'input',
                        label: 'Radius of external circle',
                        defaultValue: 120, // 150
                        minValue: 60,
                        maxValue: 195,
                    },

                    'internalRadius': {
                        type: 'input',
                        label: 'Radius of inner circle',
                        defaultValue: 30, // 50
                        minValue: 10,
                        maxValue: 100,
                    },

                    'radiusOfTracePoint': {
                        type: 'input',
                        label: 'Radius of trace point',
                        minValue: 3,
                        defaultValue: 30,
                        maxValue: 100,
                    },

                    'traceLength': {
                        type: 'input',
                        label: 'Trace length',
                        minValue: 200,
                        defaultValue: 600,
                        maxValue: 10000,
                    },

                    'speed': {
                        type: 'input',
                        label: 'Speed',
                        minValue: 0,
                        defaultValue: 3,
                        maxValue: 20,
                    },

                    'invertRotationDirection': {
                        type: 'checkbox',
                        label: 'Invert circles rotation dirtection',
                        state: true,
                    },

                    'drawCenterPoint': {
                        type: 'checkbox',
                        label: 'Draw center point',
                        state: true,
                    },

                    'drawRadiusLine': {
                        type: 'checkbox',
                        label: 'Draw radius line',
                        state: true,
                    },
                },
            }}

            code={code}
            setDescription={setDescription}
            setTags={setTags}
        />
    );
}

function code(outputPanel, settings) {
    const root = document.querySelector('#root');
    const canvas = root.querySelector('canvas'); 
    const context = canvas.getContext('2d', { willReadFrequently: true });

    // basic canvas values
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    canvas.width = width;
    canvas.height = height;


    // declaring all constructor interactive param names
    const paramKeyNames = [
        'externalRadius',
        'internalRadius',
        'drawCenterPoint',
        'drawRadiusLine',
        'speed',
        'traceLength',
        'invertRotationDirection',
        'radiusOfTracePoint'
    ];

    // local helper function to fast updating states of params
    const getParamsFromUI = () => {
        return paramKeyNames.reduce((acc, key) => {
            acc[key] = settings.getState(key);
            return acc;
        }, {})
    };

    // get initial param of cycloid
    let speed = settings.getState('speed');
    let traceLength = settings.getState('traceLength');

    // Using a mapping scheme of approximate visual perception of presets, instead of conditional constructions like "if"
    // If you don't need specific parameter adjustments, get the composed rest part of the parameters using '...paramsFromUI'
    // All manual adjustments should be made after receiving the '...paramsFromUI', for their subsequent rewriting default values
    let presets = {
        '0': getPlaygroundPreset(context, centerX, centerY, getParamsFromUI()),
        "1": getHypocycloidOverviewPreset(context, centerX, centerY, getParamsFromUI()),
        "2": getFlatRosesPreset(context, centerX, centerY, getParamsFromUI()),
        '3': getSpiralPreset(context, centerX, centerY, getParamsFromUI()),
        "4": getStarsPreset(context, centerX, centerY, getParamsFromUI()),
        "5": getAstroidsPreset(context, centerX, centerY, getParamsFromUI()),
    }

    // by default - 1
    let currentPresetIndex = 1;
    let preset = presets[currentPresetIndex] || [];
    let renderedCurvesTextInfo = ``;
    settings.subscribe((key, newValue, oldValue) => {
        // update playground cycloid's params using update function
        preset.forEach((cycloid, i) => {
            // 3 - index of playground preset
            if (currentPresetIndex == 0) {
                // update params of playground cycloid from ui
                let updatedParams = getParamsFromUI();

                for (let [key, value] of Object.entries(updatedParams)) {
                    // updating each param using 'key' and 'value'
                    cycloid.update(key, value);
                }
            }

            if (key == 'speed') {
                speed = newValue;
            }
        });

        // if current change is preset switching - update curr preset index and preset ref
        if (key == 'preset' || key == 'internalRadius' || key == 'externalRadius' || key == 'radiusOfTracePoint') {
            currentPresetIndex = settings.getState('preset');
            preset = presets[currentPresetIndex];
            renderedCurvesTextInfo = ``;


            // each time when preset is changed - redraw info about current preset cuves
            preset.forEach((cycloid, i) => {
                // remove '.000' in float nums
                let proportion = truncateFloatNum(cycloid.proportion.externalRadius / cycloid.proportion.internalRadius, 3);

                renderedCurvesTextInfo += `
                <br>
                <span class="small-font display-item__list-item">
                    <span 
                        class="small-font gray-word-bubble" 
                        style="color: ${cycloid.traceColor}; background: ${changeColorOpacity(cycloid.traceColor, 0.25)};"
                    >${cycloid.label} #${i + 1}</span><span> - R/r = ${proportion}/1, d ${cycloid.proportion.internalRadius == cycloid.proportion.radiusOfTracePoint ? '=' : cycloid.proportion.radiusOfTracePoint > cycloid.proportion.internalRadius ? '>' : '<'} r</span>
                </span>
            `;
            });

            outputPanel.updateValue('cycloids_info', `${renderedCurvesTextInfo}`);
        }
    });


    // Main function
    let redrawFrame = () => {
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
            fillColor: getColor('black', 0.98),
        });

        // process each precet cycloid
        preset.forEach(cycloid => {
            // animate cycloid
            cycloid.animate(speed);

            // draw cycloid each time when frame is updated
            cycloid.render();
        });

        requestAnimationFrame(redrawFrame);
    }

    // animate
    requestAnimationFrame(redrawFrame)

    // some trick to render info about already rendered curves
    settings.setState('preset', settings.getState('preset'));


    function getPlaygroundPreset(context, centerX, centerY, paramsFromUI) {
        return [
            new Cycloid({
                label: 'Custom curve',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                traceColor: getColor('red'),
            }),
        ];
    }

    function getHypocycloidOverviewPreset(context, centerX, centerY, paramsFromUI) {
        return [
            new Cycloid({
                label: 'Deltoid',
                renderer: context,
                cx: centerX - (centerX * (7 / 10)),
                cy: centerY - (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 16.66666666,
                radiusOfTracePoint: 10,
                traceColor: getColor('brightRed'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Deltoid',
                renderer: context,
                cx: centerX - (centerX * (7 / 10)),
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 16.66666666,
                radiusOfTracePoint: 16.66666666,
                traceColor: getColor('deepOrange'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Deltoid',
                renderer: context,
                cx: centerX - (centerX * (7 / 10)),
                cy: centerY + (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 16.66666666,
                radiusOfTracePoint: 31,
                traceColor: getColor('amber'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Astroid',
                renderer: context,
                cx: centerX - (centerX * (2 / 10)) - 10,
                cy: centerY - (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 12.5,
                radiusOfTracePoint: 5,
                traceColor: getColor('green'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Astroid',
                renderer: context,
                cx: centerX - (centerX * (2 / 10)) - 10,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 12.5,
                radiusOfTracePoint: 12.5,
                traceColor: getColor('teal'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Astroid',
                renderer: context,
                cx: centerX - (centerX * (2 / 10)) - 10,
                cy: centerY + (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 12.5,
                radiusOfTracePoint: 25,
                traceColor: getColor('blue'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Pentoid',
                renderer: context,
                cx: centerX + (centerX * (3 / 10)) - 20,
                cy: centerY - (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 10,
                radiusOfTracePoint: 3,
                traceColor: getColor('indigo'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Pentoid',
                renderer: context,
                cx: centerX + (centerX * (3 / 10)) - 20,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 10,
                radiusOfTracePoint: 10,
                traceColor: getColor('deepPurple'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Pentoid',
                renderer: context,
                cx: centerX + (centerX * (3 / 10)) - 20,
                cy: centerY + (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 10,
                radiusOfTracePoint: 20,
                traceColor: getColor('fuchsia'),
                traceThickness: 0.1,
            }),


            new Cycloid({
                label: 'Exoid',
                renderer: context,
                cx: centerX + (centerX * (7 / 10)),
                cy: centerY - (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 8.33333,
                radiusOfTracePoint: 3,
                traceColor: getColor('mediumVioletRed'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Exoid',
                renderer: context,
                cx: centerX + (centerX * (7 / 10)),
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 8.33333,
                radiusOfTracePoint: 8.33333,
                traceColor: getColor('crimson'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Exoid',
                renderer: context,
                cx: centerX + (centerX * (7 / 10)),
                cy: centerY + (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 8.33333,
                radiusOfTracePoint: 18,
                traceColor: getColor('brightRed'),
                traceThickness: 0.1,
            }),
        ];
    }


    function getFlatRosesPreset(context, centerX, centerY, paramsFromUI) {
        return [
            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX - (centerX * (7 / 10)),
                cy: centerY - (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 25,
                radiusOfTracePoint: 25,
                traceColor: getColor('brightRed'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),

            new Cycloid({
                label: 'Cardioid',
                renderer: context,
                cx: centerX - (centerX * (7 / 10)),
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 16.6666666666,
                radiusOfTracePoint: 16.6666666666,
                traceColor: getColor('deepOrange'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),

            new Cycloid({
                label: 'Two leaf rose',
                renderer: context,
                cx: centerX - (centerX * (7 / 10)),
                cy: centerY + (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 12.5,
                radiusOfTracePoint: 12.5,
                traceColor: getColor('amber'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),

            new Cycloid({
                label: 'Three leaf rose',
                renderer: context,
                cx: centerX - (centerX * (2 / 10)) - 10,
                cy: centerY - (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 10,
                radiusOfTracePoint: 6,
                traceColor: getColor('green'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),

            new Cycloid({
                label: 'Three leaf rose',
                renderer: context,
                cx: centerX - (centerX * (2 / 10)) - 10,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 10,
                radiusOfTracePoint: 9.99,
                traceColor: getColor('teal'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),

            new Cycloid({
                label: 'Three leaf rose',
                renderer: context,
                cx: centerX - (centerX * (2 / 10)) - 10,
                cy: centerY + (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 10,
                radiusOfTracePoint: 20,
                traceColor: getColor('blue'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),

            new Cycloid({
                label: 'Four leaf rose',
                renderer: context,
                cx: centerX + (centerX * (3 / 10)) - 20,
                cy: centerY - (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 8.33333,
                radiusOfTracePoint: 3,
                traceColor: getColor('indigo'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),

            new Cycloid({
                label: 'Four leaf rose',
                renderer: context,
                cx: centerX + (centerX * (3 / 10)) - 20,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 8.33333,
                radiusOfTracePoint: 8.33333,
                traceColor: getColor('deepPurple'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),

            new Cycloid({
                label: 'Four leaf rose',
                renderer: context,
                cx: centerX + (centerX * (3 / 10)) - 20,
                cy: centerY + (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 8.33333,
                radiusOfTracePoint: 18,
                traceColor: getColor('fuchsia'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),


            new Cycloid({
                label: 'Five leaf rose',
                renderer: context,
                cx: centerX + (centerX * (7 / 10)),
                cy: centerY - (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 7.142857142857143,
                radiusOfTracePoint: 3,
                traceColor: getColor('mediumVioletRed'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),

            new Cycloid({
                label: 'Five leaf rose',
                renderer: context,
                cx: centerX + (centerX * (7 / 10)),
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 7.142857142857143,
                radiusOfTracePoint: 7.142857142857143,
                traceColor: getColor('crimson'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),

            new Cycloid({
                label: 'Five leaf rose',
                renderer: context,
                cx: centerX + (centerX * (7 / 10)),
                cy: centerY + (centerY * (3 / 5)),
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 7.142857142857143,
                radiusOfTracePoint: 18,
                traceColor: getColor('brightRed'),
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),
        ];
    }

    function getSpiralPreset(context, centerX, centerY, paramsFromUI) {
        return [
            new Cycloid({
                label: 'Spiral curve',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                traceColor: getColor('indigo'),
                externalRadius: 190,
                internalRadius: 95,
                internalInitialAngle: -180,
                internalRotationGain: 1.015,
                radiusOfTracePoint: 95,
                traceLength: 10000,
                traceThickness: 0.1,
                invertRotationDirection: false,
            }),
        ];
    }

    function getStarsPreset(context, centerX, centerY, paramsFromUI) {
        return [
            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX - (centerX / 2),
                cy: centerY - (centerY / 3) - 10,
                ...paramsFromUI,
                externalRadius: 65,
                internalRadius: 16.25,
                radiusOfTracePoint: 16.25,
                traceColor: getColor('yellow'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY - (centerY / 3) - 10,
                ...paramsFromUI,
                externalRadius: 65,
                internalRadius: 26,
                radiusOfTracePoint: 26,
                traceColor: getColor('amber'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX + (centerX / 2),
                cy: centerY - (centerY / 3) - 10,
                ...paramsFromUI,
                externalRadius: 65,
                internalRadius: 27.8571,
                radiusOfTracePoint: 27.8571,
                traceColor: getColor('deepOrange'),
                traceThickness: 0.1,
            }),


            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX - (centerX / 2),
                cy: centerY + (centerY / 3) + 10,
                ...paramsFromUI,
                externalRadius: 65,
                internalRadius: 14.44444444,
                radiusOfTracePoint: 14.44444444,
                traceColor: getColor('indigo'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY + (centerY / 3) + 10,
                ...paramsFromUI,
                externalRadius: 65,
                internalRadius: 20.3125,
                radiusOfTracePoint: 20.3125,
                traceColor: getColor('purple'),
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX + (centerX / 2),
                cy: centerY + (centerY / 3) + 10,
                ...paramsFromUI,
                externalRadius: 65,
                internalRadius: 28.88888888,
                radiusOfTracePoint: 28.88888888,
                traceColor: getColor('brightRed'),
                traceThickness: 0.1,
            }),
        ];
    }

    function getAstroidsPreset(context, centerX, centerY, paramsFromUI) {
        let localColors = [
            "rgba(220, 20, 60, 1.0)",
            "rgba(202, 18, 79, 1.0)",
            "rgba(185, 16, 99, 1.0)",
            "rgba(168, 14, 118, 1.0)",
            "rgba(150, 12, 138, 1.0)",
            "rgba(133, 10, 157, 1.0)",
            "rgba(116, 8, 177, 1.0)",
            "rgba(98, 6, 196, 1.0)",
            "rgba(81, 4, 216, 1.0)",
            "rgba(64, 2, 235, 1.0)",
            "rgba(47, 0, 255, 1.0)"
        ];

        return [
            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 190,
                internalRadius: 47.5,
                radiusOfTracePoint: 47.5,
                externalBorderColor: getColor('white', 0.1),
                internalBorderColor: getColor('white', 0.1),
                traceColor: localColors[0],
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 170,
                internalRadius: 42.5,
                radiusOfTracePoint: 42.5,
                externalBorderColor: getColor('white', 0.1),
                internalBorderColor: getColor('white', 0.1),
                traceColor: localColors[1],
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 150,
                internalRadius: 37.5,
                radiusOfTracePoint: 37.5,
                externalBorderColor: getColor('white', 0.1),
                internalBorderColor: getColor('white', 0.1),
                traceColor: localColors[2],
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 130,
                internalRadius: 32.5,
                radiusOfTracePoint: 32.5,
                externalBorderColor: getColor('white', 0.1),
                internalBorderColor: getColor('white', 0.1),
                traceColor: localColors[3],
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 110,
                internalRadius: 27.5,
                radiusOfTracePoint: 27.5,
                externalBorderColor: getColor('white', 0.1),
                internalBorderColor: getColor('white', 0.1),
                traceColor: localColors[4],
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 90,
                internalRadius: 22.5,
                radiusOfTracePoint: 22.5,
                externalBorderColor: getColor('white', 0.1),
                internalBorderColor: getColor('white', 0.1),
                traceColor: localColors[5],
                traceThickness: 0.1,
            }),
            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 70,
                internalRadius: 17.5,
                radiusOfTracePoint: 17.5,
                externalBorderColor: getColor('white', 0.1),
                internalBorderColor: getColor('white', 0.1),
                traceColor: localColors[6],
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 50,
                internalRadius: 12.5,
                radiusOfTracePoint: 12.5,
                externalBorderColor: getColor('white', 0.1),
                internalBorderColor: getColor('white', 0.1),
                traceColor: localColors[7],
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 30,
                internalRadius: 7.5,
                radiusOfTracePoint: 7.5,
                externalBorderColor: getColor('white', 0.1),
                internalBorderColor: getColor('white', 0.1),
                traceColor: localColors[8],
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 20,
                internalRadius: 5,
                radiusOfTracePoint: 5,
                externalBorderColor: getColor('white', 0.1),
                internalBorderColor: getColor('white', 0.1),
                traceColor: localColors[9],
                traceThickness: 0.1,
            }),

            new Cycloid({
                label: 'Circle',
                renderer: context,
                cx: centerX,
                cy: centerY,
                ...paramsFromUI,
                externalRadius: 10,
                internalRadius: 2.5,
                radiusOfTracePoint: 2.5,
                externalBorderColor: getColor('white', 0.1),
                internalBorderColor: getColor('white', 0.1),
                traceColor: localColors[10],
                traceThickness: 0.1,
            }),
        ];
    }
}


export default CycloidMotionScene;