'use client';

import styles from './styles.module.css';

import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

type BarraPersonagemProps = {
    ehMeuPersonagem?: boolean
};

export default function BarraPersonagem({ props }: { props?: BarraPersonagemProps }) {
    const { personagemSelecionado } = useContextoPaginaPersonagens();

    return (
        <div id={styles.recipiente_barra}>
            <div id={styles.recipiente_imagem_personagem}>
                <RecipienteImagem src={personagemSelecionado?.caminhoAvatar} />
            </div>
            <div id={styles.recipiente_informacoes_usuario}>
                <h1>{personagemSelecionado?.informacao.nome}</h1>
            </div>
        </div>
    );
};