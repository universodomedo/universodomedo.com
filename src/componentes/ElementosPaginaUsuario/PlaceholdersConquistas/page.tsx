import styles from './styles.module.css';

import { RenderArquivoInterno2 } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function PlaceholdersConquistas() {
    return (
        <div className={styles.recipiente_placeholders}>
            <div className={styles.placeholder_conquistas}>
                <RenderArquivoInterno2 arquivoInterno={"PERFIL_USUARIO__FUNDO_PLACEHOLDER"} className={styles.fundo_placeholder} />
                <RenderArquivoInterno2 arquivoInterno={"PERFIL_USUARIO__PLACEHOLDER_CONQUISTA"} className={styles.botao_placeholder} />
            </div>
        </div>
    );
};