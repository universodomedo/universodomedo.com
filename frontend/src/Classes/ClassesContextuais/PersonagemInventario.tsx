// #region Imports
import React, { createContext, useContext } from "react";

import { Inventario, Item } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
// #endregion

interface ClasseContextualPersonagemInventarioProps {
    inventario: Inventario
}

export const PersonagemInventario = createContext<ClasseContextualPersonagemInventarioProps | undefined>(undefined);

export const PersonagemInventarioProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosFicha } = useClasseContextualPersonagem();

    const inventario: Inventario = {
        items: [],
        agrupamento: [],
        espacosUsados: 0,
        acoes: [],
        numeroItensCategoria: (valorCategoria: number) => { console.log('precisa implementar numeroItensCategoria'); return 0; },
        adicionarItem: (item: Item) => { console.log('precisa implementar adicionarItem'); },
        removerItem: (item: Item) => { console.log('precisa implementar removerItem'); },
    };
    // this.dadosFicha.inventario!.map(dadosItem => this.inventario.adicionarItemNoInventario(novoItemPorDadosItem(dadosItem)));

    return (
        <PersonagemInventario.Provider value={{ inventario }}>
            {children}
        </PersonagemInventario.Provider>
    );
}

export const useClasseContextualPersonagemInventario = (): ClasseContextualPersonagemInventarioProps => {
    const context = useContext(PersonagemInventario);
    if (!context) throw new Error('useClasseContextualPersonagemInventario precisa estar dentro de uma ClasseContextual de PersonagemInventario');
    return context;
};