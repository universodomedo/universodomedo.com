'use client';

import styles from './styles.module.css';

import { PersonagemVisualizacaoDetalhadaDto } from 'types-nora-api';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

type BarraPersonagemProps = {
    personagem: PersonagemVisualizacaoDetalhadaDto;
    ehMeuPersonagem?: boolean
};

export default function BarraPersonagem({ props }: { props: BarraPersonagemProps }) {
    return (
        <div className={styles.recipiente_barra}>
            <div className={styles.recipiente_imagem_personagem}>
                <RecipienteImagem src={props.personagem.caminhoAvatar} />
            </div>
            <div id={styles.recipiente_informacoes_usuario}>
                <h1>{props.personagem.nome}</h1>
            </div>
        </div>
    );
};