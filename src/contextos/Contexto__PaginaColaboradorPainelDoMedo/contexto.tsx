'use client';

import { createContext, useContext, useState, useEffect, useMemo, useRef, type ReactNode } from 'react';

import { Eventos_Emite, Eventos_Envia, type MotivoTranca, type AnexoCardDto, type AnexoEvidencia } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useRecebeEmitWs, eventoWs, useSocketEpoch } from 'Hooks/useEventoWs';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaObjetivo as apiCriaObjetivo, criaColuna as apiCriaColuna, criaCard as apiCriaCard, criaComentario as apiCriaComentario, atualizaCard as apiAtualizaCard, reordenaCards as apiReordenaCards, definePosicaoFluxogramaCard as apiDefinePosicao, atualizaColuna as apiAtualizaColuna, deletaColuna as apiDeletaColuna, reordenaColunas as apiReordenaColunas, atualizaObjetivo as apiAtualizaObjetivo, salvaDesenhoFluxograma as apiSalvaDesenhoFluxograma, atualizaObjetivoFicha as apiAtualizaObjetivoFicha, criaItemChecklist as apiCriaItemChecklist, marcaItemChecklist as apiMarcaItemChecklist, atualizaItemChecklist as apiAtualizaItemChecklist, deletaItemChecklist as apiDeletaItemChecklist, adicionaMembroCard as apiAdicionaMembroCard, removeMembroCard as apiRemoveMembroCard, criaEtiqueta as apiCriaEtiqueta, aplicaEtiquetaCard as apiAplicaEtiquetaCard, removeEtiquetaCard as apiRemoveEtiquetaCard, trancaCard as apiTrancaCard, trancaObjetivo as apiTrancaObjetivo, atualizaDescricaoCard as apiAtualizaDescricaoCard, listaAnexosDoCard as apiListaAnexosDoCard, concedePermissaoObjetivo as apiConcedePermissaoObjetivo, revogaPermissaoObjetivo as apiRevogaPermissaoObjetivo, transformaItemChecklistEmCard as apiTransformaItemChecklistEmCard, vinculaCardChecklist as apiVinculaCardChecklist } from 'Uteis/ApiConsumer/PainelDoMedoMiddleware';

// Sub-fluxos operacionais do card: cada tipo abre uma SPA/Conteiner/Contexto proprios (foco unico), sem mutar a ficha inline.
export type OperacaoCardTipo = 'editar-titulo' | 'aplicar-etiqueta' | 'criar-etiqueta' | 'adicionar-item-checklist' | 'vincular-card-checklist' | 'trancar-cartao';
export type OperacaoCard = { tipo: OperacaoCardTipo; cardId: number };

const ROTULO_OPERACAO_CARD: Record<OperacaoCardTipo, string> = {
    'editar-titulo': 'Editar título',
    'trancar-cartao': 'Trancar cartão',
    'aplicar-etiqueta': 'Aplicar etiqueta',
    'criar-etiqueta': 'Criar etiqueta',
    'adicionar-item-checklist': 'Adicionar item ao checklist',
    'vincular-card-checklist': 'Vincular cartão ao checklist',
};

// Sub-fluxos operacionais do OBJETIVO (mesmo molde do card): cada processo em SPA propria, acionado pela AreaBotoes do quadro.
export type OperacaoObjetivoTipo = 'editar-objetivo' | 'permissoes-objetivo';
export type OperacaoObjetivo = { tipo: OperacaoObjetivoTipo; objetivoId: number };

const ROTULO_OPERACAO_OBJETIVO: Record<OperacaoObjetivoTipo, string> = {
    'editar-objetivo': 'Editar objetivo',
    'permissoes-objetivo': 'Permissões',
};

