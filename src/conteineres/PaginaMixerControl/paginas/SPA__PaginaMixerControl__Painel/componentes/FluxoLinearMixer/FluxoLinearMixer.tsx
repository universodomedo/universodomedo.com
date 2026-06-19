'use client';

import { useMemo, useRef, useState, type CSSProperties, type ChangeEvent, type KeyboardEvent, type PointerEvent } from 'react';
import { type MixerStatusReproducao } from 'types-nora-api';

import styles from './styles.module.css';

const DURACAO_MINIMA_TRECHO_MS = 1000;

type EstiloFluxo = CSSProperties & { '--progresso': string; '--inicio-util': string; };
type EstiloTrecho = CSSProperties & { '--inicio': string; '--fim': string; };
type EstiloAmostraOnda = CSSProperties & { '--amplitude': string; };
type LadoArrastoTrecho = 'INICIO' | 'FIM';

interface ArrastoTrechoFluxo {
    id: string;
    lado: LadoArrastoTrecho;
};

export interface TrechoFluxoMixer {
    id: string;
    nome: string;
    inicioMs: number;
    fimMs: number;
    habilitado: boolean;
};

export interface AmostraOndaAudioMixer {
    id: string;
    amplitude: number;
};

export interface AtualizacaoTrechoFluxoMixer {
    nome?: string;
    inicioMs?: number;
    fimMs?: number;
    habilitado?: boolean;
};

interface FluxoLinearMixerProps {
    status: MixerStatusReproducao;
    duracaoMs: number;
    posicaoMs: number;
    inicioUtilMs: number;
    ondaAudio: AmostraOndaAudioMixer[];
    carregandoOndaAudio: boolean;
    trechos: TrechoFluxoMixer[];
    podeControlar: boolean;
    aoAlternarStatus: () => void;
    aoDefinirPosicao: (posicaoMs: number) => void;
    aoDefinirInicioUtil: (posicaoMs: number) => void;
    aoIrParaInicioUtil: () => void;
    aoCriarTrecho: () => string | null;
    aoAtualizarTrecho: (id: string, atualizacao: AtualizacaoTrechoFluxoMixer) => void;
    aoRemoverTrecho: (id: string) => void;
};

function limitaPosicao(posicaoMs: number, duracaoMs: number): number { return Math.max(0, Math.min(duracaoMs, Math.round(posicaoMs))); };

function formataTempo(ms: number): string {
    const totalMs = Math.max(0, Math.round(ms));
    const minutos = Math.floor(totalMs / 60000);
    const segundos = Math.floor((totalMs % 60000) / 1000);
    const milissegundos = totalMs % 1000;
    return `${minutos}:${segundos.toString().padStart(2, '0')}.${milissegundos.toString().padStart(3, '0')}`;
};

function criaEstiloTrecho(trecho: TrechoFluxoMixer, duracaoMs: number): EstiloTrecho {
    const inicio = duracaoMs > 0 ? limitaPosicao(trecho.inicioMs, duracaoMs) / duracaoMs : 0;
    const fim = duracaoMs > 0 ? limitaPosicao(trecho.fimMs, duracaoMs) / duracaoMs : 0;
    return { '--inicio': String(inicio), '--fim': String(Math.max(inicio, fim)) };
};

function nomeTrecho(trecho: TrechoFluxoMixer): string { return trecho.nome.trim() || 'Trecho'; };

function criaEstiloAmostraOnda(amostra: AmostraOndaAudioMixer): EstiloAmostraOnda { return { '--amplitude': String(Math.max(0.08, Math.min(1, amostra.amplitude))) }; };

