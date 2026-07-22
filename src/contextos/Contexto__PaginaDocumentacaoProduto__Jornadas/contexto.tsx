'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { adicionaJornadaPasso, moveJornadaPasso, removeJornadaPasso } from 'Uteis/ApiConsumer/DocumentacaoProdutoMiddleware';
import type { Contexto__PaginaDocumentacaoProduto__Props, RegistroJornada, RegistroPaginaParaDocumentar } from '../Contexto__PaginaDocumentacaoProduto/contexto';
import SPA__PaginaDocumentacaoProduto__Jornadas from 'Conteineres/PaginaDocumentacaoProduto/paginas/SPA__PaginaDocumentacaoProduto__Jornadas/SPA__PaginaDocumentacaoProduto__Jornadas';

export type RegistroJornadaPasso = ReturnType<typeof obtemListagemPassosTodos>['registros'][number];

export type FormJornada = { idEmEdicao: number | null; fkPersonasId: number | null; titulo: string; descricao: string };

const FORM_JORNADA_INICIAL: FormJornada = { idEmEdicao: null, fkPersonasId: null, titulo: '', descricao: '' };

export interface Contexto__PaginaDocumentacaoProduto__Jornadas__Props {
    listagemJornadas: Contexto__PaginaDocumentacaoProduto__Props['listagemJornadas'];
    listagemPersonas: Contexto__PaginaDocumentacaoProduto__Props['listagemPersonas'];
    jornadaSelecionada: RegistroJornada | null;
    passosDaSelecionada: RegistroJornadaPasso[];
    completudePorJornada: (idJornada: number) => { documentadas: number; total: number };
    estaDocumentada: (idPagina: number) => boolean;
    nomePersonaPorId: (idPersona: number) => string;
    paginaPorId: (idPagina: number) => RegistroPaginaParaDocumentar | null;
    paginasParaPasso: readonly RegistroPaginaParaDocumentar[];
    abrirVerbeteDaPagina: (idPagina: number) => void;
    selecionarJornada: (jornada: RegistroJornada) => void;
    formJornada: FormJornada;
    salvandoJornada: boolean;
    erroJornada: string | null;
    podeSalvarJornada: boolean;
    setCampoJornada: <K extends keyof FormJornada>(campo: K, valor: FormJornada[K]) => void;
    editarJornada: (jornada: RegistroJornada) => void;
    limparFormJornada: () => void;
    salvarJornada: () => Promise<void>;
    adicionarPasso: (fkPaginasNavegacaoId: number, nota: string | null) => Promise<void>;
    removerPasso: (idPasso: number) => Promise<void>;
    moverPasso: (idPasso: number, direcao: 'subir' | 'descer') => Promise<void>;
};

type PropsProvider = Pick<Contexto__PaginaDocumentacaoProduto__Props, 'listagemJornadas' | 'listagemPersonas' | 'listagemPaginas' | 'estaDocumentada' | 'selecionarPagina' | 'criarJornada' | 'atualizarJornada'> & { fecharJornadas: () => void };

const Contexto__PaginaDocumentacaoProduto__Jornadas = createContext<Contexto__PaginaDocumentacaoProduto__Jornadas__Props | undefined>(undefined);

export const useContexto__PaginaDocumentacaoProduto__Jornadas = (): Contexto__PaginaDocumentacaoProduto__Jornadas__Props => {
    const context = useContext(Contexto__PaginaDocumentacaoProduto__Jornadas);
    if (!context) throw new Error('useContexto__PaginaDocumentacaoProduto__Jornadas precisa estar dentro de um Contexto__PaginaDocumentacaoProduto__Jornadas');
    return context;
};