export interface Contexto__PaginaColaboradorPainelDoMedo__Props {
    objetivos: ReturnType<typeof obtemObjetivos>;
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
    atualizaCard: (id: number, titulo: string, prazo: string | null) => Promise<void>;
    criaComentario: (texto: string, anexos?: readonly AnexoEvidencia[]) => Promise<void>;
    reordenaCards: (fkColunasId: number, idsOrdenados: number[]) => Promise<void>;
    pagina: 'listagemObjetivos' | 'cadastroObjetivo' | 'quadro' | 'fluxograma';
    setPagina: (pagina: 'listagemObjetivos' | 'cadastroObjetivo' | 'quadro' | 'fluxograma') => void;
    irParaObjetivo: (id: number) => void;
    irParaListagem: () => void;
    irParaCadastroObjetivo: () => void;
    posicoesFluxograma: ReturnType<typeof obtemPosicoesFluxograma>;
    desenhoFluxograma: ReturnType<typeof obtemDesenhoFluxograma>;
    todosCards: ReturnType<typeof obtemTodosCards>;
    definePosicaoFluxogramaCard: (fkCardsId: number, posicaoX: number, posicaoY: number) => Promise<void>;
    transmitePosicaoCardAoVivo: (fkCardsId: number, posicaoX: number, posicaoY: number) => void;
    posicoesCardsAoVivo: ReadonlyMap<number, { x: number; y: number }>;
    presencaObjetivo: readonly { id: number; username: string }[];
    transmiteCursorFluxograma: (posicaoX: number, posicaoY: number) => void;
    cursoresFluxograma: ReadonlyMap<number, { username: string; x: number; y: number }>;
    transmiteDesenhoAoVivo: (conteudo: string | null) => void;
    defineDadosNaoSalvos: (descricao: string | null) => void;
    atualizaColuna: (id: number, nome: string) => Promise<void>;
    deletaColuna: (id: number) => Promise<void>;
    reordenaColunas: (idsOrdenados: number[]) => Promise<void>;
    atualizaObjetivo: (id: number, nome: string) => Promise<void>;
    desenhoConteudo: string | null;
    registraDesenho: (conteudo: string | null) => void;
    flushDesenho: () => void;
    checklist: ReturnType<typeof obtemChecklist>;
    objetivoFichaAbertaId: number | null;
    abrirFichaObjetivo: (id: number) => void;
    fecharFichaObjetivo: () => void;
    atualizaObjetivoFicha: (id: number, descricao: string | null) => Promise<void>;
    criaItemChecklist: (texto: string) => Promise<void>;
    marcaItemChecklist: (id: number, concluido: boolean) => Promise<boolean>;
    atualizaItemChecklist: (id: number, texto: string) => Promise<void>;
    deletaItemChecklist: (id: number) => Promise<void>;
    transformaItemChecklistEmCard: (id: number) => Promise<void>;
    vinculaCardChecklist: (fkCardsId: number, fkCardsReferenciaId: number) => Promise<void>;
    membrosCards: ReturnType<typeof obtemMembrosCards>;
    etiquetas: ReturnType<typeof obtemEtiquetas>;
    etiquetasCards: ReturnType<typeof obtemEtiquetasCards>;
    eventosCards: ReturnType<typeof obtemEventosCards>;
    itensChecklistQuadro: ReturnType<typeof obtemItensChecklistQuadro>;
    adicionaMembroCard: (fkCardsId: number, fkUsuariosId: number) => Promise<void>;
    removeMembroCard: (id: number) => Promise<void>;
    criaEtiqueta: (nome: string, cor: string, corBorda: string) => Promise<void>;
    aplicaEtiquetaCard: (fkCardsId: number, fkEtiquetasId: number) => Promise<void>;
    removeEtiquetaCard: (id: number) => Promise<void>;
    atualizaDescricaoCard: (id: number, descricao: string | null) => Promise<void>;
    // Evidencias (imagens) do card aberto: nascem junto do comentario e sao PURGADAS ao trancar o card.
    anexosCard: readonly AnexoCardDto[];
    // Permissoes de "Criar Cartao" por objetivo (concedidas pelo criador do objetivo).
    permissoesObjetivos: ReturnType<typeof obtemPermissoesObjetivos>;
    concedePermissaoObjetivo: (fkObjetivosId: number, fkUsuariosId: number) => Promise<void>;
    revogaPermissaoObjetivo: (id: number) => Promise<void>;
    trancaCard: (id: number, motivo: MotivoTranca | null) => Promise<void>;
    trancaObjetivo: (id: number, motivo: MotivoTranca | null) => Promise<void>;
    abrirCardPorId: (cardId: number) => void;
    operacaoCard: OperacaoCard | null;
    abrirOperacaoCard: (tipo: OperacaoCardTipo, cardId: number) => void;
    fecharOperacaoCard: () => void;
    operacaoObjetivo: OperacaoObjetivo | null;
    abrirOperacaoObjetivo: (tipo: OperacaoObjetivoTipo, objetivoId: number) => void;
    fecharOperacaoObjetivo: () => void;
};

const Contexto__PaginaColaboradorPainelDoMedo = createContext<Contexto__PaginaColaboradorPainelDoMedo__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo = (): Contexto__PaginaColaboradorPainelDoMedo__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo precisa estar dentro de um Contexto__PaginaColaboradorPainelDoMedo');
    return context;
};

