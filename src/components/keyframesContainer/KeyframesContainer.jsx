import React, { useState } from 'react';

const KeyframesContainer = ({
                                handleImport,
                                exportTrigger,
                                togglePlayPause,
                                animationControl,
                                playImage,
                                pauseImage,
                                loop,
                                setLoop,
                                loopActiveImage,
                                loopInactiveImage,
                                availableAnimations,
                                selectedAnimations,
                                handleAnimationSelect,
                                onAddNewAnimation,
    captureFinal, captureInitial
                            }) => {
    // Added Capture Final and Initial to apply animations using transform controls

    const toDegrees = (radians) => radians * (180 / Math.PI);
    // For conversion of units, that the KC Takes


    const handleCaptureInitial=()=>{
        const captured= captureInitial();
        // The callback passed to this component, from App.jsx, which contains, captureTransform from Model.jsx utilsing handleCaptureInitial
        setNewAnimation(prev=>({
            ...prev,
            initialPosition: captured.position,
            initialScale: captured.scale,
            initialRotation: captured.rotation.map(toDegrees)

        }))
    }

    const handleCaptureFinal=()=>{
        const captured= captureFinal();
        // The callback passed to this component, from App.jsx, which contains, captureTransform from Model.jsx utilsing handleCaptureFinal

        setNewAnimation(prev=>({
            ...prev,
            finalPosition: captured.position,
            finalScale: captured.scale,
            finalRotation: captured.rotation.map(toDegrees)

        }))
    }

    const [isExpanded, setIsExpanded] = useState(false);
    const [newAnimation, setNewAnimation] = useState({
        name: '',
        initialPosition: [0, 0, 0],
        initialScale: [1, 1, 1],
        initialRotation: [0, 0, 0],
        finalPosition: [0, 0, 0],
        finalScale: [1, 1, 1],
        finalRotation: [0, 0, 0],
        duration: 5
    });

    const handleInputChange = (e, type, index) => {
        const value = type === 'name' ? e.target.value : parseFloat(e.target.value);
        setNewAnimation(prev => {
            const updated = { ...prev };
            if (type === 'initialPosition' || type === 'initialScale' || type === 'initialRotation' ||
                type === 'finalPosition' || type === 'finalScale' || type === 'finalRotation') {
                updated[type][index] = value;
            } else {
                updated[type] = value;
            }
            return updated;
        });
    };

    const handleAddAnimation = () => {
        onAddNewAnimation(newAnimation);
        setIsExpanded(false);
    };

    return (
        <div className={`input-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div>
                <div className="keyframeTitleStuff">Animations Controllers</div>

                <button className="closeButton" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? 'Close' : 'Add Animation'}
                </button>

                <div className="buttonFunctionalities">
                    <div className="importExportButtons">
                        <input type="file" accept=".glb,.gltf" onChange={handleImport} style={{ display: 'none' }} id="importFileInput" />
                        <button onClick={() => document.getElementById('importFileInput').click()} className="importButton">Import</button>
                        <button className="exportButton" onClick={() => { if (exportTrigger) exportTrigger(); }}>Export</button>
                    </div>
                    <div className="playLoopButtons">
                        <button onClick={togglePlayPause} className="playButton">
                            <img src={animationControl === 'play' ? pauseImage : playImage} alt={animationControl === 'play' ? 'Pause' : 'Play'} style={{ height: '12px' }} />
                        </button>
                        <button onClick={() => setLoop(!loop)} className="loopButton">
                            <img src={loop ? loopActiveImage : loopInactiveImage} alt={loop ? 'Loop: On' : 'Loop: Off'} style={{ width: '18px', height: '18px' }} />
                        </button>
                    </div>
                </div>

                <div className="animation-selector">
                    <div className="animationsListTitle">
                        <span>AVAILABLE ANIMATIONS</span>
                        <div className="image-container">
                            <img src="https://www.svgrepo.com/show/371686/animation.svg" alt="Animation Icon" width="12" height="12" />
                        </div>
                    </div>
                    <div className="animation-list">
                        {availableAnimations.map(animation => (
                            <label key={animation} className="animationsCollection">
                                <input
                                    type="checkbox"
                                    checked={selectedAnimations.includes(animation)}
                                    onChange={() => handleAnimationSelect(animation)}
                                />
                                <span></span> {animation}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="expanded-content">
                    <div className="inputs">
                        <div className="name-and-buttons">
                            <label>
                                ANIMATION NAME:
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newAnimation.name}
                                    onChange={(e) => handleInputChange(e, 'name')}
                                    style={{ width: '230px' }}
                                />
                            </label>
                            <div className="buttons">
                                <button className="addButton" onClick={handleAddAnimation}>Add</button>
                                <button className="cancelAdditionButton" onClick={() => setIsExpanded(false)}>Cancel</button>
                            </div>
                        </div>
                        <div className="input-columns">
                            <div className="input-column">
                                <label>INITIAL POSITION:</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        placeholder="X"
                                        value={newAnimation.initialPosition[0]}
                                        onChange={(e) => handleInputChange(e, 'initialPosition', 0)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Y"
                                        value={newAnimation.initialPosition[1]}
                                        onChange={(e) => handleInputChange(e, 'initialPosition', 1)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Z"
                                        value={newAnimation.initialPosition[2]}
                                        onChange={(e) => handleInputChange(e, 'initialPosition', 2)}
                                    />
                                </div>
                                <label>INITIAL SCALE:</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        placeholder="X"
                                        value={newAnimation.initialScale[0]}
                                        onChange={(e) => handleInputChange(e, 'initialScale', 0)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Y"
                                        value={newAnimation.initialScale[1]}
                                        onChange={(e) => handleInputChange(e, 'initialScale', 1)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Z"
                                        value={newAnimation.initialScale[2]}
                                        onChange={(e) => handleInputChange(e, 'initialScale', 2)}
                                    />
                                </div>
                                <label>INITIAL ROTATION:</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        placeholder="X"
                                        value={newAnimation.initialRotation[0]}
                                        onChange={(e) => handleInputChange(e, 'initialRotation', 0)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Y"
                                        value={newAnimation.initialRotation[1]}
                                        onChange={(e) => handleInputChange(e, 'initialRotation', 1)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Z"
                                        value={newAnimation.initialRotation[2]}
                                        onChange={(e) => handleInputChange(e, 'initialRotation', 2)}
                                    />
                                </div>
                                <button onClick={handleCaptureInitial} className="closeButton">Capture Initial</button>
                            </div>
                            <div className="input-column">
                                <label>FINAL POSITION:</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        placeholder="X"
                                        value={newAnimation.finalPosition[0]}
                                        onChange={(e) => handleInputChange(e, 'finalPosition', 0)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Y"
                                        value={newAnimation.finalPosition[1]}
                                        onChange={(e) => handleInputChange(e, 'finalPosition', 1)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Z"
                                        value={newAnimation.finalPosition[2]}
                                        onChange={(e) => handleInputChange(e, 'finalPosition', 2)}
                                    />
                                </div>
                                <label>FINAL SCALE:</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        placeholder="X"
                                        value={newAnimation.finalScale[0]}
                                        onChange={(e) => handleInputChange(e, 'finalScale', 0)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Y"
                                        value={newAnimation.finalScale[1]}
                                        onChange={(e) => handleInputChange(e, 'finalScale', 1)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Z"
                                        value={newAnimation.finalScale[2]}
                                        onChange={(e) => handleInputChange(e, 'finalScale', 2)}
                                    />
                                </div>
                                <label>FINAL ROTATION:</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        placeholder="X"
                                        value={newAnimation.finalRotation[0]}
                                        onChange={(e) => handleInputChange(e, 'finalRotation', 0)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Y"
                                        value={newAnimation.finalRotation[1]}
                                        onChange={(e) => handleInputChange(e, 'finalRotation', 1)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Z"
                                        value={newAnimation.finalRotation[2]}
                                        onChange={(e) => handleInputChange(e, 'finalRotation', 2)}
                                    />

                                </div>
                                <button onClick={handleCaptureFinal} className="closeButton">Capture Final</button>
                            </div>
                            <div className="input-column">
                                <label>
                                DURATION:
                                    <input
                                        type="number"
                                        placeholder="Duration"
                                        value={newAnimation.duration}
                                        onChange={(e) => handleInputChange(e, 'duration')}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeyframesContainer;
