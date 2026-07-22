import { useEffect, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import type { Group } from 'three';
import type { EstadoTemporalSalaDeJogoRuntime, InteragivelPercebidoSalaJogoWsDto, OcupanteMapaLogicoSalaJogoWsDto } from 'types-nora-api';

import { FiguraSerR3F } from './FiguraSerR3F';
import { useAlturaApoioNoMapa } from './MapaProjetoR3F';
import { ESPESSURA_PAREDE, dimensoesInteragivelCena, encontraMovimentoAtivoControlado, mundoX, mundoY, paraUnidadeCena, posicaoLogicaControladoFiccional } from './cenaSalaJogo.helpers';

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
        grupo.position.set(mundoX(posicao.x, largura), mundoY(posicao.y, altura), 0);
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
    const x = mundoX(ocupante.posicao.x, largura);
    const y = mundoY(ocupante.posicao.y, altura);
    const alturaApoio = useAlturaApoioNoMapa(x, y);
    const aoClicar = aoSelecionar === undefined ? undefined : (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); aoSelecionar(ocupante.keySer); };
    return <FiguraSerR3F position={[x, y, alturaApoio]} corPrimaria="#2f6f86" corPele="#e0b48f" selecionado={selecionado} aoClicar={aoClicar} />;
};

interface InteragivelR3FProps { interagivel: InteragivelPercebidoSalaJogoWsDto; novo: boolean; selecionado: boolean; largura: number; altura: number; aoSelecionar?: (key: string) => void; };

export function InteragivelR3F({ interagivel, novo, selecionado, largura, altura, aoSelecionar }: InteragivelR3FProps) {
    const x = mundoX(interagivel.posicao?.x ?? 0, largura);
    const y = mundoY(interagivel.posicao?.y ?? 0, altura);
    const alturaApoio = useAlturaApoioNoMapa(x, y);
    if (interagivel.posicao === null) return null;

    const aoClicar = aoSelecionar === undefined ? undefined : (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); aoSelecionar(interagivel.key); };

    if (interagivel.tipo === 'ser') return <FiguraSerR3F position={[x, y, alturaApoio]} corPrimaria={novo ? '#c79a3f' : '#7484b4'} corPele="#d8b48c" selecionado={selecionado} aoClicar={aoClicar} />;

    const dims = dimensoesInteragivelCena(interagivel);
    const meioAltura = dims.altura / 2;
    // Objeto vindo do MAPA: o corpo é a PRÓPRIA malha do mapa (MapaProjetoR3F) — desenhar a caixa dobraria o visual.
    // Fica só o hit-target invisível (clique/seleção sobre a região) + o anel quando selecionado. Como o raycast de
    // apoio encontra o TOPO do próprio corpo (ele é parte do mapa), a base do hit-target desce a própria altura.
    // Z-up: altura no eixo Z; a caixa tem dimensões [X=largura, Y=profundidade, Z=altura].
    const corpoNoMapa = interagivel.idElementoMapa != null;
    const baseZ = corpoNoMapa ? Math.max(0, alturaApoio - dims.altura) : alturaApoio;

    return (
        <group position={[x, y, baseZ]} onClick={aoClicar}>
            {selecionado && <AnelSelecao />}
            <mesh position={[0, 0, meioAltura + 0.15]}>
                <boxGeometry args={[dims.largura + 0.3, dims.profundidade + 0.3, dims.altura + 0.3]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            {!corpoNoMapa && (
                <mesh castShadow position={[0, 0, meioAltura]}>
                    <boxGeometry args={[dims.largura, dims.profundidade, dims.altura]} />
                    <meshStandardMaterial color={novo ? '#e8c074' : '#8aa0d0'} emissive={selecionado ? '#e8c074' : novo ? '#e8c074' : '#000000'} emissiveIntensity={selecionado ? 0.55 : novo ? 0.25 : 0} roughness={0.5} metalness={0.1} />
                </mesh>
            )}
        </group>
    );
};


function AnelSelecao() {
    return (
        <mesh position={[0, 0, 0.03]}>
            <torusGeometry args={[0.6, 0.05, 14, 56]} />
            <meshStandardMaterial color="#e8c074" emissive="#e8c074" emissiveIntensity={0.85} roughness={0.4} metalness={0.2} />
        </mesh>
    );
};
