'use client';

import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type DestinoInput, normalizePath, pathFromHref, resolverHref } from 'Funcionalidades/navegacaoInterna';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { destino: DestinoInput; children: ReactNode };

export default function LinkInterno({ destino, children, onClick, ...rest }: Props) {
    const pathnameAtual = normalizePath(usePathname());
    const href = resolverHref(destino);

    function handleClick(e: MouseEvent<HTMLAnchorElement>) {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (pathFromHref(href) === pathnameAtual) { e.preventDefault(); window.location.assign(href); }
    }

    return <Link href={href} onClick={handleClick} {...rest}>{children}</Link>;
};