// #region Imports
import { createContext, ReactNode, useContext, useState } from 'react';

import { CirculoNivelRitual } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import PaginaInicial from './PaginasContexto/paginaInicial.tsx';
import PaginaCriacaoRitual from './PaginasContexto/paginaCriacaoRitual.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

interface ContextoCriaRitualProps {
    idPaginaRitualAberta: number;
    mudarPaginaRitual: (idPagina: number) => void;
    paginasRituais: { [key: number]: ReactNode };
    opcoesNivelRitual: { circuloNivelRitual: CirculoNivelRitual, desabilitado: boolean }[];
}

export const ContextoCriaRitual = createContext<ContextoCriaRitualProps | undefined>(undefined);

export const useContextoCriaRitual = (): ContextoCriaRitualProps => {
    const context = useContext(ContextoCriaRitual);

    if (!context) {
        throw new Error('useContextoCriaRitual precisa estar dentro de um ContextoCriaRitual');
    }

    return context;
};

export const ContextoCriaRitualProvider = ({ children }: { children: React.ReactNode }) => {
    const [idPaginaRitualAberta, setIdPaginaRitualAberta] = useState(0);

    const mudarPaginaRitual = (idPagina: number) => {
        setIdPaginaRitualAberta(idPagina);
    };

    const paginasRituais = {
        0: <PaginaInicial />,
        1: <PaginaCriacaoRitual />,
    };

    const temLigacaoPrimeiroCirculo = getPersonagemFromContext().proficienciaPersonagem.proficiencias.some(proficiencia => proficiencia.refTipoProficiencia.id === 6 && proficiencia.refNivelProficiencia.idNivelProficiencia === 1);
    const temLigacaoSegundoCirculo = getPersonagemFromContext().proficienciaPersonagem.proficiencias.some(proficiencia => proficiencia.refTipoProficiencia.id === 6 && proficiencia.refNivelProficiencia.idNivelProficiencia === 2);
    const temLigacaoTerceiroCirculo = getPersonagemFromContext().proficienciaPersonagem.proficiencias.some(proficiencia => proficiencia.refTipoProficiencia.id === 6 && proficiencia.refNivelProficiencia.idNivelProficiencia === 3);

    console.log('temLigacaoPrimeiroCirculo');
    console.log(temLigacaoPrimeiroCirculo);
    console.log('temLigacaoSegundoCirculo');
    console.log(temLigacaoSegundoCirculo);
    console.log('temLigacaoTerceiroCirculo');
    console.log(temLigacaoTerceiroCirculo);

    const opcoesNivelRitual = SingletonHelper.getInstance().circulos_niveis_ritual.map(circuloNivelRitual => ({
        circuloNivelRitual,
        desabilitado: false,
    }));

    return (
        <ContextoCriaRitual.Provider value={{ idPaginaRitualAberta, mudarPaginaRitual, paginasRituais, opcoesNivelRitual }}>
            {children}
        </ContextoCriaRitual.Provider>
    );
}