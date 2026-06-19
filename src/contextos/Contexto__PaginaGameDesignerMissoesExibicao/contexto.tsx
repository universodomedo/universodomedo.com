'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type FluxoPaginaGameDesignerMissoesExibicao = 'LISTAGEM' | 'EDITOR';
type RegistroMissao = ReturnType<typeof useListagemMissoes>['registros'][number];
type RegistroMissaoDetalhe = ReturnType<typeof useListagemMissoesDetalhes>['registros'][number];
type RegistroMissaoExibicao = ReturnType<typeof useListagemMissoesExibicao>['registros'][number];

export interface Contexto__PaginaGameDesignerMissoesExibicao__Props {
    estadoFluxo: FluxoPaginaGameDesignerMissoesExibicao;
    missaoSelecionada: RegistroMissao | null;
    detalheSelecionado: RegistroMissaoDetalhe | null;
    exibicaoSelecionada: RegistroMissaoExibicao | null;
    listagemMissoes: ReturnType<typeof useListagemMissoes>;
    listagemMissoesDetalhes: ReturnType<typeof useListagemMissoesDetalhes>;
    listagemMissoesExibicao: ReturnType<typeof useListagemMissoesExibicao>;
    listagemCatalogosMissao: ReturnType<typeof useListagemCatalogosMissao>;
    iniciaConfiguracao: (missao: RegistroMissao, detalhe: RegistroMissaoDetalhe | null, exibicao: RegistroMissaoExibicao | null) => void;
    voltarParaListagem: () => void;
    concluiSalvamento: () => void;
};

const Contexto__PaginaGameDesignerMissoesExibicao = createContext<Contexto__PaginaGameDesignerMissoesExibicao__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerMissoesExibicao = (): Contexto__PaginaGameDesignerMissoesExibicao__Props => {
    const context = useContext(Contexto__PaginaGameDesignerMissoesExibicao);
    if (!context) throw new Error('useContexto__PaginaGameDesignerMissoesExibicao precisa estar dentro de um Contexto__PaginaGameDesignerMissoesExibicao');
    return context;
};

export const Contexto__PaginaGameDesignerMissoesExibicao__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemMissoes = useListagemMissoes();
    const listagemMissoesDetalhes = useListagemMissoesDetalhes();
    const listagemMissoesExibicao = useListagemMissoesExibicao();
    const listagemCatalogosMissao = useListagemCatalogosMissao();
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoPaginaGameDesignerMissoesExibicao>('LISTAGEM');
    const [missaoSelecionada, setMissaoSelecionada] = useState<RegistroMissao | null>(null);
    const [detalheSelecionado, setDetalheSelecionado] = useState<RegistroMissaoDetalhe | null>(null);
    const [exibicaoSelecionada, setExibicaoSelecionada] = useState<RegistroMissaoExibicao | null>(null);
    const recarregarMissoes = listagemMissoes.recarregar;
    const recarregarMissoesDetalhes = listagemMissoesDetalhes.recarregar;
    const recarregarMissoesExibicao = listagemMissoesExibicao.recarregar;
    const recarregarCatalogosMissao = listagemCatalogosMissao.recarregar;

    const iniciaConfiguracao = useCallback((missao: RegistroMissao, detalhe: RegistroMissaoDetalhe | null, exibicao: RegistroMissaoExibicao | null) => { setMissaoSelecionada(missao); setDetalheSelecionado(detalhe); setExibicaoSelecionada(exibicao); setEstadoFluxo('EDITOR'); }, []);
    const voltarParaListagem = useCallback(() => { setMissaoSelecionada(null); setDetalheSelecionado(null); setExibicaoSelecionada(null); setEstadoFluxo('LISTAGEM'); }, []);
    const concluiSalvamento = useCallback(() => { recarregarMissoes(); recarregarMissoesDetalhes(); recarregarMissoesExibicao(); recarregarCatalogosMissao(); setMissaoSelecionada(null); setDetalheSelecionado(null); setExibicaoSelecionada(null); setEstadoFluxo('LISTAGEM'); }, [recarregarMissoes, recarregarMissoesDetalhes, recarregarMissoesExibicao, recarregarCatalogosMissao]);

    return (
        <Contexto__PaginaGameDesignerMissoesExibicao.Provider value={{ estadoFluxo, missaoSelecionada, detalheSelecionado, exibicaoSelecionada, listagemMissoes, listagemMissoesDetalhes, listagemMissoesExibicao, listagemCatalogosMissao, iniciaConfiguracao, voltarParaListagem, concluiSalvamento }}>
            {children}
        </Contexto__PaginaGameDesignerMissoesExibicao.Provider>
    );
};

function useListagemMissoes() {
    return useNoraGraphQLListagem('Missao', {
        select: ['id', 'dataCriacao'],
        itensPorPagina: 20,
        carregando: 'Buscando Missões',
        mensagemErro: 'Houve um erro recuperando as Missões',
        mensagemListaVazia: 'Nenhuma Missão cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma Missão encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

function useListagemMissoesDetalhes() {
    return useNoraGraphQLListagem('MissaoDetalhe', {
        select: ['fkMissoesId', 'nome', 'descricao'],
        itensPorPagina: 200,
        carregando: 'Buscando detalhes de Missões',
        mensagemErro: 'Houve um erro recuperando os detalhes de Missões',
        mensagemListaVazia: 'Nenhum detalhe de Missão cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum detalhe de Missão encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { fkMissoesId: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

function useListagemMissoesExibicao() {
    return useNoraGraphQLListagem('MissaoExibicao', {
        select: ['fkMissoesId', 'fkCatalogosMissaoId', 'ativo', 'ordem', 'dataAtualizacao'],
        itensPorPagina: 200,
        carregando: 'Buscando exibição de Missões',
        mensagemErro: 'Houve um erro recuperando a exibição de Missões',
        mensagemListaVazia: 'Nenhuma exibição de Missão cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma exibição de Missão encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { fkCatalogosMissaoId: 'ASC', ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

function useListagemCatalogosMissao() {
    return useNoraGraphQLListagem('CatalogoMissao', {
        select: ['id', 'nome'],
        itensPorPagina: 200,
        carregando: 'Buscando Catálogos de Missão',
        mensagemErro: 'Houve um erro recuperando os Catálogos de Missão',
        mensagemListaVazia: 'Nenhum Catálogo de Missão cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum Catálogo de Missão encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
