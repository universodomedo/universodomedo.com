'use client';

import styles from './CenaSalaJogoR3F.module.css';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Object3D } from 'three';
import type { CamadaJogoMapa, CenaCanonicaEditor3D, EstadoTemporalSalaDeJogoRuntime, MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto } from 'types-nora-api';

import { ControlesCameraJogo } from 'Componentes/ElementosDeJogo/Cena3D/ControlesCameraJogo';
import { PERFIL_CAMERA_TATICA } from 'Componentes/ElementosDeJogo/Cena3D/cena3D.controles';
import { ControladorPrimeiraPessoaJogo } from 'Componentes/ElementosDeJogo/Cena3D/ControladorPrimeiraPessoaJogo';
import type { DestinoMovimentacaoSalaJogo } from './ContextoMovimentacaoSalaJogo';
import { ALTURA_OLHOS, mundoX, mundoY, paraUnidadeCena, useReforcaRedimensionamentoCanvas } from './cenaSalaJogo.helpers';
import { ChaoSemMapaR3F, MapaProjetoR3F } from './MapaProjetoR3F';
import { useProjetoMapa } from 'Funcionalidades/MapaJogavel/useProjetoMapa';
import { InteragivelR3F, MarcadorControladoR3F, OcupanteR3F } from './AtoresSalaJogoR3F';
import { CaminhoMovimentacaoR3F, OverlayMovimentacao, PlanoSelecaoMovimentacao } from './MovimentacaoSalaJogoR3F';
import { MascaraVisaoControlador, obtemAlcanceLinhaVisaoMilimetros, obtemDependenciaIluminacaoPercentual } from './MascaraVisaoSalaJogoR3F';
import { intensidadeTotalLuzesMapa } from './LuzesMapaR3F';

// Z-up (Blender) para todo o render do jogo: define o "para cima" global do Three.js (câmeras, órbita, novos objetos).
// TODO(z-up): unificar num init único do app (hoje o editor também seta isso no seu próprio módulo).
Object3D.DEFAULT_UP.set(0, 0, 1);

// Ambiente base da "visao no escuro": um Ser dep 0% ve o cenario achatado neste nivel; dep 100% (humano) -> 0 (sala preta, so luzes-objeto).
const AMBIENTE_VISAO_BASE = 0.9;
// Rebatimento (fill indireto fingido): teto por soma de intensidade das luzes, e quanto cada unidade de intensidade contribui. Suave — o direto das luzes-objeto dá o destaque.
const REBATIMENTO_MAXIMO = 0.42;
const REBATIMENTO_POR_INTENSIDADE = 0.012;

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
    // O cenário É o Projeto 3D (tipo MAPA) apontado pela config; consultado UMA vez (cache) e compartilhado pelas duas vistas.
    const { projetoMapa } = useProjetoMapa(payload.mapaLogico.idProjetoMapa);
    const cenaMapa = projetoMapa?.cenaCanonica ?? null;
    const camadaJogoMapa = projetoMapa?.camadaJogoMapa ?? null;

    // Modo Solo: o jogador é o único ocupante (o primeiro). Quando houver multiplayer/identidade, casar por idFicha da ficha do jogador.
    const ocupanteJogador = payload.ocupantesMapaLogico[0] ?? null;

    const classeTatica = principal === 'tatico' ? styles.vista_principal : styles.vista_secundaria;
    const classeFp = principal === 'fp' ? styles.vista_principal : styles.vista_secundaria;

    return (
        <div className={styles.recipiente_cena_r3f}>
            <VistaTaticaSalaJogo className={classeTatica} payload={payload} cenaMapa={cenaMapa} camadaJogoMapa={camadaJogoMapa} keysNovos={keysInteragiveisPercebidosNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} estadoTemporalSalaJogo={estadoTemporalSalaJogo} modoMovimentacaoAtivo={modoMovimentacaoAtivo} aoSelecionarOcupante={aoSelecionarOcupante} aoSelecionarInteragivel={aoSelecionarInteragivel} aoLimparSelecao={aoLimparSelecao} aoConfirmarMovimentacao={aoConfirmarMovimentacao} aoCancelarMovimentacao={aoCancelarMovimentacao} />
            <VistaPrimeiraPessoaSalaJogo className={classeFp} payload={payload} cenaMapa={cenaMapa} camadaJogoMapa={camadaJogoMapa} keysNovos={keysInteragiveisPercebidosNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} ocupanteJogador={ocupanteJogador} />

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
    readonly cenaMapa: CenaCanonicaEditor3D | null;
    readonly camadaJogoMapa: CamadaJogoMapa | null;
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

function VistaTaticaSalaJogo({ className, payload, cenaMapa, camadaJogoMapa, keysNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, estadoTemporalSalaJogo, modoMovimentacaoAtivo, aoSelecionarOcupante, aoSelecionarInteragivel, aoLimparSelecao, aoConfirmarMovimentacao, aoCancelarMovimentacao }: VistaTaticaSalaJogoProps) {
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
            <Canvas shadows="soft" dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [distancia * 0.62, -distancia * 0.62, distancia * 0.8], up: [0, 0, 1], fov: 34, near: 0.1, far: distancia * 8 }} onPointerMissed={aoErrarClique}>
                <ConteudoCena3DSalaJogo payload={payload} cenaMapa={cenaMapa} camadaJogoMapa={camadaJogoMapa} keysNovos={keysNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} estadoTemporalSalaJogo={estadoTemporalSalaJogo} modoMovimentacaoAtivo={modoMovimentacaoAtivo} celulaHoverDestino={celulaHoverDestino} aoMoverDestino={setCelulaHoverDestino} aoConfirmarDestino={aoConfirmarMovimentacao} aoSelecionarOcupante={aoSelecionarOcupante} aoSelecionarInteragivel={aoSelecionarInteragivel} />
                <ControlesCameraJogo perfil={PERFIL_CAMERA_TATICA} alvo={[0, 0, 0.6]} distanciaMin={Math.max(4, extensao * 0.35)} distanciaMax={extensao * 1.9} />
            </Canvas>
            {modoMovimentacaoAtivo && <OverlayMovimentacao ocupanteControlado={ocupanteControlado} celulaHoverDestino={celulaHoverDestino} />}
        </div>
    );
};

