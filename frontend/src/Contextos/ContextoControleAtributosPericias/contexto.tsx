// #region Imports
import { createContext, useContext, useState } from "react";

import { Menu } from 'Classes/ClassesTipos/index.ts';
// #endregion

interface ContextoControleAtributosPericiasProps {
    abreviar: boolean;
    toggleAbreviar: () => void;
    listaMenus: Menu[];
}

export const ContextoControleAtributosPericias = createContext<ContextoControleAtributosPericiasProps | undefined>(undefined);

export const ContextoControleAtributosPericiasProvider = ({ children }: { children: React.ReactNode }) => {
    const [abreviar, setAbreviar] = useState(false);

    const toggleAbreviar = () => {
        setAbreviar(!abreviar);
    }

    const listaMenus: Menu[] = [
        {
            tituloMenu: 'Configurações', itensMenu: [
                { tituloItem: 'Abreviar Atributos e Perícias', tipoItem: 'CheckboxItem', checked: abreviar, funcItem: toggleAbreviar }
            ]
        }
    ];

    return (
        <ContextoControleAtributosPericias.Provider value={{ abreviar, toggleAbreviar, listaMenus }}>
            {children}
        </ContextoControleAtributosPericias.Provider>
    );
}

export const useContextoControleAtributosPericias = (): ContextoControleAtributosPericiasProps => {
    const context = useContext(ContextoControleAtributosPericias);
    if (!context) throw new Error('useContextoControleAtributosPericias precisa estar dentro de um ContextoControleAtributosPericias');
    return context;
};