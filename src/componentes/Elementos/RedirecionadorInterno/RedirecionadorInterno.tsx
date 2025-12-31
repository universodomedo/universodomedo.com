'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { montarHref, type PaginaDef, type PaginaParams } from 'types-nora-api';

type RequiredKeys<T extends Record<string, unknown>> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

type ParamsProps<P extends PaginaDef<string>> =
    keyof PaginaParams<P> extends never
    ? { params?: never }
    : RequiredKeys<PaginaParams<P>> extends never
    ? { params?: PaginaParams<P> }
    : { params: PaginaParams<P> };

export default function RedirecionadorInterno<P extends PaginaDef<string>>({ pagina, params }: { pagina: P } & ParamsProps<P>) {
    const router = useRouter();

    useEffect(() => {
        const href = montarHref(pagina.hrefTemplate, (params ?? {}) as Record<string, unknown>);
        router.push(href);
    }, [router, pagina, params]);

    return null;
};