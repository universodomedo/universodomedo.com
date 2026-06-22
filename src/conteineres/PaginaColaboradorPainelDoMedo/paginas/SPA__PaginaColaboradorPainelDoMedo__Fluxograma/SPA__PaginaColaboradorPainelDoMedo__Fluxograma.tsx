'use client';

import { useState, useRef, useEffect, useMemo, type MouseEvent as ReactMouseEvent } from 'react';

import styles from './styles.module.css';

import { Eventos_Emite } from 'types-nora-api';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import { useRecebeEmitWs } from 'Hooks/useEventoWs';
import BarraView from 'Conteineres/PaginaColaboradorPainelDoMedo/componentes/BarraView';
import ModalCard from '../SPA__PaginaColaboradorPainelDoMedo__Quadro/ModalCard';

type Card = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];
type Dependencia = Contexto__PaginaColaboradorPainelDoMedo__Props['dependenciasCards']['registros'][number];
type CardLeve = Contexto__PaginaColaboradorPainelDoMedo__Props['todosCards']['registros'][number];

const DIM = { w: 214, h: 80 };

type ElementoTipo = 'retangulo' | 'elipse' | 'losango' | 'seta' | 'texto' | 'caneta';
type Ferramenta = 'selecionar' | ElementoTipo;
type Retangulo = { x: number; y: number; w: number; h: number };

type Elemento = {
    id: string;
    tipo: ElementoTipo;
    cor: string;
    x: number;
    y: number;
    w?: number;
    h?: number;
    x2?: number;
    y2?: number;
    pontos?: { x: number; y: number }[];
    texto?: string;
};

const CORES = ['#EBE0C9', '#B79051', '#d98a3c', '#5aa9a3', '#c95f5f', '#6f6896'];
const FERRAMENTAS: { id: Ferramenta; rotulo: string; dica: string }[] = [
    { id: 'selecionar', rotulo: '⤢', dica: 'Selecionar / mover (esquerdo). Pan = botão do meio' },
    { id: 'texto', rotulo: 'T', dica: 'Texto' },
    { id: 'retangulo', rotulo: '▭', dica: 'Retângulo' },
    { id: 'elipse', rotulo: '◯', dica: 'Elipse' },
    { id: 'losango', rotulo: '◇', dica: 'Losango' },
    { id: 'seta', rotulo: '↘', dica: 'Seta' },
    { id: 'caneta', rotulo: '✎', dica: 'Caneta livre' },
];

function gid(): string { return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'el-' + Math.random().toString(36).slice(2); };

function parseElementos(bruto: string | null): Elemento[] {
    if (!bruto) return [];
    try { const dados = JSON.parse(bruto); return Array.isArray(dados) ? dados.filter(e => e && typeof e === 'object' && typeof e.id === 'string' && typeof e.tipo === 'string') : []; } catch { return []; }
};

function bbox(el: Elemento): Retangulo {
    if (el.tipo === 'seta') { const x = Math.min(el.x, el.x2 ?? el.x), y = Math.min(el.y, el.y2 ?? el.y); return { x, y, w: Math.abs((el.x2 ?? el.x) - el.x), h: Math.abs((el.y2 ?? el.y) - el.y) }; }
    if (el.tipo === 'caneta') { const pts = el.pontos ?? [{ x: el.x, y: el.y }]; const xs = pts.map(p => p.x), ys = pts.map(p => p.y); const minX = Math.min(...xs), minY = Math.min(...ys); return { x: minX, y: minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY }; }
    if (el.tipo === 'texto') { const linhas = (el.texto ?? ' ').split('\n'); const w = Math.max(...linhas.map(l => l.length)) * 9 + 10; return { x: el.x - 4, y: el.y - 15, w, h: linhas.length * 20 + 4 }; }
    return { x: el.x, y: el.y, w: el.w ?? 0, h: el.h ?? 0 };
};

function intersecta(a: Retangulo, b: Retangulo): boolean { return a.x <= b.x + b.w && a.x + a.w >= b.x && a.y <= b.y + b.h && a.y + a.h >= b.y; };

