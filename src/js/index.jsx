import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';

import ConcentricCirclesScene from './scenes/concentric-circles/scene.jsx';
import ColorPickerScene from './scenes/color-picker/scene.jsx';

function App() {
    return (
            <div>
                <header>
                    <div class="section-block left-section-block">
                        <div id="logo" class="centred-text">Canvas Demo</div>
                    </div>
                </header>

                <main>
                    <div class="section-block left-section-block">
                        <div class="section-block__inner">
                            <div class="mini-block rounded-block block">
                                <h3>Navigation</h3>
                                <nav>
                                    <ul>
                                        <li><Link to="/concentric-circles">concentric-circles</Link></li>
                                        <li><Link to="/color-picker">color-picker</Link></li>
                                        {/* Deprecated */}
                                        {/* <li><a href="#" data-link-to-demo="cycloid-motion/scene">cycloid-motion</a></li>
                                        <li><a href="#" data-link-to-demo="binary-search/scene">binary-search</a></li>
                                        <li><a href="#" data-link-to-demo="cartesian-plane/scene">cartesian-plane</a></li>
                                        <li><a href="#" data-link-to-demo="static-gradients/scene">static-gradients</a></li>
                                        <li><a href="#" data-link-to-demo="color-picker/scene">color-picker</a></li>
                                        <li><a href="#" data-link-to-demo="spinning-gears/scene">spinning-gears</a></li> */}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div class="section-block center-section-block">
                        <div class="section-block__inner">
                            <div class="wide-block rounded-block block">
                                <div id="root">
                                    <Routes>
                                        <Route path="/concentric-circles" element={<ConcentricCirclesScene/>} />
                                        <Route path="/color-picker" element={<ColorPickerScene/>} />
                                    </Routes>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="section-block right-section-block">
                        <div class="section-block__inner">
                            <div class="medium-block rounded-block block">
                                <h3>Scene info</h3>
                                <div id="scene-info">

                                </div>
                            </div>
                            <div class="medium-block rounded-block block">
                                <h3>Controls</h3>
                                <div id="controls">

                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer>
                    <div id="footer-info" class="centred-text">hobby project 2024</div>
                </footer>
            </div>
    );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);