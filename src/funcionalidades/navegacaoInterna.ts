'use client';

import { montarHref, type PaginaDestino, type PaginaFolha } from 'types-nora-api';

type ParamValue = string | string[] | undefined;
type ParamsRecord = Record<string, ParamValue>;

type PaginaSemParamsObrigatorios = PaginaFolha extends infer P ? P extends PaginaFolha ? (P['hrefTemplate'] extends `${string}[${string}` ? never : P) : never : never;
export type DestinoInput = PaginaDestino | PaginaSemParamsObrigatorios;

export function normalizePath(p: string) {
    if (!p) return '/';
    if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
    return p;
};

export function pathFromHref(href: string) { try { return normalizePath(new URL(href, window.location.origin).pathname); } catch { return normalizePath((href.split('?')[0] || '').split('#')[0] || '/'); } };

function toParamsRecord(params: object): ParamsRecord {
    const out: ParamsRecord = {};

    for (const k in params as Record<string, ParamValue>) {
        if (!Object.prototype.hasOwnProperty.call(params, k)) continue;
        out[k] = (params as Record<string, ParamValue>)[k];
    }
    
    return out;
};

function isPaginaDestino(destino: DestinoInput): destino is PaginaDestino { return typeof destino === 'object' && destino !== null && 'pagina' in destino; };
function normalizarDestino(destino: DestinoInput): PaginaDestino { return isPaginaDestino(destino) ? destino : ({ pagina: destino } as PaginaDestino); };

export function resolverHref(destino: DestinoInput) {
    const destinoNormalizado = normalizarDestino(destino);
    const paramsObj = ('params' in destinoNormalizado && destinoNormalizado.params) ? toParamsRecord(destinoNormalizado.params) : {};
    return montarHref(destinoNormalizado.pagina.hrefTemplate, paramsObj);
};