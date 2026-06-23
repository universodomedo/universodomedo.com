'use client';

import { useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import { MOUSE } from 'three';

import type { AcaoBotaoCameraJogo3D, PerfilControleCameraJogo3D } from './cena3D.controles';

interface ControlesCameraJogoProps {
    readonly perfil: PerfilControleCameraJogo3D;
    readonly alvo: [number, number, number];
    readonly distanciaMin: number;
    readonly distanciaMax: number;
};

function traduzAcaoBotaoCameraJogo(acao: AcaoBotaoCameraJogo3D): MOUSE | undefined {
    if (acao === 'rotacionar') return MOUSE.ROTATE;
    if (acao === 'pan') return MOUSE.PAN;
    if (acao === 'zoom') return MOUSE.DOLLY;
    return undefined;
};

export function ControlesCameraJogo({ perfil, alvo, distanciaMin, distanciaMax }: ControlesCameraJogoProps) {
    const mouseButtons = useMemo(() => ({ LEFT: traduzAcaoBotaoCameraJogo(perfil.botaoEsquerdo), MIDDLE: traduzAcaoBotaoCameraJogo(perfil.botaoMeio), RIGHT: traduzAcaoBotaoCameraJogo(perfil.botaoDireito) }), [perfil]);
    const habilitaPan = perfil.botaoEsquerdo === 'pan' || perfil.botaoMeio === 'pan' || perfil.botaoDireito === 'pan';

    return (
        <OrbitControls makeDefault target={alvo} enableDamping={perfil.amortecimento} enablePan={habilitaPan} enableZoom={perfil.rodaZoom} minDistance={distanciaMin} maxDistance={distanciaMax} minPolarAngle={Math.PI * perfil.anguloPolarMinFator} maxPolarAngle={Math.PI * perfil.anguloPolarMaxFator} mouseButtons={mouseButtons} />
    );
};
