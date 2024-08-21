import React, { useState } from 'react';

const AddLightDropdown = ({ onAddLight }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleAddLight = (type) => {
        onAddLight(type);
        setIsOpen(false);
    };

    return (
        <div className="add-light-dropdown">
            <button onClick={() => setIsOpen(!isOpen)} className="add-light-button">
                Add Light
            </button>
            <div className={`dropdown-content ${isOpen ? 'open' : ''}`}>
                <button onClick={() => handleAddLight('point')}>
                    Point Light
                </button>
                <button onClick={() => handleAddLight('spot')}>
                    Spot Light
                </button>
                <button onClick={() => handleAddLight('directional')}>
                    Directional Light
                </button>
                <button onClick={() => handleAddLight('ambient')}>
                    Ambient Light
                </button>
            </div>
        </div>
    );
};

export default AddLightDropdown;