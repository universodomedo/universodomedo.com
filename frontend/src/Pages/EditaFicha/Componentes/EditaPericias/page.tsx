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

    const alteraValor = (idPericia:number, modificador:number) => {
        if (modificador > 0) {
            ganhoPericia.adicionaPonto(idPericia);
        } else {
            ganhoPericia.subtraiPonto(idPericia);
        }

        atualizarFicha();
    }

    return (
        <>
            <div className={style.editando_ficha_pericias}>
                <div className={style.pericia_contadores}>
                    {ganhoPericia.ganhosPericias.treinadas?.alterando && (
                        <div className={style.patente_contadores}>
                            <h1>Pericias Treinadas: {ganhoPericia.ganhosPericias.treinadas!.ganhos.valorAtual}</h1>
                            {ganhoPericia.ganhosPericias.treinadas!.trocas.valorInicial > 0 && (
                                <h1>Treinadas a Trocar: {ganhoPericia.ganhosPericias.treinadas!.trocas.valorAtual}</h1>
                            )}
                        </div>
                    )}
                    {ganhoPericia.ganhosPericias.veteranas?.alterando && (
                        <div className={style.patente_contadores}>
                            <h1>Pericias Veteranas: {ganhoPericia.ganhosPericias.veteranas!.ganhos.valorAtual}</h1>
                            {ganhoPericia.ganhosPericias.veteranas!.trocas.valorInicial > 0 && (
                                <h1>Veteranas a Trocar: {ganhoPericia.ganhosPericias.veteranas!.trocas.valorAtual}</h1>
                            )}
                        </div>
                    )}
                    {ganhoPericia.ganhosPericias.experts?.alterando && (
                        <div className={style.patente_contadores}>
                            <h1>Pericias Experts: {ganhoPericia.ganhosPericias.experts!.ganhos.valorAtual}</h1>
                            {ganhoPericia.ganhosPericias.experts!.trocas.valorInicial > 0 && (
                                <h1>Experts a Trocar: {ganhoPericia.ganhosPericias.experts!.trocas.valorAtual}</h1>
                            )}
                        </div>
                    )}
                    {ganhoPericia.ganhosPericias.livres?.alterando && (
                        <div className={style.patente_contadores}>
                            <h1>Pericias Livres: {ganhoPericia.ganhosPericias.livres!.ganhos.valorAtual}</h1>
                            {ganhoPericia.ganhosPericias.livres!.trocas.valorInicial > 0 && (
                                <h1>Livres a Trocar: {ganhoPericia.ganhosPericias.livres!.trocas.valorAtual}</h1>
                            )}
                        </div>
                    )}
                </div>

                <div className={style.conjunto_pericias}>
                    {ganhoPericia.pericias.map((pericia, index) => (
                        <div key={index} className={style.editar_pericia}>
                            <button onClick={() => {alteraValor(pericia.refPericia.id, -1)}} disabled={pericia.estaEmValorMinimo && (ganhoPericia.deparaPericiaPatente(pericia)?.trocas.valorZerado ?? true)}><FontAwesomeIcon icon={faMinus} /></button>
                            <div className={style.corpo_pericia}>
                                <h2>{pericia.refPericia.nome}</h2>
                                <h2>{pericia.refPatenteAtual.nome}</h2>
                            </div>
                            <button onClick={() => {alteraValor(pericia.refPericia.id, +1)}} disabled={!ganhoPericia.temPontosParaEssaPatente(pericia)}><FontAwesomeIcon icon={faPlus} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default page;