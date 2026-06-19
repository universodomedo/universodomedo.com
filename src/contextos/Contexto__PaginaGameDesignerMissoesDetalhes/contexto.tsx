'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type FluxoPaginaGameDesignerMissoesDetalhes = 'LISTAGEM' | 'EDITOR';
type RegistroMissao = ReturnType<typeof useListagemMissoes>['registros'][number];
type RegistroMissaoDetalhe = ReturnType<typeof useListagemMissoesDetalhes>['registros'][number];

export interface Contexto__PaginaGameDesignerMissoesDetalhes__Props {
    estadoFluxo: FluxoPaginaGameDesignerMissoesDetalhes;
    missaoSelecionada: RegistroMissao | null;
    detalheSelecionado: RegistroMissaoDetalhe | null;
    listagemMissoes: ReturnType<typeof useListagemMissoes>;
    listagemMissoesDetalhes: ReturnType<typeof useListagemMissoesDetalhes>;
    iniciaConfiguracao: (missao: RegistroMissao, detalhe: RegistroMissaoDetalhe | null) => void;
    voltarParaListagem: () => void;
    concluiSalvamento: () => void;
};

const Contexto__PaginaGameDesignerMissoesDetalhes = createContext<Contexto__PaginaGameDesignerMissoesDetalhes__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerMissoesDetalhes = (): Contexto__PaginaGameDesignerMissoesDetalhes__Props => {
    const context = useContext(Contexto__PaginaGameDesignerMissoesDetalhes);
    if (!context) throw new Error('useContexto__PaginaGameDesignerMissoesDetalhes precisa estar dentro de um Contexto__PaginaGameDesignerMissoesDetalhes');
    return context;
};

export const Contexto__PaginaGameDesignerMissoesDetalhes__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemMissoes = useListagemMissoes();
    const listagemMissoesDetalhes = useListagemMissoesDetalhes();
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoPaginaGameDesignerMissoesDetalhes>('LISTAGEM');
    const [missaoSelecionada, setMissaoSelecionada] = useState<RegistroMissao | null>(null);
    const [detalheSelecionado, setDetalheSelecionado] = useState<RegistroMissaoDetalhe | null>(null);
    const recarregarMissoes = listagemMissoes.recarregar;
    const recarregarMissoesDetalhes = listagemMissoesDetalhes.recarregar;

    const iniciaConfiguracao = useCallback((missao: RegistroMissao, detalhe: RegistroMissaoDetalhe | null) => { setMissaoSelecionada(missao); setDetalheSelecionado(detalhe); setEstadoFluxo('EDITOR'); }, []);
    const voltarParaListagem = useCallback(() => { setMissaoSelecionada(null); setDetalheSelecionado(null); setEstadoFluxo('LISTAGEM'); }, []);
    const concluiSalvamento = useCallback(() => { recarregarMissoes(); recarregarMissoesDetalhes(); setMissaoSelecionada(null); setDetalheSelecionado(null); setEstadoFluxo('LISTAGEM'); }, [recarregarMissoes, recarregarMissoesDetalhes]);

    return (
        <Contexto__PaginaGameDesignerMissoesDetalhes.Provider value={{ estadoFluxo, missaoSelecionada, detalheSelecionado, listagemMissoes, listagemMissoesDetalhes, iniciaConfiguracao, voltarParaListagem, concluiSalvamento }}>
            {children}
        </Contexto__PaginaGameDesignerMissoesDetalhes.Provider>
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
        select: ['fkMissoesId', 'nome', 'descricao', 'dataAtualizacao'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
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
