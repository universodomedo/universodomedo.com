'use client';

import { useState, useRef, useEffect, useMemo, type MouseEvent as ReactMouseEvent } from 'react';

import styles from './styles.module.css';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import BarraView from 'Conteineres/PaginaColaboradorPainelDoMedo/componentes/BarraView';
import FichaObjetivo from 'Conteineres/PaginaColaboradorPainelDoMedo/componentes/FichaObjetivo';

type Card = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];

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
// Cor estavel por usuario pros cursores ao vivo (indexada pelo id do usuario).
const CORES_CURSOR = ['#B79051', '#5aa9a3', '#c95f5f', '#6f6896', '#d98a3c', '#8fc9a0'];
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

// Ponto na borda do retangulo do no (centro cx/cy, dimensoes w/h) na direcao do alvo: ancora as arestas de vinculo na borda, nao no centro.
function pontoBorda(cx: number, cy: number, w: number, h: number, alvoX: number, alvoY: number): { x: number; y: number } {
    const dx = alvoX - cx, dy = alvoY - cy;
    if (dx === 0 && dy === 0) return { x: cx, y: cy };
    const sx = (w / 2) / Math.abs(dx || 0.0001), sy = (h / 2) / Math.abs(dy || 0.0001);
    const s = Math.min(sx, sy);
    return { x: cx + dx * s, y: cy + dy * s };
};

export default function SPA__PaginaColaboradorPainelDoMedo__Fluxograma() {
    const { pagina, setPagina, objetivos, objetivoAtualId, cards, colunas, abrirCard, abrirCardPorId, salvando, posicoesFluxograma, definePosicaoFluxogramaCard, transmitePosicaoCardAoVivo, posicoesCardsAoVivo, presencaObjetivo, transmiteCursorFluxograma, cursoresFluxograma, transmiteDesenhoAoVivo, desenhoConteudo, registraDesenho, flushDesenho, objetivoFichaAbertaId, abrirFichaObjetivo, itensChecklistQuadro, membrosCards, todosCards } = useContexto__PaginaColaboradorPainelDoMedo();

    const [vista, setVista] = useState({ x: 40, y: 30, z: 1 });
    const [posLocal, setPosLocal] = useState<Record<number, { x: number; y: number }>>({});

    const [ferramenta, setFerramenta] = useState<Ferramenta>('selecionar');
    const [corAtiva, setCorAtiva] = useState<string>(CORES[0]);
    const [elementos, setElementos] = useState<Elemento[]>([]);
    const [selIds, setSelIds] = useState<string[]>([]);
    // Cartoes selecionados pelo marquee (junto com os desenhos): arrastar qualquer item selecionado move o grupo inteiro.
    const [selCardIds, setSelCardIds] = useState<number[]>([]);
    const [rascunho, setRascunho] = useState<Elemento | null>(null);
    const [marquee, setMarquee] = useState<Retangulo | null>(null);
    const [editTextoId, setEditTextoId] = useState<string | null>(null);
    const [panning, setPanning] = useState(false);
    // Painel lateral com a descricao do objetivo: colapsavel pra devolver a largura ao canvas.
    const [painelAberto, setPainelAberto] = useState(true);

    const vistaRef = useRef(vista); vistaRef.current = vista;
    const posLocalRef = useRef(posLocal); posLocalRef.current = posLocal;
    // Objetivo trancado = fluxograma somente-leitura: sem mover nos, sem desenhar. Abrir card/ficha continua funcionando.
    const travado = (objetivos.registros.find(objetivo => objetivo.id === objetivoAtualId)?.motivoTranca ?? null) !== null;
    const travadoRef = useRef(travado); travadoRef.current = travado;

    const definePosRef = useRef(definePosicaoFluxogramaCard); definePosRef.current = definePosicaoFluxogramaCard;
    const transmiteAoVivoRef = useRef(transmitePosicaoCardAoVivo); transmiteAoVivoRef.current = transmitePosicaoCardAoVivo;
    const ultimoAoVivoRef = useRef(0);
    const transmiteCursorRef = useRef(transmiteCursorFluxograma); transmiteCursorRef.current = transmiteCursorFluxograma;
    const ultimoCursorRef = useRef(0);
    const abrirCardRef = useRef(abrirCard); abrirCardRef.current = abrirCard;
    const ferramentaRef = useRef(ferramenta); ferramentaRef.current = ferramenta;
    const elementosRef = useRef(elementos); elementosRef.current = elementos;
    const rascunhoRef = useRef(rascunho); rascunhoRef.current = rascunho;
    const marqueeRef = useRef(marquee); marqueeRef.current = marquee;
    const registraDesenhoRef = useRef(registraDesenho); registraDesenhoRef.current = registraDesenho;
    const flushDesenhoRef = useRef(flushDesenho); flushDesenhoRef.current = flushDesenho;
    const ultimoSerialRef = useRef<string>('');
    const svgRef = useRef<SVGSVGElement | null>(null);
    const grupoRef = useRef<SVGGElement | null>(null);
    const arrasteRef = useRef<null | { tipo: 'card' | 'pan'; id: number; sx: number; sy: number; ox: number; oy: number; moveu: boolean }>(null);
    const desenhoArrasteRef = useRef<null | { modo: 'desenhar' | 'mover' | 'resize' | 'marcar'; tipo: ElementoTipo; sx: number; sy: number; origens: Elemento[]; moveu: boolean }>(null);
    // Arraste de GRUPO (cartoes + desenhos selecionados pelo marquee): coordenadas de mundo, origens congeladas no mousedown.
    const grupoArrasteRef = useRef<null | { sx: number; sy: number; idClicado: number; origensCards: { id: number; x: number; y: number }[]; origensElementos: Elemento[]; moveu: boolean }>(null);
    const selCardIdsRef = useRef(selCardIds); selCardIdsRef.current = selCardIds;
    // Posicao atual (pos-merge) de cada no, atualizada a cada render: usada pelo marquee e pelo arraste de grupo dentro dos handlers globais.
    const posCardsAtuaisRef = useRef<{ id: number; x: number; y: number }[]>([]);

    const registros = cards.registros;
    const objetivoAtual = objetivos.registros.find(o => o.id === objetivoAtualId) ?? null;

    // Cor do no pelo estado REAL do workflow (a tranca): dourado = ativo, verde = Concluido, vermelho = Interrompido.
    const corDe = (card: Card) => card.motivoTranca === 'CONCLUIDO' ? '#4f7a5a' : card.motivoTranca === 'INTERROMPIDO' ? '#c95f5f' : '#B79051';
    const nomeColuna = (card: Card) => colunas.registros.find(c => c.id === card.fkColunasId)?.nome ?? '';

    const indiceColuna = useMemo(() => { const m = new Map<number, number>(); [...colunas.registros].sort((a, b) => a.ordem - b.ordem).forEach((c, i) => m.set(c.id, i)); return m; }, [colunas.registros]);

    // Vinculos checklist-referencia (cartao pai contem outro cartao como item): arestas pai -> filho entre nos do objetivo atual.
    const vinculosVisiveis = useMemo(() => {
        const idsNoObjetivo = new Set(cards.registros.map(c => c.id));
        return itensChecklistQuadro.registros
            .filter(item => item.fkCardsId !== null && item.fkCardsReferenciaId !== null && idsNoObjetivo.has(item.fkCardsId) && idsNoObjetivo.has(item.fkCardsReferenciaId))
            .map(item => ({ id: item.id, paiId: item.fkCardsId as number, filhoId: item.fkCardsReferenciaId as number }));
    }, [itensChecklistQuadro.registros, cards.registros]);

    // Mesmo padrao do Quadro: criador primeiro (membro obrigatorio derivado do card); vinculos de membros_cards em seguida, sem duplicar o criador.
    const membrosPorCard = useMemo(() => {
        const mapa = new Map<number, { id: number; username: string }[]>();
        cards.registros.forEach(card => mapa.set(card.id, [{ id: card.fkUsuariosCriacaoId, username: card.usuarioCriacao?.username ?? '?' }]));
        membrosCards.registros.forEach(membro => {
            const lista = mapa.get(membro.fkCardsId);
            if (!lista || lista.some(m => m.id === membro.fkUsuariosId)) return;
            lista.push({ id: membro.fkUsuariosId, username: membro.usuario.username });
        });
        return mapa;
    }, [cards.registros, membrosCards.registros]);

    // Progresso do checklist por card (mesma derivacao do Quadro): item-referencia deriva "feito" da tranca CONCLUIDO do cartao referenciado.
    const checklistPorCard = useMemo(() => {
        const trancaPorCard = new Map(todosCards.registros.map(card => [card.id, card.motivoTranca]));
        const mapa = new Map<number, { feitos: number; total: number }>();
        itensChecklistQuadro.registros.forEach(item => {
            if (item.fkCardsId === null) return;
            const feito = item.fkCardsReferenciaId !== null ? trancaPorCard.get(item.fkCardsReferenciaId) === 'CONCLUIDO' : item.concluido;
            const atual = mapa.get(item.fkCardsId) ?? { feitos: 0, total: 0 };
            mapa.set(item.fkCardsId, { feitos: atual.feitos + (feito ? 1 : 0), total: atual.total + 1 });
        });
        return mapa;
    }, [itensChecklistQuadro.registros, todosCards.registros]);

    // Vinculos com UMA ponta fora do objetivo atual: a ponta de fora vira no-fantasma ancorado no no visivel (clique abre a ficha do cartao de fora).
    const vinculosCruzados = useMemo(() => {
        const idsNoObjetivo = new Set(cards.registros.map(c => c.id));
        return itensChecklistQuadro.registros
            .filter(item => item.fkCardsId !== null && item.fkCardsReferenciaId !== null && idsNoObjetivo.has(item.fkCardsId as number) !== idsNoObjetivo.has(item.fkCardsReferenciaId as number))
            .map(item => {
                const paiDentro = idsNoObjetivo.has(item.fkCardsId as number);
                return { id: item.id, dentroId: paiDentro ? item.fkCardsId as number : item.fkCardsReferenciaId as number, foraId: paiDentro ? item.fkCardsReferenciaId as number : item.fkCardsId as number, paiDentro };
            });
    }, [itensChecklistQuadro.registros, cards.registros]);
    const posPadrao = (card: Card) => ({ x: (indiceColuna.get(card.fkColunasId) ?? 0) * 260 + 30, y: ((card.ordem ?? 1) - 1) * 110 + 170 });
    const posServidor = (cardId: number) => { const p = posicoesFluxograma.registros.find(x => x.fkCardsId === cardId); return p ? { x: p.posicaoX, y: p.posicaoY } : null; };
    // Merge de posicao: arraste proprio (posLocal) > arraste ao vivo de outro cliente > persistida > padrao por coluna.
    const posCard = (card: Card) => posLocal[card.id] ?? posicoesCardsAoVivo.get(card.id) ?? posServidor(card.id) ?? posPadrao(card);
    posCardsAtuaisRef.current = registros.map(card => { const p = posCard(card); return { id: card.id, x: p.x, y: p.y }; });

    const serializaDesenho = (elems: Elemento[]) => elems.length ? JSON.stringify(elems) : null;
    const persisteDesenho = () => { const serial = serializaDesenho(elementosRef.current); ultimoSerialRef.current = serial ?? ''; registraDesenhoRef.current(serial); };
    const comita = (atualiza: (prev: Elemento[]) => Elemento[]) => { const next = atualiza(elementosRef.current); elementosRef.current = next; setElementos(next); persisteDesenho(); };
    const aplicaLive = (atualiza: (prev: Elemento[]) => Elemento[]) => { const next = atualiza(elementosRef.current); elementosRef.current = next; setElementos(next); };

    const finalizaTexto = (id: string) => {
        setEditTextoId(null);
        const el = elementosRef.current.find(x => x.id === id);
        if (el && !(el.texto ?? '').trim()) comita(prev => prev.filter(x => x.id !== id));
        else persisteDesenho();
    };

    const comitaRef = useRef(comita); comitaRef.current = comita;
    const aplicaLiveRef = useRef(aplicaLive); aplicaLiveRef.current = aplicaLive;
    const persisteDesenhoRef = useRef(persisteDesenho); persisteDesenhoRef.current = persisteDesenho;

    // Stream do desenho ao vivo (mesma mecanica dos cartoes): serializa elementos + rascunho em andamento e transmite com throttle; chamado em todo ponto que muda o desenho durante a interacao.
    const transmiteDesenhoAoVivoRef = useRef(transmiteDesenhoAoVivo); transmiteDesenhoAoVivoRef.current = transmiteDesenhoAoVivo;
    const ultimoDesenhoAoVivoRef = useRef(0);
    const transmiteDesenhoAoVivoAgora = () => {
        const agora = Date.now();
        if (agora - ultimoDesenhoAoVivoRef.current < 90) return;
        ultimoDesenhoAoVivoRef.current = agora;
        const rascunhoAtual = rascunhoRef.current;
        transmiteDesenhoAoVivoRef.current(serializaDesenho(rascunhoAtual ? [...elementosRef.current, rascunhoAtual] : elementosRef.current));
    };
    const transmiteDesenhoAgoraRef = useRef(transmiteDesenhoAoVivoAgora); transmiteDesenhoAgoraRef.current = transmiteDesenhoAoVivoAgora;

    useEffect(() => {
        if (desenhoArrasteRef.current || editTextoId !== null) return;
        const serial = desenhoConteudo ?? '';
        if (serial === ultimoSerialRef.current) return;
        ultimoSerialRef.current = serial;
        const novos = parseElementos(desenhoConteudo);
        elementosRef.current = novos;
        setElementos(novos);
        setSelIds([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desenhoConteudo, editTextoId]);

    useEffect(() => () => flushDesenhoRef.current(), []);

    useEffect(() => {
        setPosLocal(prev => {
            const next = { ...prev }; let mudou = false;
            // Compara ARREDONDADO: o servidor persiste inteiros; igualdade estrita com o float local nunca batia e o override ficava preso (cegando este cliente pros movimentos dos outros neste card).
            for (const card of registros) { const ov = next[card.id]; const sp = posServidor(card.id); if (ov && sp && Math.round(ov.x) === sp.x && Math.round(ov.y) === sp.y) { delete next[card.id]; mudou = true; } }
            return mudou ? next : prev;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posicoesFluxograma.registros]);

    // Converte coordenadas de tela (clientX/Y) para o sistema do canvas via getScreenCTM do grupo transformado: embute escala da plataforma (ConteinerEscalavel), layout do SVG, pan e zoom.
    const cursorMundo = (clientX: number, clientY: number) => { const ctm = grupoRef.current?.getScreenCTM(); if (!ctm) return { x: 0, y: 0 }; const inv = ctm.inverse(); return { x: inv.a * clientX + inv.c * clientY + inv.e, y: inv.b * clientX + inv.d * clientY + inv.f }; };
    // Escala de tela do SVG raiz (sem o pan/zoom interno): usada para converter deltas de pixel de tela em deltas de pan.
    const escalaTela = () => svgRef.current?.getScreenCTM()?.a ?? 1;
    const mundoParaTela = (x: number, y: number) => ({ x: vista.x + x * vista.z, y: vista.y + y * vista.z });

    useEffect(() => {
        const aoMover = (e: MouseEvent) => {
            // Mouseup perdido (soltou fora da janela, drag nativo, alt-tab): mousemove sem o botao do arraste ativo = encerra como soltar. Sem isso o arraste fica grudado no cursor. O pan usa o botao do MEIO (bit 4); os demais arrastes, o esquerdo (bit 1).
            const botaoDoArraste = arrasteRef.current?.tipo === 'pan' ? 4 : 1;
            if ((e.buttons & botaoDoArraste) === 0 && (grupoArrasteRef.current || desenhoArrasteRef.current || arrasteRef.current)) { aoSoltar(e); return; }
            const g = grupoArrasteRef.current;
            if (g) {
                const m = cursorMundo(e.clientX, e.clientY);
                const dx = m.x - g.sx, dy = m.y - g.sy;
                if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) g.moveu = true;
                if (g.origensCards.length) setPosLocal(p => { const next = { ...p }; g.origensCards.forEach(origem => { next[origem.id] = { x: origem.x + dx, y: origem.y + dy }; }); return next; });
                if (g.origensElementos.length) { const mapa = new Map(g.origensElementos.map(origem => [origem.id, origem])); aplicaLiveRef.current(prev => prev.map(el => mapa.has(el.id) ? moveElemento(mapa.get(el.id) as Elemento, dx, dy) : el)); transmiteDesenhoAgoraRef.current(); }
                const agora = Date.now();
                if (agora - ultimoAoVivoRef.current >= 90) { ultimoAoVivoRef.current = agora; g.origensCards.forEach(origem => transmiteAoVivoRef.current(origem.id, Math.round(origem.x + dx), Math.round(origem.y + dy))); }
                return;
            }
            const da = desenhoArrasteRef.current;
            if (da) {
                const m = cursorMundo(e.clientX, e.clientY);
                da.moveu = true;
                if (da.modo === 'desenhar') {
                    if (da.tipo === 'caneta') setRascunho(r => r ? { ...r, pontos: [...(r.pontos ?? []), { x: m.x, y: m.y }] } : r);
                    else if (da.tipo === 'seta') setRascunho(r => r ? { ...r, x2: m.x, y2: m.y } : r);
                    else setRascunho(r => r ? { ...r, x: Math.min(da.sx, m.x), y: Math.min(da.sy, m.y), w: Math.abs(m.x - da.sx), h: Math.abs(m.y - da.sy) } : r);
                    transmiteDesenhoAgoraRef.current();
                } else if (da.modo === 'mover') {
                    const dx = m.x - da.sx, dy = m.y - da.sy, mapa = new Map(da.origens.map(o => [o.id, o]));
                    aplicaLiveRef.current(prev => prev.map(el => mapa.has(el.id) ? moveElemento(mapa.get(el.id) as Elemento, dx, dy) : el));
                    transmiteDesenhoAgoraRef.current();
                } else if (da.modo === 'resize') {
                    const origem = da.origens[0]; if (origem) { const w = Math.max(8, m.x - origem.x), h = Math.max(8, m.y - origem.y); aplicaLiveRef.current(prev => prev.map(el => el.id === origem.id ? { ...origem, w, h } : el)); transmiteDesenhoAgoraRef.current(); }
                } else if (da.modo === 'marcar') {
                    setMarquee({ x: Math.min(da.sx, m.x), y: Math.min(da.sy, m.y), w: Math.abs(m.x - da.sx), h: Math.abs(m.y - da.sy) });
                }
                return;
            }
            const a = arrasteRef.current; if (!a) return;
            const dx = e.clientX - a.sx, dy = e.clientY - a.sy;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) a.moveu = true;
            if (a.tipo === 'pan') { const s = escalaTela(); setVista(v => ({ ...v, x: a.ox + dx / s, y: a.oy + dy / s })); }
            else if (a.tipo === 'card' && !travadoRef.current) {
                const m = cursorMundo(e.clientX, e.clientY);
                const pos = { x: m.x + a.ox, y: m.y + a.oy };
                setPosLocal(p => ({ ...p, [a.id]: pos }));
                // Arraste ao vivo: transmite a posicao efemera (throttle) pros outros clientes verem o no se movendo; o commit continua no soltar.
                const agora = Date.now();
                if (agora - ultimoAoVivoRef.current >= 90) { ultimoAoVivoRef.current = agora; transmiteAoVivoRef.current(a.id, Math.round(pos.x), Math.round(pos.y)); }
            }
        };
        const aoSoltar = (e: MouseEvent) => {
            setPanning(false);
            const g = grupoArrasteRef.current;
            if (g) {
                grupoArrasteRef.current = null;
                if (!g.moveu) { if (g.idClicado > 0) abrirCardRef.current(g.idClicado); return; }
                // Persiste cada cartao do grupo em INTEIROS e alinha o override local (mesma regra do arraste individual: igualdade estrita na reconciliacao).
                const posAtual = posLocalRef.current;
                setPosLocal(p => { const next = { ...p }; g.origensCards.forEach(origem => { const pos = next[origem.id]; if (pos) next[origem.id] = { x: Math.round(pos.x), y: Math.round(pos.y) }; }); return next; });
                g.origensCards.forEach(origem => { const pos = posAtual[origem.id]; if (pos) definePosRef.current(origem.id, Math.round(pos.x), Math.round(pos.y)); });
                if (g.origensElementos.length) persisteDesenhoRef.current();
                return;
            }
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
                    if (da.moveu && mq && (mq.w > 2 || mq.h > 2)) {
                        setSelIds(elementosRef.current.filter(el => intersecta(mq, bbox(el))).map(el => el.id));
                        // O marquee tambem seleciona CARTOES: qualquer no tocado pela area entra no grupo.
                        setSelCardIds(posCardsAtuaisRef.current.filter(p => intersecta(mq, { x: p.x, y: p.y, w: DIM.w, h: DIM.h })).map(p => p.id));
                    }
                    else { setSelIds([]); setSelCardIds([]); }
                } else if (da.moveu) persisteDesenhoRef.current();
                return;
            }
            const a = arrasteRef.current; if (!a) return;
            if (a.tipo === 'card' && a.moveu && !travadoRef.current) {
                const pos = posLocalRef.current[a.id];
                // Alinha o override local ao INTEIRO persistido: a reconciliacao limpa o override por igualdade com o servidor — float local vs int salvo deixava o override preso, e este cliente parava de ver movimentos deste card feitos por outros.
                if (pos) { const px = Math.round(pos.x), py = Math.round(pos.y); setPosLocal(p => ({ ...p, [a.id]: { x: px, y: py } })); definePosRef.current(a.id, px, py); }
            }
            else if (a.tipo === 'card' && !a.moveu) abrirCardRef.current(a.id);
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
            else if (e.key === 'Escape') { setSelIds([]); setSelCardIds([]); setFerramenta('selecionar'); }
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
        // Cartao dentro da selecao de grupo: arrasta o grupo inteiro (cartoes + desenhos selecionados). Clique sem mover continua abrindo a ficha. preventDefault mata drag nativo/selecao de texto que engoliriam o mouseup.
        if (!travado && selCardIds.includes(card.id)) {
            e.preventDefault();
            const m = cursorMundo(e.clientX, e.clientY);
            grupoArrasteRef.current = { sx: m.x, sy: m.y, idClicado: card.id, origensCards: posCardsAtuaisRef.current.filter(p => selCardIds.includes(p.id)), origensElementos: elementos.filter(el => selIds.includes(el.id)), moveu: false };
            return;
        }
        if (selCardIds.length) setSelCardIds([]);
        const pos = posCard(card), m = cursorMundo(e.clientX, e.clientY);
        arrasteRef.current = { tipo: 'card', id: card.id, sx: e.clientX, sy: e.clientY, ox: pos.x - m.x, oy: pos.y - m.y, moveu: false };
    };
    const aoMouseDownElemento = (e: ReactMouseEvent, el: Elemento) => {
        if (travado) return;
        if (e.button !== 0 || ferramenta !== 'selecionar') return;
        e.stopPropagation();
        const jaSel = selIds.includes(el.id);
        // Desenho dentro de uma selecao mista (com cartoes): arrasta o grupo inteiro. preventDefault mata drag nativo/selecao de texto que engoliriam o mouseup.
        if (jaSel && selCardIds.length > 0 && !e.shiftKey) {
            e.preventDefault();
            const m = cursorMundo(e.clientX, e.clientY);
            grupoArrasteRef.current = { sx: m.x, sy: m.y, idClicado: 0, origensCards: posCardsAtuaisRef.current.filter(p => selCardIds.includes(p.id)), origensElementos: elementos.filter(x => selIds.includes(x.id)), moveu: false };
            return;
        }
        if (!jaSel && !e.shiftKey && selCardIds.length) setSelCardIds([]);
        const nova = e.shiftKey ? (jaSel ? selIds.filter(i => i !== el.id) : [...selIds, el.id]) : (jaSel ? selIds : [el.id]);
        setSelIds(nova);
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
    // Cursor ao vivo: transmite o ponteiro em coordenadas de MUNDO (throttle) pra sala do objetivo; os outros clientes desenham o cursor com o username.
    const aoMoverCursor = (e: ReactMouseEvent) => {
        const agora = Date.now();
        if (agora - ultimoCursorRef.current < 80) return;
        ultimoCursorRef.current = agora;
        const m = cursorMundo(e.clientX, e.clientY);
        transmiteCursorRef.current(Math.round(m.x), Math.round(m.y));
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

    const aplicaCor = (c: string) => { setCorAtiva(c); if (selIds.length) { const ids = new Set(selIds); comita(prev => prev.map(el => ids.has(el.id) ? { ...el, cor: c } : el)); } };
    const excluiSelecionado = () => { if (!selIds.length) return; const ids = new Set(selIds); setSelIds([]); comita(prev => prev.filter(el => !ids.has(el.id))); };

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
            <div className={styles.ferramentas}>
                {travado && <span className={styles.faixaTranca}>🔒 Objetivo trancado — somente leitura</span>}
                {!travado && <>
                    {FERRAMENTAS.map(f => <button key={f.id} className={`${styles.ferramenta} ${ferramenta === f.id ? styles.ferramentaAtiva : ''}`} title={f.dica} onClick={() => { setFerramenta(f.id); if (f.id !== 'selecionar') setSelIds([]); }}>{f.rotulo}</button>)}
                    <span className={styles.separador} />
                    {CORES.map(c => <button key={c} className={`${styles.swatch} ${corAtiva === c ? styles.swatchAtivo : ''}`} style={{ background: c }} title="Cor" onClick={() => aplicaCor(c)} />)}
                    {selIds.length > 0 && <><span className={styles.separador} /><button className={styles.ferramenta} title="Excluir selecionado (Del)" onClick={excluiSelecionado}>🗑</button></>}
                </>}
                <span className={styles.dicaMouse}>esquerdo: selecionar · botão do meio: mover canvas</span>
                <span className={styles.espacador} />
                <button className={styles.botao} onClick={() => alteraZoom(-0.15)}>−</button>
                <span className={styles.zoomTxt}>{Math.round(vista.z * 100)}%</span>
                <button className={styles.botao} onClick={() => alteraZoom(0.15)}>+</button>
                <button className={styles.botao} onClick={() => setVista({ x: 40, y: 30, z: 1 })} title="Resetar vista">⟲</button>
                <span className={styles.divisor} />
                <BarraView pagina={pagina} setPagina={setPagina} />
            </div>

            {cards.erro && <p className={styles.erro}>{cards.erro}</p>}

            <div className={styles.corpo}>
                <div className={`${styles.palco} ${ferramenta !== 'selecionar' ? styles.desenhando : ''} ${panning ? styles.movendoCanvas : ''}`} onMouseDown={aoMouseDownFundo} onMouseMove={aoMoverCursor} onContextMenu={e => e.preventDefault()}>
                    {objetivoAtualId === null && <p className={styles.aviso}>Selecione um objetivo.</p>}
                    {objetivoAtualId !== null && !cards.carregando && registros.length === 0 && <p className={styles.aviso}>Nenhum card neste objetivo. Crie cards no Quadro — aqui eles viram nós. Use as ferramentas acima pra anotar o fluxo.</p>}
                    <svg ref={svgRef} className={styles.svg} xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <marker id="setaVinculo" markerWidth="11" markerHeight="11" refX="9" refY="5" orient="auto">
                                <path d="M1,1 L9,5 L1,9" fill="none" stroke="#B79051" strokeWidth={1.6} />
                            </marker>
                        </defs>
                        <g ref={grupoRef} transform={`translate(${vista.x},${vista.y}) scale(${vista.z})`}>
                            {vinculosVisiveis.map(vinculo => {
                                const cardPai = registros.find(c => c.id === vinculo.paiId), cardFilho = registros.find(c => c.id === vinculo.filhoId);
                                if (!cardPai || !cardFilho) return null;
                                const pp = posCard(cardPai), pf = posCard(cardFilho);
                                const centroPai = { x: pp.x + DIM.w / 2, y: pp.y + DIM.h / 2 }, centroFilho = { x: pf.x + DIM.w / 2, y: pf.y + DIM.h / 2 };
                                const p1 = pontoBorda(centroPai.x, centroPai.y, DIM.w, DIM.h, centroFilho.x, centroFilho.y);
                                const p2 = pontoBorda(centroFilho.x, centroFilho.y, DIM.w, DIM.h, centroPai.x, centroPai.y);
                                return <line key={`v${vinculo.id}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#B79051" strokeWidth={2} markerEnd="url(#setaVinculo)" opacity={0.75} style={{ pointerEvents: 'none' }} />;
                            })}

                            {(() => {
                                // No-fantasma por cartao de fora do objetivo (um por cartao), ancorado a direita do primeiro no visivel vinculado; segue o no ao arrastar.
                                const posFantasma = new Map<number, { x: number; y: number }>();
                                let ordem = 0;
                                vinculosCruzados.forEach(vinculo => {
                                    if (posFantasma.has(vinculo.foraId)) return;
                                    const ancora = registros.find(c => c.id === vinculo.dentroId);
                                    if (!ancora) return;
                                    const p = posCard(ancora);
                                    posFantasma.set(vinculo.foraId, { x: p.x + DIM.w + 80, y: p.y + (ordem++ % 3) * (DIM.h + 24) });
                                });
                                return (
                                    <g>
                                        {vinculosCruzados.map(vinculo => {
                                            const ancora = registros.find(c => c.id === vinculo.dentroId);
                                            const pf = posFantasma.get(vinculo.foraId);
                                            if (!ancora || !pf) return null;
                                            const pa = posCard(ancora);
                                            const centroAncora = { x: pa.x + DIM.w / 2, y: pa.y + DIM.h / 2 }, centroFantasma = { x: pf.x + DIM.w / 2, y: pf.y + DIM.h / 2 };
                                            const p1 = pontoBorda(centroAncora.x, centroAncora.y, DIM.w, DIM.h, centroFantasma.x, centroFantasma.y);
                                            const p2 = pontoBorda(centroFantasma.x, centroFantasma.y, DIM.w, DIM.h, centroAncora.x, centroAncora.y);
                                            // Direcao pai -> filho preservada: se o pai e o de fora, a seta sai do fantasma.
                                            const [de, para] = vinculo.paiDentro ? [p1, p2] : [p2, p1];
                                            return <line key={`vc${vinculo.id}`} x1={de.x} y1={de.y} x2={para.x} y2={para.y} stroke="#B79051" strokeWidth={1.6} strokeDasharray="6 5" markerEnd="url(#setaVinculo)" opacity={0.55} style={{ pointerEvents: 'none' }} />;
                                        })}
                                        {[...posFantasma.entries()].map(([foraId, p]) => {
                                            const cardFora = todosCards.registros.find(c => c.id === foraId);
                                            const nomeObjetivo = objetivos.registros.find(o => o.id === cardFora?.fkObjetivosId)?.nome ?? 'outro objetivo';
                                            const linhas = quebraTexto(cardFora?.titulo ?? `#${foraId}`, 24);
                                            return (
                                                <g key={`f${foraId}`} style={{ cursor: 'pointer' }} onMouseDown={e => { if (e.button !== 0 || ferramenta !== 'selecionar') return; e.stopPropagation(); abrirCardPorId(foraId); }}>
                                                    <rect x={p.x} y={p.y} width={DIM.w} height={DIM.h} rx={13} fill="#0d0b14" fillOpacity={0.6} stroke="#5a5468" strokeWidth={1.6} strokeDasharray="5 4" />
                                                    {linhas.map((ln, i) => <text key={i} className={styles.tJunge} x={p.x + DIM.w / 2} y={p.y + DIM.h / 2 - (linhas.length - 1) * 8 + i * 16 - 4} textAnchor="middle" fontSize={12.5} fill="#aba6b8">{ln}</text>)}
                                                    <text className={styles.tJunge} x={p.x + DIM.w / 2} y={p.y + DIM.h - 9} textAnchor="middle" fontSize={9.5} fill="#7a6f9c">↗ {nomeObjetivo}</text>
                                                </g>
                                            );
                                        })}
                                    </g>
                                );
                            })()}

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
                                        {card.motivoTranca !== null
                                            ? <text className={styles.tJunge} x={p.x + 11} y={p.y + DIM.h - 9} fontSize={9.5} fill={card.motivoTranca === 'CONCLUIDO' ? '#8fc9a0' : '#e0a0a0'}>🔒 {card.motivoTranca === 'CONCLUIDO' ? 'CONCLUÍDO' : 'INTERROMPIDO'}</text>
                                            : (() => { const progresso = checklistPorCard.get(card.id); return progresso && progresso.total > 0 ? <text className={styles.tJunge} x={p.x + 11} y={p.y + DIM.h - 9} fontSize={9.5} fill={progresso.feitos === progresso.total ? '#8fc9a0' : '#8a8474'}>☑ {progresso.feitos}/{progresso.total}</text> : null; })()}
                                        {(membrosPorCard.get(card.id) ?? []).length > 0 && (
                                            <foreignObject x={p.x + 8} y={p.y + DIM.h - 32} width={DIM.w - 16} height={26} style={{ pointerEvents: 'none' }}>
                                                <div className={styles.avataresNo}>
                                                    {(membrosPorCard.get(card.id) ?? []).map(membro => <span key={membro.id} className={styles.avatarNo} title={membro.username}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={membro.id} /></span>)}
                                                </div>
                                            </foreignObject>
                                        )}
                                        {selCardIds.includes(card.id) && <rect x={p.x - 4} y={p.y - 4} width={DIM.w + 8} height={DIM.h + 8} rx={15} fill="none" stroke="#B79051" strokeWidth={1.4} strokeDasharray="5 4" pointerEvents="none" />}
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

                            {[...cursoresFluxograma.entries()].map(([idUsuario, cursor]) => {
                                const cor = CORES_CURSOR[idUsuario % CORES_CURSOR.length];
                                // Escala inversa ao zoom: o cursor mantem tamanho de tela constante, como no Figma.
                                return (
                                    <g key={`cur${idUsuario}`} transform={`translate(${cursor.x},${cursor.y}) scale(${1 / vista.z})`} pointerEvents="none" opacity={0.95}>
                                        <path d="M0,0 L0,14 L4,10.5 L7,16 L9,15 L6.2,9.6 L11,9 Z" fill={cor} stroke="#0a0810" strokeWidth={0.8} />
                                        <text className={styles.tJunge} x={13} y={19} fontSize={10.5} fill={cor} stroke="#0a0810" strokeWidth={0.25} paintOrder="stroke">{cursor.username}</text>
                                    </g>
                                );
                            })}
                        </g>
                    </svg>

                    {editandoEl && (() => { const tela = mundoParaTela(editandoEl.x, editandoEl.y); return <textarea className={styles.editorTexto} style={{ left: tela.x, top: tela.y - 16, transform: `scale(${vista.z})`, color: editandoEl.cor, fontSize: 16, lineHeight: '20px' }} value={editandoEl.texto ?? ''} autoFocus onChange={e => { aplicaLive(prev => prev.map(x => x.id === editandoEl.id ? { ...x, texto: e.target.value } : x)); transmiteDesenhoAoVivoAgora(); }} onBlur={() => finalizaTexto(editandoEl.id)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); finalizaTexto(editandoEl.id); } if (e.key === 'Escape') finalizaTexto(editandoEl.id); }} />; })()}

                    {presencaObjetivo.length > 0 && (
                        <span className={styles.presenca} title={`Vendo agora: ${presencaObjetivo.map(usuario => usuario.username).join(', ')}`} onMouseDown={e => e.stopPropagation()}>
                            {presencaObjetivo.map(usuario => <span key={usuario.id} className={styles.avatarPresenca}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={usuario.id} /></span>)}
                        </span>
                    )}
                </div>

                {objetivoAtual && (painelAberto ? (
                    <aside className={styles.painel}>
                        <div className={styles.painelCabecalho}>
                            <span className={styles.painelTitulo}>{objetivoAtual.nome}</span>
                            <button className={styles.painelToggle} title="Recolher descrição" onClick={() => setPainelAberto(false)}>»</button>
                        </div>
                        <span className={styles.painelStatus} style={{ color: objetivoAtual.motivoTranca === 'CONCLUIDO' ? '#8fc9a0' : objetivoAtual.motivoTranca === 'INTERROMPIDO' ? '#e0a0a0' : '#8a8474' }}>
                            {objetivoAtual.motivoTranca === 'CONCLUIDO' ? '🔒 Concluído' : objetivoAtual.motivoTranca === 'INTERROMPIDO' ? '🔒 Interrompido' : 'Ativo'}
                        </span>
                        {objetivoAtual.descricao ? <p className={styles.painelDescricao}>{objetivoAtual.descricao}</p> : <p className={styles.painelVazio}>Sem descrição ainda.</p>}
                        <button className={styles.botao} onClick={() => abrirFichaObjetivo(objetivoAtual.id)}>Ficha do objetivo</button>
                    </aside>
                ) : (
                    <button className={styles.painelRecolhido} title="Expandir descrição do objetivo" onClick={() => setPainelAberto(true)}>«</button>
                ))}
            </div>

            {objetivoFichaAbertaId !== null && <FichaObjetivo key={objetivoFichaAbertaId} objetivoId={objetivoFichaAbertaId} />}
        </section>
    );
};
