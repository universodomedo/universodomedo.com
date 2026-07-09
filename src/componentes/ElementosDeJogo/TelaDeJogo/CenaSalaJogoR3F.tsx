'use client';

import styles from './CenaSalaJogoR3F.module.css';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Grid, Line } from '@react-three/drei';
import type { Group } from 'three';
import type { EstadoTemporalSalaDeJogoRuntime, InteragivelPercebidoSalaJogoWsDto, MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto } from 'types-nora-api';

import { ControlesCameraJogo } from 'Componentes/ElementosDeJogo/Cena3D/ControlesCameraJogo';
import { PERFIL_CAMERA_TATICA } from 'Componentes/ElementosDeJogo/Cena3D/cena3D.controles';
import { ControladorPrimeiraPessoaJogo } from 'Componentes/ElementosDeJogo/Cena3D/ControladorPrimeiraPessoaJogo';
import { FiguraSerR3F } from './FiguraSerR3F';
import type { DestinoMovimentacaoSalaJogo } from './ContextoMovimentacaoSalaJogo';

const ALTURA_PAREDE = 3.6;
const ESPESSURA_PAREDE = 0.3;
const ALTURA_OLHOS = 1.55;
const VELOCIDADE_LOCOMOCAO_TESTE_MILIMETROS_POR_SEGUNDO = 1000;
const COR_MOVIMENTACAO = '#4ade80';

// O dado vive em milimetros (precisao cheia); a cena Three.js renderiza numa escala confortavel: 1 unidade de cena = 1000 mm. So o DESENHO escala — nenhum arredondamento no dado.
const MILIMETROS_POR_UNIDADE_CENA = 1000;
function paraUnidadeCena(valorMilimetros: number): number { return valorMilimetros / MILIMETROS_POR_UNIDADE_CENA; };

function mundoX(x: number, largura: number): number { return paraUnidadeCena(x - largura / 2) + 0.5; };
function mundoZ(y: number, altura: number): number { return paraUnidadeCena(y - altura / 2) + 0.5; };
function celulaDoMundo(pontoX: number, pontoZ: number, largura: number, altura: number): DestinoMovimentacaoSalaJogo {
    const x = Math.min(Math.max(Math.round((pontoX - 0.5) * MILIMETROS_POR_UNIDADE_CENA + largura / 2), 0), largura);
    const y = Math.min(Math.max(Math.round((pontoZ - 0.5) * MILIMETROS_POR_UNIDADE_CENA + altura / 2), 0), altura);
    return { x, y };
};
function projetaMomentoFiccional(momentoMs: number, momentoLimiteMs: number | null): number { return momentoLimiteMs === null ? momentoMs : Math.min(momentoMs, momentoLimiteMs); };

// O shell do app anima a escala do container na entrada; o R3F mede o canvas antes do layout assentar e fica em tamanho zero (cena preta). Reforçamos a remedição depois que assenta.
function useReforcaRedimensionamentoCanvas() {
    useEffect(() => {
        const tempos = [120, 360, 720].map(ms => window.setTimeout(() => window.dispatchEvent(new Event('resize')), ms));
        return () => tempos.forEach(window.clearTimeout);
    }, []);
};

interface CenaSalaJogoR3FProps {
    readonly payload: MapaLogicoSalaJogoPayloadWsDto;
    readonly keysInteragiveisPercebidosNovos: readonly string[];
    readonly keyOcupanteSelecionado: string | null;
    readonly keyInteragivelSelecionado: string | null;
    readonly estadoTemporalSalaJogo: EstadoTemporalSalaDeJogoRuntime | null;
    readonly modoMovimentacaoAtivo: boolean;
    readonly aoSelecionarOcupante: (keySer: string) => void;
    readonly aoSelecionarInteragivel: (key: string) => void;
    readonly aoLimparSelecao: () => void;
    readonly aoConfirmarMovimentacao: (destino: DestinoMovimentacaoSalaJogo) => void;
    readonly aoCancelarMovimentacao: () => void;
};

