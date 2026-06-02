'use client';

import { createContext, useContext, useState } from 'react';
import type { RecursoFichaEmJogo } from 'types-nora-api';

type ContextoPaginaControleRecursosProps = {
    keyRecursoSelecionado: string | null;
    recursoSelecionado: RecursoFichaEmJogo | null;
    selecionaRecurso: (key: string) => void;
    limpaSelecaoRecurso: () => void;
};

const ContextoPaginaControleRecursos = createContext<ContextoPaginaControleRecursosProps | undefined>(undefined);

export const useContextoPaginaControleRecursos = (): ContextoPaginaControleRecursosProps => {
    const context = useContext(ContextoPaginaControleRecursos);
    if (!context) throw new Error('useContextoPaginaControleRecursos precisa estar dentro de um ContextoPaginaControleRecursos');
    return context;
};

export function ContextoPaginaControleRecursosProvider({ children, recursos }: { children: React.ReactNode; recursos: RecursoFichaEmJogo[]; }) {
    const [keyRecursoSelecionadoInterno, setKeyRecursoSelecionadoInterno] = useState<string | null>(null);
    const recursoSelecionado = recursos.find(recurso => recurso.key === keyRecursoSelecionadoInterno) ?? null;
    const keyRecursoSelecionado = recursoSelecionado ? keyRecursoSelecionadoInterno : null;

    function selecionaRecurso(key: string): void {
        setKeyRecursoSelecionadoInterno(key);
    };

    function limpaSelecaoRecurso(): void {
        setKeyRecursoSelecionadoInterno(null);
    };

    return (
        <ContextoPaginaControleRecursos.Provider value={{ keyRecursoSelecionado, recursoSelecionado, selecionaRecurso, limpaSelecaoRecurso }}>
            {children}
        </ContextoPaginaControleRecursos.Provider>
    );
};
