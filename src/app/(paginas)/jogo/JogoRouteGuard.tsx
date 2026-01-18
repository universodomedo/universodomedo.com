'use client';

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Eventos_Emite } from "types-nora-api";

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';

const ROTA_JOGO = "/jogo";
const ROTA_EM_JOGO = "/jogo/em-jogo";

function normalizePath(pathname: string) {
    if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
    return pathname;
}

export default function JogoRouteGuard({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [estouEmJogo, setEstouEmJogo] = useState<boolean | null>(null);

    useEmitWsComDisparoInicial(
        Eventos_Emite.Jogo.eventos.emitirEstouEmJogo,
        {
            onSuccess: data => {
                setEstouEmJogo(data.estouEmJogo);
            },
            onError: err => {
                alert('onError');
            }
        }
    );

    useEffect(() => {
        if (!pathname) return;

        const current = normalizePath(pathname);

        if (estouEmJogo) {
            if (current !== ROTA_EM_JOGO) router.replace(ROTA_EM_JOGO);
            return;
        }

        if (current === ROTA_EM_JOGO) router.replace(ROTA_JOGO);
    }, [estouEmJogo, pathname, router]);

    if (estouEmJogo === null) return <p>Carregando...</p>;

    return (
        <>
            {children}
        </>
    );
};