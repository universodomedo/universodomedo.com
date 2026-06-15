import ListaCenarios from 'Componentes/SimuladorDistribuicoesTeste/Cenarios/ListaCenarios';
import PainelGraficosDistribuicoes from 'Componentes/SimuladorDistribuicoesTeste/Graficos/PainelGraficosDistribuicoes';
import TabelaEstatisticas from 'Componentes/SimuladorDistribuicoesTeste/TabelaEstatisticas/TabelaEstatisticas';
import { useContexto__PaginaSimuladorDistribuicoesTeste__Comparacao } from 'Contextos/Contexto__PaginaSimuladorDistribuicoesTeste__Comparacao/contexto';
import styles from './styles.module.css';

export default function SPA__PaginaSimuladorDistribuicoesTeste__Comparacao() {
    const estado = useContexto__PaginaSimuladorDistribuicoesTeste__Comparacao();

    return (
        <main className={styles.paginaSimulador}>
            <header className={styles.apresentacao}>
                <div>
                    <span>Game balance</span>
                    <h1>Distribuição e comparação de sistemas de teste</h1>
                </div>
                <p>Compare a distribuição matemática exata do Dado Final entre diferentes cenários. Quantidades positivas escolhem o maior dado; quantidades negativas rolam |N| + 1 dados e escolhem o menor. Modificadores são aplicados depois.</p>
            </header>

            <ListaCenarios cenarios={estado.cenarios} alterarCenario={estado.alterarCenario} adicionarCenario={estado.adicionarCenario} removerCenario={estado.removerCenario} />

            <PainelGraficosDistribuicoes cenarios={estado.cenarios} resultadosTeoricos={estado.resultadosTeoricos} />

            <TabelaEstatisticas cenarios={estado.cenarios} limiares={estado.limiares} novoLimiar={estado.novoLimiar} resultadosTeoricos={estado.resultadosTeoricos} setNovoLimiar={estado.setNovoLimiar} adicionarLimiar={estado.adicionarLimiar} removerLimiar={estado.removerLimiar} />
        </main>
    );
};