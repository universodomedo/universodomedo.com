'use client';

import { useRef, type ComponentProps } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Center, Text3D } from '@react-three/drei';
import type { Group, Object3D } from 'three';
import fonteHelvetikerJson from 'three/examples/fonts/helvetiker_regular.typeface.json';

import type { CameraEditor3D, TextoCapaArteEditor3D } from './editor3D.projeto.serializacao';

type FonteText3D = ComponentProps<typeof Text3D>['font'];
const FONTE_TITULO_CAPA_ARTE_EDITOR3D = fonteHelvetikerJson as unknown as FonteText3D;
const TAMANHO_BASE_TITULO_CAPA_ARTE_EDITOR3D = 0.5;
const PROFUNDIDADE_TITULO_CAPA_ARTE_EDITOR3D = 0.12;

// Marca a malha do texto para o render por camadas (base oculta esta malha; a camada do título mostra só ela).
function marcaCamadaTituloCapaArte(objeto: Object3D): void { objeto.userData.ehCamadaTituloCapaArte = true; };

interface TituloCapaArteEditor3DProps {
    readonly camera: CameraEditor3D;
    readonly titulo: TextoCapaArteEditor3D;
    readonly povAtiva: boolean;
    readonly aoSelecionar: () => void;
};

// Título da Capa de Arte = texto 3D real, filho da câmera-output (transform em espaço da câmera → acompanha o enquadramento). Editável como qualquer objeto (cor/material/transform). Some no POV e quando o texto está vazio.
export function TituloCapaArteEditor3D({ camera, titulo, povAtiva, aoSelecionar }: TituloCapaArteEditor3DProps) {
    const grupoCameraRef = useRef<Group>(null);

    // Orienta o grupo-pai como a câmera-output (lookAt) a cada frame: o texto fica em espaço da câmera (-Z para frente) e acompanha a câmera em tempo real (arrasto/POV).
    useFrame(() => {
        const grupo = grupoCameraRef.current;
        if (!grupo) return;
        grupo.position.set(camera.posicao[0], camera.posicao[1], camera.posicao[2]);
        grupo.lookAt(camera.alvo[0], camera.alvo[1], camera.alvo[2]);
    });

    if (povAtiva || titulo.texto.trim().length === 0) return null;

    function aoClicar(evento: ThreeEvent<MouseEvent>): void { evento.stopPropagation(); aoSelecionar(); };

    return (
        <group ref={grupoCameraRef}>
            <group position={titulo.posicao} rotation={titulo.rotacao} scale={titulo.escala}>
                <Center>
                    <Text3D font={FONTE_TITULO_CAPA_ARTE_EDITOR3D} size={TAMANHO_BASE_TITULO_CAPA_ARTE_EDITOR3D} height={PROFUNDIDADE_TITULO_CAPA_ARTE_EDITOR3D} curveSegments={6} bevelEnabled bevelThickness={0.02} bevelSize={0.012} bevelSegments={2} onUpdate={marcaCamadaTituloCapaArte} onClick={aoClicar}>
                        {titulo.texto}
                        <meshStandardMaterial color={titulo.cor} metalness={0.15} roughness={0.45} />
                    </Text3D>
                </Center>
            </group>
        </group>
    );
};
