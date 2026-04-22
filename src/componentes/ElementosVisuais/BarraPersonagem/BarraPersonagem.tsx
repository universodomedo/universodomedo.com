'use client';

import styles from './styles.module.css';

import { PersonagemVisualizacaoDetalhadaDto } from 'types-nora-api';

import { RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

type BarraPersonagemProps = {
    personagem: PersonagemVisualizacaoDetalhadaDto;
    ehMeuPersonagem?: boolean
};

export default function BarraPersonagem({ props }: { props: BarraPersonagemProps }) {
    return (
        <div className={styles.recipiente_barra}>
            <div className={styles.recipiente_imagem_personagem}>
                <RenderArquivoAvatar caminhoArquivoAvatar={props.personagem.avatarAtual} />
            </div>
            <div id={styles.recipiente_informacoes_usuario}>
                <h1>{props.personagem.nome}</h1>
            </div>
        </div>
    );
};