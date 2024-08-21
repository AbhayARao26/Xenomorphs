import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { importParser } from '../fileHandlers/importUtils.jsx';
import { handleExport, resetToInitialFrame} from '../fileHandlers/exportUtils.jsx';
import TransformControlsResponsive from '../modifiedHelpers/TransformControlsResponsive';
import Effects from '../environmentalEffects/Effects';

const Model = forwardRef(({
                              setExportTrigger,
                              importFile,
                              animationControl,
                              loop,
                              selectedAnimations,
                              customAnimations,
                              setAvailableAnimations,
                              onObjectClick,
                              showTransformControls
                          }, ref) => {
    // forwardRef basically allows me to take a reference, and pass it my child components within my program.
    // Like ref, I'll take it from somewhere outside this program. The ref, can be utilised by objects within this program (function or whatever the fuck it is)

    // All those parameters like setExportTriggers, and stuff, are the parameters that are required to be passed to the Model.
    // ref is another parameter passed from parent component that encapsulates (or some shit like that) Model

    // setExportTrigger, is a state that is set to true, when export is called. Note that this export call, is probably why model re-renders. Try fixing out if it's true

    // importFile is the file reference, that is handled on importing the file. The file reference is set, in App.jsx, and this is passed over to this Model component.
    // The Model shall use this, along with importUtils contained function called importParser, and then read it as a GLTF Object

    const groupRef = useRef();
    // Basically works as a reference to my 3JS Scene Objects, where I keep my objects collectively under reference of groupRef

    const { scene } = useThree();
    // This acts a reference to my internal states of a 3JS Scene. So I can refer this to my camera, or any other stuff also if needed

    const [mixer] = useState(() => new THREE.AnimationMixer());
    // An instance of animation mixer. It can be used to play or pause animations that belong to a model
    /**
     Basically, what happens is that AnimationClip, AnimationAction and AnimationMixer are essential in dealing animations.
     We start with AnimationClip which is a collection of keyframes or different animations that you want to merge and create a clip.
     What the docs say is that AnimationClip( name : String, duration : Number, tracks : Array )
     So think about it, I think you'll figure it out by yourself at least how parameters are passed
     Here ```
     new THREE.AnimationClip(
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

     ```
     If you observe, we create a clip by merging keyframe tracks.

     For AnimationAction, it's that specific action,to that model. Model can contain multiple animations, each animation is an instance of AnimationAction.
     For AnimationClip, it's just an individual collection of keyframes that are neither attached nor exist as animations.
     Hence they exist as just AnimationClip which cannot be played. Only when mixer method clipAction is performed, it creates a clip 'AnimationAction' type, that can be later played around with.
     To play, like pause/play, we need a mixer. Just like we have Play or Pause Music. That controller is nothing but AnimationMixer. So AnimationMixer is generally associated with a single model or a set of related objects,
     and it manages all animations for that model or those objects.

     In short, Clip is a lame collection. Action is the animation from clip.

     */

    const clock = useRef(new THREE.Clock());
    // Sets a clock from the current point of execution

    const [actions, setActions] = useState({});
    // Initializing my collection of associated prebuilt animations with "{}" and then using setActions, to associate it with new set of actions

    const [modelLoaded, setModelLoaded] = useState(false);
    // A state variable that changes when a model is loaded. It basically as expected is initialized to false, and later on when is being imported and loaded shall be set to true

    const [pausedAt, setPausedAt] = useState(0);
    // A state variable that is used to save my state of Pause Time. ThreeJS, pause stops at specific frame, but doesn't save the value of pause timestamp or timeframe or whatever you call that. For that reason we require to implement this using React States

    const modelRef = useRef(null);
    // Reference to the model that I import

    useImperativeHandle(ref, () => ({
        getModel: () => modelRef.current,
        captureTransform,
    }));
    /*
    Cool stuff! Basically my parent App.jsx, wants to access my model reference.
    Hence, in order to work with that, basically what I am doing is, from here,
    I am saying ref refers to the value of modelRef.current, using a method getModel, that shall be returned to the parent object.
     */

    const importModel = useMemo(() => {
        if (importFile) {
            return new Promise((resolve) => {
                importParser(importFile, (gltf) => {
                    const model = gltf.scene;
                    model.name = 'myModel';
                    resetToInitialFrame(modelRef);
                    resolve({ model, animations: gltf.animations || [] });
                });
            });
        }
        return null;
    }, [importFile]);

    useEffect(() => {
        if (importModel) {
            importModel.then(({ model, animations }) => {
                // Clear existing model
                while (groupRef.current.children.length) {
                    groupRef.current.remove(groupRef.current.children[0]);
                }
                groupRef.current.add(model);
                modelRef.current = model;

                const newActions = {};
                // Accessing animations over here. gltf.Animations returns an ArrayType "[]" which contains my animation objects.
                // This thing, is ORRed with empty array, just to ensure empty array, if nothing exists.
                // The "newActions" parameter will basically take stuff like all my existing animations, as well as my new custom animations.
                // Basically, it's literally an animations collection of the object. It contains the pre-existing animations, as well as the animations I would add to my object later.

                animations.forEach((animation) => {
                    const action = mixer.clipAction(animation, model);
                    // Obtain each "animation" from "model"

                    action.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce;
                    // You can add Ping-Ponging over here, like that Boomerang feature if you remember, here.

                    action.clampWhenFinished = !loop;
                    // How to deal with ending of animation. Clamp will reset to initial properties.
                    newActions[animation.name] = action;
                    // Set the playback parameters.
                });

                // Add custom animations
                Object.keys(customAnimations).forEach((name) => {
                    const anim = customAnimations[name];
                    const customClip = createCustomAnimationClip(anim, model.name);
                    const customAction = mixer.clipAction(customClip, model);
                    customAction.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce;
                    customAction.clampWhenFinished = !loop;
                    newActions[name] = customAction;
                });

                setActions(newActions);
                setModelLoaded(true);

                // Update available animations
                const animationNames = [...animations.map(anim => anim.name), ...Object.keys(customAnimations)];
                setAvailableAnimations(animationNames);

                setExportTrigger(() => () => handleExport(modelRef, scene, { scene: model, animations }, animations, customAnimations));
            });
        }
    }, [importModel, mixer, setExportTrigger, loop, customAnimations, setAvailableAnimations, scene]);

    useEffect(() => {
        if (modelLoaded) {
            Object.values(actions).forEach(action => {
                action.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce;
                action.clampWhenFinished = !loop;
            });
        }
    }, [loop, actions, modelLoaded]);

    // This specifically is a R3F Hook, which is performed on every frame change, no matter what.
    useFrame(() => {
        const delta = clock.current.getDelta();
        // Time elapsed since last frame.

        if (animationControl === 'play' && modelLoaded) {
            mixer.update(delta);
            // Time to update the frames by delta.
        }
    });

    useEffect(() => {
        if (modelLoaded) {
            // If modelLoaded boolean state is set to true. Basically if I have my model is ready.
            if (animationControl === 'play') {
                // If the play button is on state to play.

                selectedAnimations.forEach(name => {
                    // All animations, actions associated with that model. Now of the selectedAnimations,
                    // if it is included inside the selected animations, set paused state as false,
                    // and continue to play the animations, using the .play method on that AnimationAction.
                    if (actions[name]) {
                        actions[name].paused = false;
                        actions[name].play();
                    }
                });
                mixer.timeScale = 1;
                // Set the timescale, as 1. Basically, play the animations at 1x. Normal speed.
                // FEATREQ: Feature can be to play the speed.
            } else if (animationControl === 'pause') {
                setPausedAt(mixer.time);
                mixer.timeScale = 0;
                Object.values(actions).forEach(action => {
                    action.paused = true;
                });
                // Self-explanatory, as the before one.
            }
        }
    }, [animationControl, actions, selectedAnimations, modelLoaded, mixer]);

    const captureTransform = () => {
        if (modelRef.current) {
            // Obtain the current reference

            const position = modelRef.current.position.toArray();
            const scale = modelRef.current.scale.toArray();
            const rotation = modelRef.current.rotation.toArray();
            // Obtain the reference position and other stuff

            return { position, scale, rotation };
        } else {
            return null;
        }
    };
    // To be utilised for both position, scale and rotation

    const createCustomAnimationClip = (anim, modelName) => {
        const tracks = [
            new THREE.VectorKeyframeTrack(
                `${modelName}.position`,
                [0, anim.duration],
                [...anim.initialPosition, ...anim.finalPosition]
            ),
            new THREE.VectorKeyframeTrack(
                `${modelName}.scale`,
                [0, anim.duration],
                [...anim.initialScale, ...anim.finalScale]
            ),
            new THREE.QuaternionKeyframeTrack(
                `${modelName}.quaternion`,
                [0, anim.duration],
                [
                    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(...anim.initialRotation.map(r => r * (Math.PI / 180)))).toArray(),
                    ...new THREE.Quaternion().setFromEuler(new THREE.Euler(...anim.finalRotation.map(r => r * (Math.PI / 180)))).toArray()
                ]
            )
        ];
        return new THREE.AnimationClip(anim.name, anim.duration, tracks);
    };

    return (
        <>
            <group
                ref={groupRef}
                onPointerUp={(e) => {
                    e.stopPropagation();
                    onObjectClick(e.object);
                }}
            />
            {showTransformControls && (
                <TransformControlsResponsive
                    modelRef={modelRef}
                />
            )}
        </>
    );
});

export default Model;