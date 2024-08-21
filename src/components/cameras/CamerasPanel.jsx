import React from 'react';
import {useAtom} from 'jotai';
import {activeCamera, cameraNames, cameraParams, selectedCamera} from '../../atoms.js';
import CameraItem from './CameraItem';
import './CamerasPanel.css';
import AddCameraDropdown from './AddCameraDropdown';

export default function CamerasPanel({ cameras }) {
    const [cameraNamesState, setCameraNames] = useAtom(cameraNames);
    const [activeCameraState, setActiveCamera] = useAtom(activeCamera);
    const [selectedCameraState, setSelectedCamera] = useAtom(selectedCamera);
    const [cameraParamsState, setCameraParams] = useAtom(cameraParams);

    const handleCameraSelection = (camera) => {
        setSelectedCamera(camera);
    };

    const handleToggleView = (cameraName) => {
        setActiveCamera(prev => prev === cameraName ? 'default' : cameraName);
    };

    const handleToggleVisibility = (camera) => {
        setCameraNames(prev => ({
            ...prev,
            [camera]: [prev[camera][0], prev[camera][1], !prev[camera][2]]
        }));
    };

    const handleEditName = (oldName, newName) => {
        if (oldName === newName) return;

        setCameraNames(prev => {
            const newState = { ...prev };
            newState[newName] = [...newState[oldName]];
            delete newState[oldName];
            return newState;
        });

        setCameraParams(prev => {
            const newState = { ...prev };
            newState[newName] = newState[oldName];
            delete newState[oldName];
            return newState;
        });

        if (activeCameraState === oldName) {
            setActiveCamera(newName);
        }

        if (selectedCameraState === oldName) {
            setSelectedCamera(newName);
        }
    };

    const handleAddCamera = (type) => {
        const newCameraName = `Camera${Object.keys(cameraNamesState).length + 1}`;
        setCameraNames(prev => ({
            ...prev,
            [newCameraName]: [type, newCameraName, true]
        }));
        // Initialize camera params
        setCameraParams(prev => ({
            ...prev,
            [newCameraName]: { fov: 75, near: 0.1, far: 1000, zoom: 1 }
        }));
    };

    const handleDeleteCamera = (cameraName) => {
        setCameraNames(prev => {
            const newState = { ...prev };
            delete newState[cameraName];
            return newState;
        });

        setCameraParams(prev => {
            const newState = { ...prev };
            delete newState[cameraName];
            return newState;
        });

        if (activeCameraState === cameraName) {
            setActiveCamera('default');
        }

        if (selectedCameraState === cameraName) {
            setSelectedCamera(null);
        }
    };

    return (
        <div className="cameras-panel">
            <h2>Cameras</h2>
            <AddCameraDropdown onAddCamera={handleAddCamera} />
            {Object.entries(cameraNamesState).map(([cameraName, [type, name, isVisible]]) => (
                <CameraItem
                    key={cameraName}
                    cameraObject={cameras[cameraName]}
                    name={cameraName}
                    type={type}
                    isActive={activeCameraState === cameraName}
                    isSelected={selectedCameraState === cameraName}
                    isVisible={isVisible}
                    onSelect={handleCameraSelection}
                    onToggleView={handleToggleView}
                    onToggleVisibility={handleToggleVisibility}
                    onEdit={handleEditName}
                    onDelete={handleDeleteCamera}

                />
            ))}
        </div>
    );
}