export const Contexto__PaginaDocumentacaoProduto__Jornadas__Provider = ({ listagemJornadas, listagemPersonas, listagemPaginas, estaDocumentada, selecionarPagina, criarJornada, atualizarJornada, fecharJornadas }: PropsProvider) => {
    const listagemPassosTodos = obtemListagemPassosTodos();
    const [jornadaSelecionadaId, setJornadaSelecionadaId] = useState<number | null>(null);
    const [formJornada, setFormJornada] = useState<FormJornada>(FORM_JORNADA_INICIAL);
    const [salvandoJornada, setSalvandoJornada] = useState<boolean>(false);
    const [erroJornada, setErroJornada] = useState<string | null>(null);

    // Navegação contextual: título estável (da PÁGINA); subtítulo identifica as jornadas; o X volta pra listagem. Sem botão Voltar no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: 'Jornadas',
        fecharProps: { tipo: 'acao', executar: fecharJornadas, tituloTooltip: 'Voltar para a listagem' },
    });

    const jornadaSelecionada = useMemo(() => listagemJornadas.registros.find(jornada => jornada.id === jornadaSelecionadaId) ?? null, [listagemJornadas.registros, jornadaSelecionadaId]);
    const passosDaSelecionada = useMemo(() => listagemPassosTodos.registros.filter(passo => passo.fkJornadasId === jornadaSelecionadaId).sort((a, b) => a.ordem - b.ordem), [listagemPassosTodos.registros, jornadaSelecionadaId]);

    const completudePorJornada = useCallback((idJornada: number) => {
        const passos = listagemPassosTodos.registros.filter(passo => passo.fkJornadasId === idJornada);
        return { documentadas: passos.filter(passo => estaDocumentada(passo.fkPaginasNavegacaoId)).length, total: passos.length };
    }, [listagemPassosTodos.registros, estaDocumentada]);

    const nomePersonaPorId = useCallback((idPersona: number): string => listagemPersonas.registros.find(persona => persona.id === idPersona)?.nome ?? `Persona #${idPersona}`, [listagemPersonas.registros]);
    const paginaPorId = useCallback((idPagina: number): RegistroPaginaParaDocumentar | null => listagemPaginas.registros.find(pagina => pagina.id === idPagina) ?? null, [listagemPaginas.registros]);
    const abrirVerbeteDaPagina = useCallback((idPagina: number) => { const registro = paginaPorId(idPagina); if (registro) selecionarPagina(registro); }, [paginaPorId, selecionarPagina]);

    const selecionarJornada = useCallback((jornada: RegistroJornada) => setJornadaSelecionadaId(jornada.id), []);
    const setCampoJornada = useCallback(<K extends keyof FormJornada>(campo: K, valor: FormJornada[K]) => setFormJornada(f => ({ ...f, [campo]: valor })), []);
    const editarJornada = useCallback((jornada: RegistroJornada) => setFormJornada({ idEmEdicao: jornada.id, fkPersonasId: jornada.fkPersonasId, titulo: jornada.titulo, descricao: jornada.descricao ?? '' }), []);
    const limparFormJornada = useCallback(() => setFormJornada(FORM_JORNADA_INICIAL), []);

    const podeSalvarJornada = formJornada.titulo.trim().length > 0 && formJornada.fkPersonasId !== null && !salvandoJornada;

    const salvarJornada = useCallback(async (): Promise<void> => {
        if (formJornada.fkPersonasId === null) return;
        setSalvandoJornada(true);
        setErroJornada(null);
        try {
            const descricao = formJornada.descricao.trim().length > 0 ? formJornada.descricao.trim() : null;
            if (formJornada.idEmEdicao === null) await criarJornada(formJornada.fkPersonasId, formJornada.titulo.trim(), descricao);
            else await atualizarJornada(formJornada.idEmEdicao, formJornada.titulo.trim(), descricao);
            setFormJornada(FORM_JORNADA_INICIAL);
        } catch (capturado) {
            setErroJornada(capturado instanceof Error ? capturado.message : 'Não foi possível salvar a jornada.');
        } finally {
            setSalvandoJornada(false);
        }
    }, [formJornada, criarJornada, atualizarJornada]);

    const recarregarPassos = listagemPassosTodos.recarregar;
    const adicionarPasso = useCallback(async (fkPaginasNavegacaoId: number, nota: string | null): Promise<void> => {
        if (jornadaSelecionadaId === null) return;
        await adicionaJornadaPasso({ fkJornadasId: jornadaSelecionadaId, fkPaginasNavegacaoId, nota });
        recarregarPassos();
    }, [jornadaSelecionadaId, recarregarPassos]);
    const removerPasso = useCallback(async (idPasso: number): Promise<void> => { await removeJornadaPasso({ id: idPasso }); recarregarPassos(); }, [recarregarPassos]);
    const moverPasso = useCallback(async (idPasso: number, direcao: 'subir' | 'descer'): Promise<void> => { await moveJornadaPasso({ id: idPasso, direcao }); recarregarPassos(); }, [recarregarPassos]);

    return (
        <Contexto__PaginaDocumentacaoProduto__Jornadas.Provider value={{ listagemJornadas, listagemPersonas, jornadaSelecionada, passosDaSelecionada, completudePorJornada, estaDocumentada, nomePersonaPorId, paginaPorId, paginasParaPasso: listagemPaginas.registros, abrirVerbeteDaPagina, selecionarJornada, formJornada, salvandoJornada, erroJornada, podeSalvarJornada, setCampoJornada, editarJornada, limparFormJornada, salvarJornada, adicionarPasso, removerPasso, moverPasso }}>
            <SPA__PaginaDocumentacaoProduto__Jornadas />
        </Contexto__PaginaDocumentacaoProduto__Jornadas.Provider>
    );
};

//

// Todos os passos de todas as jornadas (suporte): o detalhe filtra client-side e a completude por jornada deriva daqui.
function obtemListagemPassosTodos() {
    return useNoraGraphQLListagem('JornadaPasso', {
        select: ['id', 'fkJornadasId', 'fkPaginasNavegacaoId', 'nota', 'ordem'],
        itensPorPagina: 1000,
        carregando: 'Buscando passos',
        mensagemErro: 'Houve um erro recuperando os passos das jornadas',
        mensagemListaVazia: 'Nenhum passo registrado.',
        mensagemListaVaziaComFiltro: 'Nenhum passo encontrado.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};