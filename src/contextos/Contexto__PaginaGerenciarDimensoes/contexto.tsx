'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

export interface Contexto__PaginaGerenciarDimensoes__Props {
    listagemDimensoes: ReturnType<typeof useListagemDimensoes>;
    estaEmProcessoCriacao: boolean;
    iniciaCriacao: () => void;
    cancelaCriacao: () => void;
    concluiCriacao: () => void;
};

const Contexto__PaginaGerenciarDimensoes = createContext<Contexto__PaginaGerenciarDimensoes__Props | undefined>(undefined);

export const useContexto__PaginaGerenciarDimensoes = (): Contexto__PaginaGerenciarDimensoes__Props => {
    const context = useContext(Contexto__PaginaGerenciarDimensoes);
    if (!context) throw new Error('useContexto__PaginaGerenciarDimensoes precisa estar dentro de um Contexto__PaginaGerenciarDimensoes__Provider');
    return context;
};

export const Contexto__PaginaGerenciarDimensoes__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemDimensoes = useListagemDimensoes();
    const [estaEmProcessoCriacao, setEstaEmProcessoCriacao] = useState<boolean>(false);

    const iniciaCriacao = useCallback(() => setEstaEmProcessoCriacao(true), []);
    const cancelaCriacao = useCallback(() => setEstaEmProcessoCriacao(false), []);
    const recarregarListagem = listagemDimensoes.recarregar;
    const concluiCriacao = useCallback(() => { recarregarListagem(); setEstaEmProcessoCriacao(false); }, [recarregarListagem]);

    return (
        <Contexto__PaginaGerenciarDimensoes.Provider value={{ listagemDimensoes, estaEmProcessoCriacao, iniciaCriacao, cancelaCriacao, concluiCriacao }}>
            {children}
        </Contexto__PaginaGerenciarDimensoes.Provider>
    );
};

function useListagemDimensoes() {
    return useNoraGraphQLListagem('DimensaoClima', {
        select: ['id', 'nome', 'bipolar', 'rotuloOposto'],
        itensPorPagina: 100,
        carregando: 'Buscando dimensões',
        mensagemErro: 'Houve um erro recuperando as dimensões',
        mensagemListaVazia: 'Nenhuma dimensão cadastrada ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma dimensão encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
