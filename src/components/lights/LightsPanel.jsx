import React from 'react';
import { useAtom } from 'jotai';
import { activeLight, lightNames, lightParams, selectedLight } from '../../atoms.js';
import LightItem from './LightItem';
import './LightsPanel.css';
import AddLightDropdown from './AddLightDropdown';

const DefaultLightItem = () => (
    <div className="light-item default-light">
        <div className="light-header">
            <span className="light-name">Default Light (Not Editable)</span>
        </div>
    </div>
);

export default function LightsPanel() {
    const [lightNamesState, setLightNames] = useAtom(lightNames);
    const [activeLightState, setActiveLight] = useAtom(activeLight);
    const [selectedLightState, setSelectedLight] = useAtom(selectedLight);
    const [lightParamsState, setLightParams] = useAtom(lightParams);

    const handleLightSelection = (light) => {
        setSelectedLight(light);
    };

    const handleToggleVisibility = (light) => {
        setLightNames(prev => ({
            ...prev,
            [light]: [prev[light][0], prev[light][1], !prev[light][2]]
        }));
    };

    const handleEditName = (oldName, newName) => {
        if (oldName === newName) return;

        setLightNames(prev => {
            const newState = { ...prev };
            newState[newName] = [...newState[oldName]];
            delete newState[oldName];
            return newState;
        });

        setLightParams(prev => {
            const newState = { ...prev };
            newState[newName] = newState[oldName];
            delete newState[oldName];
            return newState;
        });

        if (activeLightState === oldName) {
            setActiveLight(newName);
        }

        if (selectedLightState === oldName) {
            setSelectedLight(newName);
        }
    };

    const handleAddLight = (type) => {
        const newLightName = `Light${Object.keys(lightNamesState).length + 1}`;
        setLightNames(prev => ({
            ...prev,
            [newLightName]: [type, newLightName, true]
        }));
        // Initialize light params
        setLightParams(prev => ({
            ...prev,
            [newLightName]: { intensity: 1, color: '#ffffff', distance: 0, decay: 2 }
        }));
    };

    const handleDeleteLight = (lightName) => {
        setLightNames(prev => {
            const newState = { ...prev };
            delete newState[lightName];
            return newState;
        });

        setLightParams(prev => {
            const newState = { ...prev };
            delete newState[lightName];
            return newState;
        });

        if (activeLightState === lightName) {
            setActiveLight(null);
        }

        if (selectedLightState === lightName) {
            setSelectedLight(null);
        }
    };

    return (
        <div className="lights-panel">
            <h2>Lights</h2>
            <AddLightDropdown onAddLight={handleAddLight}/>
            <DefaultLightItem />
            {Object.entries(lightNamesState).map(([lightName, [type, name, isVisible]]) => (
                <LightItem
                    key={lightName}
                    name={lightName}
                    type={type}
                    isActive={activeLightState === lightName}
                    isSelected={selectedLightState === lightName}
                    isVisible={isVisible}
                    onSelect={handleLightSelection}
                    onToggleVisibility={handleToggleVisibility}
                    onEdit={handleEditName}
                    onDelete={handleDeleteLight}
                />
            ))}
        </div>
    );
}