import { useContextoJogadorPersonagens } from 'Contextos/ContextoJogadorPersonagens/contexto.tsx';
import { PaginaPersonagemSelecionado } from './pagina-personagem.tsx';
import { PaginaListaPersonagens } from './pagina-todos-personagens.tsx';

export function PaginaMeusPersonagens_Contexto() {
    const { personagemSelecionado } = useContextoJogadorPersonagens();

    return !personagemSelecionado
        ? <PaginaListaPersonagens />
        : <PaginaPersonagemSelecionado />
};

    // return (
    //     <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.MEUS_PERSONAGENS, comCabecalho: false, usuarioObrigatorio: true }}>
    //         <ContextoJogadorPersonagensProvider>
    //             <div id={styles.recipiente_pagina_personagens}>
    //                 <PaginaMeusPersonagens_Slot />
    //             </div>
    //         </ContextoJogadorPersonagensProvider>
    //     </ControladorSlot>
    // );