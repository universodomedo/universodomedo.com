'use client';

import styles from './CenaSalaJogoR3F.module.css';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import type { EstadoTemporalSalaDeJogoRuntime, MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto } from 'types-nora-api';

import { ControlesCameraJogo } from 'Componentes/ElementosDeJogo/Cena3D/ControlesCameraJogo';
import { PERFIL_CAMERA_TATICA } from 'Componentes/ElementosDeJogo/Cena3D/cena3D.controles';
import { ControladorPrimeiraPessoaJogo } from 'Componentes/ElementosDeJogo/Cena3D/ControladorPrimeiraPessoaJogo';
import type { DestinoMovimentacaoSalaJogo } from './ContextoMovimentacaoSalaJogo';
import { ALTURA_OLHOS, ALTURA_PAREDE, mundoX, mundoZ, paraUnidadeCena, useReforcaRedimensionamentoCanvas } from './cenaSalaJogo.helpers';
import { SalaLaboratorioR3F } from './SalaLaboratorioR3F';
import { InteragivelR3F, MarcadorControladoR3F, OcupanteR3F } from './AtoresSalaJogoR3F';
import { CaminhoMovimentacaoR3F, OverlayMovimentacao, PlanoSelecaoMovimentacao } from './MovimentacaoSalaJogoR3F';
import { MascaraVisaoControlador, obtemAlcanceLinhaVisaoMilimetros } from './MascaraVisaoSalaJogoR3F';

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
                <ConteudoCena3DSalaJogo payload={payload} keysNovos={keysNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} ocultarKeyOcupante={ocupanteJogador?.keySer ?? null} seguirCameraNaVisao />
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
    // Primeira pessoa: a esfera de visao segue a camera (que ja esta na cabeca). Tatica (default): segue a posicao logica do controlado.
    readonly seguirCameraNaVisao?: boolean;
};

function ConteudoCena3DSalaJogo({ payload, keysNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, estadoTemporalSalaJogo, modoMovimentacaoAtivo, celulaHoverDestino, aoMoverDestino, aoConfirmarDestino, aoSelecionarOcupante, aoSelecionarInteragivel, ocultarKeyOcupante, seguirCameraNaVisao }: ConteudoCena3DSalaJogoProps) {
    const largura = payload.mapaLogico.larguraMilimetros;
    const altura = payload.mapaLogico.alturaMilimetros;
    const extensao = paraUnidadeCena(Math.max(largura, altura));
    const limiteSombra = Math.max(9, extensao * 0.75);
    const ocupanteControlado = payload.ocupantesMapaLogico[0] ?? null;
    const serControlado = payload.seresNaSala.find(ser => ser.papel === 'controlado') ?? null;
    const alcanceLinhaVisaoMilimetros = obtemAlcanceLinhaVisaoMilimetros(serControlado);

    return (
        <>
            {/* Fundo e fog PRETOS: o vazio alem da Linha de Visao (mascara -> preto) tem que ser indistinguivel do fundo — senao a parede mascarada vira silhueta e o mapa "flutua" no fundo. */}
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', extensao * 1.7, extensao * 4.2]} />

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

            <SalaLaboratorioR3F largura={largura} altura={altura} />

            {payload.ocupantesMapaLogico.map((ocupante, indice) => {
                if (ocupante.keySer === ocultarKeyOcupante) return null;
                if (indice === 0 && estadoTemporalSalaJogo) return <MarcadorControladoR3F key={ocupante.keySer} ocupante={ocupante} estadoTemporal={estadoTemporalSalaJogo} largura={largura} altura={altura} selecionado={keyOcupanteSelecionado === ocupante.keySer} aoSelecionar={aoSelecionarOcupante} />;
                return <OcupanteR3F key={ocupante.keySer} ocupante={ocupante} largura={largura} altura={altura} selecionado={keyOcupanteSelecionado === ocupante.keySer} aoSelecionar={aoSelecionarOcupante} />;
            })}
            {payload.interagiveisPercebidos.map(interagivel => <InteragivelR3F key={interagivel.key} interagivel={interagivel} novo={keysNovos.includes(interagivel.key)} selecionado={keyInteragivelSelecionado === interagivel.key} largura={largura} altura={altura} aoSelecionar={aoSelecionarInteragivel} />)}

            {modoMovimentacaoAtivo && aoMoverDestino && aoConfirmarDestino && <PlanoSelecaoMovimentacao largura={largura} altura={altura} aoMoverDestino={aoMoverDestino} aoConfirmarDestino={aoConfirmarDestino} />}
            {modoMovimentacaoAtivo && celulaHoverDestino && ocupanteControlado && <CaminhoMovimentacaoR3F origem={ocupanteControlado.posicao} destino={celulaHoverDestino} largura={largura} altura={altura} />}

            <MascaraVisaoControlador alcanceLinhaVisaoMilimetros={alcanceLinhaVisaoMilimetros} ocupanteControlado={ocupanteControlado} estadoTemporal={estadoTemporalSalaJogo ?? null} largura={largura} altura={altura} seguirCamera={seguirCameraNaVisao ?? false} />
        </>
    );
};
