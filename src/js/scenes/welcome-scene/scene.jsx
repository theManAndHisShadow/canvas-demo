
import React, { useEffect } from "react";
import SceneTemplate from "../../core/templates/scene.template.jsx";

import { drawRect, drawText, getRandomNumber } from "../../misc/helpers.js";

function WelcomeScene({ setDescription, setTags }) {
    useEffect(() => {
        let funnyDescriptions = [
            'At the airport they made a mistake and sent the baggage with the description to the South Pole to the penguins 🐧',
            'Mysterious UFO Arrives and Stole Mr. Description for Experiments 🛸',
            'Mr. Description went on a long-awaited vacation to unknown islands 🏝️',
            'Risky Mr. Description will soon land on his parachute 🪂',
            'Who is Mr. Description and why is everyone talking about him? 🕵🏻‍♂️',
            'There is no description here because this is a welcome page. That\'s why I\'m sitting here writing jokes instead 👨🏻‍💻'
        ];

        let description = document.querySelector('#description');
            description.children[1].innerHTML = funnyDescriptions[getRandomNumber(0, funnyDescriptions.length - 1)];
            description.style.borderBottom = 'none';

        let controls = document.querySelector('#controls').parentNode;
            controls.style.display = 'none';

        return () => {
            controls.style.display = 'initial';
            description.style.borderBottom = '1px solid #3d444db3';
        }
    });

    return (
        <SceneTemplate
            title="Welcome to demo scene veiwer!"

            description="Loading..."
            tags={[]}
            
            uiTree={{}}
            
            code={code}
            setDescription={setDescription}
            setTags={setTags}
        />
    );
}

function code(HUD, outputPanel, settings) {
    const root = document.querySelector('#root');
    const canvas = root.querySelector('canvas'); 
    const context = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    const fontSize = 18;

    drawRect(context, {
        x: 0,
        y: 0,
        width: width,
        height: height,
        fillColor: 'rgba(0, 0, 0, 0.12)',
    });

    drawText(context, {
        x: width / 2,
        y: (height / 2),
        text: 'First, select the scene you want from the list on the left.',
        fontSize: fontSize,
        color: 'rgba(255, 255, 255, 0.72)'
    })
}


export default WelcomeScene;