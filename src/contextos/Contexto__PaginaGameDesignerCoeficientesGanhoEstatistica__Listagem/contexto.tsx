'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props } from '../Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica/contexto';
import SPA__PaginaGameDesignerCoeficientesGanhoEstatistica from 'Conteineres/PaginaGameDesignerCoeficientesGanhoEstatistica/paginas/SPA__PaginaGameDesignerCoeficientesGanhoEstatistica/SPA__PaginaGameDesignerCoeficientesGanhoEstatistica';

interface Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem__Props {
    listagemCoeficientes: Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props['listagemCoeficientes'];
    selecionaCoeficiente: Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props['selecionaCoeficiente'];
    iniciaCadastro: Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props['iniciaCadastro'];
};

const Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem = createContext<Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem = (): Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem precisa estar dentro de um Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem');
    return context;
};

export const Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem__Provider = ({ listagemCoeficientes, selecionaCoeficiente, iniciaCadastro }: Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Coeficientes', fecharProps: undefined });

    return (
        <Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem.Provider value={{ listagemCoeficientes, selecionaCoeficiente, iniciaCadastro }}>
            <SPA__PaginaGameDesignerCoeficientesGanhoEstatistica />
        </Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Listagem.Provider>
    );
};
