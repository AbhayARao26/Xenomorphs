import React, { useState, useRef, useEffect } from 'react';
import Joyride from 'react-joyride';
import {Canvas, useThree} from '@react-three/fiber';
import { OrbitControls, Environment, GizmoViewport, GizmoHelper } from '@react-three/drei';
import * as THREE from 'three';
import Model from './components/modelHandler/Model.jsx';
import KeyframesContainer from './components/keyframesContainer/KeyframesContainer.jsx';
import MaterialsPanel from './components/materialsPanel/MaterialsPanel.jsx';
import NavBar from './components/navigationBar/NavBar.jsx';
import './stylesheets/App.css';
import CamerasPanel from './components/cameras/CamerasPanel.jsx'
import './stylesheets/camera.css';
import playImage from './assets/cssIcons/playButtonWhite.png';
import pauseImage from './assets/cssIcons/pauseButtonWhite.png';
import loopActiveImage from './assets/cssIcons/loopActive.png';
import loopInactiveImage from './assets/cssIcons/loopInactive.png';
import GridHelperColored from "./components/modifiedHelpers/GridHelperColored.jsx";
import CameraManager from "./components/cameras/CameraManager.jsx";
import LightsPanel from './components/lights/LightsPanel.jsx';
import { lightNames, activeLight, lightParams } from './atoms.js';
import LightManager from "./components/lights/LightManager.jsx";
import { XR, createXRStore, useXR } from '@react-three/xr'
import { Glasses} from 'lucide-react';
import {
    EnvironmentalEffects,
    EnvironmentalEffectsControls
} from "./components/environmentalEffects/EnvironmentalEffects.jsx";


const store = createXRStore()


// This Code taken from Aadishesh Udupa, Team2JS
function XRSessionListener({ onSessionEnd }) {
    const { session } = useXR();

    useEffect(() => {
        if (session) {
            session.addEventListener('end', onSessionEnd);
        }
        return () => {
            if (session) {
                session.removeEventListener('end', onSessionEnd);
            }
        };
    }, [session, onSessionEnd]);

    return null;
}


function SceneContent({ setCameras, setLights }) {
    const { scene } = useThree();

    useEffect(() => {
        const foundCameras = [];
        const foundLights = {};
        scene.traverse((object) => {
            if (object.isCamera) {
                foundCameras.push(object);
            } else if (object.isLight) {
                foundLights[object.name || `Light${Object.keys(foundLights).length + 1}`] = object;
            }
        });
        setCameras(foundCameras);
        setLights(foundLights);
    }, [scene, setCameras, setLights]);

    return null;
}


