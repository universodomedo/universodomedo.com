'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

import { PAGINA_PERSONAGEM, TIPO_PAGINA_PERSONAGEM } from 'Componentes/PaginaPersonagem/types';

interface ContextoPaginaPersonagemProps {
    navegarPara: (pagina: PAGINA_PERSONAGEM) => void;
    souProprietarioDoPersonagem: boolean;
    ehPersonagemDeJogador: boolean;
    tipoPaginaPersonagem: TIPO_PAGINA_PERSONAGEM;
    paginaPersonagemAtual: PAGINA_PERSONAGEM;
};

const ContextoPaginaPersonagem = createContext<ContextoPaginaPersonagemProps | undefined>(undefined);

export const useContextoPaginaPersonagem = (): ContextoPaginaPersonagemProps => {
    const context = useContext(ContextoPaginaPersonagem);
    if (!context) throw new Error('useContextoPaginaPersonagem precisa estar dentro de um ContextoPaginaPersonagem');
    return context;
};

export const ContextoPaginaPersonagemProvider = ({ children }: { children: React.ReactNode }) => {
    const { usuarioLogado } = useContextoAutenticacao();
    const { personagemSelecionado } = useContextoPaginaPersonagens();

    const souProprietarioDoPersonagem = personagemSelecionado?.usuario.id === usuarioLogado?.id;
    const ehPersonagemDeJogador = personagemSelecionado?.tipoPersonagem.id === 1;

    const tipoPaginaPersonagem: TIPO_PAGINA_PERSONAGEM = souProprietarioDoPersonagem ? TIPO_PAGINA_PERSONAGEM.EDITAVEL : TIPO_PAGINA_PERSONAGEM.VISUALIZACAO;
    const [paginaPersonagemAtual, setPaginaPersonagemAtual] = useState<PAGINA_PERSONAGEM>(PAGINA_PERSONAGEM.INICIAL);

    function navegarPara (paginaPersonagem: PAGINA_PERSONAGEM) { setPaginaPersonagemAtual(paginaPersonagem); };

    return (
        <ContextoPaginaPersonagem.Provider value={{ navegarPara, souProprietarioDoPersonagem, ehPersonagemDeJogador, tipoPaginaPersonagem, paginaPersonagemAtual }}>
            {children}
        </ContextoPaginaPersonagem.Provider>
    );
};