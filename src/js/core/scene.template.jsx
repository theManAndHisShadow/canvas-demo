import React, { useEffect } from "react";

const SceneTemplate = ({ title, code }) => {
    useEffect(() => {
        code();
    }, [code]);

    return (
        <div>
            <h1>{title}</h1>
            <canvas width={600} height={400}></canvas>
        </div>
    );
}

export default SceneTemplate;