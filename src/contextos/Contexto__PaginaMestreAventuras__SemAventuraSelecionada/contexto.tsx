'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import SPA__PaginaMestreAventuras__SemAventuraSelecionada from 'Conteineres/PaginaMestreAventuras/paginas/SPA__PaginaMestreAventuras__SemAventuraSelecionada/SPA__PaginaMestreAventuras__SemAventuraSelecionada';

interface Contexto__PaginaMestreAventuras__SemAventuraSelecionada__Props {
    
};

const Contexto__PaginaMestreAventuras__SemAventuraSelecionada = createContext<Contexto__PaginaMestreAventuras__SemAventuraSelecionada__Props | undefined>(undefined);

export const useContexto__PaginaMestreAventuras__SemAventuraSelecionada = (): Contexto__PaginaMestreAventuras__SemAventuraSelecionada__Props => {
    const context = useContext(Contexto__PaginaMestreAventuras__SemAventuraSelecionada);
    if (!context) throw new Error('useContexto__PaginaMestreAventuras__SemAventuraSelecionada precisa estar dentro de um Contexto__PaginaMestreAventuras__SemAventuraSelecionada');
    return context;
};

export const Contexto__PaginaMestreAventuras__SemAventuraSelecionada__Provider = () => {

    return (
        <Contexto__PaginaMestreAventuras__SemAventuraSelecionada.Provider value={{  }}>
            <SPA__PaginaMestreAventuras__SemAventuraSelecionada />
        </Contexto__PaginaMestreAventuras__SemAventuraSelecionada.Provider>
    );
};