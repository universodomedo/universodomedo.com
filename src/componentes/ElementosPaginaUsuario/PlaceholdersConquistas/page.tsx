import styles from './styles.module.css';

export default function PlaceholdersConquistas() {
    return (
        <>
            <div className={styles.recipiente_placeholders}>

                <div className={styles.placeholder_conquistas}>
                    <img className={styles.fundo_placeholder} src="/fundo-ph-conquistas.png" alt="" />
                    <img className={styles.botao_placeholder} src="/placeholder-conquistas.svg" alt="" />
                </div>
                
            </div>
        </>
    )
}