// #region Imports
import style from './style.module.css';
import { useState } from 'react';

import { useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';
import { Atributo, GanhoIndividualNexPericia, PericiaEmGanho } from 'Types/classes/index.ts';

import TooltipPersistente from 'Recursos/Componentes/HoverCard/page.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const { ganhosNex, atualizarFicha } = useFicha();

    const ganhoPericia = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexPericia)!;

    const periciasAgrupadas = ganhoPericia.pericias.reduce((acc, pericia) => {
        const atributo = pericia.refPericia.refAtributo;
        const atributoId = atributo.id;

        if (!acc.some(group => group.atributo.id === atributoId)) {
            acc.push({
                atributo,
                pericias: []
            });
        }

        const grupo = acc.find(group => group.atributo.id === atributoId);
        grupo!.pericias.push(pericia);

        return acc;
    }, [] as { atributo: Atributo; pericias: PericiaEmGanho[] }[]);

    const alteraValor = (idPericia: number, modificador: number) => {
        if (modificador > 0) {
            ganhoPericia.adicionaPonto(idPericia);
        } else {
            ganhoPericia.subtraiPonto(idPericia);
        }

        atualizarFicha();
    }

    const CorpoPericia = ({ pericia }: { pericia: PericiaEmGanho }) => {
        const [openTooltip, setOpenTooltip] = useState(false);

        const cores: { [key: number]: string } = {
            1: '#CDCDCD',
            2: '#EBED9A',
            3: '#EACF3F',
            4: '#FF702C',
        };

        return (
            <div className={style.corpo_pericia}>
                <TooltipPersistente open={openTooltip} onOpenChange={setOpenTooltip}>
                    <TooltipPersistente.Trigger><h2>{pericia.refPericia.nome}</h2></TooltipPersistente.Trigger>

                    <TooltipPersistente.Content>
                        <>
                            <h2>{pericia.refPericia.nome}</h2>
                            <p>{pericia.refPericia.descricao}</p>
                        </>
                    </TooltipPersistente.Content>
                    <h3 style={{ color: cores[pericia.refPatenteAtual.id] }}>{pericia.refPatenteAtual.nome}</h3>
                    <div className={style.botoes_pericia}>
                        <button onClick={() => { alteraValor(pericia.refPericia.id, -1) }} disabled={pericia.estaEmValorMinimo || !pericia.estaMaiorQueInicial || !ganhoPericia.deparaPericiaPatente(pericia)?.trocas.valorZerado}><FontAwesomeIcon icon={faMinus} /></button>
                        <button onClick={() => { alteraValor(pericia.refPericia.id, +1) }} disabled={!ganhoPericia.temPontosParaEssaPatente(pericia)}><FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                </TooltipPersistente>
            </div>
        );
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

                <div className={style.atributos_e_pericias}>
                    {periciasAgrupadas.map((grupo, indexGrupo) => (
                        <div key={indexGrupo} className={style.atributo_agrupa_pericias}>
                            <h1>{grupo.atributo.nome}</h1>
                            <div className={style.editar_pericia}>
                                {grupo.pericias.map((pericia, index) => (
                                    <CorpoPericia key={index} pericia={pericia} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default page;