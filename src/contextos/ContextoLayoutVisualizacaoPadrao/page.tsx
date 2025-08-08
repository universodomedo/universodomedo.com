'use client';

import styles from './styles.module.css';

import { useContextoLayoutVisualizacaoPadrao } from "./contexto";
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import Link from 'next/link';

export default function LayoutContextualizado() {
    const { conteudoGeral, conteudoMenu, hrefPaginaParaVoltar } = useContextoLayoutVisualizacaoPadrao();

    const { scrollableProps: scrollablePropsSempreVisivel } = useScrollable({ modo: 'sempreVisivel' });
    const { scrollableProps: scrollablePropsInteragindo } = useScrollable({ modo: 'visivelQuandoInteragindo' });

    return (
        <div id={styles.recipiente_layout_contextualizado}>
            <div id={styles.recipiente_corpo_layout_contextualizado}>
                <div id={styles.recipiente_conteudo_geral} {...scrollablePropsSempreVisivel}>
                    {hrefPaginaParaVoltar && <FerramentaRetornoPagina />}
                    {conteudoGeral}
                </div>
                <div id={styles.recipiente_conteudo_menu} {...scrollablePropsInteragindo}>{conteudoMenu}</div>
            </div>
        </div>
    );
};

function FerramentaRetornoPagina() {
    const { hrefPaginaParaVoltar } = useContextoLayoutVisualizacaoPadrao();

    if (!hrefPaginaParaVoltar) return;

    return (
        <Link href={hrefPaginaParaVoltar}>
            <div id={styles.recipiente_icone_acao_voltar_pagina_aventuras} title='Voltar'>
                <span>x</span>
            </div>
        </Link>
    );
};