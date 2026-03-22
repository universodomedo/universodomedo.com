'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { PersonagemVisualizacaoDetalhadaDto } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { PAGINAS_VISUALIZA_PERSONAGEM, PAGINAS_SPA__VISUALIZA_PERSONAGEM, PAGINA_PERSONAGEM, TIPO_PAGINA_PERSONAGEM } from 'Componentes/FluxosSPA/VisualizaPersonagem/types';
import SPA__PaginaPersonagem__Base from 'Componentes/FluxosSPA/VisualizaPersonagem/paginas/base';

interface ContextoPaginaPersonagemProps {
    navegarPara: (pagina: PAGINA_PERSONAGEM) => void;
    personagem: PersonagemVisualizacaoDetalhadaDto;
};

function obtemPaginaAtual(tipoPaginaPersonagem: TIPO_PAGINA_PERSONAGEM, paginaPersonagemAtual: PAGINA_PERSONAGEM): PAGINAS_SPA__VISUALIZA_PERSONAGEM {
    if (paginaPersonagemAtual === PAGINA_PERSONAGEM.EXIBIR_FICHA) return 'EXIBIR_FICHA';
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

export const ContextoPaginaPersonagemProvider = ({ personagem }: { personagem: PersonagemVisualizacaoDetalhadaDto }) => {
    const { usuarioLogado } = useContextoAutenticacao();

    const souProprietarioDoPersonagem = personagem.usuario.id === usuarioLogado?.id;
    const ehPersonagemDeJogador = personagem.tipoPersonagem === 'PERSONAGEM_DE_JOGADOR';

    const tipoPaginaPersonagem: TIPO_PAGINA_PERSONAGEM = souProprietarioDoPersonagem ? TIPO_PAGINA_PERSONAGEM.EDITAVEL : TIPO_PAGINA_PERSONAGEM.VISUALIZACAO;
    const [paginaPersonagemAtual, setPaginaPersonagemAtual] = useState<PAGINA_PERSONAGEM>(PAGINA_PERSONAGEM.INICIAL);

    function navegarPara (paginaPersonagem: PAGINA_PERSONAGEM) { setPaginaPersonagemAtual(paginaPersonagem); };
    

    const paginaAtual = useMemo(() => obtemPaginaAtual(tipoPaginaPersonagem, paginaPersonagemAtual), [tipoPaginaPersonagem, paginaPersonagemAtual]);
    const Pagina = PAGINAS_VISUALIZA_PERSONAGEM[paginaAtual];

    return (
        <ContextoPaginaPersonagem.Provider value={{ navegarPara, personagem }}>
            <SPA__PaginaPersonagem__Base>
                <Pagina />
            </SPA__PaginaPersonagem__Base>
        </ContextoPaginaPersonagem.Provider>
    );
};