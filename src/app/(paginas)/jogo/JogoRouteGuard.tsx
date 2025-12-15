"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type JogoRouteGuardProps = { children: ReactNode; estaEmJogo: boolean };

const ROTA_JOGO = "/jogo";
const ROTA_EM_JOGO = "/jogo/em-jogo";

function normalizePath(pathname: string) {
    if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
    return pathname;
}

export default function JogoRouteGuard({ children, estaEmJogo }: JogoRouteGuardProps) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!pathname) return;

        const current = normalizePath(pathname);

        if (estaEmJogo) {
            if (current !== ROTA_EM_JOGO) router.replace(ROTA_EM_JOGO);
            return;
        }

        if (current === ROTA_EM_JOGO) router.replace(ROTA_JOGO);
    }, [estaEmJogo, pathname, router]);

    return (
        <>
            {children}
        </>
    );
};