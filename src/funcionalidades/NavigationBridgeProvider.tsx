'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { normalizePath, pathFromHref, resolverHref, type DestinoInput } from './navegacaoInterna';
import { registrarRedirecionarInterno, removerRedirecionarInterno } from './redirecionarInterno';

export default function NavigationBridgeProvider() {
    const router = useRouter();
    const pathnameAtual = normalizePath(usePathname());

    const impl = useMemo(() => {
        return (destino: DestinoInput, opcoes?: { replace?: boolean }) => {
            const href = resolverHref(destino);
            if (pathFromHref(href) === pathnameAtual) { window.location.assign(href); return; }
            if (opcoes?.replace) { router.replace(href); return; }
            router.push(href);
        };
    }, [router, pathnameAtual]);

    useEffect(() => {
        registrarRedirecionarInterno(impl);
        return () => removerRedirecionarInterno(impl);
    }, [impl]);

    return null;
};