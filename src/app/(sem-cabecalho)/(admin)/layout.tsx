'use client';

import { ReactNode, useEffect } from "react";

import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';

import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import { verificarPermissao } from "Helpers/verificarPermissao";

export default function LayoutAdmin({ children }: { children: ReactNode }) {
    const { setTamanhoReduzido } = useContextoMenuSwiperEsquerda();

    useEffect(() => {
        setTamanhoReduzido(true);
    }, []);

    const usuarioComPermissao = verificarPermissao();

    if (usuarioComPermissao === null) return null;
    
    if (!usuarioComPermissao) return <Redirecionador urlRedirecionar='/' />;

    return <>{children}</>;
};