export const Contexto__PaginaColaboradorPainelDoMedo__Provider = ({ children }: { children: ReactNode }) => {
    const objetivos = obtemObjetivos();
    const colunas = obtemColunas();
    const [pagina, setPagina] = useState<'listagemObjetivos' | 'cadastroObjetivo' | 'quadro' | 'fluxograma'>('listagemObjetivos');
    const [objetivoAtualId, setObjetivoAtualId] = useState<number | null>(null);
    const [cardAbertoId, setCardAbertoId] = useState<number | null>(null);
    const [objetivoFichaAbertaId, setObjetivoFichaAbertaId] = useState<number | null>(null);
    const [cardDeepLinkPendente, setCardDeepLinkPendente] = useState<number | null>(null);
    const [operacaoCard, setOperacaoCard] = useState<OperacaoCard | null>(null);
    const [operacaoObjetivo, setOperacaoObjetivo] = useState<OperacaoObjetivo | null>(null);
    const [anexosCard, setAnexosCard] = useState<readonly AnexoCardDto[]>([]);

    // Evidencias do card aberto (REST com binario em base64, padrao Capa de Arte — fora do GraphQL para nao inflar listagens).
    const recarregaAnexosCard = async (cardId: number | null) => {
        if (cardId === null) { setAnexosCard([]); return; }
        try { setAnexosCard(await apiListaAnexosDoCard({ fkCardsId: cardId })); } catch { /* mantem o estado atual; reconciliado no proximo painelAtualizado */ }
    };
    useEffect(() => {
        void recarregaAnexosCard(cardAbertoId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardAbertoId]);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [desenhoConteudo, setDesenhoConteudo] = useState<string | null>(null);
    // Posicoes efemeras do arraste ao vivo de OUTROS clientes (cardId -> posicao); entrada limpa quando a posicao persistida chega (posicaoCardAtualizada) ou em qualquer painelAtualizado.
    const [posicoesCardsAoVivo, setPosicoesCardsAoVivo] = useState<ReadonlyMap<number, { x: number; y: number }>>(new Map());
    // Quem esta com o objetivo em exibicao aberto agora (dedup por usuario, vindo da sala de presenca do WS).
    const [presencaObjetivo, setPresencaObjetivo] = useState<readonly { id: number; username: string }[]>([]);
    // Cursores ao vivo dos OUTROS usuarios no Fluxograma do objetivo (idUsuario -> ponteiro em coordenadas de mundo); some quando o usuario sai da presenca.
    const [cursoresFluxograma, setCursoresFluxograma] = useState<ReadonlyMap<number, { username: string; x: number; y: number }>>(new Map());
    const { usuarioLogado } = useContextoAutenticacao();
    const desenhoTimerRef = useRef<number | null>(null);
    // Descricao dos rascunhos nao salvos da tela ativa (null = nada pendente); consultado pelos guards de navegacao e pelo beforeunload.
    const dadosNaoSalvosRef = useRef<string | null>(null);
    const cards = obtemCards(objetivoAtualId);
    const comentarios = obtemComentarios(cardAbertoId);
    const posicoesFluxograma = obtemPosicoesFluxograma();
    const desenhoFluxograma = obtemDesenhoFluxograma(objetivoAtualId);
    const todosCards = obtemTodosCards();
    const checklist = obtemChecklist(cardAbertoId, objetivoFichaAbertaId);
    const membrosCards = obtemMembrosCards();
    const etiquetas = obtemEtiquetas();
    const etiquetasCards = obtemEtiquetasCards();
    const permissoesObjetivos = obtemPermissoesObjetivos();
    const eventosCards = obtemEventosCards(cardAbertoId);
    const itensChecklistQuadro = obtemItensChecklistQuadro();

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
        if (cardAbertoId !== null) eventosCards.recarregar();
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
            todosCards.recarregar();
            membrosCards.recarregar();
            etiquetas.recarregar();
            etiquetasCards.recarregar();
            permissoesObjetivos.recarregar();
            itensChecklistQuadro.recarregar();
            if (cardAbertoId !== null) { comentarios.recarregar(); eventosCards.recarregar(); checklist.recarregar(); void recarregaAnexosCard(cardAbertoId); }
        },
    });

    useRecebeEmitWs(Eventos_Emite.PainelDoMedo.eventos.desenhoAtualizado, {
        onSuccess: ({ fkObjetivosId, conteudo }) => { if (fkObjetivosId === objetivoAtualId) setDesenhoConteudo(conteudo); },
    });

    // Posicao de no do Fluxograma movida por outro cliente: o payload ja traz a posicao FINAL persistida — o fantasma assume esse valor na hora (apagar antes do refetch fazia o no voltar a posicao antiga por um instante, o "flick") e a listagem e recarregada em fundo; a entrada e encerrada pelo efeito de reconciliacao quando a listagem bate.
    useRecebeEmitWs(Eventos_Emite.PainelDoMedo.eventos.posicaoCardAtualizada, {
        onSuccess: ({ fkCardsId, posicaoX, posicaoY }) => {
            setPosicoesCardsAoVivo(atual => { const mapa = new Map(atual); mapa.set(fkCardsId, { x: posicaoX, y: posicaoY }); return mapa; });
            posicoesFluxograma.recarregar();
        },
    });

    // Encerra o fantasma quando a listagem persistida ja reflete a MESMA posicao (ambos inteiros): a partir dai o posServidor assume sem salto.
    useEffect(() => {
        setPosicoesCardsAoVivo(atual => {
            if (atual.size === 0) return atual;
            let mudou = false;
            const mapa = new Map(atual);
            posicoesFluxograma.registros.forEach(registro => {
                const vivo = mapa.get(registro.fkCardsId);
                if (vivo && vivo.x === registro.posicaoX && vivo.y === registro.posicaoY) { mapa.delete(registro.fkCardsId); mudou = true; }
            });
            return mudou ? mapa : atual;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posicoesFluxograma.registros]);

    // Arraste ao vivo de outro cliente: posicao efemera do no enquanto o arraste acontece la. O proprio arrastador tambem recebe o broadcast, mas o posLocal dele vence no merge da SPA.
    useRecebeEmitWs(Eventos_Emite.PainelDoMedo.eventos.posicaoCardAoVivo, {
        onSuccess: ({ fkCardsId, posicaoX, posicaoY }) => setPosicoesCardsAoVivo(atual => { const mapa = new Map(atual); mapa.set(fkCardsId, { x: posicaoX, y: posicaoY }); return mapa; }),
    });

    // Presenca: entra na sala do objetivo em exibicao e sai ao trocar/sair. Depende do epoch do socket: rooms nao sobrevivem a reconexao, entao cada reconexao re-entra (idempotente no servidor).
    const epochSocket = useSocketEpoch();
    useEffect(() => {
        setPresencaObjetivo([]);
        setCursoresFluxograma(new Map());
        if (objetivoAtualId === null) return;
        eventoWs(Eventos_Envia.PainelDoMedo.eventos.entrarPresencaObjetivo, { fkObjetivosId: objetivoAtualId });
        return () => { eventoWs(Eventos_Envia.PainelDoMedo.eventos.sairPresencaObjetivo, {}); };
    }, [objetivoAtualId, epochSocket]);

    useRecebeEmitWs(Eventos_Emite.PainelDoMedo.eventos.presencaObjetivoAtualizada, {
        onSuccess: ({ fkObjetivosId, usuarios }) => {
            if (fkObjetivosId !== objetivoAtualId) return;
            setPresencaObjetivo(usuarios);
            // Quem saiu da presenca leva o cursor junto.
            const idsPresentes = new Set(usuarios.map(usuario => usuario.id));
            setCursoresFluxograma(atual => {
                if (atual.size === 0) return atual;
                const mapa = new Map(atual);
                let mudou = false;
                for (const idUsuario of mapa.keys()) { if (!idsPresentes.has(idUsuario)) { mapa.delete(idUsuario); mudou = true; } }
                return mudou ? mapa : atual;
            });
        },
    });

    // Cursor de outro usuario no Fluxograma deste objetivo (o proprio e ignorado — cada cliente desenha so os alheios).
    useRecebeEmitWs(Eventos_Emite.PainelDoMedo.eventos.cursorFluxogramaAtualizado, {
        onSuccess: ({ fkObjetivosId, idUsuario, username, posicaoX, posicaoY }) => {
            if (fkObjetivosId !== objetivoAtualId || idUsuario === (usuarioLogado?.id ?? null)) return;
            setCursoresFluxograma(atual => { const mapa = new Map(atual); mapa.set(idUsuario, { username, x: posicaoX, y: posicaoY }); return mapa; });
        },
    });

    // Guard de dados nao salvos: a SPA ativa registra seus rascunhos (descricao/comentario/evidencias) e QUALQUER navegacao que desmonte a tela (fechar da ficha, abrir operacao, trocar de card) pede confirmacao antes de descartar. beforeunload cobre fechar/atualizar a aba.
    const defineDadosNaoSalvos = (descricao: string | null) => { dadosNaoSalvosRef.current = descricao; };
    const confirmaDescarteDadosNaoSalvos = () => {
        if (dadosNaoSalvosRef.current === null) return true;
        const confirmado = window.confirm(`Há dados não salvos (${dadosNaoSalvosRef.current}). Deseja continuar e descartá-los?`);
        if (confirmado) dadosNaoSalvosRef.current = null;
        return confirmado;
    };
    useEffect(() => {
        const aoSairDaPagina = (evento: BeforeUnloadEvent) => { if (dadosNaoSalvosRef.current !== null) evento.preventDefault(); };
        window.addEventListener('beforeunload', aoSairDaPagina);
        return () => window.removeEventListener('beforeunload', aoSairDaPagina);
    }, []);

    const abrirCard = (id: number) => setCardAbertoId(id);
    const fecharCard = () => { if (!confirmaDescarteDadosNaoSalvos()) return; setCardAbertoId(null); setOperacaoCard(null); };
    // Sub-fluxo de operacao do card: cada acao que muda a composicao da ficha (adiciona elemento / da input) roda em SPA propria. Fechar volta para a ficha — exceto criar-etiqueta, que volta para aplicar-etiqueta (o fluxo natural: criei, agora aplico).
    const abrirOperacaoCard = (tipo: OperacaoCardTipo, cardId: number) => { if (!confirmaDescarteDadosNaoSalvos()) return; setOperacaoCard({ tipo, cardId }); };
    const fecharOperacaoCard = () => setOperacaoCard(atual => atual?.tipo === 'criar-etiqueta' ? { tipo: 'aplicar-etiqueta', cardId: atual.cardId } : null);
    const abrirOperacaoObjetivo = (tipo: OperacaoObjetivoTipo, objetivoId: number) => setOperacaoObjetivo({ tipo, objetivoId });
    const fecharOperacaoObjetivo = () => setOperacaoObjetivo(null);

    const irParaObjetivo = (id: number) => { setObjetivoAtualId(id); setPagina('quadro'); };
    const irParaListagem = () => { setPagina('listagemObjetivos'); setOperacaoObjetivo(null); };
    const irParaCadastroObjetivo = () => setPagina('cadastroObjetivo');

    // Referencia GLOBAL de card por id (mencao "#123", deep-link, notificacao): resolve o objetivo sozinho via todosCards; se a listagem ainda nao chegou, fica pendente e o efeito abaixo conclui.
    const abrirCardPorId = (cardId: number) => {
        if (!Number.isInteger(cardId) || cardId <= 0) return;
        if (cardId !== cardAbertoId && !confirmaDescarteDadosNaoSalvos()) return;
        const card = todosCards.registros.find(item => item.id === cardId);
        if (!card) { setCardDeepLinkPendente(cardId); return; }
        setObjetivoAtualId(card.fkObjetivosId);
        setPagina('quadro');
        setCardAbertoId(cardId);
    };

    useEffect(() => {
        if (cardDeepLinkPendente === null || todosCards.registros.length === 0) return;
        const card = todosCards.registros.find(item => item.id === cardDeepLinkPendente);
        setCardDeepLinkPendente(null);
        if (!card) return;
        setObjetivoAtualId(card.fkObjetivosId);
        setPagina('quadro');
        setCardAbertoId(card.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardDeepLinkPendente, todosCards.registros]);

    // Abertura de card pedida de FORA do Conteiner (RefsDeCartao em toast/Central com o Painel ja montado): router.push de query nao remonta a pagina, entao a navegacao chega por evento custom.
    useEffect(() => {
        const aoAbrirCardExterno = (evento: Event) => {
            const detalhe = (evento as CustomEvent<{ cardId: number }>).detail;
            if (detalhe && Number.isInteger(detalhe.cardId)) abrirCardPorId(detalhe.cardId);
        };
        window.addEventListener('painel-do-medo:abrir-card', aoAbrirCardExterno);
        return () => window.removeEventListener('painel-do-medo:abrir-card', aoAbrirCardExterno);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todosCards.registros]);

    // Restauracao por URL no mount (deep-link de notificacao/mencao E sobrevivencia a F5): ?card=Y abre a ficha (objetivo resolvido pelo id global); ?objetivo=X&vista=... restaura a vista.
    useEffect(() => {
        const parametros = new URLSearchParams(window.location.search);
        const cardParam = Number(parametros.get('card'));
        const objetivoParam = Number(parametros.get('objetivo'));
        const vistaParam = parametros.get('vista');
        if (Number.isInteger(objetivoParam) && objetivoParam > 0) { setObjetivoAtualId(objetivoParam); setPagina(vistaParam === 'fluxograma' ? 'fluxograma' : 'quadro'); }
        if (Number.isInteger(cardParam) && cardParam > 0) { if (Number.isInteger(objetivoParam) && objetivoParam > 0) setCardAbertoId(cardParam); else abrirCardPorId(cardParam); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // URL como reflexo do estado (F5-safe): card aberto => ?card=Y; vista de objetivo => ?objetivo=X&vista=...; listagem/cadastro => URL limpa. replaceState nao recarrega nem polui o historico.
    useEffect(() => {
        const query = cardAbertoId !== null ? `?card=${cardAbertoId}`
            : (pagina === 'quadro' || pagina === 'fluxograma') && objetivoAtualId !== null ? `?objetivo=${objetivoAtualId}&vista=${pagina}`
                : '';
        window.history.replaceState(null, '', `${window.location.pathname}${query}`);
    }, [pagina, objetivoAtualId, cardAbertoId]);

    // Dono unico do layout contextual: o Controlador de Fluxo dirige subtitulo+fecharProps por `pagina`/`cardAbertoId` (o hook nao restaura no unmount; subfluxos nao chamam o hook).
    const nomeObjetivoAtual = objetivos.registros.find(objetivo => objetivo.id === objetivoAtualId)?.nome ?? '';
    const tituloCardAberto = cardAbertoId !== null ? cards.registros.find(card => card.id === cardAbertoId)?.titulo ?? '' : '';
    const fecharParaListagem = { tipo: 'acao' as const, executar: irParaListagem, tituloTooltip: 'Voltar para os objetivos' };
    const fecharFichaCard = { tipo: 'acao' as const, executar: fecharCard, tituloTooltip: 'Voltar para a vista anterior' };
    const fecharOperacaoDoCard = { tipo: 'acao' as const, executar: fecharOperacaoCard, tituloTooltip: 'Voltar' };
    const fecharOperacaoDoObjetivo = { tipo: 'acao' as const, executar: fecharOperacaoObjetivo, tituloTooltip: 'Voltar para o quadro' };
    useConfigurarLayoutContextualizado(
        operacaoCard !== null ? { subtitulo: `${ROTULO_OPERACAO_CARD[operacaoCard.tipo]} · ${tituloCardAberto}`, fecharProps: fecharOperacaoDoCard }
            : cardAbertoId !== null ? { subtitulo: `${nomeObjetivoAtual} · ${tituloCardAberto}`, fecharProps: fecharFichaCard }
            : operacaoObjetivo !== null ? { subtitulo: `${ROTULO_OPERACAO_OBJETIVO[operacaoObjetivo.tipo]} · ${nomeObjetivoAtual}`, fecharProps: fecharOperacaoDoObjetivo }
            : pagina === 'cadastroObjetivo' ? { subtitulo: 'Novo Objetivo', fecharProps: fecharParaListagem }
                : pagina === 'quadro' ? { subtitulo: `Quadro · ${nomeObjetivoAtual}`, fecharProps: fecharParaListagem }
                    : pagina === 'fluxograma' ? { subtitulo: `Fluxograma · ${nomeObjetivoAtual}`, fecharProps: fecharParaListagem }
                        : { subtitulo: undefined, fecharProps: undefined },
    );

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
        if (!titulo.trim() || objetivoAtualId === null || salvando) return;
        setSalvando(true);
        try { await apiCriaCard({ fkObjetivosId: objetivoAtualId, fkColunasId, titulo: titulo.trim() }); cards.recarregar(); } finally { setSalvando(false); }
    };

    const atualizaCard = async (id: number, titulo: string, prazo: string | null) => {
        if (!titulo.trim() || salvando) return;
        setSalvando(true);
        try { await apiAtualizaCard({ id, titulo: titulo.trim(), prazo }); cards.recarregar(); } finally { setSalvando(false); }
    };

    const criaComentario = async (texto: string, anexos: readonly AnexoEvidencia[] = []) => {
        if ((!texto.trim() && anexos.length === 0) || cardAbertoId === null || salvando) return;
        setSalvando(true);
        try { await apiCriaComentario({ fkCardsId: cardAbertoId, texto: texto.trim(), anexos }); comentarios.recarregar(); await recarregaAnexosCard(cardAbertoId); } finally { setSalvando(false); }
    };

    const reordenaCards = async (fkColunasId: number, idsOrdenados: number[]) => {
        if (idsOrdenados.length < 1 || salvando) return;
        setSalvando(true);
        try { await apiReordenaCards({ fkColunasId, idsOrdenados }); cards.recarregar(); } finally { setSalvando(false); }
    };

    const definePosicaoFluxogramaCard = async (fkCardsId: number, posicaoX: number, posicaoY: number) => {
        try { await apiDefinePosicao({ fkCardsId, posicaoX, posicaoY }); } catch { /* posicao otimista no estado local; reconciliada no proximo carregamento do objetivo */ }
    };

    // Arraste ao vivo (efemero): transmitido DURANTE o arraste (throttle na SPA); nada persiste — o commit e o definePosicao no soltar.
    const transmitePosicaoCardAoVivo = (fkCardsId: number, posicaoX: number, posicaoY: number) => eventoWs(Eventos_Envia.PainelDoMedo.eventos.moverCardAoVivo, { fkCardsId, posicaoX, posicaoY });

    // Cursor ao vivo (efemero, coordenadas de mundo do canvas): transmitido no mousemove do Fluxograma (throttle na SPA).
    const transmiteCursorFluxograma = (posicaoX: number, posicaoY: number) => { if (objetivoAtualId === null) return; eventoWs(Eventos_Envia.PainelDoMedo.eventos.moverCursorFluxograma, { fkObjetivosId: objetivoAtualId, posicaoX, posicaoY }); };

    // Desenho ao vivo (efemero): conteudo transmitido DURANTE criar/mover/redimensionar/digitar (throttle na SPA); o servidor reemite como desenhoAtualizado pra sala do objetivo. O commit continua no salvar debounced.
    const transmiteDesenhoAoVivo = (conteudo: string | null) => { if (objetivoAtualId === null) return; eventoWs(Eventos_Envia.PainelDoMedo.eventos.moverDesenhoAoVivo, { fkObjetivosId: objetivoAtualId, conteudo }); };

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

    const abrirFichaObjetivo = (id: number) => setObjetivoFichaAbertaId(id);
    const fecharFichaObjetivo = () => setObjetivoFichaAbertaId(null);

    const atualizaObjetivoFicha = async (id: number, descricao: string | null) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiAtualizaObjetivoFicha({ id, descricao }); objetivos.recarregar(); } finally { setSalvando(false); }
    };

    const criaItemChecklist = async (texto: string) => {
        if (!texto.trim()) return;
        const fkCardsId = cardAbertoId;
        const fkObjetivosId = cardAbertoId !== null ? null : objetivoFichaAbertaId;
        if (fkCardsId === null && fkObjetivosId === null) return;
        try { await apiCriaItemChecklist({ fkCardsId, fkObjetivosId, texto: texto.trim() }); checklist.recarregar(); } catch { /* reconciliado ao reabrir */ }
    };

    // Devolve sucesso: o componente aplica o check otimista e REVERTE quando false (bloqueio de processo ou erro da API) — o visual nunca pode divergir do banco.
    const marcaItemChecklist = async (id: number, concluido: boolean): Promise<boolean> => {
        try { await apiMarcaItemChecklist({ id, concluido }); return true; } catch { return false; }
    };

    const atualizaItemChecklist = async (id: number, texto: string) => {
        if (!texto.trim()) return;
        try { await apiAtualizaItemChecklist({ id, texto: texto.trim() }); checklist.recarregar(); } catch { /* reconciliado ao reabrir */ }
    };

    const deletaItemChecklist = async (id: number) => {
        try { await apiDeletaItemChecklist({ id }); checklist.recarregar(); } catch { /* reconciliado ao reabrir */ }
    };

    const transformaItemChecklistEmCard = async (id: number) => {
        try { await apiTransformaItemChecklistEmCard({ id }); checklist.recarregar(); cards.recarregar(); todosCards.recarregar(); if (cardAbertoId !== null) eventosCards.recarregar(); } catch { /* reconciliado no proximo painelAtualizado */ }
    };

    const vinculaCardChecklist = async (fkCardsId: number, fkCardsReferenciaId: number) => {
        try { await apiVinculaCardChecklist({ fkCardsId, fkCardsReferenciaId }); checklist.recarregar(); if (cardAbertoId !== null) eventosCards.recarregar(); } catch { /* reconciliado no proximo painelAtualizado */ }
    };

    const adicionaMembroCard = async (fkCardsId: number, fkUsuariosId: number) => {
        try { await apiAdicionaMembroCard({ fkCardsId, fkUsuariosId }); membrosCards.recarregar(); if (cardAbertoId !== null) eventosCards.recarregar(); } catch { /* reconciliado no proximo painelAtualizado */ }
    };

    const removeMembroCard = async (id: number) => {
        try { await apiRemoveMembroCard({ id }); membrosCards.recarregar(); if (cardAbertoId !== null) eventosCards.recarregar(); } catch { /* reconciliado no proximo painelAtualizado */ }
    };

    const concedePermissaoObjetivo = async (fkObjetivosId: number, fkUsuariosId: number) => {
        try { await apiConcedePermissaoObjetivo({ fkObjetivosId, fkUsuariosId }); permissoesObjetivos.recarregar(); } catch { /* reconciliado no proximo painelAtualizado */ }
    };

    const revogaPermissaoObjetivo = async (id: number) => {
        try { await apiRevogaPermissaoObjetivo({ id }); permissoesObjetivos.recarregar(); } catch { /* reconciliado no proximo painelAtualizado */ }
    };

    const atualizaDescricaoCard = async (id: number, descricao: string | null) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiAtualizaDescricaoCard({ id, descricao }); cards.recarregar(); if (cardAbertoId !== null) eventosCards.recarregar(); } finally { setSalvando(false); }
    };

    const trancaCard = async (id: number, motivo: MotivoTranca | null) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiTrancaCard({ id, motivo }); cards.recarregar(); todosCards.recarregar(); if (cardAbertoId !== null) { eventosCards.recarregar(); await recarregaAnexosCard(cardAbertoId); } } finally { setSalvando(false); }
    };

    const trancaObjetivo = async (id: number, motivo: MotivoTranca | null) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiTrancaObjetivo({ id, motivo }); objetivos.recarregar(); } finally { setSalvando(false); }
    };

    const criaEtiqueta = async (nome: string, cor: string, corBorda: string) => {
        if (!nome.trim()) return;
        try { await apiCriaEtiqueta({ nome: nome.trim(), cor, corBorda }); etiquetas.recarregar(); } catch { /* reconciliado no proximo painelAtualizado */ }
    };

    const aplicaEtiquetaCard = async (fkCardsId: number, fkEtiquetasId: number) => {
        try { await apiAplicaEtiquetaCard({ fkCardsId, fkEtiquetasId }); etiquetasCards.recarregar(); if (cardAbertoId !== null) eventosCards.recarregar(); } catch { /* reconciliado no proximo painelAtualizado */ }
    };

    const removeEtiquetaCard = async (id: number) => {
        try { await apiRemoveEtiquetaCard({ id }); etiquetasCards.recarregar(); if (cardAbertoId !== null) eventosCards.recarregar(); } catch { /* reconciliado no proximo painelAtualizado */ }
    };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo.Provider value={{ objetivos, objetivoAtualId, setObjetivoAtualId, colunas, cards, comentarios, cardAbertoId, abrirCard, fecharCard, salvando, criaObjetivo, criaColuna, criaCard, atualizaCard, criaComentario, reordenaCards, pagina, setPagina, irParaObjetivo, irParaListagem, irParaCadastroObjetivo, posicoesFluxograma, desenhoFluxograma, todosCards, definePosicaoFluxogramaCard, transmitePosicaoCardAoVivo, posicoesCardsAoVivo, presencaObjetivo, transmiteCursorFluxograma, cursoresFluxograma, transmiteDesenhoAoVivo, defineDadosNaoSalvos, desenhoConteudo, registraDesenho, flushDesenho, atualizaColuna, deletaColuna, reordenaColunas, atualizaObjetivo, checklist, objetivoFichaAbertaId, abrirFichaObjetivo, fecharFichaObjetivo, atualizaObjetivoFicha, criaItemChecklist, marcaItemChecklist, atualizaItemChecklist, deletaItemChecklist, transformaItemChecklistEmCard, vinculaCardChecklist, membrosCards, etiquetas, etiquetasCards, eventosCards, itensChecklistQuadro, adicionaMembroCard, removeMembroCard, criaEtiqueta, aplicaEtiquetaCard, removeEtiquetaCard, atualizaDescricaoCard, anexosCard, permissoesObjetivos, concedePermissaoObjetivo, revogaPermissaoObjetivo, trancaCard, trancaObjetivo, abrirCardPorId, operacaoCard, abrirOperacaoCard, fecharOperacaoCard, operacaoObjetivo, abrirOperacaoObjetivo, fecharOperacaoObjetivo }}>
            {children}
        </Contexto__PaginaColaboradorPainelDoMedo.Provider>
    );
};

