'use client';

import styles from '../styles.module.css';

import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import BarraPersonagem from 'Componentes/ElementosVisuais/BarraPersonagem/BarraPersonagem'
import BotaoEvoluir from 'Componentes/ElementosVisuais/BotaoEvoluir/BotaoEvoluir';
import VisualizacaoFichaDeJogo from 'Componentes/ElementosVisuais/VisualizacaoFichaDeJogo/VisualizacaoFichaDeJogo';

export default function SPA__VisualizaPersonagem__EditavelInicial() {
    

    return (
        <></>
    );

    // return (
    //     <div className={styles.recipiente_conteudo_pagina_personagem_selecionado}>
    //         <BarraPersonagem />
    //         <BotaoEvoluir />
    //         {personagemSelecionado?.fichaVigente && personagemSelecionado?.fichaVigente.ficha.fichaDeJogo && <VisualizacaoFichaDeJogo fichaDeJogo={personagemSelecionado?.fichaVigente.ficha.fichaDeJogo} />}
    //     </div>
    // );
};