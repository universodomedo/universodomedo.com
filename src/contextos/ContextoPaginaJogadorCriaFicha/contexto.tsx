'use client';

import { createContext, useContext, useState } from 'react';

import { PAGINAS_CRIA_FICHA, PAGINAS_SPA__CRIA_FICHA } from 'Componentes/FluxosSPA/CriaFicha/types';

type MODO_CRIACAO_FICHA = 'NOVA_FICHA' | 'CLONAR_FICHA_PERSONAGEM';

interface ContextoPaginaJogadorCriaFichaProps {
    navegarPara: (pagina: PAGINAS_SPA__CRIA_FICHA) => void;
    nomeFicha: string;
    setNomeFicha: (v: string) => void;
    descricaoFicha: string;
    setDescricaoFicha: (v: string) => void;
    modoCriacao: MODO_CRIACAO_FICHA;
    selecionarModoCriacao: (modo: MODO_CRIACAO_FICHA) => void;
    podeComecarCriacao: boolean;
};

const ContextoPaginaJogadorCriaFicha = createContext<ContextoPaginaJogadorCriaFichaProps | undefined>(undefined);

export const useContextoPaginaJogadorCriaFicha = (): ContextoPaginaJogadorCriaFichaProps => {
    const context = useContext(ContextoPaginaJogadorCriaFicha);
    if (!context) throw new Error('useContextoPaginaJogadorCriaFicha precisa estar dentro de um ContextoPaginaJogadorCriaFicha');
    return context;
};

export function SPA_PaginaJogadorCriaFicha() { return <ContextoPaginaJogadorCriaFichaProvider /> };

const ContextoPaginaJogadorCriaFichaProvider = () => {
    const [paginaAtual, setPaginaAtual] = useState<PAGINAS_SPA__CRIA_FICHA>('INICIAL');
    const [nomeFicha, setNomeFicha] = useState<string>('');
    const [descricaoFicha, setDescricaoFicha] = useState<string>('');
    const [modoCriacao, setModoCriacao] = useState<MODO_CRIACAO_FICHA>('NOVA_FICHA');

    const podeComecarCriacao: boolean = nomeFicha.trim() !== '' && descricaoFicha.trim() != '';

    function selecionarModoCriacao(modo: MODO_CRIACAO_FICHA) { if (modoCriacao === modo) return; setModoCriacao(modo); }

    
    function navegarPara(pagina: PAGINAS_SPA__CRIA_FICHA) { setPaginaAtual(pagina); }
    const Pagina = PAGINAS_CRIA_FICHA[paginaAtual];

    return (
        <ContextoPaginaJogadorCriaFicha.Provider value={{ navegarPara, nomeFicha, setNomeFicha, descricaoFicha, setDescricaoFicha, modoCriacao, selecionarModoCriacao, podeComecarCriacao }}>
            <Pagina />
        </ContextoPaginaJogadorCriaFicha.Provider>
    );
};