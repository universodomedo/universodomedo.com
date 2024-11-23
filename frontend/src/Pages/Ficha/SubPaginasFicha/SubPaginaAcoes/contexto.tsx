// #region Imports
import { createContext, useContext, useState } from "react";

import { Menu } from 'Types/classes/index.ts';
// #endregion

interface ContextoAbaAcoesProps {
    mostrarFiltros: boolean;
    toggleMostrarFiltros: () => void;
    mostrarEtiquetas: boolean;
    toggleMostrarEtiquetas: () => void;
    listaMenus: Menu[];
}

export const ContextoAbaAcoes = createContext<ContextoAbaAcoesProps | undefined>(undefined);

export const useContextoAbaAcoes = (): ContextoAbaAcoesProps => {
    const context = useContext(ContextoAbaAcoes);

    if (!context) {
        throw new Error('useContextoAbaAcoes precisa estar dentro de um ContextoAbaAcoes');
    }

    return context;
};

export const ContextoAbaAcoesProvider = ({ children }: { children: React.ReactNode }) => {
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [mostrarEtiquetas, setMostrarEtiquetas] = useState(true);

    const toggleMostrarFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    }

    const toggleMostrarEtiquetas = () => {
        setMostrarEtiquetas(!mostrarEtiquetas);
    }

    const listaMenus: Menu[] = [
        {
            tituloMenu: 'Configurações', itensMenu: [
                { tituloItem: 'Mostrar Filtros', tipoItem: 'CheckboxItem', checked: mostrarFiltros, funcItem: toggleMostrarFiltros },
                { tituloItem: 'Mostrar Nome Ações', tipoItem: 'CheckboxItem', checked: mostrarEtiquetas, funcItem: toggleMostrarEtiquetas }
            ]
        }
    ];

    return (
        <ContextoAbaAcoes.Provider value={{ mostrarFiltros, toggleMostrarFiltros, mostrarEtiquetas, toggleMostrarEtiquetas, listaMenus }}>
            {children}
        </ContextoAbaAcoes.Provider>
    );
}