export default function FluxoLinearMixer({ status, duracaoMs, posicaoMs, inicioUtilMs, ondaAudio, carregandoOndaAudio, trechos, podeControlar, aoAlternarStatus, aoDefinirPosicao, aoDefinirInicioUtil, aoIrParaInicioUtil, aoCriarTrecho, aoAtualizarTrecho, aoRemoverTrecho }: FluxoLinearMixerProps) {
    const trilhaRef = useRef<HTMLDivElement | null>(null);
    const [posicaoArrastoMs, setPosicaoArrastoMs] = useState<number | null>(null);
    const [trechoSelecionadoId, setTrechoSelecionadoId] = useState<string | null>(null);
    const [arrastoTrecho, setArrastoTrecho] = useState<ArrastoTrechoFluxo | null>(null);
    const posicaoExibidaMs = posicaoArrastoMs ?? posicaoMs;
    const progresso = duracaoMs > 0 ? limitaPosicao(posicaoExibidaMs, duracaoMs) / duracaoMs : 0;
    const progressoInicioUtil = duracaoMs > 0 ? limitaPosicao(inicioUtilMs, duracaoMs) / duracaoMs : 0;
    const estiloFluxo = useMemo<EstiloFluxo>(() => ({ '--progresso': String(progresso), '--inicio-util': String(progressoInicioUtil) }), [progresso, progressoInicioUtil]);
    const trechoSelecionado = useMemo(() => trechos.find(trecho => trecho.id === trechoSelecionadoId) ?? null, [trechoSelecionadoId, trechos]);

    const calculaPosicaoPorCoordenada = (clientX: number): number => {
        const rect = trilhaRef.current?.getBoundingClientRect();
        if (!rect) return 0;
        const percentual = rect.width <= 0 ? 0 : (clientX - rect.left) / rect.width;
        return limitaPosicao(percentual * duracaoMs, duracaoMs);
    };

    const iniciarArrasto = (event: PointerEvent<HTMLDivElement>): void => {
        if (!podeControlar || arrastoTrecho) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setPosicaoArrastoMs(calculaPosicaoPorCoordenada(event.clientX));
    };

    const moverArrasto = (event: PointerEvent<HTMLDivElement>): void => {
        if (posicaoArrastoMs === null || !podeControlar || arrastoTrecho) return;
        setPosicaoArrastoMs(calculaPosicaoPorCoordenada(event.clientX));
    };

    const finalizarArrasto = (event: PointerEvent<HTMLDivElement>): void => {
        if (posicaoArrastoMs === null || !podeControlar || arrastoTrecho) return;
        const proximaPosicao = calculaPosicaoPorCoordenada(event.clientX);
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

    const criarTrecho = (): void => {
        const id = aoCriarTrecho();
        if (id) setTrechoSelecionadoId(id);
    };

    const marcarInicioAqui = (): void => {
        aoDefinirInicioUtil(posicaoExibidaMs);
    };

    const iniciarArrastoTrecho = (event: PointerEvent<HTMLButtonElement>, id: string, lado: LadoArrastoTrecho): void => {
        if (!podeControlar) return;
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        setTrechoSelecionadoId(id);
        setArrastoTrecho({ id, lado });
    };

    const moverArrastoTrecho = (event: PointerEvent<HTMLButtonElement>): void => {
        if (!arrastoTrecho || !podeControlar) return;
        event.preventDefault();
        event.stopPropagation();
        const trecho = trechos.find(item => item.id === arrastoTrecho.id);
        if (!trecho) return;
        const posicaoMsNova = calculaPosicaoPorCoordenada(event.clientX);
        if (arrastoTrecho.lado === 'INICIO') {
            aoAtualizarTrecho(arrastoTrecho.id, { inicioMs: Math.min(posicaoMsNova, trecho.fimMs - DURACAO_MINIMA_TRECHO_MS) });
            return;
        }
        aoAtualizarTrecho(arrastoTrecho.id, { fimMs: Math.max(posicaoMsNova, trecho.inicioMs + DURACAO_MINIMA_TRECHO_MS) });
    };

    const finalizarArrastoTrecho = (event: PointerEvent<HTMLButtonElement>): void => {
        if (!arrastoTrecho) return;
        event.preventDefault();
        event.stopPropagation();
        setArrastoTrecho(null);
    };

    const selecionarTrechoPorTeclado = (event: KeyboardEvent<HTMLDivElement>, id: string): void => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        setTrechoSelecionadoId(id);
    };

    const renomearTrechoSelecionado = (event: ChangeEvent<HTMLInputElement>): void => {
        if (!trechoSelecionado) return;
        aoAtualizarTrecho(trechoSelecionado.id, { nome: event.target.value });
    };

    const alternarTrechoSelecionado = (): void => {
        if (!trechoSelecionado) return;
        aoAtualizarTrecho(trechoSelecionado.id, { habilitado: !trechoSelecionado.habilitado });
    };

    const removerTrechoSelecionado = (): void => {
        if (!trechoSelecionado) return;
        aoRemoverTrecho(trechoSelecionado.id);
        setTrechoSelecionadoId(null);
    };

    return (
        <section className={styles.fluxoMixer} data-status={status}>
            <header className={styles.cabecalhoFluxo}>
                <div className={styles.acoesFluxo}>
                    <button type="button" className={styles.botaoEstado} onClick={aoAlternarStatus} disabled={!podeControlar}>{status === 'TOCANDO' ? 'Pausar' : 'Tocar'}</button>
                    <button type="button" className={styles.botaoInicioUtil} onClick={marcarInicioAqui} disabled={!podeControlar}>Marcar inicio</button>
                    <button type="button" className={styles.botaoInicioUtil} onClick={aoIrParaInicioUtil} disabled={!podeControlar}>Ir ao inicio</button>
                    <button type="button" className={styles.botaoCriarTrecho} onClick={criarTrecho} disabled={!podeControlar}>Criar trecho</button>
                </div>
                <div className={styles.temposFluxo}>
                    <span>{formataTempo(posicaoExibidaMs)}</span>
                    <span>Inicio {formataTempo(inicioUtilMs)}</span>
                </div>
            </header>
            <div className={styles.areaFluxo}>
                <span className={styles.noInicio}>IN</span>
                <div ref={trilhaRef} className={styles.trilhaFluxo} style={estiloFluxo} role="slider" aria-label="Posicao da musica" aria-disabled={!podeControlar} aria-valuemin={0} aria-valuemax={duracaoMs} aria-valuenow={limitaPosicao(posicaoExibidaMs, duracaoMs)} aria-valuetext={formataTempo(posicaoExibidaMs)} tabIndex={podeControlar ? 0 : -1} onKeyDown={definirPorTeclado} onPointerDown={iniciarArrasto} onPointerMove={moverArrasto} onPointerUp={finalizarArrasto} onPointerCancel={() => { setPosicaoArrastoMs(null); }}>
                    <span className={styles.barrigaInicial} />
                    <div className={styles.ondaAudio} data-carregando={carregandoOndaAudio ? 'true' : 'false'} aria-hidden="true">
                        {ondaAudio.map(amostra => <span key={amostra.id} className={styles.amostraOnda} style={criaEstiloAmostraOnda(amostra)} />)}
                        {carregandoOndaAudio && ondaAudio.length === 0 && <span className={styles.carregandoOnda} />}
                    </div>
                    <span className={styles.linhaBase} />
                    <span className={styles.linhaExecutada} />
                    <span className={styles.marcadorInicioUtil}><span>Inicio</span></span>
                    <span className={styles.marcadorExecucao} />
                    <div className={styles.camadaTrechos}>
                        {trechos.map(trecho => (
                            <div key={trecho.id} className={styles.trechoFluxo} style={criaEstiloTrecho(trecho, duracaoMs)} role="button" tabIndex={podeControlar ? 0 : -1} data-selecionado={trecho.id === trechoSelecionadoId ? 'true' : 'false'} data-habilitado={trecho.habilitado ? 'true' : 'false'} onClick={event => { event.stopPropagation(); setTrechoSelecionadoId(trecho.id); }} onKeyDown={event => selecionarTrechoPorTeclado(event, trecho.id)} onPointerDown={event => { event.stopPropagation(); }}>
                                <button type="button" className={styles.alcaTrecho} aria-label={`Mover inicio de ${nomeTrecho(trecho)}`} onClick={event => { event.stopPropagation(); }} onPointerDown={event => iniciarArrastoTrecho(event, trecho.id, 'INICIO')} onPointerMove={moverArrastoTrecho} onPointerUp={finalizarArrastoTrecho} onPointerCancel={finalizarArrastoTrecho} />
                                <span className={styles.nomeTrecho}>{nomeTrecho(trecho)}</span>
                                <button type="button" className={styles.alcaTrecho} aria-label={`Mover fim de ${nomeTrecho(trecho)}`} onClick={event => { event.stopPropagation(); }} onPointerDown={event => iniciarArrastoTrecho(event, trecho.id, 'FIM')} onPointerMove={moverArrastoTrecho} onPointerUp={finalizarArrastoTrecho} onPointerCancel={finalizarArrastoTrecho} />
                            </div>
                        ))}
                    </div>
                </div>
                <span className={styles.noFim}>{formataTempo(duracaoMs)}</span>
            </div>
            {trechoSelecionado && (
                <section className={styles.editorTrecho}>
                    <label className={styles.campoTrecho}>
                        <span>Nome</span>
                        <input type="text" value={trechoSelecionado.nome} onChange={renomearTrechoSelecionado} disabled={!podeControlar} />
                    </label>
                    <div className={styles.metricasTrecho}>
                        <span>Inicio {formataTempo(trechoSelecionado.inicioMs)}</span>
                        <span>Fim {formataTempo(trechoSelecionado.fimMs)}</span>
                    </div>
                    <div className={styles.acoesTrecho}>
                        <button type="button" onClick={alternarTrechoSelecionado} disabled={!podeControlar}>{trechoSelecionado.habilitado ? 'Desativar' : 'Ativar'}</button>
                        <button type="button" onClick={removerTrechoSelecionado} disabled={!podeControlar}>Remover</button>
                    </div>
                </section>
            )}
        </section>
    );
};