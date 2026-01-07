'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { montarHref, type PaginaDestino } from 'types-nora-api';

type Props = Omit<React.ComponentProps<typeof Link>, 'href'> & { destino: PaginaDestino; children: React.ReactNode };

function normalizePath(p: string) {
    if (!p) return '/';
    if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
    return p;
};

function pathFromHref(href: string) {
    try { return normalizePath(new URL(href, window.location.origin).pathname); } catch { return normalizePath((href.split('?')[0] || '').split('#')[0] || '/'); }
};

export default function LinkInterno({ destino, children, onClick, ...rest }: Props) {
    const pathname = normalizePath(usePathname());
    const params = ('params' in destino ? destino.params : undefined) as unknown as Record<string, unknown> | undefined;
    const href = montarHref(destino.pagina.hrefTemplate, params ?? {});

    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (pathFromHref(href) === pathname) { e.preventDefault(); window.location.assign(href); }
    }

    return <Link href={href} onClick={handleClick} {...rest}>{children}</Link>;
};