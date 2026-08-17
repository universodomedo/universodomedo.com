'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { AmbientLight, PointLight } from 'three';
import type { EstadoTemporalSalaDeJogoRuntime, FonteDeLuzMapa } from 'types-nora-api';

import { intensidadeFisicaFonteDeLuzPontoMapa } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';
import { fatorCorrenteCaminhoNoInstante, type NoCorrenteAvaliacao } from 'Funcionalidades/MapaJogavel/mapaJogavel.corrente';

// O relógio da CORRENTE é o TEMPO DE JOGO da Sala, nunca o relógio de parede: tempo pausado = mundo parado — o flicker
// CONGELA no estado do instante (bug real: luz piscando com o cronômetro em 00:00:00.000); a Espera 5x acelera as crises
// junto. A âncora do cronograma determinístico é o momento 0 do jogo — todos os clientes derivam o mesmo instante do
// MESMO estado temporal projetado, então a piscada continua idêntica em todas as telas.
export type InstanteCorrenteMapa = () => number;

const ANCORA_CORRENTE_JOGO_MS = 0;
export const INSTANTE_CORRENTE_PARADO_MAPA: InstanteCorrenteMapa = () => 0;

// Extrapola o momento de jogo entre projeções, no MESMO padrão do resto do front (referência no recebimento + delta local
// × escala; ver MarcadorControladoR3F): RODANDO anda, qualquer outro status fica exatamente onde a Sala disse.
export function useInstanteJogoCorrenteMapa(estadoTemporal: EstadoTemporalSalaDeJogoRuntime | null | undefined): InstanteCorrenteMapa {
    const referenciaRef = useRef({ momentoMs: estadoTemporal?.momentoAtualMs ?? 0, recebidoMs: Date.now() });

    useEffect(() => {
        referenciaRef.current = { momentoMs: estadoTemporal?.momentoAtualMs ?? 0, recebidoMs: Date.now() };
    }, [estadoTemporal]);

    return useCallback(() => {
        if (!estadoTemporal || estadoTemporal.status !== 'RODANDO') return estadoTemporal?.momentoAtualMs ?? 0;
        const referencia = referenciaRef.current;
        return referencia.momentoMs + Math.max(0, Date.now() - referencia.recebidoMs) * estadoTemporal.escalaTempo;
    }, [estadoTemporal]);
};

// Fontes de Luz AUTORADAS NO MAPA (Editor 3D, projeto tipo MAPA). Iluminação é domínio do mapa, não da Partida: a mesma sala
// chega iluminada em toda Partida que a usa. Renderiza DENTRO do grupo do mapa — a posição autorada já está no espaço do mapa
// (metros, Z-up), a mesma escala da cena de jogo (1 unidade = 1 m), então não há conversão nenhuma aqui.
// A luz NÃO tem estado próprio: ela REFLETE a corrente que chega pelo caminho dela na árvore de distribuição — gates da
// Sala (`nosDesligados`) + regime autorado, avaliados POR FRAME no instante de JOGO e aplicados por ref (sem re-render).
// A luz é OBJETIVA (ilumina o mundo para todos); a visão de cada Ser (máscara + dependência de iluminação) decide o que ELE vê.
export function LuzesMapaR3F({ luzes, caminhosCorrente, instanteCorrente }: { luzes: readonly FonteDeLuzMapa[]; caminhosCorrente: ReadonlyMap<string, readonly NoCorrenteAvaliacao[]>; instanteCorrente: InstanteCorrenteMapa }) {
    return (
        <>
            {luzes.map(luz => luz.tipo === 'AMBIENTE'
                ? <LuzAmbienteMapaR3F key={luz.idLocal} luz={luz} caminho={caminhosCorrente.get(luz.idLocal) ?? []} instanteCorrente={instanteCorrente} />
                : <LuzPontoMapaR3F key={luz.idLocal} luz={luz} caminho={caminhosCorrente.get(luz.idLocal) ?? []} instanteCorrente={instanteCorrente} />)}
        </>
    );
};

// A cor vem da CenaCanonica como RGB (0..1) — o mesmo formato que o Three aceita em `color` via array.
function corDaLuz(luz: FonteDeLuzMapa): [number, number, number] { return [luz.cor[0], luz.cor[1], luz.cor[2]]; };

// AMBIENTE também pende da distribuição (a "casa inteira" pode piscar): o banho reflete o fator da corrente por frame.
function LuzAmbienteMapaR3F({ luz, caminho, instanteCorrente }: { luz: FonteDeLuzMapa; caminho: readonly NoCorrenteAvaliacao[]; instanteCorrente: InstanteCorrenteMapa }) {
    const luzRef = useRef<AmbientLight>(null);
    useFrame(() => { if (luzRef.current !== null) luzRef.current.intensity = luz.intensidade * fatorCorrenteCaminhoNoInstante(caminho, ANCORA_CORRENTE_JOGO_MS, instanteCorrente()); });
    return <ambientLight ref={luzRef} intensity={luz.intensidade} color={corDaLuz(luz)} />;
};

function LuzPontoMapaR3F({ luz, caminho, instanteCorrente }: { luz: FonteDeLuzMapa; caminho: readonly NoCorrenteAvaliacao[]; instanteCorrente: InstanteCorrenteMapa }) {
    const luzRef = useRef<PointLight>(null);
    // A intensidade do CONTRATO é percentual do alcance — a física (candela) deriva do helper, o mesmo do Editor; a corrente
    // multiplica por cima (gate desligado ou queda → 0).
    useFrame(() => { if (luzRef.current !== null) luzRef.current.intensity = intensidadeFisicaFonteDeLuzPontoMapa(luz.alcanceMetros, luz.intensidade) * fatorCorrenteCaminhoNoInstante(caminho, ANCORA_CORRENTE_JOGO_MS, instanteCorrente()); });
    return (
        <pointLight
            ref={luzRef}
            position={[luz.posicao[0], luz.posicao[1], luz.posicao[2]]}
            intensity={intensidadeFisicaFonteDeLuzPontoMapa(luz.alcanceMetros, luz.intensidade)}
            distance={luz.alcanceMetros}
            decay={2}
            color={corDaLuz(luz)}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0008}
            shadow-radius={5}
            shadow-camera-near={0.1}
            shadow-camera-far={Math.max(1, luz.alcanceMetros)}
        />
    );
};

// Soma das intensidades FÍSICAS que as luzes de ponto ENTREGAM no instante (corrente aplicada) — insumo do rebatimento
// (luz indireta fingida) da cena de jogo: corredor em queda escurece o rebatimento junto.
export function intensidadeTotalLuzesMapaNoInstante(luzes: readonly FonteDeLuzMapa[], caminhosCorrente: ReadonlyMap<string, readonly NoCorrenteAvaliacao[]>, instanteJogoMs: number): number {
    return luzes.reduce((soma, luz) => soma + (luz.tipo === 'PONTO' && Number.isFinite(luz.intensidade) ? intensidadeFisicaFonteDeLuzPontoMapa(luz.alcanceMetros, luz.intensidade) * fatorCorrenteCaminhoNoInstante(caminhosCorrente.get(luz.idLocal) ?? [], ANCORA_CORRENTE_JOGO_MS, instanteJogoMs) : 0), 0);
};