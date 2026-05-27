'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

export interface Contexto__PaginaModeradorConfiguracaoHabilidades__Props {
    listagemHabilidades: ReturnType<typeof useListagemHabilidades>;
    habilidadeSelecionada: ReturnType<typeof useListagemHabilidades>['registros'][number] | null;
    selecionaHabilidade: (idHabilidade: number) => void;
    deselecionaHabilidade: () => void;
};

const Contexto__PaginaModeradorConfiguracaoHabilidades = createContext<Contexto__PaginaModeradorConfiguracaoHabilidades__Props | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoHabilidades = (): Contexto__PaginaModeradorConfiguracaoHabilidades__Props => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoHabilidades);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoHabilidades precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoHabilidades');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoHabilidades__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemHabilidades = useListagemHabilidades();
    const [idHabilidadeSelecionada, setIdHabilidadeSelecionada] = useState<number | null>(null);
    const habilidadeSelecionada = idHabilidadeSelecionada === null ? null : listagemHabilidades.registros.find(habilidade => habilidade.id === idHabilidadeSelecionada) ?? null;

    const selecionaHabilidade = useCallback((idHabilidade: number) => { setIdHabilidadeSelecionada(idHabilidade); }, []);
    const deselecionaHabilidade = useCallback(() => { setIdHabilidadeSelecionada(null); }, []);

    return (
        <Contexto__PaginaModeradorConfiguracaoHabilidades.Provider value={{ listagemHabilidades, habilidadeSelecionada, selecionaHabilidade, deselecionaHabilidade }}>
            {children}
        </Contexto__PaginaModeradorConfiguracaoHabilidades.Provider>
    );
};

function useListagemHabilidades() {
    return useNoraGraphQLListagem('Habilidade', {
        select: ['id', 'nome', 'descricao', 'tipoHabilidade'],
        camposFiltroConsulta: ['nome', 'tipoHabilidade.nome'],
        camposFiltroVisualizacao: ['nome', 'tipoHabilidade.nome'],
        itensPorPagina: 12,
        carregando: 'Buscando Habilidades',
        mensagemErro: 'Houve um erro recuperando as Habilidades',
        mensagemListaVazia: 'Nenhuma habilidade cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma habilidade encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};