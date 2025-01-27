// #region Imports
import { createContext, useContext, useEffect, useState } from 'react';

import { CirculoNivelRitual, Elemento } from 'Classes/ClassesTipos/index.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';

import PaginaInicial from 'Paginas/SubPaginas/EdicaoFicha/EditaRituais/PaginasContexto/paginaInicial.tsx';
import PaginaCriacaoRitual from 'Paginas/SubPaginas/EdicaoFicha/EditaRituais/PaginasContexto/paginaCriacaoRitual.tsx';

import PaginaRitualPericia from 'Paginas/SubPaginas/EdicaoFicha/EditaRituais/MontandoRitual/paginaRitualPericia.tsx';

import { getPersonagemFromContext } from 'Contextos/ContextoPersonagem/contexto.tsx';
// #endregion

interface ContextoCriaRitualProps {
    mudarPaginaRitual: (idPagina: number) => void;
    paginaRitualAberta: JSX.Element;
    selecionaElemento: (idElemento: number) => void;
    elementoSelecionado: Elemento | undefined;
    selecionaNivel: (idNivel: number) => void;
    nivelSelecionado: CirculoNivelRitual | undefined;
    opcoesNivelRitual: { circuloNivelRitual: CirculoNivelRitual, desabilitado: boolean }[];
    opcoesTipoRitual: { id: number, texto: string }[];
    mudarPaginaTipoRitual: (idTipoRitual: number) => void;
    paginaTipoRitualAberta: JSX.Element;
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
    const mudarPaginaRitual = (idPagina: number) => setIdPaginaRitualAberta(idPagina);
    const paginasRituais: { [key: number]: JSX.Element } = {
        0: <PaginaInicial />,
        1: <PaginaCriacaoRitual />,
    };
    const paginaRitualAberta = paginasRituais[idPaginaRitualAberta];

    const [idElementoSelecionado, setIdElementoSelecionado] = useState(0);
    const selecionaElemento = (idElemento: number) => setIdElementoSelecionado(idElemento);
    const elementoSelecionado = SingletonHelper.getInstance().elementos.find(elemento => elemento.id === idElementoSelecionado);

    const [idNivelSelecionado, setIdNivelSelecionado] = useState(0);
    const selecionaNivel = (idNivel: number) => setIdNivelSelecionado(idNivel);
    const nivelSelecionado = SingletonHelper.getInstance().circulos_niveis_ritual.find(nivel => nivel.id === idNivelSelecionado);

    const [idPaginaTipoRitualAberta, setIdPaginaTipoRitualAberta] = useState(0);
    const mudarPaginaTipoRitual = (idTipoRitual: number) => setIdPaginaTipoRitualAberta(idTipoRitual);
    const paginasTipoRitual: { [key: number]: JSX.Element } = {
        1: <PaginaRitualPericia />,
    }
    const paginaTipoRitualAberta = paginasTipoRitual[idPaginaTipoRitualAberta];

    const temLigacaoPrimeiroCirculo = getPersonagemFromContext().proficienciaPersonagem.proficiencias.some(proficiencia => proficiencia.refTipoProficiencia.id === 6 && proficiencia.refNivelProficiencia.idNivelProficiencia === 1);
    const temLigacaoSegundoCirculo = getPersonagemFromContext().proficienciaPersonagem.proficiencias.some(proficiencia => proficiencia.refTipoProficiencia.id === 6 && proficiencia.refNivelProficiencia.idNivelProficiencia === 2);
    const temLigacaoTerceiroCirculo = getPersonagemFromContext().proficienciaPersonagem.proficiencias.some(proficiencia => proficiencia.refTipoProficiencia.id === 6 && proficiencia.refNivelProficiencia.idNivelProficiencia === 3);

    // vou fazer o filtro das ligacoes por aqui, mas precisa mudar depois
    const opcoesNivelRitual = SingletonHelper.getInstance().circulos_niveis_ritual.map(circuloNivelRitual => ({
        circuloNivelRitual,
        desabilitado: (
            !(circuloNivelRitual.idCirculo === 1 && circuloNivelRitual.idNivel === 1)
            ||
            (Number(circuloNivelRitual.idCirculo) === 1 && circuloNivelRitual.idNivel !== 1 && !temLigacaoPrimeiroCirculo)
            ||
            (Number(circuloNivelRitual.idCirculo) === 2 && !temLigacaoSegundoCirculo)
            ||
            (Number(circuloNivelRitual.idCirculo) === 3 && !temLigacaoTerceiroCirculo)
        )
    }));

    const [opcoesTipoRitual, setOpcoesTipoRitual] = useState<{ id: number; texto: string }[]>([]);

    useEffect(() => {
        if (nivelSelecionado?.id === 1) setOpcoesTipoRitual([{ id: 1, texto: 'Aumento de Perícia' }]);
        if (nivelSelecionado?.id === 2 || nivelSelecionado?.id === 3) setOpcoesTipoRitual([{ id: 1, texto: 'Aumento de Perícia' }, { id: 2, texto: 'Ataque Paranormal' }]);
    }, [nivelSelecionado]);

    return (
        <ContextoCriaRitual.Provider value={{ mudarPaginaRitual, paginaRitualAberta, selecionaElemento, elementoSelecionado, selecionaNivel, nivelSelecionado, opcoesNivelRitual, opcoesTipoRitual, mudarPaginaTipoRitual, paginaTipoRitualAberta }}>
            {children}
        </ContextoCriaRitual.Provider>
    );
}