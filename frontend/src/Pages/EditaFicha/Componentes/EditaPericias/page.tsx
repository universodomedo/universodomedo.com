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
                    {ganhoPericia.ganhosTreinadas.alterando && (
                        <div className={style.patente_contadores}>
                            <h1>Pericias Treinadas: {ganhoPericia.ganhosTreinadas.ganhos.valorAtual}</h1>
                            {ganhoPericia.ganhosTreinadas.trocas.valorInicial > 0 && (
                                <h1>Treinadas a Trocar: {ganhoPericia.ganhosTreinadas.trocas.valorAtual}</h1>
                            )}
                        </div>
                    )}
                    {ganhoPericia.ganhosVeteranas.alterando && (
                        <div className={style.patente_contadores}>
                            <h1>Pericias Veteranas: {ganhoPericia.ganhosVeteranas.ganhos.valorAtual}</h1>
                            {ganhoPericia.ganhosVeteranas.trocas.valorInicial > 0 && (
                                <h1>Veteranas a Trocar: {ganhoPericia.ganhosVeteranas.trocas.valorAtual}</h1>
                            )}
                        </div>
                    )}
                    {ganhoPericia.ganhosExperts.alterando && (
                        <div className={style.patente_contadores}>
                            <h1>Pericias Experts: {ganhoPericia.ganhosExperts.ganhos.valorAtual}</h1>
                            {ganhoPericia.ganhosExperts.trocas.valorInicial > 0 && (
                                <h1>Experts a Trocar: {ganhoPericia.ganhosExperts.trocas.valorAtual}</h1>
                            )}
                        </div>
                    )}
                    {ganhoPericia.ganhosLivres.alterando && (
                        <div className={style.patente_contadores}>
                            <h1>Pericias Livres: {ganhoPericia.ganhosLivres.ganhos.valorAtual}</h1>
                            {ganhoPericia.ganhosLivres.trocas.valorInicial > 0 && (
                                <h1>Livres a Trocar: {ganhoPericia.ganhosLivres.trocas.valorAtual}</h1>
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