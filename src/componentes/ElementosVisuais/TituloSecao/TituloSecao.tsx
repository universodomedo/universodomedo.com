import styles from './styles.module.css'

type TituloSecaoProps = {
    primeiraLetra?: string;
    corpo: string;
    ultimaLetra?: string;
}

export default function TituloSecao({primeiraLetra, corpo, ultimaLetra } : TituloSecaoProps) {
    return (
        <div className={styles.recipiente_titulo} >
            <h2 className={styles.titulo_jogo}><span className={styles.cinzel_decorative}>{primeiraLetra}</span>{corpo}<span className={styles.cinzel_decorative}>{ultimaLetra}</span></h2>
        </div>
    )
}