export function CenaSalaJogoR3F({ payload, keysInteragiveisPercebidosNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, estadoTemporalSalaJogo, modoMovimentacaoAtivo, aoSelecionarOcupante, aoSelecionarInteragivel, aoLimparSelecao, aoConfirmarMovimentacao, aoCancelarMovimentacao }: CenaSalaJogoR3FProps) {
    const [principal, setPrincipal] = useState<'tatico' | 'fp'>('tatico');

    // Modo Solo: o jogador é o único ocupante (o primeiro). Quando houver multiplayer/identidade, casar por idFicha da ficha do jogador.
    const ocupanteJogador = payload.ocupantesMapaLogico[0] ?? null;

    const classeTatica = principal === 'tatico' ? styles.vista_principal : styles.vista_secundaria;
    const classeFp = principal === 'fp' ? styles.vista_principal : styles.vista_secundaria;

    return (
        <div className={styles.recipiente_cena_r3f}>
            <VistaTaticaSalaJogo className={classeTatica} payload={payload} keysNovos={keysInteragiveisPercebidosNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} estadoTemporalSalaJogo={estadoTemporalSalaJogo} modoMovimentacaoAtivo={modoMovimentacaoAtivo} aoSelecionarOcupante={aoSelecionarOcupante} aoSelecionarInteragivel={aoSelecionarInteragivel} aoLimparSelecao={aoLimparSelecao} aoConfirmarMovimentacao={aoConfirmarMovimentacao} aoCancelarMovimentacao={aoCancelarMovimentacao} />
            <VistaPrimeiraPessoaSalaJogo className={classeFp} payload={payload} keysNovos={keysInteragiveisPercebidosNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} ocupanteJogador={ocupanteJogador} />

            <div className={styles.moldura_secundaria}>
                <button type="button" className={styles.botao_troca_visao} onClick={() => setPrincipal(p => (p === 'tatico' ? 'fp' : 'tatico'))} title="Trocar visão principal" aria-label="Trocar visão principal">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f0d28a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 8 17 8" />
                        <polyline points="14 5 17 8 14 11" />
                        <polyline points="21 16 7 16" />
                        <polyline points="10 13 7 16 10 19" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

interface VistaTaticaSalaJogoProps {
    readonly className: string;
    readonly payload: MapaLogicoSalaJogoPayloadWsDto;
    readonly keysNovos: readonly string[];
    readonly keyOcupanteSelecionado: string | null;
    readonly keyInteragivelSelecionado: string | null;
    readonly estadoTemporalSalaJogo: EstadoTemporalSalaDeJogoRuntime | null;
    readonly modoMovimentacaoAtivo: boolean;
    readonly aoSelecionarOcupante: (keySer: string) => void;
    readonly aoSelecionarInteragivel: (key: string) => void;
    readonly aoLimparSelecao: () => void;
    readonly aoConfirmarMovimentacao: (destino: DestinoMovimentacaoSalaJogo) => void;
    readonly aoCancelarMovimentacao: () => void;
};

function VistaTaticaSalaJogo({ className, payload, keysNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, estadoTemporalSalaJogo, modoMovimentacaoAtivo, aoSelecionarOcupante, aoSelecionarInteragivel, aoLimparSelecao, aoConfirmarMovimentacao, aoCancelarMovimentacao }: VistaTaticaSalaJogoProps) {
    useReforcaRedimensionamentoCanvas();
    const extensao = paraUnidadeCena(Math.max(payload.mapaLogico.larguraMilimetros, payload.mapaLogico.alturaMilimetros));
    const distancia = Math.max(8, extensao * 1.15);
    const [celulaHoverDestino, setCelulaHoverDestino] = useState<DestinoMovimentacaoSalaJogo | null>(null);
    const ocupanteControlado = payload.ocupantesMapaLogico[0] ?? null;

    useEffect(() => {
        if (modoMovimentacaoAtivo) return;
        setCelulaHoverDestino(null);
    }, [modoMovimentacaoAtivo]);

    useEffect(() => {
        if (!modoMovimentacaoAtivo) return;
        function aoTeclar(evento: KeyboardEvent): void { if (evento.key === 'Escape') aoCancelarMovimentacao(); };
        window.addEventListener('keydown', aoTeclar);
        return () => window.removeEventListener('keydown', aoTeclar);
    }, [modoMovimentacaoAtivo, aoCancelarMovimentacao]);

    function aoErrarClique(e: MouseEvent) { if (e.button !== 0) return; if (modoMovimentacaoAtivo) { aoCancelarMovimentacao(); return; } aoLimparSelecao(); };

    return (
        <div className={className}>
            <Canvas shadows dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [distancia * 0.62, distancia * 0.8, distancia * 0.62], fov: 34, near: 0.1, far: distancia * 8 }} onPointerMissed={aoErrarClique}>
                <ConteudoCena3DSalaJogo payload={payload} keysNovos={keysNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} estadoTemporalSalaJogo={estadoTemporalSalaJogo} modoMovimentacaoAtivo={modoMovimentacaoAtivo} celulaHoverDestino={celulaHoverDestino} aoMoverDestino={setCelulaHoverDestino} aoConfirmarDestino={aoConfirmarMovimentacao} aoSelecionarOcupante={aoSelecionarOcupante} aoSelecionarInteragivel={aoSelecionarInteragivel} />
                <ControlesCameraJogo perfil={PERFIL_CAMERA_TATICA} alvo={[0, 0.6, 0]} distanciaMin={Math.max(4, extensao * 0.35)} distanciaMax={extensao * 1.9} />
            </Canvas>
            {modoMovimentacaoAtivo && <OverlayMovimentacao ocupanteControlado={ocupanteControlado} celulaHoverDestino={celulaHoverDestino} />}
        </div>
    );
};

