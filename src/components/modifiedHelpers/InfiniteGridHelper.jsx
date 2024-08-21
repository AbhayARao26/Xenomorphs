import * as THREE from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

class InfiniteGridHelper extends THREE.Mesh {
    constructor(size1, size2, color, distance, axes = 'xzy') {
        color = color || new THREE.Color('white');
        size1 = size1 || 10;
        size2 = size2 || 100;
        distance = distance || 8000;

        const planeAxes = axes.substr(0, 2);

        const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                uSize1: { value: size1 },
                uSize2: { value: size2 },
                uColor: { value: color },
                uDistance: { value: distance },
            },
            transparent: true,
            vertexShader: `
        varying vec3 worldPosition;
        uniform float uDistance;
        void main() {
          vec3 pos = position.${axes} * uDistance;
          pos.${planeAxes} += cameraPosition.${planeAxes};
          worldPosition = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
            fragmentShader: `
        varying vec3 worldPosition;
        uniform float uSize1;
        uniform float uSize2;
        uniform vec3 uColor;
        uniform float uDistance;
        float getGrid(float size) {
          vec2 r = worldPosition.${planeAxes} / size;
          vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
          float line = min(grid.x, grid.y);
          return 1.0 - min(line, 1.0);
        }
        void main() {
          float g1 = getGrid(uSize1);
          float g2 = getGrid(uSize2);
          gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1));
          if (gl_FragColor.a <= 0.0) discard;
        }
      `,
            extensions: { derivatives: true },
        });

        super(geometry, material);
        this.frustumCulled = false;
    }
}

extend({ InfiniteGridHelper });

const InfiniteGrid = ({ size1 = 10, size2 = 100, color = 'white', distance = 8000, axes = 'xzy' }) => {
    const ref = useRef();
    const { camera } = useThree();

    useEffect(() => {
        if (ref.current) {
            ref.current.material.uniforms.uColor.value = new THREE.Color(color);
            ref.current.material.uniforms.uSize1.value = size1;
            ref.current.material.uniforms.uSize2.value = size2;
            ref.current.material.uniforms.uDistance.value = distance;
        }
    }, [size1, size2, color, distance, axes]);

    useFrame(() => {
        if (ref.current) {
            ref.current.material.uniformsNeedUpdate = true;
        }
    });

    return <infiniteGridHelper ref={ref} args={[size1, size2, color, distance, axes]} />;
};

export default InfiniteGrid;
