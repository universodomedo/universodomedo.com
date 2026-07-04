'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { PAYLOAD__CriarProduto, PAYLOAD__AtualizarProduto, PAYLOAD__CriarPasse, PAYLOAD__AtualizarPasse, PAYLOAD__CriarVinculoProdutoPasse, PAYLOAD__AtualizarVinculoProdutoPasse } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { criaProduto, atualizaProduto, defineAtivoProduto, criaPasse, atualizaPasse, defineAtivoPasse, criaVinculoProdutoPasse, atualizaVinculoProdutoPasse, defineAtivoVinculoProdutoPasse } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export type SecaoCatalogo = 'produtos' | 'passes' | 'vinculos';
export type RegistroProduto = ReturnType<typeof obtemListagemProdutos>['registros'][number];
export type RegistroPasse = ReturnType<typeof obtemListagemPasses>['registros'][number];
export type RegistroVinculo = ReturnType<typeof obtemListagemVinculos>['registros'][number];

export interface Contexto__PaginaAdminCatalogoAssinatura__Props {
    secaoAtiva: SecaoCatalogo;
    setSecaoAtiva: (secao: SecaoCatalogo) => void;
    listagemProdutos: ReturnType<typeof obtemListagemProdutos>;
    listagemPasses: ReturnType<typeof obtemListagemPasses>;
    listagemVinculos: ReturnType<typeof obtemListagemVinculos>;
    produtoEmEdicao: RegistroProduto | null;
    estaEmCriacaoProduto: boolean;
    passeEmEdicao: RegistroPasse | null;
    estaEmCriacaoPasse: boolean;
    vinculoEmEdicao: RegistroVinculo | null;
    estaEmCriacaoVinculo: boolean;
    iniciarCriacaoProduto: () => void;
    editarProduto: (produto: RegistroProduto) => void;
    iniciarCriacaoPasse: () => void;
    editarPasse: (passe: RegistroPasse) => void;
    iniciarCriacaoVinculo: () => void;
    editarVinculo: (vinculo: RegistroVinculo) => void;
    cancelarFormulario: () => void;
    salvarNovoProduto: (dados: PAYLOAD__CriarProduto) => Promise<void>;
    salvarEdicaoProduto: (dados: PAYLOAD__AtualizarProduto) => Promise<void>;
    salvarNovoPasse: (dados: PAYLOAD__CriarPasse) => Promise<void>;
    salvarEdicaoPasse: (dados: PAYLOAD__AtualizarPasse) => Promise<void>;
    salvarNovoVinculo: (dados: PAYLOAD__CriarVinculoProdutoPasse) => Promise<void>;
    salvarEdicaoVinculo: (dados: PAYLOAD__AtualizarVinculoProdutoPasse) => Promise<void>;
    definirAtivoProduto: (id: number, ativo: boolean) => Promise<void>;
    definirAtivoPasse: (id: number, ativo: boolean) => Promise<void>;
    definirAtivoVinculo: (id: number, ativo: boolean) => Promise<void>;
};

const Contexto__PaginaAdminCatalogoAssinatura = createContext<Contexto__PaginaAdminCatalogoAssinatura__Props | undefined>(undefined);

export const useContexto__PaginaAdminCatalogoAssinatura = (): Contexto__PaginaAdminCatalogoAssinatura__Props => {
    const context = useContext(Contexto__PaginaAdminCatalogoAssinatura);
    if (!context) throw new Error('useContexto__PaginaAdminCatalogoAssinatura precisa estar dentro de um Contexto__PaginaAdminCatalogoAssinatura');
    return context;
};

