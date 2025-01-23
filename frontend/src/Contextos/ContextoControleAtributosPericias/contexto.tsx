// #region Imports
import { createContext, useContext, useState } from "react";

import { Menu } from 'Classes/ClassesTipos/index.ts';
// #endregion

interface ContextoAbaAtributoProps {
    abreviar: boolean;
    toggleAbreviar: () => void;
    listaMenus: Menu[];
}

export const ContextoAbaAtributo = createContext<ContextoAbaAtributoProps | undefined>(undefined);

export const useContextoAbaAtributo = (): ContextoAbaAtributoProps => {
    const context = useContext(ContextoAbaAtributo);

    if (!context) {
        throw new Error('useContextoAbaAtributo precisa estar dentro de um ContextoAbaAtributo');
    }

    return context;
};

export const ContextoAbaAtributoProvider = ({ children }: { children: React.ReactNode }) => {
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
        <ContextoAbaAtributo.Provider value={{ abreviar, toggleAbreviar, listaMenus }}>
            {children}
        </ContextoAbaAtributo.Provider>
    );
}