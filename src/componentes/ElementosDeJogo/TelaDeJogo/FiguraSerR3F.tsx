'use client';

import { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry, MeshStandardMaterial } from 'three';
import { MarchingCubes } from 'three-stdlib';

// Figura do Ser na cena 3D. É uma SUPERFÍCIE CONTÍNUA gerada por metaballs (marching cubes): vários influenciadores esféricos
// (cabeça, tronco, quadril, braços, pernas) se fundem numa única casca lisa — sem os vãos/silhuetas soltas das primitivas.
// Tudo procedural, sem nenhum arquivo/asset externo (respeita CSP e o objetivo de não depender de malhas salvas).
//
// PONTO DE TROCA (modelo do Ser vindo do banco):
// Quando o Ser tiver corpo autorado (no Editor 3D) e persistido — como DADOS (parâmetros/campo de metaballs) ou como malha —,
// a troca acontece SÓ aqui: `obtemGeometriaSer()` passa a construir a partir desses dados em vez do gabarito fixo `BOLAS_SER`
// abaixo (ou, se for malha glTF, trocar `<mesh geometry=...>` por `<primitive object={scene}/>`). A API pública desta figura
// (position, corPrimaria, selecionado, aoClicar) e todo o CenaSalaJogoR3F permanecem iguais.

interface FiguraSerR3FProps {
    position: [number, number, number];
    corPrimaria: string;
    corPele: string;
    selecionado?: boolean;
    aoClicar?: (e: ThreeEvent<MouseEvent>) => void;
};

// Gabarito do corpo em coordenadas normalizadas do campo [0,1] (x lateral, y vertical, z profundidade), espelhado L/R.
// Cada bola: [x, y, z, força, subtração]. Força maior = massa maior; subtração maior = queda mais fechada (membro mais fino/definido).
type Bola = [number, number, number, number, number];

function espelha(bolas: readonly Bola[]): Bola[] {
    return bolas.flatMap(([x, y, z, f, s]) => x === 0.5 ? [[x, y, z, f, s] as Bola] : [[x, y, z, f, s] as Bola, [1 - x, y, z, f, s] as Bola]);
};

const BOLAS_SER: Bola[] = espelha([
    [0.500, 0.865, 0.500, 0.92, 15],  // cabeça
    [0.500, 0.780, 0.500, 0.28, 24],  // pescoço
    [0.500, 0.700, 0.500, 0.74, 16],  // peito
    [0.500, 0.605, 0.500, 0.50, 18],  // cintura
    [0.500, 0.520, 0.500, 0.70, 16],  // quadril
    [0.620, 0.715, 0.500, 0.42, 18],  // ombro
    [0.672, 0.630, 0.500, 0.36, 20],  // braço
    [0.692, 0.545, 0.500, 0.32, 21],  // antebraço
    [0.702, 0.460, 0.500, 0.30, 22],  // mão
    [0.588, 0.400, 0.500, 0.54, 18],  // coxa
    [0.592, 0.270, 0.500, 0.46, 20],  // joelho
    [0.592, 0.150, 0.500, 0.42, 21],  // canela
    [0.592, 0.068, 0.548, 0.40, 21]   // pé (levemente à frente)
]);

const RESOLUCAO_CAMPO = 56;
const ISOLAMENTO = 80;
const MAX_POLIGONOS = 120000;

// Geometria construída UMA vez e compartilhada por todas as figuras (só a cor/material varia por Ser). Cache de módulo.
let geometriaCache: BufferGeometry | null = null;

function obtemGeometriaSer(): BufferGeometry {
    if (geometriaCache) return geometriaCache;
    // Esta versão do MarchingCubes preenche `campo.geometry` (buffer pré-alocado + drawRange) via update(); extraímos a fatia usada
    // (`campo.count` vértices) numa BufferGeometry compacta e estática, descartando o campo. Sem WebGL — só matemática, seguro no SSR.
    const campo = new MarchingCubes(RESOLUCAO_CAMPO, new MeshStandardMaterial(), false, false, MAX_POLIGONOS);
    campo.isolation = ISOLAMENTO;
    campo.reset();
    for (const [x, y, z, forca, subtracao] of BOLAS_SER) campo.addBall(x, y, z, forca, subtracao);
    campo.update();
    const totalFloats = campo.count * 3;
    const posicoes = (campo.geometry.getAttribute('position').array as Float32Array).slice(0, totalFloats);
    const normais = (campo.geometry.getAttribute('normal').array as Float32Array).slice(0, totalFloats);
    const geometria = new BufferGeometry();
    geometria.setAttribute('position', new BufferAttribute(posicoes, 3));
    geometria.setAttribute('normal', new BufferAttribute(normais, 3));
    campo.geometry.dispose();
    geometriaCache = geometria;
    return geometria;
};

// Escala/posição que levam o campo [-1,1] gerado ao humano em metros, com os pés no chão (y=0).
const ESCALA_FIGURA: [number, number, number] = [0.77, 1.14, 0.585];
const DESLOCAMENTO_Y = 0.93;

function AnelSelecaoFigura() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
            <torusGeometry args={[0.6, 0.05, 14, 56]} />
            <meshStandardMaterial color="#e8c074" emissive="#e8c074" emissiveIntensity={0.85} roughness={0.4} metalness={0.2} />
        </mesh>
    );
};

export function FiguraSerR3F({ position, corPrimaria, selecionado = false, aoClicar }: FiguraSerR3FProps) {
    const geometria = obtemGeometriaSer();
    const material = useMemo(() => new MeshStandardMaterial({ color: corPrimaria, roughness: 0.52, metalness: 0.06 }), [corPrimaria]);

    material.emissive.set(selecionado ? '#e8c074' : '#000000');
    material.emissiveIntensity = selecionado ? 0.45 : 0;

    return (
        <group position={position} onClick={aoClicar}>
            {selecionado && <AnelSelecaoFigura />}

            <mesh position={[0, 0.9, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 1.8, 8]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            <mesh geometry={geometria} material={material} position={[0, DESLOCAMENTO_Y, 0]} scale={ESCALA_FIGURA} castShadow receiveShadow />
        </group>
    );
};
