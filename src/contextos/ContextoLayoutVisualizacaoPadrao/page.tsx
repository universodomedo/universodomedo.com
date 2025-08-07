'use client';

import styles from './styles.module.css';

import { useContextoLayoutVisualizacaoPadrao } from "./contexto";
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';

export default function LayoutContextualizado() {
    const { conteudoGeral, conteudoMenu } = useContextoLayoutVisualizacaoPadrao();

    const { scrollableProps: scrollablePropsSempreVisivel } = useScrollable({ modo: 'sempreVisivel' });
    const { scrollableProps: scrollablePropsInteragindo } = useScrollable({ modo: 'visivelQuandoInteragindo' });

    return (
        <div id={styles.recipiente_layout_contextualizado}>
            <div id={styles.recipiente_corpo_layout_contextualizado}>
                <div id={styles.recipiente_conteudo_geral} {...scrollablePropsSempreVisivel}>{conteudoGeral}</div>
                <div id={styles.recipiente_conteudo_menu} {...scrollablePropsInteragindo}>{conteudoMenu}</div>
            </div>
        </div>
    );
};