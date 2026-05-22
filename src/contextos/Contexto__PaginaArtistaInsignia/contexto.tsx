'use client';

import { createContext, useContext, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

export interface Contexto__PaginaArtistaInsignia__Props {
    listagemInsignias: ReturnType<typeof obtemListagemInsignias>;
    estaEmProcessoCriacao: boolean;
    setEstaEmProcessoCriacao: (v: boolean) => void;
};

const Contexto__PaginaArtistaInsignia = createContext<Contexto__PaginaArtistaInsignia__Props | undefined>(undefined);

export const useContexto__PaginaArtistaInsignia = (): Contexto__PaginaArtistaInsignia__Props => {
    const context = useContext(Contexto__PaginaArtistaInsignia);
    if (!context) throw new Error('useContexto__PaginaArtistaInsignia precisa estar dentro de um Contexto__PaginaArtistaInsignia');
    return context;
};

export const Contexto__PaginaArtistaInsignia__Provider = ({ children }: { children: React.ReactNode }) => {
    const listagemInsignias = obtemListagemInsignias();
    const [estaEmProcessoCriacao, setEstaEmProcessoCriacao] = useState<boolean>(false);

    return (
        <Contexto__PaginaArtistaInsignia.Provider value={{ listagemInsignias, estaEmProcessoCriacao, setEstaEmProcessoCriacao }}>
            {children}
        </Contexto__PaginaArtistaInsignia.Provider>
    );
};

//

function obtemListagemInsignias() {
    return useNoraGraphQLListagem('ArquivoTipadoInsignia', {
        select: ['id', 'arquivo'],
        itensPorPagina: 12,
        carregando: 'Buscando Insígnias',
        mensagemErro: 'Houve um erro recuperando suas Insígnias',
        mensagemListaVazia: 'Nenhuma insígnia encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma insígnia encontrada com os filtros atuais.',
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