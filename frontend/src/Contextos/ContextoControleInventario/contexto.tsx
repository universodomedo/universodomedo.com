// #region Imports
import { createContext, useContext, useState } from "react";

import { Menu } from 'Classes/ClassesTipos/index.ts';
// #endregion

interface ContextoControleInventarioProps {
    mostrarFiltros: boolean;
    toggleMostrarFiltros: () => void;
    mostrarEtiquetas: boolean;
    toggleMostrarEtiquetas: () => void;
    mostrarBarras: boolean;
    toggleMostrarBarras: () => void;
    listaMenus: Menu[];
}

export const ContextoControleInventario = createContext<ContextoControleInventarioProps | undefined>(undefined);

export const useContextoControleInventario = (): ContextoControleInventarioProps => {
    const context = useContext(ContextoControleInventario);

    if (!context) {
        throw new Error('useContextoControleInventario precisa estar dentro de um ContextoControleInventario');
    }

    return context;
};

export const ContextoControleInventarioProvider = ({ children }: { children: React.ReactNode }) => {
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
        <ContextoControleInventario.Provider value={{ mostrarFiltros, toggleMostrarFiltros, mostrarEtiquetas, toggleMostrarEtiquetas, mostrarBarras, toggleMostrarBarras, listaMenus }}>
            {children}
        </ContextoControleInventario.Provider>
    );
}