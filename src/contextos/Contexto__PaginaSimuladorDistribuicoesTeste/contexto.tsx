'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { calculaResultadoTeoricoCenarioTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/distribuicaoTeoricaTeste';
import { useConfiguracaoSimuladorDistribuicoesTeste } from './useConfiguracaoSimuladorDistribuicoesTeste';

function useEstadoPaginaSimuladorDistribuicoesTeste() {
    const configuracao = useConfiguracaoSimuladorDistribuicoesTeste();
    const resultadosTeoricos = useMemo(() => configuracao.cenarios.map(cenario => calculaResultadoTeoricoCenarioTeste(cenario, configuracao.limiares)), [configuracao.cenarios, configuracao.limiares]);

    return { ...configuracao, resultadosTeoricos };
};

export type Contexto__PaginaSimuladorDistribuicoesTeste__Props = ReturnType<typeof useEstadoPaginaSimuladorDistribuicoesTeste>;

const Contexto__PaginaSimuladorDistribuicoesTeste = createContext<Contexto__PaginaSimuladorDistribuicoesTeste__Props | undefined>(undefined);

export const useContexto__PaginaSimuladorDistribuicoesTeste = (): Contexto__PaginaSimuladorDistribuicoesTeste__Props => {
    const context = useContext(Contexto__PaginaSimuladorDistribuicoesTeste);
    if (!context) throw new Error('useContexto__PaginaSimuladorDistribuicoesTeste precisa estar dentro de um Contexto__PaginaSimuladorDistribuicoesTeste');
    return context;
};

export const Contexto__PaginaSimuladorDistribuicoesTeste__Provider = ({ children }: { children: ReactNode; }) => {
    const estado = useEstadoPaginaSimuladorDistribuicoesTeste();
    return <Contexto__PaginaSimuladorDistribuicoesTeste.Provider value={estado}>{children}</Contexto__PaginaSimuladorDistribuicoesTeste.Provider>;
};