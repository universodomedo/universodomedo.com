import type { ConfiguracaoCenarioDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/simuladorDistribuicaoTeste.tipos';
import { formataNotacaoCenarioDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/formatacaoSimuladorDistribuicaoTeste';
import { LIMITES_SIMULADOR_DISTRIBUICAO_TESTE } from 'Funcionalidades/simuladorDistribuicaoTeste/regrasSimuladorDistribuicaoTeste';
import styles from './styles.module.css';

interface PropsCardCenario {
    readonly cenario: ConfiguracaoCenarioDistribuicaoTeste;
    readonly podeRemover: boolean;
    readonly alterarCenario: (cenarioId: string, alteracoes: Partial<Pick<ConfiguracaoCenarioDistribuicaoTeste, 'nome' | 'quantidadeDados' | 'quantidadeFaces' | 'bonus' | 'cor'>>) => void;
    readonly removerCenario: (cenarioId: string) => void;
};

export default function CardCenario({ cenario, podeRemover, alterarCenario, removerCenario }: PropsCardCenario) {
    return (
        <article className={styles.cardCenario} style={{ '--cor-cenario': cenario.cor } as React.CSSProperties}>
            <header className={styles.cabecalhoCard}>
                <input className={styles.nomeCenario} type="text" value={cenario.nome} maxLength={40} onChange={event => alterarCenario(cenario.id, { nome: event.target.value })} aria-label="Nome do cenário" />
                <div className={styles.resumoRegra}>
                    <strong>{formataNotacaoCenarioDistribuicaoTeste(cenario)}</strong>
                    <small>{descreveRegraCenario(cenario)}</small>
                </div>
            </header>

            <div className={styles.camposCenario}>
                <label>
                    <span>Dado final</span>
                    <select value={cenario.quantidadeDados > 0 ? 'MAIOR' : 'MENOR'} onChange={event => alterarCenario(cenario.id, { quantidadeDados: event.target.value === 'MAIOR' ? Math.abs(cenario.quantidadeDados) : -Math.abs(cenario.quantidadeDados) })}>
                        <option value="MAIOR">Maior</option>
                        <option value="MENOR">Menor</option>
                    </select>
                </label>
                <label>
                    <span>Quantidade N</span>
                    <input type="number" min={1} max={LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeDadosMaxima} step={1} value={Math.abs(cenario.quantidadeDados)} onChange={event => alterarCenario(cenario.id, { quantidadeDados: aplicaSinalQuantidadeDados(cenario.quantidadeDados, limitaInteiro(event.target.valueAsNumber, 1, LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeDadosMaxima, Math.abs(cenario.quantidadeDados))) })} />
                </label>
                <label>
                    <span>Faces</span>
                    <input type="number" min={LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeFacesMinima} max={LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeFacesMaxima} step={1} value={cenario.quantidadeFaces} onChange={event => alterarCenario(cenario.id, { quantidadeFaces: limitaInteiro(event.target.valueAsNumber, LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeFacesMinima, LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeFacesMaxima, cenario.quantidadeFaces) })} />
                </label>
                <label>
                    <span>Bônus</span>
                    <input type="number" step={1} value={cenario.bonus} onChange={event => alterarCenario(cenario.id, { bonus: Number.isSafeInteger(event.target.valueAsNumber) ? event.target.valueAsNumber : cenario.bonus })} />
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

function limitaInteiro(valor: number, minimo: number, maximo: number, atual: number): number {
    if (!Number.isInteger(valor)) return atual;
    return Math.min(maximo, Math.max(minimo, valor));
};

function aplicaSinalQuantidadeDados(quantidadeAtual: number, quantidadeAbsoluta: number): number { return quantidadeAtual > 0 ? quantidadeAbsoluta : -quantidadeAbsoluta; };

function descreveRegraCenario(cenario: ConfiguracaoCenarioDistribuicaoTeste): string {
    const quantidadeLancamentos = cenario.quantidadeDados > 0 ? cenario.quantidadeDados : Math.abs(cenario.quantidadeDados) + 1;
    return `Rola ${quantidadeLancamentos}d${cenario.quantidadeFaces} e pega o ${cenario.quantidadeDados > 0 ? 'maior' : 'menor'}`;
};