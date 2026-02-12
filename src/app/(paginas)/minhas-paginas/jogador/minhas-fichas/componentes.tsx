'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoPaginaMinhasFichasProvider, useContextoPaginaMinhasFichas } from 'Contextos/ContextoPaginaMinhasFichas/contexto';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';
import UnificaPersonagemEFichaParaUsuario from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/UnificaPersonagemEFichaParaUsuario/UnificaPersonagemEFichaParaUsuario';

export function PaginaMinhasFichas_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.jogador.minhasFichas}>
            <ContextoPaginaMinhasFichasProvider>
                <PaginaMinhasFichas_Context />
            </ContextoPaginaMinhasFichasProvider>
        </ControladorSlot>
    );
};

function PaginaMinhasFichas_Context() {
    const { fichas } = useContextoPaginaMinhasFichas();

    return (
        <>
            <AvisosDePersonagensEFichas naoRenderizaAvisoPersonagem />
            <UnificaPersonagemEFichaParaUsuario fichasTemporarias={fichas} />
        </>
    );
};