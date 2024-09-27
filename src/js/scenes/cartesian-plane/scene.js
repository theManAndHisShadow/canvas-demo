import { Scene } from "../../core/scene.class";
import { Point } from "./point.class.js";
import { Segment } from "./segment.class.js";
import { Graph } from "./graph.class.js";
import { CartesianPlane } from "./plane.class.js";

let cartesianPlane = new Scene({
    title: 'Cartesian plane demo', 

    ui: {
        'description': {
            type: 'display-infobox',
            label: 'Description',
            text: 'Cartesian coordinate system in a plane is a coordinate system that specifies each point uniquely by a pair of real numbers called coordinates, which are the signed distances to the point from two fixed perpendicular oriented lines, called coordinate lines or coordinate axes.'
        },

        'centerViewAction': {
            type: 'button',
            text: 'reset',
            label: 'Center view',
        },

        'selectedPreset': {
            type: 'preset-dropdown-list',
            label: 'Preset',
            selectedByDefault: 0,
            options: [
                {name: 'Single points', allowedElements: ['*']}, 
                {name: 'Segments', allowedElements: ['*']},
                {name: 'Line', allowedElements: ['*']},
                {name: 'Quadratic parabola', allowedElements: ['*']},
                {name: 'Cubic parabola', allowedElements: ['*']},
                {name: 'Hyperbola', allowedElements: ['*']},
                {name: 'Exponential curve', allowedElements: ['*']},
            ],
        },
    },

    code: (root, display, settings) => {
        // clearing prev created animation threads
        window.runningAnimations.clearQueue(); 
        
        // timestamp to current scene's canvas elem
        const timestamp = Date.now();

        // reset the element state to remove all previously applied event handlers
        let canvas = resetElement(root.querySelector('canvas'), `canvas-${timestamp}`);
        
        // basic canvas values
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        const plane = new CartesianPlane({
            renderer: context,
            cx: width / 2,
            cy: height / 2,

            gridCellSize: 10,
            gridLineColor: 'rgba(35, 35, 35, 0.35)',
            gridLineThickness: 1,
            axisColor: 'white',
            fillColor: 'black',
        });

        plane.render();

        // very important scene var
        let mouseIsDown = false;

        /**
         * We use a separate variable to remember the place where the user pressed the left mouse button, 
         * this will be the starting position of the moving process. When user releases the mouse button we store 'mouseUp' pos
         * and recalculate delta of 'start' and 'stop' position.
         */
        let downPos = { x: 0, y: 0 };
        let deltaPos = { x: 0, y: 0 };
        
        // All redraw and move actions only at 'mouseIsDown' == true and when mouse is moving
        canvas.addEventListener('mousemove', (event) => {
            if (mouseIsDown) {
                let localPos = getMousePos(canvas, event);
        
                deltaPos = {
                    x: localPos.x - downPos.x,
                    y: localPos.y - downPos.y
                };
        
                downPos = localPos;
        
                // move using delta
                plane.move(deltaPos, 1);

                // redraw 
                plane.render();
            }
        });
        
        // Check is mouse clicked
        canvas.addEventListener('mousedown', (event) => {
            // set important value as true
            mouseIsDown = true;
        
            let localPos = getMousePos(canvas, event);
            
            // update scene-global var
            downPos = {
                x: localPos.x,
                y: localPos.y
            };
            
            // update cursor style
            canvas.style.cursor = 'grab';
            setTimeout(() => {
                canvas.style.cursor = 'grabbing';
            }, 120);
        });
        
        // if the user releases the mouse button
        canvas.addEventListener('mouseup', () => {
            // set important var as false
            mouseIsDown = false;
        
            // Update cursor style
            canvas.style.cursor = 'inherit';
        });

        // adding 'redraw' event listener to plane for updating visible area info
        let visibleAreaDisplayElement = ``;
        plane.addEventListener('redraw', () => {
            // format display item element
            visibleAreaDisplayElement = `
                <br/> 
                - x-axis - [${plane.visibleArea.x}], <br/> 
                - y-axis - [${plane.visibleArea.y[0] - 2}, ${plane.visibleArea.y[1]}].
            `;

            // if element already created and existing
            if(display.isExist('visibleArea')) display.updateValue('visibleArea', visibleAreaDisplayElement);
        });

        // renders colored dot label near tile
        const generateColorLabel = (color) => {
            return `
<span style="
    background: ${changeColorOpacity(color, 0.75)}; 
    border: 2px solid ${color}; 
    border-radius: 100%;
    right: 2px;
    width: 8px;
    display: block;
    position: relative;
    height: 8px;
"></span>`
        }

        settings.subscribe((propertyName, newValue, oldValue) => {
            if(propertyName == 'centerViewAction') {
                // reset pos
                plane.moveToOrigin();

                // redraw all
                plane.render();
            }

            if(propertyName == 'selectedPreset') {
                // reset pos
                plane.moveToOrigin();

                // remove all other elements
                plane.clearContent();

                // remove all display elements that generated dynamiclly
                display.removeDynamicllyRendered();

                if(newValue == 0) {
                    // some points set 1
                    let points1 = [
                        new Point('O', 0, 0, 'white' ),

                        new Point("A", 2, 2, getColor("orange"), getColor("red")),
                        new Point("B", -2, 2, getColor("lime"), getColor("green")),
                        new Point("C", -2, -2, getColor("purple"), getColor("deepPurple")),
                        new Point("D", 2, -2, getColor("blue"), getColor("indigo")),
                    ];

                    points1.forEach(point => {
                        plane.add(point);

                        display.dynamicRender(`point${point.label}`, {
                            type: 'display-item',
                            label: `- point <span style="font-weight: bold">${point.label}</span>`,
                            text: `<i style="font-size: 15px">(${point.planeX}, ${point.planeY})</i>`,
                        });
                    });
            
                } else if(newValue == 1) {
                    // some segments
                    const thickness = 1;
                    let array = [
                        new Point('O', 0, 0, 'white'),

                        new Segment(['A', -5.5, 2],  ['B', -1.5, 2], '#ff0000', thickness),
                        new Segment(['B', -1.5, 2],  ['C', 0, 6], '#ff7f00', thickness),
                        new Segment(['C', 0, 6],  ['D', 1.5, 2], '#ffff00', thickness),
                        new Segment(['D', 1.5, 2],  ['E', 5.5, 2], '#7fff00', thickness),
                        new Segment(['E', 5.5, 2],  ['F', 2, 0], 'cyan', thickness),
                        new Segment(['F', 2, 0],  ['G', 3.5, -4], '#007fff', thickness),
                        new Segment(['G', 3.5, -4],  ['H', 0, -2], 'blue', thickness),
                        new Segment(['H', 0, -2],  ['I', -3.5, -4], 'indigo', thickness),
                        new Segment(['I', -3.5, -4],  ['J', -2, 0], 'magenta', thickness),
                        new Segment(['J', -2, 0],  ['A', -5.5, 2], 'crimson', thickness),
                    ];

                    array.forEach(item => {
                        plane.add(item);

                        if(item instanceof Point) {
                            display.dynamicRender(`point${item.label}`, {
                                type: 'display-item',
                                label: `- point <span style="font-weight: bold">${item.label}</span>`,
                                text: `<i style="font-size: 15px">(${item.planeX}, ${item.planeY})</i>`,
                            });
                        } else if(item instanceof Segment){
                            display.dynamicRender(`segment${item.startPoint.label + item.endPoint.label}`, {
                                type: 'display-item',
                                label: `- segment <span style="font-weight: bold; color: black; text-shadow: 0px 0px 3px  ${item.color}; border-radius: 3px;"> ${item.startPoint.label}${item.endPoint.label}</span>`,
                                text: `[ <i style="font-size: 15px">(${item.startPoint.planeX}, ${item.startPoint.planeY}), (${item.endPoint.planeX}, ${item.endPoint.planeY})</i> ]`,
                            });
                        } 
                    });
                } else if(newValue >= 2 && newValue <= 6) {
                    const index = newValue - 2;
                    const functions = [
                        [
                            // some test lienar graphs
                            new Graph('x', getColor('red')),
                            new Graph('-x', getColor('orange')),
                            new Graph('{1/3}x', getColor('green')),
                            new Graph('{-1/3}x', getColor('blue')),
                            new Graph('3x', getColor('indigo')),
                            new Graph('-3x', getColor('purple')),
                        ], 

                        [
                            // quadratic functions
                            new Graph('x^2', getColor('red')),
                            new Graph('-x^2', getColor('purple')),
                            new Graph('1/10x^2', getColor('green')),
                            new Graph('-1/10x^2', getColor('cyan')),
                            new Graph('0.25x^2-5', getColor('orange')),
                            new Graph('-0.25x^2+5', getColor('indigo')),
                        ],

                        [
                            // qubic functions
                            new Graph('1/100x^3', getColor('red')),
                            new Graph('-1/100x^3', getColor('blue')),
                            new Graph('x^3+3x^2-6', getColor('amber')),
                            new Graph('-x^3-3x^2+6', getColor('purple')),
                        ],

                        [
                            // hyperbolic
                            new Graph('1/x', getColor('red')),
                            new Graph('-1/x', getColor('purple')),
                            new Graph('2/x', getColor('amber')),
                            new Graph('-2/x', getColor('teal')),
                            new Graph('3/x', getColor('green')),
                            new Graph('-3/x', getColor('cyan')),
                        ],

                        // Exponential
                        [
                            new Graph('e^x', getColor('red')),
                            new Graph('e^{5/10x}', getColor('amber')),
                            new Graph('e^{3/10x}', getColor('yellow')),
                            new Graph('e^{2/10x}', getColor('green')),
                            new Graph('e^1/10x', getColor('blue')),

                            new Graph('-e^1/10x', getColor('deepPurple')),
                        ],
                    ];

                    console.log(functions[index]);

                    // updating info about current visible area of plane
                    display.dynamicRender('visibleArea', {
                        type: 'display-item',
                        label: 'Current visible area',
                        text: visibleAreaDisplayElement,
                    });

                    display.dynamicRender('spacer', {
                        type: 'display-spacer',
                    });

                    display.dynamicRender('function-list-title', {
                        type: 'display-item',
                        label: 'Function graphs drawn',
                        text: functions[index].length,
                    });

                    // make actions with each graph
                    functions[index].forEach((graph, i) => {
                        plane.add(graph);

                        // show function formula to display UI
                        display.dynamicRender('function-formula-' + i, {
                            type: 'display-float-tile',
                            hideColon: true,
                            label: generateColorLabel(graph.color),
                            text: `ƒ(x) = ${display.renderFormula(graph.formula)};`
                        });
                    });
                } 

                plane.render();
            }
        });


        // Some trick to set first (index 0) preset as default preset
        settings.setState('selectedPreset', 0);
    }
});


// Exproting scene
window.exportedObjects.push(cartesianPlane);