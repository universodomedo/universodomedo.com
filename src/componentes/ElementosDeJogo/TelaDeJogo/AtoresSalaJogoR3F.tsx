import { useEffect, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import type { Group } from 'three';
import type { EstadoTemporalSalaDeJogoRuntime, InteragivelPercebidoSalaJogoWsDto, OcupanteMapaLogicoSalaJogoWsDto, PortaMapaSalaJogoWsDto } from 'types-nora-api';

import { FiguraSerR3F } from './FiguraSerR3F';
import { ESPESSURA_PAREDE, dimensoesInteragivelCena, encontraMovimentoAtivoControlado, mundoX, mundoZ, paraUnidadeCena, posicaoLogicaControladoFiccional } from './cenaSalaJogo.helpers';

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
    // Vinculado a uma Porta do mapa: o visual e a porta na parede (PortaMapaR3F), nao uma caixa no chao.
    if (interagivel.vinculoElementoMapa) return null;

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

interface PortaMapaR3FProps { porta: PortaMapaSalaJogoWsDto; largura: number; altura: number; };

// Porta = elemento estrutural do mapa: batente + folha EMBUTIDOS no plano da parede (não caixa flutuante no chão).
// orientacaoGraus 0 = parede N/S (horizontal, ao longo de X); 90 = parede L/O (vertical, ao longo de Y).
export function PortaMapaR3F({ porta, largura, altura }: PortaMapaR3FProps) {
    const larguraCena = paraUnidadeCena(porta.larguraMilimetros);
    const alturaCena = paraUnidadeCena(porta.alturaMilimetros);
    const larguraSalaCena = paraUnidadeCena(largura);
    const alturaSalaCena = paraUnidadeCena(altura);
    const horizontal = Math.abs(((porta.orientacaoGraus % 180) + 180) % 180) < 45;
    // Ao longo da parede segue os atores (mundo*, com o +0.5); no eixo PERPENDICULAR encaixa no plano da parede (±extensão/2, sem o +0.5) — some o vão de 0.5 que fazia a folha flutuar.
    const x = horizontal ? mundoX(porta.posicao.x, largura) : (porta.posicao.x <= largura / 2 ? -larguraSalaCena / 2 : larguraSalaCena / 2);
    const z = horizontal ? (porta.posicao.y <= altura / 2 ? -alturaSalaCena / 2 : alturaSalaCena / 2) : mundoZ(porta.posicao.y, altura);
    const espessura = ESPESSURA_PAREDE * 1.06; // levemente mais que a parede: a folha cobre a seção da parede sem z-fighting nem vão.
    return (
        <group position={[x, 0, z]} rotation={[0, (porta.orientacaoGraus * Math.PI) / 180, 0]}>
            <mesh castShadow receiveShadow position={[0, alturaCena / 2 + 0.06, 0]}>
                <boxGeometry args={[larguraCena + 0.2, alturaCena + 0.2, espessura]} />
                <meshStandardMaterial color="#463620" roughness={0.85} metalness={0.05} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, alturaCena / 2, 0]}>
                <boxGeometry args={[larguraCena, alturaCena, espessura * 1.12]} />
                <meshStandardMaterial color="#7a5a34" roughness={0.75} metalness={0.05} />
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
