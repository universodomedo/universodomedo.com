'use client';

import styles from './styles.module.css';

import { JSX, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BlocoMontagemMusica, TransicaoLoopMontagemMusica } from 'types-nora-api';

import { formatarMs, fracaoParaMs, intervaloRegua, msParaPercentual } from '../editorMusica.uteis';
import ToolbarEditor from '../ToolbarEditor/ToolbarEditor';

type AlvoArrasto = { tipo: 'inicio' } | { tipo: 'retorno' } | { tipo: 'fim' } | { tipo: 'fronteira'; indice: number } | { tipo: 'seek' };

const ZOOM_MIN = 1;
const ZOOM_MAX = 32;

type EditorTimelineMusicaProps = {
    picos: number[];
    duracaoMs: number;
    inicioMs: number;
    retornoMs: number;
    fimMs: number;
    blocos: readonly BlocoMontagemMusica[];
    transicaoLoop: TransicaoLoopMontagemMusica;
    posicaoMs: number;
    tocando: boolean;
    podeTocar: boolean;
    blocoSelecionadoId: string | null;
    onSelecionarBloco: (id: string) => void;
    onArrastarInicio: (ms: number) => void;
    onArrastarRetorno: (ms: number) => void;
    onArrastarFim: (ms: number) => void;
    onMoverFronteira: (indice: number, ms: number) => void;
    onDividirEm: (ms: number) => void;
    onIrPara: (ms: number) => void;
    onPlayPause: () => void;
    onParar: () => void;
    onInicio: () => void;
    onTestarLoop: () => void;
    onRepetirEmenda: () => void;
    onMarcarInicio: () => void;
    onMarcarRetorno: () => void;
    onMarcarFim: () => void;
    onCortar: () => void;
};

