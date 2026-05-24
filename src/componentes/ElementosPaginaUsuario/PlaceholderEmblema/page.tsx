import styles from './styles.module.css';

interface PlaceholderEmblemaProps {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}


export default function PlaceholderEmblema({
    onMouseEnter,
    onMouseLeave
}: PlaceholderEmblemaProps) {
    return (
        <>
            <div className={styles.placeholder_emblema}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >

                <img
                    className={styles.fundo_placeholder_emblema}
                    src="/fundo-ph.png"
                    alt=""
                />
                <img
                    className={styles.borda_placeholder_emblema}
                    src="/borda-ph-emblema.png"
                    alt=""
                />
                <img
                    className={styles.botao_placeholder_emblema}
                    src="/centro-ph-emblema.png"
                    alt=""
                />
            </div>
        </>
    );
}