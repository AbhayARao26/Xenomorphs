import React, {useEffect, useState} from 'react';
import { useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, DotScreen, Glitch, DepthOfField, SMAA, SSAO, HueSaturation, BrightnessContrast, ChromaticAberration, FXAA } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { Sparkles, Wind, CircleDot, Grid, Zap, Focus, Hexagon, Mountain, Palette, SunMoon, Rainbow, Aperture } from 'lucide-react';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import './effectsPanel.css';

export const EnvironmentalEffects = ({ effects }) => {
    const { size } = useThree();

    return (
        <EffectComposer>
            {effects.bloom.enabled && (
                <Bloom
                    intensity={effects.bloom.intensity}
                    luminanceThreshold={effects.bloom.luminanceThreshold}
                    luminanceSmoothing={effects.bloom.luminanceSmoothing}
                    height={300}
                />
            )}
            {effects.noise.enabled && (
                <Noise
                    premultiply
                    blendFunction={BlendFunction.ADD}
                    opacity={effects.noise.opacity}
                />
            )}
            {effects.vignette.enabled && (
                <Vignette
                    offset={effects.vignette.offset}
                    darkness={effects.vignette.darkness}
                    eskil={false}
                />
            )}
            {effects.dotScreen.enabled && (
                <DotScreen
                    scale={effects.dotScreen.scale}
                    angle={effects.dotScreen.angle}
                />
            )}
            {effects.glitch.enabled && (
                <Glitch
                    delay={effects.glitch.delay}
                    duration={effects.glitch.duration}
                    strength={effects.glitch.strength}
                    mode={GlitchMode.CONSTANT_MILD}
                />
            )}
            {effects.depthOfField.enabled && (
                <DepthOfField
                    focusDistance={effects.depthOfField.focusDistance}
                    focalLength={effects.depthOfField.focalLength}
                    bokehScale={effects.depthOfField.bokehScale}
                />
            )}
            {effects.smaa.enabled && <SMAA />}
            {effects.ssao.enabled && (
                <SSAO
                    radius={effects.ssao.radius}
                    intensity={effects.ssao.intensity}
                    luminanceInfluence={effects.ssao.luminanceInfluence}
                />
            )}
            {effects.hueSaturation.enabled && (
                <HueSaturation
                    hue={effects.hueSaturation.hue}
                    saturation={effects.hueSaturation.saturation}
                />
            )}
            {effects.brightnessContrast.enabled && (
                <BrightnessContrast
                    brightness={effects.brightnessContrast.brightness}
                    contrast={effects.brightnessContrast.contrast}
                />
            )}
            {effects.chromaticAberration.enabled && (
                <ChromaticAberration
                    offset={effects.chromaticAberration.offset}
                />
            )}
        </EffectComposer>
    );
};

export const EnvironmentalEffectsControls = ({ effects, setEffects }) => {
    const [activeEffect, setActiveEffect] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (activeEffect) {
            setIsExpanded(true);
        } else {
            setTimeout(() => setIsExpanded(false), 300);
        }
    }, [activeEffect]);

    const handleEffectToggle = (effectName) => {
        setEffects(prev => ({
            ...prev,
            [effectName]: { ...prev[effectName], enabled: !prev[effectName].enabled }
        }));
        setActiveEffect(prevActive => prevActive === effectName ? null : effectName);
    };

    const handleEffectChange = (effectName, property, value) => {
        setEffects(prev => ({
            ...prev,
            [effectName]: { ...prev[effectName], [property]: value }
        }));
    };

    const getIcon = (effectName) => {
        const icons = {
            bloom: Sparkles, noise: Wind, vignette: CircleDot, dotScreen: Grid,
            glitch: Zap, depthOfField: Focus, smaa: Hexagon, ssao: Mountain,
            hueSaturation: Palette, brightnessContrast: SunMoon,
            chromaticAberration: Rainbow, fxaa: Aperture
        };
        const IconComponent = icons[effectName] || Sparkles;
        return <IconComponent size={16} />;
    };

    const renderPropertyControl = (effectName, propName, propValue) => {
        if (typeof propValue === 'boolean') {
            return (
                <input
                    type="checkbox"
                    checked={propValue}
                    onChange={(e) => handleEffectChange(effectName, propName, e.target.checked)}
                />
            );
        } else if (typeof propValue === 'number') {
            return (
                <div className="slider-container">
                    <input
                        type="range"
                        className="slider"
                        min={0}
                        max={propName.includes('intensity') ? 5 : 1}
                        step={0.01}
                        value={propValue}
                        onChange={(e) => handleEffectChange(effectName, propName, parseFloat(e.target.value))}
                    />
                    <span className="slider-value">{propValue.toFixed(2)}</span>
                </div>
            );
        } else if (Array.isArray(propValue)) {
            return (
                <div>
                    {propValue.map((val, index) => (
                        <input
                            key={index}
                            type="number"
                            value={val}
                            onChange={(e) => {
                                const newArray = [...propValue];
                                newArray[index] = parseFloat(e.target.value);
                                handleEffectChange(effectName, propName, newArray);
                            }}
                        />
                    ))}
                </div>
            );
        }
        return <span>{String(propValue)}</span>;
    };

    return (
        <div className={`effects-panel ${isExpanded ? 'expanded' : ''}`}>
            <div className="effects-panel-title">Post Processing Effects</div>
            <div className="effects-grid">
                {Object.entries(effects).map(([effectName, effectProps]) => (
                    <div key={effectName} className={`effect-control ${activeEffect === effectName ? 'expanded' : ''}`}>
                        <div className="effect-header" onClick={() => handleEffectToggle(effectName)}>
                            <button className={`effect-toggle ${effectProps.enabled ? 'active' : ''}`}>
                                {getIcon(effectName)}
                            </button>
                            <div className="effect-name">{effectName}</div>
                        </div>
                        <div className="effect-properties">
                            {Object.entries(effectProps).map(([propName, propValue]) => (
                                propName !== 'enabled' && (
                                    <div key={propName} className="effect-property">
                                        <label>{propName}</label>
                                        {renderPropertyControl(effectName, propName, propValue)}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default { EnvironmentalEffects, EnvironmentalEffectsControls };