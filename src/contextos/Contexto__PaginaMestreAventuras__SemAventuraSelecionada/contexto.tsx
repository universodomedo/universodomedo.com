'use client';

import { createContext, useContext } from 'react';

import { useContexto__PaginaMestreAventuras } from '../Contexto__PaginaMestreAventuras/contexto';
import SPA__PaginaMestreAventuras__SemAventuraSelecionada from 'Conteineres/PaginaMestreAventuras/paginas/SPA__PaginaMestreAventuras__SemAventuraSelecionada/SPA__PaginaMestreAventuras__SemAventuraSelecionada';

type Contexto__PaginaMestreAventuras__SemAventuraSelecionada__Props = {
    readonly gruposAventuras: ReturnType<typeof useContexto__PaginaMestreAventuras>['listagemGruposAventuras'];
    readonly selecionaGrupoAventura: ReturnType<typeof useContexto__PaginaMestreAventuras>['setIdGrupoAventuraSelecionada'];
};

const Contexto__PaginaMestreAventuras__SemAventuraSelecionada = createContext<Contexto__PaginaMestreAventuras__SemAventuraSelecionada__Props | undefined>(undefined);

export const useContexto__PaginaMestreAventuras__SemAventuraSelecionada = (): Contexto__PaginaMestreAventuras__SemAventuraSelecionada__Props => {
    const context = useContext(Contexto__PaginaMestreAventuras__SemAventuraSelecionada);
    if (!context) throw new Error('useContexto__PaginaMestreAventuras__SemAventuraSelecionada precisa estar dentro de um Contexto__PaginaMestreAventuras__SemAventuraSelecionada');
    return context;
};

export const Contexto__PaginaMestreAventuras__SemAventuraSelecionada__Provider = (props: Contexto__PaginaMestreAventuras__SemAventuraSelecionada__Props) => {
    return (
        <Contexto__PaginaMestreAventuras__SemAventuraSelecionada.Provider value={props}>
            <SPA__PaginaMestreAventuras__SemAventuraSelecionada />
        </Contexto__PaginaMestreAventuras__SemAventuraSelecionada.Provider>
    );
};