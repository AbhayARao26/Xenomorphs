// exportUtils.js

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import * as THREE from 'three';
const resetToInitialFrame = (modelRef) => {
    if (modelRef && modelRef.current) {
        const model = modelRef.current;
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        model.quaternion.set(0, 0, 0, 1);
    }
};

const combineAnimations = (existingAnimations, customAnimations) => {
    return [
        ...existingAnimations,
        ...Object.keys(customAnimations).map(name => {
            const anim = customAnimations[name];
            return new THREE.AnimationClip(
                name,
                anim.duration,
                [
                    new THREE.VectorKeyframeTrack(
                        'myModel.position',
                        [0, anim.duration],
                        [...anim.initialPosition, ...anim.finalPosition]
                    ),
                    new THREE.VectorKeyframeTrack(
                        'myModel.scale',
                        [0, anim.duration],
                        [...anim.initialScale, ...anim.finalScale]
                    ),
                    new THREE.QuaternionKeyframeTrack(
                        'myModel.quaternion',
                        [0, anim.duration],
                        [
                            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(...anim.initialRotation.map(r => r * (Math.PI / 180)))).toArray(),
                            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(...anim.finalRotation.map(r => r * (Math.PI / 180)))).toArray()
                        ]
                    )
                ]
            );
        })
    ];
};

const handleExport = (modelRef, scene, gltf, existingAnimations, customAnimations) => {
    resetToInitialFrame(modelRef);
    // Reset to Initial frame if the export is called
    // FEATREQ: Can be removed

    const allAnimations = combineAnimations(existingAnimations, customAnimations);

    const gltfExporter = new GLTFExporter();

    const options = {
        binary: true,
        animations: allAnimations,
    };

    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);

    function save(blob, filename) {
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        // Automatically Click the Download Reference on exportTrigger
    }

    function saveString(text, filename) {
        save(new Blob([text], { type: 'text/plain' }), filename);
        // The Array object, is basically a type of ArrayBuffer
    }

    function saveArrayBuffer(buffer, filename) {
        save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
    }

    const objectsToExport = [];
    // Create a new array to hold the children that we want to export

    scene.traverse((child) => {
        if (child === modelRef.current) {
            objectsToExport.push(child);
        }
    });
    // Traverse the scene and add only the model to the array

    const exportScene = new THREE.Scene();
    objectsToExport.forEach((object) => {
        exportScene.add(object);
    });
    // Create a new scene for export and add only the model

    const defaultFileName = 'Exported';
    const fileName = window.prompt('Enter the file name for the export', defaultFileName);

    if (!fileName) {
        alert('Export cancelled. No file name provided.');
        return;
    }
    // Export Mechanism using an Alerting prompt to user, for entering the name of the file they want to save

    gltfExporter.parse(exportScene, function (result) {
        if (result instanceof ArrayBuffer) {
            saveArrayBuffer(result, `${fileName}.glb`);
            // If it is a simple ArrayBuffer, export as a GLB Object, directly without any issues
        } else {
            // This case, is that the result is a JSON Object

            const output = JSON.stringify(result, null, 2);
            console.log(output);
            saveString(output, `${fileName}.gltf`);
            // JSON Stringifying the object, that can be exported
        }
    }, function (error) {
        console.error('An error occurred during the export:', error);
    }, options);
};

export { handleExport, resetToInitialFrame, combineAnimations };
