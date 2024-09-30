import React, { Suspense }from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';

const ConcentricCirclesScene = React.lazy(() => import('./scenes/concentric-circles/scene.jsx'));
const ColorPickerScene = React.lazy(() => import('./scenes/color-picker/scene.jsx'));
const StaticGradientScene = React.lazy(() => import('./scenes/static-gradients/scene.jsx'));
const SpinningGearsScene = React.lazy(() => import('./scenes/spinning-gears/scene.jsx'));
const CartesianPlaneScene = React.lazy(() => import('./scenes/cartesian-plane/scene.jsx'));
const CycloidMotionScene = React.lazy(() => import('./scenes/cycloid-motion/scene.jsx'));

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
                            <div class="mini-block block">
                                <h3>Navigation</h3>
                                <nav>
                                    <ul>
                                        <li><Link to="/concentric-circles">concentric-circles</Link></li>
                                        <li><Link to="/color-picker">color-picker</Link></li>
                                        <li><Link to="/static-gradients">static-gradients</Link></li>
                                        <li><Link to="/spinning-gears">spinning-gears</Link></li>
                                        <li><Link to="/cartesian-plane">cartesian-plane</Link></li>
                                        <li><Link to="/cycloid-motion">cycloid-motion</Link></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <Suspense fallback={<div>Loading scene...</div>}>
                        <Routes>
                            <Route path="/concentric-circles" element={<ConcentricCirclesScene />} />
                            <Route path="/color-picker" element={<ColorPickerScene />} />
                            <Route path="/static-gradients" element={<StaticGradientScene />} />
                            <Route path="/spinning-gears" element={<SpinningGearsScene />} />
                            <Route path="/cartesian-plane" element={<CartesianPlaneScene />} />
                            <Route path="/cycloid-motion" element={<CycloidMotionScene />} />
                        </Routes>
                    </Suspense>
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