interface OverlayMovimentacaoProps {
    readonly ocupanteControlado: OcupanteMapaLogicoSalaJogoWsDto | null;
    readonly celulaHoverDestino: DestinoMovimentacaoSalaJogo | null;
};

function OverlayMovimentacao({ ocupanteControlado, celulaHoverDestino }: OverlayMovimentacaoProps) {
    if (!ocupanteControlado || !celulaHoverDestino) return <div className={styles.overlay_movimentacao}>Clique no chão para definir o destino</div>;

    const distanciaMilimetros = Math.hypot(celulaHoverDestino.x - ocupanteControlado.posicao.x, celulaHoverDestino.y - ocupanteControlado.posicao.y);
    const tempoSegundos = distanciaMilimetros / VELOCIDADE_LOCOMOCAO_TESTE_MILIMETROS_POR_SEGUNDO;

    return <div className={styles.overlay_movimentacao}>Distância: {distanciaMilimetros.toFixed(0)} mm · Tempo: {tempoSegundos.toFixed(1)} s</div>;
};

interface VistaPrimeiraPessoaSalaJogoProps {
    readonly className: string;
    readonly payload: MapaLogicoSalaJogoPayloadWsDto;
    readonly keysNovos: readonly string[];
    readonly keyOcupanteSelecionado: string | null;
    readonly keyInteragivelSelecionado: string | null;
    readonly ocupanteJogador: OcupanteMapaLogicoSalaJogoWsDto | null;
};

