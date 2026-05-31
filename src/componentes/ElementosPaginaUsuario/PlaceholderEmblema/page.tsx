import styles from './styles.module.css';

import { RenderArquivoInterno2 } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function PlaceholderEmblema({ onMouseEnter, onMouseLeave }: { onMouseEnter?: () => void; onMouseLeave?: () => void; }) {
    return (
        <div className={styles.placeholder_emblema} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <RenderArquivoInterno2 arquivoInterno={"PERFIL_USUARIO__FUNDO_PLACEHOLDER"} className={styles.fundo_placeholder_emblema} />
            <RenderArquivoInterno2 arquivoInterno={"PERFIL_USUARIO__BORDA_PLACEHOLDER"} className={styles.borda_placeholder_emblema} />
            <RenderArquivoInterno2 arquivoInterno={"PERFIL_USUARIO__CENTRO_PLACEHOLDER"} className={styles.botao_placeholder_emblema} />
        </div>
    );
};