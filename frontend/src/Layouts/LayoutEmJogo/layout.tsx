// #region Imports
import style from "./style.module.css";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import logo from 'Components/Assets/logo.png'
// #endregion

const LayoutEmJogo = () => {
    const [swiperEsquerdaAberto, setSwiperEsquerdaAberto] = useState(false);

    const alternaSwiperEsquerdaAberto = () => setSwiperEsquerdaAberto(!swiperEsquerdaAberto);

    return (
        <div id={style.layout_em_jogo}>
            {swiperEsquerdaAberto && <div className={style.overlay_swiper_esquerda} onClick={alternaSwiperEsquerdaAberto}></div>}
            <div className={`${style.swiper_esquerda} ${swiperEsquerdaAberto ? style.swiper_esquerda_aberto : ''}`}>
                <nav>
                    <p>Link 1</p>
                    <p>Link 2</p>
                    <p>Link 3</p>
                </nav>
            </div>

            <div id={style.layout_em_jogo_cabecalho}>
                <div className={style.conteudo_cabecalho_esquerda}>
                    <div className={style.botao_cabecalho_swiper_esquerda} onClick={alternaSwiperEsquerdaAberto}><FontAwesomeIcon icon={faBars} style={{ width: '100%', height: '100%' }} /></div>
                    <div className={style.logo_cabecalho} style={{ backgroundImage: `url(${logo})` }} />
                </div>
                <div className={style.conteudo_cabecalho_direita}>
                    <div className={style.logavel}>
                        <div className={style.imagem_logavel} />
                        <div className={style.info_logavel}>
                            <h2 className='noMargin'>Nome Logado</h2>
                            <h3 className='noMargin'>Informações Logado</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div id={style.layout_em_jogo_main}>
                <Outlet />
            </div>
        </div>
    );
}

export default LayoutEmJogo;