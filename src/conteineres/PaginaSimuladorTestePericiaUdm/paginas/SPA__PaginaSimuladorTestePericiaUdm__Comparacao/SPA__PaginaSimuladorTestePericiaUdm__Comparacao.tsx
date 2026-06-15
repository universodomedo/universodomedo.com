import ListaCenariosTestePericiaUdm from 'Componentes/SimuladorTestePericiaUdm/Cenarios/ListaCenariosTestePericiaUdm';
import PainelGraficosTestePericiaUdm from 'Componentes/SimuladorTestePericiaUdm/Graficos/PainelGraficosTestePericiaUdm';
import TabelaEstatisticasTestePericiaUdm from 'Componentes/SimuladorTestePericiaUdm/TabelaEstatisticas/TabelaEstatisticasTestePericiaUdm';
import { useContexto__PaginaSimuladorTestePericiaUdm__Comparacao } from 'Contextos/Contexto__PaginaSimuladorTestePericiaUdm__Comparacao/contexto';
import styles from './styles.module.css';

export default function SPA__PaginaSimuladorTestePericiaUdm__Comparacao() {
    const estado = useContexto__PaginaSimuladorTestePericiaUdm__Comparacao();
    const possuiResultadosCompletos = estado.cenarios.length > 0 && estado.resultados.length === estado.cenarios.length;

    return (
        <main className={styles.paginaSimulador}>
            <header className={styles.apresentacao}>
                <div>
                    <span>Game balance · Mecânica atual</span>
                    <h1>Distribuição dos testes de perícia do Universo do Medo</h1>
                </div>
                <p>Compare cenários usando a configuração real de atributos e patentes da Nora-Api. Cada resultado parte da faixa mínima e máxima calculada pelo sistema e aplica a curva ponderada oficial, sem simulação aleatória.</p>
            </header>

            <ListaCenariosTestePericiaUdm cenarios={estado.cenarios} patentes={estado.patentes} resultados={estado.resultados} alterarCenario={estado.alterarCenario} adicionarCenario={estado.adicionarCenario} removerCenario={estado.removerCenario} />

            {!possuiResultadosCompletos && <EstadoAnalise patentesDisponiveis={estado.patentes.length > 0} analisando={estado.analisando} erro={estado.erroAnalise} />}

            {possuiResultadosCompletos && <PainelGraficosTestePericiaUdm cenarios={estado.cenarios} resultados={estado.resultados} />}

            {possuiResultadosCompletos && <TabelaEstatisticasTestePericiaUdm cenarios={estado.cenarios} patentes={estado.patentes} resultadosAlvo={estado.resultadosAlvo} novoResultadoAlvo={estado.novoResultadoAlvo} resultados={estado.resultados} setNovoResultadoAlvo={estado.setNovoResultadoAlvo} adicionarResultadoAlvo={estado.adicionarResultadoAlvo} removerResultadoAlvo={estado.removerResultadoAlvo} />}
        </main>
    );
};

function EstadoAnalise({ patentesDisponiveis, analisando, erro }: { patentesDisponiveis: boolean; analisando: boolean; erro: string | null; }) {
    const mensagem = erro ?? (!patentesDisponiveis ? 'Aguardando as patentes de perícia disponíveis no cache.' : analisando ? 'Recalculando a distribuição matemática dos cenários...' : 'Preparando os cenários iniciais.');
    return <section className={`${styles.estadoAnalise} ${erro ? styles.estadoErro : ''}`}>{mensagem}</section>;
};