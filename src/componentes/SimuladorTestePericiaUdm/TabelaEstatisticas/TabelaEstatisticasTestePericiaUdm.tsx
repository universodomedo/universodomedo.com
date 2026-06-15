import type { PatentePericiaCompletaDto, ResultadoAnaliseCenarioTestePericia } from 'types-nora-api';

import type { CenarioSimuladorTestePericiaUdm } from 'Funcionalidades/simuladorTestePericiaUdm/simuladorTestePericiaUdm.tipos';
import LinhaEstatisticaTestePericiaUdm from './LinhaEstatisticaTestePericiaUdm';
import ResultadosAlvoTestePericiaUdm from './ResultadosAlvoTestePericiaUdm';
import styles from './tabela.module.css';

interface PropsTabelaEstatisticasTestePericiaUdm {
    readonly cenarios: readonly CenarioSimuladorTestePericiaUdm[];
    readonly patentes: readonly PatentePericiaCompletaDto[];
    readonly resultadosAlvo: readonly number[];
    readonly novoResultadoAlvo: number;
    readonly resultados: readonly ResultadoAnaliseCenarioTestePericia[];
    readonly setNovoResultadoAlvo: (resultadoAlvo: number) => void;
    readonly adicionarResultadoAlvo: () => void;
    readonly removerResultadoAlvo: (resultadoAlvo: number) => void;
};

export default function TabelaEstatisticasTestePericiaUdm({ cenarios, patentes, resultadosAlvo, novoResultadoAlvo, resultados, setNovoResultadoAlvo, adicionarResultadoAlvo, removerResultadoAlvo }: PropsTabelaEstatisticasTestePericiaUdm) {
    return (
        <section className={styles.painelEstatisticas}>
            <header className={styles.cabecalhoPainel}>
                <h2>Comparação estatística</h2>
                <span>Distribuição matemática exata gerada pela configuração atual da Nora-Api.</span>
            </header>

            <ResultadosAlvoTestePericiaUdm resultadosAlvo={resultadosAlvo} novoResultadoAlvo={novoResultadoAlvo} setNovoResultadoAlvo={setNovoResultadoAlvo} adicionarResultadoAlvo={adicionarResultadoAlvo} removerResultadoAlvo={removerResultadoAlvo} />

            <dl className={styles.legendaColunas}>
                <div><dt>Mínimo</dt><dd>Resultado mínimo após atributo, patente e normalização da faixa.</dd></div>
                <div><dt>Máximo</dt><dd>Valor base 20 somado à patente e aos modificadores de máximo.</dd></div>
                <div><dt>Média</dt><dd>Valor médio esperado após muitas execuções.</dd></div>
                <div><dt>Mediana</dt><dd>Valor que divide a probabilidade acumulada em duas metades.</dd></div>
                <div><dt>Moda</dt><dd>Valor ou valores com a maior chance individual de aparecer.</dd></div>
                <div><dt>Desvio padrão</dt><dd>Dispersão dos resultados em relação à média.</dd></div>
                <div><dt>P(X+)</dt><dd>Chance de obter um resultado maior ou igual a X.</dd></div>
            </dl>

            <div className={styles.rolagemTabela}>
                <table>
                    <thead>
                        <tr>
                            <th>Cenário</th>
                            <th>Atributo final</th>
                            <th>Patente</th>
                            <th>Mínimo</th>
                            <th>Máximo</th>
                            <th>Média</th>
                            <th>Mediana</th>
                            <th>Moda</th>
                            <th>Desvio padrão</th>
                            {resultadosAlvo.map(resultadoAlvo => <th key={resultadoAlvo}>P({resultadoAlvo}+)</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {cenarios.map(cenario => {
                            const resultado = resultados.find(item => item.cenarioId === cenario.id);
                            if (!resultado) return null;
                            const patente = patentes.find(item => item.id === cenario.idPatentePericia) ?? null;
                            return <LinhaEstatisticaTestePericiaUdm key={cenario.id} cenario={cenario} patente={patente} resultado={resultado} />;
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};