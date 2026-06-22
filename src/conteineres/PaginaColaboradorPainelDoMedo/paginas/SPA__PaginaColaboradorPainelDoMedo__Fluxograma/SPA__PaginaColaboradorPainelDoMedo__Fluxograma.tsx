'use client';

import { useState, useRef, useEffect, useMemo, type MouseEvent as ReactMouseEvent } from 'react';

import styles from './styles.module.css';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import BarraView from 'Conteineres/PaginaColaboradorPainelDoMedo/componentes/BarraView';
import ModalCard from '../SPA__PaginaColaboradorPainelDoMedo__Quadro/ModalCard';

type Card = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];
type Dependencia = Contexto__PaginaColaboradorPainelDoMedo__Props['dependenciasCards']['registros'][number];
type CardLeve = Contexto__PaginaColaboradorPainelDoMedo__Props['todosCards']['registros'][number];

const DIM = { w: 214, h: 80 };

function quebraTexto(texto: string, max: number): string[] {
    const palavras = (texto ?? '').split(' '); const linhas: string[] = []; let atual = '';
    palavras.forEach(p => { if ((atual + ' ' + p).trim().length > max) { if (atual) linhas.push(atual); atual = p; } else atual = (atual ? atual + ' ' : '') + p; });
    if (atual) linhas.push(atual);
    return linhas.slice(0, 3);
};

function pontoBorda(cx: number, cy: number, w: number, h: number, alvoX: number, alvoY: number): { x: number; y: number } {
    const dx = alvoX - cx, dy = alvoY - cy;
    if (dx === 0 && dy === 0) return { x: cx, y: cy };
    const sx = (w / 2) / Math.abs(dx || 0.0001), sy = (h / 2) / Math.abs(dy || 0.0001);
    const s = Math.min(sx, sy);
    return { x: cx + dx * s, y: cy + dy * s };
};

