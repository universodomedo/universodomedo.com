'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { EventosApiRest } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type RegistroMissao = ReturnType<typeof useListagemMissoes>['registros'][number];

export interface Contexto__PaginaGameDesignerMissoes__Props {
    listagemMissoes: ReturnType<typeof useListagemMissoes>;
    criandoMissao: boolean;
    criarMissao: () => Promise<void>;
    removerMissao: (missao: RegistroMissao) => Promise<void>;
};

const Contexto__PaginaGameDesignerMissoes = createContext<Contexto__PaginaGameDesignerMissoes__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerMissoes = (): Contexto__PaginaGameDesignerMissoes__Props => {
    const context = useContext(Contexto__PaginaGameDesignerMissoes);
    if (!context) throw new Error('useContexto__PaginaGameDesignerMissoes precisa estar dentro de um Contexto__PaginaGameDesignerMissoes');
    return context;
};

export const Contexto__PaginaGameDesignerMissoes__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemMissoes = useListagemMissoes();
    const [criandoMissao, setCriandoMissao] = useState(false);
    const recarregarListagem = listagemMissoes.recarregar;

    const criarMissao = useCallback(async () => {
        setCriandoMissao(true);

        try {
            await NoraApi.RestPOST(EventosApiRest.POST.Missoes.criar, {}, { mensagemErro: 'Não foi possível criar a Missão.' });
            recarregarListagem();
        } finally {
            setCriandoMissao(false);
        }
    }, [recarregarListagem]);

    const removerMissao = useCallback(async (missao: RegistroMissao) => {
        const confirmou = window.confirm(`Remover a Missão #${missao.id}?`);
        if (!confirmou) return;

        await NoraApi.RestPOST(EventosApiRest.POST.Missoes.remover, { id: missao.id }, { mensagemErro: 'Não foi possível remover a Missão.' });
        recarregarListagem();
    }, [recarregarListagem]);

    return (
        <Contexto__PaginaGameDesignerMissoes.Provider value={{ listagemMissoes, criandoMissao, criarMissao, removerMissao }}>
            {children}
        </Contexto__PaginaGameDesignerMissoes.Provider>
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