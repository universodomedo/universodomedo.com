'use client';

import styles from '../styles.module.css';

import { PatentePericiaDto, PericiaDto } from 'types-nora-api';
import { EtapaGanhoEvolucao_Pericias, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import Tooltip from 'Componentes/Elementos/Tooltip/Tooltip';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function EdicaoPericias() {
    const { ganhos } = useContextoEdicaoFicha();
    const { scrollableProps } = useScrollable();

    return (
        <>
            <div className={styles.editando_ficha_pericias} {...scrollableProps}>
                <div className={styles.atributos_e_pericias}>
                    {ganhos.periciasAgrupadasEEditadas.map(periciasAgrupadas => (
                        <div key={periciasAgrupadas.atributo.id} className={styles.atributo_agrupa_pericias}>
                            <h1 className={styles.nome_atributo_agrupa_pericias}>{periciasAgrupadas.atributo.nome}</h1>
                            <div className={styles.editar_pericia}>
                                {periciasAgrupadas.periciasDesseAtributo.map(periciaFicha => (
                                    <CorpoPericia key={periciaFicha.pericia.id} pericia={periciaFicha.pericia} patente={periciaFicha.patenteAtualDaPericia} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

function CorpoPericia({ pericia, patente }: { pericia: PericiaDto, patente: PatentePericiaDto }) {
    const { ganhos, executaEAtualiza } = useContextoEdicaoFicha();

    const etapaAtributos = ganhos.etapaAtual as EtapaGanhoEvolucao_Pericias;

    return (
        <div className={styles.corpo_pericia}>
            <Tooltip>
                <Tooltip.Trigger>
                    <h2 className={styles.nome_pericia}>{pericia.nome}</h2>
                </Tooltip.Trigger>

                <Tooltip.Content>
                    <h2>{pericia.nome}</h2>
                    <p>{pericia.descricao}</p>
                </Tooltip.Content>
            </Tooltip>

            <h3 className={styles.patente_pericia} style={{ color: patente.cor }}>{patente.nome}</h3>
            <div className={styles.botoes_pericia}>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaAtributos.subtraiPonto(pericia, patente) }) }} disabled={!etapaAtributos.botaoRemoverEstaHabilitado(pericia, patente)}><FontAwesomeIcon icon={faMinus} /></button>
                </div>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaAtributos.adicionaPonto(pericia, patente) }) }} disabled={!etapaAtributos.botaoAdicionarEstaHabilitado(pericia, patente)}><FontAwesomeIcon icon={faPlus} /></button>
                </div>
            </div>
        </div>
    );
};