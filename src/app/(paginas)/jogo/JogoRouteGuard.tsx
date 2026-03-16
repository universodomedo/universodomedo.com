'use client';

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Eventos_Emite, LogicaJogoUsuario_EstouEmJogoDto } from "types-nora-api";

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

const ROTA_JOGO = "/jogo";
const ROTA_EM_JOGO = "/jogo/em-jogo";

function normalizePath(pathname: string) {
    if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
    return pathname;
}

export default function JogoRouteGuard({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [objetoEstouEmJogo, setObjetoEstouEmJogo] = useState<LogicaJogoUsuario_EstouEmJogoDto | null>(null);

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirEstouEmJogo, {
        onSuccess: data => {
            setObjetoEstouEmJogo(data.objetoEstouEmJogo);
        },
        onError: err => {
            setObjetoEstouEmJogo(null);
            toast.erro('Houve um erro na sua Página de Jogo');
        },
    });

    useEffect(() => {
        if (!pathname) return;
        if (objetoEstouEmJogo === null) return;

        const current = normalizePath(pathname);

        if (objetoEstouEmJogo.estouEmJogo) {
            if (current !== ROTA_EM_JOGO) router.replace(ROTA_EM_JOGO);
            return;
        }

        if (current === ROTA_EM_JOGO) router.replace(ROTA_JOGO);
    }, [objetoEstouEmJogo, pathname, router]);

    if (objetoEstouEmJogo === null) return <p>Carregando...</p>;

    return (
        <>
            {children}
        </>
    );
};