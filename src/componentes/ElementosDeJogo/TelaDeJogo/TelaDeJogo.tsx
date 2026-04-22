import styles from './styles.module.css';

import { CaminhoArquivoArte } from 'types-nora-api';

import { RenderArquivoArteCapa } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function TelaDeJogo({ capaSessao }: { capaSessao: CaminhoArquivoArte }) {
    return (
        <div className={styles.recipiente_tela_jogo}>
            <RenderArquivoArteCapa caminhoArquivoArte={capaSessao} />
        </div>
    );
};