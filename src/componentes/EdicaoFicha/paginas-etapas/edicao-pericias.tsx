'use client';

import styles from '../styles.module.css';

import { PatentePericiaDto, PericiaDto } from 'types-nora-api';
import { EtapaGanhoEvolucao_Pericias, GanhosEvolucao, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TooltipEvolucao_Atributo, TooltipEvolucao_PatentePericia, TooltipEvolucao_Pericia } from './componentes-edicao/tooltips-edicao';
import { ReactNode } from 'react';
import React from 'react';

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

    const elementoOcultismo = (): ReactNode => {
        if (pericia.id !== 16) return <></>;

        return (
            <>
                <p className={styles.cor_aviso} style={{ marginTop: '1vh' }}>Essa Perícia não pode ser trocada</p>

                {ganhos.evolucaoPericiaOcultismoNessaEvolucao.mostraMensagemExperiente && (<p className={styles.cor_confirmacao} style={{ marginTop: '1vh' }}>Evoluir para Experiente <strong>aumenta Pontos de Habilidade Paranormal em 10</strong></p>)}
                {ganhos.evolucaoPericiaOcultismoNessaEvolucao.mostraMensagemDesperta && (<p className={styles.cor_confirmacao} style={{ marginTop: '.4vh' }}>Evoluir para Desperta <strong>aumenta Pontos de Habilidade Paranormal em 20</strong></p>)}
                {ganhos.evolucaoPericiaOcultismoNessaEvolucao.mostraMensagemVisionaria && (<p className={styles.cor_confirmacao} style={{ marginTop: '.4vh' }}>Evoluir para Visionária <strong>aumenta Pontos de Habilidade Paranormal em 30</strong></p>)}
            </>
        );
    };

    const periciasLivresParaEssaPericia = ganhos.obtemPericiasLivresPresentesNessaPericia(pericia);

    const elementoPericiaLivre = (): ReactNode => {
        if (periciasLivresParaEssaPericia.length <= 0) return <></>;

        return (
            <>
                {periciasLivresParaEssaPericia.map((registro, key) => (
                    <p key={key} className={styles.cor_confirmacao} style={{ marginTop: '.4vh' }}>A Patente {GanhosEvolucao.dadosReferencia.patentes.find(patente => patente.id === registro.idPatente)?.nome} foi evoluída utilizando Perícia Livre</p>
                ))}
            </>
        );
    };

    return (
        <div className={styles.corpo_pericia}>
            <TooltipEvolucao_Pericia pericia={pericia} conteudoAdicional={elementoOcultismo()}>
                <h2 className={styles.nome_pericia}>{pericia.nome}</h2>
            </TooltipEvolucao_Pericia>
            <TooltipEvolucao_PatentePericia patentePericia={patentePericia}>
                <div className={styles.recipiente_conteudo_gatilho_tooltip_patente}>
                    <h3 className={styles.patente_pericia} style={{ color: patentePericia.cor }}>{patentePericia.nome}</h3>
                    {periciasLivresParaEssaPericia.length > 0 && <h3 className={styles.simbolo_aviso_pericia_livre}>!</h3>}
                </div>
            </TooltipEvolucao_PatentePericia>
            <div className={styles.botoes_pericia}>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaPericias.subtraiPonto(pericia, patentePericia) }) }} disabled={!etapaPericias.obtemBotaoRemoverEstaHabilitado(pericia, patentePericia)}><FontAwesomeIcon icon={faMinus} /></button>
                </div>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaPericias.adicionaPonto(pericia, patentePericia) }) }} disabled={!etapaPericias.obtemBotaoAdicionarEstaHabilitado(pericia, patentePericia)}><FontAwesomeIcon icon={faPlus} /></button>
                </div>
            </div>
            {etapaPericias.desbloqueadasPericiasLivres && (
                <div className={styles.botoes_pericia_livre}>
                    <div className={styles.recipiente_botao_edicao}>
                        <button onClick={() => { executaEAtualiza(() => { etapaPericias.subtraiPonto(pericia, patentePericia) }) }} disabled={!etapaPericias.obtemBotaoRemoverLivreEstaHabilitado(pericia, patentePericia)}><FontAwesomeIcon icon={faMinus} /></button>
                    </div>
                    <h3>!</h3>
                    <div className={styles.recipiente_botao_edicao}>
                        <button onClick={() => { executaEAtualiza(() => { etapaPericias.adicionaPonto(pericia, patentePericia) }) }} disabled={!etapaPericias.obtemBotaoAdicionarLivreEstaHabilitado(pericia, patentePericia)}><FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};