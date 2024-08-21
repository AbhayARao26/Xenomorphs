import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointLight, PointLightHelper } from 'three';

const PointLightWithHelper = ({ name, light, isVisible }) => {
    const { scene } = useThree();
    const lightRef = useRef();
    const helperRef = useRef();

    useEffect(() => {
        if (lightRef.current && isVisible) {
            const helper = new PointLightHelper(lightRef.current, 0.5);
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
        <pointLight
            ref={lightRef}
            position={light.position}
            intensity={light.intensity}
            color={light.color}
            distance={light.distance}
            decay={light.decay}
        />
    );
};

export default PointLightWithHelper;