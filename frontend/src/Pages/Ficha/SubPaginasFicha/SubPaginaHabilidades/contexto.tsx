// #region Imports
import { createContext, useContext, useState } from "react";

import { Menu } from 'Types/classes/index.ts';
// #endregion

interface ContextoAbaHabilidadesProps {
    mostrarFiltros: boolean;
    toggleMostrarFiltros: () => void;
    mostrarEtiquetas: boolean;
    toggleMostrarEtiquetas: () => void;
    listaMenus: Menu[];
}

export const ContextoAbaHabilidades = createContext<ContextoAbaHabilidadesProps | undefined>(undefined);

export const useContextoAbaHabilidades = (): ContextoAbaHabilidadesProps => {
    const context = useContext(ContextoAbaHabilidades);

    if (!context) {
        throw new Error('useContextoAbaHabilidades precisa estar dentro de um ContextoAbaHabilidades');
    }

    return context;
};

export const ContextoAbaHabilidadesProvider = ({ children }: { children: React.ReactNode }) => {
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
        <ContextoAbaHabilidades.Provider value={{ mostrarFiltros, toggleMostrarFiltros, mostrarEtiquetas, toggleMostrarEtiquetas, listaMenus }}>
            {children}
        </ContextoAbaHabilidades.Provider>
    );
}