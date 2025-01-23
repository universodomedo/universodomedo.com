// #region Imports
import { createContext, useContext, useState } from "react";

import { Menu } from 'Classes/ClassesTipos/index.ts';
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
                { tituloItem: 'Mostrar Filtros', tipoItem: 'CheckboxItem', checked: mostrarFiltros, funcItem: toggleMostrarFiltros },
                { tituloItem: 'Mostrar Nome dos Rituais', tipoItem: 'CheckboxItem', checked: mostrarEtiquetas, funcItem: toggleMostrarEtiquetas }
            ]
        }
    ];


    return (
        <ContextoAbaRituais.Provider value={{ mostrarFiltros, toggleMostrarFiltros, mostrarEtiquetas, toggleMostrarEtiquetas, listaMenus }}>
            {children}
        </ContextoAbaRituais.Provider>
    );
}