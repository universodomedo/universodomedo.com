// #region Imports
import { Outlet } from "react-router-dom";

import MenuSwiperEsquerda from 'Componentes/MenuSwiperEsquerda/page.tsx';
import SecaoTopo from 'Componentes/SecaoTopo/pagina.tsx';
// #endregion

const LayoutDeslogado = () => {
    return (
        <>
            <MenuSwiperEsquerda />
            <SecaoTopo />
            <Outlet />
        </>
    );
};

export default LayoutDeslogado;