'use client';

import type { DestinoInput } from './navegacaoInterna';

type RedirectFn = (destino: DestinoInput, opcoes?: { replace?: boolean }) => void;

let fn: RedirectFn | null = null;

export function registrarRedirecionarInterno(impl: RedirectFn) { fn = impl; };
export function removerRedirecionarInterno(impl: RedirectFn) { if (fn === impl) fn = null; };

export default function redirecionarInterno(destino: DestinoInput, opcoes?: { replace?: boolean }) {
    if (!fn) throw new Error('redirecionarInterno() chamado antes do Provider montar.');
    fn(destino, opcoes);
};