// #region Imports
import style from "./style.module.css";
// #endregion

const page = () => {
    return (
        <div className={style.container_caixa_informacaco}>
            <div className={style.cabecalho_caixa_informacao}>
                <span>Aprimorar Acrobacia</span>
            </div>

            <div className={style.corpo_caixa_informacao}>
                <span>Ritual</span>
                <span>1º Círculo Fraco</span>
                <span>Elemento: Energia</span>
                <span>Duração: 1 Cena</span>
                <span>Custo: 2 P.E.</span>
                <span>+2 ACRO</span>
            </div>

            <div className={style.rodape_caixa_informacao}>
                
            </div>
        </div>
    );
}

export default page;