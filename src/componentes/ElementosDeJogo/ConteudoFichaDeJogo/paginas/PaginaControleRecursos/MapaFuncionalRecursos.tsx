import styles from './MapaFuncionalRecursos.module.css';
import chipStyles from './MapaFuncionalRecursosChips.module.css';

import type { RecursoFichaEmJogo } from 'types-nora-api';

import { useContextoPaginaControleRecursos } from './ContextoPaginaControleRecursos';

type AreaMapaFuncionalRecursos = {
    visualizacaoFuncional: RecursoFichaEmJogo['visualizacaoFuncional'];
    recursos: RecursoFichaEmJogo[];
};

export default function MapaFuncionalRecursos({ recursos }: { recursos: RecursoFichaEmJogo[]; }) {
    const areas = agrupaRecursosPorAreaFuncional(recursos);

    if (areas.length === 0) return null;

    return (
        <section className={styles.mapa_funcional_recursos} aria-label="Mapa funcional dos recursos">
            <h3 className={styles.titulo_mapa_funcional}>Mapa funcional</h3>
            <div className={styles.lista_areas_funcionais}>
                {areas.map(area => <AreaFuncionalRecursos key={area.visualizacaoFuncional.area} area={area} />)}
            </div>
        </section>
    );
};

function AreaFuncionalRecursos({ area }: { area: AreaMapaFuncionalRecursos; }) {
    return (
        <article className={styles.area_funcional} aria-label={area.visualizacaoFuncional.nomeArea}>
            <div className={styles.cabecalho_area_funcional}>
                <span className={styles.icone_area_funcional} aria-hidden={true}>{area.visualizacaoFuncional.iconeTexto}</span>
                <strong className={styles.nome_area_funcional}>{area.visualizacaoFuncional.nomeArea}</strong>
            </div>
            <div className={styles.recursos_area_funcional}>
                {area.recursos.map(recurso => <RecursoMapaFuncional key={recurso.key} recurso={recurso} />)}
            </div>
        </article>
    );
};

function RecursoMapaFuncional({ recurso }: { recurso: RecursoFichaEmJogo; }) {
    const { keyRecursoSelecionado, selecionaRecurso } = useContextoPaginaControleRecursos();
    const recursoSelecionado = keyRecursoSelecionado === recurso.key;

    return (
        <button type="button" className={`${chipStyles.recurso_mapa_funcional} ${obtemClasseEstadoRecurso(recurso.estadoResumo.tipo)} ${recursoSelecionado ? chipStyles.recurso_mapa_selecionado : ''}`} aria-label={`${recurso.nome} - ${recurso.estadoResumo.nome}`} onClick={() => selecionaRecurso(recurso.key)} aria-pressed={recursoSelecionado}>
            <strong className={chipStyles.nome_recurso_mapa}>{recurso.nome}</strong>
            <span className={chipStyles.estado_recurso_mapa}>{recurso.estadoResumo.nome}</span>
        </button>
    );
};

function agrupaRecursosPorAreaFuncional(recursos: RecursoFichaEmJogo[]): AreaMapaFuncionalRecursos[] {
    const areasPorChave = new Map<RecursoFichaEmJogo['visualizacaoFuncional']['area'], AreaMapaFuncionalRecursos>();

    for (const recurso of recursos) {
        const areaExistente = areasPorChave.get(recurso.visualizacaoFuncional.area);

        if (areaExistente) {
            areaExistente.recursos.push(recurso);
            continue;
        };

        areasPorChave.set(recurso.visualizacaoFuncional.area, { visualizacaoFuncional: recurso.visualizacaoFuncional, recursos: [recurso] });
    };

    return [...areasPorChave.values()].sort((areaA, areaB) => {
        const ordem = areaA.visualizacaoFuncional.ordem - areaB.visualizacaoFuncional.ordem;
        if (ordem !== 0) return ordem;
        return areaA.visualizacaoFuncional.nomeArea.localeCompare(areaB.visualizacaoFuncional.nomeArea);
    });
};

function obtemClasseEstadoRecurso(tipoEstado: RecursoFichaEmJogo['estadoResumo']['tipo']): string {
    if (tipoEstado === 'livre') return chipStyles.recurso_livre;
    if (tipoEstado === 'indisponivel') return chipStyles.recurso_indisponivel;
    return chipStyles.recurso_ocupado;
};
