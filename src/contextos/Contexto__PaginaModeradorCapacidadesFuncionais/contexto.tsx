'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { useControlePaginaModeradorCapacidadesFuncionais } from './controle';
import type { Contexto__PaginaModeradorCapacidadesFuncionais__Props } from './tipos';

const Contexto__PaginaModeradorCapacidadesFuncionais = createContext<Contexto__PaginaModeradorCapacidadesFuncionais__Props | undefined>(undefined);

export const useContexto__PaginaModeradorCapacidadesFuncionais = (): Contexto__PaginaModeradorCapacidadesFuncionais__Props => {
    const context = useContext(Contexto__PaginaModeradorCapacidadesFuncionais);
    if (!context) throw new Error('useContexto__PaginaModeradorCapacidadesFuncionais precisa estar dentro de um Contexto__PaginaModeradorCapacidadesFuncionais');
    return context;
};

export const Contexto__PaginaModeradorCapacidadesFuncionais__Provider = ({ children }: { children: ReactNode; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Cadastro Funcional', fecharProps: undefined });
    const valorContexto = useControlePaginaModeradorCapacidadesFuncionais();

    return (
        <Contexto__PaginaModeradorCapacidadesFuncionais.Provider value={valorContexto}>
            {children}
        </Contexto__PaginaModeradorCapacidadesFuncionais.Provider>
    );
};
