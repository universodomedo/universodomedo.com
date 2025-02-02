// #region Imports
import style from '../estilo_layouts.module.css';

import { Outlet } from "react-router-dom";

import MenuSwiperEsquerda from 'Componentes/MenuSwiperEsquerda/pagina';
import SecaoTopo from 'Componentes/SecaoTopo/pagina.tsx';
// #endregion

const LayoutDeslogado = () => {
    return (
        <>
            <MenuSwiperEsquerda layout={'deslogado'} />
            <section id={style.cabecalho}>
                <SecaoTopo layout={'deslogado'} />
            </section>
            <section id={style.corpo}>
                <Outlet />
            </section>
        </>
    );
};

export default LayoutDeslogado;