'use client';

import styles from './styles.module.css';

import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';

import { useContexto__PaginaDocumentacaoProduto__Mapa } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Mapa/contexto';
import type { RegistroPaginaParaDocumentar } from 'Contextos/Contexto__PaginaDocumentacaoProduto/contexto';

const DIM = { w: 214, h: 64 };

function quebraTexto(texto: string, max: number): string[] {
    const palavras = (texto ?? '').split(' '); const linhas: string[] = []; let atual = '';
    palavras.forEach(p => { if ((atual + ' ' + p).trim().length > max) { if (atual) linhas.push(atual); atual = p; } else atual = (atual ? atual + ' ' : '') + p; });
    if (atual) linhas.push(atual);
    return linhas.slice(0, 2);
};

// Ponto na borda do retangulo do no (centro cx/cy) na direcao do alvo: ancora as arestas na borda, nao no centro.
function pontoBorda(cx: number, cy: number, w: number, h: number, alvoX: number, alvoY: number): { x: number; y: number } {
    const dx = alvoX - cx, dy = alvoY - cy;
    if (dx === 0 && dy === 0) return { x: cx, y: cy };
    const sx = (w / 2) / Math.abs(dx || 0.0001), sy = (h / 2) / Math.abs(dy || 0.0001);
    const s = Math.min(sx, sy);
    return { x: cx + dx * s, y: cy + dy * s };
};

