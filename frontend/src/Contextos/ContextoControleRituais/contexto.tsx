// #region Imports
import { createContext, useContext, useState } from "react";

import { Menu } from 'Classes/ClassesTipos/index.ts';
// #endregion

interface ContextoControleRituaisProps {
    mostrarFiltros: boolean;
    toggleMostrarFiltros: () => void;
    mostrarEtiquetas: boolean;
    toggleMostrarEtiquetas: () => void;
    listaMenus: Menu[];
}

export const ContextoControleRituais = createContext<ContextoControleRituaisProps | undefined>(undefined);

export const ContextoControleRituaisProvider = ({ children }: { children: React.ReactNode }) => {
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
                { tituloItem: 'Mostrar Nome dos Rituais', tipoItem: 'CheckboxItem', checked: mostrarEtiquetas, funcItem: toggleMostrarEtiquetas }
            ]
        }
    ];


    return (
        <ContextoControleRituais.Provider value={{ mostrarFiltros, toggleMostrarFiltros, mostrarEtiquetas, toggleMostrarEtiquetas, listaMenus }}>
            {children}
        </ContextoControleRituais.Provider>
    );
}

export const useContextoControleRituais = (): ContextoControleRituaisProps => {
    const context = useContext(ContextoControleRituais);
    if (!context) throw new Error('useContextoControleRituais precisa estar dentro de um ContextoControleRituais');
    return context;
};