import type { RecursoFichaEmJogo } from 'types-nora-api';

export type RecursosPorDisponibilidadeFicha = {
    disponiveis: RecursoFichaEmJogo[];
    indisponiveis: RecursoFichaEmJogo[];
};

export type GrupoRecursosPorGrupoFuncionalFicha = {
    grupoFuncional: RecursoFichaEmJogo['grupoFuncional'];
    recursos: RecursoFichaEmJogo[];
};

export function agrupaRecursosPorDisponibilidade(recursos: RecursoFichaEmJogo[]): RecursosPorDisponibilidadeFicha {
    return {
        disponiveis: recursos.filter(recurso => recurso.disponivel),
        indisponiveis: recursos.filter(recurso => !recurso.disponivel),
    };
};

export function agrupaRecursosPorGrupoFuncional(recursos: RecursoFichaEmJogo[]): GrupoRecursosPorGrupoFuncionalFicha[] {
    const gruposPorGrupoFuncional = new Map<string, GrupoRecursosPorGrupoFuncionalFicha>();

    for (const recurso of recursos) {
        const grupoExistente = gruposPorGrupoFuncional.get(recurso.grupoFuncional.key);

        if (grupoExistente) {
            grupoExistente.recursos.push(recurso);
            continue;
        };

        gruposPorGrupoFuncional.set(recurso.grupoFuncional.key, { grupoFuncional: recurso.grupoFuncional, recursos: [recurso] });
    };

    return [...gruposPorGrupoFuncional.values()].sort((grupoA, grupoB) => {
        const ordem = grupoA.grupoFuncional.ordem - grupoB.grupoFuncional.ordem;
        if (ordem !== 0) return ordem;
        return grupoA.grupoFuncional.nome.localeCompare(grupoB.grupoFuncional.nome);
    });
};
