'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { montarHref, toParamsRecord, type PaginaDef, type ParamsProps } from 'types-nora-api';

export default function RedirecionadorInterno<P extends PaginaDef<string>>({ pagina, params }: { pagina: P } & ParamsProps<P>) {
    const router = useRouter();

    useEffect(() => {
        const href = montarHref(pagina.hrefTemplate, params ? toParamsRecord(params) : {});
        router.push(href);
    }, [router, pagina, params]);

    return null;
};