// #region Import
import style from "./style.module.css";
// #endregion

const page: React.FC<{ valorAtual: number, valorMaximo: number, corBarra: string }> = ({ valorAtual, valorMaximo, corBarra }) => {
    const barWidth = (valorAtual / valorMaximo) * 100;

    return (
        <div className={style.barra_estatistica}>
            <div className={style.cor_barra_secundaria} style={{ background: `${corBarra}` }} />
            <div className={style.cor_barra} style={{ width: `${barWidth}%`, background: `${corBarra}` }} />

            <div className={style.texto_barra_estatistica}>
                <span className={style.span_estatistica}>{valorAtual} / {valorMaximo}</span>
            </div>
        </div>
    );
};

export default page;