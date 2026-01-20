'use client';

import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { montarHref, type PaginaDestino, type PaginaFolha } from 'types-nora-api';

type ParamValue = string | string[] | undefined;
type ParamsRecord = Record<string, ParamValue>;

type PaginaSemParamsObrigatorios = PaginaFolha extends infer P ? P extends PaginaFolha ? (P['hrefTemplate'] extends `${string}[${string}` ? never : P) : never : never;

export type DestinoInput = PaginaDestino | PaginaSemParamsObrigatorios;

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { destino: DestinoInput; children: ReactNode };

function normalizePath(p: string) {
    if (!p) return '/';
    if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
    return p;
};

function pathFromHref(href: string) { try { return normalizePath(new URL(href, window.location.origin).pathname); } catch { return normalizePath((href.split('?')[0] || '').split('#')[0] || '/'); } };

function toParamsRecord(params: object): ParamsRecord {
    const out: ParamsRecord = {};
    for (const k in params as Record<string, ParamValue>) {
        if (!Object.prototype.hasOwnProperty.call(params, k)) continue;
        out[k] = (params as Record<string, ParamValue>)[k];
    }
    return out;
};

function isPaginaDestino(destino: DestinoInput): destino is PaginaDestino { return typeof destino === 'object' && destino !== null && 'pagina' in destino; };

function normalizarDestino(destino: DestinoInput): PaginaDestino { return isPaginaDestino(destino) ? destino : ({ pagina: destino } as PaginaDestino) };

export default function LinkInterno({ destino, children, onClick, ...rest }: Props) {
    const pathname = normalizePath(usePathname());
    const destinoNormalizado = normalizarDestino(destino);
    const paramsObj = ('params' in destinoNormalizado && destinoNormalizado.params) ? toParamsRecord(destinoNormalizado.params) : {};
    const href = montarHref(destinoNormalizado.pagina.hrefTemplate, paramsObj);

    function handleClick(e: MouseEvent<HTMLAnchorElement>) {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (pathFromHref(href) === pathname) { e.preventDefault(); window.location.assign(href); }
    }

    return <Link href={href} onClick={handleClick} {...rest}>{children}</Link>;
};