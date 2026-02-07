'use client';

import { createContext, useContext, useState } from 'react';

import { PAGINAS_CRIA_FICHA, PAGINAS_SPA__CRIA_FICHA } from 'Componentes/FluxosSPA/CriaFicha/types';

interface ContextoPaginaJogadorCriaFichaProps {
    navegarPara: (pagina: PAGINAS_SPA__CRIA_FICHA) => void;
    nomeFicha: string;
    setNomeFicha: (v: string) => void;
    descricaoFicha: string;
    setDescricaoFicha: (v: string) => void;
    podeComecarCriacao: boolean;
};

const ContextoPaginaJogadorCriaFicha = createContext<ContextoPaginaJogadorCriaFichaProps | undefined>(undefined);

export const useContextoPaginaJogadorCriaFicha = (): ContextoPaginaJogadorCriaFichaProps => {
    const context = useContext(ContextoPaginaJogadorCriaFicha);
    if (!context) throw new Error('useContextoPaginaJogadorCriaFicha precisa estar dentro de um ContextoPaginaJogadorCriaFicha');
    return context;
};

export function SPA_PaginaJogadorCriaFicha() {
    return (
        <ContextoPaginaJogadorCriaFichaProvider />
    );
};

const ContextoPaginaJogadorCriaFichaProvider = () => {
const [paginaAtual, setPaginaAtual] = useState<PAGINAS_SPA__CRIA_FICHA>('INICIAL');

    const [nomeFicha, setNomeFicha] = useState<string>('a');
    const [descricaoFicha, setDescricaoFicha] = useState<string>('b');

    const podeComecarCriacao: boolean = nomeFicha.trim() !== '' && descricaoFicha.trim() != '';

    
    function navegarPara(pagina: PAGINAS_SPA__CRIA_FICHA) { setPaginaAtual(pagina); }
    const pagina = PAGINAS_CRIA_FICHA[paginaAtual];
    if (!pagina) throw new Error(`Página não registrada no fluxo: ${paginaAtual}`);

    return (
        <ContextoPaginaJogadorCriaFicha.Provider value={{ navegarPara, nomeFicha, setNomeFicha, descricaoFicha, setDescricaoFicha, podeComecarCriacao }}>
            {pagina}
        </ContextoPaginaJogadorCriaFicha.Provider>
    );
};