import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { formataMedianaDistribuicaoTeste, formataModasDistribuicaoTeste, formataNotacaoCenarioDistribuicaoTeste, formataNumeroDistribuicaoTeste, formataPercentualDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/formatacaoSimuladorDistribuicaoTeste';
import { criaResumoAnaliticoDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/resumoAnaliticoDistribuicaoTeste';
import type { ConfiguracaoCenarioDistribuicaoTeste, EstatisticasDistribuicaoTeste, ResultadoTeoricoCenarioTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/simuladorDistribuicaoTeste.tipos';
import styles from './styles.module.css';

interface PropsTabelaEstatisticas {
    readonly cenarios: readonly ConfiguracaoCenarioDistribuicaoTeste[];
    readonly limiares: readonly number[];
    readonly novoLimiar: number;
    readonly resultadosTeoricos: readonly ResultadoTeoricoCenarioTeste[];
    readonly setNovoLimiar: (limiar: number) => void;
    readonly adicionarLimiar: () => void;
    readonly removerLimiar: (limiar: number) => void;
};

export default function TabelaEstatisticas({ cenarios, limiares, novoLimiar, resultadosTeoricos, setNovoLimiar, adicionarLimiar, removerLimiar }: PropsTabelaEstatisticas) {
    return (
        <section className={styles.painelEstatisticas}>
            <header>
                <h2>Comparação estatística</h2>
                <span>Distribuição matemática exata de cada cenário.</span>
            </header>

            <div className={styles.resultadosAlvo}>
                <div className={styles.apresentacaoResultadosAlvo}>
                    <strong>Resultados-alvo</strong>
                    <span>Compare a chance de cada cenário atingir valores relevantes para o sistema.</span>
                </div>
                <div className={styles.adicionarResultadoAlvo}>
                    <label htmlFor="novo-resultado-alvo">Atingir pelo menos</label>
                    <input id="novo-resultado-alvo" type="number" step={1} value={novoLimiar} onChange={event => setNovoLimiar(Number.isSafeInteger(event.target.valueAsNumber) ? event.target.valueAsNumber : 0)} onKeyDown={event => { if (event.key === 'Enter') adicionarLimiar(); }} />
                    <button type="button" onClick={adicionarLimiar} disabled={!Number.isSafeInteger(novoLimiar) || limiares.includes(novoLimiar)}>Adicionar</button>
                </div>
                <div className={styles.listaResultadosAlvo}>
                    {limiares.length === 0 && <span>Nenhum resultado-alvo configurado.</span>}
                    {limiares.map(limiar => <button type="button" key={limiar} onClick={() => removerLimiar(limiar)} title={`Remover resultado-alvo ${limiar}+`}>{limiar}+ <strong>×</strong></button>)}
                </div>
            </div>

            <dl className={styles.legendaColunas}>
                <div><dt>Média</dt><dd>Valor médio esperado após muitas jogadas.</dd></div>
                <div><dt>Mediana</dt><dd>Valor que divide a distribuição acumulada em duas metades.</dd></div>
                <div><dt>Moda</dt><dd>Valor ou valores com a maior chance individual de aparecer.</dd></div>
                <div><dt>Desvio padrão</dt><dd>Dispersão dos resultados em relação à média.</dd></div>
                <div><dt>Faixa</dt><dd>Menor e maior resultado possíveis.</dd></div>
                <div><dt>P(X+)</dt><dd>Chance de obter um resultado maior ou igual a X.</dd></div>
            </dl>

            <div className={styles.rolagemTabela}>
                <table>
                    <thead>
                        <tr>
                            <th>Cenário</th>
                            <th>Média</th>
                            <th>Mediana</th>
                            <th>Moda</th>
                            <th>Desvio padrão</th>
                            <th>Faixa</th>
                            {limiares.map(limiar => <th key={limiar}>P({limiar}+)</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {cenarios.map(cenario => {
                            const teorico = resultadosTeoricos.find(resultado => resultado.cenarioId === cenario.id);
                            if (!teorico) return null;
                            const resumoAnalitico = criaResumoAnaliticoDistribuicaoTeste(cenario, teorico);
                            return <LinhaEstatistica key={cenario.id} cenario={cenario} estatisticas={teorico.estatisticas} resumoAnalitico={resumoAnalitico} />;
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

function LinhaEstatistica({ cenario, estatisticas, resumoAnalitico }: { cenario: ConfiguracaoCenarioDistribuicaoTeste; estatisticas: EstatisticasDistribuicaoTeste; resumoAnalitico: string; }) {
    return (
        <TooltipPrimitive.Root delayDuration={350}>
            <TooltipPrimitive.Trigger asChild>
                <tr className={styles.linhaComResumo} tabIndex={0}>
                    <td><span className={styles.identificadorCor} style={{ background: cenario.cor }} /><strong>{cenario.nome}</strong><small>{formataNotacaoCenarioDistribuicaoTeste(cenario)}</small></td>
                    <td>{formataNumeroDistribuicaoTeste(estatisticas.media)}</td>
                    <td>{formataMedianaDistribuicaoTeste(estatisticas.mediana)}</td>
                    <td>{formataModasDistribuicaoTeste(estatisticas)}</td>
                    <td>{formataNumeroDistribuicaoTeste(estatisticas.desvioPadrao)}</td>
                    <td>{estatisticas.minimo}–{estatisticas.maximo}</td>
                    {estatisticas.probabilidadesAcumuladas.map(item => <td key={item.limiar}>{formataPercentualDistribuicaoTeste(item.probabilidade)}</td>)}
                </tr>
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content className={styles.resumoAnalitico} side="top" align="center" sideOffset={8}>
                    <strong>Resumo teórico</strong>
                    <p>{resumoAnalitico}</p>
                    <TooltipPrimitive.Arrow className={styles.setaResumoAnalitico} />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
};