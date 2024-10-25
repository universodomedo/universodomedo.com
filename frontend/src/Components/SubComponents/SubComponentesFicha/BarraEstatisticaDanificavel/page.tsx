// #region Import
import style from "./style.module.css";
// #endregion

const page: React.FC<{ titulo?: string, valorAtual: number, valorMaximo: number, corBarra: string, corBarraSecundaria?: string }> = ({ titulo, valorAtual, valorMaximo, corBarra, corBarraSecundaria }) => {
    const barWidth = (valorAtual / valorMaximo) * 100;

    return (
        <div className={style.estatistica_barra}>
            {titulo && (<h2>{titulo}</h2>)}
            <div className={style.barra_estatistica}>
                {corBarraSecundaria ? (
                    <div className={style.cor_barra_secundaria_customizada} style={{ background: `${corBarraSecundaria}` }} />
                ) : (
                    <div className={style.cor_barra_secundaria} style={{ background: `${corBarra}` }} />
                )}
                <div className={style.cor_barra} style={{ width: `${barWidth}%`, background: `${corBarra}` }} />

                <div className={style.texto_barra_estatistica}>
                    <span className={style.span_estatistica}>{valorAtual} / {valorMaximo}</span>
                </div>
            </div>
        </div>
    );
};

export default page;