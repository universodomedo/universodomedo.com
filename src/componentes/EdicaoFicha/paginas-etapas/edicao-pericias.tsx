'use client';

import styles from '../styles.module.css';

import { PatentePericiaDto, PericiaDto } from 'types-nora-api';
import { EtapaGanhoEvolucao_Pericias, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TooltipEvolucao_Atributo, TooltipEvolucao_PatentePericia, TooltipEvolucao_Pericia } from './componentes-edicao/tooltips-edicao';
import { ReactNode } from 'react';

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

    const etapaPericias = ganhos.etapaAtual as EtapaGanhoEvolucao_Pericias;

    console.log(ganhos.periciasEditadasEAgrupadas);

    const elementoOcultismo = (): ReactNode => {
        if (pericia.id !== 16) return <></>;

        const periciaEmFichaVigente = ganhos.fichaDeJogoVigente.pericias.find(periciaFicha => periciaFicha.pericia.id === 16);
        const periciaEmEdicao = ganhos.periciasEditadasEAgrupadas.flatMap(agrupamento => agrupamento.periciasDesseAtributo).find(periciaFicha => periciaFicha.pericia.id === 16);
        
        console.log(`elementoOcultismo`);
        console.log(`teste 1`);
        console.log(periciaEmFichaVigente);
        console.log(`teste 2`);
        console.log(periciaEmEdicao);

        return (
            <div>Conteúdo do elemento</div>
        );
    };

    // const elementoOcultismo = pericia.id === 16 ? (
    //     <>
    //         <p className={styles.cor_aviso} style={{ marginTop: '1vh' }}>Essa Perícia não pode ser trocada</p>
    //         {ganhos.fichaDeJogoVigente.pericias.some(periciaFicha => periciaFicha.pericia.id === 16 && periciaFicha.patentePericia.id === 1) && <p className={styles.cor_confirmacao} style={{ marginTop: '1vh' }}>Evoluir para Experiente <strong>aumenta Pontos de Habilidade Paranormal em 10</strong></p>}
    //         {/* {ganhos.fichaDeJogoVigente.pericias.some(periciaFicha => periciaFicha.pericia.id === 16 && periciaFicha.patentePericia.id === 2) && <p className={styles.cor_confirmacao} style={{marginTop: '.4vh'}}>Evoluir para Desperta <strong>aumenta Pontos de Habilidade Paranormal em 20</strong></p>} */}
    //         {(ganhos.fichaDeJogoVigente.pericias.some(periciaFicha => periciaFicha.pericia.id === 16 && periciaFicha.patentePericia.id === 2) || ganhos.periciasEditadasEAgrupadas.some(agrupamentoPericias => agrupamentoPericias.periciasDesseAtributo.some(periciaFicha => periciaFicha.patentePericia.id === 3))) && <p className={styles.cor_confirmacao} style={{ marginTop: '.4vh' }}>Evoluir para Desperta <strong>aumenta Pontos de Habilidade Paranormal em 20</strong></p>}
    //         {/* {ganhos.fichaDeJogoVigente.pericias.some(periciaFicha => periciaFicha.pericia.id === 16 && periciaFicha.patentePericia.id === 3) && <p className={styles.cor_confirmacao} style={{marginTop: '.4vh'}}>Evoluir para Visionária <strong>aumenta Pontos de Habilidade Paranormal em 30</strong></p>} */}
    //         {(ganhos.fichaDeJogoVigente.pericias.some(periciaFicha => periciaFicha.pericia.id === 16 && periciaFicha.patentePericia.id === 3) || ganhos.periciasEditadasEAgrupadas.some(agrupamentoPericias => agrupamentoPericias.periciasDesseAtributo.some(periciaFicha => periciaFicha.patentePericia.id === 4))) && <p className={styles.cor_confirmacao} style={{ marginTop: '.4vh' }}>Evoluir para Visionária <strong>aumenta Pontos de Habilidade Paranormal em 30</strong></p>}
    //     </>
    // ) : <></>;

    return (
        <div className={styles.corpo_pericia}>
            <TooltipEvolucao_Pericia pericia={pericia} conteudoAdicional={elementoOcultismo()}>
                <h2 className={styles.nome_pericia}>{pericia.nome}</h2>
            </TooltipEvolucao_Pericia>
            <TooltipEvolucao_PatentePericia patentePericia={patentePericia}>
                <h3 className={styles.patente_pericia} style={{ color: patentePericia.cor }}>{patentePericia.nome}</h3>
            </TooltipEvolucao_PatentePericia>
            <div className={styles.botoes_pericia}>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaPericias.subtraiPonto(pericia, patentePericia) }) }} disabled={!etapaPericias.botaoRemoverEstaHabilitado(pericia, patentePericia)} className={etapaPericias.patenteAtualFoiEvoluidaPorPericiaLivre(pericia, patentePericia) ? styles.botao_usando_pericia_livre : ''}><FontAwesomeIcon icon={faMinus} /></button>
                </div>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaPericias.adicionaPonto(pericia, patentePericia) }) }} disabled={!etapaPericias.botaoAdicionarEstaHabilitado(pericia, patentePericia)} className={etapaPericias.podeEvoluirComPericiaLivre(patentePericia) ? styles.botao_usando_pericia_livre : ''}><FontAwesomeIcon icon={faPlus} /></button>
                </div>
            </div>
        </div>
    );
};