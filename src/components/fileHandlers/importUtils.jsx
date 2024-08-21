import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// Loader utilised to load the file, and read as a GLTF File. Can be later handled or updated to handle multiple file formats



export const importParser = (file, onLoad) => {
    // Used in Model.jsx, it is used to takeup file reference, and read the file as a GLTFObject. The onLoad parameter, will be used, to you know, like it's a callback that will be called, on completely handling importModel


    const reader = new FileReader();
    //Instansiate a reader


    reader.onload = function (e) {
        // Reader event, that happens in async manner. Completing the read as a buffer object, this function will be performed


        const contents = e.target.result;
        // The buffer, holds the file read as an ArrayBuffer, or string form of data


        const loader = new GLTFLoader();
        // Instansiate the loader


        loader.parse(contents, '', function (gltf) {
            // Parse the contents of a file, as a GLTF Object, and onLoad, the code given next line, the callback will read the GLTF Object, and callback will be applied


            onLoad(gltf);
        });
    };
    reader.readAsArrayBuffer(file);
    // Reading the Array, storing in a temporary buffer, later operations, given insidethe function callback clause


};