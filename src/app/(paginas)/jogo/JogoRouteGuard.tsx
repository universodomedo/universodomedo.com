'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Eventos_Emite, LogicaJogoUsuario_EstouEmJogoDto, PAGINAS } from 'types-nora-api';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

type EstadoValidacao = 'carregando' | 'permitido' | 'redirecionando' | 'erro';

function normalizePath(pathname: string) {
    if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
    return pathname;
};

export default function JogoRouteGuard({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [objetoEstouEmJogo, setObjetoEstouEmJogo] = useState<LogicaJogoUsuario_EstouEmJogoDto | undefined>(undefined);
    const [estadoValidacao, setEstadoValidacao] = useState<EstadoValidacao>('carregando');

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirEstouEmJogo, {
        onSuccess: data => {
            setObjetoEstouEmJogo(data.objetoEstouEmJogo);
        },
        onError: () => {
            setEstadoValidacao('erro');
            toast.erro('Houve um erro na sua Página de Jogo');
        },
    });

    useEffect(() => {
        if (!pathname) return;
        if (objetoEstouEmJogo === undefined) return;
        if (estadoValidacao === 'erro') return;

        const currentPath = normalizePath(pathname);
        const emJogoPath = normalizePath(PAGINAS.jogo.emJogo.href);

        const podeAcessarPaginaEmJogo = objetoEstouEmJogo.estouEmJogo && currentPath === emJogoPath;
        const podeAcessarOutraPaginaDeJogo = !objetoEstouEmJogo.estouEmJogo && currentPath !== emJogoPath;

        if (podeAcessarPaginaEmJogo || podeAcessarOutraPaginaDeJogo) {
            setEstadoValidacao('permitido');
            return;
        }

        setEstadoValidacao('redirecionando');

        if (objetoEstouEmJogo.estouEmJogo) {
            router.replace(PAGINAS.jogo.emJogo.href);
            return;
        }

        router.replace(PAGINAS.jogo.jogador.href);
    }, [estadoValidacao, objetoEstouEmJogo, pathname, router]);

    if (estadoValidacao === 'carregando') return <p>Carregando...</p>;
    if (estadoValidacao === 'erro') return <p>Houve um erro ao validar seu acesso ao jogo.</p>;
    if (estadoValidacao === 'redirecionando') return null;

    return <>{children}</>;
};