export default function SPA__PaginaColaboradorPainelDoMedo__Fluxograma() {
    const { view, setView, objetivos, objetivoAtualId, setObjetivoAtualId, cards, statusCards, colunas, comentarios, cardAbertoId, abrirCard, fecharCard, salvando, atualizaCard, criaComentario, dependenciasCards, posicoesFluxograma, todosCards, criaDependenciaCard, atualizaDependenciaCard, deletaDependenciaCard, definePosicaoFluxogramaCard } = useContexto__PaginaColaboradorPainelDoMedo();

    const [vista, setVista] = useState({ x: 40, y: 30, z: 1 });
    const [posLocal, setPosLocal] = useState<Record<number, { x: number; y: number }>>({});
    const [depSelId, setDepSelId] = useState<number | null>(null);
    const [conectando, setConectando] = useState<null | { deCardId: number; cx: number; cy: number }>(null);
    const [picker, setPicker] = useState<null | { dependenteId: number }>(null);
    const [buscaPicker, setBuscaPicker] = useState('');

    const vistaRef = useRef(vista); vistaRef.current = vista;
    const posLocalRef = useRef(posLocal); posLocalRef.current = posLocal;
    const definePosRef = useRef(definePosicaoFluxogramaCard); definePosRef.current = definePosicaoFluxogramaCard;
    const abrirCardRef = useRef(abrirCard); abrirCardRef.current = abrirCard;
    const criaDepRef = useRef(criaDependenciaCard); criaDepRef.current = criaDependenciaCard;
    const svgRef = useRef<SVGSVGElement | null>(null);
    const arrasteRef = useRef<null | { tipo: 'card' | 'pan' | 'conectar'; id: number; sx: number; sy: number; ox: number; oy: number; moveu: boolean }>(null);

    const registros = cards.registros;
    const idsVisiveis = useMemo(() => new Set(registros.map(c => c.id)), [registros]);
    const cardLevePorId = useMemo(() => { const m = new Map<number, CardLeve>(); todosCards.registros.forEach(c => m.set(c.id, c)); return m; }, [todosCards.registros]);
    const objetivoNome = (id: number) => objetivos.registros.find(o => o.id === id)?.nome ?? 'Outro objetivo';

    const depSel = depSelId !== null ? dependenciasCards.registros.find(d => d.id === depSelId) ?? null : null;
    const cardAberto = cardAbertoId !== null ? registros.find(c => c.id === cardAbertoId) ?? null : null;

    const statusDe = (card: Card) => statusCards.registros.find(s => s.id === card.fkTiposStatusCardId) ?? null;
    const corDe = (card: Card) => statusDe(card)?.cor ?? '#9aa0a6';
    const nomeColuna = (card: Card) => colunas.registros.find(c => c.id === card.fkColunasId)?.nome ?? '';

    const indiceColuna = useMemo(() => { const m = new Map<number, number>(); [...colunas.registros].sort((a, b) => a.ordem - b.ordem).forEach((c, i) => m.set(c.id, i)); return m; }, [colunas.registros]);
    const posPadrao = (card: Card) => ({ x: (indiceColuna.get(card.fkColunasId) ?? 0) * 260 + 30, y: ((card.ordem ?? 1) - 1) * 110 + 30 });
    const posServidor = (cardId: number) => { const p = posicoesFluxograma.registros.find(x => x.fkCardsId === cardId); return p ? { x: p.posicaoX, y: p.posicaoY } : null; };
    const posCard = (card: Card) => posLocal[card.id] ?? posServidor(card.id) ?? posPadrao(card);

    const depsTocandoVisivel = dependenciasCards.registros.filter(d => idsVisiveis.has(d.fkCardsDependenteId) || idsVisiveis.has(d.fkCardsRequisitoId));
    const fantasmas = useMemo(() => {
        const m = new Map<number, { x: number; y: number }>(); let stagger = 0;
        for (const d of depsTocandoVisivel) {
            const dV = idsVisiveis.has(d.fkCardsDependenteId), rV = idsVisiveis.has(d.fkCardsRequisitoId);
            if (dV && !rV && !m.has(d.fkCardsRequisitoId)) { const base = registros.find(c => c.id === d.fkCardsDependenteId); if (base) { const p = posCard(base); m.set(d.fkCardsRequisitoId, { x: p.x - 300, y: p.y + stagger }); stagger += 96; } }
            else if (rV && !dV && !m.has(d.fkCardsDependenteId)) { const base = registros.find(c => c.id === d.fkCardsRequisitoId); if (base) { const p = posCard(base); m.set(d.fkCardsDependenteId, { x: p.x + 300, y: p.y + stagger }); stagger += 96; } }
        }
        return m;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dependenciasCards.registros, registros, posLocal, posicoesFluxograma.registros, colunas.registros]);

    const posPorId = (cardId: number) => { const c = registros.find(x => x.id === cardId); if (c) return posCard(c); return fantasmas.get(cardId) ?? null; };
    const tituloPorId = (cardId: number) => { const c = registros.find(x => x.id === cardId); if (c) return c.titulo; return cardLevePorId.get(cardId)?.titulo ?? '?'; };

    useEffect(() => {
        setPosLocal(prev => {
            const next = { ...prev }; let mudou = false;
            for (const card of registros) { const ov = next[card.id]; const sp = posServidor(card.id); if (ov && sp && ov.x === sp.x && ov.y === sp.y) { delete next[card.id]; mudou = true; } }
            return mudou ? next : prev;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posicoesFluxograma.registros]);

    const cursorMundo = (clientX: number, clientY: number) => { const r = svgRef.current?.getBoundingClientRect(); const z = vistaRef.current.z; return { x: ((clientX - (r?.left ?? 0)) - vistaRef.current.x) / z, y: ((clientY - (r?.top ?? 0)) - vistaRef.current.y) / z }; };

    useEffect(() => {
        const aoMover = (e: MouseEvent) => {
            const a = arrasteRef.current; if (!a) return;
            const dx = e.clientX - a.sx, dy = e.clientY - a.sy;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) a.moveu = true;
            if (a.tipo === 'pan') setVista(v => ({ ...v, x: a.ox + dx, y: a.oy + dy }));
            else if (a.tipo === 'card') setPosLocal(p => ({ ...p, [a.id]: { x: a.ox + dx / vistaRef.current.z, y: a.oy + dy / vistaRef.current.z } }));
            else if (a.tipo === 'conectar') { const m = cursorMundo(e.clientX, e.clientY); setConectando({ deCardId: a.id, cx: m.x, cy: m.y }); }
        };
        const aoSoltar = (e: MouseEvent) => {
            const a = arrasteRef.current; if (!a) return;
            if (a.tipo === 'card' && a.moveu) { const pos = posLocalRef.current[a.id]; if (pos) definePosRef.current(a.id, Math.round(pos.x), Math.round(pos.y)); }
            else if (a.tipo === 'card' && !a.moveu) abrirCardRef.current(a.id);
            else if (a.tipo === 'pan' && !a.moveu) setDepSelId(null);
            else if (a.tipo === 'conectar') {
                const alvo = document.elementFromPoint(e.clientX, e.clientY) as Element | null;
                const elCard = alvo?.closest('[data-card-id]');
                const alvoId = elCard ? Number(elCard.getAttribute('data-card-id')) : 0;
                if (alvoId && alvoId !== a.id) criaDepRef.current(a.id, alvoId, null, true);
                else { setPicker({ dependenteId: a.id }); setBuscaPicker(''); }
                setConectando(null);
            }
            arrasteRef.current = null;
        };
        window.addEventListener('mousemove', aoMover); window.addEventListener('mouseup', aoSoltar);
        return () => { window.removeEventListener('mousemove', aoMover); window.removeEventListener('mouseup', aoSoltar); };
    }, []);

    const aoMouseDownCard = (e: ReactMouseEvent, card: Card) => {
        e.stopPropagation();
        const pos = posCard(card);
        arrasteRef.current = { tipo: 'card', id: card.id, sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moveu: false };
    };
    const aoMouseDownHandle = (e: ReactMouseEvent, card: Card) => {
        e.stopPropagation();
        const m = cursorMundo(e.clientX, e.clientY);
        arrasteRef.current = { tipo: 'conectar', id: card.id, sx: e.clientX, sy: e.clientY, ox: 0, oy: 0, moveu: false };
        setConectando({ deCardId: card.id, cx: m.x, cy: m.y });
    };
    const aoMouseDownFundo = (e: ReactMouseEvent) => { arrasteRef.current = { tipo: 'pan', id: 0, sx: e.clientX, sy: e.clientY, ox: vista.x, oy: vista.y, moveu: false }; };

    const alteraZoom = (delta: number) => setVista(v => ({ ...v, z: Math.max(0.4, Math.min(2, Number((v.z + delta).toFixed(2)))) }));

    const escolhePickerRequisito = (requisitoId: number) => { if (picker) criaDependenciaCard(picker.dependenteId, requisitoId, null, true); setPicker(null); };

    const candidatosPicker = useMemo(() => {
        if (!picker) return [];
        const jaRequisitos = new Set(dependenciasCards.registros.filter(d => d.fkCardsDependenteId === picker.dependenteId).map(d => d.fkCardsRequisitoId));
        const busca = buscaPicker.trim().toLowerCase();
        return todosCards.registros.filter(c => c.id !== picker.dependenteId && !jaRequisitos.has(c.id) && (!busca || c.titulo.toLowerCase().includes(busca)));
    }, [picker, dependenciasCards.registros, todosCards.registros, buscaPicker]);

    return (
        <section className={styles.fluxograma}>
            <header className={styles.barra}>
                <BarraView view={view} setView={setView} />
                <span className={styles.rotulo}>Objetivo:</span>
                <select className={styles.seletor} value={objetivoAtualId ?? ''} onChange={evento => setObjetivoAtualId(evento.target.value ? Number(evento.target.value) : null)}>
                    {objetivos.registros.map(objetivo => <option key={objetivo.id} value={objetivo.id}>{objetivo.nome}</option>)}
                </select>
                <span className={styles.divisor} />
                <button className={styles.botao} onClick={() => alteraZoom(-0.15)}>−</button>
                <span className={styles.zoomTxt}>{Math.round(vista.z * 100)}%</span>
                <button className={styles.botao} onClick={() => alteraZoom(0.15)}>+</button>
                <button className={styles.botao} onClick={() => setVista({ x: 40, y: 30, z: 1 })} title="Resetar vista">⟲</button>
            </header>

            {cards.erro && <p className={styles.erro}>{cards.erro}</p>}

            <div className={styles.corpo}>
                <div className={styles.palco} onMouseDown={aoMouseDownFundo}>
                    {objetivoAtualId === null && <p className={styles.aviso}>Selecione um objetivo.</p>}
                    {objetivoAtualId !== null && !cards.carregando && registros.length === 0 && <p className={styles.aviso}>Nenhum card neste objetivo. Crie cards no Quadro — aqui eles viram nós.</p>}
                    {conectando && <p className={styles.aviso}>Solte sobre o card que é o <b>requisito</b> (a seta aponta de volta pro card que depende), ou solte no vazio pra buscar em outro objetivo.</p>}
                    <svg ref={svgRef} className={styles.svg} xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <marker id="setaFx" markerWidth="11" markerHeight="11" refX="8" refY="5" orient="auto">
                                <path d="M1,1 L9,5 L1,9" fill="none" stroke="#b8a67a" strokeWidth={1.6} />
                            </marker>
                        </defs>
                        <g transform={`translate(${vista.x},${vista.y}) scale(${vista.z})`}>
                            {depsTocandoVisivel.map(d => {
                                const pr = posPorId(d.fkCardsRequisitoId), pd = posPorId(d.fkCardsDependenteId);
                                if (!pr || !pd) return null;
                                const cr = { x: pr.x + DIM.w / 2, y: pr.y + DIM.h / 2 }, cd = { x: pd.x + DIM.w / 2, y: pd.y + DIM.h / 2 };
                                const p1 = pontoBorda(cr.x, cr.y, DIM.w, DIM.h, cd.x, cd.y), p2 = pontoBorda(cd.x, cd.y, DIM.w, DIM.h, cr.x, cr.y);
                                const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
                                const sel = depSelId === d.id, cor = sel ? '#EBE0C9' : d.bloqueante ? '#d98a3c' : '#6f6896';
                                const caminho = `M${p1.x},${p1.y} Q ${mx},${my} ${p2.x},${p2.y}`;
                                const rotulo = (d.descricao || '').trim();
                                const selecionaDep = (e: ReactMouseEvent) => { e.stopPropagation(); setDepSelId(d.id); };
                                return (
                                    <g key={d.id}>
                                        <path d={caminho} fill="none" stroke={cor} strokeWidth={sel ? 3 : 2} strokeDasharray={d.bloqueante ? undefined : '5 5'} markerEnd="url(#setaFx)" opacity={0.92} />
                                        <path d={caminho} fill="none" stroke="transparent" strokeWidth={16} style={{ cursor: 'pointer' }} onMouseDown={selecionaDep} />
                                        {rotulo && <text x={mx} y={my - 4} textAnchor="middle" fontSize={10} fill={cor} style={{ cursor: 'pointer' }} onMouseDown={selecionaDep}>{rotulo.length > 26 ? rotulo.slice(0, 25) + '…' : rotulo}</text>}
                                    </g>
                                );
                            })}

                            {[...fantasmas.entries()].map(([cardId, p]) => {
                                const leve = cardLevePorId.get(cardId);
                                const objId = leve?.fkObjetivosId;
                                const linhas = quebraTexto(tituloPorId(cardId), 24);
                                return (
                                    <g key={'g' + cardId} style={{ cursor: 'pointer' }} onMouseDown={e => { e.stopPropagation(); if (objId) setObjetivoAtualId(objId); }}>
                                        <rect x={p.x} y={p.y} width={DIM.w} height={DIM.h} rx={13} fill="#0d0b14" fillOpacity={0.6} stroke="#5a5468" strokeWidth={1.6} strokeDasharray="5 4" />
                                        {linhas.map((ln, i) => <text key={i} className={styles.tJunge} x={p.x + DIM.w / 2} y={p.y + DIM.h / 2 - (linhas.length - 1) * 8 + i * 16} textAnchor="middle" fontSize={12.5} fill="#aba6b8">{ln}</text>)}
                                        <text className={styles.tJunge} x={p.x + DIM.w / 2} y={p.y + DIM.h - 8} textAnchor="middle" fontSize={9.5} fill="#7a6f9c">↗ {objId ? objetivoNome(objId) : 'outro objetivo'}</text>
                                    </g>
                                );
                            })}

                            {conectando && (() => { const de = registros.find(c => c.id === conectando.deCardId); if (!de) return null; const p = posCard(de); return <line x1={p.x + DIM.w / 2} y1={p.y + DIM.h} x2={conectando.cx} y2={conectando.cy} stroke="#EBE0C9" strokeWidth={2} strokeDasharray="4 4" style={{ pointerEvents: 'none' }} />; })()}

                            {registros.map(card => {
                                const p = posCard(card), cor = corDe(card);
                                const linhas = quebraTexto(card.titulo, 24);
                                const startY = p.y + DIM.h / 2 - (linhas.length - 1) * 8 + 5;
                                return (
                                    <g key={card.id} className={styles.nodo} data-card-id={card.id} onMouseDown={e => aoMouseDownCard(e, card)}>
                                        <rect x={p.x} y={p.y} width={DIM.w} height={DIM.h} rx={13} fill={cor} fillOpacity={0.12} stroke={cor} strokeWidth={2.2} />
                                        <circle cx={p.x + 14} cy={p.y + 14} r={5} fill={cor} stroke="rgba(0,0,0,.4)" strokeWidth={1} />
                                        <text className={styles.tJunge} x={p.x + DIM.w - 11} y={p.y + 17} textAnchor="end" fontSize={9.5} fill="#8a8474">{nomeColuna(card).toUpperCase()}</text>
                                        {linhas.map((ln, i) => <text key={i} className={styles.tJunge} x={p.x + DIM.w / 2} y={startY + i * 16} textAnchor="middle" fontSize={13.5} fill="#EBE0C9">{ln}</text>)}
                                        <rect className={styles.alvo} data-card-id={card.id} x={p.x} y={p.y} width={DIM.w} height={DIM.h} rx={13} fill="transparent" />
                                        <circle className={styles.handle} cx={p.x + DIM.w / 2} cy={p.y + DIM.h} r={6} fill="#16121f" stroke="#B79051" strokeWidth={1.6} onMouseDown={e => aoMouseDownHandle(e, card)}>
                                            <title>Arraste para criar uma dependência</title>
                                        </circle>
                                    </g>
                                );
                            })}
                        </g>
                    </svg>
                </div>

                <aside className={styles.painel}>
                    {picker && (
                        <div className={styles.detalhe}>
                            <header className={styles.detalheCabecalho}>
                                <span className={styles.chipPrincipal} style={{ borderColor: '#B79051', color: '#B79051' }}>Adicionar dependência</span>
                                <button className={styles.fechar} onClick={() => setPicker(null)} title="Fechar">✕</button>
                            </header>
                            <p className={styles.ligacaoTexto}><b style={{ color: '#EBE0C9' }}>{tituloPorId(picker.dependenteId)}</b> depende de…</p>
                            <input className={styles.busca} value={buscaPicker} onChange={e => setBuscaPicker(e.target.value)} placeholder="Buscar card (qualquer objetivo)…" autoFocus />
                            <div className={styles.listaPicker}>
                                {candidatosPicker.length === 0 && <p className={styles.aviso} style={{ position: 'static' }}>Nenhum card.</p>}
                                {candidatosPicker.map(c => (
                                    <button key={c.id} className={styles.itemPicker} onClick={() => escolhePickerRequisito(c.id)} disabled={salvando}>
                                        <span>{c.titulo}</span>
                                        {c.fkObjetivosId !== objetivoAtualId && <span className={styles.itemObjetivo}>↗ {objetivoNome(c.fkObjetivosId)}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {!picker && depSel && <PainelDependencia key={depSel.id} dependencia={depSel} tituloPorId={tituloPorId} salvando={salvando} onSalvar={atualizaDependenciaCard} onExcluir={deletaDependenciaCard} onFechar={() => setDepSelId(null)} />}
                    {!picker && !depSel && <p className={styles.aviso} style={{ position: 'static' }}>Cada card é um nó. Clique pra abrir; arraste o corpo pra reposicionar. Arraste o <b>ponto dourado</b> de um card até outro card pra criar dependência — ou solte no vazio pra buscar um card de <b>outro objetivo</b>. Clique numa ligação pra editar/excluir.</p>}
                </aside>
            </div>

            {cardAberto && <ModalCard key={cardAberto.id} card={cardAberto} status={statusCards.registros} comentarios={comentarios} salvando={salvando} onSalvar={atualizaCard} onComentar={criaComentario} onFechar={fecharCard} />}
        </section>
    );
};

function PainelDependencia({ dependencia, tituloPorId, salvando, onSalvar, onExcluir, onFechar }: { dependencia: Dependencia; tituloPorId: (id: number) => string; salvando: boolean; onSalvar: (id: number, descricao: string | null, bloqueante: boolean) => Promise<void>; onExcluir: (id: number) => Promise<void>; onFechar: () => void; }) {
    const [descricao, setDescricao] = useState<string>(dependencia.descricao ?? '');
    const [bloqueante, setBloqueante] = useState<boolean>(dependencia.bloqueante);
    return (
        <div className={styles.detalhe}>
            <header className={styles.detalheCabecalho}>
                <span className={styles.chipPrincipal} style={{ borderColor: '#6f6896', color: '#b8b2c6' }}>Dependência</span>
                <button className={styles.fechar} onClick={onFechar} title="Fechar">✕</button>
            </header>
            <p className={styles.ligacaoTexto}><b style={{ color: '#EBE0C9' }}>{tituloPorId(dependencia.fkCardsDependenteId)}</b> depende de <b style={{ color: '#EBE0C9' }}>{tituloPorId(dependencia.fkCardsRequisitoId)}</b></p>
            <label className={styles.campo}><span>Por quê / nota (texto livre)</span><textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Antes de A, B precisa ter X cumprido porque…" /></label>
            <label className={styles.checkbox}><input type="checkbox" checked={bloqueante} onChange={e => setBloqueante(e.target.checked)} /> Bloqueante (trava o desenvolvimento do dependente)</label>
            <div className={styles.acoes}>
                <button className={styles.salvar} onClick={() => onSalvar(dependencia.id, descricao.trim() ? descricao.trim() : null, bloqueante)} disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
                <button className={styles.excluir} onClick={() => { onExcluir(dependencia.id); onFechar(); }} disabled={salvando}>Excluir</button>
            </div>
        </div>
    );
};
