// #region Imports
import style from './style.module.css';

import { useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const { ganhosNex, atualizarFicha } = useFicha();

    const alteraValor = (idAtributo:number, modificador:number) => {

    }

    return (
        <>
            <div className={style.visualizacao_atributos}>
                {ganhosNex.estadoGanhosNex.atributos.map((atributo, index) => (
                    <div key={index} className={style.div_atributo}>
                        <h1>{atributo.refAtributo.nomeAbrev}</h1>
                        <h1>{atributo.valorAtual}</h1>
                    </div>
                ))}
            </div>

            <div className={style.editando_ficha_atributos}>
                <div className={style.pericia_contadores}>
                    {/* <h1>Pericias a Treinar: {ganhosNex.estadoGanhosNex.pericias}</h1> */}
                </div>
            </div>
        </>
    );
}

export default page;