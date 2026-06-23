'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

const DIR_PRIMEIRA_PESSOA = new Vector3();

interface ControladorPrimeiraPessoaJogoProps {
    readonly cabecaX: number;
    readonly cabecaY: number;
    readonly cabecaZ: number;
};

// Câmera de 1ª pessoa travada na cabeça do personagem: botão do meio rotaciona (olhar ao redor), roda dá zoom só pra frente (trava no rosto, não vai pra trás). Sem pan.
export function ControladorPrimeiraPessoaJogo({ cabecaX, cabecaY, cabecaZ }: ControladorPrimeiraPessoaJogoProps) {
    const { camera, gl } = useThree();
    const estadoRef = useRef({ yaw: 0, pitch: 0, zoom: 0, arrastando: false, x: 0, y: 0, iniciado: false });

    useEffect(() => {
        const estado = estadoRef.current;
        if (!estado.iniciado) { estado.yaw = Math.atan2(-cabecaX, -cabecaZ); estado.iniciado = true; }
        const dom = gl.domElement;
        const aplica = () => {
            DIR_PRIMEIRA_PESSOA.set(Math.sin(estado.yaw) * Math.cos(estado.pitch), Math.sin(estado.pitch), Math.cos(estado.yaw) * Math.cos(estado.pitch));
            camera.position.set(cabecaX + DIR_PRIMEIRA_PESSOA.x * estado.zoom, cabecaY + DIR_PRIMEIRA_PESSOA.y * estado.zoom, cabecaZ + DIR_PRIMEIRA_PESSOA.z * estado.zoom);
            camera.lookAt(camera.position.x + DIR_PRIMEIRA_PESSOA.x, camera.position.y + DIR_PRIMEIRA_PESSOA.y, camera.position.z + DIR_PRIMEIRA_PESSOA.z);
        };
        aplica();
        const aoApertar = (e: PointerEvent) => { if (e.button !== 1) return; e.preventDefault(); estado.arrastando = true; estado.x = e.clientX; estado.y = e.clientY; };
        const aoMover = (e: PointerEvent) => { if (!estado.arrastando) return; estado.yaw -= (e.clientX - estado.x) * 0.005; estado.pitch = Math.max(-1.3, Math.min(1.3, estado.pitch - (e.clientY - estado.y) * 0.005)); estado.x = e.clientX; estado.y = e.clientY; aplica(); };
        const aoSoltar = (e: PointerEvent) => { if (e.button === 1) estado.arrastando = false; };
        const aoRolar = (e: WheelEvent) => { e.preventDefault(); estado.zoom = Math.max(0, Math.min(2.2, estado.zoom + (e.deltaY < 0 ? 0.2 : -0.2))); aplica(); };
        const aoMenu = (e: Event) => e.preventDefault();
        dom.addEventListener('pointerdown', aoApertar);
        dom.addEventListener('pointermove', aoMover);
        dom.addEventListener('pointerup', aoSoltar);
        dom.addEventListener('wheel', aoRolar, { passive: false });
        dom.addEventListener('contextmenu', aoMenu);
        return () => {
            dom.removeEventListener('pointerdown', aoApertar);
            dom.removeEventListener('pointermove', aoMover);
            dom.removeEventListener('pointerup', aoSoltar);
            dom.removeEventListener('wheel', aoRolar);
            dom.removeEventListener('contextmenu', aoMenu);
        };
    }, [camera, gl, cabecaX, cabecaY, cabecaZ]);

    return null;
};