function VistaPrimeiraPessoaSalaJogo({ className, payload, keysNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, ocupanteJogador }: VistaPrimeiraPessoaSalaJogoProps) {
    useReforcaRedimensionamentoCanvas();
    const largura = payload.mapaLogico.larguraMilimetros;
    const altura = payload.mapaLogico.alturaMilimetros;
    const extensao = paraUnidadeCena(Math.max(largura, altura));
    const cabecaX = ocupanteJogador === null ? 0 : mundoX(ocupanteJogador.posicao.x, largura);
    const cabecaZ = ocupanteJogador === null ? 0 : mundoZ(ocupanteJogador.posicao.y, altura);

    return (
        <div className={className}>
            <Canvas shadows dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [cabecaX, ALTURA_OLHOS, cabecaZ], fov: 72, near: 0.05, far: Math.max(120, extensao * 6) }}>
                <ConteudoCena3DSalaJogo payload={payload} keysNovos={keysNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} ocultarKeyOcupante={ocupanteJogador?.keySer ?? null} />
                <ControladorPrimeiraPessoaJogo cabecaX={cabecaX} cabecaY={ALTURA_OLHOS} cabecaZ={cabecaZ} />
            </Canvas>
        </div>
    );
};

interface ConteudoCena3DSalaJogoProps {
    readonly payload: MapaLogicoSalaJogoPayloadWsDto;
    readonly keysNovos: readonly string[];
    readonly keyOcupanteSelecionado: string | null;
    readonly keyInteragivelSelecionado: string | null;
    readonly estadoTemporalSalaJogo?: EstadoTemporalSalaDeJogoRuntime | null;
    readonly modoMovimentacaoAtivo?: boolean;
    readonly celulaHoverDestino?: DestinoMovimentacaoSalaJogo | null;
    readonly aoMoverDestino?: (destino: DestinoMovimentacaoSalaJogo) => void;
    readonly aoConfirmarDestino?: (destino: DestinoMovimentacaoSalaJogo) => void;
    readonly aoSelecionarOcupante?: (keySer: string) => void;
    readonly aoSelecionarInteragivel?: (key: string) => void;
    readonly ocultarKeyOcupante?: string | null;
};

function ConteudoCena3DSalaJogo({ payload, keysNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, estadoTemporalSalaJogo, modoMovimentacaoAtivo, celulaHoverDestino, aoMoverDestino, aoConfirmarDestino, aoSelecionarOcupante, aoSelecionarInteragivel, ocultarKeyOcupante }: ConteudoCena3DSalaJogoProps) {
    const largura = payload.mapaLogico.larguraMilimetros;
    const altura = payload.mapaLogico.alturaMilimetros;
    const extensao = paraUnidadeCena(Math.max(largura, altura));
    const limiteSombra = Math.max(9, extensao * 0.75);
    const ocupanteControlado = payload.ocupantesMapaLogico[0] ?? null;

    return (
        <>
            <color attach="background" args={['#0e0c14']} />
            <fog attach="fog" args={['#0e0c14', extensao * 1.7, extensao * 4.2]} />

            <ambientLight intensity={0.55} color="#eef2f6" />
            <hemisphereLight intensity={0.55} color="#f4f7fb" groundColor="#9aa1ad" />
            <directionalLight
                castShadow
                position={[extensao * 0.55, extensao * 1.1, extensao * 0.4]}
                intensity={1.25}
                color="#fff4e2"
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0005}
                shadow-camera-near={0.5}
                shadow-camera-far={extensao * 4}
                shadow-camera-left={-limiteSombra}
                shadow-camera-right={limiteSombra}
                shadow-camera-top={limiteSombra}
                shadow-camera-bottom={-limiteSombra}
            />
            <directionalLight position={[-extensao * 0.4, extensao * 0.7, -extensao * 0.3]} intensity={0.35} color="#cfe0ff" />
            <pointLight position={[0, ALTURA_PAREDE - 0.4, 0]} intensity={4} distance={extensao * 1.6} decay={2} color="#eaf1ff" />

            <SalaLaboratorio largura={largura} altura={altura} />

            {payload.ocupantesMapaLogico.map((ocupante, indice) => {
                if (ocupante.keySer === ocultarKeyOcupante) return null;
                if (indice === 0 && estadoTemporalSalaJogo) return <MarcadorControladoR3F key={ocupante.keySer} ocupante={ocupante} estadoTemporal={estadoTemporalSalaJogo} largura={largura} altura={altura} selecionado={keyOcupanteSelecionado === ocupante.keySer} aoSelecionar={aoSelecionarOcupante} />;
                return <OcupanteR3F key={ocupante.keySer} ocupante={ocupante} largura={largura} altura={altura} selecionado={keyOcupanteSelecionado === ocupante.keySer} aoSelecionar={aoSelecionarOcupante} />;
            })}
            {payload.interagiveisPercebidos.map(interagivel => <InteragivelR3F key={interagivel.key} interagivel={interagivel} novo={keysNovos.includes(interagivel.key)} selecionado={keyInteragivelSelecionado === interagivel.key} largura={largura} altura={altura} aoSelecionar={aoSelecionarInteragivel} />)}

            {modoMovimentacaoAtivo && aoMoverDestino && aoConfirmarDestino && <PlanoSelecaoMovimentacao largura={largura} altura={altura} aoMoverDestino={aoMoverDestino} aoConfirmarDestino={aoConfirmarDestino} />}
            {modoMovimentacaoAtivo && celulaHoverDestino && ocupanteControlado && <CaminhoMovimentacaoR3F origem={ocupanteControlado.posicao} destino={celulaHoverDestino} largura={largura} altura={altura} />}
        </>
    );
};