export default function App() {
    const [exportTrigger, setExportTrigger] = useState(null);
    // Export Trigger, boolean set to true or false, whenever, we apply for export mechanism through that button

    const [importFile, setImportFile] = useState(null);
    // Import Action Bool state, similar to export one

    const [animationControl, setAnimationControl] = useState('pause');
    // The play and pause button states

    const [loop, setLoop] = useState(false);
    // The loop button state

    const [availableAnimations, setAvailableAnimations] = useState([]);
    // Collection to represent all the set of available animations present within the model

    const [selectedAnimations, setSelectedAnimations] = useState([]);
    // Set of selected animations that I want to preview and see in my scene if I play

    const [customAnimations, setCustomAnimations] = useState({});
    // Appended Keyframed Animations

    const modelRef = useRef(null);
    // Reference that is passed as a forward ref, to the Model.jsx component, to refer to the model. useImperativeHandle is utilised to pass the model to its parent component

    const [selectedObject, setSelectedObject] = useState(null);
    // Selected Object, or rather the mesh which I select to manipulate the meshes. It specifically is for the MaterialsPanel to know the object that is selected

    const [selectedObjectState, setSelectedObjectState] = useState(null);
    // Remember it's just a dummy state to cause re-render. If you see the code, I just change the numerical values over here

    const selectedObjectRef = useRef(null);
    // QUNDERS: Hold the reference of the mesh, without performing re-renders.

    const transformControlRef = useRef();
    // Reference to the current state of Transform Controls. Basically, my TransformControls Tag takes a ref, and this is set as a reference. The mode is appropriately changed over here

    const [openedComponents, setOpenedComponents] = useState([]);
    // State to handle the opened components displayed based on the menu selection

    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, component: null });
    // State to handle context menu visibility and position

    const [tourCompleted, setTourCompleted] = useState(false);
    const [initialOpenedComponents, setInitialOpenedComponents] = useState([]); // Save initial state
    const [isTourRunning, setIsTourRunning] = useState(false); // Track tour status 

    const [steps, setSteps] = useState([
        {
            target: '.canvas-container',
            content: 'This is the 3D canvas where your model is displayed.',
            placement: 'bottom',
        },
        {
            target: '.menu-bar',
            content: 'This is the navigation bar where you can access all the different panels.',
            placement: 'bottom',
            waitFor: '.menu-bar'
        },
        {
            target: '.info-panel-container',
            content: 'This is the materials panel where you can change the material properties of the selected object.',
            placement: 'left',
            waitFor: '.info-panel-container'
        },
        {
            target: '.keyframeBoxStuff',
            content: 'This is the keyframes panel where you can manage animations.',
            placement: 'left',
            waitFor: '.keyframeBoxStuff'
        },
        {
            target: '.cameras-panel',
            content: 'This is the cameras panel where you can manage cameras.',
            placement: 'left',
            waitFor: '.cameras-panel'
        },
        {
            target: '.lights-panel',
            content: 'This is the lights panel where you can manage lights.',
            placement: 'left',
            waitFor: '.lights-panel'
        },
        {
            target: '.effects-panel',
            content: 'This is the effects panel where you can manage environmental effects.',
            placement: 'left',
            waitFor: '.effects-panel'
        }
    ]);


    const handleJoyrideCallback = (data) => {
        const { status, index, type } = data;

        if (status === 'running' && !isTourRunning) {
            // Tour just started
            setInitialOpenedComponents(openedComponents); // Save the currently opened components
            setOpenedComponents(['keyframes', 'materials', 'cameras', 'lights', 'effects']); // Open all panels for the tour
            setIsTourRunning(true);
        }

        if (status === 'finished' || status === 'skipped') {
            // Tour finished or skipped
            setOpenedComponents(initialOpenedComponents); // Restore to the initial state
            setIsTourRunning(false);
        }

        if (status === 'finished' || status === 'skipped') {
            // When the tour is finished or skipped
            console.log("Tour completed or skipped");
            // You can set a state to indicate that the tour is done
            // For example, setting a flag to not show the tour again in the current session:
            setTourCompleted(true);
        }

        if (type === 'step:before') {
            // Handle actions before moving to the next step
            console.log(`Moving to step ${index + 1}`);
        }

        if (type === 'step:after') {
            // Handle actions after completing the current step
            console.log(`Completed step ${index + 1}`);
        }

        if (type === 'error:target_not_found') {
            // Handle cases where the target element for a step is not found
            console.error('Target not found for step:', data);
            // You can choose to skip this step or take some other action
        }
        if (type === 'step:after') {
            // Handle actions after completing the current step
            console.log(`Completed step ${index + 1}`);
        }

        if (type === 'error:target_not_found') {
            // Handle cases where the target element for a step is not found
            console.error('Target not found for step:', data);
            // You can choose to skip this step or take some other action
        }
    };  

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImportFile(file);
        }
    };
    // Setting the imported file, as the first imported file

    const togglePlayPause = () => {
        setAnimationControl((prev) => (prev === 'play' ? 'pause' : 'play'));
    };
    // Toggling play and pause between different values

    const [showTransformControls, setShowTransformControls] = useState(false);


    const handleAnimationSelect = (animationName) => {
        setSelectedAnimations((prev) => {
            // the prev parameter automatically refers to the previous set of values of selectedAnimations. This fat arrow function returns the new set of selected animations
            if (prev.includes(animationName)) {
                return prev.filter((name) => name !== animationName);
            } else {
                return [...prev, animationName];
            }
        });
    };
    // Return back later to comment over here

    const updateSelectedObject = () => {
        setSelectedObjectState((prev) => prev + 1);
    };
    // Remember it's just a dummy function to cause re-render. If you see the code, I just change the numerical values over here

    const handleColorChange = (object, color) => {
        const newMaterial = object.material.clone();
        newMaterial.color.set(color);
        object.material = newMaterial;
        updateSelectedObject();
    };
    // Evident from the code itself

    const handleAddNewAnimation = (newAnimation) => {
        setAvailableAnimations((prev) => [...prev, newAnimation.name]);
        setCustomAnimations((prev) => ({
            ...prev,
            [newAnimation.name]: newAnimation,
        }));
    };
    // Evident from code itself

    useEffect(() => {
        if (selectedObject && selectedObject.material) {
            selectedObjectRef.current = selectedObject;
        }
    }, [selectedObject]);
    // Selected object that can be utilsed by the MaterialsPanel, to modify the selected object


    // Clicked Mesh Handling
    // FEATREQ: Add outlining on selected meshes

    const [lights, setLights] = useState({
        'defaultAmbient': new THREE.AmbientLight(0xffffff, 0.5)
    });

    const handleAddLight = (type) => {
        const newLightName = `Light${Object.keys(lights).length + 1}`;
        let newLight;
        switch(type) {
            case 'point':
                newLight = new THREE.PointLight(0xffffff, 1);
                break;
            case 'spot':
                newLight = new THREE.SpotLight(0xffffff, 1);
                break;
            case 'directional':
                newLight = new THREE.DirectionalLight(0xffffff, 1);
                break;
            case 'ambient':
                newLight = new THREE.AmbientLight(0xffffff, 0.5);
                break;
            default:
                console.warn(`Unknown light type: ${type}`);
                return;
        }
        setLights(prev => ({...prev, [newLightName]: newLight}));
    };
    const [uiVisible, setUiVisible] = useState(true);
    // For the AR UI Hiding part

    const toggleUIVisibility = () => {
        setUiVisible(!uiVisible);
    };

    const [effects, setEffects] = useState({
        bloom: { enabled: false, intensity: 1, luminanceThreshold: 0.9, luminanceSmoothing: 0.025 },
        noise: { enabled: false, opacity: 0.02 },
        vignette: { enabled: false, offset: 0.5, darkness: 0.5 },
        dotScreen: { enabled: false, scale: 1, angle: 5 },
        glitch: { enabled: false, delay: [1.5, 3.5], duration: [0.6, 1.0], strength: [0.3, 1.0] },
        depthOfField: { enabled: false, focusDistance: 0, focalLength: 0.02, bokehScale: 2 },
        smaa: { enabled: false },
        ssao: { enabled: false, radius: 16, intensity: 1, luminanceInfluence: 0.7 },
        hueSaturation: { enabled: false, hue: 0, saturation: 0 },
        brightnessContrast: { enabled: false, brightness: 0, contrast: 0 },
        chromaticAberration: { enabled: false, offset: [0.005, 0.005] },
        fxaa: { enabled: false }
    });

    const [arMode, setArMode] = useState(false);
    const handleMaterialChange = (object, newMaterialType) => {
        let newMaterial;
        switch (newMaterialType) {
            case 'MeshBasicMaterial':
                newMaterial = new THREE.MeshBasicMaterial({ color: object.material.color });
                break;
            case 'MeshLambertMaterial':
                newMaterial = new THREE.MeshLambertMaterial({ color: object.material.color });
                break;
            case 'MeshPhongMaterial':
                newMaterial = new THREE.MeshPhongMaterial({ color: object.material.color });
                break;
            case 'MeshStandardMaterial':
                newMaterial = new THREE.MeshStandardMaterial({ color: object.material.color });
                break;
            case 'MeshNormalMaterial':
                newMaterial = new THREE.MeshNormalMaterial({ color: object.material.color });
                break;
            case 'MeshPhysicalMaterial':
                newMaterial = new THREE.MeshPhysicalMaterial({ color: object.material.color });
                break;
            case 'MeshToonMaterial':
                newMaterial = new THREE.MeshToonMaterial({ color: object.material.color });
                break;
            case 'MeshMatcapMaterial':
                newMaterial = new THREE.MeshMatcapMaterial({ color: object.material.color });
                break;
            default:
                newMaterial = new THREE.MeshBasicMaterial({ color: object.material.color });
        }
        object.material = newMaterial;
        updateSelectedObject();
        // Remember it's just a dummy function to cause re-render. If you see the code, I just change the numerical values over here
    };
    // Evident from code itself

    const handleWireframeToggle = (object) => {
        const newMaterial = object.material.clone();
        newMaterial.wireframe = !newMaterial.wireframe;
        object.material = newMaterial;
        updateSelectedObject();
    };
    // Evident from code itself

    const handleTransparentToggle = (object) => {
        const newMaterial = object.material.clone();
        newMaterial.transparent = !newMaterial.transparent;
        object.material = newMaterial;
        updateSelectedObject();
    };
    // Evident from code itself

    const handleOpacityChange = (object, value) => {
        const newMaterial = object.material.clone();
        newMaterial.opacity = value;
        object.material = newMaterial;
        updateSelectedObject();
    };
    // Evident from code itself

    const handleDepthTestToggle = (object) => {
        const newMaterial = object.material.clone();
        newMaterial.depthTest = !newMaterial.depthTest;
        object.material = newMaterial;
        updateSelectedObject();
    };
    // Evident from code itself

    const handleDepthWriteToggle = (object) => {
        const newMaterial = object.material.clone();
        newMaterial.depthWrite = !newMaterial.depthWrite;
        object.material = newMaterial;
        updateSelectedObject();
    };
    // Evident from code itself

    const handleAlphaHashToggle = (object) => {
        const newMaterial = object.material.clone();
        newMaterial.alphaHash = !newMaterial.alphaHash;
        object.material = newMaterial;
        updateSelectedObject();
    };
    // Evident from code itself

    const handleSideChange = (object, value) => {
        const newMaterial = object.material.clone();
        newMaterial.side = value;
        object.material = newMaterial;
        updateSelectedObject();
    };
    // Evident from code itself

    const handleFlatShadingToggle = (object) => {
        const newMaterial = object.material.clone();
        newMaterial.flatShading = !newMaterial.flatShading;
        newMaterial.needsUpdate = true;
        object.material = newMaterial;
        updateSelectedObject();
    };
    // Evident from code itself

    const handleVertexColorsToggle = (object) => {
        const newMaterial = object.material.clone();
        newMaterial.vertexColors = newMaterial.vertexColors === THREE.NoColors ? THREE.VertexColors : THREE.NoColors;
        newMaterial.needsUpdate = true;
        object.material = newMaterial;
        updateSelectedObject();
    };
    // Evident from code itself

    const handleSizeChange = (object, size) => {
        object.scale.set(size, size, size);
        updateSelectedObject();
    };
    // Evident from code itself

    const handleObjectClick = (mesh) => {
        setSelectedObject(mesh);
        setSelectedObjectState(mesh.uuid);
        setShowTransformControls(true);
    };

    const handleCanvasClick = (event) => {
        // Check if the click is on the canvas and not on a model
        if (event.target === event.currentTarget) {
            setShowTransformControls(false);
        }
    };

    const handleActiveComponentChange = (component) => {
        setOpenedComponents((prev) => {
            if (prev.includes(component)) {
                return prev;
            } else {
                return [...prev, component];
            }
        });
    };
    // Just like selecting animations, it's for selecting the panels that you want to preview



    const handleContextMenu = (event, component) => {
        event.preventDefault();
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            component,
        });
    };
    // Context Menu, that basically, shows, Close this Panel, or some shit like that if you right-click
    const handleCloseComponent = (component) => {
        setOpenedComponents((prev) => prev.filter((comp) => comp !== component));
        setContextMenu({ visible: false, x: 0, y: 0, component: null });
    };
    // Setting the close panel properties. Set

    useEffect(() => {
        const handleClickOutside = () => {
            if (contextMenu.visible) {
                setContextMenu({ visible: false, x: 0, y: 0, component: null });
            }
        };

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenu]);
    // Handle click back if outside

    const handleCaptureInitial=()=>{
        return modelRef.current?.captureTransform()||{position: [0,0,0], scale: [1,1,1], rotation: [0,0,0]};
    }
    const handleCaptureFinal=()=>{
        return modelRef.current?.captureTransform()||{position: [0,0,0], scale: [1,1,1], rotation: [0,0,0]};
    }

    const [cameras, setCameras] = useState({
        'default': new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    });

    const handleCameraLookAt = (cameraName, lookAtPoint) => {
        const camera = cameras[cameraName];
        if (camera && camera.lookAt) {
            camera.lookAt(new THREE.Vector3(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z));
            // You might want to update your global state here
        }
    };
    return (
        <div className="app-container">
            <Joyride
                steps={steps}
                continuous
                scrollToFirstStep
                showSkipButton
                showProgress
                callback={handleJoyrideCallback}
            />
            {uiVisible && (
                <NavBar
                    setActiveComponent={handleActiveComponentChange}
                    handleContextMenu={handleContextMenu}
                    openedComponents={openedComponents}
                    contextMenu={contextMenu}
                    handleCloseComponent={handleCloseComponent}
                    onEnterAR={() => store.enterAR()}
                    toggleUIVisibility={toggleUIVisibility}
                />
            )}
            <div className="canvas-container">
                <Canvas camera={{position: [-8, 5, 8]}} onClick={handleCanvasClick}>
                    <XR store={store}>
                        {/*<Environment files="./src/assets/environments/tableMountSunset.hdr" background />*/}
                        <ambientLight intensity={0.5}/>
                        <directionalLight position={[0, 10, 5]} intensity={1}/>
                        <Model
                            ref={modelRef}
                            setExportTrigger={setExportTrigger}
                            importFile={importFile}
                            animationControl={animationControl}
                            loop={loop}
                            selectedAnimations={selectedAnimations}
                            customAnimations={customAnimations}
                            setAvailableAnimations={setAvailableAnimations}
                            onObjectClick={handleObjectClick}
                            selectedObject={selectedObject}
                            showTransformControls={showTransformControls}
                        />
                        <OrbitControls makeDefault={true}/>
                        <GridHelperColored/>
                        <CameraManager/>
                        <LightManager/>
                        <SceneContent setCameras={setCameras} setLights={setLights}/>
                        <EnvironmentalEffects effects={effects} />
                    </XR>
                </Canvas>
            </div>
            {uiVisible && openedComponents.includes('keyframes') && (
                <KeyframesContainer
                    handleImport={handleImport}
                    exportTrigger={exportTrigger}
                    togglePlayPause={togglePlayPause}
                    animationControl={animationControl}
                    playImage={playImage}
                    pauseImage={pauseImage}
                    loop={loop}
                    setLoop={setLoop}
                    loopActiveImage={loopActiveImage}
                    loopInactiveImage={loopInactiveImage}
                    availableAnimations={availableAnimations}
                    selectedAnimations={selectedAnimations}
                    handleAnimationSelect={handleAnimationSelect}
                    onAddNewAnimation={handleAddNewAnimation}
                    captureFinal={handleCaptureFinal}
                    captureInitial={handleCaptureInitial}
                />
            )}
            {uiVisible && openedComponents.includes('materials') && (
                <div className="info-panel-container">
                    <MaterialsPanel
                        object={selectedObject}
                        onColorChange={handleColorChange}
                        onMaterialChange={handleMaterialChange}
                        onWireframeToggle={handleWireframeToggle}
                        onTransparentToggle={handleTransparentToggle}
                        onOpacityChange={handleOpacityChange}
                        onDepthTestToggle={handleDepthTestToggle}
                        onDepthWriteToggle={handleDepthWriteToggle}
                        onAlphaHashToggle={handleAlphaHashToggle}
                        onSideChange={handleSideChange}
                        onFlatShadingToggle={handleFlatShadingToggle}
                        onVertexColorsToggle={handleVertexColorsToggle}
                        onSizeChange={handleSizeChange}
                    />
                </div>
            )}
            {uiVisible && openedComponents.includes('cameras') && <CamerasPanel cameras={cameras}/>}
            {uiVisible && openedComponents.includes('lights') && <LightsPanel lights={lights} onAddLight={handleAddLight}/>}
            {openedComponents.includes('effects') && (
                <EnvironmentalEffectsControls
                    effects={effects}
                    setEffects={setEffects}
                />
            )}




        </div>
    );
}
