// #region Imports
import React, { createContext, useContext } from "react";

import { CirculoNivelRitual, criarNomeCustomizado,  Elemento, Ritual } from "Classes/ClassesTipos/index.ts";
import { SingletonHelper } from "Classes/classes_estaticas";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
// #endregion

interface ClasseContextualPersonagemRituaisProps {
    rituais: Ritual[];
}

export const PersonagemRituais = createContext<ClasseContextualPersonagemRituaisProps | undefined>(undefined);

export const PersonagemRituaisProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosFicha } = useClasseContextualPersonagem();

    const rituais: Ritual[] =  dadosFicha.rituais.map(dadosRitual => {
        return {
            nome: criarNomeCustomizado(dadosRitual.dadosNomeCustomizado),
            svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
            dadosAcoes: dadosRitual.dadosAcoes,
            get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === dadosRitual.idElemento)!; },
            get refCirculoNivelRitual(): CirculoNivelRitual { return SingletonHelper.getInstance().circulos_niveis_ritual.find(circulo_nivel_ritual => circulo_nivel_ritual.id === dadosRitual.idCirculoNivelRitual)!; },
        }
    });
    
    return (
        <PersonagemRituais.Provider value={{ rituais }}>
            {children}
        </PersonagemRituais.Provider>
    );
}

export const useClasseContextualPersonagemRituais = (): ClasseContextualPersonagemRituaisProps => {
    const context = useContext(PersonagemRituais);
    if (!context) throw new Error('useClasseContextualPersonagemRituais precisa estar dentro de uma ClasseContextual de PersonagemRituais');
    return context;
};