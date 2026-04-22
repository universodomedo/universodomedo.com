import styles from './styles.module.css';

import { CaminhoArquivoArte } from 'types-nora-api';

import { RenderArquivoArteCapa } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function RecipienteCapa({ caminhoArquivoArteCapa, className }: { caminhoArquivoArteCapa: CaminhoArquivoArte, className?: string }) {
    return (
        <div className={styles.recipiente_capa}>
            <RenderArquivoArteCapa caminhoArquivoArte={caminhoArquivoArteCapa} className={className} />
        </div>
    );
};