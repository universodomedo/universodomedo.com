'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { GraphqlLeituras } from 'types-nora-api';

import useNoraGraphQLConsulta from 'Hooks/useNoraGraphQLConsulta';
import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';
import { criaDimensaoClima } from 'Uteis/ApiConsumer/ConsumerMiddleware';

const SELECT_DIMENSAO = { id: true, nome: true } as const;

export interface Contexto__PaginaGerenciarDimensoes__Props {
    dimensoes: { id: number; nome: string }[];
    carregando: boolean;
    erro: string | null;
    criar: (nome: string) => Promise<boolean>;
    recarregar: () => void;
};

const Contexto__PaginaGerenciarDimensoes = createContext<Contexto__PaginaGerenciarDimensoes__Props | undefined>(undefined);

export const useContexto__PaginaGerenciarDimensoes = (): Contexto__PaginaGerenciarDimensoes__Props => {
    const context = useContext(Contexto__PaginaGerenciarDimensoes);
    if (!context) throw new Error('useContexto__PaginaGerenciarDimensoes precisa estar dentro de um Contexto__PaginaGerenciarDimensoes__Provider');
    return context;
};

export const Contexto__PaginaGerenciarDimensoes__Provider = ({ children }: { children: ReactNode; }) => {
    const consulta = useNoraGraphQLConsulta(() => GraphqlLeituras.DimensaoClima.eventos.varios({ parametros: { limit: 100, offset: 0 }, select: SELECT_DIMENSAO }), { valorInicial: [], carregando: 'Carregando dimensões', mensagemErro: 'Não foi possível carregar as dimensões.', carregamento: NoraApiCarregamento.BARRA });
    const [erro, setErro] = useState<string | null>(null);

    const recarregar = consulta.recarregar;

    const criar = useCallback(async (nome: string): Promise<boolean> => {
        setErro(null);
        try {
            await criaDimensaoClima({ nome: nome.trim() });
            await recarregar();
            return true;
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Falha ao criar a dimensão.');
            return false;
        }
    }, [recarregar]);

    return (
        <Contexto__PaginaGerenciarDimensoes.Provider value={{ dimensoes: consulta.data, carregando: consulta.carregando != null, erro, criar, recarregar }}>
            {children}
        </Contexto__PaginaGerenciarDimensoes.Provider>
    );
};
