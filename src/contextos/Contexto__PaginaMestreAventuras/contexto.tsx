'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

interface Contexto__PaginaMestreAventuras__Props {
    listagemGruposAventuras: ReturnType<typeof obtemListagemGruposAventuras>;
    setIdGrupoAventuraSelecionada: (idGrupoAventuraSelecionada: number | null) => void;
    deselecionaGrupoAventura: () => void;
    grupoAventuraSelecionado: ReturnType<typeof obtemListagemGruposAventuras>['registros'][number] | null
};

const Contexto__PaginaMestreAventuras = createContext<Contexto__PaginaMestreAventuras__Props | undefined>(undefined);

export const useContexto__PaginaMestreAventuras = (): Contexto__PaginaMestreAventuras__Props => {
    const context = useContext(Contexto__PaginaMestreAventuras);
    if (!context) throw new Error('useContexto__PaginaMestreAventuras precisa estar dentro de um Contexto__PaginaMestreAventuras');
    return context;
};

export const Contexto__PaginaMestreAventuras__Provider = ({ children }: { children: ReactNode; }) => {
    const { usuarioLogado } = useContextoAutenticacao();
    
    const listagemGruposAventuras = obtemListagemGruposAventuras(usuarioLogado?.id ?? null);
    const [idGrupoAventuraSelecionada, setIdGrupoAventuraSelecionada] = useState<number | null>(null);

    const grupoAventuraSelecionado = idGrupoAventuraSelecionada ? listagemGruposAventuras.registros.find(grupoAventura => grupoAventura.id === idGrupoAventuraSelecionada) ?? null : null;

    const deselecionaGrupoAventura = useCallback(() => { setIdGrupoAventuraSelecionada(null); }, []);

    return (
        <Contexto__PaginaMestreAventuras.Provider value={{ listagemGruposAventuras, setIdGrupoAventuraSelecionada, deselecionaGrupoAventura, grupoAventuraSelecionado }}>
            {children}
        </Contexto__PaginaMestreAventuras.Provider>
    );
};

//

function obtemListagemGruposAventuras(idUsuarioMestre: number | null) {
    return useNoraGraphQLListagem('GrupoAventura', {
        select: ['id', 'nome', 'nomeUnicoGrupoAventura', 'dadosArteCapa', 'detalhesSessoes'],
        whereFixo: idUsuarioMestre === null ? { usuarioMestre: { id: -1 } } : { usuarioMestre: { id: idUsuarioMestre } },
        itensPorPagina: 12,
        carregando: 'Buscando Aventuras',
        mensagemErro: 'Houve um erro recuperando suas Aventuras',
        mensagemListaVazia: 'Nenhuma aventura encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma aventura encontrada com os filtros atuais.',
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