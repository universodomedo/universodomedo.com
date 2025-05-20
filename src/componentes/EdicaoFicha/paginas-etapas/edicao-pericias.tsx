'use client';

import styles from '../styles.module.css';

import { PatentePericiaDto, PericiaDto } from 'types-nora-api';
import { EtapaGanhoEvolucao_Pericias, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TooltipEvolucao_Atributo, TooltipEvolucao_PatentePericia, TooltipEvolucao_Pericia } from './componentes-edicao/tooltips-edicao';

export default function EdicaoPericias() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <>
            <div className={styles.editando_ficha_pericias}>
                <div className={styles.atributos_e_pericias}>
                    {ganhos.periciasEditadasEAgrupadas.map(periciasAgrupadas => (
                        <div key={periciasAgrupadas.atributo.id} className={styles.atributo_agrupa_pericias}>
                            <TooltipEvolucao_Atributo atributo={periciasAgrupadas.atributo}>
                                <h1 className={styles.nome_atributo_agrupa_pericias}>{periciasAgrupadas.atributo.nome}</h1>
                            </TooltipEvolucao_Atributo>
                            <div className={styles.editar_pericia}>
                                {periciasAgrupadas.periciasDesseAtributo.map(periciaFicha => (
                                    <CorpoPericia key={periciaFicha.pericia.id} pericia={periciaFicha.pericia} patentePericia={periciaFicha.patentePericia} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

function CorpoPericia({ pericia, patentePericia }: { pericia: PericiaDto, patentePericia: PatentePericiaDto }) {
    const { ganhos, executaEAtualiza } = useContextoEdicaoFicha();

    const etapaAtributos = ganhos.etapaAtual as EtapaGanhoEvolucao_Pericias;

    return (
        <div className={styles.corpo_pericia}>
            <TooltipEvolucao_Pericia pericia={pericia}>
                <h2 className={styles.nome_pericia}>{pericia.nome}</h2>
            </TooltipEvolucao_Pericia>
            <TooltipEvolucao_PatentePericia patentePericia={patentePericia}>
                <h3 className={styles.patente_pericia} style={{ color: patentePericia.cor }}>{patentePericia.nome}</h3>
            </TooltipEvolucao_PatentePericia>
            <div className={styles.botoes_pericia}>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaAtributos.subtraiPonto(pericia, patentePericia) }) }} disabled={!etapaAtributos.botaoRemoverEstaHabilitado(pericia, patentePericia)}><FontAwesomeIcon icon={faMinus} /></button>
                </div>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaAtributos.adicionaPonto(pericia, patentePericia) }) }} disabled={!etapaAtributos.botaoAdicionarEstaHabilitado(pericia, patentePericia)}><FontAwesomeIcon icon={faPlus} /></button>
                </div>
            </div>
        </div>
    );
};