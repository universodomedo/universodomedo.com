'use client';

import styles from '../styles.module.css';

import { EtapaGanhoEvolucao_Atributos, GanhosEvolucao, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import { AtributoFichaDto, EstatisticaDanificavelFichaDto } from 'types-nora-api';
import Tooltip from 'Componentes/Elementos/Tooltip/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function EdicaoAtributos() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <div className={styles.editando_ficha_atributos}>
            <div className={styles.atributos}>
                {ganhos.fichaEvoluida.atributos.sort((a, b) => a.atributo.id - b.atributo.id).map(atributoFicha => (
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
                        {GanhosEvolucao.dadosReferencia.estatisticasDanificaveis.map(estatisticaDanificavel => {
                            const valorEstatisticaPorAtributo = ganhos.ganhosEstatisticasPorAtributo.find(ganho => ganho.estatisticaDanificavel.id === estatisticaDanificavel.id && ganho.atributo.id === atributoFicha.atributo.id)!.valorPorUnidade;

                            if (valorEstatisticaPorAtributo <= 0) return;

                            return (
                                <p key={estatisticaDanificavel.id} className={styles.ganhos_estatistica_por_atributo}>+ {valorEstatisticaPorAtributo} {estatisticaDanificavel.nomeAbreviado} por Ponto Atribuído</p>
                            );
                        })}
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

function CorpoEstatistica({ estatisticaDanificavelFicha }: { estatisticaDanificavelFicha: EstatisticaDanificavelFichaDto }) {
    const { ganhos } = useContextoEdicaoFicha();

    const valorAnterior = ganhos.refPersonagem.fichaVigente?.estatisticasDanificaveis.find(estatisticaDanificavelFichaAnterior => estatisticaDanificavelFichaAnterior.estatisticaDanificavel.id === estatisticaDanificavelFicha.estatisticaDanificavel.id)!.valorMaximo;
    const valorAtual = ganhos.fichaEvoluida.estatisticasDanificaveis.find(estatisticaDanificavelFichaAtual => estatisticaDanificavelFichaAtual.estatisticaDanificavel.id === estatisticaDanificavelFicha.estatisticaDanificavel.id)!.valorMaximo;

    return (
        <div className={styles.visualizador_estatistica}>
            <Tooltip>
                <Tooltip.Trigger>
                    <h2 className={styles.nome_estatistica}>{estatisticaDanificavelFicha.estatisticaDanificavel.nomeAbreviado}</h2>
                </Tooltip.Trigger>

                <Tooltip.Content>
                    <h1>{estatisticaDanificavelFicha.estatisticaDanificavel.nome}</h1>
                    <p>{estatisticaDanificavelFicha.estatisticaDanificavel.descricao}</p>
                    <h2>Ganhos de {estatisticaDanificavelFicha.estatisticaDanificavel.nomeAbreviado}: [+{ganhos.valorTotalGanhadoPorEstatistica(estatisticaDanificavelFicha.estatisticaDanificavel)}]</h2>
                    {GanhosEvolucao.dadosReferencia.atributos.map(atributo => {
                        const valorDessaEstatisticaPorEsseAtributo = ganhos.valorEstatisticaPorAtributo(estatisticaDanificavelFicha.estatisticaDanificavel, atributo);

                        if (valorDessaEstatisticaPorEsseAtributo <= 0) return;

                        return (
                            <p key={atributo.id}>{`${atributo.nomeAbreviado}: +${valorDessaEstatisticaPorEsseAtributo.toFixed(1)}`}</p>
                        );
                    })}
                </Tooltip.Content>
            </Tooltip>
            <h2 className={styles.alteracao_valor_estatistica}>{`${valorAnterior} → ${valorAtual}`}</h2>
        </div>
    );
};