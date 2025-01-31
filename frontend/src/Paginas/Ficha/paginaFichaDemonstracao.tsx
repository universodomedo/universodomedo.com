// #region Imports
import Ficha from 'Paginas/Ficha/pagina.tsx';
// #endregion

const page = () => {
    return (
        <Ficha seletorFicha={ {tipo: 'fichaDemonstracao' } } />
    );
}

export default page;