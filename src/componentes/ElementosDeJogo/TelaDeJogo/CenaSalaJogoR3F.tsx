'use client';

import styles from './CenaSalaJogoR3F.module.css';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import type { EstadoTemporalSalaDeJogoRuntime, MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto } from 'types-nora-api';

import { ControlesCameraJogo } from 'Componentes/ElementosDeJogo/Cena3D/ControlesCameraJogo';
import { PERFIL_CAMERA_TATICA } from 'Componentes/ElementosDeJogo/Cena3D/cena3D.controles';
import { ControladorPrimeiraPessoaJogo } from 'Componentes/ElementosDeJogo/Cena3D/ControladorPrimeiraPessoaJogo';
import type { DestinoMovimentacaoSalaJogo } from './ContextoMovimentacaoSalaJogo';
import { ALTURA_OLHOS, mundoX, mundoZ, paraUnidadeCena, useReforcaRedimensionamentoCanvas } from './cenaSalaJogo.helpers';
import { SalaLaboratorioR3F } from './SalaLaboratorioR3F';
import { InteragivelR3F, MarcadorControladoR3F, OcupanteR3F, PortaMapaR3F } from './AtoresSalaJogoR3F';
import { CaminhoMovimentacaoR3F, OverlayMovimentacao, PlanoSelecaoMovimentacao } from './MovimentacaoSalaJogoR3F';
import { MascaraVisaoControlador, obtemAlcanceLinhaVisaoMilimetros, obtemDependenciaIluminacaoPercentual } from './MascaraVisaoSalaJogoR3F';
import { LuzesSalaJogoR3F } from './LuzesSalaJogoR3F';

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
            <Canvas shadows="soft" dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [distancia * 0.62, distancia * 0.8, distancia * 0.62], fov: 34, near: 0.1, far: distancia * 8 }} onPointerMissed={aoErrarClique}>
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
            <Canvas shadows="soft" dpr={[1, 2]} resize={{ offsetSize: true }} camera={{ position: [cabecaX, ALTURA_OLHOS, cabecaZ], fov: 72, near: 0.05, far: Math.max(120, extensao * 6) }}>
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
    const ocupanteControlado = payload.ocupantesMapaLogico[0] ?? null;
    const serControlado = payload.seresNaSala.find(ser => ser.papel === 'controlado') ?? null;
    const alcanceLinhaVisaoMilimetros = obtemAlcanceLinhaVisaoMilimetros(serControlado);
    const dependenciaIluminacao = obtemDependenciaIluminacaoPercentual(serControlado);
    const ambienteVisao = dependenciaIluminacao === null ? AMBIENTE_VISAO_BASE : (1 - dependenciaIluminacao / 100) * AMBIENTE_VISAO_BASE;
    // Rebatimento (luz indireta FINGIDA): fill suave escalado pela luz real presente na sala — sem GI, custo ~nulo. Sala sem luz -> 0 (segue preta).
    const intensidadeLuzTotal = payload.luzes.reduce((soma, luz) => soma + (Number.isFinite(luz.intensidade) ? luz.intensidade : 0), 0);
    const rebatimento = Math.min(REBATIMENTO_MAXIMO, intensidadeLuzTotal * REBATIMENTO_POR_INTENSIDADE);

    return (
        <>
            {/* Fundo e fog PRETOS: o vazio alem da Linha de Visao (mascara -> preto) tem que ser indistinguivel do fundo — senao a parede mascarada vira silhueta e o mapa "flutua" no fundo. */}
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', extensao * 1.7, extensao * 4.2]} />

            {/* Iluminacao OBJETIVA em 2 termos + as luzes-objeto: (1) rebatimento — fill quente e suave escalado pelas luzes reais (a luz que "quica"; sala sem luz -> 0); (2) visao-no-escuro — ambiente frio derivado da dependencia (dep 100% -> 0). As luzes-objeto dao os destaques diretos + sombra macia por cima. */}
            <hemisphereLight intensity={rebatimento} color="#ffe8c0" groundColor="#2a2418" />
            <ambientLight intensity={ambienteVisao} color="#e8ecf2" />
            <LuzesSalaJogoR3F luzes={payload.luzes} largura={largura} altura={altura} />

            <SalaLaboratorioR3F largura={largura} altura={altura} portas={payload.mapaLogico.portas} />

            {payload.ocupantesMapaLogico.map((ocupante, indice) => {
                if (ocupante.keySer === ocultarKeyOcupante) return null;
                if (indice === 0 && estadoTemporalSalaJogo) return <MarcadorControladoR3F key={ocupante.keySer} ocupante={ocupante} estadoTemporal={estadoTemporalSalaJogo} largura={largura} altura={altura} selecionado={keyOcupanteSelecionado === ocupante.keySer} aoSelecionar={aoSelecionarOcupante} />;
                return <OcupanteR3F key={ocupante.keySer} ocupante={ocupante} largura={largura} altura={altura} selecionado={keyOcupanteSelecionado === ocupante.keySer} aoSelecionar={aoSelecionarOcupante} />;
            })}
            {payload.interagiveisPercebidos.map(interagivel => <InteragivelR3F key={interagivel.key} interagivel={interagivel} novo={keysNovos.includes(interagivel.key)} selecionado={keyInteragivelSelecionado === interagivel.key} largura={largura} altura={altura} aoSelecionar={aoSelecionarInteragivel} />)}
            {payload.mapaLogico.portas.map(porta => <PortaMapaR3F key={porta.chave} porta={porta} largura={largura} altura={altura} />)}

            {modoMovimentacaoAtivo && aoMoverDestino && aoConfirmarDestino && <PlanoSelecaoMovimentacao largura={largura} altura={altura} aoMoverDestino={aoMoverDestino} aoConfirmarDestino={aoConfirmarDestino} />}
            {modoMovimentacaoAtivo && celulaHoverDestino && ocupanteControlado && <CaminhoMovimentacaoR3F origem={ocupanteControlado.posicao} destino={celulaHoverDestino} largura={largura} altura={altura} />}

            <MascaraVisaoControlador alcanceLinhaVisaoMilimetros={alcanceLinhaVisaoMilimetros} ocupanteControlado={ocupanteControlado} interagiveisPercebidos={payload.interagiveisPercebidos} estadoTemporal={estadoTemporalSalaJogo ?? null} largura={largura} altura={altura} seguirCamera={seguirCameraNaVisao ?? false} />
        </>
    );
};
