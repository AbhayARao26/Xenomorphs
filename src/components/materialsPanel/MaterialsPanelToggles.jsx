import { useState } from 'react';
import * as THREE from 'three';

export const useToggleStates = (material) => {
    // Toggle States
    const [isWireframeActive, setIsWireframeActive] = useState(material.wireframe);
    const [isTransparentActive, setIsTransparentActive] = useState(material.transparent);
    const [isDepthWriteActive, setIsDepthWriteActive] = useState(material.depthWrite);
    const [isAlphaHashActive, setIsAlphaHashActive] = useState(material.alphaHash);
    const [isDepthTestActive, setIsDepthTestActive] = useState(material.depthTest);
    const [isFlatShadingActive, setIsFlatShadingActive] = useState(material.flatShading);
    const [isVertexColorsActive, setIsVertexColorsActive] = useState(material.vertexColors !== THREE.NoColors);

    return {
        isWireframeActive, setIsWireframeActive,
        isTransparentActive, setIsTransparentActive,
        isDepthWriteActive, setIsDepthWriteActive,
        isAlphaHashActive, setIsAlphaHashActive,
        isDepthTestActive, setIsDepthTestActive,
        isFlatShadingActive, setIsFlatShadingActive,
        isVertexColorsActive, setIsVertexColorsActive
    };
};

export const handleWireframeToggle = (object, isWireframeActive, setIsWireframeActive, onWireframeToggle) => {
    setIsWireframeActive(!isWireframeActive);
    onWireframeToggle(object);
};
// Toggle Handlers, Self Explanatory



export const handleTransparentToggle = (object, isTransparentActive, setIsTransparentActive, onTransparentToggle) => {
    setIsTransparentActive(!isTransparentActive);
    onTransparentToggle(object);
};
// Toggle Handlers, Self Explanatory



export const handleDepthWriteToggle = (object, isDepthWriteActive, setIsDepthWriteActive, onDepthWriteToggle) => {
    setIsDepthWriteActive(!isDepthWriteActive);
    onDepthWriteToggle(object);
};
// Toggle Handlers, Self Explanatory



export const handleAlphaHashToggle = (object, isAlphaHashActive, setIsAlphaHashActive, onAlphaHashToggle) => {
    setIsAlphaHashActive(!isAlphaHashActive);
    onAlphaHashToggle(object);
};
// Toggle Handlers, Self Explanatory



export const handleDepthTestToggle = (object, isDepthTestActive, setIsDepthTestActive, onDepthTestToggle) => {
    setIsDepthTestActive(!isDepthTestActive);
    onDepthTestToggle(object);
};
// Toggle Handlers, Self Explanatory



export const handleFlatShadingToggle = (object, isFlatShadingActive, setIsFlatShadingActive, onFlatShadingToggle) => {
    setIsFlatShadingActive(!isFlatShadingActive);
    onFlatShadingToggle(object);
};
// Toggle Handlers, Self Explanatory



export const handleVertexColorsToggle = (object, isVertexColorsActive, setIsVertexColorsActive, onVertexColorsToggle) => {
    setIsVertexColorsActive(!isVertexColorsActive);
    onVertexColorsToggle(object);
};
// Toggle Handlers, Self Explanatory



export const handleMaterialChange = (object, newMaterialType, onMaterialChange) => {
    onMaterialChange(object, newMaterialType);
};
// Toggle Handlers, Self Explanatory



export const handleOpacityChange = (object, value, onOpacityChange) => {
    onOpacityChange(object, value);
};
// Toggle Handlers, Self Explanatory



export const handleSideChange = (object, value, onSideChange) => {
    onSideChange(object, value);
};
// Toggle Handlers, Self Explanatory