interface SalaLaboratorioProps { largura: number; altura: number; };

function SalaLaboratorio({ largura, altura }: SalaLaboratorioProps) {
    const meioParede = ALTURA_PAREDE / 2;
    const recuoPainel = ESPESSURA_PAREDE * 0.6;
    const alturaPainel = ALTURA_PAREDE * 0.74;

    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[largura, altura]} />
                <meshStandardMaterial color="#cdd4db" roughness={0.55} metalness={0.12} />
            </mesh>

            <Grid position={[0, 0.012, 0]} args={[paraUnidadeCena(largura), paraUnidadeCena(altura)]} cellSize={1} cellThickness={0.6} cellColor="#9aa3ad" sectionSize={5} sectionThickness={1} sectionColor="#6c7682" fadeDistance={paraUnidadeCena(Math.max(largura, altura)) * 2.6} fadeStrength={1} followCamera={false} infiniteGrid={false} />

            <Parede position={[0, meioParede, -altura / 2]} args={[largura, ALTURA_PAREDE, ESPESSURA_PAREDE]} />
            <Parede position={[0, meioParede, altura / 2]} args={[largura, ALTURA_PAREDE, ESPESSURA_PAREDE]} />
            <Parede position={[largura / 2, meioParede, 0]} args={[ESPESSURA_PAREDE, ALTURA_PAREDE, altura]} />
            <Parede position={[-largura / 2, meioParede, 0]} args={[ESPESSURA_PAREDE, ALTURA_PAREDE, altura]} />

            <PainelLuz position={[0, alturaPainel, -altura / 2 + recuoPainel]} args={[largura * 0.55, 0.5, 0.06]} />
            <PainelLuz position={[0, alturaPainel, altura / 2 - recuoPainel]} args={[largura * 0.55, 0.5, 0.06]} />
            <PainelLuz position={[largura / 2 - recuoPainel, alturaPainel, 0]} args={[0.06, 0.5, altura * 0.55]} />
            <PainelLuz position={[-largura / 2 + recuoPainel, alturaPainel, 0]} args={[0.06, 0.5, altura * 0.55]} />

            <Reforco position={[-largura / 2, meioParede, -altura / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />
            <Reforco position={[largura / 2, meioParede, -altura / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />
            <Reforco position={[-largura / 2, meioParede, altura / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />
            <Reforco position={[largura / 2, meioParede, altura / 2]} args={[0.55, ALTURA_PAREDE + 0.1, 0.55]} />

            <Reforco position={[0, 0.12, -altura / 2]} args={[largura + 0.1, 0.24, 0.4]} />
            <Reforco position={[0, 0.12, altura / 2]} args={[largura + 0.1, 0.24, 0.4]} />
            <Reforco position={[largura / 2, 0.12, 0]} args={[0.4, 0.24, altura + 0.1]} />
            <Reforco position={[-largura / 2, 0.12, 0]} args={[0.4, 0.24, altura + 0.1]} />

            <Reforco position={[0, ALTURA_PAREDE - 0.1, -altura / 2]} args={[largura + 0.1, 0.2, 0.42]} />
            <Reforco position={[0, ALTURA_PAREDE - 0.1, altura / 2]} args={[largura + 0.1, 0.2, 0.42]} />
            <Reforco position={[largura / 2, ALTURA_PAREDE - 0.1, 0]} args={[0.42, 0.2, altura + 0.1]} />
            <Reforco position={[-largura / 2, ALTURA_PAREDE - 0.1, 0]} args={[0.42, 0.2, altura + 0.1]} />
        </group>
    );
};

interface PlanoSelecaoMovimentacaoProps { largura: number; altura: number; aoMoverDestino: (destino: DestinoMovimentacaoSalaJogo) => void; aoConfirmarDestino: (destino: DestinoMovimentacaoSalaJogo) => void; };

function PlanoSelecaoMovimentacao({ largura, altura, aoMoverDestino, aoConfirmarDestino }: PlanoSelecaoMovimentacaoProps) {
    function aoMover(e: ThreeEvent<PointerEvent>): void { e.stopPropagation(); aoMoverDestino(celulaDoMundo(e.point.x, e.point.z, largura, altura)); };
    function aoClicar(e: ThreeEvent<MouseEvent>): void { e.stopPropagation(); aoConfirmarDestino(celulaDoMundo(e.point.x, e.point.z, largura, altura)); };

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} onPointerMove={aoMover} onClick={aoClicar}>
            <planeGeometry args={[largura, altura]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
    );
};

interface CaminhoMovimentacaoR3FProps { origem: { x: number; y: number; }; destino: DestinoMovimentacaoSalaJogo; largura: number; altura: number; };

function CaminhoMovimentacaoR3F({ origem, destino, largura, altura }: CaminhoMovimentacaoR3FProps) {
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

interface MarcadorControladoR3FProps { ocupante: OcupanteMapaLogicoSalaJogoWsDto; estadoTemporal: EstadoTemporalSalaDeJogoRuntime; largura: number; altura: number; selecionado: boolean; aoSelecionar?: (keySer: string) => void; };

function MarcadorControladoR3F({ ocupante, estadoTemporal, largura, altura, selecionado, aoSelecionar }: MarcadorControladoR3FProps) {
    const grupoRef = useRef<Group>(null);
    const referenciaTempoRef = useRef<{ momentoMs: number; recebidoMs: number; limiteMs: number | null; }>({ momentoMs: estadoTemporal.momentoAtualMs, recebidoMs: Date.now(), limiteMs: estadoTemporal.momentoLimiteProjecaoMs });

    useEffect(() => {
        referenciaTempoRef.current = { momentoMs: estadoTemporal.momentoAtualMs, recebidoMs: Date.now(), limiteMs: estadoTemporal.momentoLimiteProjecaoMs };
    }, [estadoTemporal]);

    const movimentoAtivo = estadoTemporal.acoesTemporais.find(acao => acao.tipo === 'mover' && acao.status === 'EM_ANDAMENTO' && acao.movimento !== null && acao.momentoFimPrevistoMs !== null) ?? null;

    useFrame(() => {
        const grupo = grupoRef.current;
        if (!grupo) return;

        if (!movimentoAtivo || !movimentoAtivo.movimento || movimentoAtivo.momentoFimPrevistoMs === null) {
            grupo.position.set(mundoX(ocupante.posicao.x, largura), 0, mundoZ(ocupante.posicao.y, altura));
            return;
        }

        const referencia = referenciaTempoRef.current;
        const projetadoMs = projetaMomentoFiccional(referencia.momentoMs + Math.max(0, Date.now() - referencia.recebidoMs), referencia.limiteMs);
        const duracaoMs = movimentoAtivo.momentoFimPrevistoMs - movimentoAtivo.momentoInicioMs;
        const progresso = duracaoMs <= 0 ? 1 : Math.min(1, Math.max(0, (projetadoMs - movimentoAtivo.momentoInicioMs) / duracaoMs));
        const cx = movimentoAtivo.movimento.origem.x + (movimentoAtivo.movimento.destino.x - movimentoAtivo.movimento.origem.x) * progresso;
        const cy = movimentoAtivo.movimento.origem.y + (movimentoAtivo.movimento.destino.y - movimentoAtivo.movimento.origem.y) * progresso;
        grupo.position.set(mundoX(cx, largura), 0, mundoZ(cy, altura));
    });

    const aoClicar = aoSelecionar === undefined ? undefined : (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); aoSelecionar(ocupante.keySer); };

    return (
        <group ref={grupoRef}>
            <FiguraSerR3F position={[0, 0, 0]} corPrimaria="#2f6f86" corPele="#e0b48f" selecionado={selecionado} aoClicar={aoClicar} />
        </group>
    );
};

interface OcupanteR3FProps { ocupante: OcupanteMapaLogicoSalaJogoWsDto; largura: number; altura: number; selecionado: boolean; aoSelecionar?: (keySer: string) => void; };

function OcupanteR3F({ ocupante, largura, altura, selecionado, aoSelecionar }: OcupanteR3FProps) {
    const aoClicar = aoSelecionar === undefined ? undefined : (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); aoSelecionar(ocupante.keySer); };
    return <FiguraSerR3F position={[mundoX(ocupante.posicao.x, largura), 0, mundoZ(ocupante.posicao.y, altura)]} corPrimaria="#2f6f86" corPele="#e0b48f" selecionado={selecionado} aoClicar={aoClicar} />;
};

interface InteragivelR3FProps { interagivel: InteragivelPercebidoSalaJogoWsDto; novo: boolean; selecionado: boolean; largura: number; altura: number; aoSelecionar?: (key: string) => void; };

function InteragivelR3F({ interagivel, novo, selecionado, largura, altura, aoSelecionar }: InteragivelR3FProps) {
    if (interagivel.posicao === null) return null;

    const x = mundoX(interagivel.posicao.x, largura);
    const z = mundoZ(interagivel.posicao.y, altura);
    const aoClicar = aoSelecionar === undefined ? undefined : (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); aoSelecionar(interagivel.key); };

    if (interagivel.tipo === 'ser') return <FiguraSerR3F position={[x, 0, z]} corPrimaria={novo ? '#c79a3f' : '#7484b4'} corPele="#d8b48c" selecionado={selecionado} aoClicar={aoClicar} />;

    return (
        <group position={[x, 0, z]} onClick={aoClicar}>
            {selecionado && <AnelSelecao />}
            <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[1.1, 1.2, 1.1]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <mesh castShadow position={[0, 0.45, 0]}>
                <boxGeometry args={[0.8, 0.9, 0.8]} />
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

interface ParedeProps { position: [number, number, number]; args: [number, number, number]; };

function Parede({ position, args }: ParedeProps) {
    return (
        <mesh position={position} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#d7dde3" roughness={0.7} metalness={0.05} />
        </mesh>
    );
};

function Reforco({ position, args }: ParedeProps) {
    return (
        <mesh position={position} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#8d96a1" roughness={0.4} metalness={0.65} />
        </mesh>
    );
};

function PainelLuz({ position, args }: ParedeProps) {
    return (
        <mesh position={position}>
            <boxGeometry args={args} />
            <meshStandardMaterial color="#eef4ff" emissive="#dfeaff" emissiveIntensity={0.9} roughness={0.3} />
        </mesh>
    );
};
