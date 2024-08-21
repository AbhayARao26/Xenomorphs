import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { DirectionalLight, DirectionalLightHelper } from 'three';

const DirectionalLightWithHelper = ({ name, light, isVisible }) => {
    const { scene } = useThree();
    const lightRef = useRef();
    const helperRef = useRef();

    useEffect(() => {
        if (lightRef.current && isVisible) {
            const helper = new DirectionalLightHelper(lightRef.current, 1);
            helperRef.current = helper;
            scene.add(helper);
        }

        return () => {
            if (helperRef.current) {
                scene.remove(helperRef.current);
            }
        };
    }, [scene, isVisible]);

    useEffect(() => {
        if (helperRef.current) {
            helperRef.current.visible = isVisible;
        }
    }, [isVisible]);

    useFrame(() => {
        if (helperRef.current) {
            helperRef.current.update();
        }
    });

    return (
        <directionalLight
            ref={lightRef}
            position={light.position}
            intensity={light.intensity}
            color={light.color}
        />
    );
};

export default DirectionalLightWithHelper;