export default function SPA__PaginaDocumentacaoProduto__Mapa() {
    const { listagemPaginas, listagemLigacoes, listagemPosicoes, estaDocumentada, selecionarPagina, criarLigacao, removerLigacao, definirPosicao } = useContexto__PaginaDocumentacaoProduto__Mapa();

    const [vista, setVista] = useState({ x: 40, y: 30, z: 0.7 });
    const [posLocal, setPosLocal] = useState<Record<number, { x: number; y: number }>>({});
    const [modoLigar, setModoLigar] = useState<boolean>(false);
    const [origemLigacao, setOrigemLigacao] = useState<number | null>(null);
    const [ligacaoSelecionada, setLigacaoSelecionada] = useState<number | null>(null);
    const [panning, setPanning] = useState(false);
    const [erroAcao, setErroAcao] = useState<string | null>(null);

    const registros = listagemPaginas.registros;

    const svgRef = useRef<SVGSVGElement | null>(null);
    const grupoRef = useRef<SVGGElement | null>(null);
    const arrasteRef = useRef<null | { tipo: 'no' | 'pan'; id: number; sx: number; sy: number; ox: number; oy: number; moveu: boolean }>(null);
    const posLocalRef = useRef(posLocal); posLocalRef.current = posLocal;
    const registrosRef = useRef(registros); registrosRef.current = registros;
    const definirPosicaoRef = useRef(definirPosicao); definirPosicaoRef.current = definirPosicao;
    const selecionarPaginaRef = useRef(selecionarPagina); selecionarPaginaRef.current = selecionarPagina;

    // Layout default: uma coluna por área (2 primeiros segmentos da chave), páginas empilhadas em ordem alfabética; as colunas quebram em faixas pra grade caber na vista.
    const posPadrao = useMemo(() => {
        const COLUNAS_POR_FAIXA = 7;
        const areaDe = (chave: string) => chave.split('.').slice(0, 2).join('.');
        const porArea = new Map<string, RegistroPaginaParaDocumentar[]>();
        [...registros].sort((a, b) => a.label.localeCompare(b.label)).forEach(pagina => {
            const area = areaDe(pagina.chave);
            porArea.set(area, [...(porArea.get(area) ?? []), pagina]);
        });
        const areas = [...porArea.keys()].sort();
        const mapa = new Map<number, { x: number; y: number }>();
        let yBaseFaixa = 60;
        for (let inicio = 0; inicio < areas.length; inicio += COLUNAS_POR_FAIXA) {
            const faixa = areas.slice(inicio, inicio + COLUNAS_POR_FAIXA);
            faixa.forEach((area, coluna) => (porArea.get(area) ?? []).forEach((pagina, n) => mapa.set(pagina.id, { x: coluna * 260 + 30, y: yBaseFaixa + n * 90 })));
            const maiorColuna = Math.max(...faixa.map(area => (porArea.get(area) ?? []).length));
            yBaseFaixa += maiorColuna * 90 + 60;
        }
        return mapa;
    }, [registros]);

    const posServidor = (idPagina: number) => { const p = listagemPosicoes.registros.find(x => x.fkPaginasNavegacaoId === idPagina); return p ? { x: p.posicaoX, y: p.posicaoY } : null; };
    const posNo = (pagina: RegistroPaginaParaDocumentar) => posLocal[pagina.id] ?? posServidor(pagina.id) ?? posPadrao.get(pagina.id) ?? { x: 30, y: 60 };

    // Converte coordenadas de tela para o sistema do canvas via getScreenCTM do grupo transformado (embute escala global, pan e zoom).
    const cursorMundo = (clientX: number, clientY: number) => { const ctm = grupoRef.current?.getScreenCTM(); if (!ctm) return { x: 0, y: 0 }; const inv = ctm.inverse(); return { x: inv.a * clientX + inv.c * clientY + inv.e, y: inv.b * clientX + inv.d * clientY + inv.f }; };
    const escalaTela = () => svgRef.current?.getScreenCTM()?.a ?? 1;

    useEffect(() => {
        const aoMover = (e: MouseEvent) => {
            const a = arrasteRef.current; if (!a) return;
            const botaoDoArraste = a.tipo === 'pan' ? 4 : 1;
            if ((e.buttons & botaoDoArraste) === 0) { aoSoltar(); return; }
            const dx = e.clientX - a.sx, dy = e.clientY - a.sy;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) a.moveu = true;
            if (a.tipo === 'pan') { const s = escalaTela(); setVista(v => ({ ...v, x: a.ox + dx / s, y: a.oy + dy / s })); }
            else { const m = cursorMundo(e.clientX, e.clientY); setPosLocal(p => ({ ...p, [a.id]: { x: m.x + a.ox, y: m.y + a.oy } })); }
        };
        const aoSoltar = () => {
            setPanning(false);
            const a = arrasteRef.current; if (!a) return;
            arrasteRef.current = null;
            if (a.tipo !== 'no') return;
            if (a.moveu) {
                const pos = posLocalRef.current[a.id];
                if (pos) { const px = Math.round(pos.x), py = Math.round(pos.y); setPosLocal(p => ({ ...p, [a.id]: { x: px, y: py } })); definirPosicaoRef.current(a.id, px, py); }
            } else {
                const registro = registrosRef.current.find(pagina => pagina.id === a.id);
                if (registro) selecionarPaginaRef.current(registro);
            }
        };
        window.addEventListener('mousemove', aoMover); window.addEventListener('mouseup', aoSoltar);
        return () => { window.removeEventListener('mousemove', aoMover); window.removeEventListener('mouseup', aoSoltar); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const aoMouseDownNo = (e: ReactMouseEvent, pagina: RegistroPaginaParaDocumentar) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        if (modoLigar) {
            // Modo ligar: primeiro clique elege a origem; segundo cria a ligação origem → destino.
            if (origemLigacao === null) { setOrigemLigacao(pagina.id); return; }
            if (origemLigacao === pagina.id) { setOrigemLigacao(null); return; }
            setErroAcao(null);
            criarLigacao(origemLigacao, pagina.id).catch(capturado => setErroAcao(capturado instanceof Error ? capturado.message : 'Não foi possível criar a ligação.'));
            setOrigemLigacao(null);
            return;
        }
        const pos = posNo(pagina), m = cursorMundo(e.clientX, e.clientY);
        arrasteRef.current = { tipo: 'no', id: pagina.id, sx: e.clientX, sy: e.clientY, ox: pos.x - m.x, oy: pos.y - m.y, moveu: false };
    };

    const aoMouseDownFundo = (e: ReactMouseEvent) => {
        if (e.button === 1) { e.preventDefault(); setPanning(true); arrasteRef.current = { tipo: 'pan', id: 0, sx: e.clientX, sy: e.clientY, ox: vista.x, oy: vista.y, moveu: false }; return; }
        if (e.button !== 0) return;
        setLigacaoSelecionada(null);
        setOrigemLigacao(null);
    };

    const alteraZoom = (delta: number) => setVista(v => ({ ...v, z: Math.max(0.3, Math.min(2, Number((v.z + delta).toFixed(2)))) }));

    const removerSelecionada = () => {
        if (ligacaoSelecionada === null) return;
        setErroAcao(null);
        removerLigacao(ligacaoSelecionada).catch(capturado => setErroAcao(capturado instanceof Error ? capturado.message : 'Não foi possível remover a ligação.'));
        setLigacaoSelecionada(null);
    };

    const porId = useMemo(() => new Map(registros.map(pagina => [pagina.id, pagina])), [registros]);

    return (
        <section className={styles.mapa}>
            <div className={styles.ferramentas}>
                <button type="button" className={`${styles.ferramenta} ${modoLigar ? styles.ferramentaAtiva : ''}`} onClick={() => { setModoLigar(m => !m); setOrigemLigacao(null); setLigacaoSelecionada(null); }}>{modoLigar ? 'Ligando… (clique origem → destino)' : 'Ligar páginas'}</button>
                {ligacaoSelecionada !== null && <button type="button" className={styles.ferramenta} onClick={removerSelecionada}>Remover ligação</button>}
                <span className={styles.dicaMouse}>esquerdo: arrastar/abrir verbete · botão do meio: mover canvas</span>
                <span className={styles.espacador} />
                <button type="button" className={styles.botao} onClick={() => alteraZoom(-0.15)}>−</button>
                <span className={styles.zoomTxt}>{Math.round(vista.z * 100)}%</span>
                <button type="button" className={styles.botao} onClick={() => alteraZoom(0.15)}>+</button>
                <button type="button" className={styles.botao} onClick={() => setVista({ x: 40, y: 30, z: 0.7 })} title="Resetar vista">⟲</button>
            </div>

            {(listagemPaginas.erro || listagemLigacoes.erro || erroAcao) && <p className={styles.erro}>{listagemPaginas.erro ?? listagemLigacoes.erro ?? erroAcao}</p>}

            <div className={`${styles.palco} ${panning ? styles.movendoCanvas : ''} ${modoLigar ? styles.ligando : ''}`} onMouseDown={aoMouseDownFundo} onContextMenu={e => e.preventDefault()}>
                <svg ref={svgRef} className={styles.svg} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <marker id="setaLigacaoMapa" markerWidth="11" markerHeight="11" refX="9" refY="5" orient="auto">
                            <path d="M1,1 L9,5 L1,9" fill="none" stroke="#B79051" strokeWidth={1.6} />
                        </marker>
                    </defs>
                    <g ref={grupoRef} transform={`translate(${vista.x},${vista.y}) scale(${vista.z})`}>
                        {listagemLigacoes.registros.map(ligacao => {
                            const origem = porId.get(ligacao.fkPaginasNavegacaoOrigemId), destino = porId.get(ligacao.fkPaginasNavegacaoDestinoId);
                            if (!origem || !destino) return null;
                            const po = posNo(origem), pd = posNo(destino);
                            const centroOrigem = { x: po.x + DIM.w / 2, y: po.y + DIM.h / 2 }, centroDestino = { x: pd.x + DIM.w / 2, y: pd.y + DIM.h / 2 };
                            const p1 = pontoBorda(centroOrigem.x, centroOrigem.y, DIM.w, DIM.h, centroDestino.x, centroDestino.y);
                            const p2 = pontoBorda(centroDestino.x, centroDestino.y, DIM.w, DIM.h, centroOrigem.x, centroOrigem.y);
                            const selecionada = ligacaoSelecionada === ligacao.id;
                            return (
                                <g key={`l${ligacao.id}`} onMouseDown={e => { if (e.button !== 0) return; e.stopPropagation(); setLigacaoSelecionada(ligacao.id); setOrigemLigacao(null); }} style={{ cursor: 'pointer' }}>
                                    <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={selecionada ? '#EBE0C9' : '#B79051'} strokeWidth={selecionada ? 3 : 2} markerEnd="url(#setaLigacaoMapa)" opacity={selecionada ? 1 : 0.75} />
                                    <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="transparent" strokeWidth={16} />
                                </g>
                            );
                        })}

                        {registros.map(pagina => {
                            const p = posNo(pagina);
                            const documentada = estaDocumentada(pagina.id);
                            const cor = documentada ? '#B79051' : '#5a5468';
                            const linhas = quebraTexto(pagina.label, 24);
                            const startY = p.y + DIM.h / 2 - (linhas.length - 1) * 8 + 5;
                            const origemAtiva = origemLigacao === pagina.id;
                            return (
                                <g key={pagina.id} className={styles.nodo} opacity={pagina.ativo ? 1 : 0.45} onMouseDown={e => aoMouseDownNo(e, pagina)}>
                                    <rect x={p.x} y={p.y} width={DIM.w} height={DIM.h} rx={13} fill={cor} fillOpacity={0.12} stroke={cor} strokeWidth={2.2} />
                                    <circle cx={p.x + 14} cy={p.y + 14} r={5} fill={cor} stroke="rgba(0,0,0,.4)" strokeWidth={1} />
                                    {linhas.map((ln, i) => <text key={i} className={styles.tJunge} x={p.x + DIM.w / 2} y={startY + i * 16} textAnchor="middle" fontSize={13.5} fill="#EBE0C9">{ln}</text>)}
                                    <rect x={p.x} y={p.y} width={DIM.w} height={DIM.h} rx={13} fill="transparent" />
                                    {origemAtiva && <rect x={p.x - 4} y={p.y - 4} width={DIM.w + 8} height={DIM.h + 8} rx={15} fill="none" stroke="#EBE0C9" strokeWidth={1.6} strokeDasharray="5 4" pointerEvents="none" />}
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>
        </section>
    );
};