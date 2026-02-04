'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { montarHref, type PaginaDef, type PaginaParams } from 'types-nora-api';

type ParamValue = string | string[] | undefined;
type ParamsRecord = Record<string, ParamValue>;

type RequiredKeys<T extends Record<string, ParamValue>> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

type ParamsProps<P extends PaginaDef<string>> =
    keyof PaginaParams<P> extends never
    ? { params?: never }
    : RequiredKeys<PaginaParams<P>> extends never
    ? { params?: PaginaParams<P> }
    : { params: PaginaParams<P> };

function toParamsRecord(params: object): ParamsRecord {
    const out: ParamsRecord = {};
    for (const k in params as Record<string, ParamValue>) {
        if (!Object.prototype.hasOwnProperty.call(params, k)) continue;
        out[k] = (params as Record<string, ParamValue>)[k];
    }
    return out;
};

export default function RedirecionadorInterno<P extends PaginaDef<string>>({ pagina, params }: { pagina: P } & ParamsProps<P>) {
    const router = useRouter();

    useEffect(() => {
        const href = montarHref(pagina.hrefTemplate, params ? toParamsRecord(params) : {});
        router.push(href);
    }, [router, pagina, params]);

    return null;
};