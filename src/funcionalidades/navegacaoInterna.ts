'use client';

import { montarHref, type PaginaDestino, type PaginaFolha } from 'types-nora-api';

type ParamValue = string | number | (string | number)[] | undefined;
type ParamsRecord = Record<string, ParamValue>;
type QueryValue = string | number | boolean | (string | number | boolean)[] | undefined;
type QueryRecord = Record<string, QueryValue>;

type PaginaSemParamsObrigatorios = PaginaFolha extends infer P ? P extends PaginaFolha ? (P['hrefTemplate'] extends `${string}[${string}` ? never : P) : never : never;

export type DestinoInput = (PaginaDestino | PaginaSemParamsObrigatorios) & { query?: QueryRecord };

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
        const v = (params as Record<string, ParamValue>)[k];
        out[k] = Array.isArray(v) ? v.map(x => String(x)) : (v === undefined ? undefined : String(v));
    }
    
    return out;
};

function buildQueryString(query?: QueryRecord) {
    if (!query) return '';

    const sp = new URLSearchParams();

    for (const k in query) {
        if (!Object.prototype.hasOwnProperty.call(query, k)) continue;
        const v = query[k];
        if (v === undefined) continue;
        if (Array.isArray(v)) { v.forEach(x => sp.append(k, String(x))); continue; }
        sp.set(k, String(v));
    }

    const qs = sp.toString();
    return qs ? `?${qs}` : '';
};

function isPaginaDestino(destino: DestinoInput): destino is PaginaDestino & { query?: QueryRecord } { return typeof destino === 'object' && destino !== null && 'pagina' in destino; };
function normalizarDestino(destino: DestinoInput): (PaginaDestino & { query?: QueryRecord }) { return isPaginaDestino(destino) ? destino : ({ pagina: destino } as PaginaDestino); };

export function resolverHref(destino: DestinoInput) {
    const destinoNormalizado = normalizarDestino(destino);
    const paramsObj = ('params' in destinoNormalizado && destinoNormalizado.params) ? toParamsRecord(destinoNormalizado.params) : {};
    const base = montarHref(destinoNormalizado.pagina.hrefTemplate, paramsObj);
    return `${base}${buildQueryString(destinoNormalizado.query)}`;
};