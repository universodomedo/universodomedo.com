'use client';

import { useContextoPaginaJogador } from 'Contextos/ContextoPaginaJogador/contexto';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';
import AvisosSessoesPrevistas from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvisosSessoesPrevistas/AvisosSessoesPrevistas';
import UnificaPersonagemEFichaParaUsuario from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/UnificaPersonagemEFichaParaUsuario/UnificaPersonagemEFichaParaUsuario';

export default function SPA__PaginaJogador__PaginaInicial() {
    const { personagens, fichas, sessoes, setIdSessaoEmFoco } = useContextoPaginaJogador();
    
    return (
        <>
            <AvisosDePersonagensEFichas />
            <AvisosSessoesPrevistas sessoes={sessoes} selecionaSessao={setIdSessaoEmFoco} />
            <UnificaPersonagemEFichaParaUsuario personagens={personagens} fichasTemporarias={fichas} />
        </>
    );
};