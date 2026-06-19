'use client';

import { useMemo, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { type MixerStatusReproducao } from 'types-nora-api';

import styles from './styles.module.css';

type EstiloFluxo = CSSProperties & { '--progresso': string; };

interface FluxoLinearMixerProps {
    status: MixerStatusReproducao;
    duracaoMs: number;
    posicaoMs: number;
    podeControlar: boolean;
    aoAlternarStatus: () => void;
    aoDefinirPosicao: (posicaoMs: number) => void;
};

function limitaPosicao(posicaoMs: number, duracaoMs: number): number { return Math.max(0, Math.min(duracaoMs, Math.round(posicaoMs))); };

function formataTempo(ms: number): string {
    const totalSegundos = Math.max(0, Math.round(ms / 1000));
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
};

export default function FluxoLinearMixer({ status, duracaoMs, posicaoMs, podeControlar, aoAlternarStatus, aoDefinirPosicao }: FluxoLinearMixerProps) {
    const [posicaoArrastoMs, setPosicaoArrastoMs] = useState<number | null>(null);
    const posicaoExibidaMs = posicaoArrastoMs ?? posicaoMs;
    const progresso = duracaoMs > 0 ? limitaPosicao(posicaoExibidaMs, duracaoMs) / duracaoMs : 0;
    const estiloFluxo = useMemo<EstiloFluxo>(() => ({ '--progresso': String(progresso) }), [progresso]);

    const calculaPosicaoPorEvento = (event: PointerEvent<HTMLDivElement>): number => {
        const rect = event.currentTarget.getBoundingClientRect();
        const percentual = rect.width <= 0 ? 0 : (event.clientX - rect.left) / rect.width;
        return limitaPosicao(percentual * duracaoMs, duracaoMs);
    };

    const iniciarArrasto = (event: PointerEvent<HTMLDivElement>): void => {
        if (!podeControlar) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setPosicaoArrastoMs(calculaPosicaoPorEvento(event));
    };

    const moverArrasto = (event: PointerEvent<HTMLDivElement>): void => {
        if (posicaoArrastoMs === null || !podeControlar) return;
        setPosicaoArrastoMs(calculaPosicaoPorEvento(event));
    };

    const finalizarArrasto = (event: PointerEvent<HTMLDivElement>): void => {
        if (posicaoArrastoMs === null || !podeControlar) return;
        const proximaPosicao = calculaPosicaoPorEvento(event);
        setPosicaoArrastoMs(null);
        aoDefinirPosicao(proximaPosicao);
    };

    const definirPorTeclado = (event: KeyboardEvent<HTMLDivElement>): void => {
        if (!podeControlar) return;
        const passoMs = event.shiftKey ? 10000 : 1000;
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            aoDefinirPosicao(limitaPosicao(posicaoExibidaMs - passoMs, duracaoMs));
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            aoDefinirPosicao(limitaPosicao(posicaoExibidaMs + passoMs, duracaoMs));
        }
        if (event.key === 'Home') {
            event.preventDefault();
            aoDefinirPosicao(0);
        }
        if (event.key === 'End') {
            event.preventDefault();
            aoDefinirPosicao(duracaoMs);
        }
    };

    return (
        <section className={styles.fluxoMixer} data-status={status}>
            <header className={styles.cabecalhoFluxo}>
                <button type="button" className={styles.botaoEstado} onClick={aoAlternarStatus} disabled={!podeControlar}>{status === 'TOCANDO' ? 'Pausar' : 'Tocar'}</button>
                <span className={styles.tempoAtual}>{formataTempo(posicaoExibidaMs)}</span>
            </header>
            <div className={styles.areaFluxo}>
                <span className={styles.noInicio}>IN</span>
                <div className={styles.trilhaFluxo} style={estiloFluxo} role="slider" aria-label="Posicao da musica" aria-disabled={!podeControlar} aria-valuemin={0} aria-valuemax={duracaoMs} aria-valuenow={limitaPosicao(posicaoExibidaMs, duracaoMs)} aria-valuetext={formataTempo(posicaoExibidaMs)} tabIndex={podeControlar ? 0 : -1} onKeyDown={definirPorTeclado} onPointerDown={iniciarArrasto} onPointerMove={moverArrasto} onPointerUp={finalizarArrasto} onPointerCancel={() => { setPosicaoArrastoMs(null); }}>
                    <span className={styles.linhaBase} />
                    <span className={styles.linhaExecutada} />
                    <span className={styles.marcadorExecucao} />
                </div>
                <span className={styles.noFim}>{formataTempo(duracaoMs)}</span>
            </div>
        </section>
    );
};