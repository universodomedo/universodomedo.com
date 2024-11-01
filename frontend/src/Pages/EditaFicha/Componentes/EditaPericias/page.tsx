// #region Imports
import style from './style.module.css';

import { useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';
import { GanhoIndividualNexAtributo, GanhoIndividualNexPericia } from 'Types/classes/index.ts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const { ganhosNex, atualizarFicha } = useFicha();

    const ganhoAtributo = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexAtributo)!;
    const ganhoPericia = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexPericia)!;

    const alteraValor = (idAtributo:number, modificador:number) => {
        if (modificador > 0) {
            ganhoPericia.adicionaPonto(idAtributo);
        } else {
            ganhoPericia.subtraiPonto(idAtributo);
        }

        atualizarFicha();
    }

    return (
        <>
            <div className={style.visualizacao_atributos}>
                {ganhoAtributo.atributos.map((atributo, index) => (
                    <div key={index} className={style.div_atributo}>
                        <h1>{atributo.refAtributo.nomeAbrev}</h1>
                        <h1>{atributo.valorAtual}</h1>
                    </div>
                ))}
            </div>

            <div className={style.editando_ficha_pericias}>
                <div className={style.pericia_contadores}>
                    <h1>Pericias a Treinar: {ganhoPericia.ganhosPericias.treinadas!.ganhos.valorAtual}</h1>
                    {ganhoPericia.ganhosPericias.treinadas!.trocas.valorInicial > 0 && (
                        <h1>Pericias a Trocar: {ganhoPericia.ganhosPericias.treinadas!.trocas.valorInicial}</h1>
                    )}
                </div>

                <div className={style.conjunto_pericias}>
                    {ganhoPericia.pericias.map((pericia, index) => (
                        <div key={index} className={style.editar_pericia}>
                            <button onClick={() => {alteraValor(pericia.refPericia.id, -1)}} disabled={pericia.estaEmValorMinimo || ganhoPericia.ganhosPericias.treinadas!.trocas.valorZerado}><FontAwesomeIcon icon={faMinus} /></button>
                            <div className={style.corpo_pericia}>
                                <h2>{pericia.refPericia.nome}</h2>
                                <h2>{pericia.refPatenteAtual.nome}</h2>
                            </div>
                            <button onClick={() => {alteraValor(pericia.refPericia.id, +1)}} disabled={pericia.podeAumentar}><FontAwesomeIcon icon={faPlus} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default page;