'use client';

import { useRef } from 'react';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { EventDispatcher } from 'three';

import styles from './SeletorPosicaoMapa.module.css';

import { MapaProjetoR3F, useAlturaApoioNoMapa } from 'Componentes/ElementosDeJogo/TelaDeJogo/MapaProjetoR3F';
import { celulaDoMundo, mundoX, mundoZ, useReforcaRedimensionamentoCanvas } from 'Componentes/ElementosDeJogo/TelaDeJogo/cenaSalaJogo.helpers';
import { useProjetoMapa } from 'Funcionalidades/MapaJogavel/useProjetoMapa';

type PosicaoMapa = { x: number; y: number };
type MarcadorContexto = { key: string; posicao: PosicaoMapa; rotulo: string };

type Props = {
    larguraMilimetros: number;
    alturaMilimetros: number;
    // Projeto 3D (tipo MAPA) do cenário: o PRÓPRIO mapa é carregado na cena para posicionar dentro dele. null = sem mapa (aviso).
    idProjetoMapa?: number | null;
    posicao: PosicaoMapa;
    aoMudarPosicao: (posicao: PosicaoMapa) => void;
    rotuloAtivo: string;
    marcadoresContexto?: readonly MarcadorContexto[];
};

// Picker de posição DENTRO do mapa 3D real: a cena do Projeto (tipo MAPA) é carregada como no jogo, a câmera é livre
// (orbitar/zoom/pan) e o interagível é posicionado ARRASTANDO no chão do mapa — precisão milimétrica, sem snap.
export function SeletorPosicaoMapa({ larguraMilimetros, alturaMilimetros, idProjetoMapa = null, posicao, aoMudarPosicao, rotuloAtivo, marcadoresContexto = [] }: Props) {
    useReforcaRedimensionamentoCanvas();
    const { projetoMapa, carregandoMapa } = useProjetoMapa(idProjetoMapa);
    const cenaMapa = projetoMapa?.cenaCanonica ?? null;
    const extensao = Math.max(larguraMilimetros, alturaMilimetros) / 1000;
    const distancia = Math.max(8, extensao * 1.15);

    return (
        <div className={styles.seletor}>
            <div className={styles.cena_mapa}>
                {cenaMapa !== null ? (
                    <Canvas shadows dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [0.5 + distancia * 0.62, distancia * 0.8, 0.5 + distancia * 0.62], fov: 38, near: 0.1, far: distancia * 8 }}>
                        <color attach="background" args={['#0e0c14']} />
                        <ambientLight intensity={0.65} color="#eef2f6" />
                        <hemisphereLight intensity={0.45} color="#f4f7fb" groundColor="#9aa1ad" />
                        <directionalLight castShadow position={[8, 12, 6]} intensity={1.0} color="#fff4e2" />

                        <MapaProjetoR3F cena={cenaMapa} largura={larguraMilimetros} altura={alturaMilimetros} />
                        <PlanoArrastoPosicao largura={larguraMilimetros} altura={alturaMilimetros} aoMudarPosicao={aoMudarPosicao} />

                        {marcadoresContexto.map(marcador => <MarcadorContextoAssentado key={marcador.key} x={mundoX(marcador.posicao.x, larguraMilimetros)} z={mundoZ(marcador.posicao.y, alturaMilimetros)} />)}
                        <MarcadorPosicaoAtiva x={mundoX(posicao.x, larguraMilimetros)} z={mundoZ(posicao.y, alturaMilimetros)} />

                        <OrbitControls makeDefault enablePan enableZoom enableRotate enableDamping target={[0.5, 0, 0.5]} minDistance={1.5} maxDistance={distancia * 4} />
                    </Canvas>
                ) : (
                    <span className={styles.aviso_mapa}>{idProjetoMapa == null ? 'Selecione um Mapa no Cenário para posicionar.' : carregandoMapa ? 'Carregando o mapa…' : 'Mapa indisponível.'}</span>
                )}
            </div>
            <p className={styles.leitura}>{rotuloAtivo}: {posicao.x}mm, {posicao.y}mm — mapa {larguraMilimetros}mm × {alturaMilimetros}mm. Arraste no chão do mapa para posicionar; câmera livre (orbitar/zoom/pan).</p>
        </div>
    );
};

// Plano invisível no nível do chão lógico: recebe o arrasto e converte o ponto 3D em coordenada lógica (mm, contínua).
// O plano é ESTÁTICO — onPointerMove do R3F é seguro aqui (o gotcha de realimentação vale só para mesh que se move sob o ponteiro).
function PlanoArrastoPosicao({ largura, altura, aoMudarPosicao }: { largura: number; altura: number; aoMudarPosicao: (posicao: PosicaoMapa) => void }) {
    const controles = useThree(estado => estado.controls);
    const arrastandoRef = useRef(false);

    function aplica(evento: ThreeEvent<PointerEvent>): void {
        aoMudarPosicao(celulaDoMundo(evento.point.x, evento.point.z, largura, altura));
    };

    function aoDescer(evento: ThreeEvent<PointerEvent>): void {
        if (evento.nativeEvent.button !== 0) return;
        evento.stopPropagation();
        arrastandoRef.current = true;
        if (controles) (controles as EventDispatcher & { enabled: boolean }).enabled = false;
        (evento.target as Element).setPointerCapture(evento.pointerId);
        aplica(evento);
    };

    function aoMover(evento: ThreeEvent<PointerEvent>): void {
        if (!arrastandoRef.current) return;
        aplica(evento);
    };

    function aoSoltar(evento: ThreeEvent<PointerEvent>): void {
        if (!arrastandoRef.current) return;
        arrastandoRef.current = false;
        if (controles) (controles as EventDispatcher & { enabled: boolean }).enabled = true;
        (evento.target as Element).releasePointerCapture(evento.pointerId);
    };

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.01, 0.5]} onPointerDown={aoDescer} onPointerMove={aoMover} onPointerUp={aoSoltar} onPointerCancel={aoSoltar}>
            <planeGeometry args={[largura / 1000, altura / 1000]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
    );
};

// Marcador dos demais interagíveis, ASSENTADO na superfície do mapa no seu XZ (camadas — sobre o piso, não sob ele).
function MarcadorContextoAssentado({ x, z }: { x: number; z: number }) {
    const alturaApoio = useAlturaApoioNoMapa(x, z);
    return (
        <mesh position={[x, alturaApoio + 0.12, z]} raycast={() => null}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color="#EBE0C9" transparent opacity={0.55} roughness={0.6} />
        </mesh>
    );
};

// Pino do interagível em edição: haste + cabeça dourada, ASSENTADO na superfície do mapa no seu XZ.
function MarcadorPosicaoAtiva({ x, z }: { x: number; z: number }) {
    const alturaApoio = useAlturaApoioNoMapa(x, z);
    return (
        <group position={[x, alturaApoio, z]} raycast={() => null}>
            <mesh position={[0, 0.65, 0]} raycast={() => null}>
                <cylinderGeometry args={[0.035, 0.035, 1.3, 10]} />
                <meshStandardMaterial color="#B79051" roughness={0.45} metalness={0.35} />
            </mesh>
            <mesh position={[0, 1.42, 0]} raycast={() => null}>
                <sphereGeometry args={[0.17, 16, 16]} />
                <meshStandardMaterial color="#B79051" emissive="#B79051" emissiveIntensity={0.45} roughness={0.4} metalness={0.3} />
            </mesh>
        </group>
    );
};