interface VistaPrimeiraPessoaSalaJogoProps {
    readonly className: string;
    readonly payload: MapaLogicoSalaJogoPayloadWsDto;
    readonly cenaMapa: CenaCanonicaEditor3D | null;
    readonly camadaJogoMapa: CamadaJogoMapa | null;
    readonly keysNovos: readonly string[];
    readonly keyOcupanteSelecionado: string | null;
    readonly keyInteragivelSelecionado: string | null;
    readonly ocupanteJogador: OcupanteMapaLogicoSalaJogoWsDto | null;
};

function VistaPrimeiraPessoaSalaJogo({ className, payload, cenaMapa, camadaJogoMapa, keysNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, ocupanteJogador }: VistaPrimeiraPessoaSalaJogoProps) {
    useReforcaRedimensionamentoCanvas();
    const largura = payload.mapaLogico.larguraMilimetros;
    const altura = payload.mapaLogico.alturaMilimetros;
    const extensao = paraUnidadeCena(Math.max(largura, altura));
    const cabecaX = ocupanteJogador === null ? 0 : mundoX(ocupanteJogador.posicao.x, largura);
    const cabecaY = ocupanteJogador === null ? 0 : mundoY(ocupanteJogador.posicao.y, altura);

    return (
        <div className={className}>
            <Canvas shadows="soft" dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [cabecaX, cabecaY, ALTURA_OLHOS], up: [0, 0, 1], fov: 72, near: 0.05, far: Math.max(120, extensao * 6) }}>
                <ConteudoCena3DSalaJogo payload={payload} cenaMapa={cenaMapa} camadaJogoMapa={camadaJogoMapa} keysNovos={keysNovos} keyOcupanteSelecionado={keyOcupanteSelecionado} keyInteragivelSelecionado={keyInteragivelSelecionado} ocultarKeyOcupante={ocupanteJogador?.keySer ?? null} seguirCameraNaVisao />
                <ControladorPrimeiraPessoaJogo cabecaX={cabecaX} cabecaY={cabecaY} cabecaZ={ALTURA_OLHOS} />
            </Canvas>
        </div>
    );
};

