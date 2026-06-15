import type { ConfiguracaoCenarioDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/simuladorDistribuicaoTeste.tipos';
import { LIMITES_SIMULADOR_DISTRIBUICAO_TESTE } from 'Funcionalidades/simuladorDistribuicaoTeste/regrasSimuladorDistribuicaoTeste';
import CardCenario from './CardCenario';
import styles from './styles.module.css';

interface PropsListaCenarios {
    readonly cenarios: readonly ConfiguracaoCenarioDistribuicaoTeste[];
    readonly alterarCenario: (cenarioId: string, alteracoes: Partial<Pick<ConfiguracaoCenarioDistribuicaoTeste, 'nome' | 'quantidadeDados' | 'quantidadeFaces' | 'bonus' | 'cor'>>) => void;
    readonly adicionarCenario: () => void;
    readonly removerCenario: (cenarioId: string) => void;
};

export default function ListaCenarios({ cenarios, alterarCenario, adicionarCenario, removerCenario }: PropsListaCenarios) {
    return (
        <section className={styles.secaoCenarios}>
            <header className={styles.cabecalhoCenarios}>
                <div>
                    <h2>Cenários</h2>
                    <span>N positivo pega o maior de N dados. N negativo rola |N| + 1 dados e pega o menor. O bônus entra depois.</span>
                </div>
                <button type="button" onClick={adicionarCenario} disabled={cenarios.length >= LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeCenariosMaxima}>Adicionar cenário</button>
            </header>

            <div className={styles.gradeCenarios}>
                {cenarios.map(cenario => <CardCenario key={cenario.id} cenario={cenario} podeRemover={cenarios.length > 1} alterarCenario={alterarCenario} removerCenario={removerCenario} />)}
            </div>
        </section>
    );
};