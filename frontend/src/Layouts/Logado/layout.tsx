// #region Imports
import style from '../estilo_layouts.module.css';

import { Outlet } from "react-router-dom";

import MenuSwiperEsquerda from 'Componentes/MenuSwiperEsquerda/pagina';
import SecaoTopo from 'Componentes/SecaoTopo/pagina.tsx';
// #endregion

const LayoutLogado = () => {
    return (
        <>
            <MenuSwiperEsquerda />
            <section id={style.cabecalho}>
                <SecaoTopo />
            </section>
            <section id={style.corpo}>
                <Outlet />
            </section>
        </>
    );
};

export default LayoutLogado;