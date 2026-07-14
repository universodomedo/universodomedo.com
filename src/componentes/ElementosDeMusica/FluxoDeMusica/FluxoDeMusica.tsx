'use client';

import styles from './styles.module.css';

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import cn from 'classnames';
import type { FluxoMusicaDto, FluxoMusicaLigacaoDto } from 'types-nora-api';

// Controle de Música em tempo real — editor do FLUXO (componente CENTRAL e reutilizável): espaço com zoom/pan,
// músicas como diagramas colapsáveis (blocos cadastrados na montagem), ligações togglable (1 clique liga/desliga;
// conectar desconecta as irmãs da mesma saída) e o PULSO mostrando onde a música está.
// Agnóstico de transporte: recebe o FluxoMusicaDto + callbacks — o dono (palco, protótipo, futuro mixer) decide
// como as ações viram estado (WS autoritativo, motor local etc.). Aqui só vive a interação do canvas.

export interface FluxoDeMusicaProps {
    fluxo: FluxoMusicaDto;
    processando: boolean;
    aoTrazerMusica: () => void;
    aoRemoverMusica: (idMusica: number) => void;
    aoMoverMusica: (idMusica: number, x: number, y: number) => void;
    aoCriarLigacao: (deMusica: number, deBloco: string, paraMusica: number, paraBloco: string) => void;
    aoAlternarLigacao: (idLigacao: string) => void;
    aoMoverPulso: (idMusica: number, idBloco: string) => void;
    aoSilenciar: () => void;
};

type Ponto = { x: number; y: number };
type Vista = { x: number; y: number; escala: number };
type Ligando = { deMusica: number; deBloco: string } | null;

const seg = (ms: number) => `${Math.round(ms / 1000)}s`;

function rotuloFades(ligacao: FluxoMusicaLigacaoDto): string {
    return ligacao.fadeOutMs === 0 && ligacao.fadeInMs === 0 ? 'emenda' : `${ligacao.fadeOutMs}→${ligacao.fadeInMs} ms`;
};

