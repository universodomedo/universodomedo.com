'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

export interface Contexto__PaginaConfigurarMusica__Props {
    listagemMusicas: ReturnType<typeof obtemListagemMusicas>;
    arquivoSelecionado: ReturnType<typeof obtemListagemMusicas>['registros'][number] | null;
    selecionar: (id: number) => void;
    deseleciona: () => void;
    recarregarListagem: () => void;
};

const Contexto__PaginaConfigurarMusica = createContext<Contexto__PaginaConfigurarMusica__Props | undefined>(undefined);

export const useContexto__PaginaConfigurarMusica = (): Contexto__PaginaConfigurarMusica__Props => {
    const context = useContext(Contexto__PaginaConfigurarMusica);
    if (!context) throw new Error('useContexto__PaginaConfigurarMusica precisa estar dentro de um Contexto__PaginaConfigurarMusica__Provider');
    return context;
};

export const Contexto__PaginaConfigurarMusica__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemMusicas = obtemListagemMusicas();
    const [idSelecionado, setIdSelecionado] = useState<number | null>(null);

    const arquivoSelecionado = idSelecionado !== null ? listagemMusicas.registros.find(musica => musica.id === idSelecionado) ?? null : null;

    const selecionar = useCallback((id: number) => { setIdSelecionado(id); }, []);
    const deseleciona = useCallback(() => { setIdSelecionado(null); }, []);

    return (
        <Contexto__PaginaConfigurarMusica.Provider value={{ listagemMusicas, arquivoSelecionado, selecionar, deseleciona, recarregarListagem: listagemMusicas.recarregar }}>
            {children}
        </Contexto__PaginaConfigurarMusica.Provider>
    );
};

//

function obtemListagemMusicas() {
    return useNoraGraphQLListagem('ArquivoTipadoMusica', {
        select: ['id', 'configurada', 'idMusicaConfigurada', 'nomeMusica', 'nomeFonte'],
        itensPorPagina: 20,
        carregando: 'Buscando músicas',
        mensagemErro: 'Houve um erro recuperando as músicas',
        mensagemListaVazia: 'Nenhuma música encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma música encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
