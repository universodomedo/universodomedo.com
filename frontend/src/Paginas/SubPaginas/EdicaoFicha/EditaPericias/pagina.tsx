// #region Imports
import style from './style.module.css';

import { useContextoNexUp } from 'Contextos/ContextoNexUp/contexto.tsx';
import { Atributo, GanhoIndividualNexPericia, PericiaEmGanho } from 'Classes/ClassesTipos/index.ts';

import Tooltip from 'Componentes/Tooltip/pagina.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const { ganhosNex, triggerSetState } = useContextoNexUp();

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

        triggerSetState();
    }

    const CorpoPericia = ({ pericia }: { pericia: PericiaEmGanho }) => {
        return (
            <div className={style.corpo_pericia}>
                <Tooltip>
                    <Tooltip.Trigger>
                        <h2 className={style.nome_pericia}>{pericia.refPericia.nome}</h2>
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                        <h2>{pericia.refPericia.nome}</h2>
                        <p>{pericia.refPericia.descricao}</p>
                    </Tooltip.Content>
                </Tooltip>

                <h3 className={style.patente_pericia} style={{ color: pericia.refPatenteAtual.corTexto }}>{pericia.refPatenteAtual.nome}</h3>
                <div className={style.botoes_pericia}>
                    <button onClick={() => { alteraValor(pericia.refPericia.id, -1) }} disabled={pericia.estaEmValorMinimo || !pericia.estaMaiorQueInicial || !ganhoPericia.deparaPericiaPatente(pericia)?.trocas.valorZerado}><FontAwesomeIcon icon={faMinus} /></button>
                    <button onClick={() => { alteraValor(pericia.refPericia.id, +1) }} disabled={!ganhoPericia.temPontosParaEssaPatente(pericia)}><FontAwesomeIcon icon={faPlus} /></button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={style.editando_ficha_pericias}>
                <div className={style.atributos_e_pericias}>
                    {periciasAgrupadas.map((grupo, indexGrupo) => (
                        <div key={indexGrupo} className={style.atributo_agrupa_pericias}>
                            <h1 className={style.nome_atributo_agrupa_pericias}>{grupo.atributo.nome}</h1>
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