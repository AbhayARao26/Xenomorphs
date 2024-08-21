import React, { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';

const TransformControlsResponsive = ({ modelRef }) => {
    const transformControls = useRef();
    const { camera, gl, scene } = useThree();
    const [isVisible, setVisible] = useState(false);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!transformControls.current) return;
            switch (event.key.toLowerCase()) {
                case 'q':
                    transformControls.current.setMode('translate');
                    break;
                case 'w':
                    transformControls.current.setMode('scale');
                    break;
                case 'e':
                    transformControls.current.setMode('rotate');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (transformControls.current && modelRef.current) {
            transformControls.current.attach(modelRef.current);
        }
    }, [modelRef, transformControls]);

    useEffect(() => {
        const handleClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            let clickedOnModel = false;
            for (let i = 0; i < intersects.length; i++) {
                let obj = intersects[i].object;
                while (obj.parent && obj !== scene) {
                    if (obj === modelRef.current) {
                        clickedOnModel = true;
                        break;
                    }
                    obj = obj.parent;
                }
                if (clickedOnModel) break;
            }

            setVisible(clickedOnModel);
        };

        gl.domElement.addEventListener('click', handleClick);
        return () => {
            gl.domElement.removeEventListener('click', handleClick);
        };
    }, [gl, camera, scene, modelRef, raycaster, mouse]);

    return (
        modelRef.current && isVisible && (
            <TransformControls
                ref={transformControls}
                object={modelRef.current}
                camera={camera}
                gl={gl.domElement}
            />
        )
    );
};

export default TransformControlsResponsive;