export default function FluxoDeMusica({ fluxo, processando, aoTrazerMusica, aoRemoverMusica, aoMoverMusica, aoCriarLigacao, aoAlternarLigacao, aoMoverPulso, aoSilenciar }: FluxoDeMusicaProps) {
    const espacoRef = useRef<HTMLDivElement | null>(null);
    const blocosRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const nosRef = useRef<Map<number, HTMLElement>>(new Map());
    const pulsoDotRef = useRef<SVGCircleElement | null>(null);
    const pulsoHaloRef = useRef<SVGCircleElement | null>(null);
    const progressoRef = useRef<Map<string, HTMLSpanElement>>(new Map());

    const [vista, setVista] = useState<Vista>({ x: 40, y: 30, escala: 0.85 });
    const [ligando, setLigando] = useState<Ligando>(null);
    const [mouseMundo, setMouseMundo] = useState<Ponto>({ x: 0, y: 0 });
    const [colapsadas, setColapsadas] = useState<Set<number>>(new Set());
    // Posição local durante o arrasto do nó (o envio ao dono acontece só no soltar).
    const [posicaoLocal, setPosicaoLocal] = useState<Map<number, Ponto>>(new Map());
    const [versaoLayout, setVersaoLayout] = useState(0);
    const arrastoRef = useRef<{ tipo: 'pan'; clientX0: number; clientY0: number; vistaX0: number; vistaY0: number } | { tipo: 'no'; idMusica: number; dx: number; dy: number } | null>(null);

    // Escala efetiva da PLATAFORMA (ConteinerEscalavel aplica --scale global): pixel de tela ≠ pixel de layout.
    const escalaPlataforma = useCallback((): number => {
        const el = espacoRef.current;
        if (!el || el.offsetWidth === 0) return 1;
        return el.getBoundingClientRect().width / el.offsetWidth;
    }, []);

    const paraMundo = useCallback((clientX: number, clientY: number): Ponto => {
        const r = espacoRef.current?.getBoundingClientRect();
        if (!r) return { x: 0, y: 0 };
        const s = escalaPlataforma();
        return { x: ((clientX - r.left) / s - vista.x) / vista.escala, y: ((clientY - r.top) / s - vista.y) / vista.escala };
    }, [vista, escalaPlataforma]);

    const posicaoDe = useCallback((idMusica: number): Ponto => {
        const local = posicaoLocal.get(idMusica);
        if (local) return local;
        const musica = fluxo.musicas.find(m => m.idMusica === idMusica);
        return musica ? { x: musica.x, y: musica.y } : { x: 0, y: 0 };
    }, [fluxo.musicas, posicaoLocal]);

    // Âncora em coordenadas de MUNDO: posição do nó + offsets DOM internos (imune ao zoom).
    const ancora = useCallback((idMusica: number, idBloco: string, lado: 'entrada' | 'saida'): Ponto | null => {
        const no = nosRef.current.get(idMusica);
        if (!no) return null;
        const pos = posicaoDe(idMusica);
        if (colapsadas.has(idMusica)) return { x: pos.x + (lado === 'saida' ? no.offsetWidth : 0), y: pos.y + no.offsetHeight / 2 };
        const bloco = blocosRef.current.get(`${idMusica}:${idBloco}`);
        if (!bloco) return { x: pos.x + (lado === 'saida' ? no.offsetWidth : 0), y: pos.y + no.offsetHeight / 2 };
        let x = 0, y = 0;
        for (let atual: HTMLElement | null = bloco; atual && atual !== no; atual = atual.offsetParent as HTMLElement | null) { x += atual.offsetLeft; y += atual.offsetTop; };
        return { x: pos.x + x + (lado === 'saida' ? bloco.offsetWidth : 0), y: pos.y + y + bloco.offsetHeight / 2 };
    }, [posicaoDe, colapsadas]);

    const caminho = useCallback((a: Ponto, b: Ponto, recursiva: boolean): string => {
        if (recursiva) return `M ${a.x} ${a.y} C ${a.x + 70} ${a.y - 55}, ${b.x - 170} ${b.y - 55}, ${b.x} ${b.y}`;
        const dx = Math.max(45, Math.abs(b.x - a.x) * 0.45);
        return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
    }, []);

    // Layout das arestas depende de medidas DOM: recalcula após o primeiro paint e a cada mudança do grafo/colapso.
    useEffect(() => { setVersaoLayout(v => v + 1); }, [fluxo.musicas.length, colapsadas]);

    // ── Pan / zoom / arrasto de nó ──
    const aoPointerDown = useCallback((evento: ReactPointerEvent<HTMLDivElement>) => {
        const alvo = evento.target as HTMLElement;
        const cabecalho = alvo.closest(`.${styles.no_cabecalho}`);
        if (cabecalho && !alvo.closest('button')) {
            const idMusica = Number((cabecalho.parentElement as HTMLElement).dataset.musica);
            const m = paraMundo(evento.clientX, evento.clientY);
            const pos = posicaoDe(idMusica);
            arrastoRef.current = { tipo: 'no', idMusica, dx: m.x - pos.x, dy: m.y - pos.y };
            return;
        }
        if (alvo === espacoRef.current || alvo.dataset.fundo === '1') {
            if (ligando) { setLigando(null); return; }
            arrastoRef.current = { tipo: 'pan', clientX0: evento.clientX, clientY0: evento.clientY, vistaX0: vista.x, vistaY0: vista.y };
        }
    }, [paraMundo, posicaoDe, ligando, vista]);

    const aoPointerMove = useCallback((evento: ReactPointerEvent<HTMLDivElement>) => {
        if (ligando) setMouseMundo(paraMundo(evento.clientX, evento.clientY));
        const arrasto = arrastoRef.current;
        if (!arrasto) return;
        if (arrasto.tipo === 'pan') {
            // Delta de tela → delta de layout (o translate do mundo vive no espaço escalado pela plataforma).
            const s = escalaPlataforma();
            setVista(v => ({ ...v, x: arrasto.vistaX0 + (evento.clientX - arrasto.clientX0) / s, y: arrasto.vistaY0 + (evento.clientY - arrasto.clientY0) / s }));
        } else {
            const m = paraMundo(evento.clientX, evento.clientY);
            setPosicaoLocal(prev => new Map(prev).set(arrasto.idMusica, { x: m.x - arrasto.dx, y: m.y - arrasto.dy }));
        }
    }, [ligando, paraMundo, escalaPlataforma]);

    const aoPointerUp = useCallback(() => {
        const arrasto = arrastoRef.current;
        arrastoRef.current = null;
        if (arrasto?.tipo !== 'no') return;
        const pos = posicaoLocal.get(arrasto.idMusica);
        if (pos) {
            aoMoverMusica(arrasto.idMusica, Math.round(pos.x), Math.round(pos.y));
            // Mantém a posição local até o estado do dono ecoar (o próximo fluxo traz a posição nova e o override sai).
            setTimeout(() => { setPosicaoLocal(prev => { const novo = new Map(prev); novo.delete(arrasto.idMusica); return novo; }); }, 600);
        }
    }, [posicaoLocal, aoMoverMusica]);

    const aoWheel = useCallback((evento: React.WheelEvent<HTMLDivElement>) => {
        const r = espacoRef.current?.getBoundingClientRect();
        if (!r) return;
        const alvo = paraMundo(evento.clientX, evento.clientY);
        const s = escalaPlataforma();
        const fator = evento.deltaY < 0 ? 1.12 : 1 / 1.12;
        setVista(v => {
            const escala = Math.min(2, Math.max(0.3, v.escala * fator));
            return { escala, x: (evento.clientX - r.left) / s - alvo.x * escala, y: (evento.clientY - r.top) / s - alvo.y * escala };
        });
    }, [paraMundo, escalaPlataforma]);

    // ── Interações do grafo ──
    const aoClicarBloco = useCallback((idMusica: number, idBloco: string) => {
        if (ligando) {
            aoCriarLigacao(ligando.deMusica, ligando.deBloco, idMusica, idBloco); // recursiva vale: bloco nele mesmo
            setLigando(null);
            return;
        }
        aoMoverPulso(idMusica, idBloco);
    }, [ligando, aoCriarLigacao, aoMoverPulso]);

    const aoClicarNoColapsado = useCallback((idMusica: number) => {
        if (!ligando) return;
        const primeiro = fluxo.musicas.find(m => m.idMusica === idMusica)?.blocos[0];
        if (primeiro) aoCriarLigacao(ligando.deMusica, ligando.deBloco, idMusica, primeiro.id);
        setLigando(null);
    }, [ligando, fluxo.musicas, aoCriarLigacao]);

    const alternarColapso = useCallback((idMusica: number) => {
        setColapsadas(prev => { const novo = new Set(prev); if (novo.has(idMusica)) novo.delete(idMusica); else novo.add(idMusica); return novo; });
    }, []);

    // ── Pulso visual: percorre a linha do bloco (progresso) via rAF, fora do ciclo do React ──
    useEffect(() => {
        let vivo = true;
        function quadro(): void {
            if (!vivo) return;
            const pulso = fluxo.pulso;
            const dot = pulsoDotRef.current;
            const halo = pulsoHaloRef.current;
            for (const [chave, el] of progressoRef.current) {
                const [idMusica, idBloco] = chave.split(':');
                const ativo = pulso && String(pulso.idMusica) === idMusica && pulso.idBloco === idBloco;
                if (!ativo) { el.style.width = '0%'; continue; }
                const bloco = fluxo.musicas.find(m => m.idMusica === pulso.idMusica)?.blocos.find(b => b.id === pulso.idBloco);
                if (!bloco) { el.style.width = '0%'; continue; }
                el.style.width = `${Math.min(100, (Date.now() - pulso.iniciadoEmTs) / (bloco.fimMs - bloco.inicioMs) * 100)}%`;
            }
            if (dot && halo) {
                if (pulso) {
                    const a = ancora(pulso.idMusica, pulso.idBloco, 'entrada');
                    const b = ancora(pulso.idMusica, pulso.idBloco, 'saida');
                    const bloco = fluxo.musicas.find(m => m.idMusica === pulso.idMusica)?.blocos.find(bl => bl.id === pulso.idBloco);
                    if (a && b && bloco) {
                        const t = Math.min(1, (Date.now() - pulso.iniciadoEmTs) / (bloco.fimMs - bloco.inicioMs));
                        const x = a.x + (b.x - a.x) * t;
                        dot.setAttribute('cx', String(x)); dot.setAttribute('cy', String(a.y));
                        halo.setAttribute('cx', String(x)); halo.setAttribute('cy', String(a.y));
                    }
                } else {
                    dot.setAttribute('cx', '-9999'); halo.setAttribute('cx', '-9999');
                }
            }
            requestAnimationFrame(quadro);
        };
        requestAnimationFrame(quadro);
        return () => { vivo = false; };
    }, [fluxo, ancora]);

    // Arestas calculadas no render (dependem de versaoLayout para pegar as medidas pós-paint).
    const arestas = useMemo(() => {
        void versaoLayout;
        return fluxo.ligacoes.map(l => {
            const a = ancora(l.deMusica, l.deBloco, 'saida');
            const b = ancora(l.paraMusica, l.paraBloco, 'entrada');
            if (!a || !b) return null;
            const recursiva = l.deMusica === l.paraMusica && l.deBloco === l.paraBloco;
            return { ligacao: l, d: caminho(a, b, recursiva), meio: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - (recursiva ? 46 : 0) } };
        }).filter((aresta): aresta is NonNullable<typeof aresta> => aresta !== null);
    }, [fluxo.ligacoes, ancora, caminho, versaoLayout]);

    const provisoria = ligando ? (() => { const a = ancora(ligando.deMusica, ligando.deBloco, 'saida'); return a ? caminho(a, mouseMundo, false) : null; })() : null;
    const pulso = fluxo.pulso;
    const musicaDoPulso = pulso ? fluxo.musicas.find(m => m.idMusica === pulso.idMusica) : null;
    const blocoDoPulso = musicaDoPulso && pulso ? musicaDoPulso.blocos.find(b => b.id === pulso.idBloco) : null;

    return (
        <div className={styles.raiz}>
            <div className={styles.barra}>
                <button type="button" className={styles.acao} onClick={aoTrazerMusica}>⊕ Trazer música</button>
                <span className={styles.dica}>{ligando ? 'clique no bloco (ou música) de destino — fundo cancela' : 'arraste o fundo · scroll = zoom · ◈ liga/desliga · ⊕ do bloco cria ligação · clique num bloco leva o pulso'}</span>
                <span className={styles.transporte}>{pulso && musicaDoPulso && blocoDoPulso ? `● ${musicaDoPulso.nome} · ${blocoDoPulso.nome}` : '○ Silêncio'}</span>
                <button type="button" className={cn(styles.acao, styles.acao_perigo)} disabled={!pulso || processando} onClick={aoSilenciar}>Silenciar</button>
            </div>

            <div ref={espacoRef} className={cn(styles.espaco, ligando && styles.espaco_ligando)} data-fundo="1" onPointerDown={aoPointerDown} onPointerMove={aoPointerMove} onPointerUp={aoPointerUp} onWheel={aoWheel}>
                <div className={styles.mundo} data-fundo="1" style={{ transform: `translate(${vista.x}px, ${vista.y}px) scale(${vista.escala})` }}>
                    <svg className={styles.plano}>
                        {arestas.map(({ ligacao, d, meio }) => (
                            <g key={ligacao.id}>
                                <path className={styles.lig_hit} d={d} onClick={() => { aoAlternarLigacao(ligacao.id); }} />
                                <path className={cn(styles.lig_linha, ligacao.conectada ? styles.lig_conectada : styles.lig_desconectada)} d={d} />
                                <text className={cn(styles.lig_chip, ligacao.conectada && styles.lig_chip_conectada)} x={meio.x} y={meio.y - 7}>◈ {rotuloFades(ligacao)}</text>
                            </g>
                        ))}
                        {provisoria && <path className={styles.lig_provisoria} d={provisoria} />}
                        <circle ref={pulsoHaloRef} className={styles.pulso_halo} r="9" cx="-9999" cy="-9999" />
                        <circle ref={pulsoDotRef} className={styles.pulso_dot} r="5" cx="-9999" cy="-9999" />
                    </svg>

                    {fluxo.musicas.map(musica => {
                        const pos = posicaoDe(musica.idMusica);
                        const colapsada = colapsadas.has(musica.idMusica);
                        const tocandoAqui = pulso?.idMusica === musica.idMusica;
                        return (
                            <section key={musica.idMusica} ref={el => { if (el) nosRef.current.set(musica.idMusica, el); else nosRef.current.delete(musica.idMusica); }} className={cn(styles.no, tocandoAqui && styles.no_tocando, colapsada && styles.no_colapsado)} style={{ left: `${pos.x}px`, top: `${pos.y}px` }} data-musica={musica.idMusica} onClick={() => { if (colapsada) aoClicarNoColapsado(musica.idMusica); }}>
                                <div className={styles.no_cabecalho}>
                                    <span className={styles.no_nome}>{musica.nome}</span>
                                    <button type="button" className={styles.no_botao} title={colapsada ? 'Expandir' : 'Colapsar'} onClick={evento => { evento.stopPropagation(); alternarColapso(musica.idMusica); }}>{colapsada ? '+' : '−'}</button>
                                    <button type="button" className={cn(styles.no_botao, styles.no_botao_perigo)} title="Remover do fluxo" disabled={processando} onClick={evento => { evento.stopPropagation(); aoRemoverMusica(musica.idMusica); }}>✕</button>
                                </div>
                                {!colapsada && (
                                    <div className={styles.blocos}>
                                        {musica.blocos.map(bloco => (
                                            <div key={bloco.id} ref={el => { const chave = `${musica.idMusica}:${bloco.id}`; if (el) blocosRef.current.set(chave, el); else blocosRef.current.delete(chave); }} className={cn(styles.bloco, tocandoAqui && pulso?.idBloco === bloco.id && styles.bloco_ativo)} onClick={evento => { evento.stopPropagation(); aoClicarBloco(musica.idMusica, bloco.id); }}>
                                                <span ref={el => { const chave = `${musica.idMusica}:${bloco.id}`; if (el) progressoRef.current.set(chave, el); else progressoRef.current.delete(chave); }} className={styles.bloco_progresso} />
                                                <span className={styles.bloco_nome}>{bloco.nome}</span>
                                                <span className={styles.bloco_dur}>{seg(bloco.fimMs - bloco.inicioMs)}</span>
                                                <button type="button" className={styles.porto} title="Criar ligação a partir deste bloco" onClick={evento => { evento.stopPropagation(); setLigando({ deMusica: musica.idMusica, deBloco: bloco.id }); }}>⊕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
