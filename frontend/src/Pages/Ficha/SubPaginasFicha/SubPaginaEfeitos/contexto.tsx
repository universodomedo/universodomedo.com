// #region Imports
import { createContext, useContext, useState } from "react";

import { Menu } from 'Types/classes/index.ts';
// #endregion

interface ContextoAbaEfeitosProps {
    mostrarFiltros: boolean;
    toggleMostrarFiltros: () => void;
    mostrarEtiquetas: boolean;
    toggleMostrarEtiquetas: () => void;
    listaMenus: Menu[];
}

export const ContextoAbaEfeitos = createContext<ContextoAbaEfeitosProps | undefined>(undefined);

export const useContextoAbaEfeitos = (): ContextoAbaEfeitosProps => {
    const context = useContext(ContextoAbaEfeitos);

    if (!context) {
        throw new Error('useContextoAbaEfeitos precisa estar dentro de um ContextoAbaEfeitos');
    }

    return context;
};

export const ContextoAbaEfeitosProvider = ({ children }: { children: React.ReactNode }) => {
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
                { tituloItem: 'Mostrar Nome dos Efeitos', tipoItem: 'CheckboxItem', checked: mostrarEtiquetas, funcItem: toggleMostrarEtiquetas },
            ]
        }
    ];

    return (
        <ContextoAbaEfeitos.Provider value={{ mostrarFiltros, toggleMostrarFiltros, mostrarEtiquetas, toggleMostrarEtiquetas, listaMenus }}>
            {children}
        </ContextoAbaEfeitos.Provider>
    );
}