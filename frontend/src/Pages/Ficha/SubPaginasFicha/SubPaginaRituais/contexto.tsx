// #region Imports
import { createContext, useContext, useState } from "react";

import { Menu } from 'Types/classes/index.ts';
// #endregion

interface ContextoAbaRituaisProps {
    mostrarFiltros: boolean;
    toggleMostrarFiltros: () => void;
    mostrarEtiquetas: boolean;
    toggleMostrarEtiquetas: () => void;
    listaMenus: Menu[];
}

export const ContextoAbaRituais = createContext<ContextoAbaRituaisProps | undefined>(undefined);

export const useContextoAbaRituais = (): ContextoAbaRituaisProps => {
    const context = useContext(ContextoAbaRituais);

    if (!context) {
        throw new Error('useContextoAbaRituais precisa estar dentro de um ContextoAbaRituais');
    }

    return context;
};

export const ContextoAbaRituaisProvider = ({ children }: { children: React.ReactNode }) => {
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
                { tituloItem: 'Mostrar Filtros', funcItem: toggleMostrarFiltros },
                { tituloItem: 'Mostrar Nome Ações', funcItem: toggleMostrarEtiquetas }
            ]
        }
    ];


    return (
        <ContextoAbaRituais.Provider value={{ mostrarFiltros, toggleMostrarFiltros, mostrarEtiquetas, toggleMostrarEtiquetas, listaMenus }}>
            {children}
        </ContextoAbaRituais.Provider>
    );
}