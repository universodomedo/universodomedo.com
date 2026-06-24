'use client';

import { useEffect } from 'react';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import { patchLayoutContextualizado, updateLayoutContextualizado, type LayoutContextualizadoInterno, type LayoutContextualizadoModo } from 'Redux/slices/layoutContextualizadoSlice';

type PatchPayload = Partial<LayoutContextualizadoInterno>;

/**
 * Configura a NAVEGAÇÃO CONTEXTUAL da subpágina (título, subtítulo, fecharProps).
 *
 * AGENTES: antes de usar, leia a skill `navegacao-layout-contextualizado`
 * (.agents/skills/ui/navegacao-layout-contextualizado/SKILL.md). Rode o seletor se em dúvida:
 * `npm run --silent skills:select`.
 * Palavras-chave (seletor de skills): useConfigurarLayoutContextualizado, layout contextualizado,
 * navegação contextual, título, subtítulo, fecharProps, breadcrumb, subpágina.
 *
 * Princípio: o `titulo` fica ESTÁVEL (já vem da PAGINA — não redefinir/duplicar); o `subtitulo` DETALHA
 * o processo e o alvo atual; `fecharProps` mantém a navegação não-travada. Nunca repetir a identidade do
 * alvo no corpo da SPA (tagId, header de nome/fonte) — ela pertence ao subtítulo.
 */
export function useConfigurarLayoutContextualizado(config: LayoutContextualizadoInterno, modo: 'update'): void;
export function useConfigurarLayoutContextualizado(config: PatchPayload, modo?: 'patch'): void;
export function useConfigurarLayoutContextualizado(config: LayoutContextualizadoInterno | PatchPayload, modo: LayoutContextualizadoModo = 'patch'): void {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (modo === 'update') dispatch(updateLayoutContextualizado(config as LayoutContextualizadoInterno));
        else dispatch(patchLayoutContextualizado(config as LayoutContextualizadoInterno));
    }, [dispatch, modo, config]);
};