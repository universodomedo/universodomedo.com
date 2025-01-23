// #region Imports
import style from './style.module.css';

import img1 from "Assets/img1.svg";
// #endregion

const page = () => {
    return (
        <>
            <div className={style.titulo}>
                <h1>Descubra o</h1>
                <h1>Paranormal</h1>
            </div>

            <div className={style.paragrafo}>
                <p>Faça parte da guerra entre a Humanidade e o Paranormal</p>
                <p>Enfrente seus demônios internos e desvende os Segredos da Realidade</p>
            </div>

            <div id={style.imagem_secao_inicial} style={{ backgroundImage: `url(${img1})`}}></div>
        </>
    );
}

export default page;