export default function EditorTimelineMusica(props: EditorTimelineMusicaProps): JSX.Element {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const trilhaRef = useRef<HTMLDivElement | null>(null);
    const arrastandoRef = useRef<AlvoArrasto | null>(null);
    const ancoraZoomRef = useRef<{ fracao: number; px: number } | null>(null);
    const centrarPendenteRef = useRef(false);
    const propsRef = useRef(props);
    const zoomRef = useRef(1);
    const [zoom, setZoom] = useState(1);
    propsRef.current = props;
    zoomRef.current = zoom;

    const msDoClientX = useCallback((clientX: number): number => {
        const rect = trilhaRef.current?.getBoundingClientRect();
        if (!rect || rect.width === 0) return 0;
        return fracaoParaMs((clientX - rect.left) / rect.width, propsRef.current.duracaoMs);
    }, []);

    useEffect(() => {
        function aoMover(evento: PointerEvent) {
            const alvo = arrastandoRef.current;
            if (!alvo) return;
            const atual = propsRef.current;
            const ms = msDoClientX(evento.clientX);
            if (alvo.tipo === 'inicio') atual.onArrastarInicio(ms);
            else if (alvo.tipo === 'retorno') atual.onArrastarRetorno(ms);
            else if (alvo.tipo === 'fim') atual.onArrastarFim(ms);
            else if (alvo.tipo === 'fronteira') atual.onMoverFronteira(alvo.indice, ms);
            else atual.onIrPara(ms);
        };
        function aoSoltar() { arrastandoRef.current = null; };
        window.addEventListener('pointermove', aoMover);
        window.addEventListener('pointerup', aoSoltar);
        return () => { window.removeEventListener('pointermove', aoMover); window.removeEventListener('pointerup', aoSoltar); };
    }, [msDoClientX]);

    const ancorarNoHead = useCallback(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const p = propsRef.current;
        const fracaoHead = p.duracaoMs > 0 ? Math.min(1, Math.max(0, p.posicaoMs / p.duracaoMs)) : 0;
        ancoraZoomRef.current = { fracao: fracaoHead, px: viewport.clientWidth / 2 };
    }, []);

    const aplicarZoom = useCallback((fator: number) => { ancorarNoHead(); setZoom(atual => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, atual * fator))); }, [ancorarNoHead]);

    const definirZoom = useCallback((valor: number) => { ancorarNoHead(); setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, valor))); }, [ancorarNoHead]);

    const ajustar = useCallback(() => { setZoom(1); if (viewportRef.current) viewportRef.current.scrollLeft = 0; }, []);

    const seekManual = useCallback((ms: number) => { centrarPendenteRef.current = true; propsRef.current.onIrPara(ms); }, []);

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        const ancora = ancoraZoomRef.current;
        if (!viewport || !ancora) return;
        viewport.scrollLeft = ancora.fracao * viewport.scrollWidth - ancora.px;
        ancoraZoomRef.current = null;
    }, [zoom]);

    // ao editar o timecode manualmente (degraus ou digitando), centraliza a view no head
    useLayoutEffect(() => {
        if (!centrarPendenteRef.current) return;
        centrarPendenteRef.current = false;
        const viewport = viewportRef.current;
        if (!viewport) return;
        const fracao = props.duracaoMs > 0 ? props.posicaoMs / props.duracaoMs : 0;
        viewport.scrollLeft = fracao * viewport.scrollWidth - viewport.clientWidth / 2;
    }, [props.posicaoMs, props.duracaoMs]);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        function aoRoda(evento: WheelEvent) {
            if (evento.ctrlKey || evento.metaKey) {
                evento.preventDefault();
                aplicarZoom(evento.deltaY < 0 ? 1.18 : 1 / 1.18);
                return;
            }
            if (zoomRef.current > 1) { evento.preventDefault(); viewport.scrollLeft += evento.deltaY; }
        };
        viewport.addEventListener('wheel', aoRoda, { passive: false });
        return () => viewport.removeEventListener('wheel', aoRoda);
    }, [aplicarZoom]);

    function iniciarArrasto(alvo: AlvoArrasto) {
        return (evento: ReactPointerEvent) => { evento.preventDefault(); evento.stopPropagation(); arrastandoRef.current = alvo; };
    };

    function aoApontarFaixa(evento: ReactPointerEvent) {
        if (evento.button !== 0) return;
        evento.preventDefault();
        arrastandoRef.current = { tipo: 'seek' };
        props.onIrPara(msDoClientX(evento.clientX));
    };

    function aoDuploClique(evento: ReactMouseEvent) { props.onDividirEm(msDoClientX(evento.clientX)); };

    const ondaMemo = useMemo(() => {
        if (props.picos.length === 0) return <div className={styles.semOnda}>Forma de onda indisponível</div>;
        const largura = 1000 / props.picos.length;
        return (
            <svg className={styles.onda} viewBox="0 0 1000 100" preserveAspectRatio="none">
                {props.picos.map((pico, indice) => { const altura = Math.max(1.2, pico * 92); return <rect key={indice} x={indice * largura} y={(100 - altura) / 2} width={largura} height={altura} />; })}
            </svg>
        );
    }, [props.picos]);

    const reguaMemo = useMemo(() => {
        if (props.duracaoMs <= 0) return null;
        const intervalo = intervaloRegua(props.duracaoMs / zoom);
        const marcas: number[] = [];
        for (let ms = 0; ms <= props.duracaoMs; ms += intervalo) marcas.push(ms);
        return marcas.map(ms => <div key={ms} className={styles.reguaMarca} style={{ left: `${msParaPercentual(ms, props.duracaoMs)}%` }}><span className={styles.reguaTexto}>{formatarMs(ms)}</span></div>);
    }, [props.duracaoMs, zoom]);

    const fadeOutMs = props.transicaoLoop.duracaoFadeOutMs;
    const fadeInMs = props.transicaoLoop.duracaoFadeInMs;
    const sobreposicaoMs = props.transicaoLoop.sobreposicaoInicioLoopMs;

    return (
        <div className={styles.editor}>
            <ToolbarEditor
                posicaoMs={props.posicaoMs} duracaoMs={props.duracaoMs} fimMs={props.fimMs} onSeekManual={seekManual}
                tocando={props.tocando} podeTocar={props.podeTocar} onPlayPause={props.onPlayPause} onParar={props.onParar} onInicio={props.onInicio} onTestarLoop={props.onTestarLoop} onRepetirEmenda={props.onRepetirEmenda}
                onMarcarInicio={props.onMarcarInicio} onMarcarRetorno={props.onMarcarRetorno} onMarcarFim={props.onMarcarFim} onCortar={props.onCortar}
                zoom={zoom} zoomMin={ZOOM_MIN} zoomMax={ZOOM_MAX} onZoomMenos={() => aplicarZoom(1 / 1.5)} onZoomMais={() => aplicarZoom(1.5)} onZoomSlider={definirZoom} onAjustar={ajustar}
            />

            <div className={styles.viewport} ref={viewportRef}>
                <div className={styles.conteudo} ref={trilhaRef} style={{ width: `${zoom * 100}%` }} onDoubleClick={aoDuploClique}>
                    <div className={styles.regua}>{reguaMemo}</div>

                    <div className={styles.pista}>
                        <div className={styles.faixa} onPointerDown={aoApontarFaixa}>
                            {ondaMemo}

                            <div className={styles.silencio} style={{ left: 0, width: `${msParaPercentual(props.inicioMs, props.duracaoMs)}%` }} />
                            <div className={styles.silencio} style={{ left: `${msParaPercentual(props.fimMs, props.duracaoMs)}%`, right: 0 }} />

                            {fadeOutMs > 0 && <div className={styles.fadeFim} style={{ left: `${msParaPercentual(props.fimMs - fadeOutMs, props.duracaoMs)}%`, width: `${msParaPercentual(fadeOutMs, props.duracaoMs)}%` }} />}
                            {fadeInMs > 0 && <div className={styles.fadeInicio} style={{ left: `${msParaPercentual(props.retornoMs, props.duracaoMs)}%`, width: `${msParaPercentual(fadeInMs, props.duracaoMs)}%` }} />}
                            {sobreposicaoMs > 0 && <div className={styles.sobreposicao} style={{ left: `${msParaPercentual(props.fimMs - sobreposicaoMs, props.duracaoMs)}%`, width: `${msParaPercentual(sobreposicaoMs, props.duracaoMs)}%` }} title="Sobreposição do loop" />}
                        </div>

                        <div className={styles.lane}>
                            {props.blocos.map(bloco => {
                                const esquerda = msParaPercentual(bloco.inicioMs, props.duracaoMs);
                                const largura = msParaPercentual(bloco.fimMs - bloco.inicioMs, props.duracaoMs);
                                const selecionado = bloco.id === props.blocoSelecionadoId;
                                return <button key={bloco.id} className={`${styles.bloco} ${selecionado ? styles.blocoSelecionado : ''}`} style={{ left: `${esquerda}%`, width: `${largura}%` }} onClick={() => props.onSelecionarBloco(bloco.id)} title={bloco.nome}><span className={styles.blocoNome}>{bloco.nome}</span></button>;
                            })}

                            {props.blocos.slice(0, -1).map((bloco, indice) => <div key={`fronteira-${bloco.id}`} className={styles.fronteira} style={{ left: `${msParaPercentual(bloco.fimMs, props.duracaoMs)}%` }} onPointerDown={iniciarArrasto({ tipo: 'fronteira', indice })} title="Arraste para mover o corte" />)}
                        </div>

                        <div className={`${styles.marcador} ${styles.marcadorInicio}`} style={{ left: `${msParaPercentual(props.inicioMs, props.duracaoMs)}%` }} onPointerDown={iniciarArrasto({ tipo: 'inicio' })}>
                            <span className={styles.marcadorTab}>Início</span>
                        </div>
                        <div className={`${styles.marcador} ${styles.marcadorRetorno}`} style={{ left: `${msParaPercentual(props.retornoMs, props.duracaoMs)}%` }} onPointerDown={iniciarArrasto({ tipo: 'retorno' })}>
                            <span className={styles.marcadorTab}>Retorno</span>
                        </div>
                        <div className={`${styles.marcador} ${styles.marcadorFim}`} style={{ left: `${msParaPercentual(props.fimMs, props.duracaoMs)}%` }} onPointerDown={iniciarArrasto({ tipo: 'fim' })}>
                            <span className={styles.marcadorTab}>Fim</span>
                        </div>
                    </div>

                    <div className={styles.playhead} style={{ left: `${msParaPercentual(props.posicaoMs, props.duracaoMs)}%` }}>
                        <span className={styles.playheadPuxador} onPointerDown={iniciarArrasto({ tipo: 'seek' })} title="Arraste para mover o cursor" />
                    </div>
                </div>
            </div>
        </div>
    );
};
