import { Canvas } from '@react-three/fiber';
import '../../stylesheets/camera.css';
import { Stats } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import ColorPickerGrid from './ColorPicker.jsx';
import CameraNamesList from '../cameras/CameraNamesList.jsx';
import UiForFirebase from './uiForFirebase.jsx';
import GridHelperColored from '../modifiedHelpers/GridHelperColored.jsx';
import { globalShadow, modelPath } from '../../atoms.js';
import { useAtom } from 'jotai';
import Lights from './Lights.jsx';
import CameraManager from '../cameras/CameraManager.jsx';
import LightNamesList from './lightNamesList.jsx';
import TransformControls from './TransformControls.jsx';

import { ExportTrigger } from '../../atoms.js';

export default function App() {
    const [shadows,setSchadows] = useAtom(globalShadow);
    const [ModelPath,setModelPath] = useAtom(modelPath);
    const [exportTrigger, setExportTrigger] = useAtom(ExportTrigger);
    const sceneRef = useRef();
    const selectedObjectRef = useRef(null);
    const [highlightedMesh, setHighlightedMesh] = useState(null);
    const [isExploding, setIsExploding] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);



 
      
  return (
    <>
    <UiForFirebase/>
    <TransformControls/>
      <ColorPickerGrid />

      <LightNamesList position={'absolute'}/>
      <Canvas camera={{ position: [0, 3, 10] }} shadows={shadows} >
        <Lights/>
      <ambientLight />
      <CameraManager/>
      <GridHelperColored />
      <Stats />
      </Canvas>
    </>
  );
}