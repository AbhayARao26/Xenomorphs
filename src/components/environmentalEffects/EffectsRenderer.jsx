import React, { useEffect, useRef } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import * as THREE from 'three';

extend({
    EffectComposer,
    RenderPass,
    OutlinePass,
    UnrealBloomPass,
    SSAOPass,
    SMAAPass,
    ShaderPass,
    FilmPass,
    DotScreenPass,
    GlitchPass
});

const EffectsRenderer = ({ effects, selectedObject }) => {
    const { gl, scene, camera, size } = useThree();
    const composer = useRef();
    const passes = useRef({});

    useEffect(() => {
        composer.current = new EffectComposer(gl);
        composer.current.addPass(new RenderPass(scene, camera));

        // Initialize passes
        passes.current.outline = new OutlinePass(new THREE.Vector2(size.width, size.height), scene, camera);
        passes.current.bloom = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 1.5, 0.4, 0.85);
        passes.current.ssao = new SSAOPass(scene, camera, size.width, size.height);
        passes.current.smaa = new SMAAPass(size.width, size.height);
        passes.current.fxaa = new ShaderPass(FXAAShader);
        passes.current.fxaa.uniforms['resolution'].value.set(1 / size.width, 1 / size.height);
        passes.current.gammaCorrection = new ShaderPass(GammaCorrectionShader);
        passes.current.film = new FilmPass();
        passes.current.dotScreen = new DotScreenPass();
        passes.current.glitch = new GlitchPass();

        // Add passes to composer
        Object.values(passes.current).forEach(pass => composer.current.addPass(pass));

        return () => {
            composer.current.dispose();
        };
    }, [gl, scene, camera, size]);

    useEffect(() => {
        if (selectedObject && passes.current.outline) {
            passes.current.outline.selectedObjects = [selectedObject];
        } else if (passes.current.outline) {
            passes.current.outline.selectedObjects = [];
        }
    }, [selectedObject]);

    useEffect(() => {
        // Update passes based on effects state
        Object.entries(effects).forEach(([key, value]) => {
            if (passes.current[key]) {
                passes.current[key].enabled = value.enabled;
                Object.entries(value).forEach(([prop, val]) => {
                    if (prop !== 'enabled' && passes.current[key][prop] !== undefined) {
                        passes.current[key][prop] = val;
                    }
                });
            }
        });
    }, [effects]);

    useFrame(() => {
        composer.current.render();
    }, 1);

    return null;
};

export default EffectsRenderer;