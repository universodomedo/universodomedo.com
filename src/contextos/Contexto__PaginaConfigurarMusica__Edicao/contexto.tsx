'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BlocoMontagemMusica, GraphqlLeituras, MontagemMusica, TransicaoLoopMontagemMusica } from 'types-nora-api';

import useNoraGraphQLConsulta, { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader';
import { calcularGanhoNormalizacao, detalharGanhoNormalizacao, LIMIAR_LRA_DINAMICA_ALTA } from 'Uteis/Loudness/normalizacaoLoudness';
import { GANHO_POR_NIVEL_VOLUME } from 'Redux/slices/audioPaginaSlice';
import { criaMusicaConfigurada, atualizaMusicaConfigurada } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { type Contexto__PaginaConfigurarMusica__Props } from '../Contexto__PaginaConfigurarMusica/contexto';
import { Contexto__PaginaConfigurarMusica__Edicao__Abas__Provider } from '../Contexto__PaginaConfigurarMusica__Edicao__Abas/contexto';
import SPA__PaginaConfigurarMusica__Edicao from 'Conteineres/PaginaConfigurarMusica/paginas/SPA__PaginaConfigurarMusica__Edicao/SPA__PaginaConfigurarMusica__Edicao';

const SELECT_ARQUIVO = { id: true, arquivo: { id: true, caminhoArquivo: true, tipoMime: true }, loudnessLufs: true, picoDbfs: true, lraLu: true } as const;
const SELECT_DIMENSAO = { id: true, nome: true, bipolar: true, rotuloOposto: true } as const;
const SELECT_MUSICA = { id: true, montagem: { inicioMs: true, retornoMs: true, fimMs: true, blocos: { id: true, nome: true, inicioMs: true, fimMs: true }, transicaoLoop: { duracaoFadeOutMs: true, duracaoFadeInMs: true, sobreposicaoInicioLoopMs: true }, automacaoVolume: { tMs: true, ganhoDb: true } }, clima: { itens: { idDimensao: true, nivel: true } } } as const;

const QTD_PICOS = 600;
const DURACAO_MINIMA_BLOCO_MS = 200;
const ANTECEDENCIA_TESTE_LOOP_MS = 4000;
const CAUDA_TESTE_LOOP_MS = 4000;
const TRANSICAO_LOOP_PADRAO: TransicaoLoopMontagemMusica = { duracaoFadeOutMs: 0, duracaoFadeInMs: 0, sobreposicaoInicioLoopMs: 0 };
const AMOSTRAS_CURVA_FADE = 64;
const PRE_EMENDA_MS = 2500;
const POS_EMENDA_MS = 2500;
const MICRO_FADE_EMENDA_MS = 12;
const MICRO_WRAP_EMENDA_MS = 30;
const LOOKAHEAD_EMENDA_S = 0.4;

// Curvas de potencia constante (equal-power): dois fades simultaneos mantem o volume constante na emenda, sem o "buraco" de -3 dB do fade linear.
const CURVA_FADE_SOBE = criaCurvaEqualPower(true);
const CURVA_FADE_DESCE = criaCurvaEqualPower(false);

function criaCurvaEqualPower(subindo: boolean): Float32Array {
    const curva = new Float32Array(AMOSTRAS_CURVA_FADE);
    for (let i = 0; i < AMOSTRAS_CURVA_FADE; i++) {
        const fracao = i / (AMOSTRAS_CURVA_FADE - 1);
        curva[i] = subindo ? Math.sin((fracao * Math.PI) / 2) : Math.cos((fracao * Math.PI) / 2);
    }
    return curva;
};

export type CampoTransicaoLoop = 'duracaoFadeOutMs' | 'duracaoFadeInMs' | 'sobreposicaoInicioLoopMs';
export type ClimaItemEdicao = { idDimensao: number; nivel: number };
export type DimensaoClimaOpcao = { id: number; nome: string; bipolar: boolean; rotuloOposto: string | null };
export type AnaliseAudio = { loudnessLufs: number; lraLu: number | null; picoDbfs: number; ganhoDb: number; travadoAntiClip: boolean; dinamicaAlta: boolean };
export type PontoAutomacao = { id: string; tMs: number; ganhoDb: number };
type ArquivoSelecionado = NonNullable<Contexto__PaginaConfigurarMusica__Props['arquivoSelecionado']>;
type ModoReproducao = { tipo: 'parado' } | { tipo: 'livre' } | { tipo: 'trecho'; ateMs: number } | { tipo: 'loop' } | { tipo: 'emenda' };
type Segmento = { baseMs: number; ctxStart: number; ateMs: number | null };
type NodeAutomacao = { source: AudioBufferSourceNode; ganhoAuto: GainNode; offsetMs: number; durTrechoMs: number; ctxInicio: number; tFim: number };

// Ganho linear (dB→linear) da automacao de volume no instante ms do buffer, interpolando entre pontos. Sem pontos → 1 (neutro).
function ganhoLinearAutomacaoEm(pontos: readonly PontoAutomacao[], ms: number): number {
    if (pontos.length === 0) return 1;
    if (ms <= pontos[0].tMs) return Math.pow(10, pontos[0].ganhoDb / 20);
    const ultimo = pontos[pontos.length - 1];
    if (ms >= ultimo.tMs) return Math.pow(10, ultimo.ganhoDb / 20);
    for (let i = 0; i < pontos.length - 1; i++) { const a = pontos[i], b = pontos[i + 1]; if (ms >= a.tMs && ms <= b.tMs) { const f = (ms - a.tMs) / (b.tMs - a.tMs); return Math.pow(10, (a.ganhoDb + f * (b.ganhoDb - a.ganhoDb)) / 20); } }
    return 1;
};

// Programa a envelope de automacao no ganhoAuto pro trecho [offsetMs, offsetMs+durTrechoMs] mapeado ao AudioContext por ctxInicio; agenda de tStart ate tFim. Reprogramavel ao vivo passando tStart=agora (arraste durante o playback).
function programarEnvelopeAutomacao(ganhoAuto: GainNode, pontos: readonly PontoAutomacao[], offsetMs: number, durTrechoMs: number, ctxInicio: number, tStart: number, tFim: number): void {
    const msEm = (t: number): number => offsetMs + (t - ctxInicio) * 1000;
    ganhoAuto.gain.cancelScheduledValues(tStart);
    ganhoAuto.gain.setValueAtTime(ganhoLinearAutomacaoEm(pontos, msEm(tStart)), tStart);
    for (const p of pontos) { const tp = ctxInicio + (p.tMs - offsetMs) / 1000; if (tp > tStart && tp < tFim) ganhoAuto.gain.linearRampToValueAtTime(Math.pow(10, p.ganhoDb / 20), tp); }
    ganhoAuto.gain.linearRampToValueAtTime(ganhoLinearAutomacaoEm(pontos, offsetMs + durTrechoMs), tFim);
};

interface Contexto__PaginaConfigurarMusica__Edicao__Props {
    configurada: boolean;
    analiseAudio: AnaliseAudio | null;

    carregandoAudio: boolean;
    erroAudio: string | null;
    picos: number[];
    montagemPronta: boolean;
    inicioMs: number;
    retornoMs: number;
    fimMs: number;
    duracaoMs: number;
    blocos: readonly BlocoMontagemMusica[];
    transicaoLoop: TransicaoLoopMontagemMusica;
    blocoSelecionadoId: string | null;
    blocoSelecionado: BlocoMontagemMusica | null;

    setInicioMs: (ms: number) => void;
    setRetornoMs: (ms: number) => void;
    setFimMs: (ms: number) => void;
    selecionarBloco: (id: string | null) => void;
    renomearBloco: (id: string, nome: string) => void;
    dividirEm: (ms: number) => void;
    moverFronteira: (indice: number, ms: number) => void;
    removerBloco: (id: string) => void;
    setCampoTransicaoLoop: (campo: CampoTransicaoLoop, valor: number) => void;
    marcarInicio: () => void;
    marcarRetorno: () => void;
    marcarFim: () => void;
    cortarNaPosicao: () => void;

    climaItens: ClimaItemEdicao[];
    dimensoesCatalogo: DimensaoClimaOpcao[];
    adicionarDimensaoClima: (idDimensao: number) => void;
    setNivelClima: (idDimensao: number, nivel: number) => void;
    removerDimensaoClima: (idDimensao: number) => void;

    automacaoVolume: PontoAutomacao[];
    adicionarPontoAutomacao: (tMs: number, ganhoDb: number) => void;
    moverPontoAutomacao: (id: string, tMs: number, ganhoDb: number) => void;
    removerPontoAutomacao: (id: string) => void;

    lowCutHz: number;
    setLowCutHz: (hz: number) => void;

    tocando: boolean;
    posicaoMs: number;
    alternarPlayPause: () => void;
    parar: () => void;
    tocarDoInicio: () => void;
    tocarBloco: (id: string) => void;
    testarLoop: () => void;
    repetirEmenda: () => void;
    irParaMs: (ms: number) => void;

    salvar: () => Promise<void>;
    salvando: boolean;
    erroSalvar: string | null;
    podeSalvar: boolean;
};

const Contexto__PaginaConfigurarMusica__Edicao = createContext<Contexto__PaginaConfigurarMusica__Edicao__Props | undefined>(undefined);

export const useContexto__PaginaConfigurarMusica__Edicao = (): Contexto__PaginaConfigurarMusica__Edicao__Props => {
    const context = useContext(Contexto__PaginaConfigurarMusica__Edicao);
    if (!context) throw new Error('useContexto__PaginaConfigurarMusica__Edicao precisa estar dentro de um Contexto__PaginaConfigurarMusica__Edicao__Provider');
    return context;
};

export const Contexto__PaginaConfigurarMusica__Edicao__Provider = ({ arquivo, deseleciona, recarregarListagem }: { arquivo: ArquivoSelecionado; deseleciona: () => void; recarregarListagem: () => void; }) => {
    const configurada = arquivo.idMusicaConfigurada !== null;
    useConfigurarLayoutContextualizado({ subtitulo: `${arquivo.nomeFonte} · ${arquivo.nomeMusica}`, fecharProps: { tipo: 'acao', executar: () => deseleciona(), tituloTooltip: 'Voltar para a listagem' } });

    const registroArquivo = useNoraGraphQLRegistro('ArquivoTipadoMusica', { props: { id: arquivo.id }, pk: arquivo.id, select: SELECT_ARQUIVO, carregando: 'Carregando arquivo', mensagemErro: 'Não foi possível carregar o arquivo da música.', carregamento: NoraApiCarregamento.BARRA });
    const registroMusica = useNoraGraphQLRegistro('MusicaConfigurada', { props: { id: arquivo.idMusicaConfigurada ?? 0 }, pk: arquivo.idMusicaConfigurada ?? 0, select: SELECT_MUSICA, carregando: 'Carregando montagem', mensagemErro: 'Não foi possível carregar a montagem.', carregamento: NoraApiCarregamento.BARRA, executarAoMontar: configurada });
    const consultaDimensoes = useNoraGraphQLConsulta(() => GraphqlLeituras.DimensaoClima.eventos.varios({ parametros: { limit: 100, offset: 0 }, select: SELECT_DIMENSAO }), { valorInicial: [], carregando: 'Carregando dimensões', mensagemErro: 'Não foi possível carregar as dimensões.', carregamento: NoraApiCarregamento.BARRA });

    const caminhoArquivo = registroArquivo.data?.arquivo?.caminhoArquivo ?? null;

    const [montagem, setMontagem] = useState<MontagemMusica | null>(null);
    const [blocoSelecionadoId, setBlocoSelecionadoId] = useState<string | null>(null);
    const [climaItens, setClimaItens] = useState<ClimaItemEdicao[]>([]);
    const [automacaoVolume, setAutomacaoVolume] = useState<PontoAutomacao[]>([]);
    const [lowCutHz, setLowCutHzState] = useState(0);

    const adicionarPontoAutomacao = useCallback((tMs: number, ganhoDb: number) => { setAutomacaoVolume(pontos => [...pontos, { id: crypto.randomUUID(), tMs: Math.round(tMs), ganhoDb }].sort((a, b) => a.tMs - b.tMs)); }, []);
    const moverPontoAutomacao = useCallback((id: string, tMs: number, ganhoDb: number) => { setAutomacaoVolume(pontos => pontos.map(p => p.id === id ? { ...p, tMs: Math.round(tMs), ganhoDb } : p).sort((a, b) => a.tMs - b.tMs)); }, []);
    const removerPontoAutomacao = useCallback((id: string) => { setAutomacaoVolume(pontos => pontos.filter(p => p.id !== id)); }, []);
    const setLowCutHz = useCallback((hz: number) => setLowCutHzState(Math.max(0, Math.min(400, Math.round(hz)))), []);

    const [picos, setPicos] = useState<number[]>([]);
    const [duracaoMs, setDuracaoMs] = useState(0);
    const [carregandoAudio, setCarregandoAudio] = useState(true);
    const [erroAudio, setErroAudio] = useState<string | null>(null);

    const [tocando, setTocando] = useState(false);
    const [posicaoMs, setPosicaoMs] = useState(0);
    const [salvando, setSalvando] = useState(false);
    const [erroSalvar, setErroSalvar] = useState<string | null>(null);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const bufferRef = useRef<AudioBuffer | null>(null);
    const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
    const segmentoRef = useRef<Segmento | null>(null);
    const trocaLoopRef = useRef<{ baseMs: number; ateMs: number } | null>(null);
    const loopPendenteRef = useRef(false);
    const modoRef = useRef<ModoReproducao>({ tipo: 'parado' });
    const rafRef = useRef<number | null>(null);
    const montagemRef = useRef<MontagemMusica | null>(null);
    const posicaoRef = useRef(0);
    const seedRef = useRef(false);
    const proximoStartRef = useRef(0);
    const segmentosEmendaRef = useRef<{ ctxStart: number; baseMs: number; durS: number }[]>([]);
    montagemRef.current = montagem;
    posicaoRef.current = posicaoMs;
    const automacaoVolumeRef = useRef<PontoAutomacao[]>([]);
    automacaoVolumeRef.current = automacaoVolume;
    const nodesAutomacaoRef = useRef<NodeAutomacao[]>([]);
    const lowCutHzRef = useRef(0);
    lowCutHzRef.current = lowCutHz;
    const lowCutRef = useRef<BiquadFilterNode | null>(null);

    // Medições do arquivo (fatos objetivos): loudness/pico alimentam a normalização; LRA sinaliza dinâmica.
    const loudnessLufs = registroArquivo.data?.loudnessLufs ?? null;
    const picoDbfs = registroArquivo.data?.picoDbfs ?? null;
    const lraLu = registroArquivo.data?.lraLu ?? null;

    // Preview normalizado: aplica no editor o MESMO ganho de loudness que a Central aplica no jogo (masterMax = 1, pois o preview toca sem master). Loudness nula (faixa antiga) → ganho 1.
    const ganhoNormalizacao = calcularGanhoNormalizacao(loudnessLufs, picoDbfs, 1);
    const ganhoNormalizacaoRef = useRef(1);
    ganhoNormalizacaoRef.current = ganhoNormalizacao;
    const noGanhoNormalizacaoRef = useRef<GainNode | null>(null);

    // Análise de áudio pro editor: fatos + ganho IN-GAME (masterMax = Máximo da Central) + sinais de dinâmica alta / ganho travado anti-clip.
    const analiseAudio: AnaliseAudio | null = loudnessLufs !== null && picoDbfs !== null
        ? { loudnessLufs, lraLu, picoDbfs, ...detalharGanhoNormalizacao(loudnessLufs, picoDbfs, GANHO_POR_NIVEL_VOLUME.MAXIMO), dinamicaAlta: lraLu !== null && lraLu >= LIMIAR_LRA_DINAMICA_ALTA }
        : null;

    // Busca e decodifica o arquivo uma vez: a forma de onda vem dos picos; o AudioBuffer alimenta o motor Web Audio (mesmo contexto da reproducao).
    useEffect(() => {
        if (!caminhoArquivo) return;
        let cancelado = false;
        setCarregandoAudio(true);
        setErroAudio(null);

        (async () => {
            try {
                const resposta = await fetch(getImageUrl(caminhoArquivo));
                const bytes = await resposta.arrayBuffer();
                if (cancelado) return;
                if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
                const decodificado = await audioCtxRef.current.decodeAudioData(bytes);
                if (cancelado) return;
                bufferRef.current = decodificado;
                setPicos(calcularPicos(decodificado, QTD_PICOS));
                setDuracaoMs(Math.round(decodificado.duration * 1000));
            } catch { if (!cancelado) setErroAudio('Não foi possível carregar ou decodificar o áudio.'); }
            finally { if (!cancelado) setCarregandoAudio(false); }
        })();

        return () => { cancelado = true; };
    }, [caminhoArquivo]);

    // Semeia o estado uma unica vez: a partir da montagem salva (edicao) ou de um bloco unico cobrindo toda a faixa (config nova).
    useEffect(() => {
        if (seedRef.current) return;

        if (configurada) {
            const dados = registroMusica.data;
            if (!dados) return;
            setMontagem({ inicioMs: dados.montagem.inicioMs, retornoMs: dados.montagem.retornoMs, fimMs: dados.montagem.fimMs, blocos: dados.montagem.blocos.map(bloco => ({ id: bloco.id, nome: bloco.nome, inicioMs: bloco.inicioMs, fimMs: bloco.fimMs })), transicaoLoop: { duracaoFadeOutMs: dados.montagem.transicaoLoop.duracaoFadeOutMs, duracaoFadeInMs: dados.montagem.transicaoLoop.duracaoFadeInMs, sobreposicaoInicioLoopMs: dados.montagem.transicaoLoop.sobreposicaoInicioLoopMs } });
            setClimaItens(dados.clima.itens.map(item => ({ idDimensao: item.idDimensao, nivel: item.nivel })));
            setAutomacaoVolume((dados.montagem.automacaoVolume ?? []).map(ponto => ({ id: crypto.randomUUID(), tMs: ponto.tMs, ganhoDb: ponto.ganhoDb })));
            setLowCutHzState(dados.montagem.lowCutHz ?? 0);
            if (duracaoMs <= 0) setDuracaoMs(dados.montagem.fimMs);
            seedRef.current = true;
            return;
        }

        if (duracaoMs <= 0) return;
        setMontagem({ inicioMs: 0, retornoMs: 0, fimMs: duracaoMs, blocos: [{ id: crypto.randomUUID(), nome: 'Bloco 1', inicioMs: 0, fimMs: duracaoMs }], transicaoLoop: { ...TRANSICAO_LOOP_PADRAO } });
        seedRef.current = true;
    }, [configurada, registroMusica.data, duracaoMs]);

    const cancelarRaf = useCallback(() => { if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } }, []);

    const pararSources = useCallback(() => {
        sourcesRef.current.forEach(source => { try { source.stop(); } catch { /* ja parado */ } source.disconnect(); });
        sourcesRef.current = [];
        nodesAutomacaoRef.current = [];
    }, []);

    const pararInterno = useCallback(() => {
        pararSources();
        cancelarRaf();
        loopPendenteRef.current = false;
        modoRef.current = { tipo: 'parado' };
        setTocando(false);
    }, [pararSources, cancelarRaf]);

    const iterar = useCallback(() => {
        const ctx = audioCtxRef.current;
        const segmento = segmentoRef.current;
        if (!ctx || !segmento) return;
        const pos = segmento.baseMs + (ctx.currentTime - segmento.ctxStart) * 1000;
        setPosicaoMs(pos);

        if (modoRef.current.tipo === 'loop' && loopPendenteRef.current && segmento.ateMs !== null && pos >= segmento.ateMs) {
            const troca = trocaLoopRef.current;
            if (troca) segmentoRef.current = { baseMs: troca.baseMs, ctxStart: ctx.currentTime, ateMs: troca.ateMs };
            loopPendenteRef.current = false;
            rafRef.current = requestAnimationFrame(iterar);
            return;
        }

        if (segmento.ateMs !== null && pos >= segmento.ateMs) { pararInterno(); return; }
        rafRef.current = requestAnimationFrame(iterar);
    }, [pararInterno]);

    // Agenda um trecho do buffer com fade-in (a partir do inicio) e fade-out (terminando no fim), no instante `quando` do AudioContext.
    const agendarFonte = useCallback((buffer: AudioBuffer, offsetMs: number, duracaoTrechoMs: number, quando: number, fadeInMs: number, fadeOutMs: number) => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const ganho = ctx.createGain();
        source.connect(ganho);
        if (!noGanhoNormalizacaoRef.current) {
            noGanhoNormalizacaoRef.current = ctx.createGain();
            lowCutRef.current = ctx.createBiquadFilter();
            lowCutRef.current.type = 'highpass';
            lowCutRef.current.Q.value = 0.707;
            lowCutRef.current.frequency.value = lowCutHzRef.current > 0 ? lowCutHzRef.current : 20;
            noGanhoNormalizacaoRef.current.connect(lowCutRef.current);
            lowCutRef.current.connect(ctx.destination);
        }
        noGanhoNormalizacaoRef.current.gain.value = ganhoNormalizacaoRef.current;
        const t0 = Math.max(ctx.currentTime, quando);
        const dur = Math.max(0.02, duracaoTrechoMs / 1000);
        // automação de volume: um ganho por-trecho que segue a curva (pontos) ao longo do buffer tocado; rastreado pra reprogramar ao vivo durante o arraste
        const ganhoAuto = ctx.createGain();
        programarEnvelopeAutomacao(ganhoAuto, automacaoVolumeRef.current, offsetMs, duracaoTrechoMs, t0, t0, t0 + dur);
        ganho.connect(ganhoAuto);
        ganhoAuto.connect(noGanhoNormalizacaoRef.current);
        nodesAutomacaoRef.current.push({ source, ganhoAuto, offsetMs, durTrechoMs: duracaoTrechoMs, ctxInicio: t0, tFim: t0 + dur });
        const fadeIn = fadeInMs / 1000;
        const fadeOut = fadeOutMs / 1000;
        const fadeInUsado = fadeIn > 0 ? Math.min(fadeIn, dur) : 0;
        if (fadeIn > 0) ganho.gain.setValueCurveAtTime(CURVA_FADE_SOBE, t0, fadeInUsado);
        else ganho.gain.setValueAtTime(1, t0);
        const fadeOutInicio = t0 + Math.max(fadeInUsado, dur - fadeOut);
        const fadeOutDuracao = t0 + dur - fadeOutInicio;
        if (fadeOut > 0 && fadeOutDuracao > 0) ganho.gain.setValueCurveAtTime(CURVA_FADE_DESCE, fadeOutInicio, fadeOutDuracao);
        source.onended = () => { try { source.disconnect(); } catch { /* ja desconectado */ } const indice = sourcesRef.current.indexOf(source); if (indice >= 0) sourcesRef.current.splice(indice, 1); const iAuto = nodesAutomacaoRef.current.findIndex(n => n.source === source); if (iAuto >= 0) nodesAutomacaoRef.current.splice(iAuto, 1); };
        source.start(t0, Math.max(0, offsetMs / 1000), dur);
        sourcesRef.current.push(source);
    }, []);

    // Enquanto a musica toca, arrastar/adicionar/remover um ponto reprograma a envelope das fontes ativas a partir de agora — o volume segue a curva ao vivo, sem reiniciar o trecho.
    const reagendarAutomacaoAtiva = useCallback(() => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const pontos = automacaoVolumeRef.current;
        const agora = ctx.currentTime;
        for (const n of nodesAutomacaoRef.current) {
            if (agora >= n.tFim) continue;
            programarEnvelopeAutomacao(n.ganhoAuto, pontos, n.offsetMs, n.durTrechoMs, n.ctxInicio, Math.max(agora, n.ctxInicio), n.tFim);
        }
    }, []);

    useEffect(() => { reagendarAutomacaoAtiva(); }, [automacaoVolume, reagendarAutomacaoAtiva]);

    // Low-cut ao vivo: atualiza a frequencia do high-pass compartilhado enquanto arrasta o slider (0 → 20 Hz, praticamente desligado).
    useEffect(() => {
        const ctx = audioCtxRef.current;
        const filtro = lowCutRef.current;
        if (ctx && filtro) filtro.frequency.setTargetAtTime(lowCutHz > 0 ? lowCutHz : 20, ctx.currentTime, 0.03);
    }, [lowCutHz]);

    const obterContexto = useCallback(() => {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
        return audioCtxRef.current;
    }, []);

    const iniciarTrecho = useCallback((modo: ModoReproducao, deMs: number, ateMs: number) => {
        const buffer = bufferRef.current;
        if (!buffer) return;
        const ctx = obterContexto();
        ctx.resume();
        pararSources();
        const t0 = ctx.currentTime + 0.03;
        agendarFonte(buffer, deMs, ateMs - deMs, t0, 0, 0);
        modoRef.current = modo;
        loopPendenteRef.current = false;
        segmentoRef.current = { baseMs: deMs, ctxStart: t0, ateMs };
        setTocando(true);
        cancelarRaf();
        rafRef.current = requestAnimationFrame(iterar);
    }, [obterContexto, pararSources, agendarFonte, cancelarRaf, iterar]);

    const alternarPlayPause = useCallback(() => {
        const montagemAtual = montagemRef.current;
        if (!montagemAtual) return;
        if (tocando) { pararSources(); cancelarRaf(); loopPendenteRef.current = false; modoRef.current = { tipo: 'parado' }; setTocando(false); return; }
        const de = Math.min(Math.max(posicaoMs, montagemAtual.inicioMs), montagemAtual.fimMs - 1);
        iniciarTrecho({ tipo: 'livre' }, de, montagemAtual.fimMs);
    }, [tocando, posicaoMs, pararSources, cancelarRaf, iniciarTrecho]);

    const parar = useCallback(() => {
        pararInterno();
        const inicio = montagemRef.current?.inicioMs ?? 0;
        segmentoRef.current = null;
        setPosicaoMs(inicio);
    }, [pararInterno]);

    const tocarDoInicio = useCallback(() => {
        const montagemAtual = montagemRef.current;
        if (!montagemAtual) return;
        iniciarTrecho({ tipo: 'livre' }, montagemAtual.inicioMs, montagemAtual.fimMs);
    }, [iniciarTrecho]);

    const tocarBloco = useCallback((id: string) => {
        const bloco = montagemRef.current?.blocos.find(item => item.id === id);
        if (!bloco) return;
        setBlocoSelecionadoId(id);
        iniciarTrecho({ tipo: 'trecho', ateMs: bloco.fimMs }, bloco.inicioMs, bloco.fimMs);
    }, [iniciarTrecho]);

    // Toca a virada do loop com crossfade real: a cauda (saindo no Fim) e a volta nova (entrando no Inicio) tocam juntas pela sobreposicao.
    const testarLoop = useCallback(() => {
        const buffer = bufferRef.current;
        const montagemAtual = montagemRef.current;
        if (!buffer || !montagemAtual) return;
        const ctx = obterContexto();
        ctx.resume();
        pararSources();

        const { inicioMs, retornoMs, fimMs, transicaoLoop } = montagemAtual;
        const fadeOut = transicaoLoop.duracaoFadeOutMs;
        const fadeIn = transicaoLoop.duracaoFadeInMs;
        const sobreposicao = transicaoLoop.sobreposicaoInicioLoopMs;
        const antecedencia = Math.max(ANTECEDENCIA_TESTE_LOOP_MS, fadeOut + sobreposicao + 1500);
        const inicioCauda = Math.max(inicioMs, fimMs - antecedencia);
        const t0 = ctx.currentTime + 0.06;

        agendarFonte(buffer, inicioCauda, fimMs - inicioCauda, t0, 0, fadeOut);
        const tFim = t0 + (fimMs - inicioCauda) / 1000;
        const tVolta = Math.max(t0, tFim - sobreposicao / 1000);
        agendarFonte(buffer, retornoMs, fadeIn + CAUDA_TESTE_LOOP_MS, tVolta, fadeIn, 0);

        modoRef.current = { tipo: 'loop' };
        loopPendenteRef.current = true;
        segmentoRef.current = { baseMs: inicioCauda, ctxStart: t0, ateMs: fimMs };
        trocaLoopRef.current = { baseMs: retornoMs + sobreposicao, ateMs: retornoMs + fadeIn + CAUDA_TESTE_LOOP_MS };
        setTocando(true);
        cancelarRaf();
        rafRef.current = requestAnimationFrame(iterar);
    }, [obterContexto, pararSources, agendarFonte, cancelarRaf, iterar]);

    // Agenda os ciclos do preview da emenda (look-ahead). Cada ciclo toca SO a virada: [Fim-PRE..Fim] (saida) em crossfade com [Retorno..Retorno+POS] (entrada). O miolo entre eles NAO toca — fica curto e repetitivo. Le a montagem a cada ciclo (afina ao vivo).
    const agendarCiclosEmenda = useCallback(() => {
        const ctx = audioCtxRef.current;
        const buffer = bufferRef.current;
        const montagem = montagemRef.current;
        if (!ctx || !buffer || !montagem) return;
        const { retornoMs, fimMs, transicaoLoop } = montagem;
        const corpoMs = Math.max(50, fimMs - retornoMs);
        const preMs = Math.min(PRE_EMENDA_MS, corpoMs);
        const posMs = Math.min(POS_EMENDA_MS, corpoMs);
        const sobre = Math.min(transicaoLoop.sobreposicaoInicioLoopMs, preMs);
        while (proximoStartRef.current < ctx.currentTime + LOOKAHEAD_EMENDA_S) {
            const tSaida = Math.max(ctx.currentTime + 0.03, proximoStartRef.current);
            agendarFonte(buffer, fimMs - preMs, preMs, tSaida, MICRO_FADE_EMENDA_MS, transicaoLoop.duracaoFadeOutMs);
            segmentosEmendaRef.current.push({ ctxStart: tSaida, baseMs: fimMs - preMs, durS: preMs / 1000 });
            const tEntrada = tSaida + preMs / 1000 - sobre / 1000;
            agendarFonte(buffer, retornoMs, posMs, tEntrada, transicaoLoop.duracaoFadeInMs, MICRO_FADE_EMENDA_MS);
            segmentosEmendaRef.current.push({ ctxStart: tEntrada, baseMs: retornoMs, durS: posMs / 1000 });
            proximoStartRef.current = tEntrada + posMs / 1000 - MICRO_WRAP_EMENDA_MS / 1000;
        }
    }, [agendarFonte]);

    // Repete SO a virada do loop em ciclo continuo (curto), movendo a head pelo segmento ativo, pra afinar os fades de ouvido ao vivo.
    const repetirEmenda = useCallback(() => {
        const buffer = bufferRef.current;
        const montagem = montagemRef.current;
        if (!buffer || !montagem) return;
        const ctx = obterContexto();
        ctx.resume();
        pararSources();
        cancelarRaf();
        segmentosEmendaRef.current = [];
        proximoStartRef.current = ctx.currentTime + 0.06;

        modoRef.current = { tipo: 'emenda' };
        setTocando(true);
        const passo = () => {
            if (modoRef.current.tipo !== 'emenda') return;
            agendarCiclosEmenda();
            const ctxAtual = audioCtxRef.current;
            if (ctxAtual) {
                const agora = ctxAtual.currentTime;
                segmentosEmendaRef.current = segmentosEmendaRef.current.filter(seg => seg.ctxStart + seg.durS >= agora - 0.05);
                let ativo: { ctxStart: number; baseMs: number; durS: number } | null = null;
                for (const seg of segmentosEmendaRef.current) {
                    if (seg.ctxStart <= agora && agora < seg.ctxStart + seg.durS && (!ativo || seg.ctxStart > ativo.ctxStart)) ativo = seg;
                }
                if (ativo) setPosicaoMs(ativo.baseMs + (agora - ativo.ctxStart) * 1000);
            }
            rafRef.current = requestAnimationFrame(passo);
        };
        passo();
    }, [obterContexto, pararSources, cancelarRaf, agendarCiclosEmenda]);

    // Move o cursor (scrub) para uma posicao; se estiver tocando, retoma dali ate o Fim.
    const irParaMs = useCallback((ms: number) => {
        const montagemAtual = montagemRef.current;
        if (!montagemAtual) return;
        const alvo = Math.min(Math.max(ms, 0), duracaoMs);
        setPosicaoMs(alvo);
        if (!tocando) return;
        if (alvo < montagemAtual.fimMs) iniciarTrecho({ tipo: 'livre' }, alvo, montagemAtual.fimMs);
        else pararInterno();
    }, [duracaoMs, tocando, iniciarTrecho, pararInterno]);

    useEffect(() => () => {
        cancelarRaf();
        pararSources();
        if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
    }, [cancelarRaf, pararSources]);

    const atualizarMontagem = useCallback((transformacao: (atual: MontagemMusica) => MontagemMusica) => { setMontagem(atual => (atual ? transformacao(atual) : atual)); }, []);

    const setInicioMs = useCallback((ms: number) => atualizarMontagem(atual => {
        const primeiro = atual.blocos[0];
        const limite = Math.max(0, Math.min(ms, primeiro.fimMs - DURACAO_MINIMA_BLOCO_MS));
        const retornoMs = Math.max(limite, atual.retornoMs);
        return { ...atual, inicioMs: limite, retornoMs, blocos: atual.blocos.map((bloco, indice) => (indice === 0 ? { ...bloco, inicioMs: limite } : bloco)) };
    }), [atualizarMontagem]);

    const setRetornoMs = useCallback((ms: number) => atualizarMontagem(atual => {
        const limite = Math.max(atual.inicioMs, Math.min(ms, atual.fimMs - DURACAO_MINIMA_BLOCO_MS));
        return { ...atual, retornoMs: limite };
    }), [atualizarMontagem]);

    const setFimMs = useCallback((ms: number) => atualizarMontagem(atual => {
        const ultimoIndice = atual.blocos.length - 1;
        const ultimo = atual.blocos[ultimoIndice];
        const limite = Math.min(duracaoMs, Math.max(ms, ultimo.inicioMs + DURACAO_MINIMA_BLOCO_MS));
        const retornoMs = Math.max(atual.inicioMs, Math.min(atual.retornoMs, limite - DURACAO_MINIMA_BLOCO_MS));
        return { ...atual, fimMs: limite, retornoMs, blocos: atual.blocos.map((bloco, indice) => (indice === ultimoIndice ? { ...bloco, fimMs: limite } : bloco)) };
    }), [atualizarMontagem, duracaoMs]);

    const renomearBloco = useCallback((id: string, novoNome: string) => atualizarMontagem(atual => ({ ...atual, blocos: atual.blocos.map(bloco => (bloco.id === id ? { ...bloco, nome: novoNome } : bloco)) })), [atualizarMontagem]);

    const dividirEm = useCallback((ms: number) => atualizarMontagem(atual => {
        const indice = atual.blocos.findIndex(bloco => ms > bloco.inicioMs + DURACAO_MINIMA_BLOCO_MS && ms < bloco.fimMs - DURACAO_MINIMA_BLOCO_MS);
        if (indice < 0) return atual;
        const alvo = atual.blocos[indice];
        const novoBloco: BlocoMontagemMusica = { id: crypto.randomUUID(), nome: `Bloco ${atual.blocos.length + 1}`, inicioMs: ms, fimMs: alvo.fimMs };
        const blocos = [...atual.blocos.slice(0, indice), { ...alvo, fimMs: ms }, novoBloco, ...atual.blocos.slice(indice + 1)];
        return { ...atual, blocos };
    }), [atualizarMontagem]);

    const moverFronteira = useCallback((indice: number, ms: number) => atualizarMontagem(atual => {
        if (indice < 0 || indice >= atual.blocos.length - 1) return atual;
        const anterior = atual.blocos[indice];
        const proximo = atual.blocos[indice + 1];
        const limite = Math.max(anterior.inicioMs + DURACAO_MINIMA_BLOCO_MS, Math.min(ms, proximo.fimMs - DURACAO_MINIMA_BLOCO_MS));
        return { ...atual, blocos: atual.blocos.map((bloco, i) => (i === indice ? { ...bloco, fimMs: limite } : i === indice + 1 ? { ...bloco, inicioMs: limite } : bloco)) };
    }), [atualizarMontagem]);

    const removerBloco = useCallback((id: string) => atualizarMontagem(atual => {
        if (atual.blocos.length <= 1) return atual;
        const indice = atual.blocos.findIndex(bloco => bloco.id === id);
        if (indice < 0) return atual;
        const alvo = atual.blocos[indice];
        const blocos = atual.blocos.slice();
        if (indice === 0) blocos[1] = { ...blocos[1], inicioMs: alvo.inicioMs };
        else blocos[indice - 1] = { ...blocos[indice - 1], fimMs: alvo.fimMs };
        blocos.splice(indice, 1);
        return { ...atual, blocos };
    }), [atualizarMontagem]);

    const setCampoTransicaoLoop = useCallback((campo: CampoTransicaoLoop, valor: number) => atualizarMontagem(atual => {
        const v = Math.max(0, Math.round(valor));
        const transicao = atual.transicaoLoop;
        const transicaoLoop = campo === 'duracaoFadeOutMs' ? { ...transicao, duracaoFadeOutMs: v } : campo === 'duracaoFadeInMs' ? { ...transicao, duracaoFadeInMs: v } : { ...transicao, sobreposicaoInicioLoopMs: v };
        return { ...atual, transicaoLoop };
    }), [atualizarMontagem]);

    const marcarInicio = useCallback(() => setInicioMs(posicaoRef.current), [setInicioMs]);
    const marcarRetorno = useCallback(() => setRetornoMs(posicaoRef.current), [setRetornoMs]);
    const marcarFim = useCallback(() => setFimMs(posicaoRef.current), [setFimMs]);
    const cortarNaPosicao = useCallback(() => dividirEm(posicaoRef.current), [dividirEm]);

    const selecionarBloco = useCallback((id: string | null) => setBlocoSelecionadoId(id), []);

    const blocoSelecionado = useMemo(() => montagem?.blocos.find(bloco => bloco.id === blocoSelecionadoId) ?? null, [montagem, blocoSelecionadoId]);

    const adicionarDimensaoClima = useCallback((idDimensao: number) => setClimaItens(atual => {
        if (atual.some(item => item.idDimensao === idDimensao)) return atual;
        const bipolar = consultaDimensoes.data.some(dimensao => dimensao.id === idDimensao && dimensao.bipolar);
        return [...atual, { idDimensao, nivel: bipolar ? 0 : 5 }];
    }), [consultaDimensoes.data]);
    const setNivelClima = useCallback((idDimensao: number, nivel: number) => setClimaItens(atual => atual.map(item => {
        if (item.idDimensao !== idDimensao) return item;
        const bipolar = consultaDimensoes.data.some(dimensao => dimensao.id === idDimensao && dimensao.bipolar);
        const min = bipolar ? -10 : 0;
        return { ...item, nivel: Math.max(min, Math.min(10, Math.round(nivel))) };
    })), [consultaDimensoes.data]);
    const removerDimensaoClima = useCallback((idDimensao: number) => setClimaItens(atual => atual.filter(item => item.idDimensao !== idDimensao)), []);

    const podeSalvar = montagem !== null && !carregandoAudio && !salvando;

    const salvar = useCallback(async () => {
        if (!montagem || salvando) return;
        setSalvando(true);
        setErroSalvar(null);
        try {
            const montagemSalvar: MontagemMusica = { inicioMs: montagem.inicioMs, retornoMs: montagem.retornoMs, fimMs: montagem.fimMs, blocos: montagem.blocos.map(bloco => ({ id: bloco.id, nome: bloco.nome.trim() || 'Bloco', inicioMs: bloco.inicioMs, fimMs: bloco.fimMs })), transicaoLoop: montagem.transicaoLoop, automacaoVolume: automacaoVolume.map(ponto => ({ tMs: Math.round(ponto.tMs), ganhoDb: ponto.ganhoDb })), lowCutHz };
            if (arquivo.idMusicaConfigurada !== null) await atualizaMusicaConfigurada({ idMusicaConfigurada: arquivo.idMusicaConfigurada, montagem: montagemSalvar, clima: { itens: climaItens } });
            else await criaMusicaConfigurada({ idArquivoTipadoMusica: arquivo.id, montagem: montagemSalvar, clima: { itens: climaItens } });
            recarregarListagem();
            deseleciona();
        } catch (erro) {
            setErroSalvar(erro instanceof Error ? erro.message : 'Falha ao salvar a configuração.');
            setSalvando(false);
        }
    }, [montagem, salvando, arquivo.id, arquivo.idMusicaConfigurada, climaItens, automacaoVolume, lowCutHz, recarregarListagem, deseleciona]);

    const valor: Contexto__PaginaConfigurarMusica__Edicao__Props = {
        configurada,
        analiseAudio,
        carregandoAudio, erroAudio, picos,
        montagemPronta: montagem !== null,
        inicioMs: montagem?.inicioMs ?? 0,
        retornoMs: montagem?.retornoMs ?? 0,
        fimMs: montagem?.fimMs ?? 0,
        duracaoMs,
        blocos: montagem?.blocos ?? [],
        transicaoLoop: montagem?.transicaoLoop ?? TRANSICAO_LOOP_PADRAO,
        blocoSelecionadoId, blocoSelecionado,
        setInicioMs, setRetornoMs, setFimMs, selecionarBloco, renomearBloco, dividirEm, moverFronteira, removerBloco, setCampoTransicaoLoop,
        marcarInicio, marcarRetorno, marcarFim, cortarNaPosicao,
        climaItens, dimensoesCatalogo: consultaDimensoes.data, adicionarDimensaoClima, setNivelClima, removerDimensaoClima,
        automacaoVolume, adicionarPontoAutomacao, moverPontoAutomacao, removerPontoAutomacao,
        lowCutHz, setLowCutHz,
        tocando, posicaoMs, alternarPlayPause, parar, tocarDoInicio, tocarBloco, testarLoop, repetirEmenda, irParaMs,
        salvar, salvando, erroSalvar, podeSalvar,
    };

    return (
        <Contexto__PaginaConfigurarMusica__Edicao.Provider value={valor}>
            <Contexto__PaginaConfigurarMusica__Edicao__Abas__Provider>
                <SPA__PaginaConfigurarMusica__Edicao />
            </Contexto__PaginaConfigurarMusica__Edicao__Abas__Provider>
        </Contexto__PaginaConfigurarMusica__Edicao.Provider>
    );
};

// Reduz o canal de audio a uma lista de picos normalizados (0..1) para desenhar a forma de onda.
function calcularPicos(buffer: AudioBuffer, quantidade: number): number[] {
    const dados = buffer.getChannelData(0);
    const tamanhoBalde = Math.max(1, Math.floor(dados.length / quantidade));
    const picos: number[] = [];
    for (let i = 0; i < quantidade; i++) {
        const inicio = i * tamanhoBalde;
        const fim = Math.min(dados.length, inicio + tamanhoBalde);
        let pico = 0;
        for (let j = inicio; j < fim; j++) { const amostra = Math.abs(dados[j]); if (amostra > pico) pico = amostra; }
        picos.push(pico);
    }
    const maximo = picos.reduce((maior, pico) => Math.max(maior, pico), 0) || 1;
    return picos.map(pico => pico / maximo);
};
