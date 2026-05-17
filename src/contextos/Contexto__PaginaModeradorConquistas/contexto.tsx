'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

interface Contexto__PaginaModeradorConquistas__Props {
    listagemConquistas: ReturnType<typeof obtemListagemConquistas>;
    setIdConquistaSelecionada: (idConquistaSelecionada: number | null) => void;
    deselecionaConquista: () => void;
    conquistaSelecionada: ReturnType<typeof obtemListagemConquistas>['registros'][number] | null
};

const Contexto__PaginaModeradorConquistas = createContext<Contexto__PaginaModeradorConquistas__Props | undefined>(undefined);

export const useContexto__PaginaModeradorConquistas = (): Contexto__PaginaModeradorConquistas__Props => {
    const context = useContext(Contexto__PaginaModeradorConquistas);
    if (!context) throw new Error('useContexto__PaginaModeradorConquistas precisa estar dentro de um Contexto__PaginaModeradorConquistas');
    return context;
};

export const Contexto__PaginaModeradorConquistas__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemConquistas = obtemListagemConquistas();
    const [idConquistaSelecionada, setIdConquistaSelecionada] = useState<number | null>(null);

    const conquistaSelecionada = idConquistaSelecionada ? listagemConquistas.registros.find(conquista => conquista.id === idConquistaSelecionada) ?? null : null;

    const deselecionaConquista = useCallback(() => { setIdConquistaSelecionada(null); }, []);

    return (
        <Contexto__PaginaModeradorConquistas.Provider value={{ listagemConquistas, setIdConquistaSelecionada, deselecionaConquista, conquistaSelecionada }}>
            {children}
        </Contexto__PaginaModeradorConquistas.Provider>
    );
};

//

function obtemListagemConquistas() {
    return useNoraGraphQLListagem('GrupoAventura', { // trocar para Conqista
        select: ['id', 'nome', 'nomeUnicoGrupoAventura', 'dadosArteCapa', 'detalhesSessoes'],
        itensPorPagina: 12,
        carregando: 'Buscando Conquistas',
        mensagemErro: 'Houve um erro recuperando suas Conquistas',
        mensagemListaVazia: 'Nenhuma conquista encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma conquista encontrada com os filtros atuais.',
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