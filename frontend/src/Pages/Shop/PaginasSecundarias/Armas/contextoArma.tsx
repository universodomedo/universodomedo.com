// #region Imports

import { createContext, ReactNode, useContext, useState } from 'react';

import PaginaBaseArma from './pageBaseArma.tsx';
import PaginaCaracteristicaArma from './pageCaracteristicaArma.tsx';
// #endregion

interface ContextoArmaProps {
    adicionar: () => void;
    idPaginaArmaAberta: number;
    mudarPaginaArma: (idPagina: number) => void;
    paginasArma: { [key: number]: ReactNode };
    idBaseArmaSelecionada: number;
    selecionarBaseArma: (idBaseArma: number) => void;
}

export const ContextoArma = createContext<ContextoArmaProps | undefined>(undefined);

export const useContextoArma = (): ContextoArmaProps => {
    const context = useContext(ContextoArma);

    if (!context) {
        throw new Error('useContextoArma precisa estar dentro de um ContextoArma');
    }

    return context;
};

export const ContextoArmaProvider = ({ children }: { children: React.ReactNode }) => {
    const [idPaginaArmaAberta, setIdPaginaArmaAberta] = useState(0);
    const [idBaseArmaSelecionada, setIdBaseArmaSelecionada] = useState(0);

    const paginasArma = {
        0: <PaginaBaseArma />,
        1: <PaginaCaracteristicaArma />,
    }

    const adicionar = () => {
        console.log('adicionando item no inventario');
    }

    const mudarPaginaArma = (idPagina: number) => {
        if (idPagina === 0) setIdBaseArmaSelecionada(0);
        setIdPaginaArmaAberta(idPagina);
    };

    const selecionarBaseArma = (idBaseArma: number) => { setIdBaseArmaSelecionada(idBaseArma); }

    return (
        <ContextoArma.Provider value={{ adicionar, idPaginaArmaAberta, mudarPaginaArma, paginasArma, idBaseArmaSelecionada, selecionarBaseArma }}>
            {children}
        </ContextoArma.Provider>
    );
}