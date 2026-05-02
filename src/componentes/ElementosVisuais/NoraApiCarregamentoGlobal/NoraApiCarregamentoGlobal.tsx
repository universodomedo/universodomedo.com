'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './styles.module.css';

import { NORA_API_CARREGAMENTO_VISUAL } from 'Api/NoraApiCarregamentoVisual.const';
import useEstadoRequisicoesNoraApi from 'Hooks/useEstadoRequisicoesNoraApi';

const NoraApiCarregamentoFase = {
    OCULTO: 'OCULTO',
    ATIVO: 'ATIVO',
    FINALIZANDO: 'FINALIZANDO',
    SUMINDO: 'SUMINDO',
} as const;

type NoraApiCarregamentoFase = typeof NoraApiCarregamentoFase[keyof typeof NoraApiCarregamentoFase];

function obtemNumeroAleatorio(minimo: number, maximo: number): number {
    return minimo + (Math.random() * (maximo - minimo));
};

function calculaProgressoEstimadoPorTempo(tempoDecorridoMs: number): number {
    const progressoNormalizado = 1 - Math.exp(-tempoDecorridoMs / NORA_API_CARREGAMENTO_VISUAL.TEMPO_BASE_CURVA_MS);
    const progresso = NORA_API_CARREGAMENTO_VISUAL.PROGRESSO_PULO_INICIAL_MINIMO + ((NORA_API_CARREGAMENTO_VISUAL.PROGRESSO_MAXIMO_DURANTE_REQUISICAO - NORA_API_CARREGAMENTO_VISUAL.PROGRESSO_PULO_INICIAL_MINIMO) * progressoNormalizado);

    return Math.min(NORA_API_CARREGAMENTO_VISUAL.PROGRESSO_MAXIMO_DURANTE_REQUISICAO, progresso);
};

function calculaIncrementoMinimoOrganico(progressoAtual: number): number {
    if (progressoAtual < 25) return obtemNumeroAleatorio(1.4, 4.8);
    if (progressoAtual < 65) return obtemNumeroAleatorio(0.7, 2.6);
    if (progressoAtual < 85) return obtemNumeroAleatorio(0.3, 1.2);

    return obtemNumeroAleatorio(0.08, 0.45);
};

function devePausarProgresso(progressoAtual: number): boolean {
    if (progressoAtual < 20) return Math.random() < 0.08;
    if (progressoAtual < 70) return Math.random() < 0.2;

    return Math.random() < 0.32;
};

function calculaDuracaoPausaMs(progressoAtual: number): number {
    if (progressoAtual < 35) return obtemNumeroAleatorio(90, 210);
    if (progressoAtual < 75) return obtemNumeroAleatorio(120, 330);

    return obtemNumeroAleatorio(180, 520);
};

function calculaProximoProgressoOrganico(progressoAtual: number, tempoDecorridoMs: number): number {
    const progressoEstimado = calculaProgressoEstimadoPorTempo(tempoDecorridoMs);

    if (progressoEstimado <= progressoAtual) return progressoAtual;

    const distancia = progressoEstimado - progressoAtual;
    const fatorAproximacao = obtemNumeroAleatorio(0.16, 0.58);
    const incrementoMinimo = calculaIncrementoMinimoOrganico(progressoAtual);
    const progressoNovo = progressoAtual + Math.max(incrementoMinimo, distancia * fatorAproximacao);

    return Math.min(NORA_API_CARREGAMENTO_VISUAL.PROGRESSO_MAXIMO_DURANTE_REQUISICAO, progressoEstimado, progressoNovo);
};

