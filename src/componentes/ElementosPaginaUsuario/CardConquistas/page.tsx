import styles from './styles.module.css';

import { ARQUIVOS_INTERNOS } from 'types-nora-api';

import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';
import TituloCard from '../TituloCard/page';
import PlaceholdersConquistas from '../PlaceholdersConquistas/page';

export default function CardConquistas() {
    return (
        <div className={styles.recipiente_conquistas}>
            <div className={styles.area_conquistas} style={{ '--moldura-conquistas': `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PERFIL_USUARIO__MOLDURA_CONQUISTA)}")`, '--ornamento-conquistas': `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PERFIL_USUARIO__ORNAMENTO_CONQUISTA)}")` } as React.CSSProperties}>
                <TituloCard iconeCard={"PERFIL_USUARIO__ICONE_CONQUISTA"} tituloCard={"Conquistas"} />

                <div className={styles.recipiente_icones_conquistas}>
                    <PlaceholdersConquistas />
                    <PlaceholdersConquistas />
                    <PlaceholdersConquistas />
                </div>
            </div>
        </div>
    );
};