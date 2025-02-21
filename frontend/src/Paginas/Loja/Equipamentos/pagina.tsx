// #region Imports
import style from 'Paginas/Loja/style.module.css';

import { useContextoLoja } from 'Contextos/ContextoLoja/contexto.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAstronaut, faWrench, faBagShopping } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const { mudarPagina } = useContextoLoja();

    return (
        <>
            <h2>Adicionar Equipamentos</h2>

            <div className={style.recipiente_area_botoes_equipamentos}>
                <button onClick={() => { mudarPagina(3) }} className={style.botao_equipamento}><FontAwesomeIcon icon={faUserAstronaut} />Vestimentas</button>
                <button onClick={() => { mudarPagina(4) }} className={style.botao_equipamento}><FontAwesomeIcon icon={faWrench} />Utensílios</button>
                <button onClick={() => { mudarPagina(5) }} className={style.botao_equipamento}><FontAwesomeIcon icon={faBagShopping} />Mochilas</button>
            </div>

            <div className={style.area_botao_tipo_item}>
                <button onClick={() => {mudarPagina(0)}}>Voltar</button>
            </div>
        </>
    );
}

export default page;