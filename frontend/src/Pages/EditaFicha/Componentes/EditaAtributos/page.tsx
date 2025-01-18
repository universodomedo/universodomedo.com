// #region Imports
import style from './style.module.css';

import { useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';
import { AtributoEmGanho, GanhoIndividualNexAtributo } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import Tooltip from 'Recursos/Componentes/Tooltip/page.tsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// #endregion

const page = () => {
    const { ganhosNex, atualizarFicha } = useFicha();

    const ganhoAtributo = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexAtributo)!;

    const alteraValor = (idAtributo: number, modificador: number) => {
        if (modificador > 0) {
            ganhoAtributo.adicionaPonto(idAtributo);
        } else {
            ganhoAtributo.subtraiPonto(idAtributo);
        }

        atualizarFicha();
    }

    const CorpoAtributo = ({ atributo }: { atributo: AtributoEmGanho }) => {
        return (
            <div className={style.corpo_atributo}>
                <Tooltip>
                    <Tooltip.Trigger>
                        <h2>{atributo.refAtributo.nome}</h2>
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                        <h2>{atributo.refAtributo.nome}</h2>
                        <p>{atributo.refAtributo.descricao}</p>
                        <div>
                            {atributo.ganhosEstatisticas.filter(atributo => atributo.valorPorPonto > 0).map((atributo, index) => (
                                <p key={index} className={style.ganhos_estatistica_por_atributo}>+ {atributo.valorPorPonto.toFixed(1)} {atributo.refEstatistica.nomeAbrev} por Ponto Atribuído</p>
                            ))}
                        </div>
                    </Tooltip.Content>
                </Tooltip>
                <div className={style.valor_atributo}>
                    <button onClick={() => { alteraValor(atributo.refAtributo.id, -1) }} disabled={!atributo.estaMaiorQueInicial && ganhoAtributo.ganhosAtributo.trocas.valorZerado}><FontAwesomeIcon icon={faMinus} /></button>
                    <h2>{atributo.valorAtual}</h2>
                    <button onClick={() => { alteraValor(atributo.refAtributo.id, +1) }} disabled={atributo.estaEmValorMaximo || ganhoAtributo.ganhosAtributo.ganhos.valorZerado}><FontAwesomeIcon icon={faPlus} /></button>
                </div>
            </div>
        )
    }

    const CorpoEstatistica = ({ idEstatistica, valorAtualizado }: { idEstatistica: number, valorAtualizado: number }) => {
        const estatistica = SingletonHelper.getInstance().tipo_estatistica_danificavel.find(estatistica => estatistica.id === idEstatistica)!;

        return (
            <div className={style.visualizador_estatistica}>
                <Tooltip>
                    <Tooltip.Trigger>
                        <h2>{estatistica?.nomeAbrev}</h2>
                    </Tooltip.Trigger>

                    <Tooltip.Content>
                        <h2>{estatistica.nome}</h2>
                        <p>{estatistica.descricao}</p>
                    </Tooltip.Content>
                </Tooltip>
                <h2>{Math.floor(valorAtualizado)}</h2>
            </div>
        );
    }

    return (
        <div className={style.editando_ficha_atributos}>
            <div className={style.atributo_contadores}>
                <h1>Atributos a Distribuir: {ganhoAtributo.ganhosAtributo.ganhos.valorAtual}</h1>
                {ganhoAtributo.ganhosAtributo.trocas.valorInicial > 0 && (
                    <h1>Atributos a Trocar: {ganhoAtributo.ganhosAtributo.trocas.valorAtual}</h1>
                )}
            </div>

            <div className={style.atributos}>
                {ganhoAtributo.atributos.map((atributo, index) => (
                    <CorpoAtributo key={index} atributo={atributo} />
                ))}
            </div>

            <div className={style.editando_ficha_estatisticas}>
                <CorpoEstatistica idEstatistica={1} valorAtualizado={ganhosNex.pvAtualizado} />
                <CorpoEstatistica idEstatistica={2} valorAtualizado={ganhosNex.psAtualizado} />
                <CorpoEstatistica idEstatistica={3} valorAtualizado={ganhosNex.peAtualizado} />
            </div>
        </div>
    );
}

export default page;