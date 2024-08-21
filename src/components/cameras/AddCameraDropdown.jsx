import React, { useState } from 'react';

const AddCameraDropdown = ({ onAddCamera }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleAddCamera = (type) => {
        onAddCamera(type);
        setIsOpen(false);
    };

    return (
        <div className="add-camera-dropdown">
            <button onClick={() => setIsOpen(!isOpen)} className="add-camera-button">
                Add Camera
            </button>
            <div className={`dropdown-content ${isOpen ? 'open' : ''}`}>
                <button onClick={() => handleAddCamera('perspective')}>
                    Perspective Camera
                </button>
                <button onClick={() => handleAddCamera('orthographic')}>
                    Orthographic Camera
                </button>
            </div>
        </div>
    );
};

export default AddCameraDropdown;