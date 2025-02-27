"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Cloud, Clouds } from "@react-three/drei";
import * as THREE from "three";

function FumacaElement() {
    const cloudRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (cloudRef.current) {
            cloudRef.current.rotation.z += 0.0005; // Pequena rotação para movimento sutil
        }
    });

    return (
        <group ref={cloudRef} position={[0, 0, -5]}>
            <Clouds material={THREE.MeshBasicMaterial}>
                <Cloud segments={10} bounds={[10, 2, 2]} volume={30} color="pink" opacity={.02} speed={.6} />
            </Clouds>
        </group>
    );
}

export default function Fumaca() {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: -1,
            }}
        >
            <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
                <FumacaElement />
            </Canvas>
        </div>
    );
}
