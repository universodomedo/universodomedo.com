import { useEffect, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import type { Group } from 'three';
import type { EstadoTemporalSalaDeJogoRuntime, InteragivelPercebidoSalaJogoWsDto, OcupanteMapaLogicoSalaJogoWsDto } from 'types-nora-api';

import { FiguraSerR3F } from './FiguraSerR3F';
import { dimensoesInteragivelCena, encontraMovimentoAtivoControlado, mundoX, mundoZ, posicaoLogicaControladoFiccional } from './cenaSalaJogo.helpers';

interface MarcadorControladoR3FProps { ocupante: OcupanteMapaLogicoSalaJogoWsDto; estadoTemporal: EstadoTemporalSalaDeJogoRuntime; largura: number; altura: number; selecionado: boolean; aoSelecionar?: (keySer: string) => void; };

export function MarcadorControladoR3F({ ocupante, estadoTemporal, largura, altura, selecionado, aoSelecionar }: MarcadorControladoR3FProps) {
    const grupoRef = useRef<Group>(null);
    const referenciaTempoRef = useRef<{ momentoMs: number; recebidoMs: number; limiteMs: number | null; }>({ momentoMs: estadoTemporal.momentoAtualMs, recebidoMs: Date.now(), limiteMs: estadoTemporal.momentoLimiteProjecaoMs });

    useEffect(() => {
        referenciaTempoRef.current = { momentoMs: estadoTemporal.momentoAtualMs, recebidoMs: Date.now(), limiteMs: estadoTemporal.momentoLimiteProjecaoMs };
    }, [estadoTemporal]);

    useFrame(() => {
        const grupo = grupoRef.current;
        if (!grupo) return;
        const movimentoAtivo = encontraMovimentoAtivoControlado(estadoTemporal);
        const posicao = posicaoLogicaControladoFiccional(ocupante.posicao, movimentoAtivo, referenciaTempoRef.current);
        grupo.position.set(mundoX(posicao.x, largura), 0, mundoZ(posicao.y, altura));
    });

    const aoClicar = aoSelecionar === undefined ? undefined : (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); aoSelecionar(ocupante.keySer); };

    return (
        <group ref={grupoRef}>
            <FiguraSerR3F position={[0, 0, 0]} corPrimaria="#2f6f86" corPele="#e0b48f" selecionado={selecionado} aoClicar={aoClicar} />
        </group>
    );
};

interface OcupanteR3FProps { ocupante: OcupanteMapaLogicoSalaJogoWsDto; largura: number; altura: number; selecionado: boolean; aoSelecionar?: (keySer: string) => void; };

export function OcupanteR3F({ ocupante, largura, altura, selecionado, aoSelecionar }: OcupanteR3FProps) {
    const aoClicar = aoSelecionar === undefined ? undefined : (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); aoSelecionar(ocupante.keySer); };
    return <FiguraSerR3F position={[mundoX(ocupante.posicao.x, largura), 0, mundoZ(ocupante.posicao.y, altura)]} corPrimaria="#2f6f86" corPele="#e0b48f" selecionado={selecionado} aoClicar={aoClicar} />;
};

interface InteragivelR3FProps { interagivel: InteragivelPercebidoSalaJogoWsDto; novo: boolean; selecionado: boolean; largura: number; altura: number; aoSelecionar?: (key: string) => void; };

export function InteragivelR3F({ interagivel, novo, selecionado, largura, altura, aoSelecionar }: InteragivelR3FProps) {
    if (interagivel.posicao === null) return null;

    const x = mundoX(interagivel.posicao.x, largura);
    const z = mundoZ(interagivel.posicao.y, altura);
    const aoClicar = aoSelecionar === undefined ? undefined : (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); aoSelecionar(interagivel.key); };

    if (interagivel.tipo === 'ser') return <FiguraSerR3F position={[x, 0, z]} corPrimaria={novo ? '#c79a3f' : '#7484b4'} corPele="#d8b48c" selecionado={selecionado} aoClicar={aoClicar} />;

    const dims = dimensoesInteragivelCena(interagivel);
    const meioAltura = dims.altura / 2;

    return (
        <group position={[x, 0, z]} onClick={aoClicar}>
            {selecionado && <AnelSelecao />}
            <mesh position={[0, meioAltura + 0.15, 0]}>
                <boxGeometry args={[dims.largura + 0.3, dims.altura + 0.3, dims.profundidade + 0.3]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <mesh castShadow position={[0, meioAltura, 0]}>
                <boxGeometry args={[dims.largura, dims.altura, dims.profundidade]} />
                <meshStandardMaterial color={novo ? '#e8c074' : '#8aa0d0'} emissive={selecionado ? '#e8c074' : novo ? '#e8c074' : '#000000'} emissiveIntensity={selecionado ? 0.55 : novo ? 0.25 : 0} roughness={0.5} metalness={0.1} />
            </mesh>
        </group>
    );
};

function AnelSelecao() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
            <torusGeometry args={[0.6, 0.05, 14, 56]} />
            <meshStandardMaterial color="#e8c074" emissive="#e8c074" emissiveIntensity={0.85} roughness={0.4} metalness={0.2} />
        </mesh>
    );
};
