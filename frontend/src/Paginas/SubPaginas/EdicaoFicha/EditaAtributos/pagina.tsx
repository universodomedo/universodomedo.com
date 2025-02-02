// #region Imports
import style from './style.module.css';
import styleCompartilhado from '../style.module.css';

import { AtributoEmGanho, GanhoIndividualNexAtributo } from 'Classes/ClassesTipos/index.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';

import { useContextoNexUp } from 'Contextos/ContextoNexUp/contexto.tsx';

import Tooltip from 'Componentes/Tooltip/pagina.tsx'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const { ganhosNex, triggerSetState } = useContextoNexUp();

    const ganhoAtributo = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexAtributo)!;

    const CorpoEstatistica = ({ idEstatistica, valorEstatistica }: { idEstatistica: number, valorEstatistica: { valorAtual: number, ganhoAtual: number,  valorAtualizado: number } }) => {
        const estatistica = SingletonHelper.getInstance().tipo_estatistica_danificavel.find(estatistica => estatistica.id === idEstatistica)!;

        return (
            <div className={style.visualizador_estatistica}>
                <Tooltip>
                    <Tooltip.Trigger>
                        <h2 className={style.nome_estatistica}>{estatistica?.nomeAbrev}</h2>
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                        <h1>{estatistica.nome}</h1>
                        <p>{estatistica.descricao}</p>
                        <h2>Ganhos de {estatistica.nomeAbrev}: +{valorEstatistica.ganhoAtual}</h2>
                        {ganhoAtributo.atributos.map(atributo => (
                            atributo.ganhosEstatisticas.filter(ganhosEstatistica => ganhosEstatistica.refEstatistica.id === idEstatistica).map(ganhoEstatistica => (
                                <p>{`${atributo.refAtributo.nomeAbrev}: +${Number((ganhoEstatistica.valorPorPonto * atributo.valorAtual).toFixed(1))}`}</p>
                            ))
                        ))}
                    </Tooltip.Content>
                </Tooltip>
                <h2 className={style.alteracao_valor_estatistica}>{`${Math.floor(valorEstatistica.valorAtual)} → ${Math.floor(valorEstatistica.valorAtualizado)}`}</h2>
            </div>
        );
    }

    const alteraValor = (idAtributo: number, modificador: number) => {
        if (modificador > 0) {
            ganhoAtributo.adicionaPonto(idAtributo);
        } else {
            ganhoAtributo.subtraiPonto(idAtributo);
        }

        triggerSetState();
    }

    const CorpoAtributo = ({ atributo }: { atributo: AtributoEmGanho }) => {
        return (
            <div className={style.corpo_atributo}>
                <Tooltip>
                    <Tooltip.Trigger>
                        <h2 className={style.nome_atributo}>{atributo.refAtributo.nome}</h2>
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                        <h1>{atributo.refAtributo.nome}</h1>
                        <p>{atributo.refAtributo.descricao}</p>
                        <div>
                            {atributo.ganhosEstatisticas.filter(atributo => atributo.valorPorPonto > 0).map((atributo, index) => (
                                <p key={index} className={style.ganhos_estatistica_por_atributo}>+ {atributo.valorPorPonto.toFixed(1)} {atributo.refEstatistica.nomeAbrev} por Ponto Atribuído</p>
                            ))}
                        </div>
                    </Tooltip.Content>
                </Tooltip>
                <div className={style.valor_atributo}>
                    <button onClick={() => { alteraValor(atributo.refAtributo.id, -1) }} disabled={atributo.estaEmValorMinimo || (!atributo.estaMaiorQueInicial && ganhoAtributo.ganhosAtributo.trocas.valorZerado)}><FontAwesomeIcon icon={faMinus} /></button>
                    <h2>{atributo.valorAtual}</h2>
                    <button onClick={() => { alteraValor(atributo.refAtributo.id, +1) }} disabled={atributo.estaEmValorMaximo || ganhoAtributo.ganhosAtributo.ganhos.valorZerado}><FontAwesomeIcon icon={faPlus} /></button>
                </div>
            </div>
        )
    }

    return (
        <div className={style.editando_ficha_atributos}>
            <div className={style.atributos}>
                {ganhoAtributo.atributos.map((atributo, index) => (
                    <CorpoAtributo key={index} atributo={atributo} />
                ))}

                <div className={style.editando_ficha_estatisticas}>
                    <CorpoEstatistica idEstatistica={1} valorEstatistica={ganhosNex.pv} />
                    <CorpoEstatistica idEstatistica={2} valorEstatistica={ganhosNex.ps} />
                    <CorpoEstatistica idEstatistica={3} valorEstatistica={ganhosNex.pe} />
                </div>
            </div>
        </div>
    );
}

export default page;