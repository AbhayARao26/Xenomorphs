import React from 'react';
import * as THREE from 'three';
import {
    useToggleStates,
    handleWireframeToggle,
    handleTransparentToggle,
    handleDepthWriteToggle,
    handleAlphaHashToggle,
    handleDepthTestToggle,
    handleFlatShadingToggle,
    handleVertexColorsToggle,
    handleMaterialChange,
    handleOpacityChange,
    handleSideChange
} from './MaterialsPanelToggles.jsx';
import "/src/stylesheets/materialsPanel.css";
import wireframeActiveIcon from '/src/assets/cssIcons/wireframeActive.svg';
import wireframeInactiveIcon from '/src/assets/cssIcons/wireframeInactive.svg';
import transparencyActiveIcon from '/src/assets/cssIcons/transparencyActive.svg';
import transparencyInactiveIcon from '/src/assets/cssIcons/transparencyInactive.svg';
import depthWriteActiveIcon from '/src/assets/cssIcons/depthWriteActive.svg';
import depthWriteInactiveIcon from '/src/assets/cssIcons/depthWriteInactive.svg';
import alphaHashActiveIcon from '/src/assets/cssIcons/alphaTestActive.svg';
import alphaHashInactiveIcon from '/src/assets/cssIcons/alphaTestInactive.svg';
import depthTestActiveIcon from '/src/assets/cssIcons/depthTestActive.svg';
import depthTestInactiveIcon from '/src/assets/cssIcons/depthTestInactive.svg';
import flatShadingActiveIcon from '/src/assets/cssIcons/flatShadingActive.svg';
import flatShadingInactiveIcon from '/src/assets/cssIcons/flatShadingInactive.svg';
import vertexColorsActiveIcon from '/src/assets/cssIcons/vertexColoursActive.svg';
import vertexColorsInactiveIcon from '/src/assets/cssIcons/vertexColoursInactive.svg';