//

function obtemObjetivos() {
    return useNoraGraphQLListagem('Objetivo', {
        select: ['id', 'nome', 'descricao', 'motivoTranca', 'fkUsuariosCriacaoId', { usuarioCriacao: ['id', 'username'] }],
        itensPorPagina: 50,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
        carregando: 'Carregando objetivos',
        mensagemErro: 'Houve um erro recuperando os objetivos',
        mensagemListaVazia: 'Nenhum objetivo ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum objetivo com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemColunas() {
    return useNoraGraphQLListagem('Coluna', {
        select: ['id', 'nome', 'ordem'],
        itensPorPagina: 50,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
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
        select: ['id', 'fkColunasId', 'titulo', 'descricao', 'prazo', 'ordem', 'motivoTranca', 'fkUsuariosCriacaoId', { usuarioCriacao: ['id', 'username'] }],
        whereFixo,
        itensPorPagina: 100,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
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
        carregamento: 'BARRA',
        recarregamentoSuave: true,
        carregando: 'Carregando comentários',
        mensagemErro: 'Houve um erro recuperando os comentários',
        mensagemListaVazia: 'Nenhum comentário ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum comentário com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemPosicoesFluxograma() {
    return useNoraGraphQLListagem('PosicaoFluxogramaCard', {
        select: ['id', 'fkCardsId', 'posicaoX', 'posicaoY'],
        itensPorPagina: 100,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
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
        carregamento: 'BARRA',
        recarregamentoSuave: true,
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
        select: ['id', 'fkCardsId', 'fkObjetivosId', 'fkCardsReferenciaId', 'texto', 'concluido', 'ordem'],
        whereFixo,
        itensPorPagina: 100,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
        carregando: 'Carregando checklist',
        mensagemErro: 'Houve um erro recuperando a checklist',
        mensagemListaVazia: 'Nenhum item ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum item com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC', id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemMembrosCards() {
    return useNoraGraphQLListagem('MembroCard', {
        select: ['id', 'fkCardsId', 'fkUsuariosId', { usuario: ['id', 'username'] }],
        itensPorPagina: 100,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
        carregando: 'Carregando membros',
        mensagemErro: 'Houve um erro recuperando os membros',
        mensagemListaVazia: 'Nenhum membro ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum membro com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemPermissoesObjetivos() {
    return useNoraGraphQLListagem('PermissaoObjetivo', {
        select: ['id', 'fkObjetivosId', 'fkUsuariosId', { usuario: ['id', 'username'] }],
        itensPorPagina: 100,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
        carregando: 'Carregando permissões',
        mensagemErro: 'Houve um erro recuperando as permissões',
        mensagemListaVazia: 'Nenhuma permissão concedida.',
        mensagemListaVaziaComFiltro: 'Nenhuma permissão com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemEtiquetas() {
    return useNoraGraphQLListagem('Etiqueta', {
        select: ['id', 'nome', 'cor', 'corBorda'],
        itensPorPagina: 100,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
        carregando: 'Carregando etiquetas',
        mensagemErro: 'Houve um erro recuperando as etiquetas',
        mensagemListaVazia: 'Nenhuma etiqueta ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma etiqueta com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemEtiquetasCards() {
    return useNoraGraphQLListagem('EtiquetaCard', {
        select: ['id', 'fkCardsId', 'fkEtiquetasId'],
        itensPorPagina: 100,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
        carregando: 'Carregando etiquetas dos cards',
        mensagemErro: 'Houve um erro recuperando as etiquetas dos cards',
        mensagemListaVazia: 'Nenhuma etiqueta aplicada.',
        mensagemListaVaziaComFiltro: 'Nenhuma etiqueta com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemEventosCards(cardId: number | null) {
    const whereFixo = useMemo(() => ({ fkCardsId: cardId ?? -1 }), [cardId]);
    return useNoraGraphQLListagem('EventoCard', {
        select: ['id', 'fkCardsId', 'texto', { usuario: ['id', 'username'] }, 'dataCriacao'],
        whereFixo,
        itensPorPagina: 100,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
        carregando: 'Carregando atividade',
        mensagemErro: 'Houve um erro recuperando a atividade',
        mensagemListaVazia: 'Nenhuma atividade ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma atividade com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'DESC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemItensChecklistQuadro() {
    return useNoraGraphQLListagem('ItemChecklist', {
        select: ['id', 'fkCardsId', 'fkCardsReferenciaId', 'concluido'],
        itensPorPagina: 100,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
        carregando: 'Carregando checklists',
        mensagemErro: 'Houve um erro recuperando as checklists',
        mensagemListaVazia: 'Nenhum item ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum item com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemTodosCards() {
    return useNoraGraphQLListagem('Card', {
        select: ['id', 'titulo', 'fkObjetivosId', 'fkColunasId', 'motivoTranca'],
        itensPorPagina: 100,
        carregamento: 'BARRA',
        recarregamentoSuave: true,
        carregando: 'Carregando cards',
        mensagemErro: 'Houve um erro recuperando os cards',
        mensagemListaVazia: 'Nenhum card ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum card com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { fkObjetivosId: 'ASC', id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};
