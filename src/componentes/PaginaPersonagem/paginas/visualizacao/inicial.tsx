'use client';

import styles from 'Componentes/PaginaPersonagem/styles.module.css';

import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import BarraPersonagem from 'Componentes/PaginaPersonagem/componentes/BarraPersonagem/BarraPersonagem'

export default function PaginaVisualizacao_Inicial() {
    const { personagemSelecionado } = useContextoPaginaPersonagens();

    return (
        <div id={styles.recipiente_conteudo_pagina_personagem_selecionado}>
            <BarraPersonagem />
        </div>
    );
};