import React, { useState } from 'react';
import '/src/stylesheets/navigationBar.css';
import { useAtom } from 'jotai';
import { TbAugmentedReality } from "react-icons/tb";
import { Glasses } from 'lucide-react';

const NavBar = ({ setActiveComponent, handleContextMenu, openedComponents, contextMenu, handleCloseComponent, onEnterAR, toggleUIVisibility }) => {
    const [focusedComponent, setFocusedComponent] = useState(null);

    const handleComponentClick = (component) => {
        setFocusedComponent(component);
        if (!openedComponents.includes(component)) {
            setActiveComponent(component);
        }
    };

    const handleARClick = () => {
        onEnterAR();
        toggleUIVisibility();
    };

    return (
        <>
            <ul className="menu-bar">
                <li className="menu-item ar-item" onClick={handleARClick}>
                    <TbAugmentedReality className="ar-icon" color="#ffffff" size={20}/>
                </li>
                <li
                    className={`menu-item ${focusedComponent === 'keyframes' ? 'focused' : ''} ${openedComponents.includes('keyframes') ? 'opened' : ''}`}
                    onClick={() => handleComponentClick('keyframes')}
                    onContextMenu={(e) => handleContextMenu(e, 'keyframes')}
                >
                    Keyframes
                    {openedComponents.includes('keyframes') && focusedComponent !== 'keyframes' &&
                        <span className="dot"></span>}
                </li>
                <li
                    className={`menu-item ${focusedComponent === 'materials' ? 'focused' : ''} ${openedComponents.includes('materials') ? 'opened' : ''}`}
                    onClick={() => handleComponentClick('materials')}
                    onContextMenu={(e) => handleContextMenu(e, 'materials')}
                >
                    Materials
                    {openedComponents.includes('materials') && focusedComponent !== 'materials' &&
                        <span className="dot"></span>}
                </li>
                <li
                    className={`menu-item ${focusedComponent === 'lights' ? 'focused' : ''} ${openedComponents.includes('lights') ? 'opened' : ''}`}
                    onClick={() => handleComponentClick('lights')}
                    onContextMenu={(e) => handleContextMenu(e, 'lights')}
                >
                    Lights
                    {openedComponents.includes('lights') && focusedComponent !== 'lights' &&
                        <span className="dot"></span>}
                </li>
                <li
                    className={`menu-item ${focusedComponent === 'effects' ? 'focused' : ''} ${openedComponents.includes('effects') ? 'opened' : ''}`}
                    onClick={() => handleComponentClick('effects')}
                    onContextMenu={(e) => handleContextMenu(e, 'effects')}
                >
                    Post Processing
                    {openedComponents.includes('effects') && focusedComponent !== 'effects' &&
                        <span className="dot"></span>}
                </li>
                <li
                    className={`menu-item ${focusedComponent === 'cameras' ? 'focused' : ''} ${openedComponents.includes('cameras') ? 'opened' : ''}`}
                    onClick={() => handleComponentClick('cameras')}
                    onContextMenu={(e) => handleContextMenu(e, 'cameras')}
                >
                    Cameras
                    {openedComponents.includes('cameras') && focusedComponent !== 'cameras' &&
                        <span className="dot"></span>}
                </li>
            </ul>
            {contextMenu.visible && (
                <div className="context-menu" style={{bottom: 80, left: contextMenu.x}}>
                    <div onClick={() => handleCloseComponent(contextMenu.component)}>Close Container</div>
                </div>
            )}
        </>
    );
};

export default NavBar;