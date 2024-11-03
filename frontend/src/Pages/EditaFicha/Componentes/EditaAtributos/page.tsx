// #region Imports
import style from './style.module.css';

import { useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';
import { GanhoIndividualNexAtributo } from 'Types/classes/index.ts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const { ganhosNex, atualizarFicha } = useFicha();

    const ganhoAtributo = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexAtributo)!;

    const alteraValor = (idAtributo:number, modificador:number) => {
        if (modificador > 0) {
            ganhoAtributo.adicionaPonto(idAtributo);
        } else {
            ganhoAtributo.subtraiPonto(idAtributo);
        }

        atualizarFicha();
    }

    return (
        <div className={style.editando_ficha_atributos}>
            <div className={style.atributo_contadores}>
                <h1>Atributos a Distribuir: {ganhoAtributo.ganhosAtributo.ganhos.valorAtual}</h1>
                {ganhoAtributo.ganhosAtributo.trocas.valorInicial > 0 && (
                    <h1>Atributos a Trocar: {ganhoAtributo.ganhosAtributo.trocas.valorAtual}</h1>
                )}
            </div>

            {ganhoAtributo.atributos.map((atributo, index) => (
                <div key={index} className={style.editar_atributo}>
                    <button onClick={() => {alteraValor(atributo.refAtributo.id, -1)}} disabled={!atributo.estaMaiorQueInicial && ganhoAtributo.ganhosAtributo.trocas.valorZerado}><FontAwesomeIcon icon={faMinus} /></button>
                    <div className={style.corpo_atributo}>
                        <h2>{atributo.refAtributo.nome}</h2>
                        <h2>{atributo.valorAtual}</h2>
                    </div>
                    <button onClick={() => {alteraValor(atributo.refAtributo.id, +1)}} disabled={atributo.estaEmValorMaximo || ganhoAtributo.ganhosAtributo.ganhos.valorZerado}><FontAwesomeIcon icon={faPlus} /></button>
                </div>
            ))}

            <div className={style.editando_ficha_estatisticas}>
                <div className={style.visualizador_estatistica}><h2>P.V.</h2><h2>{ganhosNex.pvAtualizado}</h2></div>
                <div className={style.visualizador_estatistica}><h2>P.S.</h2><h2>{ganhosNex.psAtualizado}</h2></div>
                <div className={style.visualizador_estatistica}><h2>P.E.</h2><h2>{ganhosNex.peAtualizado}</h2></div>
            </div>
        </div>
    );
}

export default page;