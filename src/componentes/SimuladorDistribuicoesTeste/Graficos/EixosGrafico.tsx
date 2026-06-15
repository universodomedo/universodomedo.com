import { formataNumeroDistribuicaoTeste, formataPercentualDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/formatacaoSimuladorDistribuicaoTeste';
import { criaEscalaXGrafico, criaEscalaYGrafico, GRAFICO_ALTURA, GRAFICO_LARGURA, GRAFICO_MARGEM } from './configuracaoGrafico';
import styles from './styles.module.css';

export default function EixosGrafico({ minimo, maximo, maiorProbabilidade }: { minimo: number; maximo: number; maiorProbabilidade: number; }) {
    const escalaX = criaEscalaXGrafico(minimo, maximo);
    const escalaY = criaEscalaYGrafico(maiorProbabilidade);

    return (
        <g className={styles.eixos}>
            {escalaY.ticks(5).map(tick => (
                <g key={`y-${tick}`}>
                    <line x1={GRAFICO_MARGEM.esquerda} x2={GRAFICO_LARGURA - GRAFICO_MARGEM.direita} y1={escalaY(tick)} y2={escalaY(tick)} className={styles.linhaGrade} />
                    <text x={GRAFICO_MARGEM.esquerda - 12} y={escalaY(tick) + 4} textAnchor="end">{formataPercentualDistribuicaoTeste(tick)}</text>
                </g>
            ))}
            {escalaX.ticks(10).map(tick => (
                <g key={`x-${tick}`}>
                    <line x1={escalaX(tick)} x2={escalaX(tick)} y1={GRAFICO_ALTURA - GRAFICO_MARGEM.inferior} y2={GRAFICO_ALTURA - GRAFICO_MARGEM.inferior + 7} />
                    <text x={escalaX(tick)} y={GRAFICO_ALTURA - GRAFICO_MARGEM.inferior + 25} textAnchor="middle">{formataNumeroDistribuicaoTeste(tick)}</text>
                </g>
            ))}
            <line x1={GRAFICO_MARGEM.esquerda} x2={GRAFICO_LARGURA - GRAFICO_MARGEM.direita} y1={GRAFICO_ALTURA - GRAFICO_MARGEM.inferior} y2={GRAFICO_ALTURA - GRAFICO_MARGEM.inferior} />
            <line x1={GRAFICO_MARGEM.esquerda} x2={GRAFICO_MARGEM.esquerda} y1={GRAFICO_MARGEM.topo} y2={GRAFICO_ALTURA - GRAFICO_MARGEM.inferior} />
            <text x={GRAFICO_LARGURA / 2} y={GRAFICO_ALTURA - 12} textAnchor="middle" className={styles.rotuloEixo}>Resultado</text>
        </g>
    );
};