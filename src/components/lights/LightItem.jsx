import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { lightParams, showTransformControlsFor } from '../../atoms.js';
import { Trash2, ChevronDown, ChevronUp, Move } from 'lucide-react';

const LightItem = ({ lightObject, name, type, isActive, isSelected, onSelect, onToggleVisibility, onEdit, isVisible, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);
    const [isExpanded, setIsExpanded] = useState(false);
    const [lightParamsState, setLightParams] = useAtom(lightParams);
    const [showTransformControls, setShowTransformControls] = useAtom(showTransformControlsFor);

    const handleNameEdit = (e) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const saveNewName = () => {
        onEdit(name, newName);
        setIsEditing(false);
    };
    const toggleTransformControls = (e) => {
        e.stopPropagation();
        setShowTransformControls(prev => prev === name ? null : name);
    };
    const handleParamChange = (param, value) => {
        const newParams = {
            ...lightParamsState[name],
            [param]: param === 'color' ? value : parseFloat(value)
        };
        setLightParams(prev => ({ ...prev, [name]: newParams }));

        if (lightObject) {
            if (param === 'color') {
                lightObject.color.set(value);
            } else {
                lightObject[param] = parseFloat(value);
            }
        }
    };


    const params = lightParamsState[name] || {};

    return (
        <div className={`light-item ${isSelected ? 'selected' : ''}`} data-type={type} onClick={() => onSelect(name)}>
            <div className={`light-header ${isExpanded ? 'expanded' : ''}`}>
                {isEditing ? (
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={saveNewName}
                        onKeyDown={(e) => e.key === 'Enter' && saveNewName()}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="light-name" onDoubleClick={handleNameEdit}>{name}</span>
                )}
                <div className="light-controls">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }} className="control-button expand-button">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        onDelete(name);
                    }} className="control-button delete-button">
                        <Trash2 size={16}/>
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="light-params">
                    <div className="param-row">
                        <div className="param-input">
                            <label>Intensity:</label>
                            <input
                                type="number"
                                value={params.intensity || 1}
                                onChange={(e) => handleParamChange('intensity', e.target.value)}
                                step="0.1"
                            />
                        </div>
                        <div className="param-input">
                            <label>Color:</label>
                            <input
                                type="color"
                                value={params.color || '#ffffff'}
                                onChange={(e) => handleParamChange('color', e.target.value)}
                            />
                        </div>
                    </div>
                    {(type === 'point' || type === 'spot') && (
                        <div className="param-row">
                            <div className="param-input">
                                <label>Distance:</label>
                                <input
                                    type="number"
                                    value={params.distance || 0}
                                    onChange={(e) => handleParamChange('distance', e.target.value)}
                                    step="0.1"
                                />
                            </div>
                            <div className="param-input">
                                <label>Decay:</label>
                                <input
                                    type="number"
                                    value={params.decay || 1}
                                    onChange={(e) => handleParamChange('decay', e.target.value)}
                                    step="0.1"
                                />
                            </div>
                        </div>
                    )}
                    {type === 'spot' && (
                        <div className="param-row">
                            <div className="param-input">
                                <label>Angle:</label>
                                <input
                                    type="number"
                                    value={params.angle || Math.PI/3}
                                    onChange={(e) => handleParamChange('angle', e.target.value)}
                                    step="0.1"
                                />
                            </div>
                            <div className="param-input">
                                <label>Penumbra:</label>
                                <input
                                    type="number"
                                    value={params.penumbra || 0}
                                    onChange={(e) => handleParamChange('penumbra', e.target.value)}
                                    step="0.1"
                                />
                            </div>
                        </div>
                    )}
                    {type !== 'ambient' && (
                        <button onClick={toggleTransformControls} className="control-button transform-button">
                            <span className="button-icon"><Move size={16} /></span>
                            <span className="button-text">{showTransformControls === name ? 'Hide' : 'Show'} Transform Controls</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default LightItem;