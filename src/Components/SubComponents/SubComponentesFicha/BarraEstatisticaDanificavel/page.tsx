// #region Import
import style from "./style.module.css";
// #endregion

const page: React.FC<{ pvAtual:number, pvMaximo:number, corBarra:string }> = ({ pvAtual, pvMaximo, corBarra }) => {
    const barWidth = (pvAtual / pvMaximo) * 100;

    return (
        <div className={style.barra_estatistica}>
            <div className={style.cor_barra_secundaria} style={{ background: `${corBarra}` }}/>
            <div className={style.cor_barra} style={{ width: `${barWidth}%`, background: `${corBarra}` }}/>

            <div className={style.texto_barra_estatistica}>
                <span className={style.span_estatistica}>{pvAtual} / {pvMaximo}</span>
            </div>
        </div>
    );
};

export default page;