import type { CSSProperties } from 'react';
import { LIMITES_ANALISE_TESTE_PERICIA, type PatentePericiaCompletaDto, type ResultadoAnaliseCenarioTestePericia } from 'types-nora-api';

import { descreveCenarioTestePericiaUdm } from 'Funcionalidades/simuladorTestePericiaUdm/formatacaoSimuladorTestePericiaUdm';
import type { AlteracoesCenarioSimuladorTestePericiaUdm, CenarioSimuladorTestePericiaUdm } from 'Funcionalidades/simuladorTestePericiaUdm/simuladorTestePericiaUdm.tipos';
import styles from './cardCenario.module.css';

interface PropsCardCenarioTestePericiaUdm {
    readonly cenario: CenarioSimuladorTestePericiaUdm;
    readonly patentes: readonly PatentePericiaCompletaDto[];
    readonly resultado: ResultadoAnaliseCenarioTestePericia | null;
    readonly podeRemover: boolean;
    readonly alterarCenario: (cenarioId: string, alteracoes: AlteracoesCenarioSimuladorTestePericiaUdm) => void;
    readonly removerCenario: (cenarioId: string) => void;
};

export default function CardCenarioTestePericiaUdm({ cenario, patentes, resultado, podeRemover, alterarCenario, removerCenario }: PropsCardCenarioTestePericiaUdm) {
    const patente = patentes.find(item => item.id === cenario.idPatentePericia) ?? null;
    const valorAtributoFinal = cenario.valorAtributoBase + cenario.incrementoModificadoresAtributo;
    const limiteAtributo = LIMITES_ANALISE_TESTE_PERICIA.valorAtributoAbsolutoMaximo;

    return (
        <article className={styles.cardCenario} style={{ '--cor-cenario': cenario.cor } as CSSProperties}>
            <header className={styles.cabecalhoCard}>
                <input className={styles.nomeCenario} type="text" value={cenario.nome} maxLength={40} onChange={event => alterarCenario(cenario.id, { nome: event.target.value })} aria-label="Nome do cenário" />
                <div className={styles.resumoRegra}>
                    <strong>{descreveCenarioTestePericiaUdm(cenario, patente)}</strong>
                    <small>{resultado ? `Faixa final ${resultado.faixa.valorMinimo}–${resultado.faixa.valorMaximo}` : `Atributo final ${valorAtributoFinal}`}</small>
                </div>
            </header>

            <div className={styles.camposCenario}>
                <label>
                    <span>Atributo base</span>
                    <input type="number" min={-limiteAtributo - cenario.incrementoModificadoresAtributo} max={limiteAtributo - cenario.incrementoModificadoresAtributo} step={1} value={cenario.valorAtributoBase} onChange={event => alterarInteiroNoIntervalo(event.target.valueAsNumber, cenario.valorAtributoBase, -limiteAtributo - cenario.incrementoModificadoresAtributo, limiteAtributo - cenario.incrementoModificadoresAtributo, valor => alterarCenario(cenario.id, { valorAtributoBase: valor }))} />
                </label>
                <label>
                    <span>Mod. atributo</span>
                    <input type="number" min={-limiteAtributo - cenario.valorAtributoBase} max={limiteAtributo - cenario.valorAtributoBase} step={1} value={cenario.incrementoModificadoresAtributo} onChange={event => alterarInteiroNoIntervalo(event.target.valueAsNumber, cenario.incrementoModificadoresAtributo, -limiteAtributo - cenario.valorAtributoBase, limiteAtributo - cenario.valorAtributoBase, valor => alterarCenario(cenario.id, { incrementoModificadoresAtributo: valor }))} />
                </label>
                <label>
                    <span>Patente</span>
                    <select value={cenario.idPatentePericia} onChange={event => alterarCenario(cenario.id, { idPatentePericia: Number(event.target.value) })}>
                        {patentes.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
                    </select>
                </label>
                <label>
                    <span>Mod. valor máximo</span>
                    <input type="number" min={-LIMITES_ANALISE_TESTE_PERICIA.modificadorAbsolutoMaximo} max={LIMITES_ANALISE_TESTE_PERICIA.modificadorAbsolutoMaximo} step={1} value={cenario.incrementoModificadoresValorMaximo} onChange={event => alterarInteiroLimitado(event.target.valueAsNumber, cenario.incrementoModificadoresValorMaximo, LIMITES_ANALISE_TESTE_PERICIA.modificadorAbsolutoMaximo, valor => alterarCenario(cenario.id, { incrementoModificadoresValorMaximo: valor }))} />
                </label>
                <label>
                    <span>Cor</span>
                    <input className={styles.corCenario} type="color" value={cenario.cor} onChange={event => alterarCenario(cenario.id, { cor: event.target.value })} />
                </label>
            </div>

            <button type="button" className={styles.botaoRemover} disabled={!podeRemover} onClick={() => removerCenario(cenario.id)}>Remover cenário</button>
        </article>
    );
};

function alterarInteiroLimitado(valor: number, valorAtual: number, limiteAbsoluto: number, alterar: (novoValor: number) => void): void { alterarInteiroNoIntervalo(valor, valorAtual, -limiteAbsoluto, limiteAbsoluto, alterar); };

function alterarInteiroNoIntervalo(valor: number, valorAtual: number, minimo: number, maximo: number, alterar: (novoValor: number) => void): void { alterar(Number.isSafeInteger(valor) && valor >= minimo && valor <= maximo ? valor : valorAtual); };