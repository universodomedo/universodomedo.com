import styles from './styles.module.css';

import { ArquivoInternoKey } from 'types-nora-api';

import { RenderArquivoInterno2 } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function TituloCard({ iconeCard, tituloCard }: { iconeCard: ArquivoInternoKey; tituloCard: string; }) {
    return (
        <div className={styles.recipiente_titulo_emblema}>
            <RenderArquivoInterno2 arquivoInterno={iconeCard} className={styles.icone_emblema} />
            <h2 className={styles.titulo_emblema}>{tituloCard}</h2>
        </div>
    );
};