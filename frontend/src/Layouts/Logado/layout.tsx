// #region Imports
import style from '../estilo_layouts.module.css';

import { Outlet } from "react-router-dom";

import MenuSwiperEsquerda from 'Componentes/MenuSwiperEsquerda/pagina';
import SecaoTopo from 'Componentes/SecaoTopo/pagina.tsx';
// #endregion

const LayoutLogado = () => {
    return (
        <>
            <MenuSwiperEsquerda layout={'logado'} />
            <section id={style.cabecalho}>
                <SecaoTopo layout={'logado'} />
            </section>
            <section id={style.corpo}>
                <Outlet />
            </section>
        </>
    );
};

export default LayoutLogado;