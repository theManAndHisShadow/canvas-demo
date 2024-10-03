import React from "react";

const RightSidebarComponent = ({ description, tags }) => {
    tags = tags || [];

    return (
        <div class="section-block right-section-block">
            <div class="section-block__inner">
                <div id="description" class="medium-block block separated-block text-block">
                    <h3>Description</h3>
                    <div>{description}</div>
                    <ul class="concepions-tags">
                        {tags.map((tag, index) => (
                            <li key={index}>{tag}</li>
                        ))}
                    </ul>
                </div>

                <div class="medium-block block separated-block">
                    <h3>Output</h3>
                    <div id="scene-info">
                    </div>
                </div>

                <div class="medium-block block separated-block">
                    <h3>Control panel</h3>
                    <div id="controls">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightSidebarComponent;