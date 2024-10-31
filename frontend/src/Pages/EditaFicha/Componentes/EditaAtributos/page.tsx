// #region Imports
import style from './style.module.css';

import { useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const { ganhosNex, atualizarFicha } = useFicha();

    const alteraValor = (idAtributo:number, modificador:number) => {
        ganhosNex.estadoGanhosNex.gastaPonto(idAtributo, modificador);
        atualizarFicha();
    }

    return (
        <div className={style.editando_ficha_atributos}>
            <div className={style.atributo_contadores}>
                <h1>Atributos a Distribuir: {ganhosNex.estadoGanhosNex.ganhosAtributos.valorRestante}</h1>
                <h1>Atributos a Trocar: {ganhosNex.estadoGanhosNex.trocasAtributos.valorRestante}</h1>
            </div>

            {ganhosNex.estadoGanhosNex.atributos.map((atributoNexUp, index) => (
                <div key={index} className={style.atributo_referencia}>
                    <div className={style.editar_atributo}>
                        <button onClick={() => {alteraValor(atributoNexUp.refAtributo.id, -1)}} disabled={!atributoNexUp.estaMaiorQueInicial && ganhosNex.estadoGanhosNex.trocasAtributos.finalizado}><FontAwesomeIcon icon={faMinus} /></button>
                        <div className={style.corpo_atributo}>
                            <h2>{atributoNexUp.refAtributo.nome}</h2>
                            <h2>{atributoNexUp.valorAtual}</h2>
                        </div>
                        <button onClick={() => {alteraValor(atributoNexUp.refAtributo.id, +1)}} disabled={atributoNexUp.estaEmValorMaximo || ganhosNex.estadoGanhosNex.ganhosAtributos.finalizado}><FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                </div>
            ))}

            <div className={style.editando_ficha_estatisticas}>
                <div className={style.visualizador_estatistica}><h2>P.V.</h2><h2>{ganhosNex.estadoGanhosNex.pvFinal}</h2></div>
                <div className={style.visualizador_estatistica}><h2>P.S.</h2><h2>{ganhosNex.estadoGanhosNex.psFinal}</h2></div>
                <div className={style.visualizador_estatistica}><h2>P.E.</h2><h2>{ganhosNex.estadoGanhosNex.peFinal}</h2></div>
            </div>
        </div>
    );
}

export default page;