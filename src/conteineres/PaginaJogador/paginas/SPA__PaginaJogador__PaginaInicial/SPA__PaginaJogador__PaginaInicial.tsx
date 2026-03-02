'use client';

import styles from './styles.module.css';

import { useContextoPaginaJogador } from 'Contextos/ContextoPaginaJogador/contexto';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';
import AvisosSessoesPrevistas from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvisosSessoesPrevistas/AvisosSessoesPrevistas';
import UnificaPersonagemEFichaParaUsuario from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/UnificaPersonagemEFichaParaUsuario/UnificaPersonagemEFichaParaUsuario';

export default function SPA__PaginaJogador__PaginaInicial() {
    const { personagens, fichas, sessoes } = useContextoPaginaJogador();
    
    return (
        <>
            <AvisosDePersonagensEFichas />
            <AvisosSessoesPrevistas sessoes={sessoes} />
            <UnificaPersonagemEFichaParaUsuario personagens={personagens} fichasTemporarias={fichas} />
        </>
    );
};