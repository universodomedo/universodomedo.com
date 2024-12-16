// #region Imports
import style from 'Pages/Shop/style.module.css';

import { useContextoLoja } from 'Pages/Shop/contexto.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAstronaut, faWrench, faBagShopping } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const { mudarPagina } = usePagina();

    return (
        <>
            <h2>Adicionar Equipamentos</h2>

            <div className={style.botoes_itens_2}>
                <button onClick={() => { mudarPagina(3) }} className={style.botao_itens_2}><FontAwesomeIcon icon={faUserAstronaut} />Vestimentas</button>
                <button onClick={() => { mudarPagina(4) }} className={style.botao_itens_2}><FontAwesomeIcon icon={faWrench} />Utensílios</button>
                <button onClick={() => { mudarPagina(5) }} className={style.botao_itens_2}><FontAwesomeIcon icon={faBagShopping} />Mochilas</button>
            </div>

            <div className={style.area_botao_tipo_item}>
                <button onClick={voltaParaPaginaInicial}>Voltar</button>
            </div>
        </>
    );
}

export default page;