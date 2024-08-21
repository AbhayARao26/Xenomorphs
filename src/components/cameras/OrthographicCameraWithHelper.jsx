import React, { useRef, useEffect, useState } from 'react';
import { useHelper, TransformControls } from '@react-three/drei';
import { CameraHelper, Vector3 } from 'three';
import { useAtom } from 'jotai';
import { activeCamera, selectedCamera, cameraParams } from '../../atoms.js';
import '../../stylesheets/camera.css';

class CustomColor {
  constructor(colorString) {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorString);
    if (match) {
      this.r = parseInt(match[1], 16)/255;
      this.g = parseInt(match[2], 16)/255;
      this.b = parseInt(match[3], 16)/255;
    } else {
      throw new Error("Invalid color string");
    }
  }
}

export default function OrthographicCameraWithHelper({ name, camera, isVisible }) {
  const [cameraActive, setCameraActive] = useState(false);
  const cameraRef = useRef(camera);
  const [active] = useAtom(activeCamera);
  const [selected] = useAtom(selectedCamera);
  const [cameraParamsState, setCameraParams] = useAtom(cameraParams);

  const helper = useHelper(isVisible && cameraRef, CameraHelper);

  useEffect(() => {
    if (helper && helper.current instanceof CameraHelper) {
      const colorFrustum = new CustomColor(selected === name ? '#ffff00' : '#ff0000');
      const colorCone = new CustomColor('#ff0000');
      const colorUp = new CustomColor('#00aaff');
      const colorTarget = new CustomColor('#ffffff');
      const colorCross = new CustomColor('#333333');
      helper.current.setColors(colorFrustum, colorCone, colorUp, colorTarget, colorCross);
    }
  }, [helper, isVisible, selected, name]);

  useEffect(() => {
    if (active === name) {
      setTimeout(() => {
        setCameraActive(true);
      }, 5);
    } else {
      setCameraActive(false);
    }
  }, [active, name]);

  useEffect(() => {
    if (cameraRef.current) {
      const params = cameraParamsState[name];
      if (params) {
        // Update orthographic camera parameters
        cameraRef.current.left = params.left || cameraRef.current.left;
        cameraRef.current.right = params.right || cameraRef.current.right;
        cameraRef.current.top = params.top || cameraRef.current.top;
        cameraRef.current.bottom = params.bottom || cameraRef.current.bottom;
        cameraRef.current.near = params.near || cameraRef.current.near;
        cameraRef.current.far = params.far || cameraRef.current.far;
        cameraRef.current.zoom = params.zoom || cameraRef.current.zoom;

        if (params.lookAt) {
          cameraRef.current.lookAt(new Vector3(params.lookAt.x, params.lookAt.y, params.lookAt.z));
        }
        cameraRef.current.updateProjectionMatrix();
      }
    }
  }, [cameraParamsState, name]);

  return (
      <>
        <primitive object={camera} ref={cameraRef} />
        {isVisible && (
            <TransformControls object={cameraRef} mode="translate" />
        )}
      </>
  );
}