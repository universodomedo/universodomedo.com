import { Line } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import type { OcupanteMapaLogicoSalaJogoWsDto } from 'types-nora-api';

import styles from './CenaSalaJogoR3F.module.css';
import type { DestinoMovimentacaoSalaJogo } from './ContextoMovimentacaoSalaJogo';
import { celulaDoMundo, COR_MOVIMENTACAO, mundoX, mundoZ, paraUnidadeCena, VELOCIDADE_LOCOMOCAO_TESTE_MILIMETROS_POR_SEGUNDO } from './cenaSalaJogo.helpers';

interface PlanoSelecaoMovimentacaoProps { largura: number; altura: number; aoMoverDestino: (destino: DestinoMovimentacaoSalaJogo) => void; aoConfirmarDestino: (destino: DestinoMovimentacaoSalaJogo) => void; };

// Plano invisivel de captura do clique no chao. Geometria em unidade de cena (paraUnidadeCena) — o ponto do raycast (e.point) volta em unidade de cena e o celulaDoMundo o converte de volta pra coordenada logica (mm).
export function PlanoSelecaoMovimentacao({ largura, altura, aoMoverDestino, aoConfirmarDestino }: PlanoSelecaoMovimentacaoProps) {
    function aoMover(e: ThreeEvent<PointerEvent>): void { e.stopPropagation(); aoMoverDestino(celulaDoMundo(e.point.x, e.point.z, largura, altura)); };
    function aoClicar(e: ThreeEvent<MouseEvent>): void { e.stopPropagation(); aoConfirmarDestino(celulaDoMundo(e.point.x, e.point.z, largura, altura)); };

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} onPointerMove={aoMover} onClick={aoClicar}>
            <planeGeometry args={[paraUnidadeCena(largura), paraUnidadeCena(altura)]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
    );
};

interface CaminhoMovimentacaoR3FProps { origem: { x: number; y: number; }; destino: DestinoMovimentacaoSalaJogo; largura: number; altura: number; };

export function CaminhoMovimentacaoR3F({ origem, destino, largura, altura }: CaminhoMovimentacaoR3FProps) {
    const origemMundo: [number, number, number] = [mundoX(origem.x, largura), 0.06, mundoZ(origem.y, altura)];
    const destinoMundo: [number, number, number] = [mundoX(destino.x, largura), 0.06, mundoZ(destino.y, altura)];

    return (
        <>
            <Line points={[origemMundo, destinoMundo]} color={COR_MOVIMENTACAO} lineWidth={2.5} dashed dashSize={0.35} gapSize={0.22} />
            <group position={[destinoMundo[0], 0.03, destinoMundo[2]]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.46, 0.06, 16, 48]} />
                    <meshStandardMaterial color={COR_MOVIMENTACAO} emissive={COR_MOVIMENTACAO} emissiveIntensity={0.75} roughness={0.4} metalness={0.1} />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
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
