import React, { Suspense, useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';

import RightSidebarComponent from './components/right_sidebar.component.jsx';

const WelcomeScene = React.lazy(() => import('./scenes/welcome-scene/scene.jsx'));
const ConcentricCirclesScene = React.lazy(() => import('./scenes/concentric-circles/scene.jsx'));
const ColorPickerScene = React.lazy(() => import('./scenes/color-picker/scene.jsx'));
const StaticGradientScene = React.lazy(() => import('./scenes/static-gradients/scene.jsx'));
const SpinningGearsScene = React.lazy(() => import('./scenes/spinning-gears/scene.jsx'));
const CartesianPlaneScene = React.lazy(() => import('./scenes/cartesian-plane/scene.jsx'));
const CycloidMotionScene = React.lazy(() => import('./scenes/cycloid-motion/scene.jsx'));
const FractalsScene = React.lazy(() => import('./scenes/fractals/scene.jsx'));

function App() {
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');

    const sceneViewerElementRef = useRef(null);
    const [offsetLeft, setOffsetLeft] = useState(0);

    // a trick for aligning the logo to an important element: 
    // - calculate the value of the left indent 
    // - and update the 'offsetLeft' variable
    const updateOffsetLeft = () => {
        if (sceneViewerElementRef.current) {
            const rect = sceneViewerElementRef.current.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            setOffsetLeft(rect.left + scrollLeft + 7);
        }
    };

    // when mounting an element, we immediately update the current value of the indent 
    // and attach update events when the window size changes
    useEffect(() => {
        updateOffsetLeft(); 

        window.addEventListener('resize', updateOffsetLeft); 

        return () => {
            window.removeEventListener('resize', updateOffsetLeft); 
        };
    }, []);


    return (
        <div>
            <header>
                <div className="section-block left-section-block">
                    <div className='header-logo' style={{ left: `${offsetLeft}px` }}>
                        <i className="fa-brands fa-github"></i><Link to="https://github.com">github.com</Link> 
                        <span>/</span>
                        <Link to="https://github.com/theManAndHisShadow">theManAndHisShadow</Link>
                        <span>/</span>
                        <Link to="https://github.com/theManAndHisShadow/canvas-demo">canvas-demo</Link>
                        <span>/</span>
                        <Link to="https://themanandhisshadow.github.io/canvas-demo/index.html">demo</Link>
                    </div>
                </div>
            </header>

            <main>
                <div className="section-block left-section-block">
                    <div className="section-block__inner">
                        <div className='scene-viewer' ref={sceneViewerElementRef}>
                            <div className="list block">
                                <div className='list-title'>
                                    <h3>Navigation</h3>
                                </div>

                                <nav>
                                    <ul>
                                        <li>
                                            <Link to="/concentric-circles">
                                                <i className="fa-solid fa-cube"></i> concentric-circles
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to="/color-picker">
                                                <i className="fa-solid fa-cube"></i> color-picker
                                            </Link>
                                        </li>
                                        
                                        <li>
                                            <Link to="/static-gradients">
                                                <i className="fa-solid fa-cube"></i> static-gradients
                                            </Link>
                                        </li>
                                        
                                        <li>
                                            <Link to="/spinning-gears">
                                                <i className="fa-solid fa-cube"></i> spinning-gears
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to="/cartesian-plane">
                                                <i className="fa-solid fa-cube"></i> cartesian-plane
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to="/cycloid-motion">
                                                <i className="fa-solid fa-cube"></i> cycloid-motion
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to="/fractals">
                                                <i className="fa-solid fa-cube"></i> fractals
                                            </Link>
                                        </li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                    </ul>
                                </nav>
                            </div>

                            <Suspense fallback={<div>Loading scene...</div>}>
                                <Routes>
                                    <Route path="/" element={<WelcomeScene setDescription={setDescription} setTags={setTags} />} />
                                    <Route path="/canvas-demo/index.html" element={<WelcomeScene setDescription={setDescription} setTags={setTags} />} />
                                    <Route path="/concentric-circles" element={<ConcentricCirclesScene setDescription={setDescription} setTags={setTags} />} />
                                    <Route path="/color-picker" element={<ColorPickerScene setDescription={setDescription} setTags={setTags} />} />
                                    <Route path="/static-gradients" element={<StaticGradientScene setDescription={setDescription} setTags={setTags} />} />
                                    <Route path="/spinning-gears" element={<SpinningGearsScene setDescription={setDescription} setTags={setTags} />} />
                                    <Route path="/cartesian-plane" element={<CartesianPlaneScene setDescription={setDescription} setTags={setTags} />} />
                                    <Route path="/cycloid-motion" element={<CycloidMotionScene setDescription={setDescription} setTags={setTags} />} />
                                    <Route path="/fractals" element={<FractalsScene setDescription={setDescription} setTags={setTags} />} />
                                </Routes>
                            </Suspense>
                        </div>
                    </div>
                </div>

                <RightSidebarComponent
                    description={description}
                    tags={tags}
                />
            </main>

            <footer>
                <div id="footer-info" className="centred-text">created in 2024 by  
                     <Link to="https://t.me/kazumov" target="_blank" rel="noopener noreferrer">@kazumov</Link></div>
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