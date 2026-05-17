'useClient'
import { useState } from 'react';
import styles from './styles.module.css';

import PlaceholderEmblema from '../PlaceholderEmblema/page';
import TituloCard from '../TituloCard/page';


export default function CardEmblema() {

    const [hoverEmblema, setHoverEmblema] = useState(false)

    return (
        <>
            <div className={styles.recipiente_emblema}>
                <div className={styles.area_emblema}>

                    <TituloCard iconeCard='/icone-emblemas.png' tituloCard='Emblema' />

                    <div className={styles.recipiente_desenho_emblema}>
                        <img className={styles.ornamento_emblema} src="/ornamento-bg-emblema.png" alt="" />

                        <PlaceholderEmblema
                            onMouseEnter={() => setHoverEmblema(true)}
                            onMouseLeave={() => setHoverEmblema(false)}
                        />

                        <div className={styles.recipiente_setas_circulares}>
                            <div
                                className={`${styles.seta_circular_emblema} ${hoverEmblema ? styles.animar_seta : ''
                                    }`}
                            />
                        </div>
                    </div>

                    <h3>Selecione um Emblema</h3>
                </div>
            </div>
        </>
    )
}