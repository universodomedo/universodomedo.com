import { ARQUIVOS_INTERNOS } from 'types-nora-api';

import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';
import styles from './tituloDefinicao.module.css';

export default function TituloDefinicao({ titulo }: { titulo: string }) {
    const molduraEsquerda = carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__MOLDURA_TITULO_ESQUERDA);
    const molduraDireita = carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__MOLDURA_TITULO_DIREITA);

    return (
        <div className={styles.recipiente}>
            <span className={styles.moldura} style={{ backgroundImage: `url("${molduraEsquerda}")` }} />
            <h1 className={styles.titulo}>{titulo}</h1>
            <span className={styles.moldura} style={{ backgroundImage: `url("${molduraDireita}")` }} />
        </div>
    );
};