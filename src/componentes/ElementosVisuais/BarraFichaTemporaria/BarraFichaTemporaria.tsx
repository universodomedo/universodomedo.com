'use client';

import styles from './styles.module.css';

import { FichaTemporariaVisualizacaoDetalhadaDto } from 'types-nora-api';

import { RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

type BarraFichaTemporariaProps = {
    fichaTemporaria: FichaTemporariaVisualizacaoDetalhadaDto;
    ehMinhaFichaTemporaria?: boolean
};

export default function BarraFichaTemporaria({ props }: { props: BarraFichaTemporariaProps }) {
    return (
        <div className={styles.recipiente_barra}>
            <div className={styles.recipiente_imagem_personagem}>
                <RenderArquivoAvatar caminhoArquivoAvatar={props.fichaTemporaria.avatarAtual} />
            </div>
            <div id={styles.recipiente_informacoes_usuario}>
                <h1>{props.fichaTemporaria.nome}</h1>
            </div>
        </div>
    );
};