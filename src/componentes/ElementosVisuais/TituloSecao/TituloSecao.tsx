import styles from './styles.module.css'

import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';

type TituloSecaoProps = {
    primeiraLetra?: string;
    corpo: string;
    ultimaLetra?: string;
};

export default function TituloSecao({primeiraLetra, corpo, ultimaLetra } : TituloSecaoProps) {
    return (
        <div className={styles.recipiente_titulo}>
            <h2 className={styles.titulo_jogo} style={{ ['--moldura-direita' as never]: `url("${carregaArquivoInterno({ arquivo: "PAGINA_ATERRISSAGEM__MOLDURA_TITULO_DIREITA" })}")`, ['--moldura-esquerda' as never]: `url("${carregaArquivoInterno({ arquivo: "PAGINA_ATERRISSAGEM__MOLDURA_TITULO_ESQUERDA" })}")` }}>
                <span className={styles.cinzel_decorative}>{primeiraLetra}</span>{corpo}<span className={styles.cinzel_decorative}>{ultimaLetra}</span>
            </h2>
        </div>
    );
};