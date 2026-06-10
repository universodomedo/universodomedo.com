'use client';

import { useState } from 'react';

// Etapa 8: seleção/navegação — Passo ativo e Bloco selecionado (estado de UI, sem persistir).
export function usePassoSelecionadoTutorial() {
    const [passoAtivoId, setPassoAtivoId] = useState<number | null>(null);
    const [blocoSelecionadoId, setBlocoSelecionadoId] = useState<number | null>(null);

    const selecionaPasso = (id: number): void => { setPassoAtivoId(id); setBlocoSelecionadoId(null); };
    const selecionaBloco = (id: number | null): void => setBlocoSelecionadoId(id);

    return { passoAtivoId, blocoSelecionadoId, setPassoAtivoId, selecionaPasso, selecionaBloco };
};
