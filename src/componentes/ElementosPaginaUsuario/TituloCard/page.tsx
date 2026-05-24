import styles from './styles.module.css';

type TituloCardProps = {
 iconeCard: string,
 tituloCard: string,
}

export default function TituloCard({
    iconeCard,
    tituloCard,
}: TituloCardProps) {

    

    return (
        <>
            <div className={styles.recipiente_titulo_emblema}>
                <img className={styles.icone_emblema} src={iconeCard} />
                <h2 className={styles.titulo_emblema}>{tituloCard}</h2>
            </div>
        </>
    );
}