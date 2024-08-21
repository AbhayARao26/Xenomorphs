import React from 'react';
import { gridColor } from '../../atoms.js';
import { backgroundColor } from '../../atoms.js';
import { useAtom } from 'jotai';
function GridHelperColored({gridHelperRef}) {
    // Your component logic here
    const [BackgroundColor,setBackgroundColor] = useAtom(backgroundColor);
    const [GridColor,setGridColor] = useAtom(gridColor);

    return (
        <>
        <color attach="background" args={[BackgroundColor]} />
        <gridHelper ref={gridHelperRef} args={[20, 20, GridColor, GridColor]} />
        </>
    );
}

export default GridHelperColored;