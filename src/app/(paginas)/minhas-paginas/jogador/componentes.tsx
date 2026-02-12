'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaInicialJogadorProvider, useContextoPaginaInicialJogador } from 'Contextos/ContextoPaginaInicialJogador/contexto';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';
import UnificaPersonagemEFichaParaUsuario from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/UnificaPersonagemEFichaParaUsuario/UnificaPersonagemEFichaParaUsuario';

export function PaginaJogador_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.jogador}>
            <ContextoPaginaInicialJogadorProvider idTipoPersonagem={1}>
                <PaginaJogador_Slot />
            </ContextoPaginaInicialJogadorProvider>
        </ControladorSlot>
    );
};

function PaginaJogador_Slot() {
    const { personagens, fichas } = useContextoPaginaInicialJogador();
    
    return (
        <>
            <AvisosDePersonagensEFichas />
            <UnificaPersonagemEFichaParaUsuario personagens={personagens} fichasTemporarias={fichas} />
        </>
    );
};