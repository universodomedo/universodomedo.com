'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { ARQUIVOS_INTERNOS } from 'types-nora-api';

import TituloCard from '../TituloCard/page';
import { RenderArquivoInterno2 } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';
import PlaceholderEmblema from '../PlaceholderEmblema/page';
import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';

export default function CardEmblema() {
    const [hoverEmblema, setHoverEmblema] = useState(false)

    return (
        <div className={styles.recipiente_emblema}>
            <div className={styles.area_emblema} style={{ '--ornamento-conquistas': `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PERFIL_USUARIO__ORNAMENTO_CONQUISTA)}")`, '--moldura-emblema': `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PERFIL_USUARIO__MOLDURA_EMBLEMA)}")` } as React.CSSProperties}>
                <TituloCard iconeCard={"PERFIL_USUARIO__ICONE_EMBLEMA"} tituloCard={"Emblema"} />

                <div className={styles.recipiente_desenho_emblema} style={{ '--fundo': `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PERFIL_USUARIO__IMAGEM_FUNDO_EMBLEMA)}")` } as React.CSSProperties}>
                    <RenderArquivoInterno2 arquivoInterno={"PERFIL_USUARIO__ORNAMENTO_BUG_EMBLEMA"} className={styles.ornamento_emblema} />

                    <PlaceholderEmblema onMouseEnter={() => setHoverEmblema(true)} onMouseLeave={() => setHoverEmblema(false)} />

                    <div className={styles.recipiente_setas_circulares} style={{ ['--setas-circulares' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PERFIL_USUARIO__SETAS_CIRCULARES)}")` }}>
                        <div className={`${styles.seta_circular_emblema} ${hoverEmblema ? styles.animar_seta : ''}`} />
                    </div>
                </div>

                <h3>Selecione um Emblema</h3>
            </div>
        </div>
    );
};