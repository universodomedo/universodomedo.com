// #region Imports
import Ficha from 'Paginas/Ficha/pagina.tsx';

import { useLocation } from 'react-router-dom';
// #endregion

const page = () => {
    const location = useLocation();
    const indexFicha = location.state?.indexFicha;

    return (
        <Ficha seletorFicha={ {tipo: 'ficha', idFichaNoLocalStorage: indexFicha } } />
    );
}

export default page;