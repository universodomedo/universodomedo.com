import styles from './styles.module.css';

import type { RecursoFichaEmJogo } from 'types-nora-api';

import type { GrupoRecursosPorGrupoFuncionalFicha } from 'Contextos/ContextoFichaDePersonagem/contexto';

type EstadoGeralResumoRecursos = 'sem_recursos' | 'limitado' | 'em_uso' | 'operacional';

type QuantidadesEstadoRecursos = {
    livres: number;
    ocupados: number;
    indisponiveis: number;
};

type ResumoGrupoRecursos = {
    estadoGeral: EstadoGeralResumoRecursos;
    estadoGeralNome: string;
    quantidades: QuantidadesEstadoRecursos;
};

export default function ResumoFuncionalRecursos({ grupos }: { grupos: GrupoRecursosPorGrupoFuncionalFicha[]; }) {
    return (
        <section className={styles.resumo_funcional_recursos} aria-label="Resumo funcional dos recursos">
            <h3 className={styles.titulo_resumo_funcional}>Resumo funcional</h3>
            <div className={styles.lista_resumo_funcional}>
                {grupos.map(grupo => <ResumoGrupoFuncional key={grupo.grupoFuncional.key} grupo={grupo} />)}
            </div>
        </section>
    );
};

function ResumoGrupoFuncional({ grupo }: { grupo: GrupoRecursosPorGrupoFuncionalFicha; }) {
    const resumo = resumeGrupoRecursos(grupo.recursos);

    return (
        <article className={`${styles.card_resumo_funcional} ${obtemClasseEstadoGeral(resumo.estadoGeral)}`}>
            <div className={styles.cabecalho_resumo_funcional}>
                <strong className={styles.nome_grupo_resumo}>{grupo.grupoFuncional.nome}</strong>
                <span className={styles.estado_geral_resumo}>{resumo.estadoGeralNome}</span>
            </div>
            <span className={styles.contadores_resumo}>{formataContadoresResumo(resumo.quantidades)}</span>
        </article>
    );
};

function resumeGrupoRecursos(recursos: RecursoFichaEmJogo[]): ResumoGrupoRecursos {
    const quantidades = contaEstadosRecursos(recursos);
    const estadoGeral = obtemEstadoGeralGrupo(recursos.length, quantidades);

    return { estadoGeral, estadoGeralNome: obtemNomeEstadoGeral(estadoGeral), quantidades };
};

function contaEstadosRecursos(recursos: RecursoFichaEmJogo[]): QuantidadesEstadoRecursos {
    return recursos.reduce<QuantidadesEstadoRecursos>((quantidades, recurso) => {
        if (recurso.estadoResumo.tipo === 'livre') return { ...quantidades, livres: quantidades.livres + 1 };
        if (recurso.estadoResumo.tipo === 'ocupado') return { ...quantidades, ocupados: quantidades.ocupados + 1 };
        return { ...quantidades, indisponiveis: quantidades.indisponiveis + 1 };
    }, { livres: 0, ocupados: 0, indisponiveis: 0 });
};

function obtemEstadoGeralGrupo(totalRecursos: number, quantidades: QuantidadesEstadoRecursos): EstadoGeralResumoRecursos {
    if (totalRecursos === 0) return 'sem_recursos';
    if (quantidades.indisponiveis > 0) return 'limitado';
    if (quantidades.ocupados > 0) return 'em_uso';
    return 'operacional';
};

function obtemNomeEstadoGeral(estadoGeral: EstadoGeralResumoRecursos): string {
    if (estadoGeral === 'sem_recursos') return 'Sem recursos';
    if (estadoGeral === 'limitado') return 'Limitado';
    if (estadoGeral === 'em_uso') return 'Em uso';
    return 'Operacional';
};

function obtemClasseEstadoGeral(estadoGeral: EstadoGeralResumoRecursos): string {
    if (estadoGeral === 'sem_recursos') return styles.estado_sem_recursos;
    if (estadoGeral === 'limitado') return styles.estado_limitado;
    if (estadoGeral === 'em_uso') return styles.estado_em_uso;
    return styles.estado_operacional;
};

function formataContadoresResumo(quantidades: QuantidadesEstadoRecursos): string {
    return `${formataQuantidade(quantidades.livres, 'livre', 'livres')} · ${formataQuantidade(quantidades.ocupados, 'ocupado', 'ocupados')} · ${formataQuantidade(quantidades.indisponiveis, 'indisponível', 'indisponíveis')}`;
};

function formataQuantidade(quantidade: number, singular: string, plural: string): string {
    return `${quantidade} ${quantidade === 1 ? singular : plural}`;
};
