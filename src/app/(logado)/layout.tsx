'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LayoutLogado({ children }: { children: React.ReactNode }) {
    console.log('entrando em uma pagina que PRECISA de auth');

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/acessar');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <p>Carregando...</p>;
    }

    if (status === 'authenticated') {
        return <><h1>Oi {session.user!.email}</h1>{children}</>;
    }

    return null;
}