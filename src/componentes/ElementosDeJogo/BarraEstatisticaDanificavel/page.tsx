import styles from "./styles.module.css";

export default function BarraEstatisticaDanificavel({ titulo, valorAtual, valorMaximo, corBarra, corBarraSecundaria }: { titulo?: string, valorAtual: number, valorMaximo: number, corBarra: string, corBarraSecundaria?: string }) {
    const barWidth = (valorAtual / valorMaximo) * 100;

    return (
        <div className={styles.estatistica_barra}>
            {titulo && (<h3>{titulo}</h3>)}
            <div className={styles.barra_estatistica}>
                {corBarraSecundaria ? (
                    <div className={styles.cor_barra_secundaria_customizada} style={{ background: `${corBarraSecundaria}` }} />
                ) : (
                    <div className={styles.cor_barra_secundaria} style={{ background: `${corBarra}` }} />
                )}
                <div className={styles.cor_barra} style={{ width: `${barWidth}%`, background: `${corBarra}` }} />

                <div className={styles.texto_barra_estatistica}>
                    <span className={styles.span_estatistica}>{valorAtual} / {valorMaximo}</span>
                </div>
            </div>
        </div>
    );
};