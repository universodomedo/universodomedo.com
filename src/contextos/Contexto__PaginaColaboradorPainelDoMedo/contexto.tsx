'use client';

import { createContext, useContext, useState, useEffect, useMemo, useRef, type ReactNode } from 'react';

import { Eventos_Emite } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useRecebeEmitWs } from 'Hooks/useEventoWs';
import { criaObjetivo as apiCriaObjetivo, criaColuna as apiCriaColuna, criaCard as apiCriaCard, criaComentario as apiCriaComentario, atualizaCard as apiAtualizaCard, reordenaCards as apiReordenaCards, criaDependenciaCard as apiCriaDependencia, atualizaDependenciaCard as apiAtualizaDependencia, deletaDependenciaCard as apiDeletaDependencia, definePosicaoFluxogramaCard as apiDefinePosicao, deletaCard as apiDeletaCard, atualizaColuna as apiAtualizaColuna, deletaColuna as apiDeletaColuna, reordenaColunas as apiReordenaColunas, atualizaObjetivo as apiAtualizaObjetivo, deletaObjetivo as apiDeletaObjetivo, salvaDesenhoFluxograma as apiSalvaDesenhoFluxograma, atualizaObjetivoFicha as apiAtualizaObjetivoFicha, criaItemChecklist as apiCriaItemChecklist, marcaItemChecklist as apiMarcaItemChecklist, atualizaItemChecklist as apiAtualizaItemChecklist, deletaItemChecklist as apiDeletaItemChecklist } from 'Uteis/ApiConsumer/PainelDoMedoMiddleware';

export interface Contexto__PaginaColaboradorPainelDoMedo__Props {
    objetivos: ReturnType<typeof obtemObjetivos>;
    statusCards: ReturnType<typeof obtemStatusCards>;
    objetivoAtualId: number | null;
    setObjetivoAtualId: (id: number | null) => void;
    colunas: ReturnType<typeof obtemColunas>;
    cards: ReturnType<typeof obtemCards>;
    comentarios: ReturnType<typeof obtemComentarios>;
    cardAbertoId: number | null;
    abrirCard: (id: number) => void;
    fecharCard: () => void;
    salvando: boolean;
    criaObjetivo: (nome: string) => Promise<void>;
    criaColuna: (nome: string) => Promise<void>;
    criaCard: (fkColunasId: number, titulo: string) => Promise<void>;
    atualizaCard: (id: number, titulo: string, fkTiposStatusCardId: number, prazo: string | null) => Promise<void>;
    criaComentario: (texto: string) => Promise<void>;
    reordenaCards: (fkColunasId: number, idsOrdenados: number[]) => Promise<void>;
    pagina: 'listagemObjetivos' | 'cadastroObjetivo' | 'quadro' | 'fluxograma';
    setPagina: (pagina: 'listagemObjetivos' | 'cadastroObjetivo' | 'quadro' | 'fluxograma') => void;
    irParaObjetivo: (id: number) => void;
    irParaListagem: () => void;
    irParaCadastroObjetivo: () => void;
    dependenciasCards: ReturnType<typeof obtemDependenciasCards>;
    posicoesFluxograma: ReturnType<typeof obtemPosicoesFluxograma>;
    desenhoFluxograma: ReturnType<typeof obtemDesenhoFluxograma>;
    todosCards: ReturnType<typeof obtemTodosCards>;
    criaDependenciaCard: (fkCardsDependenteId: number, fkCardsRequisitoId: number, descricao: string | null, bloqueante: boolean) => Promise<void>;
    atualizaDependenciaCard: (id: number, descricao: string | null, bloqueante: boolean) => Promise<void>;
    deletaDependenciaCard: (id: number) => Promise<void>;
    definePosicaoFluxogramaCard: (fkCardsId: number, posicaoX: number, posicaoY: number) => Promise<void>;
    deletaCard: (id: number) => Promise<void>;
    atualizaColuna: (id: number, nome: string) => Promise<void>;
    deletaColuna: (id: number) => Promise<void>;
    reordenaColunas: (idsOrdenados: number[]) => Promise<void>;
    atualizaObjetivo: (id: number, nome: string) => Promise<void>;
    deletaObjetivo: (id: number) => Promise<void>;
    desenhoConteudo: string | null;
    registraDesenho: (conteudo: string | null) => void;
    flushDesenho: () => void;
    checklist: ReturnType<typeof obtemChecklist>;
    objetivoFichaAbertaId: number | null;
    abrirFichaObjetivo: (id: number) => void;
    fecharFichaObjetivo: () => void;
    atualizaObjetivoFicha: (id: number, descricao: string | null, fkTiposStatusCardId: number | null) => Promise<void>;
    criaItemChecklist: (texto: string) => Promise<void>;
    marcaItemChecklist: (id: number, concluido: boolean) => Promise<void>;
    atualizaItemChecklist: (id: number, texto: string) => Promise<void>;
    deletaItemChecklist: (id: number) => Promise<void>;
};

