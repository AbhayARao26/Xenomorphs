import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useAtom } from 'jotai';
import {cameraNames, activeCamera, cameraParams, showTransformControlsFor} from '../../atoms';
import * as THREE from 'three';
import PerspectiveCameraWithHelper from './PerspectiveCameraWithHelper';
import OrthographicCameraWithHelper from './OrthographicCameraWithHelper';
import {TransformControls} from "@react-three/drei";

const CameraManager = () => {
    const { scene, camera: defaultCamera, gl, set } = useThree();
    const [cameraNamesState, setCameraNames] = useAtom(cameraNames);
    const [activeCameraState, setActiveCamera] = useAtom(activeCamera);
    const [cameraParamsState, setCameraParams] = useAtom(cameraParams);
    const [showTransformControls] = useAtom(showTransformControlsFor);
    const camerasRef = useRef({});
    const lookAtTargetRef = useRef(new THREE.Object3D());

    useEffect(() => {
        scene.add(lookAtTargetRef.current);
        return () => {
            scene.remove(lookAtTargetRef.current);
        };
    }, [scene]);

    useEffect(() => {
        // Initialize with the default camera
        const defaultCameraName = 'default';
        setCameraNames({ [defaultCameraName]: ['perspective', 'Default Camera', true] });
        setCameraParams({ [defaultCameraName]: { fov: defaultCamera.fov, near: defaultCamera.near, far: defaultCamera.far, zoom: defaultCamera.zoom } });
        camerasRef.current[defaultCameraName] = defaultCamera;
    }, []);

    useEffect(() => {
        Object.entries(cameraNamesState).forEach(([name, [type]]) => {
            if (!camerasRef.current[name]) {
                let cam;
                if (type === 'perspective') {
                    cam = new THREE.PerspectiveCamera(75, gl.domElement.width / gl.domElement.height, 0.1, 1000);
                } else if (type === 'orthographic') {
                    const frustumSize = 10;
                    const aspect = gl.domElement.width / gl.domElement.height;
                    cam = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 1000);
                }
                if (cam) {
                    cam.name = name;
                    scene.add(cam);
                    camerasRef.current[name] = cam;
                    if (!cameraParamsState[name]) {
                        setCameraParams(prev => ({ ...prev, [name]: { fov: cam.fov, near: cam.near, far: cam.far, zoom: cam.zoom } }));
                    }
                }
            }
        });
    }, [cameraNamesState, gl.domElement.width, gl.domElement.height]);

    useEffect(() => {
        Object.entries(cameraParamsState).forEach(([name, params]) => {
            const cam = camerasRef.current[name];
            if (cam) {
                Object.assign(cam, params);
                cam.updateProjectionMatrix();
            }
        });
    }, [cameraParamsState]);

    useEffect(() => {
        const activeCamera = camerasRef.current[activeCameraState];
        if (activeCamera) {
            set({ camera: activeCamera });
        }
    }, [activeCameraState, set]);

    const handleLookAtChange = (cameraName, lookAtPoint) => {
        const camera = camerasRef.current[cameraName];
        if (camera) {
            lookAtTargetRef.current.position.set(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
            camera.lookAt(lookAtTargetRef.current.position);
            camera.updateProjectionMatrix();
        }
    };

    return (
        <>
            {Object.entries(cameraNamesState).map(([name, [type, , isVisible]]) => {
                const camera = camerasRef.current[name];
                if (camera) {
                    return (
                        <React.Fragment key={name}>
                            {type === 'perspective' && camera instanceof THREE.PerspectiveCamera && (
                                <PerspectiveCameraWithHelper
                                    name={name}
                                    camera={camera}
                                    isVisible={isVisible}
                                />
                            )}
                            {type === 'orthographic' && camera instanceof THREE.OrthographicCamera && (
                                <OrthographicCameraWithHelper
                                    name={name}
                                    camera={camera}
                                    isVisible={isVisible}
                                />
                            )}
                            {showTransformControls === name && (
                                <TransformControls
                                    object={lookAtTargetRef.current}
                                    mode="translate"
                                    onObjectChange={() => {
                                        handleLookAtChange(name, lookAtTargetRef.current.position);
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                }
                return null;
            })}
        </>
    );
};


export default CameraManager;