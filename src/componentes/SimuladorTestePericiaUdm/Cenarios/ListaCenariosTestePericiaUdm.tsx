import type { PatentePericiaCompletaDto, ResultadoAnaliseCenarioTestePericia } from 'types-nora-api';
import { LIMITES_ANALISE_TESTE_PERICIA } from 'types-nora-api';

import type { AlteracoesCenarioSimuladorTestePericiaUdm, CenarioSimuladorTestePericiaUdm } from 'Funcionalidades/simuladorTestePericiaUdm/simuladorTestePericiaUdm.tipos';
import CardCenarioTestePericiaUdm from './CardCenarioTestePericiaUdm';
import styles from './listaCenarios.module.css';

interface PropsListaCenariosTestePericiaUdm {
    readonly cenarios: readonly CenarioSimuladorTestePericiaUdm[];
    readonly patentes: readonly PatentePericiaCompletaDto[];
    readonly resultados: readonly ResultadoAnaliseCenarioTestePericia[];
    readonly alterarCenario: (cenarioId: string, alteracoes: AlteracoesCenarioSimuladorTestePericiaUdm) => void;
    readonly adicionarCenario: () => void;
    readonly removerCenario: (cenarioId: string) => void;
};

export default function ListaCenariosTestePericiaUdm({ cenarios, patentes, resultados, alterarCenario, adicionarCenario, removerCenario }: PropsListaCenariosTestePericiaUdm) {
    return (
        <section className={styles.secaoCenarios}>
            <header className={styles.cabecalhoCenarios}>
                <div>
                    <h2>Cenários</h2>
                    <span>O atributo final define a base do mínimo; a patente altera mínimo e máximo acumulados; o modificador de valor máximo representa recursos aplicados ao teste.</span>
                </div>
                <button type="button" onClick={adicionarCenario} disabled={cenarios.length >= LIMITES_ANALISE_TESTE_PERICIA.quantidadeCenariosMaxima || patentes.length === 0}>Adicionar cenário</button>
            </header>

            <div className={styles.gradeCenarios}>
                {cenarios.map(cenario => <CardCenarioTestePericiaUdm key={cenario.id} cenario={cenario} patentes={patentes} resultado={resultados.find(resultado => resultado.cenarioId === cenario.id) ?? null} podeRemover={cenarios.length > 1} alterarCenario={alterarCenario} removerCenario={removerCenario} />)}
            </div>
        </section>
    );
};