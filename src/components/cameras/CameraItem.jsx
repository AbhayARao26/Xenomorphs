import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useAtom } from 'jotai';
import { cameraParams, showTransformControlsFor } from '../../atoms.js';
import { Trash2, ChevronDown, ChevronUp} from 'lucide-react'; // Importing the trash icon from lucide-react


const CameraItem = ({ cameraObject, name, type, isActive, isSelected, onSelect, onToggleView, onToggleVisibility, onEdit, isVisible, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);
    const [isExpanded, setIsExpanded] = useState(false);
    const [cameraParamsState, setCameraParams] = useAtom(cameraParams);
    const [showTransformControls, setShowTransformControls] = useAtom(showTransformControlsFor);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const contextMenuRef = useRef(null);

    const handleContextMenu = useCallback((event) => {
        event.preventDefault();
        setContextMenu({ visible: true, x: event.clientX, y: event.clientY });
    }, []);

    const handleClickOutside = useCallback((event) => {
        if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
            setContextMenu({ visible: false, x: 0, y: 0 });
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);


    const handleNameEdit = (e) => {
        if (name === 'default'){
            console.log("It isn't gonna be deleted")
        } else {
            e.stopPropagation();
            setIsEditing(true);
        }
    };

    const saveNewName = () => {
        onEdit(name, newName);
        setIsEditing(false);
    };



    const handleCloseContextMenu = useCallback(() => {
        setContextMenu({ visible: false, x: 0, y: 0 });
    }, []);

    const handleDelete = (e) => {
        if (name === 'default'){
            console.log("It isn't gonna be deleted")
        } else {
            e.stopPropagation();
            onDelete(name);
        }
    };




    const handleParamChange = (param, value) => {
        const newParams = {
            ...cameraParamsState[name],
            [param]: parseFloat(value)
        };
        setCameraParams(prev => ({ ...prev, [name]: newParams }));

        if (cameraObject) {
            cameraObject[param] = parseFloat(value);
            cameraObject.updateProjectionMatrix();
        }
    };

    const toggleTransformControls = (e) => {
        e.stopPropagation();
        setShowTransformControls(prev => prev === name ? null : name);
    };

    const params = cameraParamsState[name] || {};
    const isDefaultCamera = name === 'default';

    return (
        <div
            className={`camera-item ${isSelected ? 'selected' : ''}`}
            data-type={type}
            onContextMenu={handleContextMenu}
        >
            <div className={`camera-header ${isExpanded ? 'expanded' : ''}`} onClick={() => onSelect(name)}>
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
                    <span className="camera-name" onDoubleClick={handleNameEdit}>{name}</span>
                )}
                <div className="camera-controls">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        onToggleView(name);
                    }} className={`control-button view-button ${isActive ? 'active' : ''}`}>
                        {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(name);
                    }} className="control-button visibility-button">
                        {isVisible ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }} className="control-button expand-button">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <button onClick={handleDelete} className="control-button delete-button">
                        <Trash2 size={16}/>
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="camera-params">
                    {type === 'perspective' ? (
                        <>
                            <div className="param-row">
                                <div className="param-input">
                                    <label>Field of View:</label>
                                    <input
                                        type="number"
                                        value={params.fov || 75}
                                        onChange={(e) => handleParamChange('fov', e.target.value)}
                                    />
                                </div>
                                <div className="param-input">
                                    <label>Zoom:</label>
                                    <input
                                        type="number"
                                        value={params.zoom || 1}
                                        onChange={(e) => handleParamChange('zoom', e.target.value)}
                                        step="0.1"
                                    />
                                </div>
                            </div>
                            <div className="param-row">
                                <div className="param-input">
                                    <label>Near:</label>
                                    <input
                                        type="number"
                                        value={params.near || 0.1}
                                        onChange={(e) => handleParamChange('near', e.target.value)}
                                        step="0.1"
                                    />
                                </div>
                                <div className="param-input">
                                    <label>Far:</label>
                                    <input
                                        type="number"
                                        value={params.far || 1000}
                                        onChange={(e) => handleParamChange('far', e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="param-row">
                            <div className="param-input">
                                <label>Near:</label>
                                <input
                                    type="number"
                                    value={params.near || 0.1}
                                    onChange={(e) => handleParamChange('near', e.target.value)}
                                    step="0.1"
                                />
                            </div>
                            <div className="param-input">
                                <label>Far:</label>
                                <input
                                    type="number"
                                    value={params.far || 1000}
                                    onChange={(e) => handleParamChange('far', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CameraItem;