const Contexto__PaginaColaboradorPainelDoMedo = createContext<Contexto__PaginaColaboradorPainelDoMedo__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo = (): Contexto__PaginaColaboradorPainelDoMedo__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo precisa estar dentro de um Contexto__PaginaColaboradorPainelDoMedo');
    return context;
};

export const Contexto__PaginaColaboradorPainelDoMedo__Provider = ({ children }: { children: ReactNode }) => {
    const objetivos = obtemObjetivos();
    const statusCards = obtemStatusCards();
    const colunas = obtemColunas();
    const [pagina, setPagina] = useState<'listagemObjetivos' | 'cadastroObjetivo' | 'quadro' | 'fluxograma'>('listagemObjetivos');
    const [objetivoAtualId, setObjetivoAtualId] = useState<number | null>(null);
    const [cardAbertoId, setCardAbertoId] = useState<number | null>(null);
    const [objetivoFichaAbertaId, setObjetivoFichaAbertaId] = useState<number | null>(null);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [desenhoConteudo, setDesenhoConteudo] = useState<string | null>(null);
    const desenhoTimerRef = useRef<number | null>(null);
    const cards = obtemCards(objetivoAtualId);
    const comentarios = obtemComentarios(cardAbertoId);
    const dependenciasCards = obtemDependenciasCards();
    const posicoesFluxograma = obtemPosicoesFluxograma();
    const desenhoFluxograma = obtemDesenhoFluxograma(objetivoAtualId);
    const todosCards = obtemTodosCards();
    const checklist = obtemChecklist(cardAbertoId, objetivoFichaAbertaId);

    useEffect(() => {
        if (objetivoAtualId !== null) { cards.recarregar(); desenhoFluxograma.recarregar(); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objetivoAtualId]);

    useEffect(() => {
        if (cardAbertoId !== null) comentarios.recarregar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardAbertoId]);

    useEffect(() => {
        if (cardAbertoId !== null || objetivoFichaAbertaId !== null) checklist.recarregar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardAbertoId, objetivoFichaAbertaId]);

    // O conteudo do desenho vive aqui (sobrevive a navegacao entre Quadro/Fluxograma). A listagem so semeia o estado ao trocar de objetivo; salvar atualiza este estado na hora.
    const conteudoListagemDesenho = desenhoFluxograma.registros[0]?.conteudo ?? null;
    useEffect(() => {
        if (desenhoFluxograma.carregando) return;
        setDesenhoConteudo(conteudoListagemDesenho);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conteudoListagemDesenho, desenhoFluxograma.carregando]);

    useRecebeEmitWs(Eventos_Emite.PainelDoMedo.eventos.painelAtualizado, {
        onSuccess: () => {
            objetivos.recarregar();
            colunas.recarregar();
            cards.recarregar();
            dependenciasCards.recarregar();
            todosCards.recarregar();
            if (cardAbertoId !== null) comentarios.recarregar();
        },
    });

    useRecebeEmitWs(Eventos_Emite.PainelDoMedo.eventos.desenhoAtualizado, {
        onSuccess: ({ fkObjetivosId, conteudo }) => { if (fkObjetivosId === objetivoAtualId) setDesenhoConteudo(conteudo); },
    });

    const abrirCard = (id: number) => setCardAbertoId(id);
    const fecharCard = () => setCardAbertoId(null);

    const irParaObjetivo = (id: number) => { setObjetivoAtualId(id); setPagina('quadro'); };
    const irParaListagem = () => setPagina('listagemObjetivos');
    const irParaCadastroObjetivo = () => setPagina('cadastroObjetivo');

    const criaObjetivo = async (nome: string) => {
        if (!nome.trim() || salvando) return;
        setSalvando(true);
        try { await apiCriaObjetivo({ nome: nome.trim() }); objetivos.recarregar(); } finally { setSalvando(false); }
    };

    const criaColuna = async (nome: string) => {
        if (!nome.trim() || salvando) return;
        setSalvando(true);
        try { await apiCriaColuna({ nome: nome.trim() }); colunas.recarregar(); } finally { setSalvando(false); }
    };

    const criaCard = async (fkColunasId: number, titulo: string) => {
        const statusPadrao = statusCards.registros[0];
        if (!titulo.trim() || objetivoAtualId === null || !statusPadrao || salvando) return;
        setSalvando(true);
        try { await apiCriaCard({ fkObjetivosId: objetivoAtualId, fkColunasId, fkTiposStatusCardId: statusPadrao.id, titulo: titulo.trim() }); cards.recarregar(); } finally { setSalvando(false); }
    };

    const atualizaCard = async (id: number, titulo: string, fkTiposStatusCardId: number, prazo: string | null) => {
        if (!titulo.trim() || salvando) return;
        setSalvando(true);
        try { await apiAtualizaCard({ id, titulo: titulo.trim(), fkTiposStatusCardId, prazo }); cards.recarregar(); } finally { setSalvando(false); }
    };

    const criaComentario = async (texto: string) => {
        if (!texto.trim() || cardAbertoId === null || salvando) return;
        setSalvando(true);
        try { await apiCriaComentario({ fkCardsId: cardAbertoId, texto: texto.trim() }); comentarios.recarregar(); } finally { setSalvando(false); }
    };

    const reordenaCards = async (fkColunasId: number, idsOrdenados: number[]) => {
        if (idsOrdenados.length < 1 || salvando) return;
        setSalvando(true);
        try { await apiReordenaCards({ fkColunasId, idsOrdenados }); cards.recarregar(); } finally { setSalvando(false); }
    };

    const criaDependenciaCard = async (fkCardsDependenteId: number, fkCardsRequisitoId: number, descricao: string | null, bloqueante: boolean) => {
        if (fkCardsDependenteId === fkCardsRequisitoId || salvando) return;
        setSalvando(true);
        try { await apiCriaDependencia({ fkCardsDependenteId, fkCardsRequisitoId, descricao, bloqueante }); dependenciasCards.recarregar(); } finally { setSalvando(false); }
    };

    const atualizaDependenciaCard = async (id: number, descricao: string | null, bloqueante: boolean) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiAtualizaDependencia({ id, descricao, bloqueante }); dependenciasCards.recarregar(); } finally { setSalvando(false); }
    };

    const deletaDependenciaCard = async (id: number) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiDeletaDependencia({ id }); dependenciasCards.recarregar(); } finally { setSalvando(false); }
    };

    const definePosicaoFluxogramaCard = async (fkCardsId: number, posicaoX: number, posicaoY: number) => {
        try { await apiDefinePosicao({ fkCardsId, posicaoX, posicaoY }); } catch { /* posicao otimista no estado local; reconciliada no proximo carregamento do objetivo */ }
    };

    const registraDesenho = (conteudo: string | null) => {
        setDesenhoConteudo(conteudo);
        if (objetivoAtualId === null) return;
        const objetivoId = objetivoAtualId;
        if (desenhoTimerRef.current !== null) window.clearTimeout(desenhoTimerRef.current);
        desenhoTimerRef.current = window.setTimeout(() => { desenhoTimerRef.current = null; apiSalvaDesenhoFluxograma({ fkObjetivosId: objetivoId, conteudo }).catch(() => { /* reconciliado no proximo carregamento do objetivo */ }); }, 500);
    };

    const flushDesenho = () => {
        if (desenhoTimerRef.current === null || objetivoAtualId === null) return;
        window.clearTimeout(desenhoTimerRef.current); desenhoTimerRef.current = null;
        apiSalvaDesenhoFluxograma({ fkObjetivosId: objetivoAtualId, conteudo: desenhoConteudo }).catch(() => { /* reconciliado no proximo carregamento do objetivo */ });
    };

    const deletaCard = async (id: number) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiDeletaCard({ id }); if (cardAbertoId === id) setCardAbertoId(null); cards.recarregar(); dependenciasCards.recarregar(); posicoesFluxograma.recarregar(); } finally { setSalvando(false); }
    };

    const atualizaColuna = async (id: number, nome: string) => {
        if (!nome.trim() || salvando) return;
        setSalvando(true);
        try { await apiAtualizaColuna({ id, nome: nome.trim() }); colunas.recarregar(); } finally { setSalvando(false); }
    };

    const deletaColuna = async (id: number) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiDeletaColuna({ id }); colunas.recarregar(); } finally { setSalvando(false); }
    };

    const reordenaColunas = async (idsOrdenados: number[]) => {
        if (idsOrdenados.length < 1 || salvando) return;
        setSalvando(true);
        try { await apiReordenaColunas({ idsOrdenados }); colunas.recarregar(); } finally { setSalvando(false); }
    };

    const atualizaObjetivo = async (id: number, nome: string) => {
        if (!nome.trim() || salvando) return;
        setSalvando(true);
        try { await apiAtualizaObjetivo({ id, nome: nome.trim() }); objetivos.recarregar(); } finally { setSalvando(false); }
    };

    const deletaObjetivo = async (id: number) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiDeletaObjetivo({ id }); if (objetivoAtualId === id) setObjetivoAtualId(null); objetivos.recarregar(); } finally { setSalvando(false); }
    };

    const abrirFichaObjetivo = (id: number) => setObjetivoFichaAbertaId(id);
    const fecharFichaObjetivo = () => setObjetivoFichaAbertaId(null);

    const atualizaObjetivoFicha = async (id: number, descricao: string | null, fkTiposStatusCardId: number | null) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiAtualizaObjetivoFicha({ id, descricao, fkTiposStatusCardId }); objetivos.recarregar(); } finally { setSalvando(false); }
    };

    const criaItemChecklist = async (texto: string) => {
        if (!texto.trim()) return;
        const fkCardsId = cardAbertoId;
        const fkObjetivosId = cardAbertoId !== null ? null : objetivoFichaAbertaId;
        if (fkCardsId === null && fkObjetivosId === null) return;
        try { await apiCriaItemChecklist({ fkCardsId, fkObjetivosId, texto: texto.trim() }); checklist.recarregar(); } catch { /* reconciliado ao reabrir */ }
    };

    const marcaItemChecklist = async (id: number, concluido: boolean) => {
        try { await apiMarcaItemChecklist({ id, concluido }); } catch { /* otimista no componente; reconciliado ao reabrir */ }
    };

    const atualizaItemChecklist = async (id: number, texto: string) => {
        if (!texto.trim()) return;
        try { await apiAtualizaItemChecklist({ id, texto: texto.trim() }); checklist.recarregar(); } catch { /* reconciliado ao reabrir */ }
    };

    const deletaItemChecklist = async (id: number) => {
        try { await apiDeletaItemChecklist({ id }); checklist.recarregar(); } catch { /* reconciliado ao reabrir */ }
    };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo.Provider value={{ objetivos, statusCards, objetivoAtualId, setObjetivoAtualId, colunas, cards, comentarios, cardAbertoId, abrirCard, fecharCard, salvando, criaObjetivo, criaColuna, criaCard, atualizaCard, criaComentario, reordenaCards, pagina, setPagina, irParaObjetivo, irParaListagem, irParaCadastroObjetivo, dependenciasCards, posicoesFluxograma, desenhoFluxograma, todosCards, criaDependenciaCard, atualizaDependenciaCard, deletaDependenciaCard, definePosicaoFluxogramaCard, desenhoConteudo, registraDesenho, flushDesenho, deletaCard, atualizaColuna, deletaColuna, reordenaColunas, atualizaObjetivo, deletaObjetivo, checklist, objetivoFichaAbertaId, abrirFichaObjetivo, fecharFichaObjetivo, atualizaObjetivoFicha, criaItemChecklist, marcaItemChecklist, atualizaItemChecklist, deletaItemChecklist }}>
            {children}
        </Contexto__PaginaColaboradorPainelDoMedo.Provider>
    );
};

