import { Line } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import type { OcupanteMapaLogicoSalaJogoWsDto } from 'types-nora-api';

import styles from './CenaSalaJogoR3F.module.css';
import type { DestinoMovimentacaoSalaJogo } from './ContextoMovimentacaoSalaJogo';
import { celulaDoMundo, COR_MOVIMENTACAO, mundoX, mundoY, paraUnidadeCena, VELOCIDADE_LOCOMOCAO_TESTE_MILIMETROS_POR_SEGUNDO } from './cenaSalaJogo.helpers';
import { useAlturaApoioNoMapa } from './MapaProjetoR3F';

interface PlanoSelecaoMovimentacaoProps { largura: number; altura: number; aoMoverDestino: (destino: DestinoMovimentacaoSalaJogo) => void; aoConfirmarDestino: (destino: DestinoMovimentacaoSalaJogo) => void; };

// Plano invisivel de captura do clique no chao. Geometria em unidade de cena (paraUnidadeCena) — o ponto do raycast (e.point) volta em unidade de cena e o celulaDoMundo o converte de volta pra coordenada logica (mm).
export function PlanoSelecaoMovimentacao({ largura, altura, aoMoverDestino, aoConfirmarDestino }: PlanoSelecaoMovimentacaoProps) {
    // Z-up: o chão é o plano XY (planeGeometry já nasce em XY, sem rotação); o ponto do raycast volta em unidade de cena e celulaDoMundo usa (x, y).
    function aoMover(e: ThreeEvent<PointerEvent>): void { e.stopPropagation(); aoMoverDestino(celulaDoMundo(e.point.x, e.point.y, largura, altura)); };
    function aoClicar(e: ThreeEvent<MouseEvent>): void { e.stopPropagation(); aoConfirmarDestino(celulaDoMundo(e.point.x, e.point.y, largura, altura)); };

    return (
        <mesh position={[0, 0, 0.02]} onPointerMove={aoMover} onClick={aoClicar}>
            <planeGeometry args={[paraUnidadeCena(largura), paraUnidadeCena(altura)]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
    );
};

interface CaminhoMovimentacaoR3FProps { origem: { x: number; y: number; }; destino: DestinoMovimentacaoSalaJogo; largura: number; altura: number; };

export function CaminhoMovimentacaoR3F({ origem, destino, largura, altura }: CaminhoMovimentacaoR3FProps) {
    // Z-up: altura no eixo Z; torus/circle já nascem no plano XY (sem rotação). O traço/anel ficam rente ao TOPO do piso
    // do MAPA (mesmo raycast de apoio dos atores) — com z fixo ~0 eles ficavam ENTERRADOS dentro da laje de um piso com
    // espessura: o clique funcionava (o raycast do plano atravessa a geometria) e o visual sumia. Sem mapa, apoio = 0.
    const alturaOrigem = useAlturaApoioNoMapa(mundoX(origem.x, largura), mundoY(origem.y, altura));
    const alturaDestino = useAlturaApoioNoMapa(mundoX(destino.x, largura), mundoY(destino.y, altura));
    const origemMundo: [number, number, number] = [mundoX(origem.x, largura), mundoY(origem.y, altura), alturaOrigem + 0.06];
    const destinoMundo: [number, number, number] = [mundoX(destino.x, largura), mundoY(destino.y, altura), alturaDestino + 0.06];

    return (
        <>
            <Line points={[origemMundo, destinoMundo]} color={COR_MOVIMENTACAO} lineWidth={2.5} dashed dashSize={0.35} gapSize={0.22} />
            <group position={[destinoMundo[0], destinoMundo[1], alturaDestino + 0.03]}>
                <mesh>
                    <torusGeometry args={[0.46, 0.06, 16, 48]} />
                    <meshStandardMaterial color={COR_MOVIMENTACAO} emissive={COR_MOVIMENTACAO} emissiveIntensity={0.75} roughness={0.4} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0, 0.001]}>
                    <circleGeometry args={[0.4, 40]} />
                    <meshBasicMaterial color={COR_MOVIMENTACAO} transparent opacity={0.18} depthWrite={false} />
                </mesh>
            </group>
        </>
    );
};

interface OverlayMovimentacaoProps { ocupanteControlado: OcupanteMapaLogicoSalaJogoWsDto | null; celulaHoverDestino: DestinoMovimentacaoSalaJogo | null; };

export function OverlayMovimentacao({ ocupanteControlado, celulaHoverDestino }: OverlayMovimentacaoProps) {
    if (!ocupanteControlado || !celulaHoverDestino) return <div className={styles.overlay_movimentacao}>Clique no chão para definir o destino</div>;

    const distanciaMilimetros = Math.hypot(celulaHoverDestino.x - ocupanteControlado.posicao.x, celulaHoverDestino.y - ocupanteControlado.posicao.y);
    const tempoSegundos = distanciaMilimetros / VELOCIDADE_LOCOMOCAO_TESTE_MILIMETROS_POR_SEGUNDO;

    return <div className={styles.overlay_movimentacao}>Distância: {distanciaMilimetros.toFixed(0)} mm · Tempo: {tempoSegundos.toFixed(1)} s</div>;
};
