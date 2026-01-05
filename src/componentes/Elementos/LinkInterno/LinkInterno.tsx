'use client';

import Link from 'next/link';
import { montarHref, type PaginaDestino } from 'types-nora-api';

type Props = Omit<React.ComponentProps<typeof Link>, 'href'> & { destino: PaginaDestino; children: React.ReactNode };

export default function LinkInterno({ destino, children, ...rest }: Props) {
    const params = ('params' in destino ? destino.params : undefined) as unknown as Record<string, unknown> | undefined;
    const href = montarHref(destino.pagina.hrefTemplate, params ?? {});
    return <Link href={href} {...rest}>{children}</Link>;
};