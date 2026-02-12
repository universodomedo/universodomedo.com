import styles from './styles.module.css';

import LinkInterno from '../LinkInterno/LinkInterno';
import { type DestinoInput } from 'Funcionalidades/navegacaoInterna';
import { DivClicavel } from '../DivClicavel/DivClicavel';

export type LayoutContextualizadoFecharProps =
    (| { tipo: 'href'; paginaRetorno: DestinoInput; } | { tipo: 'acao'; executar: () => void; })
    & { style?: React.CSSProperties; tituloTooltip: string };

export function FerramentaRetornoPagina({ props }: { props: LayoutContextualizadoFecharProps }) {
    const elementoVisual = <ElementoVisual tituloTooltip={props.tituloTooltip} style={props.style} />;

    if (props.tipo === 'href') return <LinkInterno className={styles.link_retorno} destino={props.paginaRetorno}>{elementoVisual}</LinkInterno>;
    if (props.tipo === 'acao') return <DivClicavel className={styles.link_retorno} onClick={() => props.executar()}>{elementoVisual}</DivClicavel>;
};

function ElementoVisual({ tituloTooltip, style }: { tituloTooltip: string; style?: React.CSSProperties }) {
    return (
        <div id={styles.recipiente_icone_acao_voltar_pagina_aventuras} title={tituloTooltip} style={style}>
            <span>x</span>
        </div>
    );
};