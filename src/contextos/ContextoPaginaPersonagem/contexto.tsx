'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import { PAGINAS_VISUALIZA_PERSONAGEM, PAGINAS_SPA__VISUALIZA_PERSONAGEM, PAGINA_PERSONAGEM, TIPO_PAGINA_PERSONAGEM } from 'Componentes/FluxosSPA/VisualizaPersonagem/types';

interface ContextoPaginaPersonagemProps {
    navegarPara: (pagina: PAGINA_PERSONAGEM) => void;
};

function obtemPaginaAtual(tipoPaginaPersonagem: TIPO_PAGINA_PERSONAGEM, paginaPersonagemAtual: PAGINA_PERSONAGEM): PAGINAS_SPA__VISUALIZA_PERSONAGEM {
    if (tipoPaginaPersonagem === TIPO_PAGINA_PERSONAGEM.EDITAVEL && paginaPersonagemAtual === PAGINA_PERSONAGEM.INICIAL) return 'EDITAVEL_INICIAL';
    if (tipoPaginaPersonagem === TIPO_PAGINA_PERSONAGEM.EDITAVEL && paginaPersonagemAtual === PAGINA_PERSONAGEM.EVOLUIR) return 'EDITAVEL_EVOLUIR';
    if (tipoPaginaPersonagem === TIPO_PAGINA_PERSONAGEM.VISUALIZACAO && paginaPersonagemAtual === PAGINA_PERSONAGEM.INICIAL) return 'VISUALIZACAO_INICIAL';
    return 'VISUALIZACAO_INICIAL';
};

const ContextoPaginaPersonagem = createContext<ContextoPaginaPersonagemProps | undefined>(undefined);

export const useContextoPaginaPersonagem = (): ContextoPaginaPersonagemProps => {
    const context = useContext(ContextoPaginaPersonagem);
    if (!context) throw new Error('useContextoPaginaPersonagem precisa estar dentro de um ContextoPaginaPersonagem');
    return context;
};

export function SPA_PaginaPersonagem() { return <ContextoPaginaPersonagemProvider /> };

const ContextoPaginaPersonagemProvider = () => {
    const { usuarioLogado } = useContextoAutenticacao();
    const { personagemSelecionado } = useContextoPaginaPersonagens();

    const souProprietarioDoPersonagem = personagemSelecionado?.usuario.id === usuarioLogado?.id;
    const ehPersonagemDeJogador = personagemSelecionado?.tipoPersonagem.id === 1;

    const tipoPaginaPersonagem: TIPO_PAGINA_PERSONAGEM = souProprietarioDoPersonagem ? TIPO_PAGINA_PERSONAGEM.EDITAVEL : TIPO_PAGINA_PERSONAGEM.VISUALIZACAO;
    const [paginaPersonagemAtual, setPaginaPersonagemAtual] = useState<PAGINA_PERSONAGEM>(PAGINA_PERSONAGEM.INICIAL);

    function navegarPara (paginaPersonagem: PAGINA_PERSONAGEM) { setPaginaPersonagemAtual(paginaPersonagem); };
    

    const paginaAtual = useMemo(() => obtemPaginaAtual(tipoPaginaPersonagem, paginaPersonagemAtual), [tipoPaginaPersonagem, paginaPersonagemAtual]);
    const Pagina = PAGINAS_VISUALIZA_PERSONAGEM[paginaAtual];

    return (
        <ContextoPaginaPersonagem.Provider value={{ navegarPara }}>
            <Pagina />
        </ContextoPaginaPersonagem.Provider>
    );
};