export const Contexto__PaginaAdminCatalogoAssinatura__Provider = ({ children }: { children: React.ReactNode }) => {
    const listagemProdutos = obtemListagemProdutos();
    const listagemPasses = obtemListagemPasses();
    const listagemVinculos = obtemListagemVinculos();

    const [secaoAtiva, setSecaoAtiva] = useState<SecaoCatalogo>('produtos');
    const [produtoEmEdicao, setProdutoEmEdicao] = useState<RegistroProduto | null>(null);
    const [estaEmCriacaoProduto, setEstaEmCriacaoProduto] = useState<boolean>(false);
    const [passeEmEdicao, setPasseEmEdicao] = useState<RegistroPasse | null>(null);
    const [estaEmCriacaoPasse, setEstaEmCriacaoPasse] = useState<boolean>(false);
    const [vinculoEmEdicao, setVinculoEmEdicao] = useState<RegistroVinculo | null>(null);
    const [estaEmCriacaoVinculo, setEstaEmCriacaoVinculo] = useState<boolean>(false);

    const cancelarFormulario = useCallback(() => { setProdutoEmEdicao(null); setEstaEmCriacaoProduto(false); setPasseEmEdicao(null); setEstaEmCriacaoPasse(false); setVinculoEmEdicao(null); setEstaEmCriacaoVinculo(false); }, []);

    const iniciarCriacaoProduto = useCallback(() => { cancelarFormulario(); setEstaEmCriacaoProduto(true); }, [cancelarFormulario]);
    const editarProduto = useCallback((produto: RegistroProduto) => { cancelarFormulario(); setProdutoEmEdicao(produto); }, [cancelarFormulario]);
    const iniciarCriacaoPasse = useCallback(() => { cancelarFormulario(); setEstaEmCriacaoPasse(true); }, [cancelarFormulario]);
    const editarPasse = useCallback((passe: RegistroPasse) => { cancelarFormulario(); setPasseEmEdicao(passe); }, [cancelarFormulario]);
    const iniciarCriacaoVinculo = useCallback(() => { cancelarFormulario(); setEstaEmCriacaoVinculo(true); }, [cancelarFormulario]);
    const editarVinculo = useCallback((vinculo: RegistroVinculo) => { cancelarFormulario(); setVinculoEmEdicao(vinculo); }, [cancelarFormulario]);

    const recarregarProdutos = listagemProdutos.recarregar;
    const recarregarPasses = listagemPasses.recarregar;
    const recarregarVinculos = listagemVinculos.recarregar;

    const salvarNovoProduto = useCallback(async (dados: PAYLOAD__CriarProduto): Promise<void> => { await criaProduto(dados); recarregarProdutos(); cancelarFormulario(); }, [recarregarProdutos, cancelarFormulario]);
    const salvarEdicaoProduto = useCallback(async (dados: PAYLOAD__AtualizarProduto): Promise<void> => { await atualizaProduto(dados); recarregarProdutos(); cancelarFormulario(); }, [recarregarProdutos, cancelarFormulario]);
    const salvarNovoPasse = useCallback(async (dados: PAYLOAD__CriarPasse): Promise<void> => { await criaPasse(dados); recarregarPasses(); cancelarFormulario(); }, [recarregarPasses, cancelarFormulario]);
    const salvarEdicaoPasse = useCallback(async (dados: PAYLOAD__AtualizarPasse): Promise<void> => { await atualizaPasse(dados); recarregarPasses(); cancelarFormulario(); }, [recarregarPasses, cancelarFormulario]);
    const salvarNovoVinculo = useCallback(async (dados: PAYLOAD__CriarVinculoProdutoPasse): Promise<void> => { await criaVinculoProdutoPasse(dados); recarregarVinculos(); cancelarFormulario(); }, [recarregarVinculos, cancelarFormulario]);
    const salvarEdicaoVinculo = useCallback(async (dados: PAYLOAD__AtualizarVinculoProdutoPasse): Promise<void> => { await atualizaVinculoProdutoPasse(dados); recarregarVinculos(); cancelarFormulario(); }, [recarregarVinculos, cancelarFormulario]);
    const definirAtivoProduto = useCallback(async (id: number, ativo: boolean): Promise<void> => { await defineAtivoProduto({ id, ativo }); recarregarProdutos(); }, [recarregarProdutos]);
    const definirAtivoPasse = useCallback(async (id: number, ativo: boolean): Promise<void> => { await defineAtivoPasse({ id, ativo }); recarregarPasses(); }, [recarregarPasses]);
    const definirAtivoVinculo = useCallback(async (id: number, ativo: boolean): Promise<void> => { await defineAtivoVinculoProdutoPasse({ id, ativo }); recarregarVinculos(); }, [recarregarVinculos]);

    return (
        <Contexto__PaginaAdminCatalogoAssinatura.Provider value={{ secaoAtiva, setSecaoAtiva, listagemProdutos, listagemPasses, listagemVinculos, produtoEmEdicao, estaEmCriacaoProduto, passeEmEdicao, estaEmCriacaoPasse, vinculoEmEdicao, estaEmCriacaoVinculo, iniciarCriacaoProduto, editarProduto, iniciarCriacaoPasse, editarPasse, iniciarCriacaoVinculo, editarVinculo, cancelarFormulario, salvarNovoProduto, salvarEdicaoProduto, salvarNovoPasse, salvarEdicaoPasse, salvarNovoVinculo, salvarEdicaoVinculo, definirAtivoProduto, definirAtivoPasse, definirAtivoVinculo }}>
            {children}
        </Contexto__PaginaAdminCatalogoAssinatura.Provider>
    );
};

export function obtemListagemProdutos() {
    return useNoraGraphQLListagem('Produto', {
        select: ['id', 'codigoInterno', 'nome', 'descricao', 'ativo', 'valorCentavos'],
        camposFiltroConsulta: ['codigoInterno', 'nome'],
        camposFiltroVisualizacao: ['codigoInterno', 'nome'],
        itensPorPagina: 200,
        carregando: 'Buscando produtos',
        mensagemErro: 'Houve um erro recuperando os produtos',
        mensagemListaVazia: 'Nenhum produto cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum produto encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

export function obtemListagemPasses() {
    return useNoraGraphQLListagem('Passe', {
        select: ['id', 'codigoInterno', 'nome', 'descricao', 'ativo'],
        camposFiltroConsulta: ['codigoInterno', 'nome'],
        camposFiltroVisualizacao: ['codigoInterno', 'nome'],
        itensPorPagina: 200,
        carregando: 'Buscando passes',
        mensagemErro: 'Houve um erro recuperando os passes',
        mensagemListaVazia: 'Nenhum passe cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum passe encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

export function obtemListagemVinculos() {
    return useNoraGraphQLListagem('VinculoProdutoPasse', {
        select: ['id', 'diasDeValidade', 'ativo', { produto: ['id', 'codigoInterno', 'nome'] }, { passe: ['id', 'codigoInterno', 'nome'] }],
        itensPorPagina: 200,
        carregando: 'Buscando vínculos',
        mensagemErro: 'Houve um erro recuperando os vínculos',
        mensagemListaVazia: 'Nenhum vínculo cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum vínculo encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