function MaterialsPanel({
                       object,
                       onColorChange,
                       onMaterialChange,
                       onWireframeToggle,
                       onTransparentToggle,
                       onOpacityChange,
                       onDepthTestToggle,
                       onDepthWriteToggle,
                       onAlphaHashToggle,
                       onFlatShadingToggle,
                       onSideChange,
                       onVertexColorsToggle,
                   }) {
    if (!object) return <div>No Object Selected</div>;

    const { material } = object;
    const materialTypes = [
        'MeshBasicMaterial',
        'MeshLambertMaterial',
        'MeshPhongMaterial',
        'MeshStandardMaterial',
        'MeshNormalMaterial',
        'MeshPhysicalMaterial',
        'MeshToonMaterial',
        'MeshMatcapMaterial'
    ];
    const sideOptions = [
        { label: 'Front Side', value: THREE.FrontSide },
        { label: 'Back Side', value: THREE.BackSide },
        { label: 'Double Side', value: THREE.DoubleSide },
    ];
    // Collection of type values for different material properties

    const {
        isWireframeActive, setIsWireframeActive,
        isTransparentActive, setIsTransparentActive,
        isDepthWriteActive, setIsDepthWriteActive,
        isAlphaHashActive, setIsAlphaHashActive,
        isDepthTestActive, setIsDepthTestActive,
        isFlatShadingActive, setIsFlatShadingActive,
        isVertexColorsActive, setIsVertexColorsActive
    } = useToggleStates(material);

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    // UI Components to return
    return (
        <div className="info-panel" onClick={stopPropagation}>
            <div className="infoPanelTitle">Materials Panel</div>
            <div className="info-outline">
                <div className="meshBasicInfo">
                    <div className="infoRow">
                        <p><strong>NAME</strong></p>
                        <p>{object.name || 'Unnamed'}</p>
                    </div>
                    <div className="infoRow">
                        <p><strong>TYPE</strong></p>
                        <p>{object.geometry.type}</p>
                    </div>
                    <div className="infoRow">
                        <p><strong>MATERIAL</strong></p>
                        <p>{object.material.type}</p>
                    </div>
                </div>
                {material && (
                    <div>
                        <label className="infoPanelLabels">COLOR</label>
                        <input
                            type="color"
                            value={`#${material.color ? material.color.getHexString() : 'ffffff'}`}
                            onChange={(e) => onColorChange(object, e.target.value)}
                        />
                    </div>
                )}
                <div>
                    <label className="infoPanelLabels">MATERIAL</label>
                    <details className="custom-select">
                        <summary className="radios">
                            {materialTypes.map((type, index) => (
                                <input
                                    type="radio"
                                    name="material"
                                    id={`material${index}`}
                                    title={type}
                                    key={type}
                                    checked={material.type === type}
                                    onChange={() => handleMaterialChange(object, type, onMaterialChange)}
                                />
                            ))}
                        </summary>
                        <ul className="list">
                            {materialTypes.map((type, index) => (
                                <li key={type}>
                                    <label htmlFor={`material${index}`}>
                                        {type}
                                        <span></span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </details>
                </div>
            </div>
            <div className="controls-outline">
                <div className="toggle-buttons-container">
                    <div className="toggle-buttons-and-opacity">
                        <div className="toggleButtonClass">
                            <button
                                className={`wireframe-toggle ${isWireframeActive ? 'active' : ''}`}
                                onClick={() => handleWireframeToggle(object, isWireframeActive, setIsWireframeActive, onWireframeToggle)}
                            >
                                <img src={isWireframeActive ? wireframeActiveIcon : wireframeInactiveIcon} alt="Wireframe"/>
                            </button>
                            <div className="toggle-label">Wireframe</div>
                        </div>
                        <div className="toggleButtonClass">
                            <button
                                className={`transparent-toggle ${isTransparentActive ? 'active' : ''}`}
                                onClick={() => handleTransparentToggle(object, isTransparentActive, setIsTransparentActive, onTransparentToggle)}
                            >
                                <img src={isTransparentActive ? transparencyActiveIcon : transparencyInactiveIcon}
                                     alt="Transparent"/>
                            </button>
                            <div className="toggle-label">Transparent</div>
                        </div>
                        <div className={`opacityControllerClass ${isTransparentActive ? '' : 'inactive'}`}>
                            <div className="opacity-slider">
                                <div className="opacity-slider-wrapper">
                                    <input
                                        type="range"
                                        className="slider"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={material.opacity}
                                        onChange={(e) => handleOpacityChange(object, parseFloat(e.target.value), onOpacityChange)}
                                        disabled={!isTransparentActive}
                                    />
                                </div>
                                <div className="opacity-label-wrapper">
                                    <label className="toggle-label">Opacity</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="toggle-buttons">
                        <div className="toggleButtonClass">
                            <button
                                className={`depthwrite-toggle ${isDepthWriteActive ? 'active' : ''}`}
                                onClick={() => handleDepthWriteToggle(object, isDepthWriteActive, setIsDepthWriteActive, onDepthWriteToggle)}
                            >
                                <img src={isDepthWriteActive ? depthWriteActiveIcon : depthWriteInactiveIcon}
                                     alt="Depth Write"/>
                            </button>
                            <div className="toggle-label">Depth Write</div>
                        </div>
                        <div className="toggleButtonClass">
                            <button
                                className={`alphahash-toggle ${isAlphaHashActive ? 'active' : ''}`}
                                onClick={() => handleAlphaHashToggle(object, isAlphaHashActive, setIsAlphaHashActive, onAlphaHashToggle)}
                            >
                                <img src={isAlphaHashActive ? alphaHashActiveIcon : alphaHashInactiveIcon}
                                     alt="Alpha Hash"/>
                            </button>
                            <div className="toggle-label">Alpha Hash</div>
                        </div>
                        <div className="toggleButtonClass">
                            <button
                                className={`depthtest-toggle ${isDepthTestActive ? 'active' : ''}`}
                                onClick={() => handleDepthTestToggle(object, isDepthTestActive, setIsDepthTestActive, onDepthTestToggle)}
                            >
                                <img src={isDepthTestActive ? depthTestActiveIcon : depthTestInactiveIcon}
                                     alt="Depth Test"/>
                            </button>
                            <div className="toggle-label">Depth Test</div>
                        </div>
                        <div className="toggleButtonClass">
                            <button
                                className={`flatshading-toggle ${isFlatShadingActive ? 'active' : ''}`}
                                onClick={() => handleFlatShadingToggle(object, isFlatShadingActive, setIsFlatShadingActive, onFlatShadingToggle)}
                            >
                                <img src={isFlatShadingActive ? flatShadingActiveIcon : flatShadingInactiveIcon}
                                     alt="Flat Shading"/>
                            </button>
                            <div className="toggle-label">Flat Shading</div>
                        </div>
                    </div>
                    <div className="toggle-buttons">
                        <div className="toggleButtonClass">
                            <button
                                className={`vertexcolors-toggle ${isVertexColorsActive ? 'active' : ''}`}
                                onClick={() => handleVertexColorsToggle(object, isVertexColorsActive, setIsVertexColorsActive, onVertexColorsToggle)}
                            >
                                <img src={isVertexColorsActive ? vertexColorsActiveIcon : vertexColorsInactiveIcon}
                                     alt="Vertex Colors"/>
                            </button>
                            <div className="toggle-label">Vertex Colors</div>
                        </div>
                        <div className="custom-select-container">
                            <label>Side</label>
                            <details className="custom-select wide">
                                <summary className="radios">
                                    {sideOptions.map((option, index) => (
                                        <input
                                            type="radio"
                                            name="side"
                                            id={`side${index}`}
                                            title={option.label}
                                            key={option.value}
                                            checked={material.side === option.value}
                                            onChange={() => handleSideChange(object, option.value, onSideChange)}
                                        />
                                    ))}
                                </summary>
                                <ul className="list">
                                    {sideOptions.map((option, index) => (
                                        <li key={option.value}>
                                            <label htmlFor={`side${index}`}>
                                                {option.label}
                                                <span></span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MaterialsPanel;
