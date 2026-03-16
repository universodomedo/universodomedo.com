import styles from './styles.module.css';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function TelaDeJogo({ capaSessao }: { capaSessao: string }) {
    return (
        <div className={styles.recipiente_tela_jogo}>
            <RecipienteImagem src={capaSessao} />
        </div>
    );
};