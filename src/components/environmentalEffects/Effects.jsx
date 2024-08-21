import React, { useEffect, useRef } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import * as THREE from 'three';

extend({ EffectComposer, RenderPass, OutlinePass, ShaderPass });

const Effects = ({ selectedObject }) => {
    const { gl, scene, camera, size } = useThree();
    // Access to scene objects including renderer, camera, and canvas size



    const composer = useRef();
    // Access to the composer



    const outlinePass = useRef();
    // Access to the outline

    useEffect(() => {
        // Remember that the composer works above the renderer. Or the renderer works under composer
        composer.current = new EffectComposer(gl);
        // Instance of a composer, to that WebGL Instance and set the composers reference to this new instance



        const renderPass = new RenderPass(scene, camera);
        // Add the renderer for post-processing effects to the scene, from my reference camera.
        // Post-processing will be applied in the eyes of the camera. Something like that


        // All of these instances of properties within the composers, are classified as passes.
        // Each of these 'passes' must be added right now to our composer
        composer.current.addPass(renderPass);
        // Add the renderPass to current composer. First Pass added

        // outlinePass.current = new OutlinePass(new THREE.Vector2(size.width, size.height), scene, camera);
        // // Apply outline. Create an outline instance
        //
        //
        //
        // outlinePass.current.edgeStrength = 3;
        // outlinePass.current.edgeThickness = 0.5;
        // outlinePass.current.visibleEdgeColor.set('#ffe8e8');
        // outlinePass.current.hiddenEdgeColor.set('#615353');
        // // Add outline references
        //
        //
        //
        // composer.current.addPass(outlinePass.current);
        // Let the post-processing composer, now outlinePass is added



        const effectFXAA = new ShaderPass(FXAAShader);
        // Adding FXAA Type Shader (Anti Aliasing Class)



        effectFXAA.uniforms['resolution'].value.set(1 / size.width, 1 / size.height);
        // Setting the Anti-Aliasing Fast Approx. type, to be uniform or constant for all the vertices and fragments. Process for all.
        // And keep it uniform over my resolution which is my screen resolutiion (sent as parameters)



        composer.current.addPass(effectFXAA);
    }, [gl, scene, camera, size]);



    useFrame(() => {
        composer.current.render();
    }, 1);
    // Renderer is given the priority of 1, every frame


    return null;
};

export default Effects;