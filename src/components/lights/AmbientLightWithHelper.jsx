import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { AmbientLight, Mesh, SphereGeometry, MeshBasicMaterial } from 'three';

const AmbientLightWithHelper = ({ name, light, isVisible }) => {
    const { scene } = useThree();
    const lightRef = useRef();
    const helperRef = useRef();

    useEffect(() => {
        if (lightRef.current && isVisible) {
            // Create a sphere to represent the ambient light
            const geometry = new SphereGeometry(0.2, 16, 16);
            const material = new MeshBasicMaterial({ color: light.color, wireframe: true });
            const helper = new Mesh(geometry, material);
            helper.position.set(0, 0, 0); // You can adjust this position if needed
            helperRef.current = helper;
            scene.add(helper);
        }

        return () => {
            if (helperRef.current) {
                scene.remove(helperRef.current);
            }
        };
    }, [scene, isVisible, light.color]);

    useEffect(() => {
        if (helperRef.current) {
            helperRef.current.visible = isVisible;
            helperRef.current.material.color.set(light.color);
            // Adjust the size of the helper based on the light intensity
            const scale = 0.2 + light.intensity * 0.1;
            helperRef.current.scale.set(scale, scale, scale);
        }
    }, [isVisible, light.color, light.intensity]);

    return (
        <ambientLight
            ref={lightRef}
            intensity={light.intensity}
            color={light.color}
        />
    );
};

export default AmbientLightWithHelper;