//

function obtemObjetivos() {
    return useNoraGraphQLListagem('Objetivo', {
        select: ['id', 'nome', 'descricao', 'fkTiposStatusCardId'],
        itensPorPagina: 50,
        carregando: 'Carregando objetivos',
        mensagemErro: 'Houve um erro recuperando os objetivos',
        mensagemListaVazia: 'Nenhum objetivo ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum objetivo com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemStatusCards() {
    return useNoraGraphQLListagem('TipoStatusCard', {
        select: ['id', 'nome', 'cor', 'ordem'],
        itensPorPagina: 50,
        carregando: 'Carregando status',
        mensagemErro: 'Houve um erro recuperando os status',
        mensagemListaVazia: 'Nenhum status cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum status com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemColunas() {
    return useNoraGraphQLListagem('Coluna', {
        select: ['id', 'nome', 'ordem'],
        itensPorPagina: 50,
        carregando: 'Carregando colunas',
        mensagemErro: 'Houve um erro recuperando as colunas',
        mensagemListaVazia: 'Nenhuma coluna ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma coluna com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemCards(objetivoId: number | null) {
    const whereFixo = useMemo(() => ({ fkObjetivosId: objetivoId ?? -1 }), [objetivoId]);
    return useNoraGraphQLListagem('Card', {
        select: ['id', 'fkColunasId', 'fkTiposStatusCardId', 'titulo', 'prazo', 'ordem'],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Carregando cards',
        mensagemErro: 'Houve um erro recuperando os cards',
        mensagemListaVazia: 'Nenhum card ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum card com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemComentarios(cardId: number | null) {
    const whereFixo = useMemo(() => ({ fkCardsId: cardId ?? -1 }), [cardId]);
    return useNoraGraphQLListagem('Comentario', {
        select: ['id', 'fkCardsId', 'texto', 'fkUsuariosCriacaoId', { usuarioCriacao: ['id', 'username'] }, 'dataCriacao'],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Carregando comentários',
        mensagemErro: 'Houve um erro recuperando os comentários',
        mensagemListaVazia: 'Nenhum comentário ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum comentário com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemDependenciasCards() {
    return useNoraGraphQLListagem('DependenciaCard', {
        select: ['id', 'fkCardsDependenteId', 'fkCardsRequisitoId', 'descricao', 'bloqueante'],
        itensPorPagina: 100,
        carregando: 'Carregando dependências',
        mensagemErro: 'Houve um erro recuperando as dependências',
        mensagemListaVazia: 'Nenhuma dependência ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma dependência com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemPosicoesFluxograma() {
    return useNoraGraphQLListagem('PosicaoFluxogramaCard', {
        select: ['id', 'fkCardsId', 'posicaoX', 'posicaoY'],
        itensPorPagina: 100,
        carregando: 'Carregando posições',
        mensagemErro: 'Houve um erro recuperando as posições',
        mensagemListaVazia: 'Nenhuma posição ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma posição com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemDesenhoFluxograma(objetivoId: number | null) {
    const whereFixo = useMemo(() => ({ fkObjetivosId: objetivoId ?? -1 }), [objetivoId]);
    return useNoraGraphQLListagem('DesenhoFluxograma', {
        select: ['id', 'fkObjetivosId', 'conteudo'],
        whereFixo,
        itensPorPagina: 1,
        carregando: 'Carregando desenho',
        mensagemErro: 'Houve um erro recuperando o desenho',
        mensagemListaVazia: 'Nenhum desenho ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum desenho com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemChecklist(cardId: number | null, objetivoId: number | null) {
    const whereFixo = useMemo(() => cardId !== null ? { fkCardsId: cardId } : objetivoId !== null ? { fkObjetivosId: objetivoId } : { id: -1 }, [cardId, objetivoId]);
    return useNoraGraphQLListagem('ItemChecklist', {
        select: ['id', 'fkCardsId', 'fkObjetivosId', 'texto', 'concluido', 'ordem'],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Carregando checklist',
        mensagemErro: 'Houve um erro recuperando a checklist',
        mensagemListaVazia: 'Nenhum item ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum item com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC', id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemTodosCards() {
    return useNoraGraphQLListagem('Card', {
        select: ['id', 'titulo', 'fkObjetivosId', 'fkColunasId', 'fkTiposStatusCardId'],
        itensPorPagina: 100,
        carregando: 'Carregando cards',
        mensagemErro: 'Houve um erro recuperando os cards',
        mensagemListaVazia: 'Nenhum card ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum card com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { fkObjetivosId: 'ASC', id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};