function moveElemento(el: Elemento, dx: number, dy: number): Elemento {
    if (el.tipo === 'seta') return { ...el, x: el.x + dx, y: el.y + dy, x2: (el.x2 ?? el.x) + dx, y2: (el.y2 ?? el.y) + dy };
    if (el.tipo === 'caneta') return { ...el, x: el.x + dx, y: el.y + dy, pontos: (el.pontos ?? []).map(p => ({ x: p.x + dx, y: p.y + dy })) };
    return { ...el, x: el.x + dx, y: el.y + dy };
};

function pontosLosango(x: number, y: number, w: number, h: number): string { return `${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`; };

function cabecaSeta(x1: number, y1: number, x2: number, y2: number): string {
    const ang = Math.atan2(y2 - y1, x2 - x1), t = 11;
    const ax = x2 - t * Math.cos(ang - Math.PI / 7), ay = y2 - t * Math.sin(ang - Math.PI / 7);
    const bx = x2 - t * Math.cos(ang + Math.PI / 7), by = y2 - t * Math.sin(ang + Math.PI / 7);
    return `${ax},${ay} ${x2},${y2} ${bx},${by}`;
};

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
    const { pagina, setPagina, irParaListagem, objetivos, objetivoAtualId, setObjetivoAtualId, cards, statusCards, colunas, comentarios, cardAbertoId, abrirCard, fecharCard, salvando, atualizaCard, criaComentario, dependenciasCards, posicoesFluxograma, todosCards, criaDependenciaCard, atualizaDependenciaCard, deletaDependenciaCard, definePosicaoFluxogramaCard, desenhoFluxograma, salvaDesenhoFluxograma } = useContexto__PaginaColaboradorPainelDoMedo();

    const [vista, setVista] = useState({ x: 40, y: 30, z: 1 });
    const [posLocal, setPosLocal] = useState<Record<number, { x: number; y: number }>>({});
    const [depSelId, setDepSelId] = useState<number | null>(null);
    const [conectando, setConectando] = useState<null | { deCardId: number; cx: number; cy: number }>(null);
    const [picker, setPicker] = useState<null | { dependenteId: number }>(null);
    const [buscaPicker, setBuscaPicker] = useState('');

    const [ferramenta, setFerramenta] = useState<Ferramenta>('selecionar');
    const [corAtiva, setCorAtiva] = useState<string>(CORES[0]);
    const [elementos, setElementos] = useState<Elemento[]>([]);
    const [selIds, setSelIds] = useState<string[]>([]);
    const [rascunho, setRascunho] = useState<Elemento | null>(null);
    const [marquee, setMarquee] = useState<Retangulo | null>(null);
    const [editTextoId, setEditTextoId] = useState<string | null>(null);
    const [panning, setPanning] = useState(false);

    const vistaRef = useRef(vista); vistaRef.current = vista;
    const posLocalRef = useRef(posLocal); posLocalRef.current = posLocal;
    const definePosRef = useRef(definePosicaoFluxogramaCard); definePosRef.current = definePosicaoFluxogramaCard;
    const abrirCardRef = useRef(abrirCard); abrirCardRef.current = abrirCard;
    const criaDepRef = useRef(criaDependenciaCard); criaDepRef.current = criaDependenciaCard;
    const ferramentaRef = useRef(ferramenta); ferramentaRef.current = ferramenta;
    const elementosRef = useRef(elementos); elementosRef.current = elementos;
    const rascunhoRef = useRef(rascunho); rascunhoRef.current = rascunho;
    const marqueeRef = useRef(marquee); marqueeRef.current = marquee;
    const salvaDesenhoRef = useRef(salvaDesenhoFluxograma); salvaDesenhoRef.current = salvaDesenhoFluxograma;
    const salvaTimerRef = useRef<number | null>(null);
    const ultimoSerialRef = useRef<string>('');
    const ultimoPersistidoRef = useRef<string>('');
    const svgRef = useRef<SVGSVGElement | null>(null);
    const arrasteRef = useRef<null | { tipo: 'card' | 'pan' | 'conectar'; id: number; sx: number; sy: number; ox: number; oy: number; moveu: boolean }>(null);
    const desenhoArrasteRef = useRef<null | { modo: 'desenhar' | 'mover' | 'resize' | 'marcar'; tipo: ElementoTipo; sx: number; sy: number; origens: Elemento[]; moveu: boolean }>(null);

    const registros = cards.registros;
    const objetivoAtual = objetivos.registros.find(o => o.id === objetivoAtualId) ?? null;
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

    const agendaSalvar = () => {
        if (salvaTimerRef.current !== null) window.clearTimeout(salvaTimerRef.current);
        salvaTimerRef.current = window.setTimeout(() => {
            const vazio = elementosRef.current.length === 0;
            const serial = vazio ? '' : JSON.stringify(elementosRef.current);
            ultimoSerialRef.current = serial;
            salvaTimerRef.current = null;
            salvaDesenhoRef.current(vazio ? null : serial);
        }, 500);
    };
    const comita = (atualiza: (prev: Elemento[]) => Elemento[]) => { setElementos(prev => { const next = atualiza(prev); elementosRef.current = next; return next; }); agendaSalvar(); };
    const aplicaLive = (atualiza: (prev: Elemento[]) => Elemento[]) => setElementos(prev => { const next = atualiza(prev); elementosRef.current = next; return next; });

    const finalizaTexto = (id: string) => {
        setEditTextoId(null);
        const el = elementosRef.current.find(x => x.id === id);
        if (el && !(el.texto ?? '').trim()) comita(prev => prev.filter(x => x.id !== id));
        else agendaSalvar();
    };

    const comitaRef = useRef(comita); comitaRef.current = comita;
    const aplicaLiveRef = useRef(aplicaLive); aplicaLiveRef.current = aplicaLive;
    const agendaSalvarRef = useRef(agendaSalvar); agendaSalvarRef.current = agendaSalvar;

    const persistido = desenhoFluxograma.registros[0]?.conteudo ?? '';
    useEffect(() => {
        if (persistido === ultimoPersistidoRef.current) return;
        if (desenhoArrasteRef.current || editTextoId !== null) return;
        ultimoPersistidoRef.current = persistido;
        ultimoSerialRef.current = persistido;
        const novos = parseElementos(persistido || null);
        elementosRef.current = novos;
        setElementos(novos);
        setSelIds([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [persistido, objetivoAtualId, editTextoId]);

    useRecebeEmitWs(Eventos_Emite.PainelDoMedo.eventos.desenhoAtualizado, {
        onSuccess: ({ fkObjetivosId, conteudo }) => {
            if (fkObjetivosId !== objetivoAtualId) return;
            const serial = conteudo ?? '';
            if (serial === ultimoSerialRef.current) return;
            if (desenhoArrasteRef.current || editTextoId !== null) return;
            ultimoSerialRef.current = serial;
            const novos = parseElementos(conteudo);
            elementosRef.current = novos;
            setElementos(novos);
            setSelIds([]);
        },
    });

    useEffect(() => {
        setPosLocal(prev => {
            const next = { ...prev }; let mudou = false;
            for (const card of registros) { const ov = next[card.id]; const sp = posServidor(card.id); if (ov && sp && ov.x === sp.x && ov.y === sp.y) { delete next[card.id]; mudou = true; } }
            return mudou ? next : prev;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posicoesFluxograma.registros]);

    const cursorMundo = (clientX: number, clientY: number) => { const r = svgRef.current?.getBoundingClientRect(); const z = vistaRef.current.z; return { x: ((clientX - (r?.left ?? 0)) - vistaRef.current.x) / z, y: ((clientY - (r?.top ?? 0)) - vistaRef.current.y) / z }; };
    const mundoParaTela = (x: number, y: number) => ({ x: vista.x + x * vista.z, y: vista.y + y * vista.z });

    useEffect(() => {
        const aoMover = (e: MouseEvent) => {
            const da = desenhoArrasteRef.current;
            if (da) {
                const m = cursorMundo(e.clientX, e.clientY);
                da.moveu = true;
                if (da.modo === 'desenhar') {
                    if (da.tipo === 'caneta') setRascunho(r => r ? { ...r, pontos: [...(r.pontos ?? []), { x: m.x, y: m.y }] } : r);
                    else if (da.tipo === 'seta') setRascunho(r => r ? { ...r, x2: m.x, y2: m.y } : r);
                    else setRascunho(r => r ? { ...r, x: Math.min(da.sx, m.x), y: Math.min(da.sy, m.y), w: Math.abs(m.x - da.sx), h: Math.abs(m.y - da.sy) } : r);
                } else if (da.modo === 'mover') {
                    const dx = m.x - da.sx, dy = m.y - da.sy, mapa = new Map(da.origens.map(o => [o.id, o]));
                    aplicaLiveRef.current(prev => prev.map(el => mapa.has(el.id) ? moveElemento(mapa.get(el.id) as Elemento, dx, dy) : el));
                } else if (da.modo === 'resize') {
                    const origem = da.origens[0]; if (origem) { const w = Math.max(8, m.x - origem.x), h = Math.max(8, m.y - origem.y); aplicaLiveRef.current(prev => prev.map(el => el.id === origem.id ? { ...origem, w, h } : el)); }
                } else if (da.modo === 'marcar') {
                    setMarquee({ x: Math.min(da.sx, m.x), y: Math.min(da.sy, m.y), w: Math.abs(m.x - da.sx), h: Math.abs(m.y - da.sy) });
                }
                return;
            }
            const a = arrasteRef.current; if (!a) return;
            const dx = e.clientX - a.sx, dy = e.clientY - a.sy;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) a.moveu = true;
            if (a.tipo === 'pan') setVista(v => ({ ...v, x: a.ox + dx, y: a.oy + dy }));
            else if (a.tipo === 'card') setPosLocal(p => ({ ...p, [a.id]: { x: a.ox + dx / vistaRef.current.z, y: a.oy + dy / vistaRef.current.z } }));
            else if (a.tipo === 'conectar') { const m = cursorMundo(e.clientX, e.clientY); setConectando({ deCardId: a.id, cx: m.x, cy: m.y }); }
        };
        const aoSoltar = (e: MouseEvent) => {
            setPanning(false);
            const da = desenhoArrasteRef.current;
            if (da) {
                desenhoArrasteRef.current = null;
                if (da.modo === 'desenhar') {
                    const r = rascunhoRef.current;
                    setRascunho(null);
                    if (r) {
                        const valido = r.tipo === 'caneta' ? (r.pontos?.length ?? 0) > 1 : r.tipo === 'seta' ? Math.hypot((r.x2 ?? r.x) - r.x, (r.y2 ?? r.y) - r.y) > 4 : (r.w ?? 0) > 3 && (r.h ?? 0) > 3;
                        if (valido) { comitaRef.current(prev => [...prev, r]); setSelIds([r.id]); }
                    }
                } else if (da.modo === 'marcar') {
                    const mq = marqueeRef.current;
                    setMarquee(null);
                    if (da.moveu && mq && (mq.w > 2 || mq.h > 2)) setSelIds(elementosRef.current.filter(el => intersecta(mq, bbox(el))).map(el => el.id));
                    else setSelIds([]);
                    setDepSelId(null);
                } else if (da.moveu) agendaSalvarRef.current();
                return;
            }
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

    useEffect(() => {
        const aoTecla = (e: KeyboardEvent) => {
            if (editTextoId !== null) return;
            const alvo = e.target as HTMLElement | null;
            if (alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA')) return;
            if ((e.key === 'Delete' || e.key === 'Backspace') && selIds.length) { e.preventDefault(); const ids = new Set(selIds); setSelIds([]); comita(prev => prev.filter(el => !ids.has(el.id))); }
            else if (e.key === 'Escape') { setSelIds([]); setFerramenta('selecionar'); }
        };
        window.addEventListener('keydown', aoTecla);
        return () => window.removeEventListener('keydown', aoTecla);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selIds, editTextoId]);

    const iniciaPan = (e: ReactMouseEvent) => { e.preventDefault(); setPanning(true); arrasteRef.current = { tipo: 'pan', id: 0, sx: e.clientX, sy: e.clientY, ox: vista.x, oy: vista.y, moveu: false }; };

    const aoMouseDownCard = (e: ReactMouseEvent, card: Card) => {
        if (e.button === 1) { e.preventDefault(); return; }
        if (e.button !== 0 || ferramenta !== 'selecionar') return;
        e.stopPropagation();
        const pos = posCard(card);
        arrasteRef.current = { tipo: 'card', id: card.id, sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moveu: false };
    };
    const aoMouseDownHandle = (e: ReactMouseEvent, card: Card) => {
        if (e.button !== 0 || ferramenta !== 'selecionar') return;
        e.stopPropagation();
        const m = cursorMundo(e.clientX, e.clientY);
        arrasteRef.current = { tipo: 'conectar', id: card.id, sx: e.clientX, sy: e.clientY, ox: 0, oy: 0, moveu: false };
        setConectando({ deCardId: card.id, cx: m.x, cy: m.y });
    };
    const aoMouseDownElemento = (e: ReactMouseEvent, el: Elemento) => {
        if (e.button !== 0 || ferramenta !== 'selecionar') return;
        e.stopPropagation();
        const jaSel = selIds.includes(el.id);
        const nova = e.shiftKey ? (jaSel ? selIds.filter(i => i !== el.id) : [...selIds, el.id]) : (jaSel ? selIds : [el.id]);
        setSelIds(nova); setDepSelId(null);
        if (e.shiftKey && jaSel) return;
        const m = cursorMundo(e.clientX, e.clientY);
        const origens = elementos.filter(x => nova.includes(x.id));
        desenhoArrasteRef.current = { modo: 'mover', tipo: el.tipo, sx: m.x, sy: m.y, origens, moveu: false };
    };
    const aoMouseDownResize = (e: ReactMouseEvent, el: Elemento) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        const m = cursorMundo(e.clientX, e.clientY);
        desenhoArrasteRef.current = { modo: 'resize', tipo: el.tipo, sx: m.x, sy: m.y, origens: [el], moveu: false };
    };
    const aoMouseDownFundo = (e: ReactMouseEvent) => {
        if (e.button === 1) { iniciaPan(e); return; }
        if (e.button !== 0) return;
        if (ferramenta === 'selecionar') { const m = cursorMundo(e.clientX, e.clientY); setMarquee({ x: m.x, y: m.y, w: 0, h: 0 }); desenhoArrasteRef.current = { modo: 'marcar', tipo: 'retangulo', sx: m.x, sy: m.y, origens: [], moveu: false }; return; }
        if (objetivoAtualId === null) return;
        const m = cursorMundo(e.clientX, e.clientY);
        if (ferramenta === 'texto') { const novo: Elemento = { id: gid(), tipo: 'texto', cor: corAtiva, x: m.x, y: m.y, texto: '' }; comita(prev => [...prev, novo]); setSelIds([novo.id]); setEditTextoId(novo.id); setFerramenta('selecionar'); return; }
        let base: Elemento;
        if (ferramenta === 'seta') base = { id: gid(), tipo: 'seta', cor: corAtiva, x: m.x, y: m.y, x2: m.x, y2: m.y };
        else if (ferramenta === 'caneta') base = { id: gid(), tipo: 'caneta', cor: corAtiva, x: m.x, y: m.y, pontos: [{ x: m.x, y: m.y }] };
        else base = { id: gid(), tipo: ferramenta, cor: corAtiva, x: m.x, y: m.y, w: 0, h: 0 };
        setRascunho(base);
        desenhoArrasteRef.current = { modo: 'desenhar', tipo: base.tipo, sx: m.x, sy: m.y, origens: [base], moveu: false };
    };

    const alteraZoom = (delta: number) => setVista(v => ({ ...v, z: Math.max(0.4, Math.min(2, Number((v.z + delta).toFixed(2)))) }));

    const escolhePickerRequisito = (requisitoId: number) => { if (picker) criaDependenciaCard(picker.dependenteId, requisitoId, null, true); setPicker(null); };

    const aplicaCor = (c: string) => { setCorAtiva(c); if (selIds.length) { const ids = new Set(selIds); comita(prev => prev.map(el => ids.has(el.id) ? { ...el, cor: c } : el)); } };
    const excluiSelecionado = () => { if (!selIds.length) return; const ids = new Set(selIds); setSelIds([]); comita(prev => prev.filter(el => !ids.has(el.id))); };

    const candidatosPicker = useMemo(() => {
        if (!picker) return [];
        const jaRequisitos = new Set(dependenciasCards.registros.filter(d => d.fkCardsDependenteId === picker.dependenteId).map(d => d.fkCardsRequisitoId));
        const busca = buscaPicker.trim().toLowerCase();
        return todosCards.registros.filter(c => c.id !== picker.dependenteId && !jaRequisitos.has(c.id) && (!busca || c.titulo.toLowerCase().includes(busca)));
    }, [picker, dependenciasCards.registros, todosCards.registros, buscaPicker]);

    const corpoVisual = (el: Elemento) => {
        if (el.tipo === 'retangulo') return <rect x={el.x} y={el.y} width={el.w ?? 0} height={el.h ?? 0} rx={6} fill="none" stroke={el.cor} strokeWidth={2} />;
        if (el.tipo === 'elipse') return <ellipse cx={el.x + (el.w ?? 0) / 2} cy={el.y + (el.h ?? 0) / 2} rx={(el.w ?? 0) / 2} ry={(el.h ?? 0) / 2} fill="none" stroke={el.cor} strokeWidth={2} />;
        if (el.tipo === 'losango') return <polygon points={pontosLosango(el.x, el.y, el.w ?? 0, el.h ?? 0)} fill="none" stroke={el.cor} strokeWidth={2} />;
        if (el.tipo === 'seta') return <g><line x1={el.x} y1={el.y} x2={el.x2 ?? el.x} y2={el.y2 ?? el.y} stroke={el.cor} strokeWidth={2} /><polyline points={cabecaSeta(el.x, el.y, el.x2 ?? el.x, el.y2 ?? el.y)} fill="none" stroke={el.cor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></g>;
        if (el.tipo === 'caneta') return <polyline points={(el.pontos ?? []).map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={el.cor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />;
        return <>{(el.texto ?? '').split('\n').map((ln, i) => <text key={i} className={styles.tJunge} x={el.x} y={el.y + i * 20} fontSize={16} fill={el.cor}>{ln}</text>)}</>;
    };
    const hitElemento = (el: Elemento) => {
        if (el.tipo === 'retangulo') return <rect x={el.x} y={el.y} width={el.w ?? 0} height={el.h ?? 0} fill="none" stroke="transparent" strokeWidth={14} />;
        if (el.tipo === 'elipse') return <ellipse cx={el.x + (el.w ?? 0) / 2} cy={el.y + (el.h ?? 0) / 2} rx={(el.w ?? 0) / 2} ry={(el.h ?? 0) / 2} fill="none" stroke="transparent" strokeWidth={14} />;
        if (el.tipo === 'losango') return <polygon points={pontosLosango(el.x, el.y, el.w ?? 0, el.h ?? 0)} fill="none" stroke="transparent" strokeWidth={14} />;
        if (el.tipo === 'seta') return <line x1={el.x} y1={el.y} x2={el.x2 ?? el.x} y2={el.y2 ?? el.y} stroke="transparent" strokeWidth={16} />;
        if (el.tipo === 'caneta') return <polyline points={(el.pontos ?? []).map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="transparent" strokeWidth={14} />;
        const bb = bbox(el); return <rect x={bb.x} y={bb.y} width={bb.w} height={bb.h} fill="transparent" />;
    };

    const editandoEl = editTextoId !== null ? elementos.find(x => x.id === editTextoId) ?? null : null;

    return (
        <section className={styles.fluxograma}>
            <header className={styles.barra}>
                <BarraView pagina={pagina} setPagina={setPagina} />
                <button className={styles.botao} onClick={irParaListagem}>← Objetivos</button>
                <span className={styles.nomeObjetivo}>{objetivoAtual?.nome ?? ''}</span>
                <span className={styles.divisor} />
                <button className={styles.botao} onClick={() => alteraZoom(-0.15)}>−</button>
                <span className={styles.zoomTxt}>{Math.round(vista.z * 100)}%</span>
                <button className={styles.botao} onClick={() => alteraZoom(0.15)}>+</button>
                <button className={styles.botao} onClick={() => setVista({ x: 40, y: 30, z: 1 })} title="Resetar vista">⟲</button>
            </header>

            <div className={styles.ferramentas}>
                {FERRAMENTAS.map(f => <button key={f.id} className={`${styles.ferramenta} ${ferramenta === f.id ? styles.ferramentaAtiva : ''}`} title={f.dica} onClick={() => { setFerramenta(f.id); if (f.id !== 'selecionar') setSelIds([]); }}>{f.rotulo}</button>)}
                <span className={styles.separador} />
                {CORES.map(c => <button key={c} className={`${styles.swatch} ${corAtiva === c ? styles.swatchAtivo : ''}`} style={{ background: c }} title="Cor" onClick={() => aplicaCor(c)} />)}
                {selIds.length > 0 && <><span className={styles.separador} /><button className={styles.ferramenta} title="Excluir selecionado (Del)" onClick={excluiSelecionado}>🗑</button></>}
                <span className={styles.dicaMouse}>esquerdo: selecionar · botão do meio: mover canvas</span>
            </div>

            {cards.erro && <p className={styles.erro}>{cards.erro}</p>}

            <div className={styles.corpo}>
                <div className={`${styles.palco} ${ferramenta !== 'selecionar' ? styles.desenhando : ''} ${panning ? styles.movendoCanvas : ''}`} onMouseDown={aoMouseDownFundo} onContextMenu={e => e.preventDefault()}>
                    {objetivoAtualId === null && <p className={styles.aviso}>Selecione um objetivo.</p>}
                    {objetivoAtualId !== null && !cards.carregando && registros.length === 0 && <p className={styles.aviso}>Nenhum card neste objetivo. Crie cards no Quadro — aqui eles viram nós. Use as ferramentas acima pra anotar o fluxo.</p>}
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
                                const selecionaDep = (e: ReactMouseEvent) => { if (e.button !== 0) return; e.stopPropagation(); setDepSelId(d.id); setSelIds([]); };
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
                                    <g key={'g' + cardId} style={{ cursor: 'pointer' }} onMouseDown={e => { if (e.button !== 0) return; e.stopPropagation(); if (objId) setObjetivoAtualId(objId); }}>
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

                            {elementos.map(el => {
                                const sel = selIds.includes(el.id), editando = editTextoId === el.id && el.tipo === 'texto', bb = bbox(el);
                                const podeResize = sel && selIds.length === 1 && (el.tipo === 'retangulo' || el.tipo === 'elipse' || el.tipo === 'losango');
                                return (
                                    <g key={el.id} onMouseDown={e => aoMouseDownElemento(e, el)} onDoubleClick={e => { if (el.tipo === 'texto' && ferramenta === 'selecionar') { e.stopPropagation(); setSelIds([el.id]); setEditTextoId(el.id); } }} style={{ cursor: ferramenta === 'selecionar' ? 'move' : 'crosshair' }}>
                                        {!editando && corpoVisual(el)}
                                        {hitElemento(el)}
                                        {sel && <rect x={bb.x - 3} y={bb.y - 3} width={bb.w + 6} height={bb.h + 6} fill="none" stroke="#B79051" strokeWidth={1} strokeDasharray="4 3" pointerEvents="none" />}
                                        {podeResize && <circle cx={el.x + (el.w ?? 0)} cy={el.y + (el.h ?? 0)} r={5} fill="#16121f" stroke="#B79051" strokeWidth={1.5} style={{ cursor: 'nwse-resize' }} onMouseDown={e => aoMouseDownResize(e, el)} />}
                                    </g>
                                );
                            })}

                            {rascunho && <g opacity={0.85} pointerEvents="none">{corpoVisual(rascunho)}</g>}
                            {marquee && <rect x={marquee.x} y={marquee.y} width={marquee.w} height={marquee.h} fill="rgba(183,144,81,0.10)" stroke="#B79051" strokeWidth={1} strokeDasharray="4 3" pointerEvents="none" />}
                        </g>
                    </svg>

                    {editandoEl && (() => { const tela = mundoParaTela(editandoEl.x, editandoEl.y); return <textarea className={styles.editorTexto} style={{ left: tela.x, top: tela.y - 16, transform: `scale(${vista.z})`, color: editandoEl.cor, fontSize: 16, lineHeight: '20px' }} value={editandoEl.texto ?? ''} autoFocus onChange={e => aplicaLive(prev => prev.map(x => x.id === editandoEl.id ? { ...x, texto: e.target.value } : x))} onBlur={() => finalizaTexto(editandoEl.id)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); finalizaTexto(editandoEl.id); } if (e.key === 'Escape') finalizaTexto(editandoEl.id); }} />; })()}
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
                    {!picker && !depSel && <p className={styles.aviso} style={{ position: 'static' }}>Cada card é um nó. Clique pra abrir; arraste o corpo pra reposicionar. Arraste o <b>ponto dourado</b> de um card até outro pra criar dependência — ou solte no vazio pra buscar um card de <b>outro objetivo</b>. Botão <b>esquerdo</b> seleciona (clique ou arraste uma área); botão do <b>meio</b> move o canvas. Use as <b>ferramentas</b> acima (texto, formas, seta, caneta) pra desenhar o passo-a-passo.</p>}
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
