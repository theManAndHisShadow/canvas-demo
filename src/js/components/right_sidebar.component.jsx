import React from "react";

const RightSidebarComponent = ({ description, tags }) => {
    tags = tags || [];

    return (
        <div class="section-block right-section-block">
            <div class="section-block__inner">
                <div id="decription" class="medium-block block separated-block text-block">
                    <h3>Description</h3>
                    <div>{description}</div>
                    <ul class="concepions-tags">
                        {tags.map((tag, index) => (
                            <li key={index}>{tag}</li>
                        ))}
                    </ul>
                </div>

                <div class="medium-block block separated-block" style={{ display: 'none' }}>
                    <h3>Scene info</h3>
                    <div id="scene-info">
                        <div class="display-infobox">
                            <h4>Description</h4>
                            <div>{description}</div>
                        </div>
                    </div>
                </div>

                <div class="medium-block block separated-block">
                    <h3>Controls</h3>
                    <div id="controls">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightSidebarComponent;