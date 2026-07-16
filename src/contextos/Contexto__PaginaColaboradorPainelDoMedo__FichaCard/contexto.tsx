'use client';

import { createContext, useContext, useMemo } from 'react';

import type { AnexoCardDto, AnexoEvidencia } from 'types-nora-api';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import SPA__PaginaColaboradorPainelDoMedo__FichaCard from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__FichaCard/SPA__PaginaColaboradorPainelDoMedo__FichaCard';

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];
type DependenciaItem = Contexto__PaginaColaboradorPainelDoMedo__Props['dependenciasCards']['registros'][number];

// Criador do card = membro obrigatorio DERIVADO (vinculoId null, sem linha em membros_cards): irremovivel por construcao.
type MembroFicha = { vinculoId: number | null; usuarioId: number; username: string; criador: boolean };
type EtiquetaFicha = { vinculoId: number; etiquetaId: number; nome: string; cor: string; corBorda: string };
type ItemFeed = { chave: string; tipo: 'comentario' | 'evento'; comentarioId: number | null; usuarioId: number; username: string; texto: string; data: string | Date };

interface Contexto__PaginaColaboradorPainelDoMedo__FichaCard__Props {
    card: CardItem;
    salvando: boolean;
    // Papel do usuario logado no card: observador so VE; membro inclui/altera; criador tambem remove/edita titulo/exclui. Backend reforca as mesmas regras.
    papel: 'criador' | 'membro' | 'observador';
    podeIncluir: boolean;
    podeRemover: boolean;
    // Tranca: card ou objetivo trancado = ficha somente-leitura para TODOS (inclusive criador). Trancar/destrancar e exclusivo do criador (e exige objetivo destrancado).
    motivoTrancaCard: string | null;
    motivoTrancaObjetivo: string | null;
    podeTrancar: boolean;
    abrirTrancarCartao: () => void;
    destrancar: () => Promise<void>;
    // Operacoes que mudam composicao / dao input: navegam para SPA propria (foco unico), nunca inline.
    editarTitulo: () => void;
    // Descricao e bloco de escrita in-place na propria ficha (como o composer de comentario): "Atualizar" persiste direto, sem sub-fluxo.
    atualizarDescricao: (descricao: string | null) => Promise<void>;
    abrirAplicarEtiqueta: () => void;
    abrirAdicionarItemChecklist: () => void;
    abrirAdicionarDependencia: () => void;
    excluir: () => Promise<void>;
    // Acoes de clique unico revertivel: permanecem inline na visualizacao (adicionar membro = escolher no dropdown do cache, one-clicker).
    membros: readonly MembroFicha[];
    adicionarMembro: (usuarioId: number) => Promise<void>;
    removerMembro: (vinculoId: number) => Promise<void>;
    etiquetasDoCard: readonly EtiquetaFicha[];
    removerEtiqueta: (vinculoId: number) => Promise<void>;
    feed: readonly ItemFeed[];
    comentar: (texto: string, anexos?: readonly AnexoEvidencia[]) => Promise<void>;
    anexosPorComentario: ReadonlyMap<number, readonly AnexoCardDto[]>;
    totalEvidencias: number;
    checklist: Contexto__PaginaColaboradorPainelDoMedo__Props['checklist'];
    marcaItemChecklist: Contexto__PaginaColaboradorPainelDoMedo__Props['marcaItemChecklist'];
    deletaItemChecklist: Contexto__PaginaColaboradorPainelDoMedo__Props['deletaItemChecklist'];
    requisitos: readonly DependenciaItem[];
    removeDependencia: (id: number) => Promise<void>;
    tituloCard: (id: number) => string;
    rotuloObjetivoDoCard: (id: number) => string | null;
    abrirCardPorId: (cardId: number) => void;
    cardsMencionaveis: readonly { id: number; titulo: string }[];
};

const Contexto__PaginaColaboradorPainelDoMedo__FichaCard = createContext<Contexto__PaginaColaboradorPainelDoMedo__FichaCard__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__FichaCard = (): Contexto__PaginaColaboradorPainelDoMedo__FichaCard__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__FichaCard);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__FichaCard precisa estar dentro de um Contexto__PaginaColaboradorPainelDoMedo__FichaCard');
    return context;
};

// Pagina de VISUALIZACAO do card: so apresenta e dispara acoes de clique unico (remover/marcar/comentar). Operacoes que mudam composicao navegam para SPAs proprias via abrirOperacaoCard.
export const Contexto__PaginaColaboradorPainelDoMedo__FichaCard__Provider = () => {
    const { cards, cardAbertoId, salvando, deletaCard, criaComentario, comentarios, eventosCards, checklist, marcaItemChecklist, deletaItemChecklist, dependenciasCards, todosCards, objetivos, deletaDependenciaCard, fecharCard, membrosCards, etiquetas, etiquetasCards, adicionaMembroCard, removeMembroCard, removeEtiquetaCard, atualizaDescricaoCard, anexosCard, trancaCard, abrirCardPorId, abrirOperacaoCard } = useContexto__PaginaColaboradorPainelDoMedo();
    const { usuarioLogado } = useContextoAutenticacao();

    const card = cards.registros.find(item => item.id === cardAbertoId) ?? null;

    const requisitos = useMemo(() => card ? dependenciasCards.registros.filter(dep => dep.fkCardsDependenteId === card.id) : [], [card, dependenciasCards.registros]);

    const membros = useMemo<MembroFicha[]>(() => {
        if (!card) return [];
        const criador: MembroFicha = { vinculoId: null, usuarioId: card.fkUsuariosCriacaoId, username: card.usuarioCriacao?.username ?? '?', criador: true };
        const vinculados = membrosCards.registros.filter(m => m.fkCardsId === card.id && m.fkUsuariosId !== card.fkUsuariosCriacaoId).map(m => ({ vinculoId: m.id, usuarioId: m.fkUsuariosId, username: m.usuario.username, criador: false }));
        return [criador, ...vinculados];
    }, [card, membrosCards.registros]);

    const etiquetasDoCard = useMemo<EtiquetaFicha[]>(() => {
        if (!card) return [];
        return etiquetasCards.registros.filter(v => v.fkCardsId === card.id).map(v => {
            const etiqueta = etiquetas.registros.find(e => e.id === v.fkEtiquetasId);
            return { vinculoId: v.id, etiquetaId: v.fkEtiquetasId, nome: etiqueta?.nome ?? '?', cor: etiqueta?.cor ?? '#6f6896', corBorda: etiqueta?.corBorda ?? 'transparent' };
        });
    }, [card, etiquetasCards.registros, etiquetas.registros]);

    const feed = useMemo<ItemFeed[]>(() => {
        const itens: ItemFeed[] = [
            ...comentarios.registros.map(c => ({ chave: `c${c.id}`, tipo: 'comentario' as const, comentarioId: c.id, usuarioId: c.usuarioCriacao.id, username: c.usuarioCriacao.username, texto: c.texto, data: c.dataCriacao })),
            ...eventosCards.registros.map(e => ({ chave: `e${e.id}`, tipo: 'evento' as const, comentarioId: null, usuarioId: e.usuario.id, username: e.usuario.username, texto: e.texto, data: e.dataCriacao })),
        ];
        return itens.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    }, [comentarios.registros, eventosCards.registros]);

    // Evidencias agrupadas por comentario (galeria no feed).
    const anexosPorComentario = useMemo<ReadonlyMap<number, readonly AnexoCardDto[]>>(() => {
        const mapa = new Map<number, AnexoCardDto[]>();
        anexosCard.forEach(anexo => mapa.set(anexo.fkComentariosId, [...(mapa.get(anexo.fkComentariosId) ?? []), anexo]));
        return mapa;
    }, [anexosCard]);

    if (!card) {
        if (cards.carregando) return <p style={{ color: '#7c7565', padding: '1em' }}>Carregando card…</p>;
        return <p style={{ color: '#7c7565', padding: '1em' }}>Card não encontrado (pode ter sido excluído). Use o fechar do cabeçalho para voltar.</p>;
    }

    const idUsuarioLogado = usuarioLogado?.id ?? null;
    const papel: 'criador' | 'membro' | 'observador' = idUsuarioLogado === card.fkUsuariosCriacaoId ? 'criador'
        : idUsuarioLogado !== null && membros.some(membro => membro.usuarioId === idUsuarioLogado) ? 'membro'
            : 'observador';
    const motivoTrancaCard = card.motivoTranca ?? null;
    const motivoTrancaObjetivo = objetivos.registros.find(objetivo => objetivo.id === card.fkObjetivosId)?.motivoTranca ?? null;
    const trancado = motivoTrancaCard !== null || motivoTrancaObjetivo !== null;
    const podeIncluir = papel !== 'observador' && !trancado;
    const podeRemover = papel === 'criador' && !trancado;
    const podeTrancar = papel === 'criador' && motivoTrancaObjetivo === null;
    // Trancar (escolha de motivo) = SPA propria; destrancar = clique unico revertivel, direto na ficha.
    const abrirTrancarCartao = () => abrirOperacaoCard('trancar-cartao', card.id);
    const destrancar = async () => { await trancaCard(card.id, null); };

    const editarTitulo = () => abrirOperacaoCard('editar-titulo', card.id);
    const atualizarDescricao = async (descricao: string | null) => { await atualizaDescricaoCard(card.id, descricao); };
    const adicionarMembro = async (usuarioId: number) => { await adicionaMembroCard(card.id, usuarioId); };
    const abrirAplicarEtiqueta = () => abrirOperacaoCard('aplicar-etiqueta', card.id);
    const abrirAdicionarItemChecklist = () => abrirOperacaoCard('adicionar-item-checklist', card.id);
    const abrirAdicionarDependencia = () => abrirOperacaoCard('adicionar-dependencia', card.id);
    const excluir = async () => { await deletaCard(card.id); fecharCard(); };
    const comentar = async (texto: string, anexos: readonly AnexoEvidencia[] = []) => { await criaComentario(texto, anexos); };

    const tituloCard = (id: number) => todosCards.registros.find(item => item.id === id)?.titulo ?? '?';
    const cardsMencionaveis = todosCards.registros.filter(item => item.id !== card.id).map(item => ({ id: item.id, titulo: item.titulo }));
    const rotuloObjetivoDoCard = (id: number) => {
        const objetivoId = todosCards.registros.find(item => item.id === id)?.fkObjetivosId ?? null;
        if (objetivoId === null || objetivoId === card.fkObjetivosId) return null;
        return objetivos.registros.find(objetivo => objetivo.id === objetivoId)?.nome ?? 'outro objetivo';
    };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__FichaCard.Provider value={{ card, salvando, papel, podeIncluir, podeRemover, motivoTrancaCard, motivoTrancaObjetivo, podeTrancar, abrirTrancarCartao, destrancar, editarTitulo, atualizarDescricao, abrirAplicarEtiqueta, abrirAdicionarItemChecklist, abrirAdicionarDependencia, excluir, membros, adicionarMembro, removerMembro: removeMembroCard, etiquetasDoCard, removerEtiqueta: removeEtiquetaCard, feed, comentar, anexosPorComentario, totalEvidencias: anexosCard.length, checklist, marcaItemChecklist, deletaItemChecklist, requisitos, removeDependencia: deletaDependenciaCard, tituloCard, rotuloObjetivoDoCard, abrirCardPorId, cardsMencionaveis }}>
            <SPA__PaginaColaboradorPainelDoMedo__FichaCard />
        </Contexto__PaginaColaboradorPainelDoMedo__FichaCard.Provider>
    );
};
