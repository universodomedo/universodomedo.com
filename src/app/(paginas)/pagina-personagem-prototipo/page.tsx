'use client';

import styles from './styles.module.css';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { personagemSelecionado } from './data';

export default function Pagina() {
    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo props={ personagemSelecionado ? { tipo: 'acao', executar: () => {}, tituloTooltip: 'Voltar', style:{top: '2.6%', left: '1.1%'} } : undefined}>
                {PageLayout()}
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <></>
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function PageLayout() {
    return (
        <div id={styles.recipiente_conteudo_pagina_personagem_selecionado}>
            <div id={styles.recipiente_barra}>
                <div id={styles.recipiente_imagem_personagem}>
                    <RecipienteImagem src={personagemSelecionado?.caminhoAvatar} />
                </div>
                <div id={styles.recipiente_informacoes_usuario}>
                    <h1>{personagemSelecionado?.informacao.nome}</h1>
                </div>
            </div>
        </div>
    );
};