'use client';

import styles from '../styles.module.css';

import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import BarraPersonagem from 'Componentes/ElementosVisuais/BarraPersonagem/BarraPersonagem'

export default function SPA__VisualizaPersonagem__VisualizacaoInicial() {
    const { personagemSelecionado } = useContextoPaginaPersonagens();

    return (
        <div className={styles.recipiente_conteudo_pagina_personagem_selecionado}>
            <BarraPersonagem />
        </div>
    );
};