export default function NoraApiCarregamentoGlobal() {
    const estadoRequisicoesNoraApi = useEstadoRequisicoesNoraApi();
    const [fase, setFase] = useState<NoraApiCarregamentoFase>(NoraApiCarregamentoFase.OCULTO);
    const [progresso, setProgresso] = useState(0);
    const inicioRequisicaoRef = useRef<number | null>(null);
    const timeoutPuloInicialRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timeoutReverbRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timeoutEsconderRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pausaAteMsRef = useRef(0);

    useEffect(() => {
        if (!estadoRequisicoesNoraApi.existeRequisicaoAtiva) return;

        if (timeoutReverbRef.current) {
            clearTimeout(timeoutReverbRef.current);
            timeoutReverbRef.current = null;
        }

        if (timeoutEsconderRef.current) {
            clearTimeout(timeoutEsconderRef.current);
            timeoutEsconderRef.current = null;
        }

        inicioRequisicaoRef.current = Date.now();
        pausaAteMsRef.current = 0;
        setFase(NoraApiCarregamentoFase.ATIVO);
        setProgresso(obtemNumeroAleatorio(NORA_API_CARREGAMENTO_VISUAL.PROGRESSO_INICIAL_MINIMO, NORA_API_CARREGAMENTO_VISUAL.PROGRESSO_INICIAL_MAXIMO));

        if (timeoutPuloInicialRef.current) clearTimeout(timeoutPuloInicialRef.current);

        timeoutPuloInicialRef.current = setTimeout(() => {
            setProgresso(progressoAtual => Math.max(progressoAtual, obtemNumeroAleatorio(NORA_API_CARREGAMENTO_VISUAL.PROGRESSO_PULO_INICIAL_MINIMO, NORA_API_CARREGAMENTO_VISUAL.PROGRESSO_PULO_INICIAL_MAXIMO)));
            timeoutPuloInicialRef.current = null;
        }, NORA_API_CARREGAMENTO_VISUAL.TEMPO_PULO_INICIAL_MS);
    }, [estadoRequisicoesNoraApi.existeRequisicaoAtiva]);

    useEffect(() => {
        if (!estadoRequisicoesNoraApi.existeRequisicaoAtiva) return;
        if (fase !== NoraApiCarregamentoFase.ATIVO) return;

        const interval = setInterval(() => {
            const agora = Date.now();

            setProgresso(progressoAtual => {
                if (pausaAteMsRef.current > agora) return progressoAtual;

                if (devePausarProgresso(progressoAtual)) {
                    pausaAteMsRef.current = agora + calculaDuracaoPausaMs(progressoAtual);
                    return progressoAtual;
                }

                const inicio = inicioRequisicaoRef.current ?? agora;
                const tempoDecorridoMs = agora - inicio;

                return calculaProximoProgressoOrganico(progressoAtual, tempoDecorridoMs);
            });
        }, NORA_API_CARREGAMENTO_VISUAL.INTERVALO_ATUALIZACAO_MS);

        return () => {
            clearInterval(interval);
        };
    }, [estadoRequisicoesNoraApi.existeRequisicaoAtiva, fase]);

    useEffect(() => {
        if (estadoRequisicoesNoraApi.existeRequisicaoAtiva) return;
        if (fase !== NoraApiCarregamentoFase.ATIVO) return;

        if (timeoutPuloInicialRef.current) {
            clearTimeout(timeoutPuloInicialRef.current);
            timeoutPuloInicialRef.current = null;
        }

        setFase(NoraApiCarregamentoFase.FINALIZANDO);
        setProgresso(NORA_API_CARREGAMENTO_VISUAL.PROGRESSO_FINAL);

        timeoutReverbRef.current = setTimeout(() => {
            setFase(NoraApiCarregamentoFase.SUMINDO);

            timeoutEsconderRef.current = setTimeout(() => {
                inicioRequisicaoRef.current = null;
                pausaAteMsRef.current = 0;
                setFase(NoraApiCarregamentoFase.OCULTO);
                setProgresso(0);
                timeoutReverbRef.current = null;
                timeoutEsconderRef.current = null;
            }, NORA_API_CARREGAMENTO_VISUAL.TEMPO_FADE_OUT_MS);
        }, NORA_API_CARREGAMENTO_VISUAL.TEMPO_FINALIZACAO_MS + NORA_API_CARREGAMENTO_VISUAL.TEMPO_REVERB_FINAL_MS);
    }, [estadoRequisicoesNoraApi.existeRequisicaoAtiva, fase]);

    useEffect(() => {
        return () => {
            if (timeoutPuloInicialRef.current) clearTimeout(timeoutPuloInicialRef.current);
            if (timeoutReverbRef.current) clearTimeout(timeoutReverbRef.current);
            if (timeoutEsconderRef.current) clearTimeout(timeoutEsconderRef.current);
        };
    }, []);

    return (
        <>
            <div className={`${styles.recipiente_barra} ${fase !== NoraApiCarregamentoFase.OCULTO ? styles.recipiente_barra_ativo : ''} ${fase === NoraApiCarregamentoFase.SUMINDO ? styles.recipiente_barra_sumindo : ''}`} aria-hidden={fase === NoraApiCarregamentoFase.OCULTO}>
                <div className={`${styles.barra} ${fase === NoraApiCarregamentoFase.FINALIZANDO ? styles.barra_finalizando : ''} ${fase === NoraApiCarregamentoFase.SUMINDO ? styles.barra_sumindo : ''}`} style={{ transform: `scaleX(${progresso / 100})` }} />
            </div>
            <div className={`${styles.overlay_bloqueante} ${estadoRequisicoesNoraApi.existeRequisicaoBloqueante ? styles.overlay_bloqueante_ativo : ''}`} aria-hidden={!estadoRequisicoesNoraApi.existeRequisicaoBloqueante} />
        </>
    );
};