interface ConteudoCena3DSalaJogoProps {
    readonly payload: MapaLogicoSalaJogoPayloadWsDto;
    readonly cenaMapa: CenaCanonicaEditor3D | null;
    readonly camadaJogoMapa: CamadaJogoMapa | null;
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

function ConteudoCena3DSalaJogo({ payload, cenaMapa, camadaJogoMapa, keysNovos, keyOcupanteSelecionado, keyInteragivelSelecionado, estadoTemporalSalaJogo, modoMovimentacaoAtivo, celulaHoverDestino, aoMoverDestino, aoConfirmarDestino, aoSelecionarOcupante, aoSelecionarInteragivel, ocultarKeyOcupante, seguirCameraNaVisao }: ConteudoCena3DSalaJogoProps) {
    const largura = payload.mapaLogico.larguraMilimetros;
    const altura = payload.mapaLogico.alturaMilimetros;
    const extensao = paraUnidadeCena(Math.max(largura, altura));
    const ocupanteControlado = payload.ocupantesMapaLogico[0] ?? null;
    const serControlado = payload.seresNaSala.find(ser => ser.papel === 'controlado') ?? null;
    const alcanceLinhaVisaoMilimetros = obtemAlcanceLinhaVisaoMilimetros(serControlado);
    const dependenciaIluminacao = obtemDependenciaIluminacaoPercentual(serControlado);
    const ambienteVisao = dependenciaIluminacao === null ? AMBIENTE_VISAO_BASE : (1 - dependenciaIluminacao / 100) * AMBIENTE_VISAO_BASE;
    // Rebatimento (luz indireta FINGIDA): fill suave escalado pela luz real presente na sala — sem GI, custo ~nulo. Sala sem luz -> 0 (segue preta).
    // A luz vem do MAPA (autorada no Editor 3D), não da Partida: mapa sem luz autorada = sala preta, e isso é correto.
    const rebatimento = Math.min(REBATIMENTO_MAXIMO, intensidadeTotalLuzesMapa(camadaJogoMapa?.fontesDeLuz ?? [], payload.luzesApagadas) * REBATIMENTO_POR_INTENSIDADE);

    return (
        <>
            {/* Fundo e fog PRETOS: o vazio alem da Linha de Visao (mascara -> preto) tem que ser indistinguivel do fundo — senao a parede mascarada vira silhueta e o mapa "flutua" no fundo. */}
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', extensao * 1.7, extensao * 4.2]} />

            {/* Iluminacao OBJETIVA em 2 termos: (1) rebatimento — fill quente e suave escalado pelas luzes do MAPA (a luz que "quica"; mapa sem luz -> 0); (2) visao-no-escuro — ambiente frio derivado da dependencia (dep 100% -> 0). As Fontes de Luz autoradas no mapa dao os destaques diretos + sombra macia por cima, e sao desenhadas dentro do proprio grupo do mapa. */}
            <hemisphereLight intensity={rebatimento} color="#ffe8c0" groundColor="#2a2418" />
            <ambientLight intensity={ambienteVisao} color="#e8ecf2" />

            {/* Cenário = o Projeto 3D (tipo MAPA) da config, alinhado ao espaço lógico; config legada sem mapa cai num chão neutro (protótipo procedural aposentado). */}
            {cenaMapa !== null ? <MapaProjetoR3F cena={cenaMapa} camadaJogo={camadaJogoMapa} largura={largura} altura={altura} luzesApagadas={payload.luzesApagadas} /> : <ChaoSemMapaR3F largura={largura} altura={altura} />}

            {payload.ocupantesMapaLogico.map((ocupante, indice) => {
                if (ocupante.keySer === ocultarKeyOcupante) return null;
                if (indice === 0 && estadoTemporalSalaJogo) return <MarcadorControladoR3F key={ocupante.keySer} ocupante={ocupante} estadoTemporal={estadoTemporalSalaJogo} largura={largura} altura={altura} selecionado={keyOcupanteSelecionado === ocupante.keySer} aoSelecionar={aoSelecionarOcupante} />;
                return <OcupanteR3F key={ocupante.keySer} ocupante={ocupante} largura={largura} altura={altura} selecionado={keyOcupanteSelecionado === ocupante.keySer} aoSelecionar={aoSelecionarOcupante} />;
            })}
            {payload.interagiveisPercebidos.map(interagivel => <InteragivelR3F key={interagivel.key} interagivel={interagivel} novo={keysNovos.includes(interagivel.key)} selecionado={keyInteragivelSelecionado === interagivel.key} largura={largura} altura={altura} aoSelecionar={aoSelecionarInteragivel} />)}

            {modoMovimentacaoAtivo && aoMoverDestino && aoConfirmarDestino && <PlanoSelecaoMovimentacao largura={largura} altura={altura} aoMoverDestino={aoMoverDestino} aoConfirmarDestino={aoConfirmarDestino} />}
            {modoMovimentacaoAtivo && celulaHoverDestino && ocupanteControlado && <CaminhoMovimentacaoR3F origem={ocupanteControlado.posicao} destino={celulaHoverDestino} largura={largura} altura={altura} />}

            <MascaraVisaoControlador alcanceLinhaVisaoMilimetros={alcanceLinhaVisaoMilimetros} ocupanteControlado={ocupanteControlado} interagiveisPercebidos={payload.interagiveisPercebidos} estadoTemporal={estadoTemporalSalaJogo ?? null} largura={largura} altura={altura} seguirCamera={seguirCameraNaVisao ?? false} />
        </>
    );
};
