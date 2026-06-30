'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redireciona para um href já resolvido (template/rota sem params, ex.: '/acessar', '/').
// Usado pela guarda de acesso runtime, que devolve o destino como string em vez de PaginaFolha.
export default function RedirecionadorHref({ href }: { href: string }) {
    const router = useRouter();

    useEffect(() => { router.push(href); }, [router, href]);

    return null;
};
