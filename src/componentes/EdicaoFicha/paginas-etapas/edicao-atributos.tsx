'use client';

import styles from '../styles.module.css';

import { AtributoFichaDto, EstatisticaDanificavelFichaDto } from 'types-nora-api';
import Tooltip from 'Componentes/Elementos/Tooltip/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { EtapaGanhoEvolucao_Atributos, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function EdicaoAtributos() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <div className={styles.editando_ficha_atributos}>
            <div className={styles.atributos}>
                {ganhos.atributosEditados.sort((a, b) => a.atributo.id - b.atributo.id).map(atributoFicha => (
                    <CorpoAtributo key={atributoFicha.atributo.id} atributoFicha={atributoFicha} />
                ))}

                <div className={styles.editando_ficha_estatisticas}>
                    {ganhos.refPersonagem.fichaVigente?.estatisticasDanificaveis.map(estatisticaDanificavelFicha => (
                        <CorpoEstatistica key={estatisticaDanificavelFicha.estatisticaDanificavel.id} estatisticaDanificavelFicha={estatisticaDanificavelFicha} />
                    ))}
                </div>
            </div>
        </div>
    );
};

function CorpoEstatistica({ estatisticaDanificavelFicha }: { estatisticaDanificavelFicha: EstatisticaDanificavelFichaDto }) {
    const { ganhos } = useContextoEdicaoFicha();

    const estatisticaEmGanho = ganhos.estatisticasDanificaveisEmEdicao?.[estatisticaDanificavelFicha.estatisticaDanificavel.id] ?? {
        valorAtual: 0,
        ganhoDaEvolucao: 0
    };

    return (
        <div className={styles.visualizador_estatistica}>
            <Tooltip>
                <Tooltip.Trigger>
                    <h2 className={styles.nome_estatistica}>{estatisticaDanificavelFicha.estatisticaDanificavel.nomeAbreviado}</h2>
                </Tooltip.Trigger>

                <Tooltip.Content>
                    <h1>{estatisticaDanificavelFicha.estatisticaDanificavel.nome}</h1>
                    <p>{estatisticaDanificavelFicha.estatisticaDanificavel.descricao}</p>
                    <h2>Ganhos de {estatisticaDanificavelFicha.estatisticaDanificavel.nomeAbreviado}: [+2]</h2>
                    {/* {ganhoAtributo.atributos.map(atributo => (
                        atributo.ganhosEstatisticas.filter(ganhosEstatistica => ganhosEstatistica.refEstatistica.id === idEstatistica).map(ganhoEstatistica => (
                            <p>{`${atributo.refAtributo.nomeAbrev}: +${Number((ganhoEstatistica.valorPorPonto * atributo.valorAtual).toFixed(1))}`}</p>
                        ))
                    ))} */}
                    <p>{`AGIteste: +[teste]`}</p>
                </Tooltip.Content>
            </Tooltip>
            <h2 className={styles.alteracao_valor_estatistica}>{`${estatisticaEmGanho.valorAtual} → ${estatisticaEmGanho.valorTotal}`}</h2>
        </div>
    );
};

function CorpoAtributo({ atributoFicha }: { atributoFicha: AtributoFichaDto }) {
    const { ganhos, executaEAtualiza } = useContextoEdicaoFicha();

    const etapaAtributos = ganhos.etapaAtual as EtapaGanhoEvolucao_Atributos;

    return (
        <div className={styles.corpo_atributo}>
            <Tooltip>
                <Tooltip.Trigger>
                    <h2 className={styles.nome_atributo}>{atributoFicha.atributo.nome}</h2>
                </Tooltip.Trigger>

                <Tooltip.Content>
                    <h1>{atributoFicha.atributo.nome}</h1>
                    <p>{atributoFicha.atributo.descricao}</p>
                    <div>
                        {/* {atributoFicha.ganhosEstatisticas.filter(atributo => atributo.valorPorPonto > 0).map((atributo, index) => (
                            <p key={index} className={styles.ganhos_estatistica_por_atributo}>+ {atributo.valorPorPonto.toFixed(1)} {atributo.refEstatistica.nomeAbrev} por Ponto Atribuído</p>
                        ))} */}
                        <p className={styles.ganhos_estatistica_por_atributo}>+ 2 [teste] por Ponto Atribuído</p>
                    </div>
                </Tooltip.Content>
            </Tooltip>
            <div className={styles.valor_atributo}>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaAtributos.subtraiPonto(atributoFicha.atributo) }) }} disabled={!etapaAtributos.botaoRemoverEstaHabilitado(atributoFicha)}><FontAwesomeIcon icon={faMinus} /></button>
                </div>
                <h2>{atributoFicha.valor}</h2>
                <div className={styles.recipiente_botao_edicao}>
                    <button onClick={() => { executaEAtualiza(() => { etapaAtributos.adicionaPonto(atributoFicha.atributo) }) }} disabled={!etapaAtributos.botaoAdicionarEstaHabilitado(atributoFicha)}><FontAwesomeIcon icon={faPlus} /></button>
                </div>
            </div>
        </div>
    );
};