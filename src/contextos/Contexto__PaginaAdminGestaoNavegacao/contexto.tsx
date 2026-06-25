'use client';

import { createContext, useContext, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

export interface Contexto__PaginaAdminGestaoNavegacao__Props {
    listagemMenus: ReturnType<typeof obtemListagemMenus>;
    estaEmProcessoCriacao: boolean;
    setEstaEmProcessoCriacao: (v: boolean) => void;
};

const Contexto__PaginaAdminGestaoNavegacao = createContext<Contexto__PaginaAdminGestaoNavegacao__Props | undefined>(undefined);

export const useContexto__PaginaAdminGestaoNavegacao = (): Contexto__PaginaAdminGestaoNavegacao__Props => {
    const context = useContext(Contexto__PaginaAdminGestaoNavegacao);
    if (!context) throw new Error('useContexto__PaginaAdminGestaoNavegacao precisa estar dentro de um Contexto__PaginaAdminGestaoNavegacao');
    return context;
};

export const Contexto__PaginaAdminGestaoNavegacao__Provider = ({ children }: { children: React.ReactNode }) => {
    const listagemMenus = obtemListagemMenus();
    const [estaEmProcessoCriacao, setEstaEmProcessoCriacao] = useState<boolean>(false);

    return (
        <Contexto__PaginaAdminGestaoNavegacao.Provider value={{ listagemMenus, estaEmProcessoCriacao, setEstaEmProcessoCriacao }}>
            {children}
        </Contexto__PaginaAdminGestaoNavegacao.Provider>
    );
};

//

function obtemListagemMenus() {
    return useNoraGraphQLListagem('Menu', {
        select: ['id', 'chave', 'tipo', 'descricao', 'dataCriacao', 'dataAtualizacao'],
        itensPorPagina: 20,
        carregando: 'Buscando menus',
        mensagemErro: 'Houve um erro recuperando os menus',
        mensagemListaVazia: 'Nenhum menu cadastrado ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum menu encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({
            where: params.where,
            order: { id: 'DESC' },
            limit: params.limit,
            offset: params.offset,
        }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
