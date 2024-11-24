// #region Imports
import { createContext, useContext, useState } from "react";

import { Menu } from 'Types/classes/index.ts';
// #endregion

interface ContextoAbaInventarioProps {
    mostrarFiltros: boolean;
    toggleMostrarFiltros: () => void;
    mostrarEtiquetas: boolean;
    toggleMostrarEtiquetas: () => void;
    mostrarBarras: boolean;
    toggleMostrarBarras: () => void;
    listaMenus: Menu[];
}

export const ContextoAbaInventario = createContext<ContextoAbaInventarioProps | undefined>(undefined);

export const useContextoAbaInventario = (): ContextoAbaInventarioProps => {
    const context = useContext(ContextoAbaInventario);

    if (!context) {
        throw new Error('useContextoAbaInventario precisa estar dentro de um ContextoAbaInventario');
    }

    return context;
};

export const ContextoAbaInventarioProvider = ({ children }: { children: React.ReactNode }) => {
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [mostrarEtiquetas, setMostrarEtiquetas] = useState(true);
    const [mostrarBarras, setMostrarBarras] = useState(false);

    const toggleMostrarFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    }

    const toggleMostrarEtiquetas = () => {
        setMostrarEtiquetas(!mostrarEtiquetas);
    }

    const toggleMostrarBarras = () => {
        setMostrarBarras(!mostrarBarras);
    }

    const listaMenus: Menu[] = [
        {
            tituloMenu: 'Configurações', itensMenu: [
                { tituloItem: 'Mostrar Filtros', tipoItem: 'CheckboxItem', checked: mostrarFiltros, funcItem: toggleMostrarFiltros },
                { tituloItem: 'Mostrar Nome dos Itens', tipoItem: 'CheckboxItem', checked: mostrarEtiquetas, funcItem: toggleMostrarEtiquetas },
                { tituloItem: 'Mostrar Barras do Inventário', tipoItem: 'CheckboxItem', checked: mostrarBarras, funcItem: toggleMostrarBarras },
            ]
        }
    ];

    return (
        <ContextoAbaInventario.Provider value={{ mostrarFiltros, toggleMostrarFiltros, mostrarEtiquetas, toggleMostrarEtiquetas, mostrarBarras, toggleMostrarBarras, listaMenus }}>
            {children}
        </ContextoAbaInventario.Provider>
    );
}