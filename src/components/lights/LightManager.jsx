import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useAtom } from 'jotai';
import { lightNames, lightParams, showTransformControlsFor } from '../../atoms.js';
import * as THREE from 'three';
import { TransformControls } from "@react-three/drei";

const LightManager = () => {
    const { scene } = useThree();
    const [lightNamesState] = useAtom(lightNames);
    const [lightParamsState] = useAtom(lightParams);
    const [showTransformControls] = useAtom(showTransformControlsFor);
    const lightsRef = useRef({});

    useEffect(() => {
        Object.entries(lightNamesState).forEach(([name, [type]]) => {
            if (!lightsRef.current[name]) {
                let light;
                switch (type) {
                    case 'point':
                        light = new THREE.PointLight();
                        break;
                    case 'spot':
                        light = new THREE.SpotLight();
                        break;
                    case 'directional':
                        light = new THREE.DirectionalLight();
                        break;
                    case 'ambient':
                        light = new THREE.AmbientLight();
                        break;
                    default:
                        console.warn(`Unknown light type: ${type}`);
                        return;
                }
                light.name = name;
                scene.add(light);
                lightsRef.current[name] = light;
            }
        });
    }, [lightNamesState, scene]);

    useEffect(() => {
        Object.entries(lightParamsState).forEach(([name, params]) => {
            const light = lightsRef.current[name];
            if (light) {
                Object.entries(params).forEach(([key, value]) => {
                    if (key === 'color') {
                        light.color.set(value);
                    } else {
                        light[key] = value;
                    }
                });
            }
        });
    }, [lightParamsState]);

    return (
        <>
            {Object.entries(lightNamesState).map(([name, [type]]) => {
                const light = lightsRef.current[name];
                if (light && type !== 'ambient' && showTransformControls === name) {
                    return (
                        <TransformControls
                            key={name}
                            object={light}
                            mode="translate"
                        />
                    );
                }
                return null;
            })}
        </>
    );
};

export default LightManager;