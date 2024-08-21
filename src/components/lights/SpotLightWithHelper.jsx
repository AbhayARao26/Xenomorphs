import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { SpotLight, SpotLightHelper } from 'three';

const SpotLightWithHelper = ({ name, light, isVisible }) => {
    const { scene } = useThree();
    const lightRef = useRef();
    const helperRef = useRef();

    useEffect(() => {
        if (lightRef.current && isVisible) {
            const helper = new SpotLightHelper(lightRef.current);
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
        <spotLight
            ref={lightRef}
            position={light.position}
            intensity={light.intensity}
            color={light.color}
            distance={light.distance}
            angle={light.angle}
            penumbra={light.penumbra}
            decay={light.decay}
        />
    );
};

export default SpotLightWithHelper;