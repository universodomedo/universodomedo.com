import type { SerieGraficoDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/seriesGraficosDistribuicaoTeste';
import styles from './styles.module.css';

export default function LegendaGraficos({ series }: { series: readonly SerieGraficoDistribuicaoTeste[]; }) {
    return (
        <div className={styles.legenda}>
            {series.map(serie => <span key={serie.cenarioId}><i style={{ background: serie.cor }} />{serie.nome}</span>)}
        </div>
    );
};