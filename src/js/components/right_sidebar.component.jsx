import React from "react";

const RightSidebarComponent = ({ description, tags }) => {
    tags = tags || [];

    return (
        <div className="section-block right-section-block">
            <div className="section-block__inner">
                <div id="description" className="medium-block block separated-block text-block">
                    <h3>Description</h3>
                    <div>{description}</div>
                    <ul className="concepions-tags">
                        {tags.map((tag, index) => (
                            <li key={index}>{tag}</li>
                        ))}
                    </ul>
                </div>

                <div className="medium-block block separated-block">
                    <h3>Output display</h3>
                    <div id="scene-info">
                    </div>
                </div>

                <div className="medium-block block separated-block">
                    <h3>Control panel</h3>
                    <div id="controls">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default RightSidebarComponent;