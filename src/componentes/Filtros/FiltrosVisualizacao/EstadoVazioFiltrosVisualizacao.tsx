'use client';

import styles from './styles.module.css';

import { useContextoFiltrosVisualizacao } from '@/contextos/Contexto__Filtros/contexto';

export default function EstadoVazioFiltrosVisualizacao() {
    const { totalOriginal, totalFiltrado, possuiFiltroAtivo, setFiltros } = useContextoFiltrosVisualizacao<object>();

    if (!possuiFiltroAtivo) return null;
    if (totalOriginal === 0) return null;
    if (totalFiltrado > 0) return null;

    function limpaFiltros() {
        setFiltros([]);
    };

    return (
        <section className={styles.estado_vazio}>
            <strong>Nenhum registro encontrado com os filtros atuais.</strong>
            <span>Os dados foram carregados, mas nenhum item corresponde aos filtros aplicados.</span>
            <button type="button" onClick={limpaFiltros} className={styles.botao_secundario}>Limpar filtros</button>
        </section>
    );
};